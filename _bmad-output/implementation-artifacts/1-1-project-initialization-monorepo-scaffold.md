# Story 1.1: Project initialization & monorepo scaffold

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As **the founding developer (Jen)**,
I want **the project initialized from the Convex official Turborepo template, restructured to the three-app + seven-package layout with yarn berry, Playwright, Base UI shadcn, AGENTS.md scaffolds, and dev/qa/prod Convex deployments provisioned**,
so that **every subsequent story plugs into the canonical project structure documented in the architecture without re-litigating layout decisions**.

## Acceptance Criteria

1. **Template scaffold + Expo strip.** Running `npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo` succeeds; `apps/native/` (Expo) is removed along with all Expo-related root scripts, deps, and turbo pipeline entries; root `package.json` no longer references Expo, React Native, or `apps/native`.

2. **Three Next.js apps exist.** `apps/web/` is split into `apps/marketplace/`, `apps/vendor/`, `apps/admin/`. Each app has its own `package.json`, `next.config.ts`, `tsconfig.json`, `playwright.config.ts`, `vitest.config.ts` (with 100% coverage threshold per AR58), `eslint.config.js`, `.env.example`, `AGENTS.md`, `app/layout.tsx`, `app/globals.css`, an empty `app/proxy.ts` skeleton, an empty `app/page.tsx` placeholder, and a `tests/e2e/` directory. The marketplace app additionally scaffolds the cross-cutting `app/api/` route locations referenced by Epic 1's downstream stories (see AC #19 for the `.gitkeep`-only directory list).

3. **Seven workspace packages exist.** `packages/backend/` (Convex; pre-populated by template), `packages/ui/`, `packages/rules-engine/`, `packages/web-shared/`, `packages/seed-data/`, `packages/eslint-config/`, and `packages/email-templates/` each exist with their own `package.json`, `tsconfig.json` (extending `tsconfig.base.json`), `eslint.config.js`, and `AGENTS.md`.

4. **No barrel files; subpath exports configured.** Every package's `package.json#exports` declares subpath exports (e.g., `{"./*": "./src/*.tsx"}` for `packages/ui`). No `index.ts` or `index.tsx` exists outside Convex `_generated/` and Next.js special locations. ESLint's `no-restricted-imports` and the custom no-barrel rule flag any new barrel file.

5. **One-way dependency graph enforced.** ESLint `import/no-restricted-paths` (configured in `packages/eslint-config/src/base.js`) enforces:
   - `packages/backend` does not import from `apps/*`.
   - `packages/ui` does not import from `packages/backend`.
   - `packages/rules-engine` imports nothing outside its own internals.
   - `apps/marketplace`, `apps/vendor`, `apps/admin` do not import from each other.
   Cross-package imports use `@workspace/*` aliases; intra-package imports use relative paths only.

6. **Yarn berry configured with `nodeLinker: node-modules`.** `yarn set version berry` has been run; `.yarnrc.yml` sets `nodeLinker: node-modules`; `yarn install --immutable` succeeds with no PnP errors and produces a traditional `node_modules/` layout.

7. **shadcn/ui initialized with Base UI in `packages/ui/`.** `npx shadcn@latest init` was run with **Base UI** selected (not Radix); subsequent `npx shadcn@latest add` commands resolve Base UI primitives. `packages/ui/AGENTS.md` documents the Base UI convention.

8. **Playwright (not Cypress) is installed in each of the three apps.** Each `playwright.config.ts` declares all five browser projects: `chromium`, `firefox`, `webkit`, `Mobile Safari`, `Mobile Chrome`. `yarn playwright test` runs against the empty test set in each app and reports green for all five projects. `axe-core` is installed in each app for later a11y integration.

9. **`@convex-dev/resend` is NOT installed.** Per post-validation revision, Resend lives in Next.js, not Convex. `packages/backend/convex/convex.config.ts` does not register it; no Resend import exists anywhere under `packages/backend/convex/`.

10. **Three Convex deployments provisioned.** Developer is authenticated to Convex Cloud; running the provisioning commands creates: `dev` (local solo dev backend, throwaway), `qa` (`npx convex deployment create qa --type prod`), and `prod`. `npx convex env default set` populates only the env vars that Convex functions actually need under the post-Resend-revision topology: `CLERK_JWT_ISSUER_DOMAIN`, `INTERNAL_API_SECRET` (shared secret to authenticate Convex actions calling Next.js `/api/emails/send`), and the Convex-side `SENTRY_DSN`. Stripe and Resend keys do **not** live in Convex env (Stripe SDK and Resend SDK live in Next.js — see AC #11).

11. **Three Vercel projects connected.** `marketplace`, `vendor`, and `admin` Vercel projects exist, each connected to the GitHub repo with build commands targeting the correct app, preview deployments enabled, and env vars populated per the post-revision env-var topology. Vercel-side envs: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_CLIENT_ID`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `SENTRY_DSN`, `NEXT_PUBLIC_APP_URL`, `INTERNAL_API_SECRET`. (Resend keys live in Vercel post-revision because the Resend SDK is called from `apps/marketplace/app/api/emails/send/route.ts`, not from Convex.)

12. **Clerk dev and qa instances with Organizations enabled.** Both Clerk instances created with Organizations enabled and the platform-admin Org seeded; the JWT issuer URL is set in the corresponding Convex `auth.config.ts` per tier; the JWT validates end-to-end (a smoke test from a Convex query that calls `ctx.auth.getUserIdentity()` returns a valid identity when invoked with a Clerk-issued token).

13. **AI-agent context files exist.** `npx convex ai-files` has been run and produced Convex-specific AI-agent context. Repo-root `/AGENTS.md` and per-package `AGENTS.md` scaffolds exist documenting the cross-cutting conventions from §"Cross-cutting story conventions" of `epics.md` (public route allowlisting, per-story schema discipline, top-of-file `Protects:` block, audit log subscriber pattern, domain events via `emitEvent()`).

14. **`yarn dev` from repo root works.** Turbo orchestrates Next.js dev servers for all three apps + `npx convex dev` in parallel; each app responds with its placeholder `page.tsx` on its dev port without errors; the Convex dev deployment is healthy (`npx convex dev` reports connected and synced).

15. **`tsconfig.base.json` and root config files exist.** A repo-root `tsconfig.base.json` declares the strict-mode flags from §"TypeScript Style" (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`, `verbatimModuleSyntax`, `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`); each per-package `tsconfig.json` extends it. A root `.prettierrc` exists. A repo-root `turbo.json` declares the task pipeline (`lint`, `typecheck`, `test`, `build`, `dev`, `e2e:smoke`, `e2e:full`).

16. **`docs/` directory exists with placeholder runbooks.** `docs/DISASTER_RECOVERY.md`, `docs/DEPLOYMENT_RUNBOOK.md`, and `docs/ONBOARDING.md` exist as placeholder files (content authored in Story 1.16); each contains a top-of-file H1 + a short "Status: scaffold — content authored in Story 1.16" note so links from `AGENTS.md` resolve.

