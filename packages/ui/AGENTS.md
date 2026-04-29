# AGENTS — packages/ui

shadcn/ui primitives + composite F2T components. See repo-root `/AGENTS.md` for cross-cutting conventions and `_bmad-output/project-context.md` for the LLM-optimized rule digest.

## Conventions

- **Base UI primitives, NOT Radix.** shadcn/ui's `init` was run with Base UI selected (Story 1.1, Task 6). When adding a primitive, run `npx shadcn@latest add <component>` and confirm it pulls from `@base-ui/react`.
- **No barrel files.** No `index.ts` / `index.tsx` anywhere. Subpath exports declared in `package.json#exports`:
  ```jsonc
  { "exports": { "./*": "./src/*.tsx", "./*.css": "./src/*.css" } }
  ```
- **Consumers import explicitly:** `import { Button } from "@workspace/ui/Button"` — never `from "@workspace/ui"`.
- **Default export per file**, name matches filename. Sub-components used only by the main component live in the same file; if reused, move to their own file. Component-specific types as named exports alongside the default (`export type ButtonProps`).
- **No imports from `packages/backend`** — ESLint's `import/no-restricted-paths` blocks it. UI components never know about Convex tables.

## When to add a primitive vs. reuse

- If the same UI pattern is needed in two apps, it lives here.
- If it's marketplace-only or vendor-only, it lives in that app's `app/` tree.
- Primitives wrap Base UI components with theme tokens applied; composite components compose primitives.

## Theme tokens & dark-mode

- Tokens come from Tailwind v4's CSS-first config (declared in this package's design-token CSS — Story 1.6 authors them).
- Dark mode uses Tailwind's `dark:` variant; system theme detection is wired in Story 1.6.

## Story 1.1 status

`src/` is empty. Base UI shadcn is initialized (`components.json` exists). No primitives added yet — Story 1.7 owns the primitive set; Story 1.6 owns design tokens.
