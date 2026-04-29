# AGENTS — apps/marketplace

Customer-facing marketplace app. See repo-root `/AGENTS.md` for cross-cutting conventions and `_bmad-output/project-context.md` for the LLM-optimized rule digest.

## App-specific conventions

- **Audience:** customers (browsing farms, products, placing orders, customer account).
- **Auth:** Clerk personal users (organizations are the vendor side, see `apps/vendor`); auth state via `useConvexAuth()` from `@workspace/web-shared`, not Clerk's `useAuth()`.
- **Routes:** App Router; route groups `(public)`, `(customer)` for auth-gated areas. Public route allowlist lives in `proxy.ts` (wired in Story 1.5).
- **API routes hosted here (cross-cutting; lands in later stories):**
  - `app/api/stripe/webhook/route.ts` — Stripe webhooks (Epic 5).
  - `app/api/clerk/webhook/route.ts` — Clerk → Convex sync (Story 1.5).
  - `app/api/emails/send/route.ts` — Resend SDK lives here, not in Convex (Story 1.4). Convex actions POST to this route with `X-Internal-Auth` shared secret + `Idempotency-Key` header.
  - `app/api/resend/webhook/route.ts` — Resend delivery events (Story 1.4).
- **SEO:** geo-targeted landing pages and structured data conventions (Epic 4); per-route metadata via `generateMetadata`.
- **Search:** marketplace browse and farm-profile pages; search infrastructure in Epic 4.

## Cross-cutting reminders

- **camelCase** for every internal surface; webhook payloads (Stripe, Clerk, Resend) translate from snake_case to camelCase **at the route handler boundary**, never below.
- **No Node in Convex** — Resend SDK and any Node-flavored work (PDFs, exifr, complex CSV) lives in this app's `app/api/` routes, not under `packages/backend/convex/`.
- **`useConvexAuth()` not `useAuth()`** for auth state in components.
- **Server Component by default**; add `"use client"` only when interactivity demands it.
- **Convex hooks** come from `@workspace/web-shared` only; ESLint blocks direct imports from `convex/react` / `convex-helpers/react`.

## Story 1.1 status

Placeholder `app/page.tsx` only. Real customer flows land in Epics 1, 4, 5, 6, 7. Cross-cutting `app/api/` directories are scaffolded as `.gitkeep`-only — owning stories author the routes.
