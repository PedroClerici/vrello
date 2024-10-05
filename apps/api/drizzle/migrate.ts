import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@/utils/env";

const migrationClient = postgres(
  `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  { max: 1 },
);

await migrate(drizzle(migrationClient), {
  migrationsFolder: "drizzle/migrations",
});

await migrationClient.end();
