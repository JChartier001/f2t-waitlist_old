# AGENTS — packages/seed-data

Synthetic seed data for the qa Convex deployment. See repo-root `/AGENTS.md` for cross-cutting conventions.

## Purpose

`qa` carries seeded synthetic data across multiple states, categories, vendors, customers — exactly the conditions that surface migration bugs (NULL handling, edge-case schemas, pagination cursor exhaustion). Schema migrations are rehearsed on qa first; a migration that runs cleanly on dev seed data has not been tested.

## Public surface

- `@workspace/seed-data/generate` — generators for vendors, products, orders, certifications, etc. across multiple states/categories.
- `@workspace/seed-data/resetQa` — wipes + reseeds the qa Convex deployment. Idempotent.

## Story 1.1 status

`src/generate.ts` and `src/resetQa.ts` exist as empty stubs so subpath exports resolve. Real generators land alongside the schema additions in their owning stories.
