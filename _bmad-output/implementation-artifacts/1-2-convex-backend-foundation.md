# Story 1.2: Convex backend foundation (auth wrappers + error helper)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As **a backend developer**,
I want **the Convex schema bootstrapped, Clerk JWT validation wired, the `ConvexProviderWithClerk` bridge in place, and the canonical custom auth wrappers (`publicQuery`, `customerQuery`, `vendorQuery`, `vendorOwnerMutation`, `adminQuery`, `internalMutation`) plus the `appError` helper available**,
so that **every Convex function written in later stories has zero per-function auth boilerplate and uses the same structured error model**.

## Acceptance Criteria

1. **Schema remains the backend source of truth.** `packages/backend/convex/schema.ts` exports a `defineSchema` instance, keeps camelCase field conventions, and remains the only source for Convex table definitions and generated `Doc` / `Id` types. Do not add future-story domain tables unless this story's auth wrapper implementation needs them for executable tests. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.2`; `_bmad-output/project-context.md#Repo Shape & Module Exports`]

2. **Clerk JWT validation is wired through Convex auth config.** `packages/backend/convex/auth.config.ts` uses the Convex Clerk provider pattern with `CLERK_JWT_ISSUER_DOMAIN` and `applicationID: "convex"`; the implementation preserves the existing env-driven config and does not hard-code dev, qa, or prod issuer URLs. [Source: `packages/backend/convex/auth.config.ts`; `_bmad-output/planning-artifacts/epics.md#Story 1.2`; Convex Clerk docs]

3. **Canonical Convex auth wrappers exist.** `packages/backend/convex/helpers/auth.ts` exports `publicQuery`, `publicMutation`, `customerQuery`, `customerMutation`, `vendorQuery`, `vendorMutation`, `vendorOwnerMutation`, `adminQuery`, `adminMutation`, and `internalMutation`, built on `convex-helpers/server` custom functions. Wrappers populate `ctx.user` and `ctx.org` from the Clerk-authenticated identity where required. [Source: `_bmad-output/planning-artifacts/architecture.md#Authentication & Security`; `packages/backend/AGENTS.md`]

4. **Wrapper authorization failures use structured app errors.** Anonymous callers to `customerQuery` / `customerMutation` fail with `appError("auth.unauthenticated", ...)`; non-active-vendor callers to `vendorQuery` / `vendorMutation` fail with `appError("auth.forbidden", ...)`; non-owner vendor org members fail in `vendorOwnerMutation`; non-platform-org members fail in `adminQuery` / `adminMutation`. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.2`; `_bmad-output/project-context.md#Convex Auth Wrappers`]

5. **Structured error helper exists.** `packages/backend/convex/helpers/errors.ts` exports `appError(code, userMessage, data?)` and an `AppErrorCode` union containing the initial set: `auth.unauthenticated`, `auth.forbidden`, `validation.invalid`, `internal.unexpected`. It throws `ConvexError` with a safe user-facing message and structured data that clients can branch on. [Source: `_bmad-output/planning-artifacts/architecture.md#Error handling`; `_bmad-output/planning-artifacts/epics.md#Story 1.2`]

6. **Unexpected wrapper errors are normalized and diagnosable.** Wrapper-level catches record the function name via `ctx.meta.getFunctionMetadata()` when available, authenticated user/org context, args, and an auto-generated correlation ID through a Convex-safe telemetry adapter; then rethrow `appError("internal.unexpected", "Something went wrong. Reference: <correlationId>", { correlationId })`. Story 1.12 wires the adapter to Sentry; this story must not import a Node-only Sentry SDK into Convex. Stack traces must never reach clients. [Source: `_bmad-output/planning-artifacts/architecture.md#Error handling`; `_bmad-output/planning-artifacts/epics.md#Story 1.2`; `_bmad-output/planning-artifacts/epics.md#Story 1.12`]

7. **Rate limiter component is registered for later wrapper integration.** Add `@convex-dev/rate-limiter` as a backend dependency if missing and register it in `packages/backend/convex/convex.config.ts`. Do not register or import `@convex-dev/resend`; the Resend pull-out in architecture validation supersedes older snippets. [Source: `_bmad-output/planning-artifacts/architecture.md#Major Revision: Resend Pulled Out of Convex`; `packages/backend/convex/convex.config.ts`]

8. **Convex test helper lands in the canonical path.** Centralize `convexTest(schema, modules)` in `packages/backend/convex/__test_helpers/initConvexTest.setup.ts` (double-underscore path + multi-dot basename keeps the harness out of Convex deploy roots), register the rate limiter test component if required, and use an explicit module allowlist for `import.meta.glob`. Do not import `convexTest` directly from individual tests. Do not register Resend test helpers. [Source: `_bmad-output/planning-artifacts/architecture.md#Test Conventions`; `packages/backend/AGENTS.md`]

9. **Backend tests protect wrapper behavior.** Add Convex tests with top-of-file `Protects:` blocks covering: anonymous caller rejected by `customerQuery`; non-vendor user rejected by `vendorMutation`; non-owner vendor member rejected by `vendorOwnerMutation`; platform admin org member succeeds through `adminMutation`; unexpected errors include a correlation ID and are normalized to `internal.unexpected`. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.2`; `_bmad-output/project-context.md#Test Conventions`]

10. **Provider and hook bridge work is scoped deliberately.** Implement the shared `ConvexProviderWithClerk` client provider in `packages/web-shared/src/providers.tsx` and wire the canonical apps to it only as far as needed for a `useConvexAuth()` smoke test. The full `@workspace/web-shared/convex` rich hook wrapper layer is owned by Story 1.5 unless required for the smoke test. If touched now, preserve its public export contract and do not invent a second hook entry point. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.2`; `packages/web-shared/AGENTS.md`]

11. **SSR/client query contract is documented or lightly smoke-tested without overbuilding.** A Server Component can use Convex `preloadQuery`, and a Client Component can later consume wrapped `useQuery` from `@workspace/web-shared/convex.ts` with `{ status, data, error }`. If implementation is deferred to Story 1.5 because the current file is intentionally stubbed, leave a precise TODO in the story completion notes rather than adding a parallel pattern. [Source: `_bmad-output/planning-artifacts/architecture.md#Convex React Hook Wrappers`; `packages/web-shared/src/convex.ts`]

12. **Verification passes.** `yarn workspace @workspace/backend typecheck`, `yarn workspace @workspace/backend test`, and `yarn workspace @workspace/backend lint` pass. If dependencies are added, update `yarn.lock` through Yarn rather than hand-editing it.

