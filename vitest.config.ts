import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: [
        "scripts/**/*.ts",
        "lib/**/*.ts",
        "utils/**/*.ts",
        "store/**/*.ts",
        "app/api/**/*.ts",
        "components/**/*.tsx",
        "auth.ts",
      ],
      exclude: [
        "lib/prisma.ts",
        "**/*.d.ts",
        "node_modules/**",
        "tests/**",
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
