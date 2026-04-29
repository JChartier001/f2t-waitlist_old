import baseConfig from "./base.js";

/**
 * Convex backend ESLint preset. Inherits the dependency-graph rule from base.
 * Story 1.15 will add the convex-test import restriction (only allowed in
 * __test_helpers/initConvexTest.ts) and Convex-specific naming rules.
 */
const convexConfig = [
  ...baseConfig,
  {
    files: ["convex/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./convex/tsconfig.json",
      },
    },
  },
];

export default convexConfig;
