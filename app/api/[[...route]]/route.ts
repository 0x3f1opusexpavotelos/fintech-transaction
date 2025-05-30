import { Hono } from "hono"

import { handle } from "hono/vercel"
import { HTTPException } from "hono/http-exception"

import accounts from "./accounts"
import transactions from "./transactions"
import categories from "./categories"
import summary from "./summary"
import plaid from "./plaid"
import subscriptions from "./subscriptions"

export const runtime = "nodejs"

const app = new Hono().basePath("/api")

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  console.log(err)
  return c.json({ error: "unHandledError" }, 500)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/plaid", plaid)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary)
  .route("/subscriptions", subscriptions)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
