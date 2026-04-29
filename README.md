# Farm2Table

Multi-farm marketplace where customers shop fresh, local food across many small farms in a single transaction.

## Authoritative documents

- **Architecture (canonical):** [`_bmad-output/planning-artifacts/architecture.md`](./_bmad-output/planning-artifacts/architecture.md)
- **AI agent conventions (cross-cutting):** [`AGENTS.md`](./AGENTS.md)
- **LLM-optimized rule digest:** [`_bmad-output/project-context.md`](./_bmad-output/project-context.md)
- **Operational runbooks:** [`docs/`](./docs)

When agent guidance disagrees with `architecture.md`, **architecture.md wins** — open a PR to reconcile.

## Stack

- **Runtime:** TypeScript everywhere · Node 20+ · yarn berry workspaces
- **Frontend:** Next.js 16 (App Router, Cache Components, `proxy.ts`), React 19, Tailwind v4, shadcn/ui with **Base UI** primitives
- **Backend:** Convex (V8 isolate only — no Node runtime)
- **Auth:** Clerk (Organizations for vendors; "Platform" Org with mandatory 2FA for admins)
- **Payments:** Stripe Connect (split payments per vendor) + Stripe Tax
- **Email:** Resend, lives in Next.js — `apps/marketplace/app/api/emails/send/route.ts`. (NOT `@convex-dev/resend`.)
- **Tooling:** Turborepo, Playwright (5 browser projects + axe-core), Vitest + Testing Library, ESLint flat config (custom dependency-graph rule), Prettier, husky + lint-staged, gitleaks

## Repo layout

```
apps/
├── marketplace/   customer-facing storefront (port 3000)
├── vendor/        vendor portal (port 3001)
└── admin/         admin tools (port 3002)

packages/
├── backend/        Convex schema + functions (V8 isolate only)
├── ui/             shadcn/ui primitives (Base UI) + composite components
├── rules-engine/   pure-functional rules (verification, compliance, replayable)
├── web-shared/     canonical Convex hook wrappers + datetime + providers
├── seed-data/      qa-tier synthetic data
├── eslint-config/  shared ESLint flat-config presets (incl. dependency-graph rule)
└── email-templates/ React Email templates (rendered + sent from Next.js)
```

The package dependency graph is one-way and ESLint-enforced. `packages/backend` depends on no app; apps depend on packages, never on each other.

## Bootstrap

```sh
yarn install --immutable
yarn typecheck
yarn lint
yarn dev          # all three apps + Convex dev in parallel
yarn playwright test   # empty test set, all browser projects green
```

### First-run setup

1. **Convex:** `npx convex login`, then provision tiers (`npx convex deployment create qa --type prod`, `npx convex deployment create prod --type prod`). Set Convex env defaults: `CLERK_JWT_ISSUER_DOMAIN`, `INTERNAL_API_SECRET`, `SENTRY_DSN`. (Do **not** set Stripe or Resend keys here — those live in Vercel.)
2. **Clerk:** create dev + qa instances with **Organizations enabled**, configure JWT template named `convex`, set cross-subdomain session cookie (`.farm2table.app` in prod).
3. **Vercel:** link three projects (`marketplace`, `vendor`, `admin`), each pointing at the matching `apps/*` build root with the env-var topology in each app's `.env.example`.
4. **Per-app `.env.local`:** copy `.env.example` and fill from above.

See [`docs/DEPLOYMENT_RUNBOOK.md`](./docs/DEPLOYMENT_RUNBOOK.md) for the full deployment flow (authored in Story 1.16).

## Adding dependencies

Install dependencies in the workspace that actually uses them.

```sh
yarn workspace @workspace/marketplace add <pkg>
yarn workspace @workspace/backend add <pkg>
yarn workspace @workspace/ui add <pkg>
```

## Conventions

- **camelCase everywhere internally.** External wire formats (Stripe, Clerk webhooks) translate to camelCase at the route handler boundary, never below.
- **No barrel files.** Consumers import explicitly: `import { Button } from "@workspace/ui/Button"` — never `from "@workspace/ui"`.
- **No Node runtime in Convex.** Anything Node-flavored (Resend SDK, PDFs, exifr, complex CSV) lives in Next.js API routes.
- **Test discipline.** Top-of-file `Protects:` block, intentional-break check, 100% coverage gate, no snapshot tests, no coverage-chasing tests.

Read [`AGENTS.md`](./AGENTS.md) and the per-package `AGENTS.md` files before writing code.
