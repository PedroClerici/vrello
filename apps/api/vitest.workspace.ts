import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      name: "e2e",
      include: ["**/*e2e.{test,spec}.?(c|m)[jt]s?(x)"],
      hookTimeout: 120000, // 2 minutes
      globalSetup: "./tests/setup.ts",
    },
  },
  {
    extends: "./vitest.config.ts",
    test: {
      name: "unit",
      exclude: ["**/*e2e.{test,spec}.?(c|m)[jt]s?(x)"],
    },
  },
]);
