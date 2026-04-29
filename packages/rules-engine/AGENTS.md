# AGENTS — packages/rules-engine

Pure-functional rules engine for vendor verification, compliance gates, and category × state requirement matrices. See repo-root `/AGENTS.md` for cross-cutting conventions.

## Hard isolation rule

**This package imports nothing outside its own internals.** ESLint's `import/no-restricted-paths` enforces it. The rules engine is a pure data-in/data-out evaluator — it cannot depend on Convex, React, Next.js, or any other package. This isolation is what makes its decisions replayable for historical audit (NFR66).

## Public surface

- `@workspace/rules-engine/rules` — rule definitions (the data: state × category × tier requirements).
- `@workspace/rules-engine/match` — the evaluator: given a vendor's documents/attestations + their state + their category, returns the verification checklist + gate decision.
- `@workspace/rules-engine/types` — `RuleSet`, `Decision`, `Requirement`, etc. (one canonical types module).

## Versioning rule

Rules are versioned. Adding a state, category, or requirement bumps the rule version; historical decisions are replayable against the rule version that evaluated them at decision time. Don't mutate existing rule shapes — version them instead. (Same principle as domain-event versioning.)

## Story 1.1 status

`src/rules.ts`, `src/match.ts`, `src/rules.types.ts` exist as empty stubs so subpath exports resolve. Real rules + evaluator land in Story 2.1 (Rules Engine v1).
