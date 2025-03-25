import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { Hono } from "hono"

import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products
} from "plaid"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"
import { db } from "@/db/drizzle"
import { and, eq, isNotNull } from "drizzle-orm"
import { accounts, categories, connectedBanks, transactions } from "@/db/schema"
import { CategoryColumn } from "@/app/(dashboard)/transactions/category-column"
import { convertAmountToMiliunits } from "@/lib/utils"
import { useNetworkState } from "react-use"

const configuration = new Configuration({
  basePath: process.env.PLAID_ENV!,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14"
    }
  }
})

const client = new PlaidApi(configuration)

const app = new Hono()
  .get("/connected-banks", clerkMiddleware(), async (c) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const connectedBank = await db
      .select()
      .from(connectedBanks)
      .where(eq(connectedBanks.userId, auth.userId))

    return c.json({ data: connectedBank || null }, 200)
  })
  .delete("/connected-banks", clerkMiddleware(), async (c) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const deleteConnectedBankId = await db
      .delete(connectedBanks)
      .where(eq(connectedBanks.userId, auth.userId))
      .returning({
        id: connectedBanks.id
      })

    if (!deleteConnectedBankId.length) {
      return c.json({ error: "Not found" }, 404)
    }

    await db
      .delete(accounts)
      .where(and(eq(accounts.userId, auth.userId), isNotNull(accounts.plaidId)))

    await db
      .delete(categories)
      .where(
        and(eq(categories.userId, auth.userId), isNotNull(categories.plaidId))
      )

    return c.json({ data: deleteConnectedBankId }, 200)
  })
  .post("/create-link-token", clerkMiddleware(), async (c) => {
    const auth = getAuth(c)
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: auth.userId
      },
      client_name: "FinTech transaction sass",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en"
    }

    const token = await client.linkTokenCreate(request)
    return c.json({ data: token.data.link_token }, 200)
  })
  .post(
    "/exchange-public-token",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        publicToken: z.string()
      })
    ),
    async (c) => {
      const auth = getAuth(c)
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const { publicToken } = c.req.valid("json")
      const exchange = await client.itemPublicTokenExchange({
        public_token: publicToken
      })

      const [connectedBank] = await db
        .insert(connectedBanks)
        .values({
          id: createId(),
          userId: auth.userId,
          accessToken: exchange.data.access_token
        })
        .returning()

      // use exchange accesToken w/ publicToken(auth code, ticket) to access transacton Endpoint

      const plaidTransactions = await client.transactionsSync({
        access_token: connectedBank.accessToken
      })
      const pliadAccounts = await client.accountsGet({
        access_token: connectedBank.accessToken
      })
      const plaidCategories = await client.categoriesGet({})

      const newAccounts = await db
        .insert(accounts)
        .values(
          pliadAccounts.data.accounts.map((account) => ({
            id: createId(),
            name: account.name,
            plaidId: account.account_id,
            userId: auth.userId
          }))
        )
        .returning()

      const newCategories = await db
        .insert(categories)
        .values(
          plaidCategories.data.categories.map((category) => ({
            id: createId(),
            name: category.hierarchy.join(", "),
            plaidId: category.category_id,
            userId: auth.userId
          }))
        )
        .returning()

      const newTransactionsValues = plaidTransactions.data.added.reduce(
        (acc, transaction) => {
          const account = newAccounts.find(
            (account) => account.plaidId === transaction.account_id
          )

          const cateogry = newCategories.find(
            (category) => category.plaidId === transaction.category_id
          )
          // perspective of cash flow and accounting reports not balancing
          // positive value when money move out the account,
          // negative value when money move in
          //  accounting, banking APIs, or cash flow statements,
          const amountInMiliunits = convertAmountToMiliunits(transaction.amount)

          if (account) {
            acc.push({
              id: createId(),
              amount: amountInMiliunits,
              payee: transaction.merchant_name || transaction.name,
              notes: transaction.name,
              date: new Date(transaction.date),
              accountId: account.id,
              categoryId: cateogry?.id
            })
          }
          return acc
        },
        [] as (typeof transactions.$inferInsert)[]
      )

      if (newTransactionsValues.length > 0) {
        await db.insert(transactions).values(newTransactionsValues)
      }

      return c.json({ ok: true }, 200)
    }
  )

export default app
