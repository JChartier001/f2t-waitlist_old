import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

/**
 * Base ESLint flat config for Farm2Table.
 *
 * Encodes the AC #5 dependency-graph guarantee from Story 1.1. The four
 * architectural boundaries below are load-bearing — without them, the
 * one-way dependency graph in `_bmad-output/planning-artifacts/architecture.md`
 * §"Project Structure & Boundaries" is silently empty.
 *
 * Story 1.15 extends this preset with the custom no-barrel rule, hook-import
 * restrictions, naming-convention, and the rest of the canonical wall.
 */
const dependencyGraphRule = {
  "import/no-restricted-paths": [
    "error",
    {
      zones: [
        // 1. packages/backend cannot import from any app
        { target: "./packages/backend", from: "./apps", message: "packages/backend must not import from apps/*" },

        // 2. packages/ui cannot import from packages/backend
        { target: "./packages/ui", from: "./packages/backend", message: "packages/ui must not depend on packages/backend" },

        // 3. packages/rules-engine imports nothing outside its own internals
        { target: "./packages/rules-engine", from: "./apps", message: "packages/rules-engine is self-contained" },
        { target: "./packages/rules-engine", from: "./packages", except: ["./packages/rules-engine"], message: "packages/rules-engine is self-contained" },

        // 4. The three apps cannot import from each other
        { target: "./apps/marketplace", from: ["./apps/vendor", "./apps/admin"], message: "Apps must not import from sibling apps" },
        { target: "./apps/vendor", from: ["./apps/marketplace", "./apps/admin"], message: "Apps must not import from sibling apps" },
        { target: "./apps/admin", from: ["./apps/marketplace", "./apps/vendor"], message: "Apps must not import from sibling apps" },
      ],
    },
  ],
};

const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: importPlugin },
    rules: {
      ...dependencyGraphRule,
      // Hardened in Story 1.15:
      // "@typescript-eslint/no-explicit-any": "error",
      // "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      // "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/_generated/**",
    ],
  },
];

export default baseConfig;
