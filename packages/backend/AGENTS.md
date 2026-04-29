# AGENTS — packages/backend

Convex backend (database + reactive queries + mutations + scheduled functions + cron + file storage). See repo-root `/AGENTS.md` for cross-cutting conventions and `_bmad-output/project-context.md` for the LLM-optimized rule digest.

## Convex idioms (Story 1.2 wires up the real layer)

- **Schema in `convex/schema.ts` is single source of truth.** Every other module references its types via `Id<"tableName">` / `Doc<"tableName">` from `convex/_generated/dataModel`.
- **V8 isolate only — no `'use node'` actions.** Anything Node-flavored (PDF, Resend SDK, exifr, complex CSV) lives in Next.js API routes (`apps/marketplace/app/api/...`), not here.
- **Auth wrappers (Story 1.2):** never write raw `query`/`mutation`/`action` for user-facing endpoints. Use `publicQuery` / `customerQuery` / `vendorQuery` / `vendorOwnerMutation` / `adminQuery` / `internalMutation` from `convex/helpers/auth.ts` (built on `customFunction` from `convex-helpers/server`). The active-vendor gate inside `vendorMutation` checks Org **status**, not just membership.
- **Validation:** every `defineTable` and every public/internal function `args` uses `v` from `convex/values` plus `convex-helpers/validators` (`literals`, `nullable`, `partial`, `pick`, `omit`). **No Zod here** — Zod is for client forms only.
- **Domain events:** always emit through `emitEvent()` in `convex/helpers/events.ts` (Story 1.3) — never `db.insert("domainEvents", ...)` directly. ULID `eventId`, separate `occurredAt` and `emittedAt`, central `DomainEventPayloadMap` discriminated union.
- **Audit log subscriber (Story 1.3):** every domain event from a state-changing mutation is mirrored to `auditLog` by a subscriber. Mutations write to their domain table, then `emitEvent()` — they don't write `auditLog` directly.
- **Rate limiting** is declared per-mutation via `@convex-dev/rate-limiter` integrated into the wrapper layer. Token bucket for bursty (order placement); fixed window for periodic (reports max 5/hour).
- **No `@convex-dev/resend` in this codebase.** Resend SDK lives in Next.js (`apps/marketplace/app/api/emails/send/route.ts`); Convex actions `fetch` to that route with `X-Internal-Auth` + `Idempotency-Key` headers.

## Index naming

Indexes are named `by_<field>` or `by_<field1>_<field2>` (e.g., `by_userId`, `by_vendorId_status`). Compound-index field order matches query selectivity.

## Test conventions

- `convex-test` (in-process Convex; real schema, real DB-in-memory) — direct import only allowed in `convex/__test_helpers/initConvexTest.ts` (Story 1.2). ESLint blocks elsewhere (Story 1.15).
- Top-of-file `Protects:` block is mandatory.
- "Intentional break" check before commit — comment out the line of production code your test claims to protect; if the test still passes, rewrite.
- 100% coverage gate; standing exclusions: `_generated/`, `__test_helpers/`, `*.types.ts`.

## File / directory layout (canonical)

Domain folders are created in their owning stories — see the Story 1.1 `.gitkeep` scaffold list in this story's AC #19. Don't proactively create `farms/`, `products/`, `vendorOrders/`, etc. — wait for the story that owns them.

## Story 1.1 status

`schema.ts` is empty (1.2 adds tables); `convex.config.ts` registers nothing yet (Story 1.2 will register `@convex-dev/rate-limiter`); demo `notes.ts`/`openai.ts` from the template have been removed. `auth.config.ts` is generic and reads `CLERK_JWT_ISSUER_DOMAIN` from Convex env (set per-tier in Task 9).

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
