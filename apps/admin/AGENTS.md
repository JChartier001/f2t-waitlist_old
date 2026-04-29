# AGENTS — apps/admin

Admin tools app. See repo-root `/AGENTS.md` for cross-cutting conventions and `_bmad-output/project-context.md` for the LLM-optimized rule digest.

## App-specific conventions

- **Audience:** platform admins (verification queue, enforcement actions, incident response, audit log).
- **Auth:** Clerk membership in the **`"Platform"` Organization** with **mandatory 2FA** (configured on the Clerk Org, not in code). Use `adminQuery` / `adminMutation` Convex wrappers (Story 1.2). The 2FA requirement is a Clerk Org setting; do not author wrappers that bypass it.
- **Routes:** queue patterns (verification queue, customer report queue, foodborne-illness incident queue) — Epic 8.
- **App-specific API routes (deferred to owning story):**
  - `app/api/stripe/refund/route.ts` — admin discretionary refund (Epic 8).
- **Audit log read patterns:** every admin enforcement action emits a domain event via `emitEvent()`; the audit log subscriber is the canonical reader. Don't query enforcement state from the action result row — read it from `auditLog` (Story 1.3).
- **Storage URL access** for admin-side document review goes through `adminDocReadUrl(docId)`. **No public-read path exists for compliance docs.**

## Cross-cutting reminders

- **camelCase** for every internal surface.
- **No Node in Convex** — Stripe SDK calls for admin refunds live in this app's API routes / Server Actions.
- **`useConvexAuth()` not `useAuth()`** for auth state.
- **Server Component by default**; admin tools are read-heavy and benefit from SSR.

## Story 1.1 status

Placeholder `app/page.tsx` only. Verification queue, enforcement actions, incident response, audit-log review land in Epic 8.