17. **`.github/` scaffolds exist.** `.github/PULL_REQUEST_TEMPLATE.md` exists with the AR58 checklist (tests added, `Protects:` block updated, intentional-break check passed, no new `coverage.exclude` entries, AGENTS.md updated). `.github/CODEOWNERS` exists with `* @jenchartier`. The three workflow files (`pr.yml`, `deploy-qa.yml`, `deploy-prod.yml`) exist as **scaffolds with TODO content only** — full pipelines are authored in Story 1.13.

18. **Smoke verification.** From a fresh clone, the canonical bootstrap sequence runs end-to-end without error:
    ```
    yarn install --immutable
    yarn typecheck    # all packages compile
    yarn lint         # ESLint passes (will be near-empty rule set; tightens in 1.15)
    yarn dev          # all three apps + Convex dev start
    yarn playwright test  # empty test set, green for all browser projects
    ```

19. **Empty-directory scaffolding policy.** The following canonical directories from the architecture tree are scaffolded as **empty directories with `.gitkeep`** in this story so cross-cutting infrastructure (proxy.ts allowlist, AGENTS.md links, ESLint path rules) resolves day-one. Their actual queries/mutations/routes/components land in their owning stories:
    - **Marketplace `app/api/` cross-cutting webhook + email routes:**
      - `apps/marketplace/app/api/stripe/webhook/.gitkeep` (route lands in Epic 5)
      - `apps/marketplace/app/api/clerk/webhook/.gitkeep` (route lands in Story 1.5)
      - `apps/marketplace/app/api/emails/send/.gitkeep` (route lands in Story 1.4)
      - `apps/marketplace/app/api/resend/webhook/.gitkeep` (route lands in Story 1.4)
    - **Convex post-validation domain folders** (per architecture.md line 1740+):
      - `packages/backend/convex/messages/.gitkeep` (FR64, Epic 7)
      - `packages/backend/convex/pendingEmails/.gitkeep` (Story 1.4)
      - `packages/backend/convex/emailDeliveryEvents/.gitkeep` (Story 1.4)
      - `packages/backend/convex/domainEvents/emailSubscribers/.gitkeep` (Story 1.4)
      - `packages/backend/convex/emails/.gitkeep` (Story 1.4)
    - **Convex test helpers location:** `packages/backend/convex/_test_helpers/.gitkeep` (real `initConvexTest.ts` lands in Story 1.2; the directory exists now so the standing test-coverage exclusion path resolves).

    Vendor and admin app-specific `app/api/` directories (`apps/vendor/app/api/stripe/connect/onboarding/`, `apps/vendor/app/api/orders/cancel-line/`, `apps/admin/app/api/stripe/refund/`) and the `apps/vendor/app/(onboarding)/` route group are **deferred** to their owning stories (vendor onboarding in Epic 2, vendor cancel-line in Epic 6, admin refund in Epic 8) — do NOT scaffold them now. Other Convex domain folders not listed above (`farms/`, `products/`, `vendors/`, `vendorApplications/`, `orders/`, etc.) are likewise created in their owning stories.

## Tasks / Subtasks

