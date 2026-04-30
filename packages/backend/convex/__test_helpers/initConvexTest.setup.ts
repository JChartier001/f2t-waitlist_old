/// <reference types="vite/client" />
/**
 * Basename includes an extra dot so Convex bundler skips this file as a deploy
 * entry point (see convex bundler "multiple dots" rule). Import only from Vitest.
 */
import { convexTest } from "convex-test";
import rateLimiterTest from "@convex-dev/rate-limiter/test";
import schema from "../schema";

/**
 * Recursive glob over all of `convex/` so future top-level files AND nested
 * directories (e.g., `convex/products/queries.ts`, `convex/audit/index.ts` once
 * Story 1.3+ lands) are picked up automatically. The filter below excludes
 * test/helper paths so adding a new module never requires touching this file.
 */
const moduleGlobs = {
  ...import.meta.glob("../_generated/**/*.js"),
  ...import.meta.glob("../**/*.ts"),
} as Record<string, () => Promise<unknown>>;

const modules = Object.fromEntries(
  Object.entries(moduleGlobs).filter(
    ([path]) =>
      !path.includes("/__tests__/") &&
      !path.includes("/__test_helpers/") &&
      !path.endsWith(".test.ts") &&
      !path.endsWith(".test.tsx"),
  ),
);

export function initConvexTest() {
  const t = convexTest(schema, modules);
  rateLimiterTest.register(t);
  return t;
}
