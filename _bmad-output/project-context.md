---
project_name: 'Farm2Table (jenchartier)'
user_name: 'Jen'
date: '2026-04-26'
sections_completed: ['technology_stack', 'repo_shape_and_module_exports', 'file_and_identifier_naming', 'field_naming_and_boundary_translation', 'typescript_style', 'date_time_timezone', 'convex_auth_wrappers', 'convex_react_hook_wrappers', 'loading_empty_error_states', 'domain_events', 'email_pipeline', 'server_actions_vs_api_routes', 'validation_strategy', 'schema_migrations', 'test_conventions', 'pattern_enforcement', 'agents_md_hierarchy']
existing_patterns_found: 16
status: 'complete'
optimized_for_llm: true
section_count: 17
source_documents:
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/prd.md
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

> **Authoritative source:** `_bmad-output/planning-artifacts/architecture.md` (post-validation revisions in §"Architecture Validation & Revisions" supersede earlier sections). When this file disagrees with architecture.md, architecture.md wins — open a PR to reconcile.

---

## Technology Stack & Versions

**Runtime & language**
- TypeScript everywhere · Node 20+ · `target: ES2022` · `module: ESNext` · `moduleResolution: bundler`
- TS strict mode + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`, `verbatimModuleSyntax`, `noImplicitOverride`, `noFallthroughCasesInSwitch`

**Framework & frontend**
- Next.js 16 (App Router, React 19.2, Turbopack), Cache Components (PPR + opt-in `use cache`), `proxy.ts` (replaces middleware in v16)
- Tailwind v4 (CSS-first via `@import "tailwindcss"`)
- shadcn/ui with **Base UI** primitives (NOT Radix)

**Backend platform**
- Convex (database, reactive queries, mutations, scheduled functions, cron, file storage, `_storage`)
- Schema in `packages/backend/convex/schema.ts` is single source of truth
- **V8 isolate only — NO Node runtime in Convex.** Anything Node-flavored (PDF, Resend SDK, exifr, complex CSV) lives in Next.js API routes.

**Auth**
- Clerk (Organizations for vendor multi-tenancy; personal users for customers; separate "Platform" Org for admins)
- Bridge: `ConvexProviderWithClerk`; auth state via `useConvexAuth()` (NOT Clerk's `useAuth()`)

**Payments**
- Stripe Connect (split payments per vendor), Stripe Tax (PTC mapping)
- Stripe SDK lives in Next.js (`apps/*/lib/stripe-server.ts`); webhooks at `apps/marketplace/app/api/stripe/webhook/route.ts`

**Email**
- Resend (NOT `@convex-dev/resend` — that was removed during validation because it requires Node)
- React Email templates in `packages/email-templates/`, rendered + sent from `apps/marketplace/app/api/emails/send/route.ts`
- Convex action `fetch`-POSTs to that route with `X-Internal-Auth` shared secret + `Idempotency-Key` header

**Tooling**
- Turborepo + Yarn Berry (`nodeLinker: node-modules`)
- Playwright for E2E (NOT Cypress — needed WebKit/Mobile Safari coverage)
- Vitest + Testing Library for unit/component
- `convex-test` (in-process Convex) for backend functions
- ESLint (heavy custom rules — see "Pattern Enforcement"), Prettier, husky + lint-staged, gitleaks
- `axe-core` integrated into Playwright (NFR48)

**Hosting**
- Vercel (3 Next.js apps), Convex Cloud (3 tiers: dev / qa / prod), Clerk Cloud, Resend, Sentry, BetterStack
- All PaaS — no infra management at MVP. Geographic expansion = feature flags, NOT environment promotion.

---

## Critical Implementation Rules

### Repo Shape & Module Exports

**Apps & packages (canonical):**
- 3 Next.js apps: `apps/marketplace`, `apps/vendor`, `apps/admin` — never `apps/web` or `apps/storefront`
- 7 workspace packages: `backend` (Convex), `ui` (shadcn + Base UI primitives), `rules-engine`, `web-shared` (incl. canonical Convex hook wrappers), `seed-data`, `eslint-config`, `email-templates` (React Email)
- Dependency graph is one-way and ESLint-enforced. `packages/backend` depends on no app; apps depend on packages, not on each other.

**No barrel files anywhere.**
- `index.ts` / `index.tsx` is forbidden outside Convex `_generated/` and Next.js special locations (`page.tsx`, `layout.tsx`, etc.). ESLint blocks new ones.
- Package public surface is declared via `package.json#exports`:
  ```jsonc
  { "exports": { "./*": "./src/*.tsx", "./*.css": "./src/*.css" } }
  ```
- Consumers import explicitly: `import { Button } from "@workspace/ui/Button"` — never `from "@workspace/ui"`.

**Module exports:**
- One main component per file, **default export**, name matches filename.
- Sub-components used only by the main component live in the same file; if reused, get their own file.
- Component-specific types as named exports alongside the default (`export type FarmHeaderProps`).
- Convex functions, helpers, hooks, utilities: **named exports**.
- Next.js special files (`page.tsx`, `layout.tsx`, `route.ts`, etc.): default export per Next.js convention.

**Imports:**
- Cross-package: workspace alias (`@workspace/backend`, `@workspace/ui`, `@workspace/rules-engine`, `@workspace/web-shared`, `@workspace/email-templates`).
- Within a package: relative paths only (`./FarmHeader`, `../helpers/auth`).
- Type-only imports use `type` keyword (`import type { Id, Doc } from "@workspace/backend/convex/_generated/dataModel"`) — required by `verbatimModuleSyntax`.
- Import order (auto-enforced): node built-ins → external packages → workspace packages → `../parent` → `./same-dir` → type-only last.

---

### File & Identifier Naming

**File naming (per file type):**

| File type | Naming | Example |
|---|---|---|
| React component | `PascalCase.tsx` | `FarmHeader.tsx`, `SaveFarmButton.tsx` |
| React hook | `useCamelCase.ts` (matches exported hook name) | `useCart.ts`, `useVendorContext.ts` |
| Convex function | `camelCase.ts` | `queries.ts`, `mutations.ts`, `internal.ts` |
| Convex helper | `camelCase.ts` | `auth.ts`, `errors.ts`, `audit.ts`, `events.ts` |
| Next.js special file | lowercase per Next.js convention | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `actions.ts` |
| Type file (any kind) | `[name].types.ts` always | `FarmHeader.types.ts`, `domainEvents.types.ts` |
| Constants / config | `camelCase.ts` | `tierLimits.ts`, `rulesEngineConfig.ts` |
| Component test | `PascalCase.test.tsx` | `FarmHeader.test.tsx` |
| Convex / hook / util test | `camelCase.test.ts` | `queries.test.ts`, `useCart.test.ts` |
| **Playwright spec** | `camelCase.spec.ts` | `multiVendorCart.spec.ts` |

**Test file extension is load-bearing:** `.test.ts(x)` runs in Vitest; `.spec.ts` runs in Playwright. Don't cross them.

**Identifiers:**
- Functions / variables: `camelCase`
- Types / components: `PascalCase` — no `I` prefix on types (`User`, not `IUser`); no `T` suffix
- True compile-time constants: `SCREAMING_SNAKE_CASE`
- Async functions: **no** `Async` suffix (TS shows return type)
- Event handlers: `handle*` for the local function, `on*` for the prop name (`function handleRemoveClick()` calls the `onRemove` prop)
- Generics: single capital when meaning is clear (`T`, `K`, `V`); descriptive (`TPayload`, `TAction`) when not
- Discriminated unions use **`kind`** as discriminator — never `type` (collides with `typeof`)
- URL paths and search-param keys: `kebab-case` for paths; `camelCase` for search-param keys and values (`?certification=usdaOrganic`)

---

### Field Naming & Boundary Translation

**camelCase everywhere internally.** Every F2T-internal surface — Convex schema, function args, return shapes, API route JSON, React props, RHF field names, URL search-param keys — is camelCase. F2T-internal code never sees snake_case.

**External-protocol naming is translated at the boundary, not propagated:**
- Stripe webhook payloads arrive `snake_case` → translated to camelCase in the Next.js API route before calling the Convex internal mutation.
- Clerk webhook payloads same. Same for any future snake_case external API.
- The translation layer lives in the route handler (`apps/marketplace/app/api/{stripe,clerk,resend}/webhook/route.ts`); below that boundary, only camelCase exists.

**Naming patterns:**
- **Booleans:** `is`, `has`, `can`, `should` prefix — `isActive`, `hasShippingAvailable`, `canAcceptOrders`, `shouldNotifyOnExpiry`. Never bare `active: boolean` or `enabled: boolean`.
- **IDs:** always the noun + `Id` — `vendorId`, `customerId`, `orderId`, `vendorOrderId`. Never `vendor_id`, never bare `vendor` or bare `id` for a foreign reference. The document's own ID is `_id` (Convex convention).
- **Timestamps:** past-tense verb + `At` suffix — `createdAt`, `updatedAt`, `verifiedAt`, `cancelledAt`, `submittedAt`. All stored as `number` (epoch ms, UTC).
- **Future-time fields** use noun form, not `At` — `expiry`, not `expiresAt`.
- **Date-only values:** ISO date string `"YYYY-MM-DD"` with `Date` suffix — `expiryDate`, `harvestDate`. Distinct from datetime fields.
- **`null` vs `undefined`:** `null` for explicit "no result" (Convex idiom for missing rows); `undefined` for default "no value." Never both in the same field.

---

### TypeScript Style

**`tsconfig.json` strictness — full strict mode plus these flags (all required):**
```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true,        // highest-leverage flag against AI-written bugs
  "noImplicitOverride": true,
  "noFallthroughCasesInSwitch": true,
  "exactOptionalPropertyTypes": true,
  "useUnknownInCatchVariables": true,
  "verbatimModuleSyntax": true,
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler"
}
```

**Type system rules:**
- **`type` for everything** — `interface` is forbidden (avoids accidental declaration merging).
- **No TypeScript `enum`** — use `literals(...)` from `convex-helpers/validators` for closed sets, or discriminated unions for tagged variants.
- **No `any`** in app code — ESLint errors. Use `unknown` and narrow at the use site.
- **No `I` prefix** on type names (`User`, not `IUser`); no `T` suffix.
- **Discriminated unions use `kind`** as the discriminator — never `type` (collides with `typeof`).
- **Branded types** for structurally constrained strings via `convex-helpers/validators` `brandedString("email")` → `Email`, `Slug`, `IanaTimezone`.

**Catch with `unknown` (mandatory; enforced by `useUnknownInCatchVariables`):**
```ts
try {
  // ...
} catch (e: unknown) {
  if (e instanceof ConvexError) { /* domain error */ }
  else if (e instanceof Error) { /* generic JS error */ }
  else { /* not an Error subtype */ }
}
```

**Type-only imports** use the `type` keyword (`import type { ... }`) — required by `verbatimModuleSyntax` and ESLint `@typescript-eslint/consistent-type-imports`.

---

### Date / Time / Timezone

**Library:** `date-fns` + `date-fns-tz` only. **No** moment.js, **no** dayjs, **no** Luxon. ESLint blocks the alternatives.

**Storage:**
- **Datetimes:** `number` (epoch milliseconds, UTC). Convex idiom.
- **Date-only values:** ISO date string `"YYYY-MM-DD"` — field name carries `Date` suffix (e.g., `expiryDate`, `harvestDate`).
- **Wire format = storage format.** Never serialize `Date` objects across the wire (HTTP, Convex args, mutation returns).

**Application logic:**
- All comparisons and arithmetic in **UTC**.
- **Vendor-local times for pickup windows are load-bearing** for multi-state operation. Store the UTC moment + the vendor's IANA timezone string (e.g., `"America/New_York"`); render in the **vendor's** TZ on vendor surfaces and the **customer's** TZ on customer surfaces. A pickup window shown in the wrong zone is a customer-impacting bug, not a cosmetic one.

**Display:**
- Native `Intl.DateTimeFormat` API (zero bundle cost).
- Wrapped in named formatters in **`apps/{app}/lib/datetime.ts`**:
  ```ts
  export function formatLocal(epochMs: number, tz?: string): string
  export function formatRelative(epochMs: number): string
  export function formatPickupWindow(startEpochMs: number, endEpochMs: number, tz: string): string
  export function formatExpiryDate(isoDate: string): string
  ```
- **All date display goes through `lib/datetime.ts`.** No inline `format()` / `formatInTimeZone()` calls scattered through components.

**External boundaries:**
- **Stripe returns Unix timestamps in seconds** — multiply by 1000 at the API route boundary (`stripeTimestamp * 1000`) before storing or propagating.
- Stripe Tax handles tax-jurisdiction date logic internally; don't reimplement.

---

### Convex Auth Wrappers

**Never write raw `query` / `mutation` / `action` for user-facing endpoints.** Use the custom function wrappers from `convex-helpers/server` — they populate `ctx.user` and `ctx.org` from the Clerk session and enforce the role gate. AI agents see `vendorMutation` and know auth is handled.

| Wrapper | Requires | Used by |
|---|---|---|
| `publicQuery` / `publicMutation` | nothing | marketplace browse, farm profile pages, "tell us where to launch next" |
| `customerQuery` / `customerMutation` | authed user (any) | account, orders, saved farms, customer reports |
| `vendorQuery` / `vendorMutation` | authed user with **active** vendor org | listings, inventory, vendor dashboard |
| `vendorOwnerMutation` | vendor org `owner` role | invite team, change tier, delete vendor account |
| `adminQuery` / `adminMutation` | platform-admin Clerk org member with **mandatory 2FA** | verification queue, enforcement actions, audit log read |
| `internalMutation` / `internalAction` | not callable from client; only from Convex actions, scheduled jobs, webhooks | event subscribers, Stripe webhook handler, cron jobs |

**Rules:**
- Use `internalMutation` for anything called by a Convex action, cron, or webhook receiver. Don't reuse a public wrapper for internal-only writes.
- The active-vendor gate inside `vendorMutation` checks **org status, not just membership** — suspended/removed vendor orgs are blocked.
- Admin endpoints only resolve for members of the `"Platform"` Clerk Organization; the 2FA requirement is configured on the Clerk org, not in code — but agents shouldn't add an `adminMutation` that bypasses it.
- Storage-URL access goes through wrappers too: `vendorOwnDocReadUrl(docId)` for vendor-side, `adminDocReadUrl(docId)` for admin-side. **No public-read path exists for compliance docs.**

**Auth state in React: `useConvexAuth()`** (from `convex/react`), **not** Clerk's `useAuth()`. The Convex hook reflects the bridged auth state that backend wrappers actually see.

**Rate limiting** is declared per-mutation via `@convex-dev/rate-limiter` integrated into the wrapper layer. Token bucket for bursty (order placement); fixed window for periodic (reports max 5/hour).

---

### Convex React Hook Wrappers

**Single canonical entry point: `@workspace/web-shared`.** All Convex React hooks come from there — never directly from `convex/react`, `convex-helpers/react`, or `convex-helpers/react/cache`. ESLint enforces this with `no-restricted-imports`; new code that bypasses it fails the lint gate.

```ts
// ✅ Correct — every component, every app
import { useQuery, useMutation, useAction, usePaginatedQuery } from "@workspace/web-shared";

