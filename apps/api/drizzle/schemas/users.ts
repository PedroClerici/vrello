import { sql, type InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export type User = InferSelectModel<typeof users>;
