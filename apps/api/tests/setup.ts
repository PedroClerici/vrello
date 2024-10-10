import { GenericContainer, Network } from "testcontainers";
import type { GlobalSetupContext } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    apiUrl: string;
  }
}

export default async function setup({ provide }: GlobalSetupContext) {
  const environment = {
    NODE_ENV: "test",
    PORT: "3000",
    ADDRESS: "0.0.0.0",
    SALT_ROUNDS: "10",

    DB_HOST: "test_postgres",
    DB_USER: "postgres",
    DB_PASSWORD: "postgres",
    DB_NAME: "test",
    DB_PORT: "5432",
  };

  const apiContainerBuild = await GenericContainer.fromDockerfile(
    "@/../",
    "Dockerfile.development",
  ).build();

  const network = await new Network().start();
  const postgresContainer = await new GenericContainer("postgres:alpine")
    .withName("test_postgres")
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: environment.DB_USER,
      POSTGRES_PASSWORD: environment.DB_PASSWORD,
      POSTGRES_DB: environment.DB_NAME,
    })
    .withNetworkMode(network.getName())
    .start();

  const apiContainer = await apiContainerBuild
    .withExposedPorts(3000)
    .withEnvironment(environment)
    .withNetworkMode(network.getName())
    .start();

  provide(
    "apiUrl",
    `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(3000)}`,
  );

  return async () => {
    await apiContainer.stop();
    await postgresContainer.stop();
    await network.stop();
  };
}
