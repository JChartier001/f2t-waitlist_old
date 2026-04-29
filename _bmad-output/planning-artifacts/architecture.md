---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: complete
completedAt: '2026-04-26'
lastStep: 8
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/prd-validation-report-2026-04-25.md
  - _bmad-output/planning-artifacts/prfaq-Farm2Table-distillate.md
  - _bmad-output/research/domain-food-marketplace-platform-liability-research-2026-03-02.md
  - _bmad-output/research/vendor-subscription-tiers.md
inputDocumentsOnDemand:
  - _bmad-output/planning-artifacts/prfaq-Farm2Table.md
  - _bmad-output/research/market-d2c-farm-marketplace-research-2026-03-01.md
workflowType: 'architecture'
project_name: 'Farm2Table'
user_name: 'Jen'
date: '2026-04-26'
persistentFacts:
  - 'No fulfillment hubs in Farm2Table — all fulfillment is vendor-managed; geographic expansion unit is "metro," not "hub"'
  - 'Real-time-ready architecture from day one — event-driven foundation even when user-visible real-time UX is deferred to Growth (FR65–66 emit, FR67–72 consume)'
  - 'PRD excludes founder personal funding/life context — architecture is product/system spec, not founder financial plan'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 73 FRs (FR1–FR72 plus FR32a) across 8 capability clusters. ~52 MVP / ~16 Growth / 2 Vision. Multi-Vendor Cart/Checkout/Tax (FR8–15) and Admin Verification/Enforcement/Incident (FR50–62) carry the most architectural weight per FR — split payments, split refunds, per-line tax, per-vendor fulfillment, immutable audit log. Platform Communication & Real-Time (FR63–72) commits the event-driven foundation as MVP architectural prep with user-visible real-time deferred to Growth/Vision.

**Non-Functional Requirements:** 66 NFRs across Performance, Security, Privacy & Data Lifecycle, Reliability & Availability, Scalability, Accessibility, Observability & Operability, Compliance & Auditability — all quantified. Most architecture-shaping: PCI scope minimization via Stripe (NFR9), KYC delegation via Stripe Connect (NFR10), CCPA/CPRA day one (NFR21–29), idempotent webhooks (NFR34), 99.9% uptime / RTO ≤2h / RPO ≤15min (NFR30/32/33), Y2 10× capacity on same architecture without rewrite (NFR40), adding states = data update only (NFR42), immutable audit log with ≥7yr retention (NFR59–60), versioned data lineage for audit replay (NFR66).

**Scale & Complexity:**

- Primary domain: web_app — server-rendered hybrid, two-sided marketplace + SaaS multi-tenancy
- Complexity level: medium-high — driven by multi-state regulatory cross-cuts, multi-vendor cart with split payments/refunds, branching tiered vendor onboarding, two-sided cold-start, real-time-ready architecture requirement; not driven by industry certifications, novel tech, or hard real-time SLAs
- Estimated logical components (will firm up in stack section): ~12–16 — marketplace storefront (SSR), vendor portal (gated SSR + dashboard), admin queue, Stripe webhook ingestion, event bus / reactive query layer, rules engine + rules data, document storage, image pipeline, search index, transactional email, audit log subscriber, scheduled-jobs runner, Stripe Tax integration, customer report intake

### Technical Constraints & Dependencies

**Locked at PRD level (not architecture-step decisions):**

