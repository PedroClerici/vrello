import path from "node:path";
import { config } from "dotenv";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: ["**/*e2e.{test,spec}.?(c|m)[jt]s?(x)"],
      hookTimeout: 120000, // 2 minutes
      globals: true,
      globalSetup: "./tests/setup.ts",
      name: "e2e",
    },
  },
  {
    test: {
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/*e2e.{test,spec}.?(c|m)[jt]s?(x)",
      ],
      globals: true,
      env: {
        ...config({ path: ".env" }).parsed,
      },
      name: "unit",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
]);
