# AGENTS — packages/web-shared

Single canonical entry point for **all Convex React hooks**, **datetime formatters**, **Sentry instrumentation**, **providers**, **feature flags**, and **error boundary fallbacks** used across the three apps.

See repo-root `/AGENTS.md` and `_bmad-output/project-context.md` for the LLM-optimized rule digest.

## The hook-wrapper layer (load-bearing)

**All Convex React hooks come from `@workspace/web-shared` only.** ESLint blocks direct imports from `convex/react`, `convex-helpers/react`, and `convex-helpers/react/cache` (Story 1.15 hardens the restriction).

```ts
// ✅ Correct — every component, every app
import { useQuery, useMutation, useAction, usePaginatedQuery } from "@workspace/web-shared/convex";

// ❌ Forbidden — ESLint blocks
import { useQuery } from "convex/react";
```

What the wrappers add:
- `useQuery` returns `{ status: "pending" | "error" | "success", data, error }` — use the `status` discriminator, never `data === undefined`.
- `usePaginatedQuery` is the cached variant (cross-unmount cache via `ConvexQueryCacheProvider` set at the app root with `expiration: 300_000ms`, `maxIdleEntries: 250`).
- `useMutation` and `useAction` return `[trigger, { isPending, error }]` — `isPending` is available for inline button-disabled states without extra `useState`.

Exceptions (still imported from `convex/react` directly): `useConvexAuth`, `usePreloadedQuery`. Server-side fetching uses `preloadQuery` / `fetchQuery` from `convex/nextjs` — not the React hooks.

## Datetime

All formatters live in `./datetime`. Storage = `number` (epoch ms, UTC) for datetimes; ISO string `"YYYY-MM-DD"` for date-only fields. **All date display goes through this module** — no inline `format()` / `formatInTimeZone()` calls scattered through components.

`date-fns` + `date-fns-tz` only — no moment, no dayjs, no Luxon (ESLint blocks them in Story 1.15).

## Public surface

| Export | Purpose | Owning story |
|---|---|---|
| `@workspace/web-shared/convex` | wrapped Convex hooks (`useQuery`, `useMutation`, `useAction`, `usePaginatedQuery`) | Story 1.5 |
| `@workspace/web-shared/datetime` | `formatLocal`, `formatRelative`, `formatPickupWindow`, `formatExpiryDate` | Story 1.5 |
| `@workspace/web-shared/sentry` | Sentry instrumentation helpers | Story 1.12 |
| `@workspace/web-shared/providers` | `ConvexClientProvider`, `ConvexQueryCacheProvider`, theme provider | Story 1.5 |
| `@workspace/web-shared/featureFlags` | feature flag client + read helpers | Story 1.5 |
| `@workspace/web-shared/errorBoundaries` | `ErrorBoundaryFallback` component | Story 1.5 |

## Story 1.1 status

All `src/` files exist as empty stubs so subpath exports resolve. Real implementations land in their owning stories above.
