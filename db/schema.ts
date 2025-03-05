import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

import { createInsertSchema } from "drizzle-zod"
import { createId } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { z } from "zod"

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 256 }).notNull(),
  userId: text("user_id").notNull(),
  layidId: text("layid_id")
})

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull()
})

export const insertCategorySchema = createInsertSchema(categories)

export const transactions = pgTable("transactions", {
  id: text().primaryKey(),
  amount: integer().notNull(),
  payee: text("").notNull(),
  date: timestamp("data", { mode: "date" }).notNull(),
  notes: text(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id, {
      onDelete: "cascade"
    }),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null"
  })
})

export const transactionsRelation = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id]
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id]
  })
}))

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date()
})