- Stripe (Connect + Tax + Webhooks) — load-bearing platform commitment driven by PCI scope minimization (NFR9), marketplace-facilitator strategy (FR11–12, NFR65), and KYC delegation (FR20, NFR10). "Swap Stripe for X" is out of scope without revisiting PCI / tax / KYC strategy.
- SSR + hybrid rendering — pure SPA shell rejected; framework must support SSR + hybrid client routing (Next.js / Remix / SvelteKit / Astro acceptable).
- Real-time-ready architecture as MVP requirement (Locked Decision #7) — event-driven foundation, transport-abstracted data layer; user-visible real-time UX deferred to Growth (FR67–70) and Vision (FR71–72).
- Mobile-first responsive web; no native apps; no PWA / offline support at MVP.
- WCAG 2.1 AA on consumer-facing surfaces (NFR46) with axe-CI gating PRs (NFR48).
- Image pipeline must be a known-good service (not custom-built), with EXIF strip at upload (NFR27).
- Foundation tier only at MVP (Locked Decision #4); Growth/Pro tiers + add-ons + AI-assisted doc review deferred to Phase 2.
- Multi-state regulatory architecture (Stripe Tax with PTC mapping, marketplace facilitator framing, FSMA 204-ready data model) is MVP, not deferrable (Locked Decision #9).

**Open for the architecture step (per PRD §"What's Not Locked"):**

- Final stack: Convex (PRD-named lead) vs. Supabase vs. self-hosted Postgres + Redis + custom websockets
- Specific framework: Next.js (PRD-named lead) vs. Remix vs. SvelteKit vs. Astro
- Image pipeline service (Cloudflare Images / ImageKit / Cloudinary / platform-native)
- Hosting platform (Vercel / Render / Fly / Railway / Convex Cloud)
- Email service provider (Postmark / SendGrid / Resend)
- Error tracking & monitoring stack (Sentry-or-equivalent per NFR52)
- Analytics platform (privacy-aware constraint applies; specific tool open)

**Persistent project facts (from prior sessions, carried forward):**

- No fulfillment hubs anywhere — vendor-managed fulfillment everywhere; geographic expansion unit is "metro," not "hub."
- Real-time-ready architecture from day one — event-driven foundation even when user-visible real-time UX is deferred. Don't say "real-time not needed."
- PRD excludes founder personal funding/life context — architecture is product/system spec, not founder financial plan.

### Cross-Cutting Concerns Identified

1. **Event-driven backbone (MVP requirement, Locked Decision #7).** Domain events on every state change; subscribers (email delivery, audit logging, expiry-alert scheduling, analytics ingestion) attach without touching publishers. Stripe webhook ingestion flows into the same event system. Transport abstraction so polling → SSE/websocket is a swap.
2. **Multi-state regulatory rules engine (MVP, Locked Decision #5).** State × category × product → required documents, format validations, public-registry links, conservative defaults. Drives both vendor-facing onboarding UX and admin-facing verification queue. Versioned for audit replay (NFR66).
3. **Multi-tenancy (vendors as tenants).** Per-vendor data isolation, per-vendor fulfillment configuration, vendor-shareable storefront link for single-player mode, tier-based feature gating, per-tier resource limits, admin role observes across all tenants.
4. **Stripe coupling as platform invariant.** Connect (split payments + KYC delegation + payouts), Tax (per-line per-jurisdiction calculation + threshold monitoring), Webhooks (real-time inbound events with HMAC verification per NFR16, idempotent handlers per NFR34, replay capability per NFR56). PCI scope minimized to Stripe-issued tokens only.
5. **Audit log as event subscriber, not inline write.** Captures admin actions, vendor agreement signings/re-attestations, compliance doc uploads + verification decisions, customer privacy requests, foodborne-illness incident timelines. Immutable (NFR59), ≥7yr retention (NFR60), queryable for regulatory audits and litigation discovery (NFR62).
6. **Privacy-aware data lifecycle as cross-component contract.** Card data → Stripe (never on F2T, NFR9). Banking/W-9/KYC → Stripe Connect (never on F2T, NFR10). Vendor compliance docs → encrypted, admin-role-only access (NFR11). Customer PII → 24h export (NFR22), 30d deletion with pseudonymized audit retention (NFR23). Image uploads → EXIF stripped at upload (NFR27). DPAs with every third-party processor (NFR26).
7. **Per-line-item economics as data model invariant.** Per-line tax (origin × destination × PTC), per-line refunds that reverse splits without affecting other vendors, per-line fulfillment status, per-line cancellation. The order is an envelope around N independent vendor sub-orders sharing a single customer payment.
8. **Real-time-ready data layer.** Reactive subscriptions or push-capable query semantics as first-class platform capability; frontend transport-abstracted so components don't know whether their data source is polling or pushed. Most directly shapes the stack/platform decision in Step 3.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack TypeScript web application — Next.js 16 (App Router, SSR + hybrid client routing, React 19.2) on Vercel, with Convex as the reactive backend platform (database, queries, mutations, scheduled functions, file storage). Real-time-first by platform default; transport hidden by Convex client (HTTP server-to-server via `preloadQuery` for SSR; websocket for client-reactive subscriptions after hydration). Confirmed against PRD locked decisions #7 (real-time-ready architecture is MVP) and #8 (Convex named lead candidate).

### Starter Options Considered

1. **Convex's official Turborepo monorepo template** — `get-convex/turbo-expo-nextjs-clerk-convex-monorepo` — Turborepo + Next.js 16 + Convex + Clerk + Tailwind v4 + React 19, with Expo also wired in (will be removed at init).
2. **`turbotemplate.dev`** — third-party Turborepo + Next.js 16 + Tailwind v4 + shadcn/ui + Clerk + Convex; no Expo; single-maintainer risk.
3. **Compose from scratch** — start with `npm create convex@latest -- -t nextjs-clerk` and add Turborepo manually.

### Selected Starter: Convex Official Turborepo Monorepo Template (Expo stripped)

**Rationale:** Officially maintained by the Convex team; current with Next.js 16 + React 19 + Tailwind v4 + Clerk + Turborepo. The `apps/` + `packages/` shape matches the user's monorepo preference for future team scaling. `packages/backend` (Convex) as a workspace package means future apps can share the same backend without code duplication.

**Initialization Command:**

```bash
npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo
```

**Post-init cleanup (Story #1 — Project Initialization):**

- Delete `apps/native/` (Expo React Native — Farm2Table is mobile-first responsive web only at MVP; native is a Vision-phase item per PRD)
- Remove Expo-related root scripts, deps, and turbo pipeline entries
- Rename `apps/web` to `apps/storefront` — single Next.js app houses customer storefront + vendor portal + admin queue at MVP (split into separate `apps/` later if multi-team development justifies it)
- Add `packages/ui` for shared shadcn/ui components (Base UI primitives)
- Add `packages/rules-engine` placeholder for state × category compliance rules data + matchers
- Initialize **Playwright** for E2E + cross-browser testing
- Install `@convex-dev/resend` Convex component for transactional email
- Configure Stripe SDK in Next.js API routes (`apps/storefront/app/api/stripe/*`) for outgoing API + webhook ingestion
- Run `npx convex ai-files` to add Convex-specific AI-agent context

### Architectural Decisions Provided by Starter (and Step 3 Selections)

**Language & Runtime:**
- TypeScript everywhere — Convex schema, queries, mutations, HTTP actions; Next.js App Router; shared packages
- Node 20+ runtime (Convex Cloud and Vercel both default)

**Framework:**
- Next.js 16 with App Router, React 19.2, Turbopack as default bundler
- Cache Components (PPR + opt-in `use cache`) for selective static + dynamic rendering
- `proxy.ts` (replaces middleware in v16) for auth/redirects at the network boundary
- Next.js 16.2 `AGENTS.md` files generated for AI-agent context (Claude/Cursor)

**Backend Platform:**
- **Convex** for database, reactive queries, mutations, scheduled functions, cron, file storage
- Convex schema in `packages/backend/convex/schema.ts` as single source of truth
- Convex generated types flow to Next.js with zero duplication
- **Function metadata reflection** (`ctx.meta.getFunctionMetadata()`) used by audit log subscriber to capture function-name/visibility automatically (NFR61) without per-mutation boilerplate
- **Transaction metrics reflection** (`ctx.meta.getTransactionMetrics()`) used as proactive safety pattern on queries known to grow (admin queue, audit log queries, rules-engine evaluations) — surfaces "approaching limit" warning event before hitting Convex's per-transaction cap

**Authentication:**
- **Clerk** (production tier ~$25/mo + $0.02/MAU after 10K free)
- **Clerk Organizations** for vendor multi-tenancy:
  - Each vendor (farm/cottage food/commercial/micro) = one Clerk Organization (org name = farm name; org metadata holds Convex `vendorId`, tier, slug)
  - Vendor team members = Org members with roles (`owner`, `admin`, `fulfillment`)
  - Customers = personal users (no org context)
  - Platform operators = members of a separate "Platform" Clerk Organization
- `ConvexProviderWithClerk` bridges Clerk session → Convex auth context
- `useConvexAuth()` (not Clerk's `useAuth()`) for auth state in components
- Clerk webhooks → Next.js API route → Convex internal mutation for user/org lifecycle sync to Convex tables
- Per-tier vendor team-member limits (Foundation: 5, Growth/Pro: unlimited) enforced in Convex `addOrgMember` mutation
- Mandatory admin 2FA (NFR12) configured in Clerk per platform-org member
- `<OrganizationSwitcher>` component for users belonging to multiple farms (rare but possible)

**Styling & Component Library:**
- **Tailwind v4** (CSS-first config via `@import "tailwindcss"`)
- **shadcn/ui with Base UI as primitive layer** (chosen over Radix for: render-prop API clarity vs. asChild confusion, single-package tree-shaking via `@base-ui/react`, MUI-team full-time maintenance, stronger combobox/multi-select primitives, more reliable AI-agent generation)
- shadcn/ui CLI: `npx shadcn@latest create` (selects Base UI at init)
- Shared components in `packages/ui` for cross-app reuse

**Build Tooling:**
- Turborepo for task orchestration, parallel execution, remote caching (Vercel-built)
- npm or pnpm workspaces for package management
- Turbopack as Next.js bundler (default in v16, ~5–10x faster Fast Refresh)

**Testing Framework:**
- **Playwright** for E2E + cross-browser testing (chosen over Cypress because Cypress cannot test WebKit/iOS Safari which the PRD browser matrix requires; Playwright also handles cross-origin iframes natively for Stripe Elements; supports multi-context testing for marketplace flows where vendor + customer interact in the same scenario; free parallel execution; ~2-3x faster than Cypress)
- Browser projects: Chromium, Firefox, WebKit, Mobile Safari, Mobile Chrome (full PRD browser matrix coverage)
- **axe-core** integrated into Playwright tests for accessibility regression gating (NFR48)
- **Convex backend functions** tested with Convex's `convex-test` helpers (in-process, fast, transactional)
- **Test design principle:** meaningful tests over coverage chasing — every test names the behavior protected and the regression scenario prevented (project-wide guardrail; see feedback memory)
- `npx playwright codegen` for record → generated test scaffold
- Playwright Trace Viewer for debugging (DOM snapshots, network logs, console at every step)

**External Integration Pattern:**

| Integration | Lives in | Pattern |
|---|---|---|
| Stripe outgoing API (Connect onboarding URL, refund, customer portal session) | Next.js API routes (`apps/storefront/app/api/stripe/*`) | Client → Next.js API → Stripe SDK → write back to Convex via Convex client |
| Stripe webhooks | Next.js API route (`/api/stripe/webhook`) → Convex internal mutation | Vercel API route receives webhook, verifies HMAC signature with `stripe.webhooks.constructEvent` (NFR16), calls Convex internal mutation that does atomic idempotency check by Stripe `event.id` (NFR34) and emits the domain event (FR65, FR66) |
| Resend transactional email | `@convex-dev/resend` Convex component | Domain event subscribers in Convex enqueue emails via `resend.sendEmail`; component handles batching, retry, idempotency, rate limiting, and webhook delivery status |
| Vendor/customer image upload + EXIF strip | Convex file storage + Convex action (`"use node"` runtime with `exifr`) | Upload → Convex storage → action strips EXIF (NFR27), validates, generates responsive variants → CDN-delivered |
| Future Node-heavy work (PDF generation, complex CSV exports) | Next.js API routes by default | Standard Node ecosystem; tracks with Stripe pattern |

**Code Organization:**

```
farm2table/
├── apps/
│   └── storefront/                    # Next.js 16 app (App Router)
│       ├── app/
│       │   ├── (marketing)/           # SSG/ISR — landing, ToS, privacy
│       │   ├── (storefront)/          # SSR — marketplace, farm/product pages
│       │   ├── (vendor)/              # Auth-gated SSR + client — vendor dashboard
│       │   ├── (admin)/               # Auth-gated SSR + client — admin queue
│       │   └── api/
│       │       ├── stripe/            # Stripe outgoing + webhook handlers
│       │       └── clerk/             # Clerk webhook → Convex sync
│       ├── tests/
│       │   └── e2e/                   # Playwright E2E suites
│       ├── playwright.config.ts
│       └── AGENTS.md                  # AI-agent docs (Next.js 16.2 default)
├── packages/
│   ├── backend/                       # Convex backend
│   │   ├── convex/
│   │   │   ├── schema.ts              # database schema (single source of truth)
│   │   │   ├── auth.config.ts         # Clerk JWT issuer config
│   │   │   ├── http.ts                # HTTP actions (Resend webhook, others)
│   │   │   ├── crons.ts               # scheduled jobs (expiry alerts, etc.)
│   │   │   ├── convex.config.ts       # Convex components (resend, etc.)
│   │   │   └── [domain]/              # queries/mutations grouped by capability
│   │   │       ├── farms.ts
│   │   │       ├── products.ts
│   │   │       ├── orders.ts
│   │   │       ├── vendorApplications.ts
│   │   │       └── auditLog.ts
│   │   └── AGENTS.md
│   ├── ui/                            # shared shadcn/ui components (Base UI)
│   ├── rules-engine/                  # state × category compliance rules data + matchers
│   └── seed-data/                     # canonical seed dump for QA reset (npx convex import)
├── turbo.json
├── package.json
└── AGENTS.md                          # repo-level AI-agent conventions
```

**Development Experience:**
- `npm run dev` from repo root → Turbo orchestrates Next.js dev server + Convex dev sync in parallel
- Convex dashboard provides live data inspection, function logs, and one-click data queries
- Next.js 16.2 forwards browser console errors to terminal (helpful for AI agent feedback loops)
- Hot reload across the stack (Turbopack on Next.js, Convex live function deploys)
- `npx playwright codegen` to record interactions → generated test scaffolds
- Playwright Trace Viewer for debugging failed tests
- **AI-agent context files:**
  - Next.js 16.2 generates `AGENTS.md` per package (default)
  - `npx convex ai-files` adds Convex-specific skills/context (schema patterns, query/mutation conventions, Convex idioms) without bloating the default agent prompt
  - Repo-level `AGENTS.md` documents cross-cutting conventions (event-driven backbone pattern, audit log subscriber pattern, rules-engine versioning, transaction-metrics safety pattern)
- **Inline DB inspection:** `npx convex run --inline-query 'ctxb.query("vendors").withIndex("by_state", q => q.eq("state", "FL")).take(20)'` — scriptable index-aware data inspection without writing a function file

**Hosting & Deployment Topology:**

- **Vercel** — Next.js app + serverless API routes (Stripe handlers, Clerk webhook proxy)
  - Preview deployments per PR; default to pointing at the **qa Convex deployment** for backend (simpler than per-PR Convex previews, gives reviewers real seeded data to interact with)
  - Spin up dedicated Convex preview deployment per-PR only when a change needs data isolation (schema migration, destructive test) via `npx convex deployment create pr-${PR_NUMBER} --type dev --expiration "in 7 days"`
- **Convex Cloud** — Convex backend (database, functions, file storage); three deployment tiers from MVP day one:
  - **dev** — local solo dev backend (`npx convex dev`); Stripe-test mode, Clerk dev instance, Resend sandbox (`testMode: true`); throwaway data
  - **qa** — long-lived pre-prod testing environment (`npx convex deployment create qa --type prod`); Stripe-test mode, separate Clerk instance, Resend with verified `qa.farm2table.app` subdomain; seeded with synthetic vendors across multiple states/categories, synthetic customers, test orders, simulated foodborne-illness reports for incident-response testing; data persists; resettable from `packages/seed-data/` via `npx convex import --replace`. Used for: integration testing (Stripe webhook flows, Resend delivery, Clerk org lifecycle), schema migration validation, scheduled-job/cron behavior over time, rules-engine validation across multi-state synthetic data, admin queue flows, manual QA before promoting code to prod, E2E test runs against stable data
  - **prod** — production from day one of pilot; Gainesville (Oct 2026) and Tampa Bay-Sarasota (Q1 2027) are both live commercial environments sharing the same prod database, audit log, and Stripe live account. **Geographic expansion = adding metros + vendors via feature flags, not promoting environments.** Pilot validation criteria from PRD §Risk Mitigation become a go/no-go decision on whether to flip launch flags, not an environment promotion.
  - Per-branch dev deployments available when team scales beyond solo (`npx convex deployment create $(git branch --show-current) --type dev --select`)
  - Ephemeral agent-mode deployments for AI-assisted feature work (`npx convex deployment create --type dev --expiration "in 5 days"`) — each Claude/Cursor session can isolate its backend from main dev
  - Default env vars managed via `npx convex env default get/set/list` so new dev/preview deployments start with the right Stripe/Clerk/Resend test keys
- **Clerk Cloud** — auth + Organizations; separate instances per Convex tier (dev / qa / prod) with corresponding JWT issuer URLs
- **Resend** — transactional email; sandbox on dev, `qa.farm2table.app` verified domain on qa, prod domain on prod
- All four are PaaS; no infra management at MVP

**Release & audit-trail tracking:** prod deploys via CI invoke `npx convex deploy --message "$GITHUB_SHA: $PR_TITLE"` so release metadata appears in the Convex dashboard History tab — audit-trail-adjacent for compliance defense (NFR59–66 context).

**Note:** Project initialization (template scaffold + post-init cleanup + Playwright + Base UI shadcn + Resend component + Stripe API route stubs + monorepo package skeletons + ai-files + dev/qa Convex deployments) will be Story #1.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical decisions (block implementation):** order/vendorOrders/orderItems schema; validation strategy; auth wrapper pattern; Stripe webhook idempotency; data-fetching pattern by route type; cart schema; CI/CD pipeline shape; env var topology.

**Important decisions (shape architecture):** convex-helpers usage convention; rate limiting split (Clerk + Convex + deferred Vercel-edge); compliance doc encryption posture (Convex default + access wrappers, no app-level encryption); Convex function naming + organization conventions; client island rule for SSR; Cache Components opt-in policy; error boundary layering; UI state policy; monitoring stack; backup/DR runbook.

**Deferred to Growth or beyond:** application-level encryption for compliance docs (BYOK); APM beyond Convex/Sentry/Vercel built-ins; dedicated log aggregation; cart-abandonment email *delivery* (schema captures the data at MVP); Vercel-edge rate limiting; quarterly DR drills (MVP starts at annual per NFR38).

### Data Architecture

**Order schema — three-table envelope model** (Option C from facilitation):

```
orders                  // customer-facing envelope: payment, totals, top-level status
  └─ vendorOrders       // per-vendor slice: fulfillment method/details, vendor-side status, Stripe transfer
       └─ orderItems    // line items: quantity, unitPrice, taxAmount, taxJurisdiction
```

Rationale: FR9 selects fulfillment **per vendor** at checkout, so the per-vendor envelope is the natural data shape. `vendorOrders` carries fulfillment method, fulfillment details (pickup window, delivery address, shipping carrier), per-vendor status (preparing → ready → in_transit → delivered), and the Stripe transfer ID for the per-vendor split. `orderItems` references its `vendorOrderId` envelope and carries per-line tax (origin × destination × PTC), per-line refund tracking, and per-line cancellation independence — preserving NFR-level requirements without flattening the model.

**Validation strategy — Convex `v` + `convex-helpers/validators` for backend; Zod for edges:**

- Convex `v` validators (mandatory) for schema definitions and function args
- `convex-helpers/validators` used pervasively for ergonomic validators: `literals(...)` instead of `v.union(v.literal(...), ...)`, `nullable(v)`, `partial(...)`, `pick(...)`, `omit(...)`
- Zod for client-side form validation (paired with React Hook Form via `@hookform/resolvers/zod`), Next.js API route input validation (Stripe webhook payload shape, Clerk webhook shape), and shared types between client + Next.js API routes
- Convex helpers used pervasively also includes `customFunction` / `customMutation` / `customQuery` (powers the auth wrappers in §Auth) and runtime utilities (`asyncMap`, `nullThrows`, `Table()`)

**Forms — React Hook Form + Zod**, never bare `useState`/`useEffect` for form state.

**Migration approach — dual-write + backfill + cutover** for backwards-incompatible changes:

1. Add new field/table alongside old in `schema.ts`
2. Update writers to write both
3. Backfill existing data via Convex action that paginates and rewrites
4. Update readers to read new
5. Remove old once no readers/writers reference it

Backwards-compatible additions (new field, new table, new index) are direct edits with no migration script. **QA tier is the rehearsal venue** for backwards-incompatible migrations before they hit prod.

**Caching — three layers with explicit policy:**

| Layer | What it caches | Invalidation |
|---|---|---|
| Convex reactive cache | Query results | Automatic via Convex's dependency tracking |
| Next.js Cache Components (`use cache`) | SSR-rendered fragments | `revalidateTag()` from mutations affecting the cached content |
| Vercel CDN | Static assets, ISR pages | Vercel-managed via deploy + revalidate |

(Per-route opt-in policy detailed in §Frontend Architecture.)

### Authentication & Security

**Authorization — custom function wrappers** via `convex-helpers/server`:

| Wrapper | Requires | Used by |
|---|---|---|
| `publicQuery` / `publicMutation` | nothing | marketplace browse, farm profiles, "tell us where to launch next" form |
| `customerQuery` / `customerMutation` | authed user | account, orders, saved farms, customer reports |
| `vendorQuery` / `vendorMutation` | authed user with active vendor org | listings, inventory, vendor dashboard |
| `vendorOwnerMutation` | vendor org `owner` role | invite team, change tier, delete vendor account |
| `adminQuery` / `adminMutation` | platform-admin Clerk org member with mandatory 2FA | verification queue, enforcement actions, audit log read |
| `internalMutation` | called only by Convex actions/scheduled jobs | event subscribers, Stripe webhook handler, cron jobs |

Wrappers populate `ctx.user` and `ctx.org` from Clerk session, eliminating per-function auth boilerplate. AI agents see `vendorMutation` and know auth is enforced.

**Rate limiting — three-source split:**

- **Clerk** handles auth-endpoint rate limiting (sign-in, password reset, MFA verification) — built-in, no work
- **`@convex-dev/rate-limiter` Convex component** handles user-action mutations (place order, submit report, send message, invite team member) — integrated into the wrapper layer so rate limits are declared per-mutation
- **Vercel-edge / Upstash Ratelimit** deferred until anonymous-traffic abuse pattern emerges (e.g., scraper hammering marketplace browse) — premature at MVP

Algorithm choice per use case: token bucket for bursty actions (order placement allows occasional rapid-fire); fixed window for periodic actions (reports max-5-per-hour).

**Compliance-doc encryption — Convex default at-rest + admin-role-only access wrappers**

Decision: trust Convex's default AES-256 at-rest encryption, enforce admin-only access via `adminQuery` wrappers issuing short-lived signed Convex storage URLs. No application-level envelope encryption at MVP — F2T's regulatory regime (FDACS, marketplace facilitator, CCPA/CPRA, FSMA 204) doesn't require BYOK or crypto-shred. Layer in app-level encryption later if enterprise compliance demand emerges (won't at MVP).

```ts
vendorDocuments: defineTable({
  vendorId: v.id("organizations"),
  type: literals(
    "state_ag_license", "fdacs_permit", "usda_exemption",
    "apiary_registration", "business_license", "food_handler_cert", "coi",
  ),
  storageId: v.id("_storage"),
  filename: v.string(),
  uploadedAt: v.number(),
  uploadedBy: v.id("users"),
  expiry: v.optional(v.number()),
  verifiedAt: v.optional(v.number()),
  verifiedBy: v.optional(v.id("users")),
  status: literals("pending", "verified", "rejected", "superseded"),
  rejectionReason: v.optional(v.string()),
})
  .index("by_vendor", ["vendorId"])
  .index("by_status", ["status"])
  .index("by_expiry", ["expiry"])  // for FR59 expiry alerts
```

Read access: `vendorOwnDocReadUrl(docId)` → vendor sees only own docs; `adminDocReadUrl(docId)` → admin sees any. No public-read path exists.

**Sessions / CSRF / CORS — explicit non-decisions** (defaults handle it):

- CSRF: Convex client uses bearer tokens (not cookies), so classical CSRF doesn't apply to backend mutations; Next.js Server Actions have built-in CSRF protection; webhook routes (Stripe, Clerk, Resend) protected by HMAC signature verification, not session
- CORS: All client traffic is same-origin (Vercel) → either same-origin Convex client (websocket) or same-origin API routes; Convex enforces origin allowlisting at the deployment level; no cross-origin browser concerns at MVP
- Sessions: Clerk owns lifecycle (issue, refresh, revoke, logout-everywhere per NFR15); Convex auth is JWT validation against Clerk's JWKS — no session storage on F2T side

### API & Communication Patterns

**Error handling — two-tier with `appError` helper:**

```ts
// helpers/errors.ts
export type AppErrorCode =
  | "auth.unauthenticated" | "auth.forbidden"
  | "validation.invalid"
  | "vendor.tier_limit_exceeded" | "vendor.cancellation_threshold_breached"
  | "order.line_already_refunded"
  | "rules_engine.no_rule_for_state_category"
  | "internal.unexpected"
  // ... grows over time, enumerated, AI-agent-discoverable

export function appError(
  code: AppErrorCode,
  userMessage: string,            // safe to show end user (NFR57)
  data?: Record<string, unknown>, // structured payload for client conditional handling
): never {
  throw new ConvexError({ code, userMessage, ...data });
}
```

| Tier | Cause | Pattern |
|---|---|---|
| Known errors | Business rule violation, validation failure, auth denial | `appError("vendor.tier_limit_exceeded", "Your Foundation tier allows up to 5 team members. Upgrade to Growth to invite more.", { currentTier: "foundation", limit: 5 })` |
| Unexpected errors | DB error, programming bug, network failure | Bubble up → caught by `customMutation` / `customQuery` wrapper → logged to Sentry with function name (via `ctx.meta.getFunctionMetadata()`), user/org identity, args + auto-generated correlation ID → re-thrown as `appError("internal.unexpected", "Something went wrong. Reference: ABC123")` |

NFR57 satisfied: stack traces never reach client; correlation ID enables support escalation; client UI branches on structured error codes.

**Stripe webhook idempotency — dedicated `stripeWebhookEvents` table:**

```ts
stripeWebhookEvents: defineTable({
  stripeEventId: v.string(),
  type: v.string(),
  apiVersion: v.string(),
  receivedAt: v.number(),
  processedAt: v.optional(v.number()),
  status: literals("processing", "processed", "failed", "skipped"),
  errorMessage: v.optional(v.string()),
  retryCount: v.number(),
  payload: v.any(),  // 30-day retention via cron purge
  affectedEntities: v.optional(v.object({
    orderId: v.optional(v.id("orders")),
    vendorOrderId: v.optional(v.id("vendorOrders")),
    vendorId: v.optional(v.id("organizations")),
  })),
})
  .index("by_stripe_event_id", ["stripeEventId"])    // O(1) idempotency check
  .index("by_status_received", ["status", "receivedAt"])
  .index("by_type_status", ["type", "status"])
```

Flow: Vercel API route receives webhook → verifies HMAC (NFR16) → calls Convex internal mutation `stripe.processWebhook` → mutation does atomic idempotency check on `stripeEventId` → dispatches by event type → updates status → emits domain event (FR65/66). Replay capability (NFR56): `adminMutation stripe.replayWebhook({eventId})` re-runs stored payload through dispatch.

Same idempotency pattern, separate slim tables for Clerk (`clerkWebhookEvents`) and Resend (`resendWebhookEvents`).

**Convex function conventions:**

File organization:
```
packages/backend/convex/
├── schema.ts                      # all tables (single source of truth)
├── auth.config.ts                 # Clerk JWT issuer config
├── http.ts                        # HTTP actions (Resend webhook handler, etc.)
├── crons.ts                       # scheduled jobs registry
├── convex.config.ts               # Convex components registration (resend, rate-limiter)
├── helpers/                       # shared utilities (no functions exposed via api)
│   ├── auth.ts                    # custom function wrappers
│   ├── errors.ts                  # appError, AppErrorCode
│   ├── audit.ts                   # audit log subscriber helper
│   └── meta.ts                    # ctx.meta wrappers (txn metrics safety, function metadata)
├── [domain]/                      # one folder per bounded context
│   ├── queries.ts                 # public queries
│   ├── mutations.ts               # public mutations
│   ├── internal.ts                # internal mutations/actions (called by other functions, never client)
│   └── _types.ts                  # domain-specific TS types
└── _generated/                    # Convex CLI generates this
```

Domain folders map to capability clusters: `farms/`, `products/`, `orders/`, `vendorOrders/`, `vendorApplications/`, `auditLog/`, `rulesEngine/`, `customerReports/`, `stripeWebhooks/`, `clerkSync/`, `resendSync/`, `featureFlags/`.

Naming:
- Read by ID: `bySomething` (e.g., `farms.queries.bySlug`)
- List/filter: `list[Filter]` (e.g., `vendorOrders.queries.listByVendor`)
- Create: `create`
- Update: `update[Aspect]` (e.g., `products.mutations.updateInventory`)
- State transition: verb (e.g., `vendorOrders.mutations.markReady`, `vendorApplications.mutations.approve`)

Pagination: every "list" query that could return >50 results uses `paginationOptsValidator`. Default page size 20, max 100, enforced in wrapper layer. Lists known to stay small (e.g., Foundation-tier products max 5) use `.take(N)` with hard cap.

**Function-type rules:**

| Type | Rule |
|---|---|
| Query | Read-only, no external calls, deterministic, reactive |
| Mutation | Read + write, transactional, **never** call external APIs |
| Action | External API calls (Stripe SDK in Next.js, image processing with `exifr`, foundation models in Growth); can call internal queries/mutations; not transactional |
| HTTP action | External HTTP endpoints (Resend webhook receiver) |

**Hard rule:** mutations never call `fetch` or third-party SDKs. External-data flow is action → fetch → call internal mutation with results. Enforced by wrapper layer (`vendorMutation` wraps `mutation`, not `action`); documented in `AGENTS.md`.

### Frontend Architecture

**Data-fetching by route type:**

| Surface | Pattern |
|---|---|
| Marketing, legal, blog, regulatory explainers | Server Component with `fetchQuery` (or pure static); cached with Next.js `use cache` |
| Marketplace browse, farm profiles, product detail, geo landing | Server Component `preloadQuery` → Client Component `usePreloadedQuery` (SSR for SEO + reactive after hydration) |
| Vendor dashboard, admin queue, customer account, order tracking | Client Component with `useQuery` only |
| Checkout flow | Client Component with `useQuery` for cart state; Stripe Elements client-only |
| Search results | Server Component with `preloadQuery` → `usePreloadedQuery` |

**Mutation-side companion rule:** default to Convex mutation called via `useMutation` from Client Components. Server Actions only when external integration (Stripe outgoing) or cookie/redirect semantics require server-side response.

**Client island rule (hard):** `"use client"` goes on the **leaf-most component that actually needs interactivity** — never at page or layout level unless the entire surface is interactive (vendor dashboard, admin queue, checkout). Pages and layouts default to Server Components. Client Components compose around Server Components via the `children` prop pattern.

**Cache Components opt-in policy:**

| Surface | Cache? | Invalidation |
|---|---|---|
| Marketing pages | Yes (`use cache`, long TTL) | `revalidatePath` on rare content edits |
| Legal pages | Yes (`use cache`, long TTL) | `revalidatePath` on legal updates |
| Blog/FAQ/regulatory explainers | Yes (`use cache`) | `revalidateTag('blog')` on publish |
| Geo landing pages (`/local/[city]/[product]`) | Yes (`use cache` with tag) | `revalidateTag('catalog:${city}:${product}')` on matching product changes |
| Marketplace browse / category index | Yes (`use cache` short TTL) | `revalidateTag('catalog')` on product publish/unpublish |
| Farm profile | No (pure SSR `preloadQuery`) | reactive on hydration |
| Product detail | No (pure SSR `preloadQuery`) | reactive on hydration |
| Search results | No (pure SSR `preloadQuery`) | reactive |
| Auth-gated surfaces | Never | — |

Tag taxonomy: `catalog`, `catalog:${city}:${product}`, `blog`, `legal`, `marketing`. Documented in `AGENTS.md` so AI agents call `revalidateTag` from the right mutation sites.

**Cart state — Convex `carts` + `cartItems` + `cartFulfillmentChoices` tables:**

Anonymous browse + add-to-cart with zero email required (cookie-based `sessionId`); email captured at checkout-start (needed anyway for receipts/Stripe). Authenticated cart merges with anonymous cart on sign-in (sums quantities, takes most-recent fulfillment choice per vendor, takes latest price snapshot on conflict).

```ts
carts: defineTable({
  sessionId: v.optional(v.string()),    // anonymous (httpOnly cookie)
  userId: v.optional(v.id("users")),     // authenticated
  createdAt: v.number(),
  updatedAt: v.number(),
  abandonedAt: v.optional(v.number()),

  // Email capture (optional, only if customer started checkout or opted in)
  email: v.optional(v.string()),
  emailSource: v.optional(literals("checkout_start", "save_cart_prompt", "sign_in_merge")),
  emailCapturedAt: v.optional(v.number()),

  // Abandonment email tracking (Growth-phase feature; columns added now)
  abandonmentEmailSentAt: v.optional(v.number()),
  unsubscribedFromCartEmails: v.optional(v.boolean()),
})
  .index("by_session", ["sessionId"])
  .index("by_user", ["userId"]),

cartItems: defineTable({
  cartId: v.id("carts"),
  productId: v.id("products"),
  variantId: v.optional(v.id("productVariants")),
  vendorId: v.id("organizations"),
  quantity: v.number(),
  unitPriceSnapshot: v.number(),
  addedAt: v.number(),
  availability: literals("available", "out_of_stock", "vendor_unavailable", "removed"),
})
  .index("by_cart", ["cartId"])
  .index("by_cart_vendor", ["cartId", "vendorId"]),

cartFulfillmentChoices: defineTable({
  cartId: v.id("carts"),
  vendorId: v.id("organizations"),
  fulfillmentMethod: literals("pickup", "local_delivery", "shipping"),
  fulfillmentDetails: v.object({ /* pickup window, address, etc. */ }),
})
  .index("by_cart_vendor", ["cartId", "vendorId"]),
```

Anonymous cart retention: 0–7 days active (cookie + cart fully accessible), 7–30 days marked `abandonedAt` (visible to returning user with "prices may have changed" banner; powers cart-abandonment metric per Measurable Outcomes), >30 days hard-purged by scheduled cron. Cookie: `httpOnly`, `secure`, `sameSite=lax`, sliding 30-day Max-Age. Cleared on sign-in after merge.

Authenticated carts persist indefinitely while account active; purged on account deletion (NFR23).

Abandonment email *delivery* is a Growth feature — schema captures the data at MVP, cron flips on at Growth.

**Error boundary policy — three layers:**

- Layer 1: `app/global-error.tsx` (root fallback)
- Layer 2: per-route-group `error.tsx` (`(marketing)`, `(storefront)`, `(vendor)`, `(admin)`, `checkout/`)
- Layer 3: component-level boundaries via `react-error-boundary` for non-critical sections (recommendations widget, live inventory badge, sidebar stats)

Mutation failures → toast notifications with `userMessage` from `appError`. Query failures → error boundary fallback. Authentication failures → redirect via `proxy.ts`. Sentry captures at wrapper layer (server) and boundary layer (client); both attach correlation ID. Sentry Replay enabled in prod; **disabled** on admin queue and vendor compliance-doc views (sensitive).

**UI state policy:**

| State type | Where it lives |
|---|---|
| Server state | Convex queries (`useQuery` / `usePreloadedQuery`) |
| Form state | React Hook Form + Zod |
| Cart state | Convex `carts` table |
| URL search params (default for shareable/bookmarkable/back-button-able state) | `useSearchParams` + `useRouter` — filters, sort, pagination cursors, search query, geo selector, multi-step wizard progress |
| Component-local UI state | `useState` / `useReducer` — modal open, dropdown, hover, drag preview, transient flickers |
| Cross-component client state | **Zustand or jotai only when documented use case shows URL state and React state both fail** — probably zero use cases at MVP |

### Infrastructure & Deployment

**CI/CD — GitHub Actions, three workflows, trunk-based on `main`:**

1. **PR validation** (every PR): lint, typecheck, Convex schema validation (`npx convex dev --once --typecheck`), `convex-test` unit tests, build check, Playwright smoke (`--project=chromium` against Vercel preview + qa Convex)
2. **Main → qa deploy** (on merge to `main`): `npx convex deploy --target qa --message "$GITHUB_SHA: $COMMIT_SUBJECT"`, Vercel auto-deploys main → qa Vercel project, full Playwright suite across all browser projects (chromium / firefox / webkit / mobile-safari / mobile-chrome) against qa, Sentry release tagged
3. **qa → prod promotion** (manual `workflow_dispatch` with `"PROMOTE"` confirmation): asserts latest qa E2E green, `npx convex deploy --target prod`, Vercel promote, Sentry release tagged for prod, smoke tests against prod, alert + rollback on failure

Branch strategy: trunk-based on `main`, short-lived feature branches (or git worktrees per Convex agent-mode pattern). No long-lived `dev`/`staging` branches — environments diverge from code, which causes deploy confusion.

**Package manager: yarn berry with `nodeLinker: node-modules`** (`.yarnrc.yml`). Familiar yarn syntax, traditional `node_modules/` layout, no PnP friction. Init reconfigures the Convex template's default to yarn (~15 min one-time). CI uses `actions/setup-node@v4` (yarn pre-installed; no corepack needed) + `yarn install --immutable`.

**Caching: pnpm-store equivalent (yarn cache), Turbo remote cache (Vercel-built free tier), Playwright browser binaries cached, Next.js `.next/cache` cached per-PR.**

**Secrets: GitHub Secrets** (Convex deploy keys per-tier, Vercel token, Sentry auth token); `gitleaks` pre-commit hook blocks accidental commits (NFR18).

**Env var topology — three runtime locations + GitHub Secrets:**

| Location | Owns |
|---|---|
| **Vercel env vars** (Production / Preview / Development) | Anything Next.js needs at build/runtime: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_CLIENT_ID`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_APP_URL` |
| **Convex env vars** (per deployment) | Anything Convex functions need: `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `CLERK_JWT_ISSUER_DOMAIN`, Convex-side `SENTRY_DSN` |
| **Convex env defaults** (`npx convex env default set/get/list`) | Test-mode defaults that auto-populate to new dev/preview deployments — new contributor or AI agent's ephemeral deployment is functional with `npx convex dev --once` |
| **GitHub Secrets** | CI-only: `CONVEX_DEPLOY_KEY_QA`, `CONVEX_DEPLOY_KEY_PROD`, `VERCEL_TOKEN`, `SENTRY_AUTH_TOKEN` |

**Sync rule:** secrets that should never drift live in only one place. Stripe webhook secret in Vercel only (Next.js receives Stripe webhooks); Resend webhook secret in Convex only (Convex auto-mounts the Resend webhook handler). No duplication = no drift.

**Local dev:** `.env.local` (gitignored) for Next.js side; Convex dev deployment env vars set once via dashboard or `npx convex env set`; `.env.example` checked in with placeholders + comments.

**Monitoring stack:**

| Concern | Tool | Notes |
|---|---|---|
| Error tracking (NFR52) | **Sentry** | Free tier covers MVP; PII filtering on send (NFR21–29); Session Replay enabled in prod, disabled on admin/compliance-doc surfaces; correlation ID auto-attached from `appError`; source maps uploaded from CI |
| Structured logs (NFR51 ≥30d at MVP, ≥90d at Growth) | **Convex dashboard logs + Vercel Pro logs (30d retention)** | Together meet NFR51 at MVP; defer log aggregation (Axiom, Better Stack Logs) until ≥90d Growth requirement or cross-system correlation pain |
| Uptime (NFR53) | **BetterStack** (free tier 10 monitors, 3-min checks) | Monitors: storefront homepage, browse, Stripe webhook intake, vendor portal route, admin portal route, Convex deployment health; status page doubles as customer/vendor maintenance comms (NFR58) |
| Application metrics (NFR54) | **Convex dashboard + Vercel built-ins** | Per-function call rate, p50/p95/p99 latency, error rate; Sentry Performance for trace-level timing later if needed |
| Business metrics (NFR55) | **Custom admin dashboard** in Next.js admin section, querying Convex directly | GMV, daily/weekly orders, vendor onboarding velocity, admin queue depth, marketplace-sourced order ratio, customer reorder rate, cart abandonment when ≥2 pickup locations, vendor cancellation rates with FR58 threshold visibility |
| Maintenance windows (NFR58) | BetterStack public status page + Resend email (≥48h notice) + in-app banner via feature flag | Emergency maintenance: best-effort post + push banner |

Deferred to Growth: dedicated log aggregation, APM (Datadog/New Relic), synthetic transaction monitoring, on-call paging via PagerDuty (BetterStack alerts to email/SMS suffice for solo founder).

**Backup & disaster recovery:**

- **Primary:** Convex Cloud's native backup + PITR — handles NFR32 RTO ≤2h and NFR33 RPO ≤15min (verify Convex's plan-specific RPO/RTO commitments at production deploy time; escalate to enterprise if needed)
- **Secondary:** weekly manual exports (`npx convex export --target prod`) to AWS S3 (or Cloudflare R2) with 90-day retention as belt-and-suspenders against vendor-level catastrophe — recovery is slow (`npx convex import --replace` to fresh deployment) but data exists outside Convex
- **Logical-error recovery:** Convex PITR within window; augmented by application-level **soft-delete pattern** (vendors `status: active|suspended|removed`, compliance docs `status: pending|verified|rejected|superseded`, products `status: draft|published|archived`, orders state-transitions only); audit log immutable per NFR59; hard delete only where compliance requires (customer account PII purge per NFR23)
- **DR runbook** at `docs/DISASTER_RECOVERY.md`: Convex regional outage / data loss in PITR window / catastrophic data loss / Vercel outage / Clerk outage / Stripe outage scenarios with step-by-step recovery
- **DR drill cadence:** annually at MVP per NFR38, quarterly at Growth; drills run against QA tier (export prod, import to QA, smoke-test)
- **Compliance-doc retention specifically (NFR63):** vendor docs retained for vendor account duration + 7 years after deactivation; no code path to delete a compliance doc before retention expires; on vendor "deletion" (deactivation), docs persist with admin-only access

### Decision Impact Analysis

**Implementation sequence (Story #1 → onwards):**

1. **Story #1 — Project initialization:** template scaffold, Expo strip, yarn berry config, monorepo packages skeleton (`packages/ui`, `packages/rules-engine`, `packages/seed-data`), Playwright init, Base UI shadcn install, Resend Convex component, Stripe API route stubs, AGENTS.md scaffolds, Convex `ai-files`, dev + qa Convex deployments, Vercel project + env vars, Clerk dev + qa instances, Sentry projects, BetterStack monitors. **Foundation for all subsequent stories.**
2. Auth wrapper layer (`helpers/auth.ts`) + error helper (`helpers/errors.ts`) — every subsequent function depends on these
3. Schema scaffold (all tables defined; empty data; types generated)
4. Clerk → Convex user/org sync (Next.js `/api/clerk/webhook` + Convex internal mutation)
5. Vendor onboarding flow (FR16–FR23) — exercises schema, rules-engine v1, doc upload + storage, Clerk Org creation
6. Admin verification queue (FR50–FR51, FR54) — exercises admin wrappers, audit log, soft-delete pattern
7. Marketplace browse + farm profile + product detail (FR1–FR7) — exercises SSR + preloadQuery + Cache Components policy
8. Multi-vendor cart + checkout (FR8–FR15) — exercises cart schema, Stripe outgoing in Next.js API, Stripe Tax integration
9. Stripe webhook intake (`stripeWebhookEvents` table, FR65) — exercises webhook idempotency pattern
10. Order lifecycle + per-vendor fulfillment + substitute matching (FR35–FR39) — exercises orderItems independence, vendorOrders status transitions, event-driven backbone
11. Customer account + reporting + privacy flows (FR41–FR49)
12. Admin enforcement + foodborne-illness incident response (FR55–FR62) — exercises audit log NFR61 capture via `ctx.meta.getFunctionMetadata()`
13. Communication infra (transactional email via @convex-dev/resend, in-app inbox FR63–FR64)

**Cross-component dependencies:**

- Schema is upstream of everything — schema migrations rehearse in QA tier
- Auth wrappers + error helper are upstream of every function — establish in Story #2
- Audit log subscriber pattern is upstream of any mutation that needs NFR61 trail — establish before vendor verification work
- Rules engine v1 (data-driven config in `packages/rules-engine`) is upstream of vendor onboarding — must be seeded with FL + initial expansion-state rules before pilot
- Stripe webhook idempotency table + dispatcher is upstream of order lifecycle Stripe-driven state transitions — establish before checkout work goes live
- Feature flag table is upstream of phased-rollout decisions (pilot → commercial, MVP → Growth UX gating) — establish before launch toggles needed

**Bound to PRD locked decisions (no architectural latitude):**

- Stripe (Connect + Tax + Webhooks) — load-bearing platform commitment (PRD §Strategic Platform Dependencies)
- Multi-state regulatory architecture as MVP (Locked Decision #9)
- Real-time-ready architecture as MVP (Locked Decision #7)
- Foundation tier only at MVP (Locked Decision #4)
- Six MVP user journeys end-to-end (Locked Decision #10)
- Convex (or equivalent) as backend lead (Locked Decision #8) — confirmed Convex
- No fulfillment hubs anywhere (persistent project fact)

## Implementation Patterns & Consistency Rules

These conventions exist to keep AI-agent-written code consistent across PRs and contributors. Every rule here is documented in repo `AGENTS.md` and per-package `AGENTS.md` files so Claude/Cursor reach for the right pattern by default.

### File Naming + Module Exports

| File type | Naming | Example |
|---|---|---|
| **React component files** | `PascalCase.tsx` | `FarmHeader.tsx`, `SaveFarmButton.tsx`, `VendorApplicationForm.tsx` |
| **React hook files** | `useCamelCase.ts` (matches the hook's exported name) | `useCart.ts`, `useVendorContext.ts` |
| **Convex function files** | `camelCase.ts` (matches Convex docs convention) | `queries.ts`, `mutations.ts`, `internal.ts` |
| **Convex helper files** | `camelCase.ts` | `auth.ts`, `errors.ts`, `audit.ts`, `events.ts` |
| **Next.js special files** | lowercase per Next.js convention | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts` |
| **Type files (any kind)** | `[name].types.ts` always | `FarmHeader.types.ts` (colocated), `domainEvents.types.ts` (shared utility), `rulesEngine.types.ts` (package-level) |
| **Constants / config files** | `camelCase.ts` | `tierLimits.ts`, `rulesEngineConfig.ts` |
| **Component test files** | `PascalCase.test.tsx` (matches component) | `FarmHeader.test.tsx` |
| **Convex function test files** | `camelCase.test.ts` (matches function file) | `queries.test.ts`, `mutations.test.ts` |
| **Hook test files** | `useCamelCase.test.ts` | `useCart.test.ts` |
| **Playwright spec files** | `camelCase.spec.ts` | `multiVendorCart.spec.ts`, `verificationQueue.spec.ts` |

**Module exports:**
- One main component per file, **default export**, name matches the file (`export default function FarmHeader() {}` in `FarmHeader.tsx`)
- Sub-components used only by the main component live in the same file; if reused, get their own file
- Component-specific types as named exports alongside the default (`export type FarmHeaderProps`)
- Convex functions: named exports per Convex convention
- Helpers, hooks, utilities: named exports
- Next.js special files use default export per Next.js convention

**No barrel files anywhere.** Packages expose their public surface via the `exports` field in `package.json`:

```jsonc
// packages/ui/package.json
{
  "exports": {
    "./*": "./src/*.tsx",
    "./*.css": "./src/*.css"
  }
}
```

Consumers import explicitly: `import { Button } from "@workspace/ui/Button"`. ESLint blocks `index.ts` / `index.tsx` outside Convex's `_generated/` and Next.js special files. Trade-off — slightly more verbose imports — bought with: automatic tree-shaking, explicit dependencies in code review, faster TypeScript, faster builds, clearer to AI agents.

**Imports:**
- Workspace aliases for cross-package: `@workspace/backend`, `@workspace/ui`, `@workspace/rules-engine`
- Relative paths within a package: `./FarmHeader`, `../helpers/auth`
- Type-only imports use `type` keyword (enabled by `verbatimModuleSyntax`): `import type { Id, Doc } from "@workspace/backend/convex/_generated/dataModel"`
- Import order (auto-enforced by ESLint): node built-ins → external packages → workspace packages → relative parent (`../`) → relative same-dir (`./`) → type-only imports last

### Field & Identifier Naming

**camelCase everywhere internally.** External-protocol naming (Stripe's snake_case, Clerk's snake_case in some payloads) is translated at the API-route boundary; F2T-internal code never sees snake_case.

| Surface | Convention |
|---|---|
| Convex schema fields, function args, return shapes | `camelCase` (e.g., `vendorId`, `createdAt`, `unitPriceSnapshot`) |
| Next.js API route JSON request/response | `camelCase` |
| React component props | `camelCase` |
| React Hook Form field names | `camelCase` |
| URL search params (keys and values) | `camelCase` (e.g., `?certification=usdaOrganic`) |
| Stripe / Clerk webhook payloads | `snake_case` at the boundary, translated to `camelCase` before propagating |

**Naming patterns:**
- Booleans: `is`, `has`, `can`, `should` prefix (`isActive`, `hasShippingAvailable`, `canAcceptOrders`, `shouldNotifyOnExpiry`); avoid bare `active: boolean`
- IDs: always `vendorId`, `customerId`, `orderId` — never `vendor_id`, `vendor`, or bare `id` for foreign refs; document's own ID is `_id` (Convex convention)
- Timestamps: past-tense verb + `At` suffix (`createdAt`, `updatedAt`, `verifiedAt`, `cancelledAt`); future-time fields use noun form (`expiry`); all stored as `number` (epoch ms)
- Date-only values: ISO date string `"YYYY-MM-DD"` with `Date` suffix (`expiryDate`, `harvestDate`)
- Functions/variables: `camelCase`; types/components: `PascalCase`; true compile-time constants: `SCREAMING_SNAKE_CASE`
- Async functions: no `Async` suffix (TypeScript shows return type)
- Event handlers in components: `handle` prefix internally, `on` prefix for prop names that accept handlers (`function handleRemoveClick()` calls `onRemove()` prop)

### TypeScript Style

**`tsconfig.json` strictness — full strict mode plus:**

- `strict: true`
- `noUncheckedIndexedAccess: true` (highest-leverage flag against AI-agent-written bugs)
- `noImplicitOverride: true`
- `noFallthroughCasesInSwitch: true`
- `exactOptionalPropertyTypes: true`
- `useUnknownInCatchVariables: true`
- `verbatimModuleSyntax: true`
- `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`

**Type system rules:**
- **`type` for everything**, no `interface` (more flexible, no accidental declaration merging)
- No `I` prefix on type names (`User`, not `IUser`); no `T` suffix
- Generics: single capital letters when meaning is clear (`T`, `K`, `V`); descriptive `TPayload`, `TAction` when not
- Discriminated unions use `kind` discriminator (not `type` — conflicts with `typeof`)
- `null` for explicit "no result" (Convex idiom for missing rows); `undefined` for default "no value"; never both in the same field
- TypeScript `enum`s forbidden — use `literals(...)` from `convex-helpers/validators` for closed sets, discriminated unions for tagged variants
- `any` forbidden in app code (ESLint `@typescript-eslint/no-explicit-any` errors); `unknown` for "shape unknown, will narrow at use site"
- Branded types via `convex-helpers/validators` `brandedString("email")` for structurally constrained strings (`Email`, `Slug`, `IanaTimezone`)

**Catch with `unknown`:**

```ts
try { ... } catch (e: unknown) {
  if (e instanceof ConvexError) { ... }
  else if (e instanceof Error) { ... }
  else { ... }
}
```

### Date / Time / Timezone Handling

**Library: date-fns** (with `date-fns-tz` for timezone operations). No moment.js, no dayjs, no Luxon.

**Storage:**
- Datetimes: `number` (epoch milliseconds, UTC) — Convex idiom
- Date-only values: ISO date string `"YYYY-MM-DD"` (with `Date` suffix on the field name)

**Wire format:** same as storage — never serialize Date objects across the wire.

**Application logic:**
- All comparisons / arithmetic in UTC
- Vendor-local times for pickup windows: store UTC moment + IANA timezone string per vendor (`"America/New_York"`); render in vendor's TZ on vendor surfaces, customer's TZ on customer surfaces
- Timezone is load-bearing for multi-state operation — pickup window display must always show the vendor's local time clearly

**Display:**
- Native `Intl.DateTimeFormat` API (zero bundle cost) wrapped in named formatters in `lib/datetime.ts`
- Locale: browser default at MVP, settable per user later
- All date display goes through `lib/datetime.ts` — no inline `format()` calls scattered through components

```ts
// apps/storefront/lib/datetime.ts
export function formatLocal(epochMs: number, tz?: string): string { ... }
export function formatRelative(epochMs: number): string { ... }
export function formatPickupWindow(startEpochMs: number, endEpochMs: number, tz: string): string { ... }
export function formatExpiryDate(isoDate: string): string { ... }
```

**External boundaries:** Stripe returns Unix timestamps in seconds — translate to milliseconds at the API route boundary (`stripeTimestamp * 1000`). Stripe Tax handles tax-jurisdiction date logic internally.

### Domain Event Naming + Payload Shape

**Naming:** `domain.actionInPastTense` — lowercase dot-notation, camelCase for both segments. Domain matches schema table name (singular: `vendorOrder` for `vendorOrders` table). Action is past-tense verb (events describe things that already happened, not commands).

Examples:
```
order.placed                        vendorApplication.submitted
order.cancelled                     vendorApplication.approved
order.lineRefunded                  vendorApplication.rejected
order.lineCancelled                 vendorApplication.moreInfoRequested

vendorOrder.markedReady             vendor.suspended
vendorOrder.markedInTransit         vendor.removed
vendorOrder.markedDelivered         vendor.warningIssued
vendorOrder.cancelledByVendor       vendor.cancellationThresholdBreached

complianceDoc.uploaded              customer.accountCreated
complianceDoc.verified              customer.accountDeleted
complianceDoc.rejected              customer.dataExported
complianceDoc.expired               customer.doNotSellOptedIn
complianceDoc.expiryWarningSent

customerReport.filed                incident.foodborneIllnessReported
customerReport.investigationOpened  incident.fdacsCoordinationStarted
customerReport.resolved             incident.resolved

payment.succeeded                   payout.scheduled
payment.failed                      payout.completed
payment.refunded                    payout.failed
payment.disputed

cart.created                        cart.mergedOnSignin
cart.abandoned                      cart.purged
```

Stripe webhook event types stay snake_case at the API route boundary (Stripe's wire format) — translated to F2T's camelCase event before emission via the dispatcher.

**Standardized envelope (every event):**

```ts
type DomainEvent<T extends Record<string, unknown> = Record<string, unknown>> = {
  eventId: string;          // ULID — unique per emission, time-orderable
  eventType: string;        // "order.placed", etc.
  occurredAt: number;       // epoch ms — when the state change happened
  emittedAt: number;        // epoch ms — when this event record was written
  actorId?: Id<"users">;    // who caused the event (undefined for system-emitted)
  actorType: "user" | "vendor" | "admin" | "system" | "stripe" | "clerk";
  correlationId?: string;   // for tracing event chains
  payload: T;               // event-specific shape
};
```

**Convex schema:**

```ts
domainEvents: defineTable({
  eventId: v.string(),
  eventType: v.string(),
  occurredAt: v.number(),
  emittedAt: v.number(),
  actorId: v.optional(v.id("users")),
  actorType: literals("user", "vendor", "admin", "system", "stripe", "clerk"),
  correlationId: v.optional(v.string()),
  payload: v.any(),  // typed via TS DomainEventPayloadMap, validated at emit-site
})
  .index("by_event_id", ["eventId"])
  .index("by_type_emitted", ["eventType", "emittedAt"])
  .index("by_actor", ["actorId"])
  .index("by_correlation", ["correlationId"])
```

**Per-event payload typing** lives in `convex/_types/domainEvents.types.ts` as a discriminated union — single source of truth that emit sites and subscribers both reference. **Emit helper** (`emitEvent` in `convex/helpers/events.ts`) is type-safe — emit-site type-checks against the payload map.

**Event versioning:** if a payload shape needs an incompatible change, version the event type (`order.placed` → `order.placedV2`); subscribers handle both during transition window; clean cutover after backfill.

### Convex React Hook Wrappers

Single canonical entry point for all Convex React hooks — wrapped to give richer return shapes plus query caching across unmounts.

```ts
// apps/storefront/lib/convex.ts
import { makeUseQueryWithStatus } from "convex-helpers/react";
import {
  useQueries,
  usePaginatedQuery as useCachedPaginatedQuery,
} from "convex-helpers/react/cache";
import {
  useMutation as useBaseMutation,
  useAction as useBaseAction,
} from "convex/react";

// Rich-status useQuery + cached
export const useQuery = makeUseQueryWithStatus(useQueries);

// Cached paginated query
export const usePaginatedQuery = useCachedPaginatedQuery;

// useMutation with isPending state
export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): [
  (args: FunctionArgs<Mutation>) => Promise<FunctionReturnType<Mutation>>,
  { isPending: boolean; error: Error | null },
] { /* ... wraps with isPending + error tracking ... */ }

// useAction with isPending state
export function useAction<Action extends FunctionReference<"action">>(
  action: Action,
): [
  (args: FunctionArgs<Action>) => Promise<FunctionReturnType<Action>>,
  { isPending: boolean; error: Error | null },
] { /* ... wraps with isPending + error tracking ... */ }
```

`ConvexQueryCacheProvider` wraps the app at root (`app/providers.tsx`) with `expiration: 300_000ms`, `maxIdleEntries: 250` — fast back-button, fast tab switches, fast filter changes.

**ESLint rule** (`no-restricted-imports`) blocks direct imports of `useQuery`, `useMutation`, `useAction`, `usePaginatedQuery` from `convex/react`, `convex-helpers/react`, `convex-helpers/react/cache` everywhere except `lib/convex.ts` itself. AI agents reaching for the wrong import get blocked at lint time.

`useConvexAuth` (auth state) and `usePreloadedQuery` (SSR-hydrated, already has data) continue to import from `convex/react` directly — no wrapping needed for those.

### Loading & Empty States

**Tri-state pattern via the wrapped `useQuery`:**

```tsx
const { status, data: farm, error } = useQuery(api.farms.queries.bySlug, { slug });

if (status === "pending") return <FarmDetailSkeleton />;
if (status === "error") return <ErrorState error={error} />;
if (farm === null) return <NotFound />;
return <FarmDetail farm={farm} />;
```

| Scenario | Loading mechanism |
|---|---|
| Server Component data fetch (`preloadQuery`, `fetchQuery`) | Next.js `loading.tsx` at route segment for full-page; `<Suspense>` for streaming inner sections |
| Client-side `useQuery` | Explicit `status === "pending"` check with skeleton component |
| `usePreloadedQuery` (SSR-hydrated) | No loading state needed initially; reactive updates imperceptible |
| Mutation in flight | Inline UI state via `useMutation`'s `isPending`; never block whole page |
| Route navigation | Next.js `loading.tsx` automatic |

**Skeletons:**
- Live next to the component they shadow (`FarmDetail.tsx` + `FarmDetailSkeleton.tsx`)
- Use shadcn's `<Skeleton />` primitive, sized to match real layout
- Server Components (no interactivity needed)

**Empty states:**
- Shared `<EmptyState>` in `packages/ui` — icon, title, description, optional CTA
- `null` from a query = "no data found," distinct from loading
- Specific action-oriented copy, never generic "No data"

**Forbidden patterns** (in `AGENTS.md`):
- ❌ Spinners for content loading (use skeletons)
- ❌ Loading states that flash for <100ms (use `usePreloadedQuery` for SSR'd data)
- ❌ Conflating `pending`, `error`, and `data === null` semantics
- ❌ Blocking the whole page on a mutation (disable the action element only)
- ❌ "Loading..." text labels (skeletons everywhere)

### Test Conventions

**Stack:**

| Layer | Tool | File suffix | Location |
|---|---|---|---|
| Convex backend functions | `convex-test` (in-process Convex; real schema, real DB-in-memory) | `.test.ts` | `convex/[domain]/__tests__/queries.test.ts` etc. |
| React components | Vitest + `@testing-library/react` | `.test.tsx` | colocated `__tests__/` folder per component dir |
| Pure utility functions | Vitest | `.test.ts` | colocated `__tests__/` |
| E2E user flows | Playwright | `.spec.ts` | `apps/storefront/tests/e2e/` |

**Convex component test registration** — shared `initConvexTest` helper registers all installed Convex components:

```ts
// packages/backend/convex/__test_helpers/initConvexTest.ts
import { convexTest } from "convex-test";
import resendTest from "@convex-dev/resend/test";
import rateLimiterTest from "@convex-dev/rate-limiter/test";
import schema from "../schema";

const modules = import.meta.glob("../**/*.ts");

export function initConvexTest() {
  const t = convexTest(schema, modules);
  resendTest.register(t);
  rateLimiterTest.register(t);
  return t;
}
```

ESLint blocks direct `import { convexTest } from "convex-test"` everywhere except this file.

**Mocking philosophy** (anchored by the meaningful-tests rule):
- **Don't mock Convex** — `convex-test` runs the real Convex runtime in-process; mutations actually run, queries actually query
- **Don't mock the unit under test**
- **Don't mock cheap things** — `date-fns`, `lib/datetime.ts`, type validators, pure functions: just call them
- **Do mock at external boundaries** — Stripe SDK, Clerk SDK, Resend (in unit tests; integration tests use real test-mode services), foundation-model APIs (Growth)

**Test naming + structure:**
- `describe('moduleName.functionName')`
- `it('describes the behavior in present tense, no "should"')` — `"splits payment across multiple vendors"` not `"should split payment..."`
- AAA pattern (Arrange / Act / Assert) with section comments in non-trivial tests
- Multiple `expect`s OK when asserting facets of the same behavior
- Test names describe **behavior protected**, not function shape

**Top-of-file convention** — every test file declares what it protects:

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

Forces the author (human or AI) to articulate why tests exist before writing them.

**Coverage policy: 100% threshold, gated in CI.**

- Vitest coverage with `--coverage.thresholds.global=100` for statements, branches, functions, lines
- Both `packages/backend` (convex-test) and `apps/storefront` (component + util tests)
- Coverage gate runs in CI; PRs fail if coverage drops below 100%
- **Exclusions** in `vitest.config.ts`:
  - `**/_generated/**` (Convex auto-generated)
  - `**/__test_helpers/**` (test infra)
  - `**/*.types.ts` (no runtime)
  - `**/node_modules/**`
  - `app/**/{layout,error,loading,not-found,global-error}.tsx` (only when trivial render-only; with-logic versions need tests)
  - `**/__tests__/**` (test files themselves)

**The meaningful-tests guardrail** runs in tandem with the coverage gate (each catches what the other misses):
- Coverage catches "we forgot to test this branch entirely"
- Meaningful-tests catches "we tested every branch but the assertions are vacuous"
- "Intentional break" check before committing: comment out the line of production code the test claims to protect; if test still passes, rewrite the test

**Component tests:**
- Query by **role** (Testing Library priority) — finds elements as a screen reader would
- Test what the user experiences, not implementation details
- `userEvent.setup()` for interactions
- No snapshot tests (ossify markup without testing behavior)

**Playwright E2E:**

```
apps/storefront/tests/e2e/
├── fixtures/
│   ├── auth.ts          # signedInCustomer, signedInVendor, signedInAdmin fixtures
│   ├── seed.ts          # qa-tier seed reset before each test
│   └── stripe.ts        # Stripe test card helpers
├── customer/
│   ├── multiVendorCart.spec.ts
│   ├── checkout.spec.ts
│   └── browse.spec.ts
├── vendor/
│   ├── onboarding.spec.ts
│   └── orders.spec.ts
├── admin/
│   ├── verificationQueue.spec.ts
│   └── enforcement.spec.ts
└── smoke/
    └── criticalPaths.spec.ts
```

- Fixtures over helpers (Playwright fixtures provide auth, seed, Stripe test setup as parameters)
- Page Object Model when a page has >3 distinct test files using it
- Smoke suite runs on PR CI; full suite runs post-merge against qa
- E2E coverage doesn't count toward 100% — evaluated by what user paths it protects

**Forbidden test patterns** (`AGENTS.md`):
- ❌ Tests that mock the unit under test
- ❌ Tests that only assert "function returned a value" without checking value's meaning
- ❌ Snapshot tests
- ❌ `expect(true).toBe(true)` placeholder tests
- ❌ Tests with mutation-then-immediate-read patterns that don't exercise concurrency or invariants
- ❌ `// TODO: write a real test` comments in committed code (PR rejection)
- ❌ `it.skip` without `// skip-issue: #123` comment linking the reason
- ❌ Tests written purely to hit coverage threshold without naming what they protect
- ❌ Excluding production code from coverage instead of writing tests (any new entry in `coverage.exclude` requires a justifying comment + PR discussion)
- ❌ "Intentional break" check failing — test passes after production logic is removed/commented (rewrite before merge)

### Pattern Enforcement

**ESLint rules** that enforce these conventions automatically:

| Rule | What it catches |
|---|---|
| `no-restricted-imports` (multiple paths) | Direct imports of `useQuery`/`useMutation`/`useAction`/`usePaginatedQuery` from Convex packages outside `lib/convex.ts`; direct `convexTest` import outside `initConvexTest.ts`; `convex/react` hook bypasses |
| `import/no-namespace` | Namespace imports (`import * as X`) — prevents barrel-substitute patterns |
| Custom rule: no `index.ts` / `index.tsx` | Catches barrel files; allowed only in `_generated/` and Next.js special locations |
| `@typescript-eslint/no-explicit-any` | `any` keyword — must be `unknown` |
| `@typescript-eslint/consistent-type-imports` | Forces `import type` for type-only imports (paired with `verbatimModuleSyntax`) |
| `@typescript-eslint/consistent-type-definitions` | `type` over `interface` |
| `@typescript-eslint/no-restricted-types` | Forbids `enum` keyword |
| `import/order` | Auto-enforces import order |
| `@typescript-eslint/naming-convention` | camelCase variables/functions, PascalCase types/components, no `I` prefix on types |

**`AGENTS.md` enforcement** — every package has an `AGENTS.md` reflecting its specific conventions; repo-root `AGENTS.md` reflects cross-cutting rules. AI agents (Claude/Cursor) read these before writing code.

**Pre-commit hooks** (via `husky` + `lint-staged`):
- ESLint on staged files
- TypeScript typecheck on changed packages
- `gitleaks` scan for secret leakage
- Prettier formatting

**Pull request template** prompts the author to confirm:
- Tests added or updated for new behavior
- Test top-of-file `Protects:` block updated
- Intentional-break check passed
- No new `coverage.exclude` entries (or justified if so)
- AGENTS.md updated if a new convention emerged

## Project Structure & Boundaries

### Complete Project Tree

```
farm2table/
├── README.md                       # quickstart, links to docs/, links to AGENTS.md, links to canonical architecture doc
├── package.json                    # workspace root; engines.node >= 20
├── .yarnrc.yml                     # nodeLinker: node-modules
├── turbo.json                      # task pipeline (lint, typecheck, test, build, dev, e2e:smoke, e2e:full)
├── tsconfig.base.json              # shared compiler options; per-package tsconfigs extend
├── .gitignore
├── .prettierrc                     # formatting config (covers what .editorconfig would have)
├── AGENTS.md                       # repo-level AI agent conventions (cross-cutting)
├── .github/
│   ├── workflows/
│   │   ├── pr.yml                  # PR validation (lint, typecheck, unit + 100% coverage gate, smoke E2E, gitleaks)
│   │   ├── deploy-qa.yml           # main → qa Convex + Vercel; full E2E suite across all browser projects
│   │   └── deploy-prod.yml         # qa → prod (manual workflow_dispatch with PROMOTE confirmation; smoke + Sentry release)
│   ├── PULL_REQUEST_TEMPLATE.md    # checklist: tests added, Protects: block updated, intentional-break check, no new coverage exclusions, AGENTS.md updates
│   └── CODEOWNERS                  # `* @jenchartier` at MVP; updates as team scales
├── docs/
│   ├── DISASTER_RECOVERY.md        # NFR38 runbook
│   ├── DEPLOYMENT_RUNBOOK.md       # standard deploy, rollback, env var rotation, prod backup verification
│   └── ONBOARDING.md               # for future team members (empty at MVP, populated when team scales)
│
├── apps/                           # three Next.js apps, three Vercel projects, three subdomains
│   ├── marketplace/                # farm2table.app — customer-facing, public + customer-auth
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── playwright.config.ts
│   │   ├── vitest.config.ts        # 100% coverage threshold
│   │   ├── eslint.config.js        # extends @workspace/eslint-config/nextjs
│   │   ├── .env.example
│   │   ├── AGENTS.md
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── providers.tsx       # imports WebProviders from @workspace/web-shared/providers
│   │   │   ├── globals.css         # Tailwind import + theme tokens
│   │   │   ├── proxy.ts            # auth gating, redirects (Next 16 replaces middleware)
│   │   │   ├── global-error.tsx    # root fallback (Layer 1 boundary)
│   │   │   ├── not-found.tsx
│   │   │   ├── (marketing)/        # SSG/ISR; `use cache` aggressively
│   │   │   │   ├── error.tsx
│   │   │   │   ├── page.tsx                      # /
│   │   │   │   ├── how-it-works/page.tsx
│   │   │   │   ├── for-farmers/page.tsx
│   │   │   │   ├── about/page.tsx
│   │   │   │   └── faq/page.tsx
│   │   │   ├── (legal)/            # SSG; revalidate on legal updates
│   │   │   │   ├── terms/page.tsx
│   │   │   │   ├── privacy/page.tsx
│   │   │   │   ├── vendor-agreement/page.tsx
│   │   │   │   └── do-not-sell/page.tsx          # NFR24
│   │   │   ├── (storefront)/       # SSR with preloadQuery; reactive on hydration
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx                  # FR1 browse
│   │   │   │   │   ├── [category]/page.tsx
│   │   │   │   │   └── [productId]/page.tsx      # FR3
│   │   │   │   ├── farms/[slug]/                 # FR2, FR6
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── FarmHeader.tsx
│   │   │   │   │   ├── ProductGrid.tsx
│   │   │   │   │   ├── SaveFarmButton.tsx        # client island
│   │   │   │   │   ├── CertificationBadges.tsx
│   │   │   │   │   ├── LiveInventoryBadge.tsx    # client island
│   │   │   │   │   └── __tests__/
│   │   │   │   ├── local/[city]/[product]/page.tsx  # FR4 geo landing
│   │   │   │   └── search/page.tsx
│   │   │   ├── cart/                             # FR8
│   │   │   │   ├── page.tsx
│   │   │   │   ├── CartReview.tsx
│   │   │   │   ├── FulfillmentSelector.tsx       # FR9 per-vendor fulfillment
│   │   │   │   └── __tests__/
│   │   │   ├── checkout/
│   │   │   │   ├── error.tsx
│   │   │   │   ├── page.tsx                      # FR10 single-pay
│   │   │   │   ├── confirmation/[orderId]/page.tsx  # FR13 per-vendor sub-receipts
│   │   │   │   ├── PaymentForm.tsx               # Stripe Elements (iframe)
│   │   │   │   ├── EmailCaptureField.tsx         # 4b — email at checkout-start
│   │   │   │   └── __tests__/
│   │   │   ├── (customer)/         # auth-gated, client-rendered
│   │   │   │   ├── error.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── account/page.tsx              # FR42
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx                  # order history
│   │   │   │   │   └── [orderId]/page.tsx        # FR35 per-vendor tracking
│   │   │   │   ├── saved-farms/page.tsx          # FR7
│   │   │   │   ├── reports/page.tsx              # FR46-FR49
│   │   │   │   ├── data-export/page.tsx          # FR43, NFR22
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx
│   │   │   │       └── delete-account/page.tsx   # FR44, NFR23
│   │   │   └── api/
│   │   │       ├── stripe/
│   │   │       │   ├── webhook/route.ts          # FR65 single webhook entry; verifies HMAC, calls Convex internal mutation
│   │   │       │   └── customer-portal/route.ts  # generates Stripe customer portal session
│   │   │       └── clerk/
│   │   │           └── webhook/route.ts          # Clerk user/org sync to Convex
│   │   ├── components/             # cross-page shared (storefront-specific, not in packages/ui)
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── StatusBanner.tsx    # NFR58 maintenance banner (feature-flag controlled)
│   │   │   └── __tests__/
│   │   ├── lib/
│   │   │   ├── stripe-client.ts    # Stripe Elements client init (browser-side)
│   │   │   └── __tests__/
│   │   └── tests/e2e/
│   │       ├── fixtures/
│   │       │   ├── auth.ts
│   │       │   ├── seed.ts
│   │       │   └── stripe.ts
│   │       ├── customer/
│   │       │   ├── multiVendorCart.spec.ts
│   │       │   ├── checkout.spec.ts
│   │       │   └── browse.spec.ts
│   │       └── smoke/
│   │           └── criticalPaths.spec.ts
│   │
│   ├── vendor/                     # vendors.farm2table.app — vendor portal, vendor-org-scoped
│   │   ├── package.json, next.config.ts, tsconfig.json, playwright.config.ts, vitest.config.ts, eslint.config.js, .env.example, AGENTS.md
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── providers.tsx
│   │   │   ├── globals.css
│   │   │   ├── proxy.ts            # vendor-org membership gating
│   │   │   ├── global-error.tsx
│   │   │   ├── error.tsx
│   │   │   ├── dashboard/page.tsx              # FR30
│   │   │   ├── orders/page.tsx                 # FR28
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                    # FR24
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [productId]/edit/page.tsx
│   │   │   ├── inventory/page.tsx              # FR27
│   │   │   ├── profile/page.tsx                # FR25
│   │   │   ├── fulfillment/page.tsx            # FR26
│   │   │   ├── messages/page.tsx               # FR29
│   │   │   ├── team/page.tsx                   # Clerk Org members; per-tier limits enforced
│   │   │   ├── tier/page.tsx                   # FR32, FR32a
│   │   │   ├── storefront-link/page.tsx        # FR31 (links to farm2table.app/farms/[slug])
│   │   │   ├── (onboarding)/                   # FR16-FR23 multi-step wizard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── category/page.tsx
│   │   │   │   ├── documents/page.tsx
│   │   │   │   ├── stripe-connect/page.tsx
│   │   │   │   ├── attestation/page.tsx
│   │   │   │   └── agreement/page.tsx
│   │   │   └── api/
│   │   │       ├── stripe/
│   │   │       │   └── connect/onboarding/route.ts  # generate Stripe Connect onboarding URL
│   │   │       └── orders/
│   │   │           └── cancel-line/route.ts         # FR36 vendor cancellation triggering automatic refund (calls Stripe + Convex)
│   │   ├── components/
│   │   │   ├── VendorNav.tsx
│   │   │   ├── OnboardingStepIndicator.tsx
│   │   │   └── __tests__/
│   │   ├── lib/
│   │   │   └── stripe-server.ts    # Stripe SDK init for vendor-side API routes
│   │   └── tests/e2e/
│   │       ├── fixtures/auth.ts, seed.ts, stripe.ts
│   │       ├── onboarding.spec.ts
│   │       └── orders.spec.ts
│   │
│   └── admin/                      # admin.farm2table.app — platform-admin Clerk org, mandatory 2FA per NFR12
│       ├── package.json, next.config.ts, tsconfig.json, playwright.config.ts, vitest.config.ts, eslint.config.js, .env.example, AGENTS.md
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── providers.tsx
│       │   ├── globals.css
│       │   ├── proxy.ts            # platform-admin Clerk org membership + 2FA enforcement
│       │   ├── global-error.tsx
│       │   ├── error.tsx
│       │   ├── dashboard/page.tsx              # NFR55 business metrics dashboard
│       │   ├── verification-queue/page.tsx     # FR50, FR51, FR54
│       │   ├── reports/page.tsx                # customer reports queue
│       │   ├── incidents/page.tsx              # FR47, FR56, FR57
│       │   ├── enforcement/page.tsx            # FR55 vendor enforcement actions
│       │   ├── audit-log/page.tsx              # NFR59-NFR62 audit log read
│       │   ├── feature-flags/page.tsx          # phased rollout management
│       │   ├── monitoring/page.tsx             # webhook delivery health, system health
│       │   └── api/
│       │       └── stripe/
│       │           └── refund/route.ts         # FR62 admin discretionary refund
│       ├── components/
│       │   ├── AdminNav.tsx
│       │   ├── VerificationQueueRow.tsx
│       │   └── __tests__/
│       ├── lib/
│       │   ├── stripe-server.ts    # Stripe SDK init for admin refund route
│       │   └── audit-helpers.ts    # admin-specific audit log helpers
│       └── tests/e2e/
│           ├── fixtures/auth.ts, seed.ts
│           ├── verificationQueue.spec.ts
│           └── enforcement.spec.ts
│
├── packages/
│   ├── backend/                    # @workspace/backend — Convex
│   │   ├── package.json, tsconfig.json, vitest.config.ts, eslint.config.js, AGENTS.md
│   │   └── convex/
│   │       ├── schema.ts
│   │       ├── auth.config.ts
│   │       ├── http.ts
│   │       ├── crons.ts
│   │       ├── convex.config.ts                # @convex-dev/resend, @convex-dev/rate-limiter
│   │       ├── helpers/
│   │       │   ├── auth.ts                     # publicQuery, customerMutation, vendorMutation, vendorOwnerMutation, adminMutation, internalMutation
│   │       │   ├── errors.ts                   # appError, AppErrorCode
│   │       │   ├── audit.ts                    # uses ctx.meta.getFunctionMetadata for NFR61
│   │       │   ├── events.ts                   # emitEvent type-safe helper
│   │       │   └── meta.ts                     # ctx.meta.getTransactionMetrics safety wrappers
│   │       ├── _types/
│   │       │   ├── domainEvents.types.ts       # DomainEventPayloadMap discriminated union
│   │       │   ├── actorTypes.types.ts
│   │       │   └── appErrorCodes.types.ts
│   │       ├── _test_helpers/
│   │       │   ├── initConvexTest.ts           # registers @convex-dev/resend + @convex-dev/rate-limiter
│   │       │   └── scenarios.ts                # seedSingleVendorScenario, seedTwoVendorScenario, etc.
│   │       ├── farms/                          # FR1, FR2, FR4-FR7
│   │       ├── products/                       # FR3, FR24, FR27
│   │       ├── vendors/                        # vendor account data; FR25, FR26, FR32
│   │       ├── vendorApplications/             # FR16, FR50-FR53
│   │       ├── vendorDocuments/                # FR18, NFR11, NFR63
│   │       ├── orders/                         # FR8, FR10, FR14, FR35
│   │       ├── vendorOrders/                   # FR28, FR36
│   │       ├── carts/                          # 4b cart schema
│   │       ├── customers/                      # FR41-FR45
│   │       ├── customerReports/                # FR46-FR49
│   │       ├── incidents/                      # FR47, FR56, FR57
│   │       ├── auditLog/                       # NFR59-NFR62
│   │       ├── domainEvents/                   # FR66 event-driven backbone
│   │       ├── stripeWebhooks/                 # FR65, NFR16, NFR34, NFR56
│   │       ├── clerkSync/                      # Clerk webhook → Convex sync
│   │       ├── resendSync/                     # Resend delivery webhook tracking
│   │       ├── featureFlags/                   # phased rollout management
│   │       └── _generated/                     # Convex codegen — never edit
│   │       │   (each domain follows: queries.ts, mutations.ts, internal.ts, __tests__/)
│   │
│   ├── ui/                         # @workspace/ui — shared shadcn + Base UI primitives
│   │   ├── package.json            # exports: ./* → ./src/*.tsx (subpath imports, no barrels)
│   │   ├── tsconfig.json, vitest.config.ts (100% coverage), eslint.config.js, AGENTS.md
│   │   └── src/
│   │       ├── Button.tsx, Dialog.tsx, Card.tsx, Input.tsx, Select.tsx
│   │       ├── Combobox.tsx, MultiSelect.tsx   # Base UI strengths
│   │       ├── Skeleton.tsx, EmptyState.tsx, ErrorState.tsx, Badge.tsx, Toast.tsx
│   │       ├── Form.tsx                        # RHF + Zod glue
│   │       └── __tests__/
│   │       (no styles.css — Tailwind theme tokens live in each consuming app's globals.css)
│   │
│   ├── rules-engine/               # @workspace/rules-engine — state × category compliance rules + matchers
│   │   ├── package.json            # exports: ./rules, ./match, ./types
│   │   ├── tsconfig.json, vitest.config.ts (100% coverage), eslint.config.js, AGENTS.md, README.md
│   │   └── src/
│   │       ├── rules.ts                        # entry: lookup(state, category, products)
│   │       ├── match.ts                        # matcher logic
│   │       ├── states/
│   │       │   ├── FL.ts                       # MVP launch state
│   │       │   ├── NC.ts, TX.ts, GA.ts, PA.ts, TN.ts, ND.ts
│   │       ├── rules.types.ts
│   │       └── __tests__/
│   │
│   ├── web-shared/                 # @workspace/web-shared — shared utilities for all 3 apps
│   │   ├── package.json            # exports: ./convex, ./datetime, ./sentry, ./providers, ./featureFlags, ./errorBoundaries
│   │   ├── tsconfig.json, vitest.config.ts (100% coverage), eslint.config.js, AGENTS.md
│   │   └── src/
│   │       ├── convex.ts                       # wrapped useQuery/useMutation/useAction/usePaginatedQuery (canonical from 5e)
│   │       ├── datetime.ts                     # date-fns formatters
│   │       ├── sentry.ts                       # Sentry init helpers (browser + server)
│   │       ├── providers.tsx                   # WebProviders (ConvexProviderWithClerk + ConvexQueryCacheProvider)
│   │       ├── featureFlags.ts                 # client for querying featureFlags table; useFeatureFlag(key) hook
│   │       ├── ErrorBoundaryFallback.tsx       # shared Layer 2 boundary fallback (correlation ID, retry CTA)
│   │       └── __tests__/
│   │
│   ├── seed-data/                  # @workspace/seed-data — synthetic seed for QA reset
│   │   ├── package.json, tsconfig.json, eslint.config.js, README.md
│   │   └── src/
│   │       ├── generate.ts                     # builds full seed object programmatically (no static seed.zip)
│   │       ├── definitions/
│   │       │   ├── vendors.ts, products.ts, customers.ts, orders.ts, incidents.ts
│   │       ├── resetQa.ts                      # CLI: generate + npx convex import --replace --target qa
│   │       └── __tests__/
│   │
│   └── eslint-config/              # @workspace/eslint-config — shared ESLint configs (config-only, no coverage)
│       ├── package.json            # exports: ./base, ./nextjs, ./convex
│       ├── README.md
│       └── src/
│           ├── base.js                         # shared rules: no-restricted-imports for barrels, naming-convention, no-explicit-any, consistent-type-imports, no-restricted-types (forbids enum), import/order
│           ├── nextjs.js                       # extends base; Next.js plugin; RHF plugin
│           └── convex.js                       # extends base; blocks direct convex/react hook imports outside @workspace/web-shared
│
└── coverage/                       # gitignored; generated per package
```

### File-naming summary (rule enforced via ESLint + AGENTS.md)

- **URL path segments**: `kebab-case` (SEO convention; `app/how-it-works/page.tsx` → `/how-it-works`)
- **React component files**: `PascalCase.tsx` (default export, name matches file)
- **React hook files**: `useCamelCase.ts`
- **Convex function files**: `camelCase.ts` (`queries.ts`, `mutations.ts`, `internal.ts`)
- **Type files (any)**: `[name].types.ts` always
- **Constants/config files**: `camelCase.ts`
- **Component test files**: `PascalCase.test.tsx` (matches component)
- **Convex/hook test files**: `camelCase.test.ts` (matches function file)
- **Playwright E2E specs**: `camelCase.spec.ts`
- **Next.js special files**: lowercase (`page.tsx`, `layout.tsx`, etc. — Next.js convention)

### Architectural Boundaries

**Trust boundaries (auth):**

| Boundary | What crosses | Enforcement |
|---|---|---|
| Browser ↔ Vercel | HTTPS; Clerk session cookies set on `.farm2table.app` (cross-subdomain shared) | Clerk session validation; `proxy.ts` redirects unauthenticated users from gated routes |
| Vercel ↔ Convex | Authenticated function calls (Clerk-issued JWT) | Convex `auth.config.ts` validates JWT against Clerk JWKS; auth wrappers populate `ctx.user` and `ctx.org` |
| Vercel API routes ↔ Stripe | HTTPS with Stripe SDK (server-side keys only) | `STRIPE_SECRET_KEY` in Vercel server env; never client-exposed |
| Vercel API routes ↔ Clerk | HTTPS with Clerk SDK (server-side keys only) | `CLERK_SECRET_KEY` in Vercel server env |
| Stripe → Vercel webhook | Inbound HMAC-signed (FR65, NFR16) | `stripe.webhooks.constructEvent` verifies in `apps/marketplace/api/stripe/webhook/route.ts` before calling Convex |
| Clerk → Vercel webhook | Inbound signed | Clerk webhook signature verification in `apps/marketplace/api/clerk/webhook/route.ts` |
| Convex → Resend | Outbound HTTPS via `@convex-dev/resend` component | `RESEND_API_KEY` in Convex env per tier |
| Resend → Convex webhook | Inbound auto-mounted at `/resend-webhook` | `RESEND_WEBHOOK_SECRET` verified by component |
| `apps/admin` access | Auth-gated to platform-admin Clerk org membership | Mandatory 2FA per NFR12 (TOTP/hardware key); Clerk policy enforced |

**Data boundaries:**

| Boundary | Direction | Pattern |
|---|---|---|
| Customer card data | Stripe-only; **never on F2T** (NFR9) | Stripe Elements iframe; F2T receives only payment intent ID + last4 |
| Vendor banking / W-9 / KYC | Stripe Connect-only; **never on F2T** (NFR10) | Stripe Connect hosted onboarding |
| Vendor compliance docs | F2T-stored in Convex storage, encrypted at rest (NFR11), admin-role-only access | `vendorOwnDocReadUrl` (vendor's own only) and `adminDocReadUrl` (admin sees any) — short-lived signed URLs; no public-read path |
| Customer PII | F2T-stored in Convex; exportable in 24h (NFR22), purgeable in 30d (NFR23) | `customerMutation` enforces account ownership; PII pseudonymized in audit log on deletion |
| Audit log | F2T-stored in Convex, append-only (NFR59), ≥7yr retention (NFR60) | No application code path can delete; subscriber pattern via `domainEvents` |
| Vendor-uploaded image EXIF | Stripped at upload (NFR27 — vendor home address protection) | Convex action with `exifr` runs before storage finalizes |
| Stripe webhook payloads | F2T-stored in `stripeWebhookEvents` for 30 days (replay capability per NFR56) | Cron purges payload field after 30 days; row metadata retained |

**Package dependency graph (one-way only, enforced via ESLint `import/no-restricted-paths`):**

```
apps/marketplace ──┐
apps/vendor       ──┼──> @workspace/backend (api types only)
apps/admin        ──┘    @workspace/ui
                         @workspace/web-shared
                         @workspace/eslint-config (dev)

@workspace/backend ──> @workspace/rules-engine
                       @workspace/eslint-config (dev)

@workspace/ui ──> @workspace/eslint-config (dev)  // pure UI primitives, data-agnostic

@workspace/rules-engine ──> @workspace/eslint-config (dev)  // pure data + functions

@workspace/web-shared ──> @workspace/backend (api types)
                          @workspace/ui (shared fallback components)

@workspace/seed-data ──> @workspace/backend (schema types)
```

Hard rules:
- `packages/backend` never imports from `apps/*` (one-way)
- `packages/ui` never imports from `packages/backend` (UI primitives are data-agnostic)
- `packages/rules-engine` never imports from anywhere except its own internals
- `apps/admin`, `apps/vendor`, `apps/marketplace` never import from each other

**Communication patterns:**

- Within Convex: mutations don't call externals; actions handle external calls and call internal mutations for data writes; queries are reactive; subscribers attach via `domainEvents` watch
- Vercel ↔ Convex: Server Components use `preloadQuery` (HTTP server-to-server); Client Components use wrapped `useQuery` (websocket); mutations via wrapped `useMutation` (websocket from client) or `convex.mutation()` server-side from API routes
- Stripe webhook flow: Stripe → `apps/marketplace/api/stripe/webhook` → verify HMAC (NFR16) → Convex internal mutation `stripe.processWebhook` → atomic idempotency check on `stripeEventId` (NFR34) → dispatch by event type → emit domain event (FR66) → return 200

**External integrations diagram:**

```
Browser ──HTTPS──> Vercel (3 apps: marketplace, vendor, admin)
                     │
                     ├──websocket──> Convex Cloud  (queries/mutations from client)
                     │                  │
                     │                  ├──HTTPS──> Resend  (transactional email via @convex-dev/resend)
                     │                  └─<─HTTP─── Resend  (delivery webhook to /resend-webhook)
                     │
                     ├──HTTPS server-to-server──> Convex Cloud  (preloadQuery from Server Components)
                     │
                     ├──HTTPS──> Stripe API  (outgoing from /api/stripe/* routes per app)
                     │
                     ├──HTTPS──> Clerk API  (server-side Clerk SDK)
                     │
                     ├─<─HTTP─── Stripe  (webhook to apps/marketplace/api/stripe/webhook)
                     │            │
                     │            └──websocket──> Convex Cloud  (internal mutation call)
                     │
                     └─<─HTTP─── Clerk  (webhook to apps/marketplace/api/clerk/webhook)
                                  │
                                  └──websocket──> Convex Cloud  (user/org sync)

Sentry  <──HTTPS──  Vercel (browser + server) AND Convex (server)
BetterStack  ──HTTPS──> Vercel routes (per app) + Convex health endpoint  (uptime polling)
```

### Requirements → Structure Mapping

**FR clusters:**

| FR cluster | Backend domain | Frontend location |
|---|---|---|
| FR1–FR7 Marketplace Discovery & Provenance | `convex/farms`, `convex/products` | `apps/marketplace/app/(storefront)/products`, `farms`, `local`, `search` |
| FR8–FR15 Multi-Vendor Cart, Checkout & Tax | `convex/carts`, `convex/orders`, `convex/vendorOrders` | `apps/marketplace/app/cart`, `checkout`, `api/stripe/*` |
| FR16–FR23 Vendor Onboarding & Compliance | `convex/vendorApplications`, `convex/vendorDocuments`, `packages/rules-engine` | `apps/vendor/app/(onboarding)`, `apps/vendor/api/stripe/connect/onboarding` |
| FR24–FR34 Vendor Storefront & Operations | `convex/products`, `convex/vendors`, `convex/vendorOrders` | `apps/vendor/app/dashboard`, `products`, `inventory`, `profile`, `fulfillment`, `tier`, `team`, `storefront-link` |
| FR35–FR40 Order Lifecycle & Substitute Discovery | `convex/orders`, `convex/vendorOrders`, `convex/products` | `apps/marketplace/app/(customer)/orders`, `apps/vendor/app/orders`, `apps/vendor/api/orders/cancel-line` |
| FR41–FR49 Customer Account, Trust & Reporting | `convex/customers`, `convex/customerReports` | `apps/marketplace/app/(customer)` (all sub-routes) |
| FR50–FR62 Admin Verification, Enforcement & Incident | `convex/vendorApplications`, `convex/incidents`, `convex/auditLog` | `apps/admin/app/verification-queue`, `reports`, `incidents`, `enforcement`, `audit-log`, `api/stripe/refund` |
| FR63–FR72 Communication & Real-Time Foundations | `convex/domainEvents`, `convex/resendSync`, `convex/stripeWebhooks` | `apps/marketplace/api/stripe/webhook`, `clerk/webhook`; messages UI in `(customer)` and `apps/vendor/app/messages` |

**Cross-cutting NFRs:**

| NFR cluster | Lives in |
|---|---|
| NFR1–NFR6 Performance | Vercel SSR + Cache Components; Convex query indexes (`convex/schema.ts`); `packages/web-shared/convex.ts` cached queries |
| NFR7–NFR20 Security | `packages/backend/convex/helpers/auth.ts` wrappers; Clerk per-env config; `apps/marketplace/api/stripe/webhook/route.ts` HMAC verification |
| NFR21–NFR29 Privacy | `packages/backend/convex/customers/mutations.ts` (export, delete); `packages/backend/convex/helpers/audit.ts` pseudonymization; Convex action for EXIF strip in `vendorDocuments` and `products`; `apps/marketplace/app/(legal)/do-not-sell` |
| NFR30–NFR38 Reliability | Convex Cloud SLA; NFR34 idempotency in `convex/stripeWebhooks`; `convex/crons.ts` retry policies; `docs/DISASTER_RECOVERY.md` |
| NFR39–NFR45 Scalability | Convex auto-scaling; `convex/helpers/meta.ts` transaction metrics safety; paginated queries everywhere |
| NFR46–NFR50 Accessibility | `packages/ui` Base UI primitives; axe-core in Playwright tests; `apps/*/tests/e2e/*` accessibility assertions |
| NFR51–NFR58 Observability | `packages/web-shared/sentry.ts`; Convex dashboard; BetterStack monitors; business metrics dashboard in `apps/admin/app/dashboard` |
| NFR59–NFR66 Compliance & Auditability | `packages/backend/convex/auditLog`; `convex/helpers/audit.ts` (uses `ctx.meta.getFunctionMetadata`); `convex/vendorDocuments` retention enforcement |

## Architecture Validation & Revisions

### Validation Pass — Summary

**Coherence ✅** — All stack pieces fit together. Convex + Next.js 16 + Clerk + Stripe + Base UI + Playwright + yarn berry + Turborepo all have documented integrations. Naming patterns are internally consistent (camelCase fields/code, kebab in URLs, PascalCase components, snake_case translated at external boundaries). Package dependency graph is one-way and ESLint-enforced.

**Requirements Coverage ✅** — Every FR cluster (FR1–FR72) maps to a backend domain folder + frontend location. Every NFR cluster (NFR1–NFR66) maps to specific architectural mechanisms. Confirmed against the PRD validation report's 5.0/5 sign-off.

**Implementation Readiness ✅** — Decisions documented with current versions; patterns specified with examples; project structure complete; ESLint + AGENTS.md enforcement layered; AI agent guardrails explicit (meaningful-tests, intentional-break check, 100% coverage gate, function-metadata audit capture).

### Major Revision: Resend Pulled Out of Convex (supersedes earlier sections)

During Step 7 validation, we identified that `@convex-dev/resend` requires React Email rendering, which requires a Convex Node action (`'use node'`). This conflicts with the project rule "no Node runtime in Convex." The original carve-out for `@convex-dev/resend` was based on the assumption that the component avoided Node — that assumption was wrong. **Resend is therefore moved fully into Next.js API routes**, in line with the broader rule that Node-style external integrations live in Next.js.

**Supersedes:**
- Step 3 / Step 6 integration table row "Resend transactional email | `@convex-dev/resend` Convex component" → **see updated row below**
- Step 5 forbidden patterns: add ❌ Calling `resend.sendEmail` from Convex anywhere — Resend is no longer a Convex integration
- `packages/backend/convex/convex.config.ts` no longer registers `@convex-dev/resend`
- `packages/backend/convex/_test_helpers/initConvexTest.ts` no longer calls `resendTest.register(t)`
- The Convex Resend component package is not installed

**Updated email integration row:**

| Integration | Lives in | Pattern |
|---|---|---|
| Email send + delivery tracking | `apps/marketplace/app/api/emails/send/route.ts` (Node runtime) + `apps/marketplace/app/api/resend/webhook/route.ts` | Convex domain-event subscriber schedules a Convex action (V8 isolate); action `fetch`-POSTs to `/api/emails/send` with shared secret + idempotency key; Next.js renders React Email template from `@workspace/email-templates`, calls Resend SDK; Resend webhook lands at `/api/resend/webhook`, propagates delivery status back via Convex internal mutation |

**End-to-end flow (canonical pattern for all emails):**

```
Mutation / webhook handler / cron
  ├─ writes data
  ├─ writes audit log
  └─ emits domainEvent

Convex internal mutation subscriber (watches domainEvents table)
  └─ schedules Convex action

Convex action (V8 isolate, no Node)
  ├─ resolves recipient + data needed for email
  └─ fetch POST → Next.js /api/emails/send
       Headers: { X-Internal-Auth: ${INTERNAL_API_SECRET}, Idempotency-Key: <eventId>-<emailType> }
       Body: { template: "OrderConfirmation", to, data }

Next.js /api/emails/send (Node runtime)
  ├─ verify X-Internal-Auth shared secret
  ├─ import React Email template from @workspace/email-templates
  ├─ render to HTML via @react-email/render
  ├─ call resend.emails.send() with Idempotency-Key header
  ├─ on success: respond 200, optionally write tracking row to Convex via convex.mutation()
  ├─ on rate limit (429): respond 429 with Retry-After (Convex action reschedules)
  └─ on failure: respond 5xx (Convex action retries via scheduler.runAfter with exponential backoff)

Resend → /api/resend/webhook (Node runtime)
  ├─ verify Resend webhook signature
  └─ convex.mutation() → Convex internal mutation updates emailDeliveryEvents table
```

**Rebuilt features (replacing what `@convex-dev/resend` provided):**

| Feature | Implementation |
|---|---|
| Idempotency | `Idempotency-Key` header on Resend API call (Resend native support); composite key = `${eventId}-${emailType}` |
| Retry / durable execution | Convex action's `scheduler.runAfter` retries on 5xx with exponential backoff; max attempts (default 5) tracked in `pendingEmails` Convex table; failures beyond max surface to admin queue |
| Rate limiting | Resend API returns 429 with `Retry-After`; Next.js route propagates; Convex action reschedules per header |
| Webhook delivery tracking | `apps/marketplace/api/resend/webhook/route.ts` verifies signature, calls `convex.mutation()` → writes to `emailDeliveryEvents` Convex table |
| Test mode | Per-environment `From` address (test-mode for dev/qa, prod address for prod); test addresses use Resend's `delivered@resend.dev` patterns |
| Batching (deferred) | Single sends per event at MVP; batching optimization added later if email volume justifies — call Resend's `/emails/batch` from Next.js when queue accumulates |

**Authentication between Convex action → Next.js API route:**

Shared secret pattern. `INTERNAL_API_SECRET` env var stored in both Convex env (per tier) and Vercel env (per tier). Convex action sends as `X-Internal-Auth` header; Next.js route checks header. Rotated annually; rotation procedure in `docs/DEPLOYMENT_RUNBOOK.md`.

### Server Actions vs API Routes — Convention

Decision rule for server-side work in Next.js apps:

- **Server Action** when the caller is a React component (button click, form submit). Type-safe, CSRF-protected via React's encrypted action references, native redirect support.
- **API Route** when the caller is server-side (Convex action, external service, webhook receiver, cron). Standard HTTP semantics, explicit auth via headers.

**F2T concrete usage:**

| Operation | Type |
|---|---|
| Stripe Connect onboarding URL generation (vendor app button) | **Server Action** in `apps/vendor/app/(onboarding)/stripe-connect/actions.ts` |
| Stripe customer portal session generation (customer account button) | **Server Action** in `apps/marketplace/app/(customer)/account/actions.ts` |
| Multi-step form intermediate validation | **Server Action** when used |
| Stripe webhook receiver | **API Route** (`apps/marketplace/app/api/stripe/webhook/route.ts`) |
| Clerk webhook receiver | **API Route** (`apps/marketplace/app/api/clerk/webhook/route.ts`) |
| Resend webhook receiver | **API Route** (`apps/marketplace/app/api/resend/webhook/route.ts`) |
| Email send (called by Convex action) | **API Route** (`apps/marketplace/app/api/emails/send/route.ts`) |
| Admin discretionary refund (admin button) | **Server Action** in `apps/admin/app/enforcement/actions.ts` (calls Stripe SDK + Convex mutation) — supersedes earlier API route plan |
| Vendor cancel-line refund (vendor button) | **Server Action** in `apps/vendor/app/orders/actions.ts` (calls Stripe SDK + Convex mutation) — supersedes earlier API route plan |

Note: Server Actions for refund operations are thin wrappers — they call the Stripe SDK and the Convex mutation, then return success. The Convex mutation does the audit log write + emits the `payment.refunded` domain event, which triggers the refund-notice email via the canonical email flow.

### Gaps Identified and Addressed

**1. Customer in-app inbox missing (FR64)**

Add `apps/marketplace/app/(customer)/messages/page.tsx` — customer-vendor messaging UI. Mirrors `apps/vendor/app/messages/page.tsx`. Both read from `convex/messages` (new domain folder added to backend tree). At MVP this is "basic" messaging per FR64 — in-app inbox for hold/cancellation requests. Real-time chat semantics deferred to Vision.

**2. Email templates location (and revised consumer)**

`packages/email-templates/` workspace package consumed by **`apps/marketplace`** (not by Convex backend, post-revision). Templates are React Email components rendered to HTML at email-send time inside the Next.js API route.

```
packages/email-templates/
├── package.json            # exports: ./OrderConfirmation, ./VendorApplicationApproved, etc.
├── tsconfig.json
├── react-email.config.js   # for `npx react-email dev` local preview server
├── vitest.config.ts        # 100% coverage; snapshot tests of rendered HTML
├── eslint.config.js
└── src/
    ├── OrderConfirmation.tsx
    ├── VendorApplicationApproved.tsx
    ├── VendorApplicationRejected.tsx
    ├── VendorMoreInfoRequested.tsx
    ├── OrderLineRefunded.tsx
    ├── OrderLineCancelled.tsx
    ├── ComplianceDocExpiring.tsx          # FR59
    ├── ComplianceDocExpired.tsx
    ├── FoodborneIllnessIncidentNotice.tsx # FR56
    ├── PayoutCompleted.tsx
    ├── VendorWarningIssued.tsx            # FR55
    ├── VendorTeamInvite.tsx
    └── __tests__/
```

Local preview workflow: `cd packages/email-templates && npx react-email dev` opens a browser preview server for visual iteration without sending real emails or rebuilding the backend.

**3. Stripe Tax PTC mapping (FR11)**

Add `packages/backend/convex/products/taxMapping.ts` — data + lookup function:

```ts
const PTC_BY_CATEGORY = { vegetables: "txcd_99999999", ... };
const PTC_BY_SUBCATEGORY = {
  "beverages-craft-soda": "txcd_soft_drink",
  "beverages-milk": "txcd_99999999",
  "snacks-chips": "txcd_snack_food",
  ...
};
export function lookupPTC(category: string, subcategory?: string): string {
  if (subcategory && PTC_BY_SUBCATEGORY[`${category}-${subcategory}`]) {
    return PTC_BY_SUBCATEGORY[`${category}-${subcategory}`];
  }
  return PTC_BY_CATEGORY[category] ?? "txcd_99999999";
}
```

Used by `convex/orders/internal.ts` at order creation to set per-line `stripePTC`. **Also addresses gap #8** (Stripe Tax subcategory overrides — same module).

**4. Search approach**

Use Convex's built-in `searchIndex` for MVP. Documented indexes in `convex/schema.ts`:

- `products` table: `searchIndex("by_text", { searchField: "searchableText", filterFields: ["category", "vendorState", "practices", "certifications"] })`
- `farms` table: `searchIndex("by_text", { searchField: "searchableText", filterFields: ["state", "city", "practices"] })`

`searchableText` field is denormalized at write time (mutation populates from name + description + tags). Faceted filters via `filterFields`. If search quality is insufficient at pilot scale, escalate to Algolia or Typesense at Growth (documented as future-revisit point in `convex/schema.ts` schema-level comment).

**5. Image upload flow**

Documented client-side flow in repo `AGENTS.md`:

```
1. Client requests upload URL: useQuery(api.products.queries.generateUploadUrl) → returns short-lived signed URL
2. Client POSTs file directly to that URL (browser → Convex storage)
3. Client calls mutation: api.products.mutations.attachImage({ storageId, productId })
   - mutation schedules action: api.products.internal.processImage({ storageId })
4. Action runs (Convex action; no Node needed since image processing uses pure-JS libraries available in V8 isolate):
   - validates content type and size
   - strips EXIF (NFR27) using a V8-compatible EXIF library
   - generates responsive variants (uses Convex's image transformation if available, otherwise pure-JS resizer)
   - updates product record with final storageId(s)
```

Note: The original plan called for `'use node'` action with `exifr`. Per the no-Node-in-Convex rule, image processing must use V8-compatible libraries instead. Practical options:
- `exif-js` or similar pure-JS EXIF stripping (V8-compatible)
- Convex storage's built-in transformations (if and when they support EXIF strip natively)
- Alternative: do image processing in Next.js API route called from Convex action (same fetch pattern as email)

**Recommendation:** start with pure-JS EXIF strip in Convex action (V8 isolate). If image processing needs grow (e.g., heavy resizing), move to Next.js API route same as email. Documented as a forward-looking note.

Same flow applies to `vendorDocuments` (with PDF parsing instead of image processing — PDF parsing is V8-compatible via `pdf.js` or similar).

**6. Substitute matching engine location (FR38, FR40)**

Make explicit: `packages/backend/convex/products/substitutes.ts` for the matcher logic, plus `__tests__/substitutes.test.ts`. Used by `convex/orders/internal.ts` (substitute suggestions on vendor cancellation, FR38) and `convex/products/queries.ts` (browse-time substitute discovery).

**7. Public registry adapters (FR53, Growth)**

Co-locate inside `packages/rules-engine/src/registries/` rather than a separate workspace package — registries are tightly coupled to rules. Empty at MVP; populated in Growth phase.

```
packages/rules-engine/src/
├── rules.ts
├── match.ts
├── states/
├── rules.types.ts
├── registries/             # empty at MVP; populated at Growth (FR53)
│   ├── README.md           # adapter interface specification + add-a-state guide
│   └── (state adapters added at Growth)
└── __tests__/
```

**8. Stripe Tax subcategory overrides** — addressed in gap #3 (same `taxMapping.ts` module).

### Backend Tree Updates (post-validation)

Three additions to `packages/backend/convex/`:

```
convex/
├── messages/                       # NEW: customer-vendor messaging (FR64)
│   ├── queries.ts
│   ├── mutations.ts
│   ├── internal.ts
│   └── __tests__/
├── pendingEmails/                  # NEW: tracks email attempts for retry (replaces @convex-dev/resend's tracking)
│   ├── queries.ts
│   ├── mutations.ts
│   ├── internal.ts
│   └── __tests__/
└── emailDeliveryEvents/            # NEW: tracks Resend webhook delivery events (replaces @convex-dev/resend's deliveryEvents table)
    ├── queries.ts
    ├── mutations.ts
    ├── internal.ts
    └── __tests__/
```

Plus the email-trigger subscribers:

```
convex/domainEvents/
├── ... existing ...
└── emailSubscribers/               # NEW: maps domain events to email types; schedules Convex actions
    ├── orderEmails.ts              # subscribes to order.placed, order.lineRefunded, etc.
    ├── vendorApplicationEmails.ts  # subscribes to vendorApplication.* events
    ├── vendorOperationsEmails.ts   # subscribes to vendor.* events (warnings, suspensions)
    ├── complianceDocEmails.ts      # subscribes to complianceDoc.* events (expiry alerts)
    ├── incidentEmails.ts           # subscribes to incident.* events
    ├── payoutEmails.ts             # subscribes to payout.* events
    ├── cartEmails.ts               # subscribes to cart.abandoned (Growth)
    └── __tests__/
```

Plus the Convex action that bridges to Next.js:

```
convex/emails/                      # NEW: bridge actions (V8 isolate, fetch to Next.js)
├── sendEmail.ts                    # internal action: takes {template, to, data, idempotencyKey}, posts to Next.js /api/emails/send
├── retryEmail.ts                   # internal action: re-attempts failed sends from pendingEmails table
└── __tests__/
```

### Frontend Tree Updates (post-validation)

```
apps/marketplace/app/
├── (customer)/messages/page.tsx    # NEW: customer in-app inbox (FR64)
└── api/
    ├── emails/
    │   └── send/route.ts           # NEW: render React Email template + call Resend SDK
    └── resend/
        └── webhook/route.ts        # NEW: Resend delivery status (replaces auto-mounted Convex handler)
```

### Architecture Completeness Checklist

**Requirements Analysis:** ✅
- Project context thoroughly analyzed (Step 2)
- Scale and complexity assessed (medium-high)
- Technical constraints identified (Stripe coupling, real-time-ready, multi-state regulatory, no fulfillment hubs)
- Cross-cutting concerns mapped (event-driven backbone, rules engine, multi-tenancy, audit log subscriber, privacy lifecycle, per-line-item economics, real-time-ready data layer)

**Architectural Decisions:** ✅
- Critical decisions documented with current versions (Convex / Next.js 16 / Clerk / Stripe / Base UI / Playwright)
- Technology stack fully specified
- Integration patterns defined (Stripe in Next.js, Resend in Next.js, Convex for data + reactive queries)
- Performance considerations addressed (SSR + Cache Components, Convex query indexes, image pipeline)

**Implementation Patterns:** ✅
- File naming conventions established (PascalCase components, camelCase functions, kebab URLs, .types.ts suffix)
- Module export rule (default for components, no barrels, exports field for subpath imports)
- Field naming convention (camelCase internally; snake_case translated at boundaries)
- Date/time policy (date-fns, epoch ms storage, Intl display, vendor-local timezone)
- Domain event naming (`domain.actionInPastTense` camelCase)
- Convex hook wrappers (`useQuery`/`useMutation`/`useAction`/`usePaginatedQuery` from `@workspace/web-shared`)
- Loading state policy (tri-state via richer `useQuery`)
- TypeScript style (strict, type over interface, no enum, no any)
- Test conventions (`__tests__/` folders; `convex-test`, Vitest, Playwright; meaningful tests + 100% coverage gate)
- Component composition (client island pattern; pages default Server Components)
- Server Action vs API Route convention

**Project Structure:** ✅
- Complete directory structure defined (3 apps + 6 packages)
- Component boundaries established (one-way dependency graph, ESLint-enforced)
- Integration points mapped (Stripe, Clerk, Resend, Sentry, BetterStack — all in Next.js boundary)
- Requirements to structure mapping complete (every FR cluster + NFR cluster mapped)

**Validation:** ✅
- Coherence verified
- Requirements coverage verified
- Implementation readiness confirmed
- 8 gaps identified and resolved (including the email-architecture revision)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH — based on:
- PRD pre-validation at 5.0/5
- Stack components have documented integrations and current versions verified
- Patterns specified with concrete code examples
- AI-agent guardrails layered (ESLint enforcement + AGENTS.md + 100% coverage gate + meaningful-tests rule + intentional-break check)
- 3-tier deployment topology supports pilot → commercial transition without environment promotion gymnastics
- Solo-founder bandwidth respected (PaaS-only, no infra management, AI-friendly conventions)

**Key Strengths:**
- Event-driven backbone makes new features additive (subscribers attach without touching publishers)
- Multi-state rules engine versioned for audit replay (NFR66) — adding states is data update, not architectural change (NFR42)
- Three-app split lets each surface evolve independently (marketplace SEO-critical, vendor multi-tenant dashboard, admin internal-tool)
- Audit log captured automatically via `ctx.meta.getFunctionMetadata` — NFR61 satisfied without per-mutation boilerplate
- Convex hook wrappers + ESLint blocks prevent AI-agent drift on the canonical patterns
- Resend pulled fully into Next.js maintains the "no Node in Convex" rule cleanly

**Areas for Future Enhancement (Growth and beyond, not blocking MVP):**
- Application-level encryption for compliance docs (BYOK / crypto-shred) — when enterprise compliance demands it
- Dedicated log aggregation (Axiom) — when ≥90-day retention requirement at Growth lifts beyond Vercel Pro's 30 days
- APM beyond Convex/Sentry/Vercel built-ins (Datadog) — when performance debugging needs warrant
- Synthetic transaction monitoring beyond uptime
- On-call paging via PagerDuty — when team scales beyond solo
- Email batching via Resend `/emails/batch` — when email volume justifies
- Public registry adapters for FR53 — at Growth phase
- AI-assisted document review for FR52 — at Growth phase, when application volume reaches ~10/week

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to `AGENTS.md` (repo root and per-package) for canonical conventions
- Refer to this architecture document for all architectural questions
- When in doubt, prefer the more conservative pattern (e.g., default to Server Components, default to Convex events for cross-component coordination, default to API routes for server-to-server calls)

**First Implementation Story:**

```bash
npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo
```

Then post-init cleanup (per Step 3 plan, with revisions):
- Delete `apps/native/` (no Expo)
- Restructure `apps/web/` → split into `apps/marketplace/`, `apps/vendor/`, `apps/admin/`
- Switch yarn from default to yarn berry with `nodeLinker: node-modules`
- Add the 6 packages (`backend`, `ui`, `rules-engine`, `web-shared`, `seed-data`, `eslint-config`, `email-templates`)
- Add Playwright (not Cypress)
- Switch shadcn primitives to Base UI (`npx shadcn@latest create` with Base UI selection)
- **Skip** `@convex-dev/resend` install (Resend lives in Next.js, not Convex)
- Configure Stripe SDK in app-specific `lib/stripe-server.ts` files
- Add AGENTS.md scaffolds at repo root and per-package
- Run `npx convex ai-files` for Convex-specific AI context
- Provision dev + qa Convex deployments
- Create Vercel projects for all three apps
- Set up Clerk dev + qa instances with Organizations enabled
- Set up Sentry projects (one per environment)
- Set up BetterStack monitors
