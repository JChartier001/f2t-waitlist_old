import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      // Narrow include while Story 1.5's hook-wrapper layer is still stubbed; expand
      // to `src/**/*.{ts,tsx}` (with per-file ignores) when Story 1.5 ships the rich
      // useQuery / useMutation wrappers. Adding new src files here without tests will
      // be silently uncounted until then — Story 1.5 is the moment to revisit.
      include: ["src/providers.tsx", "src/app-providers.tsx"],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.types.ts",
        "**/__test_helpers/**",
      ],
    },
  },
});
