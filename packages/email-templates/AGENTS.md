# AGENTS — packages/email-templates

React Email templates for transactional email. See repo-root `/AGENTS.md` for cross-cutting conventions and `_bmad-output/project-context.md` §"Email Pipeline" for the canonical end-to-end flow.

## Email pipeline (post-validation)

**Resend lives in Next.js, NOT Convex.** Do not install `@convex-dev/resend`. Do not call `resend.sendEmail` from any Convex function. The Resend SDK requires Node, which violates the V8-isolate-only rule.

Templates from this package are rendered + sent from `apps/marketplace/app/api/emails/send/route.ts`. Convex actions `fetch` to that route with `X-Internal-Auth` shared secret + `Idempotency-Key: ${eventId}-${emailType}`.

## Conventions

- One template per file; default export, name matches file (`OrderConfirmation.tsx` → `export default function OrderConfirmation()`).
- Subpath exports declared as `{ "./*": "./src/*.tsx" }` — consumers import as `import OrderConfirmation from "@workspace/email-templates/OrderConfirmation"`.
- Each template's prop type is exported alongside (`export type OrderConfirmationProps`).
- **Snapshot tests forbidden** (per project-context §Test Conventions). Test rendered HTML for content-bearing assertions instead — does it include the order ID, the per-vendor sub-totals, the magic CTA?
- Local preview: `cd packages/email-templates && yarn preview`.

## Adding a new transactional email

1. Add `MyNewEmail.tsx` here (default export, props type alongside).
2. Wire `MyNewEmail` into the route's template registry in `apps/marketplace/app/api/emails/send/route.ts`.
3. In a `convex/domainEvents/emailSubscribers/*.ts` subscriber, react to the relevant domain event and schedule `internal.emails.sendEmail` with `{ template: "MyNewEmail", to, data, idempotencyKey: ${eventId}-${emailType} }`.
4. Never call Resend or `fetch` to `/api/emails/send` from anywhere except the `convex/emails/sendEmail.ts` action.

## Story 1.1 status

`src/` is empty. Real templates (OrderConfirmation, VerificationApproved, RefundIssued, etc.) land in Story 1.4 and the order-flow stories.
