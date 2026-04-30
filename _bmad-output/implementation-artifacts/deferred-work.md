# Deferred Work

Items raised in code review and intentionally deferred. One section per review run.

## Deferred from: code review of 1-2-convex-backend-foundation (2026-04-29)

- `badHandlerRegistration.ts` / `badArgsRegistration.ts` / `badReturnsRegistration.ts` import-order fragility — module-load throw is correct but coupled to import sequencing; standard fail-fast registration test pattern, accepted as the pragmatic shape. [packages/backend/convex/helpers/__tests__/]
- `useMemo([url])` in `ConvexClientProvider` does not respond to env-var changes via Next.js HMR — dev-mode-only edge; production builds inline `NEXT_PUBLIC_*` so this never matters in deployed environments. [packages/web-shared/src/providers.tsx]
- `providers.test.tsx` `delete process.env.NEXT_PUBLIC_CONVEX_URL` is a no-op against Next.js inlined constants in production builds — test exercises dev-mode runtime behavior; production build path is implicitly covered by build-time validation. [packages/web-shared/src/providers.test.tsx]
- `AuthOrg.kind` could be silently dropped if a future Convex `returns` validator declares the org shape without `kind` — Story 1.5+ concern when domain mutations actually return `org` to clients. [packages/backend/convex/helpers/auth.ts:AuthOrg]
- `requireConvexUrl` does not specifically gate `VERCEL_ENV=preview` / staging tiers — staging deploys typically set `NODE_ENV=production`; revisit if the deployment topology grows a true non-prod-non-dev tier. [packages/web-shared/src/providers.tsx:requireConvexUrl]
