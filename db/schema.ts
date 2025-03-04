import { pgTable, text, varchar } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 256 }).notNull(),
  userId: text("user_id").notNull(),
  layidId: text("layid_id")
});

export const accountInsertSchema = createInsertSchema(accounts);