- [x] **Task 1 — Template scaffold + Expo strip** (AC: #1)
  - [x] Run `npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo` into `f2t-restructure/` working directory.
  - [x] Delete `apps/native/` entirely.
  - [x] Remove all Expo-related entries from root `package.json` (`scripts`, `devDependencies`, `workspaces` if they reference `apps/native`).
  - [x] Add `"engines": { "node": ">=20" }` to root `package.json` per architecture.md line 1109.
  - [x] Remove Expo-related entries from root `turbo.json` pipeline.
  - [x] Verify `grep -r "expo\|react-native" package.json turbo.json` returns no hits.

- [x] **Task 2 — Three-app split** (AC: #2, #19)
  - [x] Restructure `apps/web/` content into `apps/marketplace/`, then duplicate the scaffold structure (not the content) into `apps/vendor/` and `apps/admin/`.
  - [x] For each app: create `package.json` (with `name: "@workspace/marketplace"` etc., per-app dev/build scripts), `next.config.ts` (App Router defaults, Turbopack), `tsconfig.json` (extends `../../tsconfig.base.json`), `playwright.config.ts` (5 browser projects per AC #8), `vitest.config.ts` (100% coverage threshold), `eslint.config.js` (extends `@workspace/eslint-config/nextjs`), `.env.example`, `AGENTS.md` (scaffold).
  - [x] Each app's `app/` directory: `layout.tsx`, `page.tsx` (placeholder "Hello from {appName}"), `globals.css` (Tailwind import), `proxy.ts` (empty module exporting `export default function proxy() {}` — auth gating wired in 1.5), `tests/e2e/` empty directory with a `.gitkeep`.
  - [x] Marketplace cross-cutting `app/api/` scaffolds (per AC #19): create `app/api/stripe/webhook/.gitkeep`, `app/api/clerk/webhook/.gitkeep`, `app/api/emails/send/.gitkeep`, `app/api/resend/webhook/.gitkeep`. Do NOT create vendor/admin app-specific api directories or `(onboarding)/` route group — those land in their owning stories.
  - [x] Delete the original `apps/web/` once content is migrated.

- [x] **Task 3 — Seven packages scaffolded** (AC: #3, #4, #5)
  - [x] **Common files for every package** (apply uniformly): `tsconfig.json` (extends `../../tsconfig.base.json`), `eslint.config.js` (extends `@workspace/eslint-config/base` or `/nextjs` or `/convex` as appropriate), `AGENTS.md` scaffold, and — for source-bearing packages (`backend`, `ui`, `rules-engine`, `web-shared`, `email-templates`) — `vitest.config.ts` with 100% coverage threshold per AR58. `seed-data` and `eslint-config` are not source-bearing for coverage purposes.
  - [x] **Per-package additions:**
    - `packages/backend/` — already exists from the template. Preserve its `convex/` directory; rename package to `@workspace/backend`.
    - `packages/ui/` — `src/` (empty for now); `package.json` `"exports": { "./*": "./src/*.tsx", "./*.css": "./src/*.css" }`; name `@workspace/ui`.
    - `packages/rules-engine/` — `src/`; `"exports": { "./rules": "./src/rules.ts", "./match": "./src/match.ts", "./types": "./src/rules.types.ts" }`; name `@workspace/rules-engine`.
    - `packages/web-shared/` — `src/`; `"exports": { "./convex": "./src/convex.ts", "./datetime": "./src/datetime.ts", "./sentry": "./src/sentry.ts", "./providers": "./src/providers.tsx", "./featureFlags": "./src/featureFlags.ts", "./errorBoundaries": "./src/ErrorBoundaryFallback.tsx" }`; name `@workspace/web-shared`.
    - `packages/seed-data/` — `src/`; `"exports": { "./generate": "./src/generate.ts", "./resetQa": "./src/resetQa.ts" }`; name `@workspace/seed-data`.
    - `packages/eslint-config/` — `src/` with three config entry points; `"exports": { "./base": "./src/base.js", "./nextjs": "./src/nextjs.js", "./convex": "./src/convex.js" }`; name `@workspace/eslint-config`. **`src/base.js` MUST author the AC #5 dependency-graph rule** (see next subtask).
    - `packages/email-templates/` — `src/`; `"exports": { "./*": "./src/*.tsx" }`; name `@workspace/email-templates`. Add `react-email.config.js` for `npx react-email dev` preview.
  - [x] **Author the `import/no-restricted-paths` rule body in `packages/eslint-config/src/base.js`** (load-bearing for AC #5 — without this, the dependency-graph guarantee is silently empty). The rule encodes the four hard rules from architecture.md §"Project Structure & Boundaries / Architectural Boundaries":
    - `packages/backend` does not import from `apps/*`.
    - `packages/ui` does not import from `packages/backend`.
    - `packages/rules-engine` imports nothing outside its own internals.
    - `apps/marketplace`, `apps/vendor`, `apps/admin` do not import from each other.

    Plus the cross-package alias rule: cross-package imports use `@workspace/*`; intra-package imports use relative paths. Story 1.15 hardens the rule set further (custom no-barrel rule, no-restricted-imports for hooks + date libs, naming-convention) — but this dependency-graph rule **lands in 1.1**.
  - [x] Verify no `index.ts` / `index.tsx` exists anywhere except `convex/_generated/` and Next.js special files: `find . -name "index.ts" -o -name "index.tsx" | grep -v _generated | grep -v node_modules`.

- [x] **Task 4 — Yarn berry + nodeLinker** (AC: #6)
  - [x] At repo root: `yarn set version berry`.
  - [x] Create/edit `.yarnrc.yml` with `nodeLinker: node-modules` and `enableGlobalCache: false`.
  - [x] Edit root `package.json` `"packageManager"` field to match the berry version.
  - [x] Run `yarn install --immutable` (or `yarn install` first to lock, then `--immutable` in CI). Verify `node_modules/` exists at root and per-package and there are no `.pnp.cjs` artifacts.

- [x] **Task 5 — `tsconfig.base.json` + Prettier + turbo.json** (AC: #15)
  - [x] Create `tsconfig.base.json` at repo root with the full strict-mode flag set from project-context.md §TypeScript Style (verbatim — `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`, `verbatimModuleSyntax`).
  - [x] Update each per-package `tsconfig.json` to `"extends": "../../tsconfig.base.json"`.
  - [x] Create `.prettierrc` at repo root with project preferences (trailing commas, 100-char width — match the Convex template's defaults if present).
  - [x] Update `turbo.json` to declare the canonical task pipeline: `lint`, `typecheck`, `test`, `build`, `dev` (persistent), `e2e:smoke`, `e2e:full`. Mark `dev` as `"persistent": true, "cache": false`.

- [x] **Task 6 — Base UI shadcn in `packages/ui/`** (AC: #7)
  - [x] `cd packages/ui && npx shadcn@latest init` — when prompted for primitive layer, **select Base UI** (not Radix).
  - [x] Confirm `packages/ui/components.json` records the Base UI selection.
  - [x] Document the Base UI convention in `packages/ui/AGENTS.md` (when to add a primitive vs. reuse, theme token usage, dark-mode handling — scaffold-level; deepens in 1.6/1.7).
  - [x] **Do not add any actual primitives yet** — that work belongs to Story 1.7. Only the init + config land here.

- [x] **Task 7 — Playwright + axe-core in three apps** (AC: #8)
  - [x] In each of `apps/marketplace`, `apps/vendor`, `apps/admin`: install `@playwright/test` and `axe-core`/`@axe-core/playwright` as dev dependencies.
  - [x] Author `playwright.config.ts` declaring all five browser projects: `chromium`, `firefox`, `webkit`, `Mobile Safari` (use Playwright's `devices['iPhone 13']`), `Mobile Chrome` (use `devices['Pixel 7']`).
  - [x] Run `npx playwright install --with-deps` to fetch browser binaries.
  - [x] Verify `yarn playwright test` from each app reports green (empty test set) for all five projects.
  - [x] Confirm Cypress is **not** installed anywhere (`grep -r "cypress" package.json apps/*/package.json` returns nothing).

- [x] **Task 8 — Convex backend scaffolds** (AC: #9, #19)
  - [x] Verify `packages/backend/package.json` does not list `@convex-dev/resend`.
  - [x] Verify `packages/backend/convex/convex.config.ts` does not register Resend (will register `@convex-dev/rate-limiter` later — leave as scaffold for now).
  - [x] If the template installed `@convex-dev/resend`, remove it: `yarn remove @convex-dev/resend` from the backend workspace and delete any auto-generated registration.
  - [x] Create the post-validation Convex domain folders as **`.gitkeep`-only** (per AC #19): `packages/backend/convex/messages/.gitkeep`, `pendingEmails/.gitkeep`, `emailDeliveryEvents/.gitkeep`, `domainEvents/emailSubscribers/.gitkeep`, `emails/.gitkeep`. Their queries/mutations/internal/test files land in their owning stories.
  - [x] Create `packages/backend/convex/_test_helpers/.gitkeep` so the standing test-coverage exclusion path resolves. The real `initConvexTest.ts` (per project-context.md §Test Conventions) lands in Story 1.2.
  - [x] Do NOT scaffold other Convex domain folders (`farms/`, `products/`, `vendors/`, `vendorApplications/`, `orders/`, `vendorOrders/`, `carts/`, `customers/`, `customerReports/`, `incidents/`, `auditLog/`, `domainEvents/` core, `stripeWebhooks/`, `clerkSync/`, `resendSync/`, `featureFlags/`) — they're created in their owning stories per the `epics.md` sequence.

- [x] **Task 9 — Convex deployments (dev / qa / prod)** (AC: #10)
  - [x] Authenticate: `npx convex login`.
  - [x] Initialize dev: `npx convex dev` from `packages/backend` (creates `dev` deployment).
  - [x] Provision qa: `npx convex deployment create qa --type prod` (long-lived pre-prod tier).
  - [x] Provision prod: `npx convex deployment create prod --type prod`.
  - [x] Set Convex env defaults that auto-populate to new dev/preview deployments. Under the post-Resend-revision topology, only env vars Convex functions actually need: `npx convex env default set CLERK_JWT_ISSUER_DOMAIN <dev-clerk-issuer>`, `npx convex env default set INTERNAL_API_SECRET <random>` (shared secret for Convex action → Next.js `/api/emails/send`), `npx convex env default set SENTRY_DSN <convex-side-dsn>`. Per-deployment values for qa and prod are set explicitly via `npx convex env set --target qa ...` and `--target prod ...`.
  - [x] Do NOT set `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, or any Stripe key as Convex env defaults — those SDKs live in Next.js (Vercel env, Task 10).
  - [x] Verify all three deployments visible in `npx convex deployment list`.

- [x] **Task 10 — Vercel projects** (AC: #11)
  - [x] Create three Vercel projects via `vercel link` from each app directory (or via the Vercel UI), each pointing at the same GitHub repo with the build root set to `apps/marketplace`, `apps/vendor`, `apps/admin` respectively.
  - [x] For each project, configure Vercel env vars per AC #11. Marketplace gets the full set (it hosts the Stripe / Clerk / Resend / emails routes); vendor and admin get the subset they need (no Resend keys, no webhook secrets they don't receive). Required for marketplace: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_CLIENT_ID`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `SENTRY_DSN`, `NEXT_PUBLIC_APP_URL`, `INTERNAL_API_SECRET`. Use Vercel's three scopes (Production / Preview / Development).
  - [x] Confirm preview deployments are enabled (default behavior).
  - [x] Smoke-test: push a no-op commit and verify each project produces a successful preview build.

- [x] **Task 11 — Clerk dev + qa instances** (AC: #12)
  - [x] Create two Clerk instances (dev and qa) via Clerk dashboard. Enable **Organizations** in each.
  - [x] In each instance, create a "Platform" Clerk Organization (will hold platform-admin members).
  - [x] Set the JWT issuer URL in the corresponding Convex deployment's `auth.config.ts` per tier (this is per-tier env config, not a code-level branch).
  - [x] In each Clerk instance, configure the JWT template named `convex` per Convex's Clerk integration docs.
  - [x] **Configure cross-subdomain session cookies per architecture.md line 1419.** In each Clerk instance, set the session cookie domain to `.farm2table.app` (prod) / `.farm2table.qa` or equivalent for qa / `localhost` for local dev. This is the load-bearing setting that lets `marketplace`, `vendor`, and `admin` subdomains share the Clerk session — without it, every subdomain hop logs the user out.
  - [x] Verify end-to-end: from a local Next.js dev session signed into the dev Clerk instance, call a stub Convex `publicQuery` that returns `ctx.auth.getUserIdentity()` — confirm the returned identity is non-null and contains the expected `iss` and `sub`.

- [x] **Task 12 — AI-agent context files (AGENTS.md + ai-files)** (AC: #13)
  - [x] Create repo-root `/AGENTS.md` with the cross-cutting conventions index, pointing to:
    - The architecture document as authoritative source.
    - `_bmad-output/project-context.md` as the LLM-optimized rule digest.
    - The five cross-cutting story conventions verbatim from `epics.md`.
    - The package dependency graph (one-way, ESLint-enforced).
    - The "no Node in Convex" rule.
    - The audit log subscriber + domain event emit-via-helper rules.
  - [x] Create per-package `AGENTS.md` scaffolds (one per app, one per package). Each cites repo-root AGENTS.md as the canonical source and lists the package-specific conventions called out in the architecture's §"AGENTS.md Hierarchy" table.
  - [x] Run `npx convex ai-files` from `packages/backend` — verify it produces Convex-specific context files.

- [x] **Task 13 — `docs/`, `.github/`, and root README scaffolds** (AC: #16, #17)
  - [x] Update repo-root `README.md` (the Convex template ships one) to a project-specific quickstart that links to: `_bmad-output/planning-artifacts/architecture.md` (canonical architecture), `AGENTS.md` (cross-cutting AI conventions), `docs/` (runbooks), and the canonical bootstrap sequence from AC #18. Per architecture.md line 1108.
  - [x] Create `docs/DISASTER_RECOVERY.md`, `docs/DEPLOYMENT_RUNBOOK.md`, `docs/ONBOARDING.md` as placeholder files (H1 + "Status: scaffold — authored in Story 1.16" line).
  - [x] Create `.github/PULL_REQUEST_TEMPLATE.md` with the AR58 checklist verbatim (Tests added or updated; `Protects:` block updated; Intentional-break check passed; No new `coverage.exclude` entries; AGENTS.md updated if a new convention emerged).
  - [x] Create `.github/CODEOWNERS` with `* @jenchartier`.
  - [x] Create `.github/workflows/pr.yml`, `.github/workflows/deploy-qa.yml`, `.github/workflows/deploy-prod.yml` as **scaffold files only** with a single `echo "TODO: Story 1.13"` step. Real pipelines land in Story 1.13.

- [x] **Task 14 — `yarn dev` smoke + bootstrap verification** (AC: #14, #18)
  - [x] From repo root, run `yarn dev`. Confirm Turbo starts all three Next.js dev servers (each on a distinct port — assign explicit `--port` flags in each app's `dev` script: marketplace 3000, vendor 3001, admin 3002) plus `npx convex dev` in parallel.
  - [x] Hit each app's placeholder page in a browser; confirm a 200 response and the placeholder text renders.
  - [x] Run the canonical bootstrap sequence from a fresh clone (in a scratch directory or git worktree): `yarn install --immutable && yarn typecheck && yarn lint && yarn dev` — confirm green at each step.
  - [x] Run `yarn playwright test` from each app — confirm green empty test set across all five browser projects.

## Dev Notes

### Critical Implementation Rules (load-bearing for this story)

**Architectural authority:** `_bmad-output/planning-artifacts/architecture.md` is the source of truth. Where it disagrees with `_bmad-output/project-context.md`, architecture wins. The `_bmad-output/planning-artifacts/architecture.md` §"Architecture Validation & Revisions" supersedes earlier sections — particularly the "Major Revision: Resend Pulled Out of Convex" block at line 1541, which **overrides** the earlier story-AC reference to installing the Resend Convex component.

**Scope discipline (per `epics.md` cross-cutting convention #2 — per-story schema discipline):** This story scaffolds infrastructure only. Do **not**:
- Add Convex tables (those land in 1.2+ per the `epics.md` story sequence).
- Author the auth wrapper functions (Story 1.2).
- Implement Clerk → Convex sync code (Story 1.5).
- Author event-backbone code or audit-log subscriber (Story 1.3).
- Install design tokens or build UI primitives (Stories 1.6, 1.7).
- Author full CI/CD pipelines (Story 1.13).
- Implement ESLint custom rules beyond the basic `import/no-restricted-paths` dependency graph rule (Story 1.15 hardens enforcement with the no-barrel custom rule, hook-import restrictions, naming-convention, etc.).
- Create Sentry projects, configure Sentry DSNs in code, or wire BetterStack monitors (Story 1.12 — Monitoring & observability stack). Setting the Vercel `SENTRY_DSN` env var slot from AC #11 is fine; instrumenting code is not.
- Populate `_test_helpers/initConvexTest.ts`, `web-shared/src/convex.ts`, or any other source-bearing scaffold with real code — Story 1.1 leaves them as empty stubs / `.gitkeep`.

What you **are** doing: getting the file/folder skeleton, package wiring, deployments, and toolchain in place so 1.2 onwards can compile and `yarn dev` from minute one.

**No-Node-in-Convex rule:** `packages/backend/convex/` must not contain any Node-runtime action (`'use node'`). The Convex backend runs in V8 isolate only. Anything Node-flavored (PDF, Resend SDK, exifr, complex CSV) lives in Next.js API routes. This is the load-bearing architectural commitment that drove the Resend revision — preserve it.

**Real-time-ready architecture:** The architecture is event-driven and real-time-ready from day one even when user-visible real-time UX is deferred. This story does not author event code, but the package skeleton must not preclude it (e.g., do not delete `convex/domainEvents/` if the template scaffolds it).

**Three apps, never `apps/web` or `apps/storefront`:** Earlier architecture sections (pre-validation) referenced `apps/storefront` as a single app. The post-validation tree at architecture.md line 1102+ canonicalizes the three-app split: `apps/marketplace`, `apps/vendor`, `apps/admin`. Do not introduce `apps/storefront` or `apps/web` anywhere — these are the validated, canonical names.

**No fulfillment hubs anywhere:** Persistent project fact. Ignore any incidental "hub" framing; geographic expansion = adding metros + vendors via feature flags, not infrastructure.

### Source Tree Components to Touch (NEW files, no existing code being modified — this is project init)

Everything in this story is creation, not modification. Authoritative tree spec: `architecture.md` §"Project Structure & Boundaries / Complete Project Tree" (line 1104+) plus the post-validation additions at line 1740+ (`messages/`, `pendingEmails/`, `emailDeliveryEvents/`, `domainEvents/emailSubscribers/`, `emails/` Convex domains; `apps/marketplace/api/emails/send/route.ts` and `api/resend/webhook/route.ts`). Note: those Convex domains are scaffolded **as empty directories with `.gitkeep`** in this story; their actual queries/mutations/internal/test files land in later stories per the `epics.md` sequence. The same applies to `apps/marketplace/api/emails/` and `api/resend/` — empty directory + `.gitkeep` only.

**Files this story creates (high level):**

```
/
├── tsconfig.base.json                      [Task 5]
├── .yarnrc.yml                             [Task 4]
├── .prettierrc                             [Task 5]
├── turbo.json                              [Task 5 — edit existing template version]
├── AGENTS.md                               [Task 12]
├── package.json                            [Task 1 — edit existing template version]
├── docs/{DISASTER_RECOVERY,DEPLOYMENT_RUNBOOK,ONBOARDING}.md   [Task 13]
├── .github/PULL_REQUEST_TEMPLATE.md, CODEOWNERS, workflows/*.yml   [Task 13]
│
├── apps/
│   ├── marketplace/  package.json, next.config.ts, tsconfig.json,
│   │                 playwright.config.ts, vitest.config.ts,
│   │                 eslint.config.js, .env.example, AGENTS.md,
│   │                 app/{layout.tsx,page.tsx,globals.css,proxy.ts},
│   │                 app/api/{stripe/webhook,clerk/webhook,emails/send,resend/webhook}/.gitkeep,
│   │                 tests/e2e/.gitkeep                              [Task 2, 7]
│   ├── vendor/       (same files; NO app/api/ scaffolds — deferred)  [Task 2, 7]
│   └── admin/        (same files; NO app/api/ scaffolds — deferred)  [Task 2, 7]
│
└── packages/
    ├── backend/         (preserve Convex template; rename to @workspace/backend; remove @convex-dev/resend if present;
    │                     scaffold convex/{messages,pendingEmails,emailDeliveryEvents,emails,domainEvents/emailSubscribers,_test_helpers}/.gitkeep)   [Task 1, 8]
    ├── ui/              package.json (with subpath exports), tsconfig.json, eslint.config.js, AGENTS.md, components.json, src/   [Task 3, 6]
    ├── rules-engine/    package.json, tsconfig.json, vitest.config.ts, eslint.config.js, AGENTS.md, README.md, src/   [Task 3]
    ├── web-shared/      package.json, tsconfig.json, vitest.config.ts, eslint.config.js, AGENTS.md, src/   [Task 3]
    ├── seed-data/       package.json, tsconfig.json, eslint.config.js, AGENTS.md, README.md, src/   [Task 3]
    ├── eslint-config/   package.json, src/{base.js (with no-restricted-paths rule body),nextjs.js,convex.js}, README.md   [Task 3]
    └── email-templates/ package.json, tsconfig.json, vitest.config.ts, eslint.config.js, AGENTS.md, react-email.config.js, src/   [Task 3]
```

### Testing Standards Summary

This story is project init; the test "surface" being built is the **infrastructure to run tests**, not tests themselves. There are no production behaviors to protect yet. Specifically:

- **Per-app `vitest.config.ts` declares 100% coverage threshold (AR58).** Use the **standing exclusions** documented in `_bmad-output/project-context.md` §Test Conventions: `_generated/`, `__test_helpers/`, `*.types.ts`, `node_modules/`, render-only Next.js special files (`layout/error/loading/not-found/global-error.tsx`). Do not add other exclusions.
- **Playwright config declares all five browser projects** per AC #8.
- **Empty test sets are acceptable** for this story — `yarn vitest` and `yarn playwright test` should run green against zero tests in each app/package. The 100% coverage gate is satisfied vacuously when there is no production code.
- **Do not author placeholder tests** like `expect(true).toBe(true)` — explicitly forbidden by `_bmad-output/project-context.md` §Test Conventions. If a test exists in this story, it must have a real `Protects:` block. None should exist.
- **Once Story 1.2 starts adding real Convex code, the auth wrappers + helpers will need real tests with `Protects:` blocks** — but that is 1.2's problem, not 1.1's.

The only verification this story produces are **harness smoke tests** done manually per Task 14 (run `yarn dev`, run `yarn playwright test`, hit placeholder pages). These are not committed test files; they are bootstrap verification.

### Project Structure Notes

**Alignment with unified project structure:** Tree exactly matches `architecture.md` §"Complete Project Tree" (line 1104+) with post-validation revisions (line 1740+). All path conventions match `_bmad-output/project-context.md` §"Repo Shape & Module Exports" and §"File & Identifier Naming."

**Detected conflicts and resolutions (with rationale):**

1. **Story-AC text says "install Resend Convex component" → SUPERSEDED.** The acceptance criteria as originally written in `epics.md` line 658 references the post-init step "Install `@convex-dev/resend` Convex component" (carried over from architecture's pre-validation step 3 plan at line 113). The post-validation revision (architecture.md line 1541, "Major Revision: Resend Pulled Out of Convex") explicitly says **do not install** `@convex-dev/resend`. The story's AC #9 reflects the revision. Rationale: Resend SDK requires React Email rendering which needs Node, which violates the "no Node in Convex" rule. Resend lives fully in Next.js (`apps/marketplace/app/api/emails/send/route.ts`) per architecture line 1556+.

2. **Story-AC text says "six packages" → corrected to seven.** `epics.md` line 656 lists seven packages but says "six packages" in the prose at line 655. The correct count per `architecture.md` §"Project Structure" is **seven**: `backend`, `ui`, `rules-engine`, `web-shared`, `seed-data`, `eslint-config`, `email-templates`. AC #3 reflects the correct seven-package count.

3. **`apps/storefront` references in earlier architecture sections → SUPERSEDED.** The architecture's Step 3 "Code Organization" block at line 182+ shows `apps/storefront/` as a single app. The post-validation §"Project Structure & Boundaries / Complete Project Tree" (line 1104+) canonicalizes the three-app split: `apps/marketplace`, `apps/vendor`, `apps/admin`. The three-app split is the correct one. Do not create `apps/storefront`.

4. **Yarn berry vs. template default.** The Convex template uses npm or default yarn classic. Switching to yarn berry with `nodeLinker: node-modules` (Task 4) is mandatory per architecture.md line 579. Do not skip — downstream packages and CI assume yarn berry.

5. **Convex `apps/native/` directory.** The template includes Expo. Story scope is delete-only (Task 1). Do not preserve or migrate any Expo content; F2T is mobile-first **responsive web**, not native, at MVP.

6. **AR49 env-var topology vs. Resend revision — RESOLVED.** AR49 (architecture.md line 302, pre-Resend-revision) lists `RESEND_API_KEY` and `RESEND_WEBHOOK_SECRET` under Convex env vars. The post-validation Resend pull-out (architecture.md line 1541+, project-context.md §Email) moves the Resend SDK fully into Next.js — so those keys now live in **Vercel** env, not Convex. AC #10 and Task 9 (Convex env defaults) reflect the corrected topology: only `CLERK_JWT_ISSUER_DOMAIN`, `INTERNAL_API_SECRET`, and `SENTRY_DSN` go into Convex env. AC #11 and Task 10 (Vercel env vars) include `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, and `CLERK_WEBHOOK_SECRET` per the corrected topology. If AR49's prose appears to disagree, the Resend revision wins.

7. **Marketplace vs. vendor/admin `app/api/` scaffolding.** Only the **marketplace** app gets `app/api/` `.gitkeep` placeholders in this story (per AC #19), because it hosts the cross-cutting webhook + email endpoints (`stripe/webhook`, `clerk/webhook`, `emails/send`, `resend/webhook`) that Stories 1.4 and 1.5 attach to. Vendor and admin app-specific routes (`apps/vendor/api/stripe/connect/onboarding/`, `apps/vendor/api/orders/cancel-line/`, `apps/admin/api/stripe/refund/`) and `apps/vendor/app/(onboarding)/` are **deferred** to their owning stories (Epic 2 onboarding, Epic 6 cancel-line, Epic 8 refund). This keeps Story 1.1 scope tight on cross-cutting infrastructure.

8. **`packages/eslint-config/src/base.js` is load-bearing for AC #5.** The dependency-graph guarantee in AC #5 only holds if `base.js` actually authors the `import/no-restricted-paths` rule. An empty `base.js` file silently passes lint while granting zero protection. Task 3 calls this out explicitly. Story 1.15 hardens the rule set further (no-barrel custom rule, hook-import restrictions, naming-convention) — but the dependency graph itself lands here.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#story-11-project-initialization-monorepo-scaffold] — original AC verbatim
- [Source: _bmad-output/planning-artifacts/epics.md#cross-cutting-story-conventions] — five rules every story honors (public route allowlisting, per-story schema discipline, Protects: block, audit-log subscriber, emitEvent)
- [Source: _bmad-output/planning-artifacts/architecture.md#starter-template-evaluation] — template selection rationale; `npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo`
- [Source: _bmad-output/planning-artifacts/architecture.md#infrastructure--deployment] — yarn berry, Convex tier topology, Vercel envvar topology, monitoring stack
- [Source: _bmad-output/planning-artifacts/architecture.md#project-structure--boundaries] — canonical three-app + seven-package tree (line 1102+)
- [Source: _bmad-output/planning-artifacts/architecture.md#architecture-validation--revisions] — "Major Revision: Resend Pulled Out of Convex" (line 1541) supersedes earlier Resend-in-Convex plan; "Implementation Handoff" (line 1869+) restates the Story 1.1 scope with revisions applied
- [Source: _bmad-output/planning-artifacts/architecture.md#pattern-enforcement] — ESLint rules to scaffold (custom no-barrel rule, no-restricted-imports for hooks + date libs, naming-convention)
- [Source: _bmad-output/project-context.md#technology-stack--versions] — Node 20+, TS strict-mode flag list, Next.js 16, Convex V8-only rule, Tailwind v4, Base UI shadcn, yarn berry, Playwright
- [Source: _bmad-output/project-context.md#repo-shape--module-exports] — apps + packages canonical names; no barrel files; subpath exports via `package.json#exports`; one-way ESLint-enforced dependency graph
- [Source: _bmad-output/project-context.md#test-conventions] — `.test.ts(x)` vs `.spec.ts` (Vitest vs Playwright); 100% coverage gate; standing exclusions list; meaningful-tests rule (forbids placeholder tests in this story)
- [Source: _bmad-output/project-context.md#agentsmd-hierarchy--when-in-doubt] — repo-root + per-package AGENTS.md content map

### Latest Tech Information

The project-context.md and architecture.md were authored against the following stable versions (as of 2026-04-26 / 2026-04-27):

- **Next.js 16** with App Router, React 19.2, Turbopack default, Cache Components (PPR + opt-in `use cache`), `proxy.ts` (replaces middleware), per-package `AGENTS.md` auto-generated.
- **Tailwind v4** — CSS-first config via `@import "tailwindcss"` (not `tailwind.config.js`).
- **shadcn/ui CLI** — `npx shadcn@latest init` prompts for primitive layer; **select Base UI** (NOT Radix). Architecture rationale at line 152: render-prop API clarity, single-package tree-shaking via `@base-ui/react`, MUI-team maintenance, stronger combobox/multi-select primitives, more reliable AI-agent generation.
- **Convex** — `npx create-convex@latest`, `npx convex deployment create`, `npx convex env default set`, `npx convex ai-files` are all current commands. V8 isolate only; no `'use node'` actions in this codebase.
- **Yarn berry** — `yarn set version berry`; `.yarnrc.yml` with `nodeLinker: node-modules`. CI uses `actions/setup-node@v4` (yarn pre-installed; no corepack).
- **Playwright** — `@playwright/test` with browser projects `chromium`, `firefox`, `webkit`, `Mobile Safari` (via `devices['iPhone 13']`), `Mobile Chrome` (via `devices['Pixel 7']`). `axe-core` + `@axe-core/playwright` for a11y.
- **Clerk** with Organizations enabled per instance; JWT template named `convex` per Convex's official Clerk integration; `useConvexAuth()` (NOT Clerk's `useAuth()`) for auth state in components.

If any tool prompts for a major-version-different setup than documented above, **stop and surface the discrepancy** rather than papering over it — do not silently adopt a divergent default.

## Project Context Reference

The repo's LLM-optimized convention digest lives at `_bmad-output/project-context.md`. Read it (and the per-package `AGENTS.md` files this story creates) before writing code in any subsequent story. The digest covers technology stack, repo shape, file/identifier naming, field naming, TypeScript style, date/time/timezone handling, Convex auth wrappers, Convex React hook wrappers, loading/empty/error states, domain events, email pipeline, server-actions vs API routes, validation strategy, schema migrations, test conventions, pattern enforcement, and the AGENTS.md hierarchy. When this digest disagrees with `_bmad-output/planning-artifacts/architecture.md`, architecture.md wins.

## Dev Agent Record

### Agent Model Used

claude-opus-4-7 (1M context) — 2026-04-27

### Debug Log References

- `yarn install` initially produced peer-dependency warnings (missing `@testing-library/dom`, `vite`, `playwright-core`, `typescript`, `eslint` as transitive peers); resolved by adding the explicit devDeps to each affected workspace. Final `yarn install --immutable` succeeds with traditional `node_modules/` layout (no PnP).
- `tsc` initially failed in `@workspace/ui` and `@workspace/email-templates` with TS18003 ("No inputs were found") because `src/` had only a `.gitkeep`. Resolved by adding `src/_placeholder.tsx` anchor files (replaceable when real content lands in 1.6/1.7/1.4).
- `tsc` initially failed in `@workspace/backend` with `Cannot find name 'process'` because `convex/tsconfig.json` did not pick up `@types/node` in its `types` field. Resolved by adding `"types": ["node"]` to `convex/tsconfig.json` and `@types/node` to backend devDeps.
- ESLint flat-config + `FlatCompat` choked on `eslint-config-next` with "Converting circular structure to JSON" — known interop issue. Story 1.15 hardens this; for 1.1, `@workspace/eslint-config/nextjs` re-exports `base` so the dependency-graph rule is still enforced (load-bearing for AC #5).
- Playwright errored on "no tests found" with empty test sets — added `--pass-with-no-tests` to each app's `e2e` and `e2e:smoke` scripts (per the story's "empty test sets are acceptable for this story" testing-standards note).
- Module-type warnings ("not specified and it doesn't parse as CommonJS") on apps' `eslint.config.js` resolved by adding `"type": "module"` to each app's `package.json`.

### Completion Notes List

**What landed:** Full monorepo skeleton — three Next.js 16 apps (marketplace/vendor/admin on ports 3000/3001/3002), seven workspace packages (`backend`, `ui`, `rules-engine`, `web-shared`, `seed-data`, `eslint-config`, `email-templates`), yarn berry workspaces (`nodeLinker: node-modules`), shared `tsconfig.base.json` with the full strict-mode flag set from project-context.md §TypeScript Style, `.prettierrc`, `turbo.json` with the canonical pipeline, root + per-package `AGENTS.md`, repo `README.md`, `docs/` placeholders, `.github/` scaffolds (PR template, CODEOWNERS, three TODO workflow files for Story 1.13).

**Critical AC #5 dependency-graph rule landed in `packages/eslint-config/src/base.js`** — `import/no-restricted-paths` encodes all four architectural boundaries (backend ↛ apps, ui ↛ backend, rules-engine self-contained, app-to-app forbidden). Story 1.15 will harden the rule set further (no-barrel custom rule, hook-import restrictions, naming-convention).

**Bootstrap verified:**
- `yarn install --immutable` → succeeds with traditional `node_modules/` (no `.pnp.cjs`).
- `yarn turbo run typecheck` → 9/9 packages green.
- `yarn turbo run lint` → 9/9 packages green.
- `yarn turbo run e2e:smoke` → 3/3 apps green (empty test sets across all 5 browser projects: chromium, firefox, webkit, Mobile Safari, Mobile Chrome).
- `yarn dev` → all three Next.js dev servers start in parallel; each placeholder page returns 200 ("Hello from marketplace" / vendor / admin) within ~1s of startup. Convex dev was not started (deployment provisioning deferred — see handoff below).

**Convex AI files** (`npx convex ai-files install`) ran successfully and produced `packages/backend/convex/_generated/ai/guidelines.md` plus appended a Convex section to `packages/backend/AGENTS.md` and created `packages/backend/CLAUDE.md`.

**`@convex-dev/resend` is NOT installed** (per the post-validation Resend revision); template's demo `notes.ts` / `openai.ts` / `utils.ts` removed; schema reset to `defineSchema({})` (Story 1.2 adds tables); `convex.config.ts` is an empty registration scaffold (Story 1.2 will register `@convex-dev/rate-limiter`).

**Post-validation Convex `.gitkeep` directories** scaffolded per AC #19: `messages/`, `pendingEmails/`, `emailDeliveryEvents/`, `domainEvents/emailSubscribers/`, `emails/`, `_test_helpers/`. **No** vendor/admin app-specific `app/api/` directories or `(onboarding)/` route group (deferred to owning stories per AC #19).

---

### Handoff: external-service provisioning checklist (Tasks 9 / 10 / 11)

These tasks require interactive auth + dashboard access and are **not driven autonomously by Dev**. All code-side scaffolds are in place — Jen runs the steps below to complete provisioning. Each step is gated by the previous one.

**Task 9 — Convex deployments**

```sh
# 1. Auth
npx convex login

# 2. Initialize dev (creates dev deployment + writes packages/backend/.env.local)
cd packages/backend && npx convex dev

# 3. Provision long-lived qa + prod tiers
npx convex deployment create qa --type prod
npx convex deployment create prod --type prod

# 4. Set env defaults (only the vars Convex functions actually need post-Resend-revision)
npx convex env default set CLERK_JWT_ISSUER_DOMAIN <dev-clerk-issuer>
npx convex env default set INTERNAL_API_SECRET <random-256-bit>
npx convex env default set SENTRY_DSN <convex-side-dsn>

# 5. Per-tier overrides for qa + prod
npx convex env set --target qa CLERK_JWT_ISSUER_DOMAIN <qa-clerk-issuer>
npx convex env set --target qa INTERNAL_API_SECRET <qa-shared-secret>
npx convex env set --target prod CLERK_JWT_ISSUER_DOMAIN <prod-clerk-issuer>
npx convex env set --target prod INTERNAL_API_SECRET <prod-shared-secret>

# 6. Verify
npx convex deployment list
```

**Do NOT set** `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, or any Stripe key as Convex env — those SDKs live in Next.js (Vercel env, see Task 10).

**Task 10 — Vercel projects**

For each app (`apps/marketplace`, `apps/vendor`, `apps/admin`):

1. From the app dir, run `vercel link` and connect to the GitHub repo with build root set to that app's path.
2. Add env vars per `apps/{app}/.env.example` (already authored). Marketplace gets the full set (it hosts Stripe / Clerk / Resend / emails routes); vendor and admin get the trimmed subsets (no Resend keys, no Stripe webhook secrets they don't receive).
3. Confirm preview deployments are enabled (default behavior).
4. Push a no-op commit and verify each project produces a successful preview build.

**Task 11 — Clerk dev + qa instances**

1. Create two Clerk instances (dev + qa) with **Organizations enabled**.
2. In each instance, create a "Platform" Organization (will hold platform-admin members; configure mandatory 2FA on this Org per architecture §"Convex Auth Wrappers").
3. Configure the JWT template named `convex` per Convex's Clerk integration docs.
4. **Cross-subdomain session cookies (load-bearing per architecture line 1419):** set the session cookie domain to `.farm2table.app` (prod), `.farm2table.qa` or equivalent (qa), `localhost` (local dev). Without this, every subdomain hop logs the user out — `marketplace`, `vendor`, and `admin` won't share the session.
5. Smoke-test: from a local Next.js dev session signed into the dev Clerk instance, call a stub Convex `publicQuery` that returns `ctx.auth.getUserIdentity()` and confirm a non-null identity with the expected `iss` and `sub`. (This stub goes in Story 1.2 once auth wrappers exist; can be deferred until then.)

### File List

**Created or modified:**

```
/AGENTS.md
/README.md                              (overwrote template demo content)
/turbo.json                             (overwrote with full pipeline)
/.prettierrc                            (added trailing-comma + width preferences)
/.yarnrc.yml                            (NEW — nodeLinker: node-modules)
/tsconfig.base.json                     (NEW — strict-mode flags from project-context)
/package.json                           (yarn berry, scripts expanded, removed pnpm refs)
/pnpm-workspace.yaml                    (DELETED)
/yarn.lock                              (NEW — yarn berry lockfile)

/apps/native                            (DELETED — Expo strip)

/apps/marketplace/                      (renamed from apps/web; demo content stripped)
  package.json, next.config.ts, tsconfig.json,
  playwright.config.ts, vitest.config.ts, postcss.config.mjs,
  eslint.config.js, .env.example, .gitignore, AGENTS.md, next-env.d.ts,
  app/{layout.tsx, page.tsx, globals.css, proxy.ts},
  app/api/stripe/webhook/.gitkeep,
  app/api/clerk/webhook/.gitkeep,
  app/api/emails/send/.gitkeep,
  app/api/resend/webhook/.gitkeep,
  tests/e2e/.gitkeep

/apps/vendor/                           (NEW — duplicated from marketplace, no app/api scaffolds)
  package.json, next.config.ts, tsconfig.json,
  playwright.config.ts (port 3001), vitest.config.ts, postcss.config.mjs,
  eslint.config.js, .env.example (vendor-specific, no Resend keys), .gitignore,
  AGENTS.md, next-env.d.ts,
  app/{layout.tsx, page.tsx ("Hello from vendor"), globals.css, proxy.ts},
  tests/e2e/.gitkeep

/apps/admin/                            (NEW — duplicated from marketplace, no app/api scaffolds)
  package.json, next.config.ts, tsconfig.json,
  playwright.config.ts (port 3002), vitest.config.ts, postcss.config.mjs,
  eslint.config.js, .env.example (admin-specific subset), .gitignore,
  AGENTS.md, next-env.d.ts,
  app/{layout.tsx, page.tsx ("Hello from admin"), globals.css, proxy.ts},
  tests/e2e/.gitkeep

/packages/backend/                      (renamed @packages/backend → @workspace/backend)
  package.json, tsconfig.json (NEW, extends ../../tsconfig.base.json),
  eslint.config.js (NEW), AGENTS.md (NEW + Convex ai-files appended section), CLAUDE.md (Convex ai-files),
  vitest.config.ts (NEW),
  convex/schema.ts (reset to empty defineSchema({})),
  convex/convex.config.ts (NEW — empty defineApp() scaffold),
  convex/auth.config.ts (preserved from template),
  convex/tsconfig.json (added types: ["node"]),
  convex/_generated/ (preserved + ai/guidelines.md from convex ai-files),
  convex/messages/.gitkeep, pendingEmails/.gitkeep, emailDeliveryEvents/.gitkeep,
  convex/domainEvents/emailSubscribers/.gitkeep, emails/.gitkeep, _test_helpers/.gitkeep,
  convex/notes.ts, openai.ts, utils.ts                              (DELETED — template demo)

/packages/ui/                           (NEW)
  package.json (subpath exports ./*: ./src/*.tsx + ./*.css: ./src/*.css),
  tsconfig.json, eslint.config.js, AGENTS.md, vitest.config.ts,
  components.json (Base UI primitives configured),
  src/_placeholder.tsx (anchor — removed when real primitives land in 1.7)

/packages/rules-engine/                 (NEW)
  package.json (subpath exports ./rules, ./match, ./types),
  tsconfig.json, eslint.config.js, AGENTS.md, README.md, vitest.config.ts,
  src/{rules.ts, match.ts, rules.types.ts}                          (empty stubs — 2.1 fills)

/packages/web-shared/                   (NEW)
  package.json (subpath exports ./convex, ./datetime, ./sentry, ./providers, ./featureFlags, ./errorBoundaries),
  tsconfig.json, eslint.config.js, AGENTS.md, vitest.config.ts,
  src/{convex.ts, datetime.ts, sentry.ts, providers.tsx, featureFlags.ts, ErrorBoundaryFallback.tsx}  (empty stubs)

/packages/seed-data/                    (NEW)
  package.json (subpath exports ./generate, ./resetQa),
  tsconfig.json, eslint.config.js, AGENTS.md, README.md,
  src/{generate.ts, resetQa.ts}                                     (empty stubs)

/packages/eslint-config/                (NEW — load-bearing for AC #5)
  package.json (subpath exports ./base, ./nextjs, ./convex), README.md,
  src/base.js (CONTAINS the import/no-restricted-paths dependency-graph rule),
  src/nextjs.js (re-exports base; story 1.15 adds eslint-config-next properly),
  src/convex.js (extends base with convex/* file scoping)

/packages/email-templates/              (NEW)
  package.json (subpath exports ./*: ./src/*.tsx),
  tsconfig.json, eslint.config.js, AGENTS.md, vitest.config.ts,
  react-email.config.js,
  src/_placeholder.tsx (anchor — removed when real templates land in 1.4 + order stories)

/docs/DISASTER_RECOVERY.md              (NEW — placeholder for Story 1.16)
/docs/DEPLOYMENT_RUNBOOK.md             (NEW — placeholder for Story 1.16)
/docs/ONBOARDING.md                     (NEW — placeholder for Story 1.16)

/.github/PULL_REQUEST_TEMPLATE.md       (NEW — AR58 checklist)
/.github/CODEOWNERS                     (NEW — * @jenchartier)
/.github/workflows/pr.yml               (NEW — TODO scaffold for Story 1.13)
/.github/workflows/deploy-qa.yml        (NEW — TODO scaffold for Story 1.13)
/.github/workflows/deploy-prod.yml      (NEW — TODO scaffold for Story 1.13)
```

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-27 | Story 1.1 implemented: monorepo scaffold, three-app split, seven packages, yarn berry, base ESLint dep-graph rule, Playwright + axe-core, Convex `.gitkeep` domain folders, AGENTS.md hierarchy, README, docs/, .github/ scaffolds. Bootstrap (install/typecheck/lint/dev/e2e:smoke) verified green. Tasks 9/10/11 (external service provisioning) deferred with handoff checklist for Jen. | Dev (claude-opus-4-7) |