// ❌ Forbidden — ESLint blocks
import { useQuery } from "convex/react";
import { useMutation } from "convex-helpers/react";
import { usePaginatedQuery } from "convex-helpers/react/cache";
```

**What the wrappers add:**
- `useQuery` returns a **rich tri-state** shape: `{ status: "pending" | "error" | "success", data, error }` (built on `makeUseQueryWithStatus` + `useQueries`). Use the `status` discriminator — never check `data === undefined` to detect loading.
- `usePaginatedQuery` is the cached variant (cross-unmount cache via `ConvexQueryCacheProvider`, set at the app root with `expiration: 300_000ms`, `maxIdleEntries: 250`).
- `useMutation` and `useAction` return a `[trigger, { isPending, error }]` tuple — always have `isPending` available for inline button-disabled states without extra `useState`.

**Exceptions that still import from `convex/react` directly (don't wrap these):**
- `useConvexAuth` — auth state.
- `usePreloadedQuery` — SSR-hydrated query that already has data (no loading state needed).

**Server-side fetching** (Server Components, route handlers, Server Actions) uses `preloadQuery` / `fetchQuery` from `convex/nextjs`, not the React hooks.

---

### Loading / Empty / Error States

**Tri-state pattern via the wrapped `useQuery`** — separate `status`, `error`, and "data is null":

```tsx
const { status, data: farm, error } = useQuery(api.farms.queries.bySlug, { slug });

