import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    globals: true,
    include: ["convex/**/*.test.ts"],
    exclude: ["node_modules", "convex/_generated"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      include: ["convex/**/*.ts"],
      exclude: [
        "convex/_generated/**",
        "convex/__test_helpers/**",
        "convex/_test_helpers/**",
        "**/*.types.ts",
        "node_modules/**",
        "vitest.config.ts",
      ],
    },
  },
});
