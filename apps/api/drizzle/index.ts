import { env } from "@/utils/env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "drizzle/schemas";
import postgres from "postgres";

const queryClient = postgres(
  `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
);

export const db = drizzle(queryClient, {
  schema,
  logger: env.NODE_ENV !== "production",
});

export type Database = typeof db;