if (status === "pending") return <FarmDetailSkeleton />;
if (status === "error")   return <ErrorState error={error} />;
if (farm === null)        return <NotFound />;
return <FarmDetail farm={farm} />;
```

**Loading mechanism per scenario:**

| Scenario | Mechanism |
|---|---|
| Server Component data fetch (`preloadQuery`, `fetchQuery`) | Next.js `loading.tsx` at the route segment; `<Suspense>` for streaming inner sections |
| Client `useQuery` | Explicit `status === "pending"` with a sized skeleton |
| `usePreloadedQuery` (SSR-hydrated) | No loading state — data is already there at first paint |
| Mutation in flight | Inline UI via `useMutation`'s `isPending` — disable the action element only |
| Route navigation | Next.js `loading.tsx` automatic |

**Skeletons:**
- Live next to the component they shadow: `FarmDetail.tsx` + `FarmDetailSkeleton.tsx` in the same dir.
- Built on shadcn's `<Skeleton />` primitive, sized to match real layout (no jank).
- Server Components — no interactivity needed.

**Empty states:**
- Shared `<EmptyState>` from `@workspace/ui` (icon + title + description + optional CTA).
- `data === null` from a query = "no data found" — distinct from `status === "pending"`.
- Copy is **action-oriented and specific** ("No saved farms yet — browse the marketplace to save one"). Never generic "No data."

**Forbidden patterns:**
- ❌ Spinners for content loading (use skeletons).
- ❌ Loading flashes <100ms (use `usePreloadedQuery` to SSR-hydrate).
- ❌ Conflating `status === "pending"`, `status === "error"`, and `data === null` semantics.
- ❌ Blocking the whole page on a mutation — only the action element gets disabled.
- ❌ "Loading..." text labels anywhere — skeletons everywhere.

---

### Domain Events

**Naming: `domain.actionInPastTense`** — lowercase dot-notation, camelCase for both segments. Domain matches the schema table name **singular** (`vendorOrder` for `vendorOrders` table). Action is past-tense (events describe what happened, never commands).

```
order.placed                  vendorApplication.submitted
order.cancelled               vendorApplication.approved
order.lineRefunded            vendor.suspended
vendorOrder.markedReady       complianceDoc.expired
payment.succeeded             customer.dataExported
incident.foodborneIllnessReported
```

Stripe wire types stay snake_case **only at the API route boundary** — translated to F2T's camelCase event before emission.

**Standardized envelope (every event):**

```ts
type DomainEvent<T extends Record<string, unknown> = Record<string, unknown>> = {
  eventId: string;          // ULID — unique per emission, time-orderable
  eventType: string;        // "order.placed", etc.
  occurredAt: number;       // epoch ms — when the state change happened
  emittedAt: number;        // epoch ms — when this event record was written
  actorId?: Id<"users">;    // who caused it (undefined for system-emitted)
  actorType: "user" | "vendor" | "admin" | "system" | "stripe" | "clerk";
  correlationId?: string;   // for tracing event chains
  payload: T;               // event-specific shape
};
```

**Emission rules:**
- **Always emit through `emitEvent()`** in `convex/helpers/events.ts` — never `db.insert("domainEvents", ...)` directly. The helper is type-safe against the central `DomainEventPayloadMap` discriminated union.
- Per-event payload typing lives in `packages/backend/convex/_types/domainEvents.types.ts` — single source of truth that emit sites and subscribers both reference.
- `eventId` is a **ULID** (not nanoid, not UUID) — time-ordering matters for replay.
- `occurredAt` ≠ `emittedAt`. Set `occurredAt` to when the business event happened (e.g., the moment of payment); `emittedAt` is the row write time.

**Subscribers:**
- Subscribers are Convex internal mutations that watch the `domainEvents` table; they `scheduler.runAfter(0, ...)` actions when external work is needed (email, Stripe call). Subscribers must be idempotent — re-running on the same `eventId` is a no-op.
- One event can have many subscribers; new subscribers attach without touching publishers (architecture's "additive" property).

**Versioning:** if a payload shape needs an incompatible change, **version the event type** (`order.placed` → `order.placedV2`); subscribers handle both during the transition; clean cutover after backfill. Don't mutate the existing event type's payload shape.

---

### Email Pipeline (Convex → Next.js)

**Resend lives in Next.js, NOT Convex.** Do not install `@convex-dev/resend`. Do not call `resend.sendEmail` from any Convex function. The Resend SDK requires Node, which violates the "no Node runtime in Convex" rule.

**Canonical end-to-end flow for every transactional email:**

```
Mutation / webhook handler / cron
  ├─ writes data
  ├─ writes audit log
  └─ emits domainEvent (via emitEvent)

