# AGENTS — Farm2Table

Cross-cutting AI-agent conventions for the F2T monorepo. **Read this first** before writing code in any package or app, and read the per-package `AGENTS.md` for that surface area's specifics.

## Authoritative sources

- **`_bmad-output/planning-artifacts/architecture.md`** — canonical architecture. Post-validation revisions in §"Architecture Validation & Revisions" supersede earlier sections (notably the Resend pull-out at line 1541).
- **`_bmad-output/project-context.md`** — LLM-optimized rule digest covering technology stack, repo shape, naming, TypeScript style, datetime, Convex auth wrappers, Convex React hook wrappers, loading/empty/error states, domain events, email pipeline, server actions vs API routes, validation, schema migrations, test conventions, pattern enforcement, and AGENTS.md hierarchy.

When this file disagrees with `architecture.md`, architecture.md wins.

## Per-package AGENTS.md index

| Location | Surface area |
|---|---|
| `apps/marketplace/AGENTS.md` | customer-facing app + cross-cutting webhook + email API routes |
| `apps/vendor/AGENTS.md` | vendor portal (org-scoped sessions, Stripe Connect onboarding, vendor-local timezones) |
| `apps/admin/AGENTS.md` | admin tools (Platform Org + 2FA, queues, enforcement, audit log) |
| `packages/backend/AGENTS.md` | Convex idioms, auth wrappers, indexes, test conventions |
| `packages/ui/AGENTS.md` | Base UI shadcn primitives, no-barrel rule, theme tokens |
| `packages/rules-engine/AGENTS.md` | pure-functional, isolation rule, versioning |
| `packages/web-shared/AGENTS.md` | the canonical Convex hook wrapper layer + datetime + providers |
| `packages/email-templates/AGENTS.md` | React Email templates, Next.js-side rendering |
| `packages/seed-data/AGENTS.md` | qa-tier synthetic data |

## Cross-cutting story conventions (from epics.md)

These five rules every story honors:

1. **Public route allowlisting.** New customer-facing routes must declare their auth requirement in `apps/marketplace/proxy.ts` (Story 1.5 wires up the allowlist mechanism). The default is "auth required"; public routes opt out explicitly.

2. **Per-story schema discipline.** A story only adds the Convex schema fields it needs. Don't proactively add fields for "future stories." Schema additions go in the story that uses them.

3. **Top-of-file `Protects:` block on every test.** Each test file declares the behavior(s) it protects, named in present tense. The "intentional break" check before commit: comment out the line of production code the test claims to protect; if the test still passes, rewrite. No coverage-chasing tests.

4. **Audit log subscriber pattern.** State-changing mutations write to their domain table, then `emitEvent()` a domain event. The audit log is **populated by a subscriber** that watches `domainEvents` — never by the mutation directly. This makes the audit trail an additive concern (one publisher, multiple subscribers).

5. **Domain events via `emitEvent()`.** Always emit through `emitEvent()` in `convex/helpers/events.ts` — never `db.insert("domainEvents", ...)` directly. ULID `eventId`, separate `occurredAt` and `emittedAt`, central `DomainEventPayloadMap` discriminated union (Story 1.3 authors the helper).

## Architectural boundaries (ESLint-enforced)

The package dependency graph is one-way and enforced by `import/no-restricted-paths` in `@workspace/eslint-config/base`:

- `packages/backend` does **not** import from `apps/*`.
- `packages/ui` does **not** import from `packages/backend`.
- `packages/rules-engine` imports **nothing** outside its own internals.
- `apps/marketplace`, `apps/vendor`, `apps/admin` do **not** import from each other.

Cross-package imports use `@workspace/*` aliases. Intra-package imports use relative paths.

## The "no Node in Convex" rule (load-bearing)

`packages/backend/convex/` runs in a **V8 isolate only**. No `'use node'` actions. Anything Node-flavored — Resend SDK, PDF generation, exifr, complex CSV — lives in Next.js API routes (`apps/marketplace/app/api/...`).

This is the load-bearing architectural commitment that drove the Resend pull-out: instead of `@convex-dev/resend`, we run a Convex action → fetch POST → `apps/marketplace/app/api/emails/send/route.ts` → Resend SDK pipeline. See `_bmad-output/project-context.md` §"Email Pipeline" for the canonical flow.

## When you genuinely don't know

- Read `_bmad-output/planning-artifacts/architecture.md` — authoritative.
- Read the relevant per-package `AGENTS.md`.
- Default to the more conservative pattern (Server Component over Client Component, Convex event over direct call, API Route over Server Action for server-to-server, `emitEvent()` over `db.insert("domainEvents", ...)`, write the test instead of `coverage.exclude`, reshape the code instead of `eslint-disable`).
- Ask before inventing a new pattern. New conventions are added with a PR that updates `_bmad-output/project-context.md` + the relevant `AGENTS.md`.
