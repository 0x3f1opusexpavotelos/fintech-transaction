import { Hono } from "hono"

import { zValidator } from "@hono/zod-validator"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { z } from "zod"
import { parse, differenceInDays, subDays } from "date-fns"

import { sql, sum, eq, and, lte, gte, desc } from "drizzle-orm"
import { accounts, categories, transactions } from "@/db/schema"
import { db } from "@/db/drizzle"
import { caclPercentChange, fillMissingDays } from "@/lib/utils"

// user own many accounts, account own many transactons
export async function fetchFinicalData(
  userId: string,
  accountId: string | undefined,
  startDate: Date,
  endDate: Date
) {
  return await db
    .select({
      income:
        sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      expenses:
        sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      remaining: sum(transactions.amount).mapWith(Number)
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, userId),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    )
}

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional()
    })
  ),
  async (c) => {
    const auth = getAuth(c)
    // error first handler
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    // retrive query param and assemble data
    const { from, to, accountId } = c.req.valid("query")

    // since last perio comparatision
    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom

    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

    const period = differenceInDays(endDate, startDate)

    const lastPeriodStart = subDays(startDate, period)
    const lastPeriodEnd = subDays(endDate, period)

    const [currentPeriod] = await fetchFinicalData(
      auth.userId,
      accountId,
      startDate,
      endDate
    )
    const [lastPeriod] = await fetchFinicalData(
      auth.userId,
      accountId,
      lastPeriodStart,
      lastPeriodEnd
    )

    const incomeChange = caclPercentChange(
      currentPeriod.income,
      lastPeriod.income
    )
    const expensesChange = caclPercentChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    )
    const remaingChange = caclPercentChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    )

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number)
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`))

    const topCategories = category.slice(0, 3)

    const otherCategories = category.slice(3)
    const otherSum = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0
    )
    const finalCategories = topCategories

    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "other",
        value: otherSum
      })
    }

    // console.log({
    //   currentPeriod,
    //   lastPeriod
    // })

    // 当日的多笔交易聚合
    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          )
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date)

    const days = fillMissingDays(activeDays, startDate, endDate)

    return c.json({
      data: {
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        remaingAmount: currentPeriod.remaining,
        remaingChange,
        categories: finalCategories,
        // activeDays,
        days
      }
    })
  }
)

export default app