Convex internal mutation subscriber (watches domainEvents table)
  └─ schedules Convex action (scheduler.runAfter)

Convex action (V8 isolate — no Node)
  ├─ resolves recipient + data needed for email
  └─ fetch POST → apps/marketplace/app/api/emails/send/route.ts
       Headers: { X-Internal-Auth: ${INTERNAL_API_SECRET},
                  Idempotency-Key: <eventId>-<emailType> }
       Body:    { template: "OrderConfirmation", to, data }

Next.js /api/emails/send (Node runtime)
  ├─ verify X-Internal-Auth shared secret  (reject otherwise)
  ├─ import React Email template from @workspace/email-templates
  ├─ render to HTML via @react-email/render
  ├─ call resend.emails.send() with the same Idempotency-Key
  ├─ on 200: respond 200; optionally write tracking row to Convex via convex.mutation()
  ├─ on 429 (Resend rate-limit): respond 429 + Retry-After  → Convex action reschedules
  └─ on 5xx: respond 5xx                                    → Convex action retries with exponential backoff

Resend → /api/resend/webhook (Node runtime)
  ├─ verify Resend webhook signature
  └─ convex.mutation() → updates emailDeliveryEvents Convex table
```

**Rules for adding a new transactional email:**
1. Add the React Email template to `packages/email-templates/src/MyNewEmail.tsx` (one file, default export, name matches file).
2. Wire `MyNewEmail` into the route's template registry in `apps/marketplace/app/api/emails/send/route.ts` (typed switch on `template` field).
3. In a `convex/domainEvents/emailSubscribers/*.ts` subscriber, react to the relevant domain event and schedule `internal.emails.sendEmail` with `{ template: "MyNewEmail", to, data, idempotencyKey: ${eventId}-${emailType} }`.
4. Never call Resend or `fetch` to `/api/emails/send` from anywhere except the `convex/emails/sendEmail.ts` action.

**Idempotency key:** **`${eventId}-${emailType}`** — composite. The same domain event firing twice (subscriber re-run) must produce the same key so Resend deduplicates server-side.

**Tracking tables (replace what `@convex-dev/resend` would have given us):**
- `pendingEmails` — every send attempt; updated on success/retry/exhausted.
- `emailDeliveryEvents` — Resend webhook events (delivered, bounced, opened, complained).

**Rotation:** `INTERNAL_API_SECRET` lives in both Convex env (per tier) and Vercel env (per tier). Rotated annually per `docs/DEPLOYMENT_RUNBOOK.md`.

**Local preview** (no real send): `cd packages/email-templates && npx react-email dev`.

---

### Server Actions vs API Routes

**Decision rule:**
- **Server Action** when the caller is a **React component** (button click, form submit). Type-safe, CSRF-protected via React's encrypted action references, native `redirect()` support.
- **API Route** when the caller is **server-side** (Convex action, external service, webhook receiver, cron). Standard HTTP semantics, explicit auth via headers.

**F2T concrete usage:**

| Operation | Type | Location |
|---|---|---|
| Stripe Connect onboarding URL (vendor button) | **Server Action** | `apps/vendor/app/(onboarding)/stripe-connect/actions.ts` |
| Stripe customer portal session (customer button) | **Server Action** | `apps/marketplace/app/(customer)/account/actions.ts` |
| Multi-step form intermediate validation | **Server Action** | colocated `actions.ts` |
| Admin discretionary refund (admin button) | **Server Action** | `apps/admin/app/enforcement/actions.ts` |
| Vendor cancel-line refund (vendor button) | **Server Action** | `apps/vendor/app/orders/actions.ts` |
| Stripe webhook receiver | **API Route** | `apps/marketplace/app/api/stripe/webhook/route.ts` |
| Clerk webhook receiver | **API Route** | `apps/marketplace/app/api/clerk/webhook/route.ts` |
| Resend webhook receiver | **API Route** | `apps/marketplace/app/api/resend/webhook/route.ts` |
| Email send (called by Convex action) | **API Route** | `apps/marketplace/app/api/emails/send/route.ts` |

**Refund Server Actions are thin wrappers:** they call the Stripe SDK + the Convex mutation, then return success. The Convex mutation does the audit log write + emits the `payment.refunded` domain event, which triggers the refund-notice email via the canonical email pipeline. **Do not** try to send the refund email from the Server Action itself.

**Auth in Server Actions:** rely on `auth()` from Clerk's server SDK at the top of the action; reject if no session or wrong role before any Stripe/Convex call.

**Auth in API Routes:**
- Webhook receivers verify external HMAC signature (Stripe via `stripe.webhooks.constructEvent`; Clerk via Svix; Resend via its own header). The signature **is** the auth — no session expected.
- Internal API Routes called by Convex (`/api/emails/send`) use the `X-Internal-Auth` shared-secret header.

**Output:** Server Actions return values directly to the calling component (no JSON shape ceremony). API Routes return JSON with HTTP status codes that match semantics (200 success, 4xx client error, 5xx retry-eligible).

---

### Validation Strategy

**Two layers, two libraries — no overlap:**

| Where | Library | Used for |
|---|---|---|
| Convex schema + function args | **`v` (Convex) + `convex-helpers/validators`** (mandatory) | every `defineTable`, every public/internal function `args` |
| Client forms | **Zod + React Hook Form** | every form across the three apps |
| Next.js API route input | **Zod** | webhook payload shape, internal API body shape |
| Shared types between client + Next.js routes | **Zod-inferred types** | `z.infer<typeof Schema>` |

**Convex helpers — use these idioms instead of raw `v.union(...)`:**
```ts
import { literals, nullable, partial, pick, omit } from "convex-helpers/validators";

literals("preparing", "ready", "in_transit", "delivered")  // not v.union(v.literal(...), v.literal(...), ...)
nullable(v.string())                                        // not v.union(v.string(), v.null())
partial(vendorOrderFields)                                  // patch-style updates
pick(orderFields, ["status", "total"])                      // narrow shape
omit(orderFields, ["paymentIntentId"])                      // exclude shape
```

Also use the runtime utilities from `convex-helpers`: `asyncMap`, `nullThrows`, `Table()`. And the `customFunction` / `customMutation` / `customQuery` factories — these power the auth wrappers in §"Convex Auth Wrappers."

**Forms — React Hook Form + Zod always:**
```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ farmName: z.string().min(2), state: z.enum(["FL", ...]) });
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
```

**Forbidden:**
- ❌ Bare `useState`/`useEffect` for form state — use RHF.
- ❌ Validating inside event handlers (`onChange`, `onBlur`) — let RHF + Zod do it via `resolver`.
- ❌ Defining the same shape twice (Zod for client, Convex `v` for server). Either generate one from the other (preferred: Zod schema → derived Convex args via a small adapter), or keep client form schema separate from Convex args by explicit choice — never silently drift.
- ❌ Using Zod for Convex schema/args (use `v` + `convex-helpers/validators`).
- ❌ Using Convex `v` for client forms (use Zod).

**External-payload validation:** Stripe and Clerk webhook bodies are validated with Zod against a typed shape **before** any other use, even though the HMAC signature is already verified. Bad shapes are 400 + alerted, never propagated.

---

### Schema Migrations

**Two paths — pick by compatibility:**

**Backwards-compatible (direct edit, no migration script):**
- Adding a new optional field
- Adding a new table
- Adding a new index
- Widening a `literals(...)` set

Just edit `packages/backend/convex/schema.ts`. Convex deploys the change; existing rows are unaffected.

**Backwards-incompatible (dual-write + backfill + cutover):**

1. **Add new field/table** alongside the old in `schema.ts` (don't remove the old one yet).
2. **Update writers** to write **both** the old and the new shape.
3. **Backfill existing data** via a Convex action that paginates and rewrites — typically `internal.migrations.<name>.run`. The action is idempotent (skip rows already migrated) so it can be re-run safely.
4. **Update readers** to read from the new shape.
5. **Remove the old field/table** from `schema.ts` once no readers or writers reference it.

Each step is its own PR. Steps 1–4 ship to prod gradually; step 5 is the cleanup PR.

**Always rehearse on QA tier first.** The qa Convex deployment carries seeded synthetic data across multiple states, categories, vendors, customers — exactly the conditions that surface migration bugs (NULL handling, edge-case schemas, pagination cursor exhaustion). A migration that runs cleanly on dev seed data has not been tested.

**Forbidden:**
- ❌ Dropping or renaming a field in a single PR (writers will crash mid-deploy).
- ❌ Backfill scripts that aren't paginated (Convex 4096-row read limit per transaction).
- ❌ Backfill scripts that aren't idempotent (a retry must be safe).
- ❌ Skipping the qa rehearsal because "it's a small change."

**Tracking:** every migration action records progress in a `migrations` Convex table (`name`, `startedAt`, `completedAt`, `lastCursor`, `rowsProcessed`) so re-runs resume from the cursor and admins have a clear audit trail.

---

### Test Conventions

**Stack (per layer):**

| Layer | Tool | File suffix | Location |
|---|---|---|---|
| Convex backend functions | `convex-test` (in-process Convex; real schema, real DB-in-memory) | `.test.ts` | `convex/[domain]/__tests__/queries.test.ts` etc. |
| React components | Vitest + `@testing-library/react` | `.test.tsx` | colocated `__tests__/` per component dir |
| Pure utility functions | Vitest | `.test.ts` | colocated `__tests__/` |
| E2E user flows | Playwright | `.spec.ts` | `apps/marketplace/tests/e2e/` |

**Convex test setup — single helper, ESLint-enforced:**
```ts
// packages/backend/convex/__test_helpers/initConvexTest.ts
import { convexTest } from "convex-test";
import rateLimiterTest from "@convex-dev/rate-limiter/test";
import schema from "../schema";

const modules = import.meta.glob("../**/*.ts");

