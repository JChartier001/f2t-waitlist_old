# @workspace/eslint-config

Shared ESLint flat-config presets for Farm2Table.

## Entry points

- `@workspace/eslint-config/base` — TypeScript + the **dependency-graph** `import/no-restricted-paths` rule (AC #5 of Story 1.1). The dependency graph itself lands here in 1.1; Story 1.15 hardens the rule set further.
- `@workspace/eslint-config/nextjs` — extends `base`, adds `eslint-config-next` (App Router rules, React rules).
- `@workspace/eslint-config/convex` — extends `base`, tuned for Convex backend code (allows `_generated/`).

## What's in 1.1

The dependency-graph rule encodes four hard architectural boundaries from `_bmad-output/planning-artifacts/architecture.md` §"Project Structure & Boundaries / Architectural Boundaries":

1. `packages/backend` does not import from `apps/*`.
2. `packages/ui` does not import from `packages/backend`.
3. `packages/rules-engine` imports nothing outside its own internals.
4. `apps/marketplace`, `apps/vendor`, `apps/admin` do not import from each other.

Plus the cross-package alias rule: cross-package imports use `@workspace/*`; intra-package imports use relative paths.

## What lands in 1.15

Story 1.15 adds:
- Custom no-barrel rule (forbid `index.ts` / `index.tsx` outside `_generated/` and Next.js special locations).
- `no-restricted-imports` for Convex hook wrappers (forces `@workspace/web-shared`).
- `no-restricted-imports` for date libs (`date-fns` only — no moment, dayjs, luxon).
- `no-restricted-imports` for `convex-test` (only allowed in `__test_helpers/initConvexTest.ts`).
- `@typescript-eslint/naming-convention` (camelCase, PascalCase, no `I`/`T` prefix).
- `@typescript-eslint/consistent-type-definitions` (`type` over `interface`).
- `@typescript-eslint/no-restricted-types` (forbid `enum`).
- `import/order` auto-enforcement.
