import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const client = neon(process.env.DATABASE_URL!)

// const client = createClient({
//     url: env.DATABASE_URL,
//     auth: env.DATABASE_AUTH_TOKEN
//   fetch: async ( request:Request) => {
//     const decoder = new TextDecoder()
//     let body = "{}"
//     for await (const chunk of request.body.) {
//         body = decoder.decode(chunk)
//     }
//     retur  nodeFetch(request.url, {
//             headers: Object.fromEntries([...request.headers])
//             body
//     })
//   }
// })

export const db = drizzle({
  client,
  casing: "camelCase",
  schema
})