export function initConvexTest() {
  const t = convexTest(schema, modules);
  rateLimiterTest.register(t);
  return t;
}
```
ESLint blocks `import { convexTest } from "convex-test"` everywhere except `initConvexTest.ts`. Note: **no Resend test registration** — Resend lives in Next.js, not Convex.

**Meaningful-tests rule (the load-bearing guardrail):**

Every test must name the behavior it protects and exercise that behavior such that, if the production logic is removed, the test fails.

- **Top-of-file `Protects:` block is mandatory:**
  ```ts
  /**
   * Tests for orders.mutations.create.
   *
   * Protects:
   * - Payment splits correctly across multiple vendors via Stripe Connect (FR10)
   * - Per-line tax calculation respects origin × destination × PTC (FR11)
   * - order.placed event emits with correct payload (FR66)
   */
  ```
- **"Intentional break" check before commit:** comment out the line of production code the test claims to protect. If the test still passes, rewrite the test before merging.
- **No coverage-chasing tests.** A test that exists only to hit the 100% gate without naming what it protects is rejected in code review.

**Mocking philosophy:**
- ✅ **Don't mock Convex** — `convex-test` runs the real Convex runtime in-process. Mutations actually run; queries actually query.
- ✅ **Don't mock the unit under test.**
- ✅ **Don't mock cheap things** — `date-fns`, `lib/datetime.ts`, type validators, pure functions. Just call them.
- ✅ **Do mock at external boundaries** — Stripe SDK, Clerk SDK, Resend SDK in unit tests. Integration tests use real test-mode services.

**Test naming + structure:**
- `describe('moduleName.functionName')`
- `it('describes the behavior in present tense, no "should"')` — `"splits payment across multiple vendors"` not `"should split payment..."`
- AAA pattern (Arrange / Act / Assert) with section comments in non-trivial tests
- Multiple `expect`s OK when asserting facets of the same behavior
- Test names describe **behavior protected**, not function shape

**Component tests:**
- Query by **role** (Testing Library priority) — finds elements as a screen reader would
- Test what the user experiences, not implementation details
- `userEvent.setup()` for interactions
- **No snapshot tests** — they ossify markup without testing behavior

**Coverage gate: 100% in CI**, statements / branches / functions / lines, for both `packages/backend` and the apps. Exclusions in `vitest.config.ts` are the only place coverage carve-outs live, and any new entry there requires a justifying comment + PR discussion. Standing exclusions: `_generated/`, `__test_helpers/`, `*.types.ts`, `node_modules/`, render-only Next.js special files (`layout/error/loading/not-found/global-error.tsx`).

**Forbidden test patterns:**
- ❌ Mocking the unit under test
- ❌ Asserting only "function returned a value" without checking its meaning
- ❌ Snapshot tests
- ❌ `expect(true).toBe(true)` placeholders
- ❌ Mutation-then-immediate-read patterns that don't exercise concurrency or invariants
- ❌ `// TODO: write a real test` in committed code (PR rejection)
- ❌ `it.skip` without `// skip-issue: #123` comment linking the reason
- ❌ Tests written purely to hit coverage threshold without a `Protects:` entry
- ❌ Excluding production code from coverage instead of writing tests
- ❌ "Intentional break" check failing — test passes after production logic is removed/commented (rewrite before merge)

