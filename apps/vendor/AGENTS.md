# AGENTS — apps/vendor

Vendor portal app. See repo-root `/AGENTS.md` for cross-cutting conventions and `_bmad-output/project-context.md` for the LLM-optimized rule digest.

## App-specific conventions

- **Audience:** vendors managing farm profile, products, inventory, fulfillment, orders, payouts.
- **Auth:** Clerk **Organizations** — every vendor is a Clerk Org; sessions are Org-scoped. Use `vendorQuery` / `vendorMutation` / `vendorOwnerMutation` Convex wrappers (Story 1.2). The `vendorMutation` wrapper checks Org **status** (must be active), not just membership; suspended/removed Orgs are blocked.
- **Routes:** `app/(onboarding)/...` route group for the multi-step onboarding wizard (Epic 2 — not scaffolded in 1.1).
- **App-specific API routes (deferred to owning stories):**
  - `app/api/stripe/connect/onboarding/route.ts` — Stripe Connect onboarding redirect (Epic 2).
  - `app/api/orders/cancel-line/route.ts` — vendor-initiated cancel-line refund (Epic 6).
- **Server Actions** live in colocated `actions.ts` files (e.g., `app/(onboarding)/stripe-connect/actions.ts`) per the project-context decision rule (component-callers → Server Action; server-to-server → API Route).
- **Live preview** for farm-profile editor (Story 3.2) reuses the customer-facing FarmDetail component from `@workspace/ui` to avoid drift.

## Cross-cutting reminders

- **Vendor-local timezone matters.** Pickup windows store the UTC moment + the vendor's IANA timezone string; render in vendor TZ on this app, customer TZ on `apps/marketplace`.
- **camelCase** for every internal surface; Stripe webhook payloads (received in `apps/marketplace`) translate to camelCase before any Convex call sees them.
- **No Node in Convex** — Stripe SDK calls live in this app's Server Actions or API routes, never in `packages/backend/convex/`.
- **`useConvexAuth()` not `useAuth()`** for auth state; vendor org context comes from `useVendorContext()` (lands in `@workspace/web-shared` in Story 1.5).

## Story 1.1 status

Placeholder `app/page.tsx` only. Onboarding wizard, farm profile editor, product CRUD, inventory, dashboard land in Epics 2 and 3.
