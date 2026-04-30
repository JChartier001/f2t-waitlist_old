/**
 * Ensures Convex auth config has sane defaults during Vitest runs.
 * `convex codegen` does not load this file; environment-config for codegen lives in
 * the developer's shell / `.env.local`, not here.
 *
 * `??=` would treat an empty string as "set" — `.env.test` files that contain
 * `CLERK_PLATFORM_ORG_ID=` (no value) would leave the var as `""`, causing all
 * platform-admin tests to fail closed with confusing forbidden errors. Treat
 * empty/whitespace-only values as unset.
 *
 * @see packages/backend/convex/auth.config.ts
 */
function ensureEnvDefault(key: string, fallback: string): void {
  const current = process.env[key];
  if (current === undefined || current.trim() === "") {
    process.env[key] = fallback;
  }
}

ensureEnvDefault("CLERK_JWT_ISSUER_DOMAIN", "https://clerk.example.com");
ensureEnvDefault("CLERK_PLATFORM_ORG_ID", "org_test_platform");
