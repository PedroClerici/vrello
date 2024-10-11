import { execSync } from "node:child_process";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

export default async function setup() {
  const postgresContainer = await new PostgreSqlContainer(
    "postgres:alpine",
  ).start();

  process.env.DB_USER = postgresContainer.getUsername();
  process.env.DB_PASSWORD = postgresContainer.getPassword();
  process.env.DB_HOST = postgresContainer.getHost();
  process.env.DB_PORT = postgresContainer.getPort().toString();
  process.env.DB_NAME = postgresContainer.getDatabase();

  execSync("pnpm db:migrate");

  return async () => {
    await postgresContainer.stop();
  };
}
