// import { config } from "dotenv";

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"

// config({ path: ".env.local " });
enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArgument = 9
}
const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" })
  } catch (error) {
    errorHandler("Error during migration", error as Error)
  }
}

function errorHandler(phase: string, error: Error) {
  let message = error?.message ?? String(error)
  if (process.env.DEBUG || process.env.NODE_ENV === "development") {
    message = error.stack || message
  }
  console.error(message)
  process.exit(ExitCode.FatalError)
}

main()