**Playwright E2E:**
- `apps/marketplace/tests/e2e/{customer,vendor,admin,smoke}/`
- Fixtures over helpers (`signedInCustomer`, `signedInVendor`, `signedInAdmin`, `seedReset`, `stripeTestCard`)
- Page Object Model only when >3 distinct test files use the same page
- Smoke suite runs on PR CI; full suite runs post-merge against qa tier
- E2E coverage doesn't count toward 100% — evaluated by what user paths it protects
- `axe-core` runs inside Playwright tests for a11y regression gating (NFR48)

---

### Pattern Enforcement

**The conventions in this file are not vibes — they're enforced.** Three layers catch deviations: ESLint at edit time, pre-commit hooks at commit time, CI gates at merge time.

**ESLint rules (the canonical wall):**

| Rule | Catches |
|---|---|
| `no-restricted-imports` (Convex hooks) | Direct `useQuery`/`useMutation`/`useAction`/`usePaginatedQuery` imports from `convex/react`, `convex-helpers/react`, `convex-helpers/react/cache` outside `@workspace/web-shared` |
| `no-restricted-imports` (`convex-test`) | Direct `convexTest` import outside `__test_helpers/initConvexTest.ts` |
| `no-restricted-imports` (date libs) | `moment`, `dayjs`, `luxon` — date-fns + date-fns-tz only |
| Custom rule: no `index.ts` / `index.tsx` | Barrel files outside `_generated/` and Next.js special locations |
| `import/no-namespace` | `import * as X` namespace imports (barrel-substitute pattern) |
| `@typescript-eslint/no-explicit-any` | `any` keyword — must be `unknown` |
| `@typescript-eslint/consistent-type-imports` | Forces `import type` for type-only imports |
| `@typescript-eslint/consistent-type-definitions` | `type` over `interface` |
| `@typescript-eslint/no-restricted-types` | Forbids `enum` keyword |
| `import/order` | Auto-enforces import order |
| `@typescript-eslint/naming-convention` | camelCase variables/functions, PascalCase types/components, no `I` prefix on types |