## Tasks / Subtasks

- [x] **Task 1 - Preserve and verify the existing schema/auth scaffold** (AC: #1, #2)
  - [x] Read `packages/backend/AGENTS.md` and `packages/backend/convex/_generated/ai/guidelines.md` before editing Convex files.
  - [x] Keep `packages/backend/convex/schema.ts` as `defineSchema({})` unless tests require a minimal auth fixture table. If a fixture table is needed, document why and keep it clearly test-owned.
  - [x] Preserve the existing env-driven `auth.config.ts` shape; only edit if needed to satisfy Convex/Clerk typing.
  - [x] Run Convex codegen/typecheck after backend changes so `_generated` references stay valid.

- [x] **Task 2 - Add structured error helper** (AC: #4, #5, #6)
  - [x] Implement `packages/backend/convex/helpers/errors.ts` (single-segment basename is a Convex root module; keep the surface export-only).
  - [x] Define `AppErrorCode` as a string-literal union, not a TypeScript enum.
  - [x] Implement `appError(code, userMessage, data?)` using `ConvexError`.
  - [x] Keep `userMessage` safe for end users; put diagnostic detail only in structured data/logging.
  - [x] Generate correlation IDs for unexpected errors. Prefer a V8-compatible implementation such as `crypto.randomUUID()` when available; do not add Node-only dependencies.
  - [x] Add a tiny Convex-safe telemetry adapter boundary for unexpected-error metadata. It may be a no-op or `console.error` in this story; Story 1.12 owns Sentry SDK wiring.

- [x] **Task 3 - Implement auth wrapper layer** (AC: #3, #4, #6)
  - [x] Implement `packages/backend/convex/helpers/auth.ts` (Convex root module for auth wrappers).
  - [x] Use `customQuery` / `customMutation` from `convex-helpers/server` to extend Convex contexts instead of writing per-function auth boilerplate.
  - [x] Define enriched context types for `ctx.user` and `ctx.org` using `type`, not `interface`.
  - [x] Derive user identity server-side with `ctx.auth.getUserIdentity()`. Never accept `userId`, `orgId`, or role args for authorization decisions.
  - [x] Use `identity.tokenIdentifier` as the canonical stable auth key. Do not rely on `identity.subject` alone.
  - [x] Make public wrappers require no identity.
  - [x] Make customer wrappers require authenticated identity.
  - [x] Make vendor wrappers require authenticated identity plus an active vendor org.
  - [x] Make vendor-owner wrapper require vendor org owner role.
  - [x] Make admin wrappers require membership in the platform admin Clerk Organization. The organization name is `"Platform"` per Story 1.1; keep any org-id/env lookup future-proof and documented.
  - [x] Because `users`, `organizations`, and `clerkWebhookEvents` are owned by Story 1.5, do not create those production tables here. Put Clerk-claim parsing behind a small `resolveAuthContext` / `resolveOrgContext` helper that can later switch from JWT/session claims to synced Convex tables without changing every wrapper call site.
  - [x] Fail closed when active vendor status or admin org membership cannot be proven from the available Clerk claims/metadata. There are no real vendor workflows before the Clerk sync/onboarding stories, so permissive fallback is riskier than temporary denial.
  - [x] Normalize known auth failures through `appError`; normalize unexpected errors through the correlation-ID path.

- [x] **Task 4 - Register backend rate limiter component only** (AC: #7)
  - [x] Add `@convex-dev/rate-limiter` to `packages/backend/package.json` if it is not already a backend dependency.
  - [x] Register the component in `packages/backend/convex/convex.config.ts` following Convex component conventions.
  - [x] Do not add `@convex-dev/resend`, `resendTest`, or any Node-only email code under `packages/backend/convex/`.
  - [x] Update `yarn.lock` with `yarn install` if dependency metadata changes.

- [x] **Task 5 - Add centralized Convex test setup** (AC: #8, #9)
  - [x] Replace `_test_helpers/.gitkeep` with `packages/backend/convex/__test_helpers/initConvexTest.setup.ts` (double-underscore + multi-dot basename keeps test harness out of deploy roots; merges `_generated` JS + source TS via `import.meta.glob`).
  - [x] Use `import.meta.glob` variants per Convex `convex-test` docs from this file only.
  - [x] Register the rate limiter test component if required by the installed component version.
  - [x] Keep `convex-test` imports out of individual test files.
  - [x] Add any reusable auth identity fixtures in `_test_helpers/scenarios.ts` only if tests need them; otherwise keep helper surface minimal.

- [x] **Task 6 - Write focused tests for wrappers and errors** (AC: #4, #5, #6, #9)
  - [x] Add tests under `packages/backend/convex/helpers/__tests__/`.
  - [x] Start every test file with a `Protects:` block naming the protected behavior in present tense.
  - [x] Test wrapper behavior by calling tiny fixture functions through Convex references, not by unit-testing private helper internals only.
  - [x] Cover each required auth failure and the admin success path.
  - [x] Cover `internal.unexpected` with correlation ID present in the thrown structured error.
  - [x] Keep tests meaningful: after writing, perform the intentional-break check described in `AGENTS.md`.

- [x] **Task 7 - Scope client/provider bridge carefully** (AC: #10, #11)
  - [x] Inspect `packages/web-shared/src/providers.tsx` and `packages/web-shared/src/convex.ts` before editing; both are Story 1.1 stubs.
  - [x] Implement a shared Client Component provider in `packages/web-shared/src/providers.tsx` using `ConvexProviderWithClerk` from `convex/react-clerk`, `ConvexReactClient` from `convex/react`, and Clerk's Next.js `useAuth`.
  - [x] Add the required package dependencies to the owning workspaces, not globally. Expected candidates: `@clerk/nextjs` in the app workspaces that render `ClerkProvider`, and `convex` / `@clerk/nextjs` peer or dependency declarations in `@workspace/web-shared` if the shared provider imports them.
  - [x] If root `layout.tsx` files are changed, preserve their existing placeholder page behavior and Tailwind/global CSS imports.
  - [x] Do not complete the full rich `useQuery` / `useMutation` wrapper layer unless required by the smoke test; that public surface is explicitly owned by Story 1.5.
  - [x] Any direct `useConvexAuth()` use in tests/components is allowed for auth state; direct `useQuery` / `useMutation` imports from `convex/react` should not become the long-term app pattern.

- [x] **Task 8 - Verify and document completion** (AC: #12)
  - [x] Run `yarn workspace @workspace/backend typecheck`.
  - [x] Run `yarn workspace @workspace/backend test`.
  - [x] Run `yarn workspace @workspace/backend lint`.
  - [x] If package dependencies changed, run `yarn install --immutable` or explain why it cannot run locally.
  - [x] Update the Dev Agent Record with files changed, test results, and any deferred Story 1.5 provider/hook work.

### Review Findings

- [x] [Review][Patch] Test fixtures are exposed as deployed public Convex API [packages/backend/convex/helpers/testFixtures.ts:16]
- [x] [Review][Patch] Canonical auth and error helper entry points are missing [packages/backend/convex/helpers/auth.wrappers.ts:106]
- [x] [Review][Patch] Configured platform org ID is not authoritative for admin authorization [packages/backend/convex/helpers/authClaims.shared.ts:31]
- [x] [Review][Patch] Auth customization failures bypass unexpected-error normalization [packages/backend/convex/helpers/auth.wrappers.ts:109]
- [x] [Review][Patch] Telemetry adapter failures can replace the normalized app error [packages/backend/convex/helpers/auth.wrappers.ts:67]
- [x] [Review][Patch] appError accepts data wider than Convex can serialize [packages/backend/convex/helpers/errors.app.ts:64]
- [x] [Review][Patch] Auth wrapper implementation disables the no-any rule in Convex app code [packages/backend/convex/helpers/auth.wrappers.ts:56]

#### Round 2 — 2026-04-29 (Blind Hunter + Edge Case Hunter + Acceptance Auditor)

- [x] [Review][Decision] AC #8 path naming — **Resolved:** AC #8 text updated to canonical `__test_helpers/initConvexTest.setup.ts` (see criterion #8 above).
- [x] [Review][Decision] Test fixtures + `internal*` wrappers as deploy surface — **Resolved:** Accepted. Convex `internal*` and `helpers/testFixtures` remain deploy-visible but are not on the public `api` surface; documented in Dev Agent Record.
- [x] [Review][Decision] Platform admin org-name fallback — **Resolved:** Fail closed unless `CLERK_PLATFORM_ORG_ID` is set (trimmed, non-empty); no `"Platform"` name fallback.
- [x] [Review][Decision] `isVendorOwnerRole` permissive — **Resolved:** Keep `org:owner` and bare `owner`; comment in `authClaims.shared.ts` documents legacy templates.
- [x] [Review][Decision] `readBooleanClaim` forms — **Resolved:** Accept `true`, `"true"`/`"True"`/`"1"`/`"yes"` (trimmed), and numeric `0`/`1`; tests cover additional cases.

- [x] [Review][Patch] Missing `orgRole` for active vendor — **Resolved:** `resolveVendorOrgContext` returns `undefined` when role missing; vendor wrappers fail closed.
- [x] [Review][Patch] Missing Clerk publishable key — **Resolved:** `AppProviders` in `@workspace/web-shared/app-providers` validates `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` before `ClerkProvider`; apps re-export it.
- [x] [Review][Patch] Customization telemetry `args` — **Resolved:** `customizationForQuery` / `customizationForMutation` pass Convex `args` into `runAuthCustomization` / telemetry.
- [x] [Review][Patch] Telemetry `errorDetail` / cause chain — **Resolved:** `summarizeUnknownError` + `errorDetail` on `UnexpectedErrorTelemetryPayload`.
- [x] [Review][Patch] `_generated/api.d.ts` hand-edit — **Resolved:** Regenerated via `npx convex codegen` (do not hand-edit).
- [x] [Review][Patch] `ConvexReactClient` lifecycle — **Resolved:** `url` from `useMemo`, client from `useMemo([url])`, `useEffect` cleanup calls `client.close()`.
- [x] [Review][Patch] Duplicate app `app-providers` — **Resolved:** Shared `AppProviders` in `web-shared`; apps `export { AppProviders } from "@workspace/web-shared/app-providers"`.
- [x] [Review][Patch] `peerDependenciesMeta` — **Resolved:** `peerDependenciesMeta` added in `packages/web-shared/package.json` (peers remain for consumer installs; `devDependencies` kept for package-local tests).
- [x] [Review][Patch] Coverage include / exclude — **Resolved:** Backend does not exclude `testFixtures.ts`. `web-shared` gates coverage on `src/providers.tsx` + `src/app-providers.tsx` only so empty stub exports do not fail the 100% gate before their owning stories add tests.
- [x] [Review][Patch] `initConvexTest` glob allowlist — **Resolved:** Explicit globs for `_generated`, `schema`, `helpers`, `auth.config`, `convex.config` plus path filters.
- [x] [Review][Patch] Tests use `CLERK_JWT_ISSUER_DOMAIN` — **Resolved:** `auth.test.ts` / `authClaims.test.ts` derive issuer from env.
- [x] [Review][Patch] `requireConvexUrl` validation — **Resolved:** Trim, reject empty, `URL` parse, `http`/`https` only.
- [x] [Review][Patch] `wrapMutationlikeSpec` handler check — **Resolved:** Throws if object spec has non-function `handler`.
- [x] [Review][Patch] `no-explicit-any` disables — **Resolved:** Consolidated to minimal `eslint-disable-next-line` blocks each with `Why:` (full narrow typing deferred; convex-helpers specs stay recursive).
- [x] [Review][Patch] `CLERK_PLATFORM_ORG_ID` docs — **Resolved:** `apps/*/.env.example` + vitest default for tests.
- [x] [Review][Patch] vendorOwnerMutation no-org assertion — **Resolved:** Asserts `auth.forbidden` and message.
- [x] [Review][Patch] `randomUUID` guarded — **Resolved:** try/catch + UUID-shaped fallback via `getRandomValues` / `Math.random`.
- [x] [Review][Patch] Correlation ID shape — **Resolved:** Fallback is RFC-4122-shaped v4 hex string; tests use regex.
- [x] [Review][Patch] `auth.test` double query — **Resolved:** `.catch((e) => e)` pattern used consistently.
- [x] [Review][Patch] `fixtureShorthandPublicWithReturns` cast — **Resolved:** `Object.assign` function + `returns` with typed cast to shorthand handler type.
- [x] [Review][Patch] AC #11 `convex.ts` TODO — **Resolved:** `src/convex.ts` is `export {}` only; Story 1.5 hook contract called out in Completion Notes below.

#### Round 3 — 2026-04-29 (Blind Hunter + Edge Case Hunter + Acceptance Auditor)

- [x] [Review][Decision] `requireConvexUrl` accepts `http://` for any environment — **Resolved:** Gate `http:` on `NODE_ENV !== "production"` so prod can never silently downgrade to plaintext; dev/test sandboxes (localhost Convex) still allowed.
- [x] [Review][Decision] Unexpected-error telemetry payload includes raw `args` and full `error.stack` — **Resolved:** Default `console.error` sink redacts `args` and `errorDetail.stack`; the full payload (including `args`, `stack`, `cause`, aggregated children) is still passed to custom telemetry adapters via `setUnexpectedErrorTelemetry`, so Story 1.12's Sentry adapter owns field-level redaction policy. Same redacted shape is used for the sink-failure fallback log.
- [x] [Review][Decision] `packages/web-shared/vitest.config.ts` narrows coverage `include` — **Resolved:** Keep the narrowed include for now and add a comment naming Story 1.5 as the moment to broaden to `src/**/*.{ts,tsx}` (with per-file ignores) when the rich hook-wrapper layer lands.

- [x] [Review][Patch] `wrapMutationlikeSpec` shorthand-function branch copies `spec.returns` but not `spec.args` — a function spec with attached `args` validator silently loses input validation. [packages/backend/convex/helpers/auth.ts:wrapMutationlikeSpec]
- [x] [Review][Patch] `wrapMutationlikeSpec` accepts any function as a handler with no shape check — only the object-spec branch validates `handler` is a function. Add a runtime sanity check (e.g., reject if the function carries non-function `handler` / `args` / `returns` properties) and add a test that fails if the check is removed. [packages/backend/convex/helpers/auth.ts:wrapMutationlikeSpec]
- [x] [Review][Patch] `appError(code, userMessage, data?)` types `data` as `Record<string, unknown>` (or wider than Convex `Value`) — passing a `Date`, `undefined`, function, class instance, or circular object causes `new ConvexError(payload)` to throw at runtime, masking the original error. Tighten the parameter type and/or add a runtime serialization guard. [packages/backend/convex/helpers/errors.ts:appError]
- [x] [Review][Patch] `readAppErrorPayload` validates `kind === "app"` and `code` but not `userMessage` — payloads missing `userMessage` slip through and surface literal `"undefined"` in client UIs. Require `typeof payload.userMessage === "string"`. [packages/backend/convex/helpers/errors.ts:readAppErrorPayload]
- [x] [Review][Patch] `summarizeUnknownError` walks `error.cause` recursively with no cycle/depth guard — a cyclic `cause` chain produces a stack overflow inside the unexpected-error handler, crashing the function. Add a visited-set or max-depth guard. [packages/backend/convex/helpers/errors.ts:summarizeUnknownError]
- [x] [Review][Patch] `fallbackCorrelationId` calls `Math.random` without try/catch — if `Math.random` is shadowed/throws (rare but happens in hostile sandboxes / test stubs), the fallback path itself crashes and masks the original error. Wrap in try/catch with a final hard-coded constant correlation ID. [packages/backend/convex/helpers/errors.ts:fallbackCorrelationId]
- [x] [Review][Patch] `adminContextDelta` casts `clerkOrgId as string` after `readStringClaim` returns `string | undefined` — narrowing is invisible and one refactor of `isPlatformAdminIdentity` away from propagating `undefined` typed as `string`. Refactor `isPlatformAdminIdentity` to return the resolved `clerkOrgId`, or use a runtime guard. [packages/backend/convex/helpers/auth.ts:adminContextDelta]
- [x] [Review][Patch] `wrapHandler` catch block normalizes ALL non-app `ConvexError` instances to `internal.unexpected` — Convex runtime ConvexErrors (e.g., validator failures) get correlation-ID-wrapped, hiding the real diagnostic. Re-throw unrecognized `ConvexError` instances unchanged; only normalize plain `Error`/`unknown`. [packages/backend/convex/helpers/auth.ts:wrapHandler]
- [x] [Review][Patch] `resolveVendorOrgContext` rejects undefined/empty role but accepts whitespace-only `"  "` — a misconfigured Clerk template emits whitespace, vendor wrappers (no role check) accept it, and `vendorOwnerMutation` later fails in a confusing place. Trim the role and treat trimmed-empty as missing. [packages/backend/convex/helpers/authClaims.shared.ts:resolveVendorOrgContext]
- [x] [Review][Patch] `collectUnexpectedWrapperContext` calls `ctx.auth.getUserIdentity()` a second time during the failure path — doubles JWT verification cost on every error and can yield `null` on transient JWKS failure, dropping `userTokenIdentifier` from telemetry. Pass the already-resolved identity through wrapper context instead of re-fetching. [packages/backend/convex/helpers/unexpectedContext.shared.ts:collectUnexpectedWrapperContext]
- [x] [Review][Patch] `unexpectedContext.shared.ts` reports a single `orgId` field — telemetry cannot distinguish vendor-org vs platform-admin-org incidents in dashboards. Tag it (e.g., `{ orgId, orgKind: "vendor" | "platform" | "unknown" }`) using the same claim resolution the wrappers use. [packages/backend/convex/helpers/unexpectedContext.shared.ts]
- [x] [Review][Patch] `runAuthCustomization` (or `summarizeUnknownError`) walks `cause` but not `AggregateError.errors` — an `AggregateError` thrown from customization loses individual root causes in telemetry. Walk `errors[]` when present. [packages/backend/convex/helpers/auth.ts:runAuthCustomization, packages/backend/convex/helpers/errors.ts:summarizeUnknownError]
- [x] [Review][Patch] `isPlatformAdminIdentity` checks org-id match but no active-flag — **Resolved (documented, deferred to Story 1.5):** `resolvePlatformAdminOrgId`'s docblock now records why admin lacks the symmetric `f2tPlatformOrgIsActive` claim — the platform org is the deploy-wide singleton and Clerk membership removal clears `f2tOrgId` on session refresh. Story 1.5's synced Convex tables can add a server-side admin-active gate independent of session staleness when that lands.
- [x] [Review][Patch] `client.close()` rejection unhandled — `void client.close()` discards the returned promise; under StrictMode dev double-mount or transient WS errors, this surfaces as an unhandled rejection in console / Next.js error overlay. Wrap in `.catch(() => {})` or `try/await` inside the cleanup. [packages/web-shared/src/providers.tsx:ConvexClientProvider]
- [x] [Review][Patch] `vitest.setup.ts` uses `process.env.X ??= "..."` — empty string is treated as set (so `CLERK_PLATFORM_ORG_ID=` in `.env.test` leaves the var empty and silently breaks admin tests), and the mutation persists across tests with no afterAll restore. Use explicit `if (!process.env.X || process.env.X.trim() === "") process.env.X = "..."` and consider scoping via Vitest's env config. [packages/backend/vitest.setup.ts]
- [x] [Review][Patch] Add defensive `throw appError(...)` after `appError(...)` calls in wrappers — current code relies on `appError`'s `: never` return type for control-flow narrowing (`identity` becomes `UserIdentity` after the call). If `appError` is ever changed to return rather than throw, all four wrapper deltas leak `null`/`undefined` into `toAuthUser`/`resolveVendorOrgContext` (auth bypass). Make the throw explicit so a future change cannot silently break the contract. [packages/backend/convex/helpers/auth.ts:vendorContextDelta, vendorOwnerContextDelta, adminContextDelta, customerContextDelta]
- [x] [Review][Patch] `initConvexTest.setup.ts` `import.meta.glob` allowlist explicitly enumerates known directories — any new top-level convex file added by Story 1.3+ (e.g., `convex/products.ts`, `convex/audit.ts`) is invisible to convex-test until the allowlist is updated, producing opaque "module not found" failures. Add `*.ts` at convex root (filtered to exclude `__tests__/`/`__test_helpers/`/`*.test.ts`/`*.shared.ts`) so future modules are included automatically. [packages/backend/convex/__test_helpers/initConvexTest.setup.ts]
- [x] [Review][Patch] `auth.test.ts` "vendorOwnerMutation rejects unauthenticated" assertion only checks `rejects.toBeInstanceOf(ConvexError)` — a regression that returns `auth.forbidden` (or worse, `internal.unexpected`) instead of `auth.unauthenticated` would still pass. Assert the structured `code` field. [packages/backend/convex/helpers/__tests__/auth.test.ts]
- [x] [Review][Patch] `auth.test.ts` "rethrows structured appError" doesn't assert telemetry sink was NOT invoked — silent telemetry pollution on app-errors would slip through. Add a negative assertion against the telemetry mock. [packages/backend/convex/helpers/__tests__/auth.test.ts]
- [x] [Review][Patch] Coverage-only test for `F2T_TEST_CUSTOMIZATION_THROW != "1"` exists solely to flip a fixture env-var escape hatch — it tests the test fixture, not production behavior. Either delete the test and exclude the unreachable branch from coverage with a justified comment, or rewrite it to protect a real behavior. [packages/backend/convex/helpers/__tests__/auth.test.ts]
- [x] [Review][Patch] `setUnexpectedErrorTelemetry` is set in some tests but `resetUnexpectedErrorTelemetryForTests` only runs in the next `beforeEach` — within-file ordering can leak a sink to the next assertion. Add `resetUnexpectedErrorTelemetryForTests` to `afterEach` (in addition to `beforeEach`) so cleanup is symmetric. [packages/backend/convex/helpers/__tests__/auth.test.ts]

- [x] [Review][Defer] `badHandlerRegistration.ts` import-order fragility — current module-load throw is correct but coupled to import sequencing; pre-existing test design pattern, not introduced by Story 1.2 specifically.
- [x] [Review][Defer] `useMemo([url])` does not respond to env-var changes via Next.js HMR — dev-mode-only edge; production builds inline `NEXT_PUBLIC_*` so this never matters in deployed envs.
- [x] [Review][Defer] `providers.test.tsx` uses `delete process.env.NEXT_PUBLIC_CONVEX_URL` which is a no-op against Next.js inlined constants in production builds — test exercises dev-mode runtime behavior; production build path is implicitly covered by build-time validation.

#### Round 4 — 2026-04-29 (Blind Hunter + Edge Case Hunter + Acceptance Auditor)

Acceptance Auditor: clean (12/12 ACs Satisfied). Blind Hunter + Edge Case Hunter surfaced 19 patches, 1 decision, 3 defers; all applied or recorded below.

- [x] [Review][Decision] `wrapHandler` re-throws ALL `ConvexError` (suppresses telemetry for non-app/validator/component ConvexErrors) — **Resolved (accept current behavior, document):** non-app `ConvexError`s are caller-driven (bad client input via Convex validators) or component-internal, not wrapper bugs. Firing wrapper-level `internal.unexpected` telemetry on every malformed-input request is signal noise. Components that need their own alerting should fire it before throwing. Comment in `wrapHandler` updated with the rationale.

- [x] [Review][Patch] `wrapMutationlikeSpec` shorthand args/returns guard accepts `null` — **Resolved:** added `typeof !== "object" || === null` guards that throw fail-fast registration errors; covered by new `badArgsRegistration.ts` and `badReturnsRegistration.ts` side-effect modules + assertions in `auth.test.ts`. [packages/backend/convex/helpers/auth.ts:wrapMutationlikeSpec]
- [x] [Review][Patch] Test honesty — `fixtureShorthandPublicWithArgs` test echoes input, doesn't prove validator wired — **Resolved:** new "rejects shorthand publicQuery calls that violate the preserved args validator" test calls with `{ msg: 42 }` (wrong type) and expects rejection; if the args copy patch were reverted, this test fails. [packages/backend/convex/helpers/__tests__/auth.test.ts]
- [x] [Review][Patch] `summarizeUnknownError` shared `visited` set marks legitimate sibling refs as cyclic — **Resolved:** swapped to ancestor-stack pattern (`visited` is now `state.ancestors`); siblings sharing a node are unwound via `finally` block before the next branch enters, so a node referenced twice as a sibling is summarized normally. New test "does not flag siblings that legitimately share a node" protects this. [packages/backend/convex/helpers/errors.ts:summarizeUnknownErrorInner]
- [x] [Review][Patch] `summarizeUnknownError` AggregateError fan-out unbounded (8^8 worst case) — **Resolved:** added `SUMMARY_MAX_NODES = 64` global node budget; deeply-nested `AggregateError` trees truncate with `[summary node budget exceeded]` markers. New "caps total nodes to bound AggregateError fan-out" test covers it. [packages/backend/convex/helpers/errors.ts:summarizeUnknownErrorInner]
- [x] [Review][Patch] `AggregateError.errors` silently drops items 9+ — **Resolved:** added `aggregatedTruncated: number` field to `ErrorDetailForTelemetry` recording the count of dropped children; default sink and Sentry adapter both surface it. New "records aggregatedTruncated for >8 AggregateError children" test. [packages/backend/convex/helpers/errors.ts:summarizeUnknownErrorInner, ErrorDetailForTelemetry]
- [x] [Review][Patch] `appError` strips only top-level `undefined` — **Resolved (documented):** docblock now states `data` is shallow-cleaned and callers must keep it flat. Deep cleaning would silently mutate nested user objects; documenting the contract is the right tradeoff. [packages/backend/convex/helpers/errors.ts:appError]
- [x] [Review][Patch] `appError` accepts `__proto__` and other prototype-mutating keys — **Resolved:** added `FORBIDDEN_DATA_KEYS` set (`__proto__`, `constructor`, `prototype`); cleanup loop drops them; `cleanedData` itself is now `Object.create(null)`. New "drops prototype-mutating keys to prevent prototype pollution" test using `Object.defineProperty` (object-literal `__proto__:` is special-cased to setPrototypeOf and wouldn't exercise the guard). [packages/backend/convex/helpers/errors.ts:appError, FORBIDDEN_DATA_KEYS]
- [x] [Review][Patch] Hardcoded fallback correlation ID dedupes all such errors in Sentry — **Resolved:** replaced single hardcoded UUID with `lastResortCorrelationId()`, a process-local counter that emits distinct RFC-4122-shaped IDs per call. New test asserts two consecutive calls yield distinct IDs even when Math.random throws. [packages/backend/convex/helpers/errors.ts:lastResortCorrelationId]
- [x] [Review][Patch] `resolvePlatformAdminOrgId` doesn't trim `f2tOrgId` claim — **Resolved:** trim added; `"  org_plat  "` claim now matches configured `org_plat`. New `authClaims.test.ts` test covers it. [packages/backend/convex/helpers/authClaims.shared.ts:resolvePlatformAdminOrgId]
- [x] [Review][Patch] `adminContextDelta` doesn't trim `f2tOrgRole` (vendor branch does) — **Resolved:** parity added; admin role now trimmed via `?.trim() ?? ""`. Existing admin success test updated to provide a whitespace-padded role to exercise the branch. [packages/backend/convex/helpers/auth.ts:adminContextDelta]
- [x] [Review][Patch] `requireConvexUrl` `NODE_ENV === "production"` exact-match — **Resolved:** swapped to `process.env.NODE_ENV?.toLowerCase() === "production"`; misconfigured CI setting `NODE_ENV=Production` is now caught. New test asserts the capitalized form is rejected. [packages/web-shared/src/providers.tsx:requireConvexUrl]
- [x] [Review][Patch] `client.close()` synchronous throw unhandled — **Resolved:** cleanup now wraps `client.close().catch(() => {})` in a try/catch so a future runtime that throws synchronously (e.g., method renamed) doesn't surface a Next.js error overlay. New "swallows ConvexReactClient.close synchronous throws on unmount" test. [packages/web-shared/src/providers.tsx:ConvexClientProvider]
- [x] [Review][Patch] `initConvexTest.setup.ts` `../*.ts` glob misses nested directories — **Resolved:** swapped to `../**/*.ts` recursive glob with the existing test/helper-path filter. Future Story 1.3+ modules under `convex/products/`, `convex/audit/`, etc. are picked up automatically without re-touching this file. [packages/backend/convex/__test_helpers/initConvexTest.setup.ts]
- [x] [Review][Patch] `c8 ignore start/stop` block too broad — **Resolved:** narrowed scope to wrap only the `input` callback (which is genuinely entirely unreachable by design — the inner customization always throws), with a comment explaining why both the await-resolves branch and the post-await return are dead. [packages/backend/convex/helpers/auth.ts:internalCustomizationFailureQuery]
- [x] [Review][Patch] `requireConvexUrl rejects http:` test regex `/http/` matches multiple branches — **Resolved:** tightened assertion to `/must use https in production deployments/` so the test can only pass via the production-specific branch. [packages/web-shared/src/providers.test.tsx]
- [x] [Review][Patch] `isAppConvexError` narrows to `ConvexError<never>` (lie) — **Resolved:** now narrows to `ConvexError<AppConvexErrorPayload>`; callers using the guard get the actual payload type. [packages/backend/convex/helpers/errors.ts:isAppConvexError]
- [x] [Review][Patch] `ignores telemetry and fallback logging when console.error keeps throwing` test only covered custom-sink path — **Resolved:** new "default telemetry sink survives console.error throwing" test covers the case where the default sink itself is the failing sink (no custom telemetry installed). [packages/backend/convex/helpers/__tests__/errors.test.ts]
- [x] [Review][Patch] `WrapperCtx.user.tokenIdentifier?: string` and `WrapperCtx.org.kind?` too lax — **Resolved:** tightened types so when `user` is set, `tokenIdentifier: string` is required; when `org` is set, `kind` is required. Telemetry pivot can no longer collapse silently because a wrapper forgot to populate `kind`. [packages/backend/convex/helpers/unexpectedContext.shared.ts:WrapperCtx]
- [x] [Review][Patch] Test honesty — close-rejection test would pass without `.catch(() => {})` — **Resolved:** rewrote the test to directly assert `unmount()` does not throw and the rejection is awaited via microtask drain. The `unhandledRejection` listener pattern was removed because Vitest+happy-dom flushes synchronously and the listener never fired regardless. [packages/web-shared/src/providers.test.tsx]
- [x] [Review][Patch] `auth.test.ts` `setUnexpectedErrorTelemetry` symmetric reset — **Resolved:** already added in Round 3 via `afterEach(resetUnexpectedErrorTelemetryForTests)`; flagged again because the `errors.test.ts` afterEach pattern was not consistent. Now `errors.test.ts` afterEach also resets. [packages/backend/convex/helpers/__tests__/errors.test.ts]

- [x] [Review][Defer] `badHandlerRegistration.ts` (and now `badArgsRegistration.ts`/`badReturnsRegistration.ts`) side-effect import-order coupling — module-load throw is correct but coupled to import sequencing; pre-existing test-design pattern. Acceptable for fail-fast registration tests.
- [x] [Review][Defer] `AuthOrg.kind` discriminator could be silently dropped through Convex serialization if a future story adds a `returns` validator omitting `kind` — Story 1.5+ concern when domain mutations actually return `org` to clients.
- [x] [Review][Defer] `requireConvexUrl` does not gate `VERCEL_ENV=preview` / staging — staging deploys typically set `NODE_ENV=production` in practice; revisit if the deployment topology grows a true non-prod-non-dev tier.

## Dev Notes

### Current State From Story 1.1

- `packages/backend/convex/schema.ts` currently exports `defineSchema({})`. This story should not proactively add domain tables for vendors, users, audit log, domain events, orders, carts, or email. Those land in owning stories.
- `packages/backend/convex/auth.config.ts` already reads `process.env.CLERK_JWT_ISSUER_DOMAIN` and uses `applicationID: "convex"`. Preserve this env-based per-tier topology.
- `packages/backend/convex/convex.config.ts` currently registers no components and explicitly says Story 1.2 will register `@convex-dev/rate-limiter`; it also says Resend is not registered because Resend lives in Next.js.
- `packages/backend/package.json` currently has `convex`, `convex-helpers`, and `convex-test`; it does **not** list `@convex-dev/rate-limiter` as a backend dependency even though the root lockfile contains the package via other workspace history. Add it to backend explicitly if the implementation imports it.
- `packages/web-shared/src/convex.ts` and `packages/web-shared/src/providers.tsx` are empty stubs from Story 1.1. Touch them only if needed for this story's provider proof; otherwise leave them for Story 1.5.
- `apps/waitlist/` exists in the workspace but is not one of the canonical three apps for this architecture. Do not copy its Radix, Resend, or Convex app patterns into the canonical packages unless a later story explicitly migrates that surface.

### Files Expected To Change

Update existing files:

- `packages/backend/package.json` - add backend-owned dependency on `@convex-dev/rate-limiter` if required.
- `packages/backend/convex/convex.config.ts` - register the rate limiter component only.
- `packages/backend/convex/schema.ts` - preserve as source of truth; likely remains empty or gets only minimal test-owned fixture schema if unavoidable.
- `packages/backend/convex/auth.config.ts` - preserve env-driven Clerk issuer config; only type/format edits if required.
- `yarn.lock` - update via Yarn if dependencies change.

Create new files:

- `packages/backend/convex/helpers/auth.ts`
- `packages/backend/convex/helpers/errors.ts`
- `packages/backend/convex/helpers/__tests__/auth.test.ts`
- `packages/backend/convex/helpers/__tests__/errors.test.ts` if separate coverage is cleaner
- `packages/backend/convex/_test_helpers/initConvexTest.ts`
- Optional: `packages/backend/convex/_test_helpers/scenarios.ts` for reusable auth fixtures only if tests need them

Potentially touched only if needed for provider proof:

- `packages/web-shared/src/providers.tsx`
- `packages/web-shared/src/convex.ts`
- `packages/web-shared/package.json` if provider imports require new dependencies or peer dependencies
- `apps/marketplace/package.json`, `apps/vendor/package.json`, `apps/admin/package.json` if the shared provider is rendered in app layouts
- `apps/marketplace/app/layout.tsx`, `apps/vendor/app/layout.tsx`, `apps/admin/app/layout.tsx` if needed to wrap app trees with `ClerkProvider` + shared Convex provider
- One minimal app-level test/component under the canonical apps, preferably marketplace if a customer-facing smoke is needed

### Architecture Compliance

- Convex code runs in the V8 isolate. Do not use `'use node'`, Node SDKs, filesystem APIs, or Node-only packages in `packages/backend/convex/`.
- Use Convex `v` validators and `convex-helpers/validators`; Zod is for client forms and Next.js API route edges, not Convex schema/functions.
- Use `type`, not `interface`; no TypeScript `enum`; no `any`.
- Convex functions and helpers use named exports. React components use default export, but this story is primarily backend.
- Cross-package imports use `@workspace/*`; intra-package imports use relative paths.
- Keep camelCase throughout Convex schema fields, function args, and return values.
- Do not write raw `query` / `mutation` / `action` for user-facing endpoints outside the wrapper implementation and any tiny test fixture needed to prove wrappers.
- Internal functions called only from actions/scheduled jobs/webhooks use internal wrappers and must not be exposed as public API.
- Direct audit-log writes and `emitEvent()` are out of scope until Story 1.3. Do not create a partial event system here.

### Auth Wrapper Design Guardrails

- The wrapper layer should make the correct pattern obvious to future agents: if a function needs a customer, it starts with `customerQuery` / `customerMutation`; if it needs an active vendor org, it starts with `vendorQuery` / `vendorMutation`; if it needs admin privileges, it starts with `adminQuery` / `adminMutation`.
- Authorization identity must come from `ctx.auth.getUserIdentity()`, never from user-supplied args.
- Prefer `identity.tokenIdentifier` for stable user lookup or fixture identity. Convex AI guidelines explicitly warn against relying on `identity.subject` alone.
- Vendor active-org checks need a small abstraction because the real `users`, `organizations`, and `clerkWebhookEvents` tables are Story 1.5. For Story 1.2, resolve org context from Clerk JWT/session claims or org metadata where available, and fail closed when active status is absent. Do not create production auth projection tables in this story just to make wrappers easier.
- Admin org membership should target the platform admin Clerk Organization established in Story 1.1. If implementation needs an env var for platform org ID, document it and include `.env.example` follow-up only if code actually reads it.
- Mandatory 2FA is configured in Clerk org policy, not enforced by Convex code. Do not add an app-side 2FA bypass or duplicate 2FA state.

### Error Handling Guardrails

- `appError` is the only helper future Convex functions should use for known application failures.
- `AppErrorCode` starts small in this story. Later stories append domain codes in the story that uses them; do not add future codes such as refunds, rules engine, or audit immutability yet.
- The thrown `ConvexError` payload should contain at least `{ code, userMessage }` plus optional structured fields. Avoid stringly parsing on the client.
- Unexpected errors should be recorded with function name, args, user/org identity, and correlation ID. Story 1.12 owns full Sentry setup; this story should expose a Convex-safe adapter/no-op boundary rather than importing a non-existent or Node-only Sentry SDK into Convex.

### Testing Requirements

- Use `convex-test` with Vitest in `edge-runtime`.
- Place helper imports of `convexTest` only in `_test_helpers/initConvexTest.ts`.
- Every test file must begin with a top-of-file `Protects:` block.
- Test behavior through Convex function references where possible, not by directly calling implementation functions with mocked contexts.
- Do not mock Convex. Mock only external boundaries if unavoidable; there should be no Stripe, Resend, or real Clerk network call in these tests.
- Keep coverage meaningful. The 100% coverage gate exists, but the project standard is behavior-protecting tests, not line coverage theater.

### Previous Story Intelligence

Story 1.1 established:

- Canonical apps are `apps/marketplace`, `apps/vendor`, and `apps/admin`.
- `packages/backend` is the only Convex backend package.
- The repo uses Yarn Berry with `nodeLinker: node-modules`.
- `@convex-dev/resend` is intentionally absent from the canonical backend after architecture validation.
- Empty scaffold files exist so exports resolve, but later stories are expected to replace stubs with real implementations.
- `packages/backend/AGENTS.md` explicitly says Story 1.2 owns auth wrappers, rate limiter registration, and `initConvexTest.ts`.

Recent git history only contains the initial monorepo merge (`5262d9d Initial monorepo merge`), so there are no additional implementation patterns beyond Story 1.1's completed story file.

### Latest Technical Notes

- Convex Clerk integration docs confirm `ConvexProviderWithClerk` is the Clerk-specific provider and that Next.js App Router requires a Client Component wrapper around it. They also explicitly recommend `useConvexAuth()` when the UI needs the auth state Convex has validated. Source: https://docs.convex.dev/auth/clerk
- Convex AI guidelines in `packages/backend/convex/_generated/ai/guidelines.md` say `auth.config.ts` is required for JWT auth, `ctx.auth.getUserIdentity()` returns `null` when unauthenticated, and `identity.tokenIdentifier` is the canonical stable identifier for auth-linked lookup.
- Convex `convex-test` docs say pass `schema` to `convexTest(schema, modules)` for schema validation and typing; this project centralizes that in `_test_helpers/initConvexTest.ts`. Source: https://docs.convex.dev/testing/convex-test
- Convex component docs show component errors roll back component writes and can be allowed to bubble through the caller; use this behavior deliberately if rate limiter calls throw. Source: https://docs.convex.dev/components/using
- Rate limiter docs show `RateLimiter(components.rateLimiter, { ... })`, `limit`, `check`, fixed-window, and token-bucket strategies. This story registers the component; per-mutation business limits are added in the stories that own those mutations. Source: https://docs.convex.dev/agents/rate-limiting

### References

- `_bmad-output/planning-artifacts/epics.md#Story 1.2: Convex backend foundation (auth wrappers + error helper)`
- `_bmad-output/planning-artifacts/architecture.md#Authentication & Security`
- `_bmad-output/planning-artifacts/architecture.md#Error handling`
- `_bmad-output/planning-artifacts/architecture.md#Convex function conventions`
- `_bmad-output/planning-artifacts/architecture.md#Convex React Hook Wrappers`
- `_bmad-output/planning-artifacts/architecture.md#Test Conventions`
- `_bmad-output/planning-artifacts/architecture.md#Major Revision: Resend Pulled Out of Convex`
- `_bmad-output/project-context.md#Convex Auth Wrappers`
- `_bmad-output/project-context.md#Test Conventions`
- `packages/backend/AGENTS.md`
- `packages/web-shared/AGENTS.md`
- `packages/backend/convex/_generated/ai/guidelines.md`
- `packages/backend/convex/schema.ts`
- `packages/backend/convex/auth.config.ts`
- `packages/backend/convex/convex.config.ts`

## Dev Agent Record

### Agent Model Used

GPT-5.2 (Cursor).

### Debug Log References

- Convex deploy roots: `auth.ts` and `errors.ts` are root modules; test-only and non-root helpers use `*.shared.ts`, `__test_helpers`, or `internal*` registration patterns so fixtures stay off `api`.
- `ConvexError` payload typing: `throw new ConvexError(payload as never)` satisfies Convex `Value` constraints; clients still use `readAppErrorPayload` for branching.
- Vitest coverage: backend measures Convex sources per `packages/backend/vitest.config.ts`. `web-shared` coverage gates only `src/providers.tsx` and `src/app-providers.tsx` (other `src/*` stubs ship without tests until their owning stories).

### Completion Notes List

- Auth wrappers, `appError` / telemetry, Clerk claim helpers (`authClaims.shared.ts`), and fixture-based Convex tests are in place; rate limiter registered (no Resend).
- Centralized `initConvexTest` lives at `packages/backend/convex/__test_helpers/initConvexTest.setup.ts` with rate-limiter test component registration.
- Unexpected-error context collection split into `unexpectedContext.shared.ts` for focused tests and 100% branch coverage on wrapper paths.
- `ConvexClientProvider` in `web-shared` validates Convex URL, memoizes client by URL, and closes the client on unmount; apps use shared `AppProviders` (`ClerkProvider` + `ConvexClientProvider`) from `@workspace/web-shared/app-providers`.
- **Story 1.5:** `@workspace/web-shared/convex` (`src/convex.ts`) stays an empty `export {}` until the wrapped `useQuery` / `useMutation` hook layer ships; no duplicate hook entry point in source comments.
- Review follow-up (Round 2): platform admin requires `CLERK_PLATFORM_ORG_ID`; vendor org role fail-closed; telemetry includes `args` in customization path and structured `errorDetail`; initConvexTest allowlist; correlation IDs UUID-shaped; shared app providers and env examples updated.

### File List

- `_bmad-output/implementation-artifacts/1-2-convex-backend-foundation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `yarn.lock`
- `apps/admin/app/app-providers.tsx`
- `apps/admin/app/layout.tsx`
- `apps/admin/next.config.ts`
- `apps/admin/package.json`
- `apps/marketplace/app/app-providers.tsx`
- `apps/marketplace/app/layout.tsx`
- `apps/marketplace/next.config.ts`
- `apps/marketplace/package.json`
- `apps/vendor/app/app-providers.tsx`
- `apps/vendor/app/layout.tsx`
- `apps/vendor/next.config.ts`
- `apps/vendor/package.json`
- `packages/backend/convex/__test_helpers/initConvexTest.setup.ts`
- `packages/backend/convex/_generated/api.d.ts`
- `packages/backend/convex/convex.config.ts`
- `packages/backend/convex/helpers/auth.ts`
- `packages/backend/convex/helpers/authClaims.shared.ts`
- `packages/backend/convex/helpers/errors.ts`
- `packages/backend/convex/helpers/testFixtures.ts`
- `packages/backend/convex/helpers/unexpectedContext.shared.ts`
- `packages/backend/convex/helpers/__tests__/auth.test.ts`
- `packages/backend/convex/helpers/__tests__/authClaims.test.ts`
- `packages/backend/convex/helpers/__tests__/errors.test.ts`
- `packages/backend/convex/helpers/__tests__/unexpectedContext.test.ts`
- `packages/backend/package.json`
- `packages/backend/vitest.config.ts`
- `packages/backend/vitest.setup.ts`
- `packages/web-shared/package.json`
- `packages/web-shared/src/convex.ts`
- `packages/web-shared/src/providers.tsx`
- `packages/web-shared/src/providers.test.tsx`
- `packages/web-shared/vitest.config.ts`

### Change Log

- 2026-04-30: Story 1.2 implementation — Convex auth wrappers, structured errors, rate limiter, test harness, web-shared Convex+Clerk provider, app layouts, coverage and lint fixes.
