import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    name: "plusnetwork",
    clearMocks: true,
    watch: false,
    environment: "node",
    include: [
      "./src/**/?(*.)+(unit|int|e2e|spec|test).(ts|js)",
      "./tests/**/?(*.)+(unit|int|e2e|spec|test).(ts|js)",
    ],
    sequence: {
      hooks: "list",
    },
    env: {
      NODE_ENV: "test",
    },
    coverage: {
      reportsDirectory: "./coverage",
      include: ["<rootDir>/src/**/*.ts"],
      exclude: ["./node_modules", "./src/types", "./src/index.ts"],
    },
    reporters: ["default"],
  },
});