**Pre-commit hooks (`husky` + `lint-staged`):**
- ESLint on staged files
- TypeScript typecheck on changed packages (incremental)
- `gitleaks` scan for secret leakage
- Prettier formatting

**PR template requires the author to confirm:**
- [ ] Tests added or updated for new behavior
- [ ] `Protects:` block updated for changed behaviors
- [ ] "Intentional break" check passed
- [ ] No new `coverage.exclude` entries (or justified inline if so)
- [ ] AGENTS.md updated if a new convention emerged

**CI gates that block merge:**
- ESLint
- TypeScript `tsc --noEmit`
- Vitest (with 100% coverage threshold)
- Playwright smoke suite
- `axe-core` accessibility regression check (inside Playwright)

**If a check fails, fix the underlying issue.** Do not bypass with `--no-verify`, do not add code to `coverage.exclude` without a justified comment, do not disable an ESLint rule inline without an `// eslint-disable-next-line: <reason>` explanation. Bypassing enforcement to make a PR green defeats the purpose of having the enforcement.

---

### AGENTS.md Hierarchy + When in Doubt

**AGENTS.md is the per-package distillation of this file.** Every package has one; the repo root has a cross-cutting one. Claude / Cursor read these by default before writing code, and Next.js 16.2 generates per-package `AGENTS.md` automatically.

