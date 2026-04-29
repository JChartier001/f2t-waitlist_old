import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next", "tests/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      exclude: [
        "**/_generated/**",
        "**/__test_helpers/**",
        "**/*.types.ts",
        "node_modules/**",
        ".next/**",
        "**/layout.tsx",
        "**/error.tsx",
        "**/loading.tsx",
        "**/not-found.tsx",
        "**/global-error.tsx",
        "next.config.ts",
        "playwright.config.ts",
        "vitest.config.ts",
        "eslint.config.js",
        "postcss.config.mjs",
      ],
    },
  },
});