| Location | Contains |
|---|---|
| `/AGENTS.md` (repo root) | Cross-cutting: event-driven backbone, audit log subscriber, rules-engine versioning, transaction-metrics safety pattern, the "no Node in Convex" boundary, this file's section index |
| `apps/marketplace/AGENTS.md` | Marketplace-specific: SEO patterns, structured-data per-route conventions, search index update flow |
| `apps/vendor/AGENTS.md` | Vendor-portal-specific: org-context conventions, tier-gating patterns, Stripe Connect onboarding flow |
| `apps/admin/AGENTS.md` | Admin-tool-specific: queue patterns, enforcement-action flow, audit log read patterns |
| `packages/backend/AGENTS.md` | Convex idioms: index naming, query/mutation file split, `customFunction` wrappers, domain event helper, rate-limiter declaration syntax |
| `packages/ui/AGENTS.md` | shadcn + Base UI conventions: when to add a new primitive vs reuse, theme token usage, dark-mode handling |
| `packages/rules-engine/AGENTS.md` | Rules-engine versioning: how to add a state, how to add a category, how to evolve a rule without breaking historical replay (NFR66) |
| `packages/web-shared/AGENTS.md` | The hook-wrapper layer: how to add a new wrapper, why ESLint blocks bypasses |
| `packages/email-templates/AGENTS.md` | React Email conventions: template prop typing, preview command, snapshot test rules |

**Generated AI-context files:**
- Run `npx convex ai-files` after Convex schema changes to refresh Convex-specific AI context (schema patterns, query/mutation conventions, Convex idioms) without bloating default agent prompts.
- Next.js 16.2 emits `AGENTS.md` per package automatically — augment, don't overwrite.

**When in doubt — default to the more conservative pattern:**

- Defaulting between **Server Component vs Client Component** → **Server Component**. Add `"use client"` only when interactivity demands it.
- Defaulting between **Convex event vs direct call** for cross-component coordination → **Convex event**. Subscribers are additive; direct calls couple modules.
- Defaulting between **API Route vs Server Action** for a server-to-server call → **API Route**. Server Actions are component-callers only.
- Defaulting between **`useState` form vs RHF + Zod** → **RHF + Zod**, even for one-field forms.
- Defaulting between **direct `db.insert("domainEvents", ...)` vs `emitEvent()`** → **`emitEvent()`**. Always.
- Defaulting between **mocking vs `convex-test`** for backend testing → **`convex-test`**. Real Convex runtime, in-process.
- Defaulting between **adding a `coverage.exclude` entry vs writing the test** → **write the test**.
- Defaulting between **bypassing an ESLint rule vs reshaping the code** → **reshape the code**. The rule exists for a reason.

**When you genuinely don't know:**
- Read `_bmad-output/planning-artifacts/architecture.md` — it's the authoritative source and includes worked examples.
- Read the relevant `AGENTS.md`.
- Ask before inventing a new pattern. New conventions are added with a PR that updates this file + the relevant `AGENTS.md` + a note in the PR description.

---

## Usage Guidelines

**For AI agents:**
- Read this file before implementing any code in `f2t-restructure/`. Every workflow run loads it as a persistent fact via the `_bmad/custom/*.toml` configuration.
- Follow all rules exactly as documented. Where two rules tension, the more conservative one wins (see "When in Doubt" defaults).
- Architecture document is the authoritative source — if this file disagrees with `_bmad-output/planning-artifacts/architecture.md`, architecture.md wins; flag the drift in your PR so this file gets reconciled.
- Update this file (or the relevant per-package `AGENTS.md`) when introducing a new pattern. Don't let conventions accumulate undocumented.

**For humans:**
- Keep this file lean. The point is high information density per LLM context token; verbose explanations belong in architecture.md.
- Update when the technology stack shifts (Convex version, Next.js major, swap from Yarn to pnpm, etc.).
- Review when new conventions land in a PR — if the convention will recur, document it here.
- Remove rules that become obvious over time (e.g., once the `apps/storefront` → `apps/marketplace` rename is fully cemented in the codebase, that specific anti-example can drop).

Last updated: 2026-04-26
