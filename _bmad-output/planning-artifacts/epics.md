---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
status: complete
completedAt: 2026-04-26
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
project_name: Farm2Table
date: 2026-04-26
---

# Farm2Table - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Farm2Table, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Marketplace Discovery & Provenance**

- FR1: Customers can browse the marketplace by product category, farm name, location, certification, and farming practice without authentication.
- FR2: Customers can view a farm profile that displays the farm's name, address, declared practices, verified third-party certifications, and the products it currently offers.
- FR3: Customers can view a product detail page that displays the product's vendor, price, available variants, fulfillment options, traceability fields the vendor provides, and applicable certifications.
- FR4: Customers can navigate to geo-targeted landing pages keyed by (product, city) that surface local farms offering that product.
- FR5: The Platform can present third-party certifications (USDA Organic, Animal Welfare Approved, Certified Naturally Grown, and others) as filterable badges on listings, with verification linking back to the issuing body.
- FR6: The Platform can render farm profiles, product detail pages, and category/landing pages as indexable content with structured data so they appear in search-engine results.
- FR7: Customers can save farms to a personal saved-farms list accessible from their account, and view those farms' new products and availability changes.

**Multi-Vendor Cart, Checkout & Tax**

- FR8: Customers can add items from multiple vendors to a single cart and see each line item attributed to its vendor with the vendor's available fulfillment options.
- FR9: Customers can select fulfillment method per vendor (farm pickup, vendor-run local delivery, or vendor-run shipping) at checkout, where each option respects the vendor's configured availability for that product, the customer's location, and applicable per-state shipping eligibility.
- FR10: Customers can complete a single payment that splits across all vendors in the cart, with the Platform deducting per-vendor commission and platform service fee.
- FR11: The Platform can calculate sales tax per line item based on origin (vendor location) × destination (delivery address or pickup location) × product tax category, applying state grocery exemptions and prepared-food taxability rules.
- FR12: The Platform can register as a marketplace facilitator and remit sales tax in each state once that state's facilitator threshold is reached.
- FR13: Customers and Vendors can receive per-vendor sub-receipts that show the vendor's items, prices, fulfillment method, and pickup/shipping details for that vendor's portion of the order.
- FR14: The Platform can issue per-line-item refunds that reverse the original payment split (vendor portion + platform portion) without affecting other vendors' line items in the same order.
- FR15: Vendors can receive payouts seven days after delivery confirmation for each fulfilled line item, net of commission and fees.

**Vendor Onboarding & Compliance Verification**

- FR16: Vendors can apply to join the platform by selecting their state and one or more vendor categories (farm, cottage food, commercial food, beekeeper, egg producer, meat producer, dairy producer).
- FR17: Vendors can be presented with the exact set of required documents, attestations, and shipping-eligibility rules for their declared (state, category, products) combination, drawn from the state + category compliance rules engine.
- FR18: Vendors can upload required documents (state agricultural license, FDACS or equivalent commercial food permit, cottage food registration, USDA exemption, apiary registration, business license, food handler certification, COI where applicable).
- FR19: Vendors can sign a compliance attestation acknowledging applicable state labeling, revenue-cap, and food-safety requirements.
- FR20: Vendors can complete identity and bank-account verification through Stripe Connect's hosted onboarding before payouts are enabled.
- FR21: Vendors can sign the vendor agreement before listings go live.
- FR22: The Platform can block category × state combinations that are restricted by law (raw dairy in FL is pet-only; raw milk for human consumption excluded entirely; CBD/cannabis/regulated supplements; alcohol; restaurants / prepared meals for immediate consumption; wholesale-to-business at MVP).
- FR23: The Platform can default vendors in states with ambiguous interstate cottage food law (e.g., FL) to in-state-only shipping, and allow vendors to extend coverage only to states their license actually authorizes.

**Vendor Storefront & Operations**

- FR24: Vendors can create, edit, publish, unpublish, and remove product listings, each with variants, weight-based pricing, photos with required alt text, descriptions, traceability fields (lot number, batch, harvest/pack date), and labeling fields (ingredients, allergens, applicable disclaimers).
- FR25: Vendors can edit their farm profile (name, address, declared practices, story, photos, certification claims, contact preferences).
- FR26: Vendors can configure fulfillment per product or product set: farm pickup with day-of-week and time-window availability, vendor-run local delivery by zip code with vendor-set fee, and vendor-run shipping by destination state with vendor-set fee and packaging method.
- FR27: Vendors can manage inventory (current quantity, low-stock alerts, sold-out state, restock).
- FR28: Vendors can view and act on incoming orders: accept, mark in preparation, mark ready or shipped, mark delivered, cancel, refund.
- FR29: Vendors can communicate with customers about active orders (hold, reschedule, or cancellation requests).
- FR30: Vendors can view a sales dashboard showing GMV, orders, marketplace-sourced vs. vendor-shared-link orders, and tier-upgrade math suggesting savings at the next subscription tier.
- FR31: Vendors can share a storefront link that displays only their own products, for use in their own customer outreach (Instagram bio, email lists, market booth signage), independently of the marketplace.
- FR32: Vendors can subscribe to the Foundation tier (free, 22% commission).
- FR32a: Vendors can subscribe to the Growth tier and Pro tier when those launch in Phase 2 [Growth].
- FR33: Vendors can purchase add-on capabilities individually [Growth] (Email Promotions, Advanced Analytics, CSA Manager, Route Planner, Accounting Sync), with all add-ons included free at the Pro tier.
- FR34: Vendors can opt into featured-listing promotion for vendor-set durations and budgets [Growth].

**Order Lifecycle, Fulfillment & Substitute Discovery**

- FR35: Customers can view an order's overall status and each vendor's per-line-item fulfillment status (preparing, ready, in transit, delivered) and pickup/shipping details.
- FR36: Vendors can cancel an order line, triggering automatic refund to the customer for that line, leaving the order's other vendors unaffected.
- FR37: Customers can request that a vendor hold their order for a later pickup or delivery date, subject to vendor acceptance.
- FR38: When a vendor cancels a line item, the Platform can surface alternative Farm2Table vendors offering the same product category, with one-action reorder.
- FR39: The Platform can display per-vendor cancellation cutoffs on listings (typically 24–48 hours before fulfillment) so customers know when changes can still be made without vendor permission.
- FR40: The Platform can match substitutes by deeper attributes than category match [Growth] — taxonomy depth, practice/certification compatibility, sub-product attributes.

**Customer Account, Trust & Reporting**

- FR41: Customers can create an account with email verification, accept the customer Terms of Service, and complete first-order purchase.
- FR42: Customers can view their order history, saved farms, payment methods, and account profile.
- FR43: Customers can export their account data (orders, profile) in a portable format.
- FR44: Customers can delete their account and the associated personal data the Platform stores, in accordance with applicable privacy law.
- FR45: Customers can exercise CCPA/CPRA rights including a "Do Not Sell or Share My Personal Information" choice and access/deletion requests, with the Platform confirming each request.
- FR46: Customers can submit reports of suspected vendor misrepresentation (false provenance, miscategorized listings) with structured intake.
- FR47: Customers can submit foodborne-illness reports with structured intake including order reference, products consumed, symptom onset and description, household members affected, and consent for FDACS contact.
- FR48: Customers can submit reports of vendor cancellation patterns or service quality issues.
- FR49: Customers can submit "tell us where to launch next" interest signals including their location and product interests.

**Admin Verification, Enforcement & Incident Response**

- FR50: Admins can view a vendor application queue with each application displaying the rules-engine-generated checklist of expected documents, the present/missing/wrong-doc-uploaded status of each, format-validation results on permit numbers and expiry dates, and one-action links to the relevant public registry where applicable.
- FR51: Admins can approve a vendor application, request additional or corrected documents from the vendor with a templated email containing state-specific context, or reject the application with a templated reason.
- FR52: The Platform can auto-fill the verification checklist via AI-assisted document extraction (OCR + foundation-model field extraction) and route applications to a fast-lane queue when confidence is high and no flags are present [Growth].
- FR53: The Platform can cross-check uploaded documents against state public registries via state-specific adapters where APIs exist, with confidence scoring [Growth].
- FR54: Admins can view a customer-report queue with structured intake data and admin-vendor messaging tools to investigate reports.
- FR55: Admins can issue warnings to vendors, suspend vendor listings, restore suspended listings, and remove vendors from the platform.
- FR56: The Platform can automatically pause a vendor's listings on receipt of a foodborne-illness report and notify the vendor with an incident-notice email.
- FR57: Admins can coordinate FDACS reporting with the affected customer and vendor, including providing FDACS-relevant intake data and recording the investigation timeline in an audit log.
- FR58: The Platform can track vendor cancellation rates against configurable thresholds and automatically warn vendors who exceed them; repeated patterns auto-trigger admin review and listing suspension. Initial thresholds: warn at >10% over rolling 30-day window with ≥10-order minimum sample; auto-trigger admin review at >20%. Thresholds and rolling-window length must be admin-configurable.
- FR59: The Platform can send permit and certification expiry alerts to vendors at 90, 60, and 30 days before expiry, and automatically pause listings on expiry if not renewed.
- FR60: The Platform can prompt all vendors annually to re-attest current compliance, with non-response triggering listing pause [Growth].
- FR61: The Platform can record every admin action (vendor approve, reject, request more, warn, suspend, remove, refund, report investigation, incident response) in an immutable audit log with actor, timestamp, vendor/customer affected, and reason.
- FR62: Admins can issue refunds and credits to customers as a discretionary action, with the action recorded in the audit log.

**Platform Communication & Real-Time Foundations**

- FR63: The Platform can send transactional emails for vendor application status changes, customer order confirmations and updates, vendor order notifications, cancellation notices, substitute-suggestion notices, expiry alerts, and incident notifications.
- FR64: Customers and Vendors can read messages from each other through an in-app inbox.
- FR65: The Platform can ingest Stripe webhook events (payment success, payment failure, refund processed, payout completed, dispute, Connect account update) and propagate the resulting state changes through the same event-emission system as user-driven mutations.
- FR66: The Platform can emit a domain event on every state change (order placed/updated/cancelled, inventory delta, vendor application status, vendor profile/listing change, admin action, customer report filed, refund issued, payout completed) such that subscribers (email delivery, audit logging, expiry-alert scheduling, analytics ingestion) consume events without modifying the publishing code.
- FR67: Customers and Vendors can receive in-app notifications via real-time push for order status changes, vendor messages, expiry alerts, and admin requests [Growth].
- FR68: Vendors can see live updates to their order list and dashboard without manual refresh [Growth].
- FR69: Admins can see live updates to the verification queue and report queue without manual refresh [Growth].
- FR70: Customers can see live inventory counts on product pages and order tracking updates on order pages [Growth].
- FR71: Customers can opt into web push notifications for order updates and vendor alerts [Vision].
- FR72: Customers and Vendors can hold inventory during checkout for a configurable window with optimistic locking and live count visibility [Vision].

### NonFunctional Requirements

**Performance**

- NFR1: SEO-critical pages (marketplace home, search results, farm profiles, product detail, geo landing pages) achieve LCP <2.5s, INP <200ms, CLS <0.1 on mid-tier mobile (3G Fast equivalent), measured at the 75th percentile.
- NFR2: Server-rendered pages return TTFB <600ms when CDN-cached, <1s when uncached, at the 95th percentile.
- NFR3: Authenticated dashboard surfaces (vendor dashboard, admin queue) reach interactive paint within 1.5s of navigation at the 95th percentile.
- NFR4: Search and filter results return within 500ms for typical queries (single-state scope, <10 facets) at the 95th percentile.
- NFR5: End-to-end checkout (cart load → payment confirmation) completes within 8 seconds for a 3-vendor order at the 95th percentile, inclusive of Stripe round-trips.
- NFR6: Image delivery uses modern formats (AVIF/WebP with fallback), responsive sizing, and lazy loading; vendor product photos are compressed to ≤200KB at displayed size at the 95th percentile.

**Security**

- NFR7: All network traffic encrypted via TLS 1.3 (or current industry best practice); HSTS enforced; HTTPS-only.
- NFR8: Sensitive data at rest is encrypted (database, file storage, backups).
- NFR9: Customer payment card data is never stored on Farm2Table infrastructure — all card handling is delegated to Stripe (PCI scope minimization); the platform handles only Stripe-issued tokens.
- NFR10: Vendor banking, tax (W-9/W-8), and identity-verification data are handled by Stripe Connect's hosted onboarding and never stored on Farm2Table infrastructure.
- NFR11: Vendor-uploaded compliance documents (licenses, permits, certifications) are stored with at-rest encryption and access-controlled to admin role only.
- NFR12: Admin authentication requires mandatory 2FA from day one (TOTP or hardware key); password-only admin auth is not permitted.
- NFR13: Vendor authentication requires email verification at signup; 2FA is optional at MVP and mandatory at Growth tier and above.
- NFR14: Customer authentication requires email verification before first order; passwords meet OWASP minimum strength rules (≥12 chars, breach-list checked).
- NFR15: Session tokens expire (idle timeout ≤24 hours, absolute timeout ≤30 days), can be invalidated server-side, and logout-everywhere works for all users.
- NFR16: All Stripe webhook payloads have HMAC signature verification before processing; unverified webhooks are rejected.
- NFR17: Rate limiting protects authentication endpoints, order placement, report submission, and password-reset flows (anti-abuse, anti-credential-stuffing).
- NFR18: Application secrets (API keys, database credentials, Stripe keys) are stored in environment variables or a managed secrets store; never committed to source control.
- NFR19: Internal staff access to PII follows least-privilege; staff access to vendor or customer records is logged in the audit trail.
- NFR20: Annual security review covering OWASP Top 10 (injection, auth, sensitive data, XXE, access control, misconfig, XSS, deserialization, vulnerable components, logging) starts at MVP+1 year or upon first incident.

**Privacy & Data Lifecycle**

- NFR21: CCPA/CPRA compliance from day one, with parallel state law compatibility (VCDPA, CPA, CTDPA, UCPA, and additional state privacy laws as they enter force).
- NFR22: Customers can export all personal data within 24 hours of request, in a portable format (JSON or CSV).
- NFR23: Customer account deletion purges PII within 30 days; audit-relevant references are pseudonymized rather than deleted to preserve regulatory defense.
- NFR24: "Do Not Sell or Share My Personal Information" link is prominently placed (footer of every page), functional, and the platform confirms each opt-out request.
- NFR25: Cookie consent management distinguishes essential cookies from analytics/marketing cookies; non-essential cookies require opt-in.
- NFR26: Data Processing Agreements are in place with every third-party data processor (Stripe, email service provider, analytics, error tracking, image CDN, foundation-model API at Growth).
- NFR27: EXIF metadata is stripped from all uploaded images at the time of upload, before storage or display (vendor-home-address leakage prevention).
- NFR28: Customer data is not sold or shared with third parties for marketing purposes; vendor data shared with the customer (farm address, certifications, product details) is the explicit publishing intent.
- NFR29: Personal data retention policies are documented per data category; retention durations align with regulatory minimums (food safety: 7 years; tax: 7 years; consumer privacy requests: per applicable state law).

**Reliability & Availability**

- NFR30: Marketplace storefront uptime ≥99.9% (≤43 minutes downtime per month) at MVP, ≥99.95% by end of Y2.
- NFR31: Higher-priority availability targeted during peak ordering windows (per active metro: Sunday 6pm–11pm local time, market days for that metro); maintenance is scheduled outside these windows.
- NFR32: Recovery Time Objective (RTO) ≤2 hours for total platform recovery from a catastrophic failure.
- NFR33: Recovery Point Objective (RPO) ≤15 minutes for the primary datastore — order, payment, and audit-log data have near-zero loss tolerance.
- NFR34: Stripe webhook handlers are idempotent — replaying any webhook (e.g., on Stripe's automatic retry) produces no double-processing.
- NFR35: Background-job retry policies handle transient failures with exponential backoff; jobs that fail after retry are surfaced to the admin queue rather than dropped silently.
- NFR36: Transactional email delivery: messages are queued and retried on transient failure; eventual delivery success rate ≥99.5%.
- NFR37: Graceful degradation: if a non-critical service (analytics, public-registry lookup, AI document review) fails, core flows (browse, checkout, vendor onboarding, admin verification) continue to function.
- NFR38: Disaster recovery procedure is documented and tested annually starting in Y2.

**Scalability**

- NFR39: MVP capacity: 1,000 concurrent browsing users, 100 concurrent checkout sessions, 50 active vendors, ≤200 daily orders, without degradation against the performance NFRs above.
- NFR40: Y2 capacity: 10,000 concurrent browsing users, 500 concurrent checkout sessions, 200 active vendors, ≤2,000 daily orders, on the same architecture (no rewrite).
- NFR41: Y3 capacity: 50,000 concurrent browsing users, 2,000 concurrent checkout sessions, 500+ active vendors across multiple metros, ≤10,000 daily orders.
- NFR42: Adding new states to the platform requires only rules-engine data updates (and Stripe Tax registration), not architectural changes.
- NFR43: Vendor count growth is linear in resource consumption; no per-vendor infrastructure provisioning is required.
- NFR44: Critical-path database queries are indexed; no full-table scans permitted on the order, vendor, product, or audit-log tables at production scale.
- NFR45: The platform handles 10× peak load above weekly average without availability impact, accepting up to 50% latency degradation for the spike duration.

**Accessibility**

- NFR46: Consumer-facing surfaces meet WCAG 2.1 Level AA at MVP.
- NFR47: Vendor and admin surfaces meet WCAG 2.1 AA targets at MVP for keyboard navigation, color contrast, focus visibility, and screen-reader labeling; advanced patterns may slip to Growth with documented exceptions.
- NFR48: Automated accessibility testing (axe-core or equivalent) gates every pull request to prevent regressions.
- NFR49: Manual screen-reader testing of critical flows (browse, checkout, vendor onboarding, admin verification queue, customer reporting) is performed before every public release.
- NFR50: A third-party accessibility audit is commissioned annually starting at Growth scale (Phase 2).

**Observability & Operability**

- NFR51: All backend services emit structured logs with request correlation IDs; logs are searchable and retained ≥30 days at MVP, ≥90 days at Growth.
- NFR52: Error tracking is integrated (Sentry or equivalent) with on-call alerting on error-rate spikes, new error fingerprints, and regressions.
- NFR53: Uptime monitoring covers customer storefront, vendor dashboard, admin queue, checkout flow, and Stripe webhook intake; alerting routes to on-call.
- NFR54: Application metrics (request rates, latencies, error rates, database query performance) are collected and dashboarded.
- NFR55: Business metrics (GMV, daily/weekly orders, vendor onboarding velocity, admin queue depth, marketplace-sourced order ratio, customer reorder rate) are collected and dashboarded for founder visibility.
- NFR56: Stripe webhook delivery is monitored — success/failure rates per event type — with replay capability for any missed event in the last 30 days.
- NFR57: Customer- and vendor-facing error messages do not leak internal implementation details (stack traces, database errors, internal IDs); a unique error reference is shown for support escalation.
- NFR58: Maintenance windows are communicated to vendors and customers ≥48 hours in advance via email and in-app status banner; emergency maintenance has best-effort communication.

**Compliance & Auditability**

- NFR59: The audit log is immutable — no edit, delete, or backdate operations are possible at the application or database layer; tampering is detectable.
- NFR60: Audit log retention: ≥7 years (aligned with food-safety and tax regulatory minimums); longer where active litigation hold applies.
- NFR61: The audit log records every admin action (vendor approve, reject, request more, warn, suspend, remove, refund, report investigation, incident response), every vendor agreement signing and re-attestation, every compliance document upload and verification decision, every customer privacy request (export, deletion, opt-out), and every foodborne-illness incident with full investigation timeline.
- NFR62: The audit log is queryable for state AG investigations, FDACS inquiries, FDA inquiries (FSMA 204 at Growth), and litigation discovery, with admin-grade access controls and access logging.
- NFR63: Vendor verification documentation (uploaded permits, attestations, registry cross-check evidence) is retained per vendor for the duration of their account plus 7 years after deactivation.
- NFR64: FDACS-coordination and foodborne-illness investigation records are retained per food-safety regulatory minimums and made available to FDACS on request.
- NFR65: Stripe Tax reporting (sales by state, taxable vs. exempt breakouts) is available on demand for state revenue department audits.
- NFR66: Documented data lineage exists: each vendor's approval traces to the documents and rules-engine version that approved them; substitute suggestions to the taxonomy version that generated them; tax calculations to the PTC mapping version applied. Versioned and replayable for audit defense.

### Additional Requirements

Architecture-driven implementation requirements that shape epic and story creation.

**Project initialization & monorepo structure**

- AR1 (Starter Template): Initialize project from `npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo`, then strip Expo (`apps/native/`), restructure to a three-app + six-package layout, switch to yarn berry with `nodeLinker: node-modules`, install Playwright (not Cypress), switch shadcn primitives to Base UI, skip `@convex-dev/resend` (Resend lives in Next.js), and run `npx convex ai-files`. This is Story #1 and is the foundation for all subsequent stories.
- AR2 (Three-app split): Three Next.js apps on three subdomains — `apps/marketplace` (farm2table.app, customer-facing public + customer-auth), `apps/vendor` (vendors.farm2table.app, vendor-org-scoped), `apps/admin` (admin.farm2table.app, platform-admin Clerk org membership + mandatory 2FA per NFR12). Apps never import from each other.
- AR3 (Six packages): `@workspace/backend` (Convex), `@workspace/ui` (shadcn + Base UI primitives), `@workspace/rules-engine` (state × category compliance data + matchers), `@workspace/web-shared` (shared utilities for all 3 apps), `@workspace/seed-data` (synthetic seed for QA reset), `@workspace/eslint-config` (shared ESLint configs), and `@workspace/email-templates` (React Email components). One-way dependency graph enforced via ESLint `import/no-restricted-paths`.
- AR4 (No barrels): Packages expose public surface via `exports` field with subpath imports (`./*` → `./src/*.tsx`); no `index.ts`/`index.tsx` outside `_generated/` and Next.js special files; ESLint blocks barrels.

**Backend platform & data**

- AR5 (Convex backend): Database, reactive queries, mutations, scheduled functions, cron, file storage. Schema in `packages/backend/convex/schema.ts` is the single source of truth; generated types flow to Next.js with zero duplication.
- AR6 (Order schema — three-table envelope): `orders` (customer-facing envelope: payment, totals, top-level status) → `vendorOrders` (per-vendor slice: fulfillment method/details, vendor-side status, Stripe transfer ID) → `orderItems` (line items: quantity, unitPrice, taxAmount, taxJurisdiction, per-line refund tracking, per-line cancellation independence).
- AR7 (Cart schema): `carts` + `cartItems` + `cartFulfillmentChoices`. Anonymous browse + add-to-cart with cookie-based `sessionId`; email captured at checkout-start; authenticated cart merges with anonymous cart on sign-in. Anonymous retention: 0–7 days active, 7–30 days marked `abandonedAt`, >30 days hard-purged via cron. Cookie: `httpOnly`, `secure`, `sameSite=lax`, sliding 30-day Max-Age. Cart abandonment email *delivery* is a Growth feature; schema captures the data at MVP.
- AR8 (Validation strategy): Convex `v` validators + `convex-helpers/validators` (`literals`, `nullable`, `partial`, `pick`, `omit`) for backend; Zod for client-side form validation (paired with React Hook Form via `@hookform/resolvers/zod`), Next.js API route input validation, and shared types between client + Next.js API routes. React Hook Form + Zod is mandatory; never bare `useState`/`useEffect` for form state.
- AR9 (Migration approach): Backwards-compatible additions are direct edits with no migration script. Backwards-incompatible changes use dual-write + backfill + cutover (add new field/table alongside old, update writers to write both, backfill via Convex action, update readers, remove old). QA tier is the rehearsal venue.
- AR10 (Search): Convex's built-in `searchIndex` for MVP. `products.searchIndex("by_text", { searchField: "searchableText", filterFields: ["category", "vendorState", "practices", "certifications"] })`; `farms.searchIndex("by_text", { searchField: "searchableText", filterFields: ["state", "city", "practices"] })`. `searchableText` denormalized at write time. Escalation to Algolia or Typesense at Growth if quality insufficient.
- AR11 (Soft-delete pattern): Vendors `status: active|suspended|removed`; compliance docs `status: pending|verified|rejected|superseded`; products `status: draft|published|archived`; orders state-transitions only. Hard delete only where compliance requires (customer account PII purge per NFR23). Audit log immutable per NFR59.

**Auth, multi-tenancy & rate limiting**

- AR12 (Clerk Organizations for vendor multi-tenancy): Each vendor (farm/cottage food/commercial/micro) = one Clerk Organization (org name = farm name; org metadata holds Convex `vendorId`, tier, slug). Vendor team members = Org members with roles (`owner`, `admin`, `fulfillment`). Customers = personal users (no org context). Platform operators = members of a separate "Platform" Clerk Organization. `ConvexProviderWithClerk` bridges Clerk session → Convex auth context; `useConvexAuth()` for auth state. Clerk webhooks → Next.js API route → Convex internal mutation for user/org lifecycle sync. Per-tier vendor team-member limits (Foundation: 5, Growth/Pro: unlimited) enforced in Convex `addOrgMember` mutation.
- AR13 (Auth wrappers via `convex-helpers/server`): `publicQuery`/`publicMutation`, `customerQuery`/`customerMutation`, `vendorQuery`/`vendorMutation`, `vendorOwnerMutation`, `adminQuery`/`adminMutation` (platform-admin Clerk org member with mandatory 2FA), `internalMutation` (called only by actions/scheduled jobs). Wrappers populate `ctx.user` and `ctx.org` from Clerk session; eliminate per-function auth boilerplate.
- AR14 (Rate limiting — three-source split): Clerk handles auth-endpoint rate limiting (sign-in, password reset, MFA verification). `@convex-dev/rate-limiter` Convex component handles user-action mutations (place order, submit report, send message, invite team member) — integrated into the wrapper layer. Vercel-edge / Upstash Ratelimit deferred until anonymous-traffic abuse pattern emerges. Algorithm choice per use case: token bucket for bursty actions, fixed window for periodic.
- AR15 (Compliance-doc encryption posture): Convex's default AES-256 at-rest encryption + admin-role-only access wrappers issuing short-lived signed Convex storage URLs (`vendorOwnDocReadUrl(docId)` / `adminDocReadUrl(docId)`). No application-level envelope encryption at MVP. No public-read path exists.
- AR16 (Sessions / CSRF / CORS — explicit non-decisions): Convex client uses bearer tokens (not cookies); webhook routes (Stripe, Clerk, Resend) protected by HMAC signature verification, not session. All client traffic same-origin (Vercel); Convex enforces origin allowlisting at deployment level. Clerk owns session lifecycle.

**Stripe integration & webhooks**

- AR17 (Stripe Connect with split payments + KYC delegation): Vendor onboarding via Stripe-hosted identity + bank verification (NFR10). Split payments per vendor; per-line-item refunds reverse splits correctly without affecting other vendors. Payouts 7 days post-delivery.
- AR18 (Stripe Tax with PTC mapping): `packages/backend/convex/products/taxMapping.ts` — `PTC_BY_CATEGORY` default + `PTC_BY_SUBCATEGORY` overrides (Beverages, Nuts & Snacks). Used by `convex/orders/internal.ts` at order creation to set per-line `stripePTC`. Multi-state from day one (NFR42).
- AR19 (Stripe webhook idempotency table): Dedicated `stripeWebhookEvents` table with `stripeEventId` index for O(1) idempotency check. Vercel API route receives webhook → verifies HMAC (NFR16) via `stripe.webhooks.constructEvent` → calls Convex internal mutation `stripe.processWebhook` → atomic idempotency check on `stripeEventId` (NFR34) → dispatch by event type → emit domain event (FR65/66). Replay capability (NFR56): `adminMutation stripe.replayWebhook({eventId})` re-runs stored payload through dispatch. 30-day payload retention via cron purge. Same idempotency pattern with separate slim tables for Clerk (`clerkWebhookEvents`) and Resend (`resendWebhookEvents`).

**Event-driven backbone & domain events**

- AR20 (Domain events table & emit helper): `domainEvents` table with standardized envelope (`eventId` ULID, `eventType`, `occurredAt`, `emittedAt`, `actorId`, `actorType` ∈ user|vendor|admin|system|stripe|clerk, `correlationId`, `payload`). Indexes on `eventId`, `(eventType, emittedAt)`, `actorId`, `correlationId`. Per-event payload typing in `convex/_types/domainEvents.types.ts` as discriminated union. Emit helper (`emitEvent` in `convex/helpers/events.ts`) is type-safe.
- AR21 (Domain event naming): `domain.actionInPastTense` lowercase dot-notation, camelCase both segments. Domain matches schema table name (singular: `vendorOrder` for `vendorOrders`). Action is past-tense verb. Stripe webhook event types stay snake_case at API route boundary, translated to camelCase before emission.
- AR22 (Event versioning): Incompatible payload changes version event type (`order.placed` → `order.placedV2`); subscribers handle both during transition; clean cutover after backfill.
- AR23 (Subscriber pattern): Subscribers (email delivery, audit logging, expiry-alert scheduling, analytics ingestion) attach via `domainEvents` watch without modifying publishing code. Email-trigger subscribers in `convex/domainEvents/emailSubscribers/` (orderEmails, vendorApplicationEmails, vendorOperationsEmails, complianceDocEmails, incidentEmails, payoutEmails, cartEmails [Growth]) schedule Convex actions.

**Audit log & compliance**

- AR24 (Audit log subscriber via `ctx.meta.getFunctionMetadata()`): Captures function-name/visibility automatically (NFR61) without per-mutation boilerplate. `convex/helpers/audit.ts` provides the helper; subscribers attach via `domainEvents` watch. Captures: every admin action, every vendor agreement signing/re-attestation, every compliance doc upload + verification decision, every customer privacy request (export, deletion, opt-out), every foodborne-illness incident timeline.
- AR25 (Compliance-doc retention): `vendorDocuments` retained for vendor account duration + 7 years after deactivation (NFR63). No code path deletes a compliance doc before retention expires; on vendor "deactivation" docs persist with admin-only access.
- AR26 (Transaction metrics safety): `ctx.meta.getTransactionMetrics()` used as proactive safety pattern on queries known to grow (admin queue, audit log queries, rules-engine evaluations); surfaces "approaching limit" warning event before hitting Convex's per-transaction cap.
- AR27 (Feature flags table): `featureFlags` for phased-rollout decisions (pilot → commercial, MVP → Growth UX gating). Geographic expansion = adding metros + vendors via feature flags, not promoting environments.

**Rules engine**

- AR28 (Rules engine package): `packages/rules-engine/` — `rules.ts` (entry: `lookup(state, category, products)`), `match.ts` (matcher logic), `states/` per state (FL = MVP launch + NC, TX, GA, PA, TN, ND for early expansion), `rules.types.ts`. Versioned for audit replay (NFR66). Adding states is data update only (NFR42).
- AR29 (Public registry adapters): `packages/rules-engine/src/registries/` — adapter interface specification + add-a-state guide. Empty at MVP; populated at Growth (FR53).

**Frontend architecture**

- AR30 (Data-fetching by route type): Marketing/legal/blog/regulatory explainers — Server Component with `fetchQuery` (or pure static); cached with Next.js `use cache`. Marketplace browse, farm profiles, product detail, geo landing — Server Component `preloadQuery` → Client Component `usePreloadedQuery`. Vendor dashboard, admin queue, customer account, order tracking — Client Component with `useQuery` only. Checkout — Client Component with `useQuery` for cart state; Stripe Elements client-only. Search results — Server Component with `preloadQuery`.
- AR31 (Client island rule, hard): `"use client"` goes on the leaf-most component that actually needs interactivity. Pages and layouts default to Server Components. Client Components compose around Server Components via the `children` prop pattern.
- AR32 (Cache Components opt-in policy): Marketing/legal pages — `use cache`, long TTL, `revalidatePath`. Blog/FAQ/regulatory — `use cache` + `revalidateTag('blog')` on publish. Geo landing pages — `use cache` with tag, `revalidateTag('catalog:${city}:${product}')` on matching product changes. Marketplace browse / category index — `use cache` short TTL, `revalidateTag('catalog')` on product publish/unpublish. Farm profile / product detail / search results / auth-gated surfaces — never cached. Tag taxonomy: `catalog`, `catalog:${city}:${product}`, `blog`, `legal`, `marketing`.
- AR33 (Convex hook wrappers): Single canonical entry point in `@workspace/web-shared/convex.ts` — wrapped `useQuery` (rich-status, cached), `usePaginatedQuery` (cached), `useMutation` (with `isPending` + `error`), `useAction` (with `isPending` + `error`). `ConvexQueryCacheProvider` wraps app at root with `expiration: 300_000ms`, `maxIdleEntries: 250`. ESLint `no-restricted-imports` blocks direct imports of `useQuery`/`useMutation`/`useAction`/`usePaginatedQuery` from Convex packages outside `lib/convex.ts`.
- AR34 (Tri-state loading pattern): Via wrapped `useQuery` — `if (status === "pending") return <Skeleton />; if (status === "error") return <ErrorState />; if (data === null) return <NotFound />;`. Server Components use Next.js `loading.tsx` for full-page; `<Suspense>` for inner sections. `usePreloadedQuery` (SSR-hydrated) needs no loading state initially. Mutation in flight uses inline UI state via `useMutation`'s `isPending`. Forbidden: spinners for content loading, loading states <100ms flash, conflating `pending`/`error`/`null`, blocking whole page on a mutation, "Loading..." text labels.
- AR35 (Three-layer error boundaries): Layer 1 `app/global-error.tsx` (root fallback). Layer 2 per-route-group `error.tsx` (`(marketing)`, `(storefront)`, `(vendor)`, `(admin)`, `checkout/`). Layer 3 component-level via `react-error-boundary` for non-critical sections. Mutation failures → toast notifications with `userMessage` from `appError`. Sentry captures at wrapper layer (server) and boundary layer (client); both attach correlation ID. Sentry Replay enabled in prod, disabled on admin queue and vendor compliance-doc views.
- AR36 (UI state policy): Server state → Convex queries; form state → React Hook Form + Zod; cart state → Convex `carts` table; URL search params (default for shareable/bookmarkable/back-button-able state) → `useSearchParams` + `useRouter` (filters, sort, pagination cursors, search query, geo selector, multi-step wizard progress); component-local UI state → `useState`/`useReducer` (modal open, dropdown, hover, drag preview, transient flickers); cross-component client state → Zustand or jotai only when documented use case shows URL state and React state both fail (probably zero use cases at MVP).

**Error handling & API patterns**

- AR37 (`appError` helper): Two-tier error handling. `appError(code, userMessage, data?)` throws `ConvexError` with structured `AppErrorCode` (e.g., `auth.unauthenticated`, `auth.forbidden`, `validation.invalid`, `vendor.tier_limit_exceeded`, `vendor.cancellation_threshold_breached`, `order.line_already_refunded`, `rules_engine.no_rule_for_state_category`, `internal.unexpected`). Known errors carry safe-to-show user message + structured payload for client conditional handling. Unexpected errors bubble up → caught by wrapper → logged to Sentry with function name (via `ctx.meta.getFunctionMetadata()`), user/org identity, args + auto-generated correlation ID → re-thrown as `appError("internal.unexpected", "Something went wrong. Reference: ABC123")`. Satisfies NFR57.
- AR38 (Convex function-type rules): Query — read-only, no external calls, deterministic, reactive. Mutation — read + write, transactional, never call external APIs. Action — external API calls; can call internal queries/mutations; not transactional. HTTP action — external HTTP endpoints (Resend webhook receiver). Hard rule: mutations never call `fetch` or third-party SDKs. External-data flow is action → fetch → call internal mutation with results. Enforced by wrapper layer; documented in `AGENTS.md`.
- AR39 (Server Actions vs API Routes): Server Action when caller is React component (button click, form submit) — type-safe, CSRF-protected via React's encrypted action references, native redirect support. API Route when caller is server-side (Convex action, external service, webhook receiver, cron). Concrete: Stripe Connect onboarding URL, Stripe customer portal session, admin discretionary refund, vendor cancel-line refund — Server Actions. Stripe/Clerk/Resend webhook receivers, Email send (called by Convex action) — API Routes.

**Email integration (Resend in Next.js, NOT Convex)**

- AR40 (Email lives in Next.js): `@convex-dev/resend` is NOT used (requires Node runtime). Instead: Convex domain-event subscriber schedules a Convex action (V8 isolate); action `fetch`-POSTs to `apps/marketplace/app/api/emails/send/route.ts` with shared secret + idempotency key; Next.js renders React Email template from `@workspace/email-templates`, calls Resend SDK; Resend webhook lands at `apps/marketplace/app/api/resend/webhook/route.ts`, propagates delivery status back via Convex internal mutation.
- AR41 (Email infrastructure features): Idempotency via `Idempotency-Key` header on Resend API call (composite key = `${eventId}-${emailType}`). Retry via Convex action's `scheduler.runAfter` with exponential backoff; max attempts (default 5) tracked in `pendingEmails` Convex table; failures beyond max surface to admin queue. Rate limiting via Resend's 429 with `Retry-After` propagated through Next.js to Convex action reschedule. Webhook delivery tracking in `emailDeliveryEvents` Convex table. Per-environment `From` address (test-mode for dev/qa, prod for prod). Batching (deferred) — single sends per event at MVP.
- AR42 (Internal API auth): Shared secret pattern. `INTERNAL_API_SECRET` env var stored in both Convex env (per tier) and Vercel env (per tier). Convex action sends as `X-Internal-Auth` header; Next.js route checks header. Rotated annually; rotation procedure in `docs/DEPLOYMENT_RUNBOOK.md`.
- AR43 (Email templates package): `packages/email-templates/` — React Email components rendered to HTML at email-send time inside the Next.js API route. Templates: OrderConfirmation, VendorApplicationApproved, VendorApplicationRejected, VendorMoreInfoRequested, OrderLineRefunded, OrderLineCancelled, ComplianceDocExpiring (FR59), ComplianceDocExpired, FoodborneIllnessIncidentNotice (FR56), PayoutCompleted, VendorWarningIssued (FR55), VendorTeamInvite. Local preview workflow: `cd packages/email-templates && npx react-email dev`.

**Image upload pipeline**

- AR44 (Image upload flow): Client requests upload URL via Convex query → POSTs file directly to that URL (browser → Convex storage) → calls mutation `attachImage({ storageId, productId })` which schedules action `processImage({ storageId })` → Convex action (V8 isolate) validates content type and size, strips EXIF (NFR27) using V8-compatible library, generates responsive variants, updates record with final storageId(s). Same flow for `vendorDocuments` with PDF parsing instead of image processing (PDF parsing is V8-compatible via `pdf.js` or similar). If image processing needs grow, move to Next.js API route same as email.

**Substitute matching & in-app messaging**

- AR45 (Substitute matching engine): `packages/backend/convex/products/substitutes.ts` — matcher logic + `__tests__/substitutes.test.ts`. Used by `convex/orders/internal.ts` (substitute suggestions on vendor cancellation, FR38) and `convex/products/queries.ts` (browse-time substitute discovery). MVP = category match; Growth lifts to deeper attribute match (FR40).
- AR46 (Customer in-app inbox, FR64): `apps/marketplace/app/(customer)/messages/page.tsx` — customer-vendor messaging UI. Mirrors `apps/vendor/app/messages/page.tsx`. Both read from `convex/messages` (new domain folder). MVP is "basic" messaging — in-app inbox for hold/cancellation requests. Real-time chat semantics deferred to Vision.

**Hosting, deployment & environments**

- AR47 (Three-tier deployment topology): Dev — local solo dev backend (`npx convex dev`); Stripe-test mode, Clerk dev instance, Resend sandbox; throwaway data. QA — long-lived pre-prod testing (`npx convex deployment create qa --type prod`); Stripe-test, separate Clerk instance, Resend with verified `qa.farm2table.app` subdomain; seeded with synthetic vendors across multiple states/categories, synthetic customers, test orders, simulated foodborne-illness reports; data persists; resettable from `packages/seed-data/` via `npx convex import --replace`. Prod — production from day one of pilot; Gainesville (Oct 2026) and Tampa Bay-Sarasota (Q1 2027) share the same prod database, audit log, and Stripe live account. **Geographic expansion = adding metros + vendors via feature flags, not promoting environments.**
- AR48 (CI/CD — GitHub Actions, three workflows): PR validation (every PR) — lint, typecheck, Convex schema validation (`npx convex dev --once --typecheck`), `convex-test` unit tests, build check, Playwright smoke (`--project=chromium` against Vercel preview + qa Convex), gitleaks. Main → qa deploy (on merge to `main`) — `npx convex deploy --target qa --message "$GITHUB_SHA: $COMMIT_SUBJECT"`, Vercel auto-deploys main → qa, full Playwright suite across all browser projects (chromium / firefox / webkit / mobile-safari / mobile-chrome) against qa, Sentry release tagged. QA → prod promotion (manual `workflow_dispatch` with `"PROMOTE"` confirmation) — assert latest qa E2E green, `npx convex deploy --target prod`, Vercel promote, Sentry release tagged for prod, smoke tests against prod, alert + rollback on failure. Trunk-based on `main`; short-lived feature branches.
- AR49 (Env var topology): Vercel env vars (Production / Preview / Development) own anything Next.js needs at build/runtime (NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_CONNECT_CLIENT_ID, SENTRY_DSN, NEXT_PUBLIC_SENTRY_DSN, NEXT_PUBLIC_APP_URL). Convex env vars (per deployment) own anything Convex functions need (RESEND_API_KEY, RESEND_WEBHOOK_SECRET, CLERK_JWT_ISSUER_DOMAIN, Convex-side SENTRY_DSN). Convex env defaults (`npx convex env default set/get/list`) populate to new dev/preview deployments. GitHub Secrets are CI-only (CONVEX_DEPLOY_KEY_QA, CONVEX_DEPLOY_KEY_PROD, VERCEL_TOKEN, SENTRY_AUTH_TOKEN). Sync rule: secrets that should never drift live in only one place.

**Monitoring & DR**

- AR50 (Monitoring stack): Sentry for error tracking (NFR52) — free tier covers MVP; PII filtering on send; Session Replay enabled in prod, disabled on admin/compliance-doc surfaces; correlation ID auto-attached from `appError`; source maps uploaded from CI. Convex dashboard logs + Vercel Pro logs (30d) cover NFR51 at MVP; defer log aggregation until ≥90d Growth requirement. BetterStack (free tier 10 monitors, 3-min checks) for uptime (NFR53) — monitors storefront homepage, browse, Stripe webhook intake, vendor portal, admin portal, Convex deployment health; status page doubles as customer/vendor maintenance comms (NFR58). Convex dashboard + Vercel built-ins for application metrics (NFR54). Custom admin dashboard in Next.js admin section querying Convex directly for business metrics (NFR55) — GMV, daily/weekly orders, vendor onboarding velocity, admin queue depth, marketplace-sourced order ratio, customer reorder rate, cart abandonment when ≥2 pickup locations, vendor cancellation rates with FR58 threshold visibility. Maintenance windows (NFR58) via BetterStack public status page + Resend email (≥48h notice) + in-app banner via feature flag.
- AR51 (Backup & DR): Primary — Convex Cloud's native backup + PITR — handles NFR32 RTO ≤2h and NFR33 RPO ≤15min. Secondary — weekly manual exports (`npx convex export --target prod`) to AWS S3 (or Cloudflare R2) with 90-day retention. Logical-error recovery — Convex PITR within window; augmented by application-level soft-delete pattern (AR11). DR runbook at `docs/DISASTER_RECOVERY.md` covering Convex regional outage, data loss in PITR window, catastrophic data loss, Vercel outage, Clerk outage, Stripe outage. DR drill cadence: annually at MVP per NFR38, quarterly at Growth; drills run against QA tier.

**TypeScript & code conventions**

- AR52 (TS strict mode plus): `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `noFallthroughCasesInSwitch: true`, `exactOptionalPropertyTypes: true`, `useUnknownInCatchVariables: true`, `verbatimModuleSyntax: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`. `type` for everything (no `interface`); no `I` prefix on type names; no `T` suffix; discriminated unions use `kind`; `null` for explicit "no result" (Convex idiom), `undefined` for default "no value"; TypeScript `enum`s forbidden (use `literals(...)` from `convex-helpers/validators`); `any` forbidden (use `unknown`). Branded types via `convex-helpers/validators` `brandedString("email")` for structurally constrained strings.
- AR53 (Field & identifier naming): camelCase everywhere internally. External-protocol naming (Stripe's snake_case, Clerk's snake_case in some payloads) is translated at the API-route boundary. URL search params: camelCase. Stripe / Clerk webhook payloads: snake_case at the boundary, translated to camelCase before propagating. Booleans: `is`/`has`/`can`/`should` prefix. IDs: always `vendorId`, `customerId`, `orderId`. Timestamps: past-tense verb + `At` suffix; future-time fields use noun form (`expiry`); all stored as `number` (epoch ms). Date-only: ISO date string `"YYYY-MM-DD"` with `Date` suffix. Async functions: no `Async` suffix. Event handlers: `handle` prefix internally, `on` prefix for prop names.
- AR54 (Date / time / timezone): Library: `date-fns` (with `date-fns-tz`). No moment.js, no dayjs, no Luxon. Storage: datetimes as `number` (epoch ms, UTC); date-only as ISO date string. Wire format = storage. All comparisons/arithmetic in UTC. Vendor-local times for pickup windows: store UTC moment + IANA timezone string per vendor (e.g., `"America/New_York"`); render in vendor's TZ on vendor surfaces, customer's TZ on customer surfaces. Display via native `Intl.DateTimeFormat` API wrapped in named formatters in `lib/datetime.ts`. All date display goes through `lib/datetime.ts` — no inline `format()` calls. Stripe timestamps in seconds → translate to milliseconds at API route boundary.
- AR55 (File naming): React component files — `PascalCase.tsx` (default export, name matches file). React hook files — `useCamelCase.ts`. Convex function files — `camelCase.ts` (`queries.ts`, `mutations.ts`, `internal.ts`). Convex helper files — `camelCase.ts`. Next.js special files — lowercase (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`). Type files — `[name].types.ts` always. Constants/config — `camelCase.ts`. Component test files — `PascalCase.test.tsx`. Convex/hook test files — `camelCase.test.ts`. Playwright spec files — `camelCase.spec.ts`. URL path segments — `kebab-case`.

**Testing & quality**

- AR56 (Test stack): Convex backend functions — `convex-test` (in-process Convex; real schema, real DB-in-memory); `.test.ts`; in `convex/[domain]/__tests__/`. React components — Vitest + `@testing-library/react`; `.test.tsx`; in colocated `__tests__/`. Pure utility functions — Vitest; `.test.ts`; in colocated `__tests__/`. E2E user flows — Playwright; `.spec.ts`; in `apps/[app]/tests/e2e/`. Shared `initConvexTest` helper at `packages/backend/convex/__test_helpers/initConvexTest.ts` registers all installed Convex components (`@convex-dev/resend` removed, `@convex-dev/rate-limiter` registered). ESLint blocks direct `import { convexTest } from "convex-test"` everywhere except this file.
- AR57 (100% coverage gate): Vitest coverage with `--coverage.thresholds.global=100` for statements, branches, functions, lines. Both `packages/backend` and `apps/[app]`. Coverage gate runs in CI; PRs fail if coverage drops below 100%. Exclusions in `vitest.config.ts`: `_generated/`, `__test_helpers/`, `*.types.ts`, `node_modules/`, trivial render-only Next.js special files, test files themselves. Any new entry in `coverage.exclude` requires justifying comment + PR discussion.
- AR58 (Meaningful tests rule): Top-of-file `Protects:` block in every test file articulates the behavior protected and regression scenario prevented. "Intentional break" check before committing — comment out the production-code line the test claims to protect; if test still passes, rewrite. Test names describe behavior protected, not function shape. Don't mock Convex (use `convex-test`); don't mock the unit under test; don't mock cheap things (date-fns, lib/datetime.ts, type validators); do mock at external boundaries (Stripe SDK, Clerk SDK, Resend in unit tests).
- AR59 (Forbidden test patterns): Tests that mock the unit under test; tests that only assert "function returned a value"; snapshot tests; `expect(true).toBe(true)` placeholders; mutation-then-immediate-read patterns that don't exercise concurrency or invariants; `// TODO: write a real test` comments in committed code; `it.skip` without `// skip-issue: #123` comment; tests written purely to hit coverage threshold without naming what they protect; "Intentional break" check failing.
- AR60 (Playwright fixtures + structure): `apps/[app]/tests/e2e/` with `fixtures/` (auth: `signedInCustomer`, `signedInVendor`, `signedInAdmin`; seed: qa-tier reset before each test; stripe: test card helpers). Customer/vendor/admin test folders. Smoke suite runs on PR CI; full suite runs post-merge against qa. Browser projects: Chromium, Firefox, WebKit, Mobile Safari, Mobile Chrome. axe-core integrated for accessibility regression gating (NFR48).
- AR61 (Pre-commit + PR template): Husky + lint-staged for ESLint on staged files, TypeScript typecheck on changed packages, gitleaks scan for secret leakage, Prettier formatting. PR template prompts: tests added or updated for new behavior; test top-of-file `Protects:` block updated; intentional-break check passed; no new `coverage.exclude` entries (or justified if so); AGENTS.md updated if a new convention emerged.

**ESLint pattern enforcement**

- AR62 (ESLint rules): `no-restricted-imports` blocks direct imports of `useQuery`/`useMutation`/`useAction`/`usePaginatedQuery` from Convex packages outside `lib/convex.ts`; direct `convexTest` import outside `initConvexTest.ts`; `convex/react` hook bypasses. `import/no-namespace` prevents barrel-substitute patterns. Custom rule: no `index.ts`/`index.tsx` outside `_generated/` and Next.js special locations. `@typescript-eslint/no-explicit-any` errors on `any`. `@typescript-eslint/consistent-type-imports` forces `import type` (paired with `verbatimModuleSyntax`). `@typescript-eslint/consistent-type-definitions` enforces `type` over `interface`. `@typescript-eslint/no-restricted-types` forbids `enum`. `import/order` auto-enforces import order. `@typescript-eslint/naming-convention` enforces camelCase variables/functions, PascalCase types/components, no `I` prefix.
- AR63 (`AGENTS.md` per package): Repo-root `AGENTS.md` documents cross-cutting conventions (event-driven backbone, audit log subscriber, rules-engine versioning, transaction-metrics safety, naming rules). Per-package `AGENTS.md` reflects specific conventions. Next.js 16.2 generates `AGENTS.md` per package by default. `npx convex ai-files` adds Convex-specific skills/context. AI agents read these before writing code.

**Release tracking**

- AR64 (Release & audit-trail tracking): Prod deploys via CI invoke `npx convex deploy --message "$GITHUB_SHA: $PR_TITLE"` so release metadata appears in Convex dashboard History tab — audit-trail-adjacent for compliance defense (NFR59–66 context).

**Documentation**

- AR65 (Required docs): `docs/DISASTER_RECOVERY.md` (NFR38 runbook). `docs/DEPLOYMENT_RUNBOOK.md` (standard deploy, rollback, env var rotation, prod backup verification). `docs/ONBOARDING.md` (for future team members; empty at MVP, populated when team scales). `README.md` quickstart linking to docs/, AGENTS.md, canonical architecture doc.

### UX Design Requirements

UX-DR1 (Harvest palette light + dark tokens): Define color tokens in `oklch()` per Tailwind v4's default color space, written to `packages/ui/styles/tokens.css`. Light mode: aubergine + cream + gold (`--background` warm cream, `--foreground` aubergine-tinted ink, `--primary` deep aubergine, `--accent` harvest gold, `--destructive` rust). Dark mode: warm near-black with aubergine undertone (`--background`), warm off-white text, lifted aubergine `--primary`, lifted gold `--accent`. Extension tokens: `--success`, `--warning`, `--text-tertiary`, `--border-strong`. Final values verified in CI via axe-core (NFR48); tuned during implementation if contrast falls below AA.

UX-DR2 (Light + dark mode for all surfaces): Every surface (consumer, vendor, admin) supports both modes via user toggle; surface-specific defaults — consumer light, vendor light, admin dark (Linear pattern). Theme parity at WCAG 2.1 AA contrast in both modes; user toggle never reduces accessibility.

UX-DR3 (Typography system — Fraunces + Geist + Geist Mono): Variable, free, self-hostable. Headline serif: Fraunces (display optical sizing for hero, text optical for sub-headlines). Body sans: Geist (consumer body, vendor portal, admin). Mono: Geist Mono (admin queue IDs, Stripe IDs, JSON previews, audit-log entries). Type scale 10 steps (`text-xs` 12/16 to `text-6xl` 60/64) with custom 1.25 ratio + tweaks at large sizes; line-height tuned per use. Fraunces uses `font-variation-settings: "opsz" 96` at hero, `60` at page-header, `14` at body-serif. Letter-spacing tightened ~`-0.02em` at display sizes. Geist body 400 default; 500 emphasis; 600 UI labels/buttons; 700 table headers (uppercase, letter-spacing 0.05em).

UX-DR4 (Spacing & layout foundation): Tailwind v4 default 4px scale extended. Density variants — Editorial (consumer pages, default `gap-6` to `gap-12`), Functional (cart, checkout, vendor portal, `gap-4` to `gap-8`), Dense (admin queue, tables, `gap-1` to `gap-3`). Grid: mobile 320–767px single-column 16px outer (12px at 320–360px); tablet 768–1023px 12-column 24px outer 16px gutter; desktop 1024px+ 12-column max-width 1280px (1440px for marketing/farm-profile) 32px outer 24px gutter; wide 1440px+ widens to 1440px max for marketing/farm-profile. Radius restrained 2–8px (no pill-buttons, no fully-rounded fintech). Shadow minimal — hairline borders preferred over drop-shadows; subtle elevation only on dropdowns/modals.

UX-DR5 (Motion & reduced-motion): Short deliberate ease-out timings — 120ms hover; 200ms cart-grouping insert, sheet/dialog enter; 300ms page transitions. No bouncy springs. `prefers-reduced-motion` respected globally — 200ms cart-grouping animation reduces to instant insert; skeleton shimmer reduces to subtle opacity fade.

UX-DR6 (320px Galaxy Fold floor): Mobile-first responsive; every layout collapses cleanly at exactly 320px. Test every page at 320px before merge — Galaxy Fold cover screen as the design contract, not aspiration. Breakpoint table: small mobile 320–360px, mobile 361–767px, tablet 768–1023px, desktop 1024–1439px, wide 1440px+. Token-based switching (`--space-*`, `--cols-*`); no custom media queries except for genuinely page-specific layouts.

UX-DR7 (Touch targets & focus rings): Touch targets ≥ 44×44pt (HIG) / 48dp (Material) at every breakpoint. Focus rings: 2px `--ring` outline + 2px offset on every focusable element; visible across light + dark; distinct from hover state. Color is never the only signal — state pills include text labels, errors include text + icon, cert badges include text + icon.

UX-DR8 (WCAG 2.1 AA across the entire product): Consumer-facing AA-mandatory; vendor portal and admin pragmatic-AA (same standards, no separate tier). All text ≥ 4.5:1 contrast (3:1 for ≥18pt large text). Body text minimum 16px on mobile (24px line-height); 14px secondary text only for metadata. axe-core in CI per NFR48.

UX-DR9 (Forms accessibility): Visible labels above inputs (placeholder ≠ label), required marker, helper text below, error message replaces helper text on validation failure. Required fields marked. Errors associated to inputs via `aria-describedby`; first invalid field receives focus on submit failure. Submit button never disables on validation error. Numeric keyboards via `inputmode`; autofill hints throughout. Validation timing: inline on blur for real-time correction (email/phone/zip); submit-time for cross-field rules; server-side for compliance (permit format, FDACS lookup).

UX-DR10 (Keyboard navigation): Every interactive element reachable via tab order. Skip-to-main link on every page. Admin queue keyboard-first: `j/k` next/previous, `↵` open detail, `a` approve, `r` request docs, `x` reject, `Esc` collapse, `⌘K` filter palette; shortcuts visible in UI. Focus trap inside any overlay; `Esc` closes; click outside dismisses unless action in progress. Mouse fallback always works.

UX-DR11 (Screen reader semantics): Cart announces composition changes via `aria-live="polite"` (e.g., "Item added. Cart now has 5 items from 3 farms"). Checkout announces section changes. Substitute suggestions announced as adjacent options. Image alt text mandatory at upload; rules engine prompts vendor with specific guidance. Cert badges alt-described with cert name + meaning + that they link to issuing authority. Semantic HTML throughout (`<nav>`, `<main>`, `<article>`, `<aside>`, `<dl>`, `<table>` with proper headers).

UX-DR12 (Component — MultiFarmCart, Tier 1 critical): Cart sheet (slide-over) and `/cart` page; the wedge interaction's home. Anatomy: cart header (item + farm count) → first-time multi-farm hint → farm groups (each with farm header, fulfillment status pill, line items with quantity stepper + remove + save-for-later) → totals → CTAs. States: empty, single-farm, multi-farm (first-time hint), multi-farm (returning), substitute-suggested-inline, cutoff-passed-on-line, restricted-state-on-line, loading. Variants: sheet (default) and page. Accessibility: semantic landmarks; composition changes announced; focus trap inside sheet; `Esc` closes.

UX-DR13 (Component — FarmFulfillmentSelector, Tier 1 critical): Per-farm fulfillment selection at checkout; the hardest single screen. Anatomy: farm header → status line → option cards (pickup / local delivery / shipping — only what vendor offers) → conditional sub-controls. States: unset, pickup-selected (window required), local-delivery-eligible, local-delivery-zip-mismatch, ship-selected, restricted, error. Accessibility: options as `radiogroup`; pickup-window picker as `listbox` with arrow-key navigation.

UX-DR14 (Component — PickupWindowPicker, Tier 1): Select pickup day from next 14 days. Anatomy: horizontal scroll of day chips (vendor-available days highlighted), selected window time below. States: default, day-selected, no-windows-available, all-days-cutoff-passed. Accessibility: `radiogroup` with arrow keys; day labels include date + day-of-week + window time.

UX-DR15 (Component — ProductCard, Tier 1): Marketplace and farm-profile product surface. Anatomy: photo (4:3) + save heart → farm name (Fraunces) → location + distance → product name → cert badges → price + fulfillment. Variants: `default`, `compact`, `editorial`. States: default, hovered, saved, out-of-stock, restricted-to-customer-location. Accessibility: semantic `<article>`; alt text composed from farm + scene; price as `<data>` element.

UX-DR16 (Component — FarmProfileHeader, Tier 1): The editorial provenance moment. Anatomy: full-bleed hero photo (21:9 desktop / 4:3 mobile) → profile card overlapping the hero with eyebrow + farm name + farmer attribution + cert badges + actions. States: default, saved, vendor-currently-paused. Accessibility: photo alt-described; main heading uses `<h1>`.

UX-DR17 (Component — FarmTrustStats, Tier 1): Trust signal row on farm profiles. Anatomy: 4-cell grid — On Farm2Table since / Permit status / Reorder rate / Cancellation rate. States: default, permit-expiring-soon, permit-expired, low-data (suppress with <30 orders). Accessibility: semantic `<dl>`.

UX-DR18 (Component — CertBadge, Tier 1): Display third-party certification with one-tap link to issuing authority. Anatomy: dot + cert name (text). Clickable. Accessibility: link with `aria-label` describing what the cert means and that it opens the issuing authority.

UX-DR19 (Component — StatePill, Tier 1): Variants — `pending` (gold), `approved` (moss), `rejected` (rust), `paused` (neutral). Color + text label always — color is never the only signal.

UX-DR20 (Component — RulesEngineChecklist, Tier 1 admin): Auto-populated verification checklist for vendor applications. Anatomy: rows of (required document × status × validation result × admin action) with public-registry lookup links and FDACS guidance links inline. States: all-green, missing-docs, wrong-doc-uploaded, format-invalid, manual-review-needed. Accessibility: semantic `<table>` with row headers; status announced per row.

UX-DR21 (Component — AdminTriageQueue, Tier 1 admin): Linear-tier dense queue with keyboard interaction. Anatomy: column headers → row per queue item → inline expand showing checklist + audit trail + templated comm actions. Keyboard: `j/k`, `↵`, `a`, `r`, `x`, `Esc`, `⌘K`. Accessibility: `<table>` with `aria-rowindex`; expanded row uses `aria-expanded`.

UX-DR22 (Component — VendorOnboardingFlow, Tier 1): Multi-step progressive flow with rules-engine-driven contextual disclosure. Anatomy: sticky step counter → step content → footer (Back / Continue). States: step-loading, step-valid, step-invalid, step-async-pending. Accessibility: `aria-current="step"` on active step; flow announces step changes.

UX-DR23 (Component — DocumentUploader, Tier 1): Context-aware document upload with format validation. States: empty, hover-drop-zone, uploading, valid, invalid, upload-error. Accessibility: `<input type="file">` with descriptive label; errors via `aria-describedby`.

UX-DR24 (Component — SubstituteSuggestion, Tier 1): Inline substitute pattern in cart, cancellation emails, product detail. Anatomy: small card with substitute farm photo + name + price + fulfillment + one-tap CTA. Accessibility: semantic `<aside>` near affected line; "Other vendors carrying [product]" as accessible name.

UX-DR25 (Component — WeeklyPlanView, Tier 1): "Your week" timeline used in checkout summary, confirmation, and email. Anatomy: 7-day strip with events highlighted on relevant days. Variants: `compact`, `expanded`, `email-friendly` (table-based fallback). Accessibility: semantic `<table>` with day headers; full text labels.

UX-DR26 (Component — OrderSubReceipt, Tier 1): Per-vendor receipt block in confirmation page, customer email, vendor email. Variants: in-page, email-html. Accessibility: semantic `<article>` with `<header>`.

UX-DR27 (Component — TopNav consumer, Tier 1): Logo + search (prominent center) + nav links (Browse / How it works / Become a vendor) + cart icon (count + farm count badge) + account icon. Mobile: logo + cart + hamburger; full-bleed search opens as sheet. Accessibility: `<nav>` landmark; skip-to-main link; cart count announced.

UX-DR28 (Component — EmptyState, Tier 1): Restrained icon (text glyph in circle) → Fraunces title → short body → primary + secondary CTAs. Always paired with actionable CTA — never a dead end. Per-context copy: empty cart, no saved farms, no favorites, no search results (suggest neighboring zips / category broadening), no notifications ("All caught up."), admin queue empty ("Queue's clear. Nice work."), vendor no orders/products yet.

UX-DR29 (Components — VendorTopNav, AdminTopNav, Tier 2): Top-nav variants per surface. Vendor portal nav: top nav + tabs (Dashboard / Products / Orders / Storefront / Settings); no left sidebar; tab labels shrink to icons at <600px. Admin nav: top nav + theme toggle prominent + queue (default landing) + audit log + settings; dark theme default.

UX-DR30 (Component — VendorDashboardStats + VendorSimpleChart, Tier 2): Stat-card row + CSS-only bar chart (no JS chart lib at MVP — lighter bundle, sufficient for 8-bar use case).

UX-DR31 (Component — TierUpgradeCallout, Tier 2): Quiet tier-upgrade math suggestion (non-forced).

UX-DR32 (Component — NotificationCenter, Tier 2): In-app inbox (always-on per notification model). Tabbed: All / Orders / Vendor / Marketing.

UX-DR33 (Component — PhotoHero, Tier 2): Image component enforcing aspect ratio, alt text, EXIF strip pipeline (NFR27). Aspect ratios enforced: 4:3 (product cards), 4:5 (vendor portraits), 21:9 (farm-profile heroes), 16:9 (marketing heroes).

UX-DR34 (Component — FarmStorefrontEditor, Tier 2): Squarespace-lite live-preview editor for vendor storefront customization at Foundation tier. Pick a layout, drop in a hero photo of the farm, write a short bio, save. Live-preview while editing, not save-and-view.

UX-DR35 (Components — Breadcrumb, FilterRail, SearchBar, Tier 2): Composed surfaces. Breadcrumbs on farm profiles and product detail; not on cart/checkout. Filter rail persistent left rail on desktop (256px); filter drawer (Sheet) on tablet/mobile; filter groups collapsible (Location, Category, Certifications expanded by default); filter state reflected in URL for shareability and back-button correctness; "Clear all filters" CTA. SearchBar Combobox-style suggestions (farms, products, recent searches, search-by-zip); mobile opens full-bleed sheet; empty input shows recent searches + suggested categories; debounced 200ms.

UX-DR36 (Layout — Marketing/landing pages): Editorial single-column, photo-led hero, 3–4 scroll sections, no carousel. SEO category pages parameterized from this template.

UX-DR37 (Layout — Marketplace browse): Editorial 3-column grid (3/2/1 across desktop/tablet/mobile) with persistent left filter rail on desktop, filter drawer on mobile. Editorial card density, not Etsy 6-up.

UX-DR38 (Layout — Farm profile): Magazine-spread layout — full-bleed hero photo, profile card overlapping the hero (the editorial moment), trust-signals stat row, asymmetric story with farmer quote and secondary photo, fulfillment summary, then this farm's products. Hero photo aspect changes 21:9 → 4:3 at <768px; profile card overlap reduces to 40px on mobile.

UX-DR39 (Layout — Product detail): Photo-left + info-right (desktop), stacked (mobile). Filson product-page register.

UX-DR40 (Layout — Cart): Sheet (slide-over from right at desktop, full-screen at 320–768px) for quick edit + dedicated `/cart` page for review. Mobile uses sheet as primary cart UX.

UX-DR41 (Layout — Checkout): Single-page accordion with per-farm fulfillment sections, Stripe-hosted payment, sticky order-summary right rail (desktop) / sticky-bottom CTA (mobile). The "Your week" pickup-and-delivery plan in the summary frames multi-pickup as competence.

UX-DR42 (Layout — Customer account): Minimal tabs — Orders, Saved farms, Favorite products, Settings.

UX-DR43 (Layout — Vendor portal): Top nav + main content (no left sidebar at MVP). Storefront customization is Squarespace-lite live-preview.

UX-DR44 (Layout — Admin queue): Linear-tier dense table with state pills, keyboard-first interaction (`j/k/a/r/x`), inline-expand detail (no modals), command palette (`⌘K`).

UX-DR45 (Layout — Vendor onboarding): Linear progressive flow with rules-engine-driven contextual disclosure. Square's voice ("Florida cottage food, got it.").

UX-DR46 (Cross-cutting layout rules): Top nav (consumer): logo + search + Browse/How it works/Become a vendor + cart icon + account; mobile collapses to logo + cart + hamburger; full-bleed search opens as sheet. No left sidebar consumer-facing. Sticky bottom CTA on key conversion screens (product detail, cart, checkout) at mobile. Toasts: viewport-bottom on mobile, top-right on desktop; auto-dismiss 4s for success; persistent for warnings/errors. Loading: skeleton screens for content; shimmer on photos; no spinners. Empty states: restrained icon + actionable CTA; no Lottie animations, no preachy copy.

UX-DR47 (Button hierarchy): Variants — `primary` (`bg-primary` fill, single most-important action per viewport: Place order, Add to cart, Submit verification, Continue), `accent` (`bg-accent` fill, secondary CTA: "Become a vendor" hero, key conversion second-step), `secondary` (transparent + `border-strong`: Cancel, Back, "Keep shopping"), `ghost` (transparent + `text-accent`: Save for later, Edit, "View tiers"), `destructive` (`bg-destructive` fill: Remove from cart, Delete account, Reject vendor). One primary per viewport. Sizes: `sm` 36px, `default` 44px, `lg` 52px. Touch targets always ≥ 44×44pt. Loading state: inline spinner + label changes to action-tense ("Placing order…"); disabled while pending. Destructive confirmation: inline confirm step before commit, or Alert Dialog for irreversible deletes.

UX-DR48 (Feedback channels): Toast (transient confirmation) — bottom-center mobile, top-right desktop; auto-dismiss 4s success, manual warning/danger. Inline message (form validation, per-field state) — below the input; persists until resolved. Banner (persistent state about a section) — top of affected card or page. Alert Dialog (action requiring explicit confirmation) — centered modal; manual-dismiss only. In-app inbox (all notifications, always-on) — via bell icon; persistent record. Email — transactional always; lifecycle/marketing opt-in. Toast tone established by border-color + icon + text label. Color is never the only signal. No native browser alerts/confirms.

UX-DR49 (Modal & overlay patterns): Sheet (slide-over) is the default — cart, vendor product editor, admin row detail, mobile filters, mobile search; from right at desktop (~480px), full-screen at mobile. Dialog (centered modal) reserved for irreversible confirmations or deeply-focused single tasks; avoid modal-on-modal; prefer inline expand. Popover for menus, contextual actions, quick filters. Tooltip for icon-only buttons, legal/explanatory text; 200ms delay; hidden on touch. Focus trap inside any overlay; `Esc` closes; click outside dismisses unless action in progress.

UX-DR50 (Loading states): Skeleton screens for content surfaces; skeletons match real-content shape so layout doesn't shift. Shimmer on photo placeholders during image load. Inline spinner in buttons during async submission. Top progress bar for page transitions (Next.js navigation). No full-page spinners. `prefers-reduced-motion` disables shimmer (replaced with subtle opacity fade). Skeletons live next to the component they shadow (e.g., `FarmDetailSkeleton.tsx` next to `FarmDetail.tsx`); use shadcn's `<Skeleton />` primitive sized to match real layout. Server Components.

UX-DR51 (Date & time display patterns): Pickup windows always show day-of-week + date + time ("Saturday May 4, 9–11am"). Relative time for queue/audit ("2 hrs ago"), absolute on hover and in detail. Time zones: timestamps in user's local tz; admin sees user's tz with hint. 14-day pickup horizon standard.

UX-DR52 (Money & currency patterns): USD with two decimals always (`$8.50`, `$0.00`, `$1,234.50`). Per-line / per-vendor subtotal / cart total kept distinct. Fees, delivery, shipping, tax always itemized. No mystery line items. Refunds shown explicitly: "Refunded $17.00 (1–3 business days to your card)."

UX-DR53 (Imagery patterns): Real photography always — no stock; no AI-generated food. Vendor uploads through Convex EXIF strip + responsive variant pipeline (NFR27). Aspect ratios enforced by image components. Alt text mandatory at upload; rules engine prompts with specific guidance. Photo treatment uniform — no aggressive filters or preset overlays. Fallback for missing photos: gradient placeholder using palette tokens + farm name in serif.

UX-DR54 (Voice & copy patterns): Honest specificity beats marketing copy. Plain language ("Choose how each farm gets to you" beats "Configure fulfillment preferences"). No cheerleading. Quiet success ("Order confirmed" beats "🎉 Hooray!"). Errors say what happened + what to do ("Your card was declined — try a different card or use Apple Pay" beats "Payment failed"). Vendor voice in vendor-authored content; Farm2Table voice in platform copy (warm, specific, matter-of-fact).

UX-DR55 (Mobile-specific patterns): 320px is the floor. Touch targets ≥ 44×44pt / 48dp. Sticky bottom CTAs on key conversion surfaces. Sheets replace modals for most overlays. Bottom-anchored toasts to avoid thumb-zone conflicts. Swipe gestures avoided at MVP. Form inputs use appropriate `inputmode` and `autocomplete` throughout. Image lazy-loading below the fold; explicit `width`/`height` to avoid CLS. Hover states still defined but never the only affordance.

UX-DR56 (Three-tier notification model): Transactional/operational — Email always sent; In-app always sent; user cannot opt out (consent obtained at signup) — covers order confirmation, vendor cancellation + refund, pickup-ready/shipped/delivered, payment receipts, account/password/security, permit-expiry warnings (vendor), payout (vendor), foodborne-illness notices, admin status changes. Lifecycle/informational — Email opt-in (off by default); In-app always sent; user can opt out — covers "favorite product back in stock," "back in season," cart-abandonment reminders, "new farm in your area," vendor tier-upgrade prompts. Marketing/editorial — Email opt-in (explicit checkbox at signup, defaults to off); In-app optional; CAN-SPAM unsubscribe in every email footer — covers newsletter, founder's notes, seasonal recipes, vendor spotlights. Signup acceptance pattern: implicit acceptance for ToS + Privacy + transactional emails; one explicit opt-in checkbox off by default for lifecycle + marketing starter; granular controls in account settings post-signup.

UX-DR57 (Print stylesheet — `packages/ui/styles/print.css`): Light print stylesheet at MVP for three surfaces — Customer order confirmation (strips chrome and nav; expands per-vendor sub-receipts; includes farm addresses + Google Maps links printed as URLs; weekly-plan rendered as table); Vendor pickup list (vendor's daily fulfillment list printable from vendor portal — order numbers, customer names, items, pickup times); Admin audit trail (auditable printout of any vendor verification or incident timeline). Black-on-white print colors; no background photos in print.

UX-DR58 (iOS Safari mandatory QA pass): Dedicated QA pass on actual iPhone hardware before every release (BrowserStack acceptable when physical device unavailable). Explicit checklist: sticky-header on scroll behavior; sticky-bottom CTA across viewport heights (Safari address bar quirk); sheet animations and focus trap; date inputs in vendor portal (iOS native date picker); photo upload from camera roll + EXIF strip at boundary; Apple Pay flow end-to-end; pull-to-refresh interaction with sticky elements.

UX-DR59 (Visual regression testing): Chromatic (or equivalent) on key surfaces — marketplace browse, farm profile, cart, checkout, admin queue, vendor onboarding — at 320 / 768 / 1024 / 1440 in light + dark mode.

UX-DR60 (Lighthouse CI): Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) per NFR1 enforced in CI.

UX-DR61 (Manual screen reader pass per release): VoiceOver (Mac + iOS) on key consumer flows (browse → product → cart → checkout); NVDA on Windows for vendor onboarding + admin queue. Keyboard-only pass through the wedge interaction (browse → multi-farm cart → checkout) on every release.

UX-DR62 (Pre-launch + annual third-party accessibility audit): Pre-launch third-party accessibility audit before commercial Sarasota launch (Feb 13, 2027) — vendor TBD, ~$2–3K budget item. Annual accessibility re-audit thereafter (per NFR47/NFR50). User testing with users with disabilities before Sarasota launch — small panel, paid participants.

UX-DR63 (Component implementation strategy): Tokens before components. Composition before custom — new component justified only when composing primitives can't reach. One file, one component, one purpose; in `packages/ui/components/<ComponentName>/` with brief header comment documenting purpose, variants, and accessibility decisions for downstream AI agents. Variant restriction — each component declares a small enumerated variant set; new variants require intent. Accessibility built-in — every component ships WCAG 2.1 AA-passing focus, contrast, and keyboard support by default. Email components isolated in `packages/email-templates/` using table-based markup with inlined styles (React Email at MVP). Server vs client components — default to RSC for content surfaces; promote to client only where interactivity demands. Responsive by token, not component — spacing density and column counts switch at token-defined breakpoints; components don't carry breakpoint logic.

UX-DR64 (Form patterns): Field structure — label above input (placeholder ≠ label), required marker, helper text below, error message replaces helper text on validation failure. Error presentation — field gets red border + error icon + error message via `aria-describedby`; first invalid field receives focus on submit failure; submit button never disables on error. Async actions — submit button shows pending state; entire form disabled during submission; visible progress for long ops (Stripe KYC, doc upload). Success — route forward (don't show "Success!" then make user click). Multi-step flows — sticky step counter; per-step Continue/Back; flow-level cancel returns to safe entry with prompt if data would be lost.

UX-DR65 (Storybook deferred to Growth): MVP documents component intent in the file header + usage examples in the page where the component is first used.

### FR Coverage Map

Each FR's *primary* epic is listed. FRs marked **cross-cutting** are exercised across multiple epics — the *infrastructure* lands in the primary epic, and each downstream epic adds its own emissions/subscribers/audit entries on top.

**Epic 1 — Foundation, Public Site, Auth & Legal**

- FR41: Epic 1 — Customer account creation with email verification + ToS acceptance
- FR61: Epic 1 (infrastructure) — Immutable audit log + subscriber pattern via `ctx.meta.getFunctionMetadata()`. **Cross-cutting:** every later epic writes audit entries (Epic 2 vendor verification, Epic 5 refunds, Epic 7 customer privacy requests, Epic 8 enforcement actions, etc.)
- FR63: Epic 1 (infrastructure) — Transactional email pipeline (Convex action → Next.js API → Resend SDK + React Email). **Cross-cutting:** each later epic adds its email subscribers (Epic 2 vendor application emails, Epic 5 order confirmations, Epic 6 cancellation + substitute notices, Epic 8 expiry/incident notices)
- FR66: Epic 1 (infrastructure) — Domain event backbone with `domainEvents` table + emit helper. **Cross-cutting:** every later epic emits domain events on state changes

**Epic 2 — Vendor Onboarding & Verification**

- FR16: Epic 2 — Vendor application form (state + categories)
- FR17: Epic 2 — Rules-engine-surfaced required documents per (state, category, products)
- FR18: Epic 2 — Document upload
- FR19: Epic 2 — Compliance attestation
- FR20: Epic 2 — Stripe Connect hosted onboarding (KYC + bank verification)
- FR21: Epic 2 — Vendor agreement signing
- FR22: Epic 2 — Restricted state×category combos blocked
- FR23: Epic 2 — FL cottage food in-state shipping default
- FR32: Epic 2 — Foundation tier subscription (default at vendor signup completion)
- FR50: Epic 2 — Admin vendor application queue with rules-engine checklist
- FR51: Epic 2 — Admin approve / request-more / reject with state-specific templated comms
- FR65: Epic 2 (Connect events) — `account.updated` webhook handling for Stripe Connect onboarding completion. **Cross-cutting:** dispatcher established here, payment-event handling extends in Epic 5

**Epic 3 — Vendor Storefront & Operations**

- FR24: Epic 3 — Product listing CRUD with variants, weight pricing, photos (alt text + EXIF strip), traceability fields, labeling fields
- FR25: Epic 3 — Farm profile editor
- FR26: Epic 3 — Per-vendor fulfillment configuration (pickup windows, local-delivery zip+fee, shipping by state+product+fee)
- FR27: Epic 3 — Inventory management (qty, low-stock, sold-out, restock)
- FR30: Epic 3 — Vendor sales dashboard (GMV, marketplace-sourced vs. vendor-shared-link, tier-upgrade math)
- FR31: Epic 3 — Vendor-shareable storefront link (single-player mode)

**Epic 4 — Marketplace Discovery & Provenance**

- FR1: Epic 4 — Anonymous marketplace browse with filters
- FR2: Epic 4 — Farm profile page rendering
- FR3: Epic 4 — Product detail page rendering
- FR4: Epic 4 — Geo-targeted SEO landing pages (`/local/[city]/[product]`)
- FR5: Epic 4 — Filterable cert badges with issuing-body verification links
- FR6: Epic 4 — Structured data (Schema.org JSON-LD) on indexable surfaces
- FR7: Epic 4 — Saved farms list

**Epic 5 — Multi-Vendor Cart & Checkout**

- FR8: Epic 5 — Multi-vendor cart with per-vendor grouping
- FR9: Epic 5 — Per-vendor fulfillment selection at checkout
- FR10: Epic 5 — Single payment splitting via Stripe Connect
- FR11: Epic 5 — Per-line tax via Stripe Tax (origin × destination × PTC)
- FR12: Epic 5 — Marketplace facilitator registration + threshold monitoring
- FR13: Epic 5 — Per-vendor sub-receipts
- FR14: Epic 5 — Per-line refunds reversing splits without affecting other vendors
- FR15: Epic 5 — 7-day post-delivery vendor payouts
- FR65: Epic 5 (payment events) — Stripe webhook idempotency dispatcher; payment.succeeded / payment.failed / refund.processed / payout.completed / dispute / Connect updates flow into the same event-emission system

**Epic 6 — Order Lifecycle, Fulfillment & Substitute Discovery**

- FR28: Epic 6 — Vendor order management (accept, mark in-prep, mark ready/shipped/delivered, cancel, refund)
- FR29: Epic 6 — Vendor-customer order communication
- FR35: Epic 6 — Customer order tracking with per-vendor fulfillment status
- FR36: Epic 6 — Vendor line cancellation with automatic per-line refund (other vendors unaffected)
- FR37: Epic 6 — Customer hold requests (subject to vendor acceptance)
- FR38: Epic 6 — Substitute surfacing on vendor cancellation (category match at MVP)
- FR39: Epic 6 — Per-vendor cancellation cutoffs displayed on listings
- FR64: Epic 6 — Customer-vendor in-app inbox

**Epic 7 — Customer Account, Trust & Privacy**

- FR42: Epic 7 — Customer account view (orders, saved farms, payment methods, profile)
- FR43: Epic 7 — Data export within 24h, portable format (NFR22)
- FR44: Epic 7 — Account deletion with 30-day PII purge + audit-relevant pseudonymization (NFR23)
- FR45: Epic 7 — CCPA/CPRA rights including functional Do-Not-Sell-or-Share opt-out (page shell rendered in Epic 1)
- FR46: Epic 7 — Customer reports of vendor misrepresentation
- FR47: Epic 7 — Customer foodborne-illness reports with structured intake + FDACS opt-in
- FR48: Epic 7 — Customer reports of vendor cancellation patterns / service quality
- FR49: Epic 7 — "Tell us where to launch next" interest signal capture

**Epic 8 — Admin Enforcement, Incident Response & Compliance Operations**

- FR54: Epic 8 — Admin customer-report queue with admin-vendor messaging tools (queue infrastructure shared with Epic 2's vendor application queue)
- FR55: Epic 8 — Admin warn / suspend / restore / remove vendor enforcement actions
- FR56: Epic 8 — Foodborne-illness auto-pause + incident-notice email (subscribes to Epic 7's `incident.foodborneIllnessReported`)
- FR57: Epic 8 — FDACS coordination + investigation timeline recorded in audit log
- FR58: Epic 8 — Vendor cancellation-rate tracking with admin-configurable thresholds (warn >10% / review >20% over rolling 30-day window, ≥10-order minimum sample)
- FR59: Epic 8 — Permit and certification expiry alerts at 90/60/30 days + auto-pause on expiry
- FR62: Epic 8 — Admin discretionary refund + credit issuance

**Out-of-MVP — future Growth and Vision epics (not designed in this document)**

- FR32a [Growth] — Growth tier ($59/mo, 18% commission) and Pro tier ($149/mo, 12% commission) subscription
- FR33 [Growth] — Add-on capabilities (Email Promotions, Advanced Analytics, CSA Manager, Route Planner, Accounting Sync)
- FR34 [Growth] — Featured-listing promotion
- FR40 [Growth] — Deeper substitute matching (taxonomy depth, practice/cert compatibility)
- FR52 [Growth] — AI-assisted document extraction with confidence-scored fast-lane routing
- FR53 [Growth] — State public-registry adapter cross-check
- FR60 [Growth] — Annual vendor re-attestation workflow
- FR67 [Growth] — In-app real-time push for order/message/expiry/admin notifications
- FR68 [Growth] — Live vendor dashboard updates without manual refresh
- FR69 [Growth] — Live admin queue updates without manual refresh
- FR70 [Growth] — Live inventory counts on product pages + live order tracking
- FR71 [Vision] — Web push notifications (PWA-prerequisite)
- FR72 [Vision] — Checkout inventory holds with optimistic locking

## Epic List

### Epic 1: Foundation, Public Site, Auth & Legal

A first-time visitor lands on the site, reads what Farm2Table is and how it works (`/how-it-works`, `/for-farmers`, `/about`, `/faq`), reads ToS / privacy / vendor-agreement / do-not-sell, and can create a customer account with email verification and ToS acceptance. The Do-Not-Sell-or-Share link is in every page footer per NFR24. The site has a maintenance status banner (NFR58) for ≥48-hour maintenance comms. The platform's foundation infrastructure — auth wrappers, schema scaffold, Clerk → Convex sync, the domain-event backbone (FR66), the audit-log subscriber pattern (NFR59–61), the email pipeline (Convex action → Next.js → Resend SDK + React Email), the Harvest design tokens, the site shell components, the monitoring stack (Sentry + BetterStack + Convex dashboard + Vercel logs) — is operational, so every later epic plugs into a stable foundation. Story #1 = project initialization (AR1) per the architecture's stated handoff.

**FRs covered:** FR41, FR61 (infrastructure), FR63 (infrastructure), FR66 (infrastructure)
**Cross-cutting infrastructure that downstream epics consume:** AR1–AR4 (init + monorepo), AR5 (Convex), AR8 (validation), AR12–AR16 (auth + multi-tenancy), AR20–AR23 (event backbone), AR24 (audit log subscriber), AR40–AR43 (email pipeline), AR47–AR51 (deployment + monitoring + DR), AR52–AR55 (TS + naming + date/time), AR56–AR63 (testing + ESLint + AGENTS.md), UX-DR1–UX-DR11 (tokens + typography + accessibility foundations), UX-DR27 (TopNav consumer), UX-DR28 (EmptyState), UX-DR36 (marketing layout), UX-DR47–UX-DR50 (button hierarchy + feedback + modals + loading), UX-DR54 (voice & copy)

### Epic 2: Vendor Onboarding & Verification

A vendor can apply by selecting their state and one or more categories; the rules engine immediately surfaces the exact set of required documents, attestations, and shipping-eligibility rules for their (state, category, products) combination; they upload documents, sign the compliance attestation, complete Stripe Connect's hosted KYC + bank verification, and sign the vendor agreement. Restricted state×category combinations (raw dairy in FL, alcohol, CBD/cannabis, restaurants/prepared meals, wholesale-to-business at MVP) are blocked at onboarding; FL cottage food vendors default to in-state-only shipping. The admin can triage applications in a queue with the rules-engine-generated checklist showing present / missing / wrong-doc-uploaded status per item, format validation on permit numbers and expiry dates, and one-action public-registry lookup links. The admin approves, requests additional documents, or rejects — each action sends a templated email with state-specific context auto-inserted. The Foundation tier (free, 22% commission) is the only tier at MVP; Stripe Connect `account.updated` webhooks are handled to track onboarding completion.

**FRs covered:** FR16–FR23, FR32, FR50, FR51, FR65 (Connect-account events)

### Epic 3: Vendor Storefront & Operations

A verified vendor can create, edit, publish, unpublish, and remove product listings — each with variants, weight-based pricing, photos (with required alt text and EXIF stripped at upload per NFR27), descriptions, traceability fields (lot number, batch, harvest/pack date), and labeling fields (ingredients, allergens, applicable disclaimers). They can edit their farm profile (name, address, declared practices, story, photos, certification claims, contact preferences), configure fulfillment per product or product set (farm pickup with day-of-week/time-window availability, vendor-run local delivery by zip with vendor-set fee, vendor-run shipping by destination state with vendor-set fee and packaging method), manage inventory (current quantity, low-stock alerts, sold-out state, restock), and view a sales dashboard showing GMV, orders, marketplace-sourced vs. vendor-shared-link orders, and tier-upgrade math. They can share a storefront link that displays only their own products for use in their own customer outreach (Instagram bio, email lists, market booth signage), independently of the marketplace — enabling single-player mode before marketplace demand materializes.

**FRs covered:** FR24–FR27, FR30, FR31

### Epic 4: Marketplace Discovery & Provenance

A customer can browse the marketplace anonymously by product category, farm name, location, certification, and farming practice; view a farm profile that displays the farm's name, address, declared practices, verified third-party certifications, and current products; view a product detail page showing the product's vendor, price, available variants, fulfillment options, traceability fields, and applicable certifications; navigate geo-targeted SEO landing pages keyed by (product, city) that surface local farms offering that product; see third-party certifications (USDA Organic, Animal Welfare Approved, Certified Naturally Grown, and others) as filterable badges with verification linking back to the issuing body; and save farms to a personal saved-farms list (sign-in flow uses Epic 1's account creation). Marketplace home, search results, category pages, farm profiles, product detail pages, and geo landing pages render server-side with full Schema.org JSON-LD structured data so they index in search results.

**FRs covered:** FR1–FR7

### Epic 5: Multi-Vendor Cart & Checkout (the wedge)

A customer can add items from multiple vendors to a single cart and see each line item attributed to its vendor with the vendor's available fulfillment options. At checkout, they select fulfillment method per vendor (pickup at farm with day-of-week/time-window picker, vendor-run local delivery if their zip is in the vendor's coverage, vendor-run shipping if the vendor ships and the destination is allowed by state and product type). They complete a single payment that splits across all vendors via Stripe Connect, with the platform deducting per-vendor commission and platform service fee. Stripe Tax calculates per-line-item tax based on origin × destination × product tax category (default at category, override at subcategory for Beverages and Nuts & Snacks), applying state grocery exemptions and prepared-food taxability rules; the platform registers as marketplace facilitator with each state's revenue department once that state's threshold is approached. The customer receives one consolidated confirmation email with per-vendor sub-receipts inline; each vendor receives a per-vendor confirmation for their items only. Per-line-item refunds reverse the original payment split (vendor portion + platform portion) without affecting other vendors' line items. Vendors receive payouts seven days after delivery confirmation. Stripe webhooks (payment success/failure, refund processed, payout completed, dispute, Connect account update) ingest into the platform's idempotent webhook dispatcher and propagate into the domain-event system established in Epic 1.

**FRs covered:** FR8–FR15, FR65 (payment events)

### Epic 6: Order Lifecycle, Fulfillment & Substitute Discovery

A customer can view an order's overall status and each vendor's per-line-item fulfillment status (preparing → ready → in transit → delivered) with pickup/shipping details. They can request that a vendor hold their order for a later pickup or delivery date, subject to vendor acceptance. When a vendor cancels a line item, the platform automatically refunds that line, leaves the order's other vendors unaffected, and surfaces alternative Farm2Table vendors offering the same product category with one-action reorder — both in the customer's cancellation email and in the in-app notification. Per-vendor cancellation cutoffs (typically 24–48 hours before fulfillment) display on listings so customers know when changes can still be made without vendor permission. The vendor side: vendors view and act on incoming orders — accept, mark in preparation, mark ready or shipped, mark delivered, cancel, refund — and communicate with customers about active orders (hold, reschedule, or cancellation requests) through an in-app inbox visible to both sides.

**FRs covered:** FR28, FR29, FR35–FR39, FR64

### Epic 7: Customer Account, Trust & Privacy

A customer can view their order history, saved farms, payment methods, and account profile; export all personal data within 24 hours of request in JSON or CSV (NFR22); delete their account, triggering 30-day PII purge with audit-relevant references pseudonymized rather than deleted to preserve regulatory defense (NFR23); and exercise CCPA/CPRA rights — including the functional Do-Not-Sell-or-Share-My-Personal-Information opt-out (page shell rendered in Epic 1, opt-out behavior wired here) and access/deletion requests with confirmation. They can submit four kinds of structured reports: vendor misrepresentation (false provenance, miscategorized listings); foodborne illness (with order reference, products consumed, symptom onset and description, household members affected, FDACS-contact opt-in); vendor cancellation patterns or service quality; and "tell us where to launch next" interest signals (location + product interests). Reports route into the admin queue established in Epic 8.

**FRs covered:** FR42–FR49

### Epic 8: Admin Enforcement, Incident Response & Compliance Operations

An admin can view a customer-report queue with structured intake data and admin-vendor messaging tools (built on the same queue infrastructure as the Epic 2 vendor-application queue), and take enforcement actions: issue warnings to vendors, suspend vendor listings, restore suspended listings, and remove vendors from the platform. When a customer files a foodborne-illness report (Epic 7 → Epic 8 via the `incident.foodborneIllnessReported` domain event), the platform automatically pauses the vendor's listings as a precaution and sends an incident-notice email to the vendor; the admin coordinates FDACS reporting with the affected customer and vendor and records the investigation timeline in the immutable audit log. Vendor cancellation rates are tracked against admin-configurable thresholds (warn at >10% over rolling 30-day window with ≥10-order minimum sample; auto-trigger admin review at >20%). Permit and certification expiry alerts go out at 90, 60, and 30 days before expiry; listings auto-pause on expiry if not renewed. Admins can issue discretionary refunds and credits to customers, with every action recorded in the audit log queryable for state AG investigations, FDACS inquiries, and litigation discovery (NFR59–66). A business-metrics dashboard surfaces GMV, daily/weekly orders, vendor onboarding velocity, admin queue depth, marketplace-sourced order ratio, customer reorder rate, cart abandonment when ≥2 pickup locations, and vendor cancellation rates.

**FRs covered:** FR54, FR55–FR59, FR62

## Cross-cutting story conventions

These rules apply to every story across every epic and are documented in repo-root `AGENTS.md`:

1. **Public route allowlisting (`proxy.ts` `publicRoutes`).** Clerk auth-gates every route by default in Next.js 16. Any story that adds a public page (anonymous-accessible) or a public API route (called by external services like Stripe/Clerk/Resend webhooks, or by Convex actions via shared secret) must update the relevant app's `app/proxy.ts` `publicRoutes` allowlist. Public routes inherit no Clerk session; auth checks (if any) happen explicitly inside the route. Auth-gated routes (vendor portal, admin, customer account) are *not* in `publicRoutes`.
2. **Per-story schema discipline.** Stories add only the tables/fields they need. No "Story 1 creates all 50 tables" anti-pattern. Schema changes are backwards-compatible by default; backwards-incompatible changes follow AR9's dual-write + backfill + cutover rehearsed in QA tier.
3. **Top-of-file `Protects:` block in every test file.** Articulates the behavior protected and the regression scenario prevented (per AR58).
4. **Audit log entries** are written via the AR24 subscriber pattern; no per-mutation audit boilerplate.
5. **Domain events** emitted on every state change per AR20–AR23; subscribers attach via `domainEvents` watch without modifying publishers.

## Epic 1: Foundation, Public Site, Auth & Legal

A first-time visitor lands on the site, reads what Farm2Table is and how it works, reads the legal pages, and can create a customer account with email verification and ToS acceptance. The Do-Not-Sell-or-Share link is in every page footer per NFR24, the maintenance status banner (NFR58) is in place, and the platform's foundation infrastructure — auth wrappers, schema scaffold, Clerk → Convex sync, the domain-event backbone (FR66), the audit-log subscriber pattern (NFR59–61), the email pipeline, the Harvest design tokens, the site shell, and the monitoring stack — is operational so every later epic plugs into a stable foundation.

### Story 1.1: Project initialization & monorepo scaffold

As **the founding developer (Jen)**,
I want **the project initialized from the Convex official Turborepo template, restructured to the three-app + six-package layout with yarn berry, Playwright, Base UI shadcn, AGENTS.md scaffolds, and dev/qa/prod Convex deployments provisioned**,
so that **every subsequent story plugs into the canonical project structure documented in the architecture without re-litigating layout decisions**.

**Acceptance Criteria:**

**Given** an empty repository
**When** the developer runs `npx create-convex@latest -t get-convex/turbo-expo-nextjs-clerk-convex-monorepo`
**Then** the template scaffolds successfully
**And** `apps/native/` (Expo) is removed along with all Expo-related root scripts, deps, and turbo pipeline entries
**And** `apps/web/` is restructured into three Next.js apps: `apps/marketplace/`, `apps/vendor/`, `apps/admin/`, each with their own `package.json`, `next.config.ts`, `tsconfig.json`, `playwright.config.ts`, `vitest.config.ts`, `eslint.config.js`, `.env.example`, `AGENTS.md`, and an empty `app/proxy.ts` skeleton.

**Given** the three apps exist
**When** the developer creates the six packages
**Then** `packages/backend/`, `packages/ui/`, `packages/rules-engine/`, `packages/web-shared/`, `packages/seed-data/`, `packages/eslint-config/`, and `packages/email-templates/` exist with their own `package.json`, `tsconfig.json`, `eslint.config.js`, and `AGENTS.md`
**And** package `exports` fields define subpath imports (no `index.ts` barrels)
**And** ESLint `import/no-restricted-paths` rules enforce the one-way dependency graph from AR3.

**Given** the monorepo structure exists
**When** the developer runs `yarn set version berry` and configures `.yarnrc.yml` with `nodeLinker: node-modules`
**Then** `yarn install` succeeds with no PnP errors and a traditional `node_modules/` layout.

**Given** yarn berry is configured
**When** the developer runs `npx shadcn@latest init` in `packages/ui/`
**Then** the prompt offers Base UI vs. Radix and the developer selects **Base UI**
**And** subsequent `npx shadcn@latest add` commands resolve Base UI primitives.

**Given** Playwright is installed (not Cypress) in each app
**When** `playwright.config.ts` is configured with browser projects Chromium, Firefox, WebKit, Mobile Safari, Mobile Chrome
**Then** `yarn playwright test` runs against all five projects and reports green for the empty test set.

**Given** the developer is authenticated to Convex Cloud
**When** they run the deployment provisioning commands
**Then** three Convex deployments exist: dev (local), qa (long-lived `--type prod` named `qa`), and prod
**And** `npx convex env default set` populates Stripe-test, Clerk-test, and Resend-sandbox keys for new dev/preview deployments.

**Given** Vercel is configured
**When** the developer creates the three Vercel projects (marketplace, vendor, admin)
**Then** each is connected to the GitHub repo with build commands targeting the correct app, preview deployments enabled, and env vars populated per AR49.

**Given** Clerk is configured
**When** the developer creates dev and qa Clerk instances with Organizations enabled
**Then** the JWT issuer URL is set in the corresponding Convex `auth.config.ts` and the JWT validates end-to-end.

**Given** all the above
**When** the developer runs `npx convex ai-files`
**Then** Convex-specific AI-agent context is added to the workspace
**And** repo-root `AGENTS.md` and per-package `AGENTS.md` scaffolds exist documenting the cross-cutting conventions from the Cross-cutting Story Conventions section above.

**Given** initialization is complete
**When** the developer runs `yarn dev` from the repo root
**Then** Turbo orchestrates Next.js dev servers for all three apps + Convex dev sync in parallel
**And** each app responds with a placeholder page on its dev port without errors.

### Story 1.2: Convex backend foundation (auth wrappers + error helper)

As **a backend developer**,
I want **the Convex schema bootstrapped, Clerk JWT validation wired, the `ConvexProviderWithClerk` bridge in place, and the canonical custom auth wrappers (`publicQuery`, `customerQuery`, `vendorQuery`, `vendorOwnerMutation`, `adminQuery`, `internalMutation`) plus the `appError` helper available**,
so that **every Convex function written in later stories has zero per-function auth boilerplate and uses the same structured error model**.

**Acceptance Criteria:**

**Given** the project is initialized
**When** the developer creates `packages/backend/convex/schema.ts`
**Then** `schema.ts` is the single source of truth for tables and exports a `defineSchema` instance
**And** generated types in `_generated/` flow into Next.js apps via `@workspace/backend` workspace alias.

**Given** Clerk dev/qa instances exist
**When** the developer creates `packages/backend/convex/auth.config.ts`
**Then** the Clerk JWT issuer URL is configured
**And** `useConvexAuth()` (not Clerk's `useAuth()`) returns the correct authenticated state in a Client Component test.

**Given** auth is wired
**When** the developer creates `packages/backend/convex/helpers/auth.ts` using `convex-helpers/server` `customQuery`/`customMutation`
**Then** wrappers `publicQuery`, `publicMutation`, `customerQuery`, `customerMutation`, `vendorQuery`, `vendorMutation`, `vendorOwnerMutation`, `adminQuery`, `adminMutation`, `internalMutation` exist
**And** each wrapper populates `ctx.user` and `ctx.org` from the Clerk session
**And** `vendorMutation` rejects with `appError("auth.forbidden", ...)` if the caller is not in an active vendor org
**And** `adminMutation` rejects unless the caller is a member of the platform-admin Clerk Organization
**And** `vendorOwnerMutation` rejects unless the caller's role in their org is `owner`.

**Given** the auth wrappers exist
**When** the developer creates `packages/backend/convex/helpers/errors.ts`
**Then** `appError(code, userMessage, data?)` throws a `ConvexError` carrying the structured `AppErrorCode` discriminated-union code
**And** `AppErrorCode` enumerates the initial set: `auth.unauthenticated`, `auth.forbidden`, `validation.invalid`, `internal.unexpected`
**And** unexpected errors caught by the wrapper layer log function name (via `ctx.meta.getFunctionMetadata()`), user/org identity, args, and an auto-generated correlation ID to Sentry, then re-throw as `appError("internal.unexpected", "Something went wrong. Reference: <correlationId>")`.

**Given** the wrappers and error helper exist
**When** unit tests run via `convex-test`
**Then** tests cover: anonymous caller hitting `customerQuery` is rejected with `auth.unauthenticated`; non-vendor user hitting `vendorMutation` is rejected with `auth.forbidden`; non-owner vendor member hitting `vendorOwnerMutation` is rejected with `auth.forbidden`; admin org member hitting `adminMutation` succeeds; correlation ID is attached on `internal.unexpected`.

**Given** ConvexProviderWithClerk is in place
**When** a Server Component uses `preloadQuery` and a Client Component uses the wrapped `useQuery` from `@workspace/web-shared/convex.ts`
**Then** SSR data hydrates without flicker
**And** the wrapped `useQuery` returns `{ status, data, error }` (not bare `data | undefined`).

### Story 1.3: Domain event backbone & audit log subscriber

As **a platform developer**,
I want **the `domainEvents` table, type-safe `emitEvent` helper, and audit-log subscriber pattern in place**,
so that **every state change in later stories emits a typed domain event and writes to the immutable audit log without per-mutation boilerplate, satisfying NFR59–NFR61**.

**Acceptance Criteria:**

**Given** the schema scaffold exists
**When** the developer adds `domainEvents` and `auditLog` tables per AR20 and AR24
**Then** `domainEvents` carries `eventId` (ULID), `eventType`, `occurredAt`, `emittedAt`, `actorId`, `actorType` (∈ user|vendor|admin|system|stripe|clerk), `correlationId`, `payload`
**And** indexes exist on `eventId`, `(eventType, emittedAt)`, `actorId`, `correlationId`
**And** `auditLog` is append-only with no application or DB code path that can edit, delete, or backdate (NFR59).

**Given** the tables exist
**When** the developer creates `packages/backend/convex/_types/domainEvents.types.ts`
**Then** `DomainEventPayloadMap` is a discriminated union mapping each `eventType` to its payload type
**And** `convex/helpers/events.ts` exports `emitEvent` that type-checks emission against the map at the call site.

**Given** `emitEvent` exists
**When** a mutation calls `emitEvent("system.test.fired", { foo: "bar" })`
**Then** a row is written to `domainEvents` with the correct envelope
**And** the audit-log subscriber (using `ctx.meta.getFunctionMetadata()`) automatically writes a corresponding `auditLog` entry with actor, timestamp, function name, args.

**Given** the subscriber pattern is in place
**When** unit tests run
**Then** tests cover: emit-site type errors when payload shape doesn't match the map; subscriber writes audit entry without explicit code in the publishing function; emitting a `vendor.suspended` event from `adminMutation` produces an audit entry attributed to the admin user.

**Given** NFR60 retention
**When** the developer attempts to delete an `auditLog` row programmatically
**Then** the operation fails with `appError("audit.immutable", ...)` enforced at the wrapper layer.

### Story 1.4: Email pipeline & email-templates package

As **a platform developer**,
I want **the email pipeline (Convex action → Next.js `/api/emails/send` → Resend SDK) and the `packages/email-templates` React Email package operational, with retry and delivery tracking**,
so that **every later epic adds email subscribers without rebuilding the pipeline, and Resend's idempotency + retry guarantees are honored**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer creates `packages/email-templates/` with React Email components and a `react-email.config.js`
**Then** `cd packages/email-templates && npx react-email dev` opens a browser preview server
**And** at least one starter template (`AccountVerification.tsx`) renders to HTML via `@react-email/render`.

**Given** the templates package exists
**When** the developer creates `apps/marketplace/app/api/emails/send/route.ts` (Node runtime)
**Then** the route verifies the `X-Internal-Auth: ${INTERNAL_API_SECRET}` header and rejects unauthenticated requests
**And** the route accepts `{ template, to, data }`, renders the React Email template, calls `resend.emails.send()` with an `Idempotency-Key` header set to the request's `Idempotency-Key`
**And** the route is added to the marketplace app's `proxy.ts` `publicRoutes` allowlist (external-callable; auth via shared secret).

**Given** the send route exists
**When** the developer creates `convex/emails/sendEmail.ts` (Convex action, V8 isolate)
**Then** the action `fetch`-POSTs to `/api/emails/send` with composite idempotency key `${eventId}-${emailType}`
**And** on 5xx response, schedules retry via `scheduler.runAfter` with exponential backoff
**And** the `pendingEmails` table tracks attempts (max 5 default); failures beyond max are surfaced to the admin queue.

**Given** the send pipeline works
**When** the developer creates `apps/marketplace/app/api/resend/webhook/route.ts`
**Then** the route verifies the Resend webhook signature
**And** writes delivery events to `emailDeliveryEvents` Convex table via `convex.mutation()`
**And** is added to `proxy.ts` `publicRoutes` (external Resend callback).

**Given** end-to-end pipeline operational
**When** integration tests run (against Resend sandbox / `delivered@resend.dev`)
**Then** tests cover: a `customer.accountCreated` event triggers an `AccountVerification` email; the same event replayed produces no duplicate send (Resend idempotency); a 429 response from Resend reschedules per `Retry-After`; a 5xx response triggers exponential-backoff retry; final failure surfaces to admin queue.

**Given** env vars are set
**When** the developer rotates `INTERNAL_API_SECRET` per the runbook
**Then** the rotation procedure updates both Convex env and Vercel env in lockstep without dropping in-flight requests.

### Story 1.5: Clerk → Convex user/org sync

As **a platform developer**,
I want **the Clerk webhook receiver wired to idempotent Convex internal mutations that mirror user and org lifecycle into Convex tables**,
so that **Convex always knows the current Clerk user/org state for auth decisions and so that downstream domain events fire when accounts are created or modified**.

**Acceptance Criteria:**

**Given** the email pipeline exists
**When** the developer adds `users`, `organizations`, and `clerkWebhookEvents` tables to the schema
**Then** the tables exist with appropriate indexes
**And** `clerkWebhookEvents` enforces idempotency by `clerkEventId` (analogous to AR19 Stripe pattern).

**Given** the schema additions exist
**When** the developer creates `apps/marketplace/app/api/clerk/webhook/route.ts`
**Then** the route verifies the Clerk webhook signature
**And** is added to `proxy.ts` `publicRoutes` allowlist (external Clerk callback)
**And** dispatches by event type to Convex internal mutations: `clerkSync.userCreated`, `clerkSync.userUpdated`, `clerkSync.userDeleted`, `clerkSync.orgCreated`, `clerkSync.orgUpdated`, `clerkSync.orgDeleted`, `clerkSync.orgMembershipCreated`, `clerkSync.orgMembershipUpdated`, `clerkSync.orgMembershipDeleted`.

**Given** the dispatcher exists
**When** a Clerk webhook arrives
**Then** atomic idempotency check on `clerkEventId` prevents double-processing
**And** the corresponding Convex row is written
**And** a domain event is emitted (e.g., `customer.accountCreated`, `vendor.orgCreated`, `vendor.teamMemberAdded`).

**Given** integration tests run
**When** a synthetic Clerk webhook payload is replayed twice
**Then** only one Convex row is written; only one domain event is emitted
**And** the audit log records the webhook receipt with the `clerk` actor type.

**Given** a Clerk org is created
**When** the org metadata declares Foundation tier and slug
**Then** the corresponding `organizations` row carries `vendorId`, `tier: "foundation"`, `slug`, `status: "pending_verification"`.

### Story 1.6: Harvest design tokens + typography + motion

As **a UX/UI engineer**,
I want **the Harvest light + dark `oklch()` color tokens, Fraunces + Geist + Geist Mono self-hosted typography, type scale, spacing scale, radius/shadow/motion tokens, and `prefers-reduced-motion` handling defined in `packages/ui/styles/tokens.css`**,
so that **every component built in later stories consumes tokens (not one-off styles) and ships WCAG 2.1 AA contrast in both modes**.

**Acceptance Criteria:**

**Given** the `@workspace/ui` package exists
**When** the developer creates `packages/ui/styles/tokens.css`
**Then** all light-mode and dark-mode tokens from UX-DR1 are defined (`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--muted`, `--muted-foreground`, `--text-tertiary`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--success`, `--warning`, `--border`, `--border-strong`, `--input`, `--ring`)
**And** state-pill tokens (`--state-pending`, `--state-approved`, `--state-rejected`, `--state-paused`) are defined for both modes.

**Given** the tokens exist
**When** axe-core runs in CI against a sample page using the tokens
**Then** `--foreground` on `--background`, `--primary` on `--background`, and `--muted-foreground` on `--background` all pass WCAG 2.1 AA contrast in both light and dark modes
**And** `--accent` on `--background` passes for large text (3:1) and is restricted in component code to large text or `--primary` button backgrounds.

**Given** the typography system
**When** the developer self-hosts Fraunces (variable), Geist (variable), Geist Mono in `packages/ui/styles/fonts/`
**Then** font files load from same-origin (no Google Fonts CDN)
**And** Fraunces uses `font-variation-settings: "opsz" 96` at hero sizes, `60` at page-header, `14` at body-serif uses
**And** the type scale tokens (`text-xs` 12/16 through `text-6xl` 60/64) match UX-DR3 exactly.

**Given** the spacing/layout/motion tokens
**When** the developer defines spacing density variants (editorial, functional, dense), radius (2–8px range, no pill-buttons), shadow (minimal, hairline borders), motion (120ms hover, 200ms cart-grouping/sheet, 300ms page transition)
**Then** `prefers-reduced-motion` reduces motion to instant insert / opacity fade
**And** a Vitest test verifies `prefers-reduced-motion` query selector takes effect.

**Given** the tokens are operational
**When** the developer toggles theme via the user-controlled toggle on a sample page
**Then** all surfaces re-render in the new mode without flash-of-unstyled-content
**And** the user's preference persists in `localStorage`.

### Story 1.7: Foundation UI primitives (shadcn brand pass)

As **a frontend developer**,
I want **the foundational shadcn primitives brand-passed for Farm2Table (Button with the five variants, Input, Card, Dialog, Sheet, Toast, Skeleton, Combobox, Select, Form), plus custom EmptyState, StatePill, CertBadge, and PhotoHero in `packages/ui/components/`**,
so that **every later story composes from these primitives and never hand-rolls a button or a state pill**.

**Acceptance Criteria:**

**Given** Base UI shadcn is initialized
**When** the developer runs `npx shadcn@latest add` for `button`, `input`, `card`, `dialog`, `sheet`, `toast`, `skeleton`, `combobox`, `select`, `form`
**Then** each component is brand-passed: re-tokenized to consume Harvest tokens, restricted to declared variants, and has a file-header comment documenting purpose, variants, and accessibility decisions
**And** Button supports variants `primary`, `accent`, `secondary`, `ghost`, `destructive` and sizes `sm` (36px), `default` (44px), `lg` (52px) per UX-DR47.

**Given** the primitives exist
**When** the developer creates `EmptyState`, `StatePill`, `CertBadge`, `PhotoHero` per UX-DR19, UX-DR18, UX-DR28, UX-DR33
**Then** `EmptyState` always pairs with an actionable CTA (no dead end)
**And** `StatePill` has variants `pending`/`approved`/`rejected`/`paused` with text label always present (color is never the only signal)
**And** `CertBadge` is clickable with `aria-label` describing the cert + that it links to the issuing authority
**And** `PhotoHero` enforces aspect ratios (4:3, 4:5, 21:9, 16:9) via the `aspectRatio` prop and accepts `alt` as a required prop.

**Given** the components have brand-pass header comments
**When** axe-core runs against a sample harness rendering each primitive
**Then** focus rings (2px `--ring` outline + 2px offset) are visible on every focusable element in both light and dark modes
**And** touch targets are ≥ 44×44pt at the `default` size.

**Given** the components are exported from `@workspace/ui` with `exports` field subpaths
**When** an app imports `Button` from `@workspace/ui/Button`
**Then** the import resolves; tree-shaking includes only Button code; ESLint blocks `import * as UI from '@workspace/ui'` namespace patterns.

**Given** Vitest tests run
**When** component tests query by role (Testing Library priority)
**Then** keyboard interaction works on Button (Enter/Space activates), Combobox (arrow keys navigate, Enter selects), Dialog/Sheet (Esc closes, focus trapped)
**And** the wrapped `useQuery` tri-state pattern (UX-DR50) is exercised by a `<DataView>` test using a mocked Convex query.

### Story 1.8: Site shell components

As **a frontend developer**,
I want **the `SiteHeader`, `SiteFooter` (with prominent Do-Not-Sell link per NFR24), `MobileNav`, `StatusBanner` (NFR58 maintenance, feature-flag-controlled), and skip-to-main link components built and wired into the marketplace app's root layout**,
so that **every public marketplace page renders within the consistent site shell from the very first marketing page in Story 1.10**.

**Acceptance Criteria:**

**Given** the foundation primitives exist
**When** the developer creates `apps/marketplace/components/SiteHeader.tsx`, `SiteFooter.tsx`, `MobileNav.tsx`, `StatusBanner.tsx`
**Then** `SiteHeader` shows logo + search (prominent center) + nav links (Browse / How it works / Become a vendor) + cart icon (with count + farm count badge slot — wired in Epic 5) + account icon
**And** mobile collapses to logo + cart + hamburger; full-bleed search opens as a Sheet
**And** `<nav>` landmark is present; skip-to-main link is the first focusable element on every page.

**Given** the footer
**When** `SiteFooter` renders
**Then** the **"Do Not Sell or Share My Personal Information"** link is prominent and present on every page (NFR24), routing to `/do-not-sell`
**And** footer also links to ToS, privacy, vendor-agreement, About, FAQ, How it works, For farmers
**And** the theme toggle is present and persists user choice.

**Given** `StatusBanner` exists
**When** an admin (in Epic 8) toggles the maintenance feature flag
**Then** the banner renders site-wide with the maintenance message
**And** Vitest tests cover: banner visible when flag on, hidden when flag off, dismissable per-session.

**Given** `apps/marketplace/app/proxy.ts` exists
**When** the developer wires up the `proxy.ts` `publicRoutes` allowlist
**Then** the **base public routes** are added: `/`, `/sign-in`, `/sign-up`, `/sign-in/[[...catchall]]`, `/sign-up/[[...catchall]]`, `/api/clerk/webhook`, `/api/stripe/webhook`, `/api/resend/webhook`, `/api/emails/send`
**And** the layout wraps every route with the site shell.

**Given** Playwright E2E
**When** a smoke test loads `/` (which is empty until Story 1.10) on Chromium, Firefox, WebKit, Mobile Safari, Mobile Chrome
**Then** the site shell renders without errors at viewports 320, 768, 1024, 1440
**And** the skip-to-main link, footer Do-Not-Sell link, and theme toggle are all keyboard-reachable and screen-reader-announced.

### Story 1.9: Customer signup & email verification (FR41)

As **a curious visitor**,
I want **to create a customer account by entering my email and a password (or using a magic link or Google/Apple OAuth), accepting Farm2Table's Terms of Service and Privacy Policy, and verifying my email**,
so that **I can save farms, place orders, and access account features in later epics**.

**Acceptance Criteria:**

**Given** Clerk dev/qa instances have email+password and magic link enabled
**When** the developer creates `apps/marketplace/app/(auth)/sign-up/page.tsx` and `sign-in/page.tsx` using Clerk's hosted components
**Then** signup collects email and password, requires email verification before first order (NFR14), enforces ≥12 chars + breach-list check (OWASP minimum)
**And** a single bundled "By creating an account you accept the Terms of Service and Privacy Policy" link/checkbox is required (per UX-DR56 implicit acceptance pattern)
**And** an explicit opt-in checkbox (off by default) reads "Send me occasional emails about new farms, seasonal availability, and Farm2Table news" — granular controls live in account settings (Epic 7).

**Given** signup completes
**When** the Clerk webhook fires (Story 1.5)
**Then** a `users` row is created in Convex
**And** `emailMarketingOptIn` field on the user reflects the checkbox state
**And** a `customer.accountCreated` domain event is emitted
**And** the email pipeline sends an `AccountVerification` email via the canonical flow.

**Given** account creation
**When** the new customer clicks the verification link
**Then** Clerk marks the email verified
**And** the user can now place orders (gating wired in Epic 5).

**Given** the auth pages
**When** `proxy.ts` `publicRoutes` is updated
**Then** `/sign-in`, `/sign-up`, and Clerk callback routes are public; all other customer routes (`/account`, `/orders`, `/saved-farms`) are auth-gated.

**Given** rate limiting (NFR17)
**When** an attacker hits sign-in 11 times in 60 seconds with bad credentials
**Then** Clerk's built-in auth-endpoint rate limiting blocks further attempts and surfaces a clear error
**And** Convex application code is unaffected (Clerk handles auth-endpoint rate limiting per AR14).

**Given** Playwright E2E
**When** the customer signup flow runs end-to-end on all five browser projects
**Then** signup → verification email arrival (Resend sandbox) → verification click → signed-in state completes successfully
**And** axe-core finds no a11y regressions on the auth pages.

### Story 1.10: Marketing pages (home + how-it-works + for-farmers + about + faq)

As **a curious visitor**,
I want **to land on the Farm2Table home page and read clear, editorial-tone explanations of how the marketplace works, what's in it for farmers, and frequently asked questions**,
so that **I understand whether Farm2Table is for me before I sign up or browse**.

**Acceptance Criteria:**

**Given** the site shell exists
**When** the developer creates `apps/marketplace/app/(marketing)/page.tsx`, `how-it-works/page.tsx`, `for-farmers/page.tsx`, `about/page.tsx`, `faq/page.tsx`
**Then** each is a Server Component cached with `use cache` (long TTL) and tagged with `revalidateTag('marketing')`
**And** each renders within the site shell from Story 1.8 with editorial Filson register per UX-DR36 (photo-led, single-column, 3–4 scroll sections, no carousel, generous whitespace).

**Given** the pages exist
**When** the developer adds them to `proxy.ts` `publicRoutes`
**Then** `/`, `/how-it-works`, `/for-farmers`, `/about`, `/faq` are all anonymous-accessible.

**Given** content is in place
**When** a visitor views the home page on a mid-tier mobile device (3G Fast)
**Then** Lighthouse CI reports LCP < 2.5s, INP < 200ms, CLS < 0.1 (NFR1)
**And** the page is server-rendered with `<title>` and meta description set per page
**And** Schema.org `Organization` JSON-LD is present on `/`.

**Given** the pages are responsive
**When** Playwright Chromatic visual regression tests run at 320, 768, 1024, 1440 in light + dark mode
**Then** each page renders cleanly at the 320px Galaxy Fold floor
**And** axe-core passes WCAG 2.1 AA on every breakpoint.

**Given** voice & copy guidelines (UX-DR54)
**When** the content review checklist runs
**Then** copy is honest specificity (no "fresh local goodness from your community"), plain language (no jargon), no cheerleading, no AI-generated florid food imagery
**And** photography uses real environmental shots or palette-token gradient placeholders (never stock).

### Story 1.11: Legal page rendering (ToS, privacy, vendor-agreement, do-not-sell)

As **a visitor or vendor**,
I want **to read the Terms of Service, Privacy Policy, Vendor Agreement, and Do-Not-Sell-or-Share information**,
so that **I can understand my legal relationship with Farm2Table before agreeing to it (or, in Epic 7, exercising my CCPA/CPRA rights)**.

**Acceptance Criteria:**

**Given** the marketplace app exists
**When** the developer creates `apps/marketplace/app/(legal)/terms/page.tsx`, `privacy/page.tsx`, `vendor-agreement/page.tsx`, `do-not-sell/page.tsx`
**Then** each renders the corresponding markdown content from a `legal/` content directory
**And** each page is added to `proxy.ts` `publicRoutes`
**And** SSG-rendered with `use cache` and `revalidateTag('legal')` on edits.

**Given** legal content is unfinished at MVP build time
**When** the developer wraps the page render in an `attorney-review-complete` feature flag
**Then** with the flag off, each page renders a clear placeholder: "This document is being finalized by counsel. Live copy will appear here before public launch."
**And** with the flag on, the actual legal markdown renders (legal review required before flipping)
**And** the cross-link from signup (Story 1.9) and from vendor onboarding (Epic 2) gates on this flag.

**Given** the do-not-sell page specifically
**When** rendered at this stage
**Then** it shows informational copy explaining the right and notes that the functional opt-out toggle activates once an account exists (full opt-out wired in Epic 7)
**And** the footer link from every page (Story 1.8 NFR24) routes here without a 404 from launch day onwards.

**Given** Playwright E2E
**When** smoke tests load each legal page in placeholder and live modes
**Then** both states render correctly across viewports
**And** axe-core passes (semantic `<main>`, headings, link contrast).

### Story 1.12: Monitoring & observability stack

As **the founder operating the platform**,
I want **Sentry capturing errors with correlation IDs (browser + server, source maps from CI, PII filtering, Replay enabled but disabled on admin/compliance-doc surfaces), BetterStack uptime monitors covering critical surfaces, structured logs with correlation IDs in Convex and Vercel, and a public status page operational**,
so that **I'm alerted on regressions, can debug with a correlation ID a user gives me, and meet NFR51–53, NFR57, NFR58 from launch day**.

**Acceptance Criteria:**

**Given** Vercel apps and Convex deployments exist
**When** the developer creates Sentry projects per env (browser + server, prod / qa / dev)
**Then** `@sentry/nextjs` is initialized in each app (`apps/*/sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`)
**And** Sentry is initialized in Convex backend via the appropriate runtime guard
**And** `INTERNAL_API_SECRET` is filtered from event payloads; user PII is filtered on send (NFR21–29)
**And** source maps upload from CI on each prod deploy.

**Given** Sentry is wired
**When** an `appError("internal.unexpected", "...")` fires
**Then** the correlation ID generated in Story 1.2 is attached to the Sentry event
**And** the user is shown "Reference: <correlationId>" with no internal details (NFR57).

**Given** Sentry Replay is enabled in prod
**When** a user navigates to an admin queue route or a vendor compliance-doc view
**Then** Replay is disabled for those routes (sensitive surfaces).

**Given** BetterStack is configured (free tier 10 monitors)
**When** the developer creates monitors for: marketplace homepage, marketplace browse (Epic 4 placeholder), Stripe webhook intake, vendor portal route, admin portal route, Convex deployment health
**Then** each monitor checks every 3 minutes from multiple regions
**And** alerts route to email/SMS on failure
**And** the BetterStack public status page is published at `status.farm2table.app` and doubles as the maintenance comms channel (NFR58).

**Given** structured logging
**When** any Convex function or Next.js route logs an event
**Then** the log line includes a request correlation ID
**And** Convex dashboard logs and Vercel Pro logs together provide ≥30 days retention (NFR51 MVP target).

**Given** the maintenance flow (NFR58)
**When** the admin enables the maintenance feature flag
**Then** `StatusBanner` (Story 1.8) shows the maintenance message in-app
**And** ≥48-hour notice goes out via Resend email (using the email pipeline from Story 1.4) before scheduled maintenance.

### Story 1.13: CI/CD pipelines (PR validation, qa deploy, prod promotion)

As **the founder**,
I want **three GitHub Actions workflows — PR validation, main→qa deploy with full Playwright suite, and qa→prod manual promotion with `PROMOTE` confirmation — running with caching, secret management, and Sentry release tagging**,
so that **every change is validated before merge, every merge updates qa, and prod releases are deliberate, auditable, and rollback-ready**.

**Acceptance Criteria:**

**Given** the repo is on GitHub with Actions enabled
**When** the developer creates `.github/workflows/pr.yml`
**Then** on every PR the workflow runs: lint, typecheck, Convex schema validation (`npx convex dev --once --typecheck`), `convex-test` unit tests with 100% coverage gate, build check for all three apps, Playwright smoke (`--project=chromium`) against Vercel preview + qa Convex, gitleaks scan for committed secrets
**And** PR fails if any step fails or coverage drops below 100%.

**Given** main→qa workflow
**When** the developer creates `.github/workflows/deploy-qa.yml`
**Then** on merge to `main` the workflow runs `npx convex deploy --target qa --message "$GITHUB_SHA: $COMMIT_SUBJECT"`, Vercel auto-deploys main → qa Vercel projects, full Playwright suite runs against qa across all five browser projects (chromium / firefox / webkit / mobile-safari / mobile-chrome), Sentry release is tagged for qa
**And** failures in the full suite alert via the Sentry/BetterStack channel without auto-rolling-back qa.

**Given** qa→prod workflow
**When** the developer creates `.github/workflows/deploy-prod.yml` with `workflow_dispatch` requiring `"PROMOTE"` typed confirmation
**Then** the workflow asserts the latest qa E2E run is green, runs `npx convex deploy --target prod --message "$GITHUB_SHA: $PR_TITLE"` (per AR64), Vercel promotes the corresponding deployment, Sentry release is tagged for prod, smoke tests run against prod
**And** on smoke-test failure the workflow surfaces the rollback runbook link and pages on-call.

**Given** caching
**When** any workflow runs
**Then** yarn cache, Turbo remote cache (Vercel-built free tier), Playwright browser binaries, and Next.js `.next/cache` are cached per-PR
**And** pipeline runtime is reasonable (PR validation under 10 minutes for incremental changes).

**Given** secrets
**When** workflows reference Convex deploy keys, Vercel token, Sentry auth token
**Then** they're stored in GitHub Secrets only (NFR18 — never committed to source)
**And** gitleaks pre-commit hook (Story 1.15) catches accidental commits locally.

### Story 1.14: Testing infrastructure & quality gates

As **a developer (or AI agent) writing code on this project**,
I want **`convex-test` + the shared `initConvexTest` helper, Vitest + Testing Library, Playwright fixtures (auth, seed, stripe), axe-core integration, the 100% coverage gate with documented exclusions, the top-of-file `Protects:` block convention, the intentional-break check, and the forbidden-test-patterns rule operational**,
so that **tests are meaningful (not coverage-chasing) and AI-agent-authored code can't merge without exercising real behavior**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer creates `packages/backend/convex/__test_helpers/initConvexTest.ts`
**Then** the helper registers `@convex-dev/rate-limiter` (and any other installed Convex components) and exports a single `initConvexTest()` entry point
**And** ESLint blocks `import { convexTest } from "convex-test"` everywhere except `initConvexTest.ts`.

**Given** Vitest is configured per app and per package
**When** the coverage gate runs
**Then** `--coverage.thresholds.global=100` enforces 100% for statements, branches, functions, lines
**And** documented exclusions exist for `_generated/`, `__test_helpers/`, `*.types.ts`, `node_modules/`, trivial render-only Next.js special files, test files themselves
**And** any new entry in `coverage.exclude` requires a justifying comment in `vitest.config.ts` (CI rule + PR template prompt).

**Given** Playwright is configured
**When** the developer creates `apps/marketplace/tests/e2e/fixtures/auth.ts`, `seed.ts`, `stripe.ts`
**Then** fixtures `signedInCustomer`, `signedInVendor`, `signedInAdmin`, qa-tier seed reset (using `packages/seed-data` from a later story when present), and Stripe test card helpers are usable as Playwright parameters
**And** equivalent fixtures exist for `apps/vendor` and `apps/admin`.

**Given** axe-core integration
**When** Playwright tests run with `axe-playwright`
**Then** every page-level test asserts no axe violations
**And** violations fail the test with a clear report (NFR48).

**Given** the `Protects:` convention
**When** any new test file is committed without a top-of-file `/** Protects: ... */` block
**Then** ESLint custom rule fails the commit with a message pointing to AR58.

**Given** the intentional-break check
**When** the PR template asks the author "Did you confirm the intentional-break check passed for any new tests?"
**Then** the PR cannot be merged without that checkbox confirmed
**And** Vitest configuration documents the procedure in a comment.

**Given** forbidden test patterns
**When** ESLint runs on a test file containing `expect(true).toBe(true)`, `// TODO: write a real test`, `it.skip` without `// skip-issue: #N`, or a snapshot test
**Then** ESLint fails with a clear message linking AR59.

### Story 1.15: ESLint enforcement, AGENTS.md & convex ai-files

As **a developer (or AI agent) writing code**,
I want **the shared `@workspace/eslint-config` enforcing barrel-file ban, hook import block, naming-convention, type-over-interface, no-enum, import order, and the canonical AGENTS.md documents (repo-root + per-package) plus `npx convex ai-files` integrated**,
so that **canonical patterns are the path of least resistance for AI agents and conventions can't drift across PRs**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer creates `packages/eslint-config/` with `base.js`, `nextjs.js`, `convex.js` exports
**Then** `base.js` enforces: `no-restricted-imports` for barrel/hook bypasses; `import/no-namespace`; custom rule blocking `index.ts`/`index.tsx` outside `_generated/` and Next.js special locations; `@typescript-eslint/no-explicit-any`; `@typescript-eslint/consistent-type-imports`; `@typescript-eslint/consistent-type-definitions` (forces `type`); `@typescript-eslint/no-restricted-types` forbidding `enum`; `import/order`; `@typescript-eslint/naming-convention` (camelCase variables/functions, PascalCase types/components, no `I` prefix on types)
**And** `nextjs.js` extends base with Next.js plugin + RHF plugin
**And** `convex.js` extends base + blocks direct `convex/react` hook imports outside `@workspace/web-shared/convex.ts`.

**Given** each app and package has an `eslint.config.js`
**When** ESLint runs
**Then** every package extends the appropriate shared config
**And** `yarn lint` from the repo root runs ESLint across the entire monorepo via Turbo.

**Given** the `AGENTS.md` files
**When** the developer writes repo-root `AGENTS.md`
**Then** it documents the cross-cutting conventions from this document's "Cross-cutting Story Conventions" section: public-route allowlisting, per-story schema discipline, top-of-file `Protects:` block, audit log subscriber pattern, domain event emission. Plus: no barrels; canonical Convex hook imports from `@workspace/web-shared/convex.ts`; `appError` for known errors; client-island leaf-most rule; tag taxonomy for Cache Components; meaningful-tests + intentional-break check
**And** each package has its own `AGENTS.md` reflecting package-specific conventions.

**Given** `npx convex ai-files` is run
**When** the developer commits the resulting Convex AI-agent context
**Then** Convex-specific skills (schema patterns, query/mutation conventions, Convex idioms) are available to Claude/Cursor without bloating the default agent prompt.

**Given** Next.js 16.2 generates `AGENTS.md` per package by default
**When** the developer reconciles the autogen with the manual conventions
**Then** there's no contradiction between Next.js's autogen content and Farm2Table-specific rules; the manual conventions take precedence.

### Story 1.16: Disaster recovery & deployment runbooks

As **the founder operating the platform**,
I want **`docs/DISASTER_RECOVERY.md` covering the six DR scenarios and `docs/DEPLOYMENT_RUNBOOK.md` covering standard deploy, rollback, env var rotation, and prod backup verification**,
so that **NFR38 is satisfied from day one, the annual DR drill has a script to follow, and `INTERNAL_API_SECRET` annual rotation has a documented procedure**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer creates `docs/DISASTER_RECOVERY.md`
**Then** the runbook covers each of the six scenarios with concrete step-by-step recovery commands and decision points: Convex regional outage; data loss within Convex PITR window; catastrophic data loss beyond PITR (recovery from weekly S3 export); Vercel outage; Clerk outage; Stripe outage
**And** it documents NFR32 RTO ≤2h and NFR33 RPO ≤15min SLAs and how each is met
**And** it specifies the annual DR drill cadence (NFR38) with the QA-tier rehearsal procedure: export prod → import to QA → smoke-test.

**Given** weekly S3 backups
**When** the developer creates a scheduled cron in `convex/crons.ts` to run `npx convex export --target prod` and ship the export to AWS S3 (or Cloudflare R2) with 90-day retention
**Then** the cron runs weekly and writes a success/failure event to `domainEvents` for monitoring
**And** the runbook includes verification steps to confirm the latest export is non-corrupt.

**Given** soft-delete pattern (AR11)
**When** the runbook documents logical-error recovery
**Then** it explains that vendors `status: active|suspended|removed`, compliance docs `status: pending|verified|rejected|superseded`, products `status: draft|published|archived` are recoverable via state transitions; only customer account PII purge per NFR23 is hard-deletion
**And** the runbook includes audit-log query examples for compliance defense.

**Given** `docs/DEPLOYMENT_RUNBOOK.md` exists
**When** the developer documents standard procedures
**Then** the runbook covers: standard deploy (CI-driven; `npx convex deploy --message "$GITHUB_SHA: $PR_TITLE"` per AR64); rollback (Vercel revert + Convex deploy of previous git SHA; document any schema-incompatibility caveat); env var rotation including `INTERNAL_API_SECRET` annual rotation in lockstep across Convex env + Vercel env; prod backup verification weekly checklist
**And** the runbook is referenced from `README.md` quickstart.

**Given** the docs exist
**When** the team scales beyond solo (future)
**Then** `docs/ONBOARDING.md` is in place (empty at MVP, populated when team scales) per AR65 — this is acknowledged in the runbook's "future enhancements" section.

## Epic 2: Vendor Onboarding & Verification

A vendor can apply by selecting their state and categories; the rules engine immediately surfaces the exact required documents, format validations, and shipping-eligibility rules; they upload documents, sign a state-specific compliance attestation, complete Stripe Connect's hosted KYC + bank verification, and sign the vendor agreement. Restricted state×category combinations are blocked at onboarding; FL cottage food vendors default to in-state-only shipping. The admin triages applications in a Linear-tier dense queue with the rules-engine checklist showing present / missing / wrong-doc-uploaded per item, format-validation results, one-action public-registry lookup links, and keyboard-first interaction (`j/k/↵/a/r/x/⌘K`). Approve / request-more-info / reject actions each fire templated emails with state-specific context auto-inserted.

### Story 2.1: Rules engine v1 (FL + early-expansion states)

As **the platform**,
I want **a versioned, data-driven rules engine that maps `(state, category, products) → { requiredDocs, formatValidations, registryLookupLinks, restrictedCombos, conservativeDefaults }`**,
so that **vendor onboarding (Stories 2.3–2.6) and admin verification (Stories 2.7–2.10) read from the same authoritative source, adding a new state is a data update with no architectural change (NFR42), and every approval traces back to the rules-engine version that produced it (NFR66)**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer creates `packages/rules-engine/` with `rules.ts`, `match.ts`, `rules.types.ts`, `states/`, `registries/` (empty at MVP per AR29), and `__tests__/`
**Then** the package exports `lookup(state, category, products)` returning a `RulesResult` with `requiredDocs[]`, `formatValidations[]`, `registryLookupLinks[]`, `restrictedCombos[]`, `conservativeDefaults`, and a `rulesVersion` string (semver or content hash)
**And** `packages/rules-engine` has its own `vitest.config.ts` with 100% coverage gate.

**Given** state data files
**When** the developer creates `states/FL.ts`, `NC.ts`, `TX.ts`, `GA.ts`, `PA.ts`, `TN.ts`, `ND.ts`
**Then** each state file enumerates per-category requirements drawn from the PRD's Domain-Specific Requirements section, including:
- **FL** (MVP launch): cottage food (FL DBPR registration, business license/DBA, attestation acknowledging labeling + revenue-cap rules); commercial food (FDACS form CF-1 with `FD-XXXXX` permit-number format, commercial kitchen license where required, business license, food-handler cert); egg producer (**FDACS Limited Poultry/Egg Farm Operation permit required regardless of flock size — no small-flock exemption** in FL law); apiary (state apiary registration + business license + cottage food OR commercial permit for sales); raw dairy (**blocked** — pet-only by FL law)
- **NC, TX, GA, PA, TN, ND**: per-state cottage food, farm, beekeeper, egg-producer requirements as documented in the PRD's "2025 state expansions" and "Vendor licensing" sections
**And** each rule cites its primary source (statute / FDACS bulletin / USDA guidance) in a comment for audit defense.

**Given** restricted combos
**When** `lookup` is called with a restricted (state, category, products) tuple
**Then** the result includes `restrictedCombos` entries with explicit reasons:
- raw dairy in FL → "Pet-only sale per FL law; not permitted on Farm2Table for human consumption"
- alcohol → "Out of scope at MVP"
- CBD/cannabis/regulated supplements → "Not on the platform"
- restaurants / prepared meals for immediate consumption → "Out of scope"
- wholesale-to-business → "Not at MVP"
**And** restricted-combo blocking will be enforced in Story 2.3 at the onboarding wizard's category-selection step (FR22).

**Given** conservative defaults (FR23)
**When** `lookup(state="FL", category="cottage_food")` is called
**Then** `conservativeDefaults` includes `interstateShipping: false` with reason "FL cottage food interstate shipping is ambiguous under current law; defaults to in-state only until FDACS confirms broader scope"
**And** the vendor onboarding flow (Story 2.4) respects this default at fulfillment configuration time (Epic 3 reads it for shipping-eligibility enforcement).

**Given** versioning
**When** the rules data changes
**Then** `rulesVersion` changes (semver bump for additive changes, content hash for any change)
**And** vendor approvals (Story 2.8) record the `rulesVersion` they were approved against, satisfying NFR66 audit replay.

**Given** Vitest tests with the meaningful-tests `Protects:` block
**Then** tests cover: `lookup("FL", "egg_producer", [])` returns the FL Limited Poultry/Egg permit requirement (no exemption); `lookup("FL", "raw_dairy", [...])` returns a restricted-combo result with the pet-only reason; `lookup("FL", "cottage_food", [...]).conservativeDefaults.interstateShipping === false`; format-validation regex correctly accepts `FD-12345` and rejects `FD12345` (no hyphen) for FDACS commercial permits; lookup is deterministic for the same inputs across `rulesVersion`.

### Story 2.2: Vendor signup & Clerk Org creation with Foundation tier default

As **a prospective vendor**,
I want **to sign up for a Farm2Table vendor account, which creates a Clerk Organization for my farm with me as owner and Foundation tier locked in by default**,
so that **I can begin the onboarding wizard immediately, my farm is the multi-tenant unit my future team members will join, and my Clerk Org metadata carries everything Convex needs to enforce per-vendor data isolation**.

**Acceptance Criteria:**

**Given** the vendor app exists at `vendors.farm2table.app` with Clerk dev/qa instances configured
**When** the developer creates `apps/vendor/app/(auth)/sign-up/page.tsx` and `sign-in/page.tsx` using Clerk's hosted components with Organizations enabled
**Then** vendor signup collects email + password (or magic link / Google / Apple OAuth) with mandatory email verification (NFR13)
**And** the signup completes by routing to a one-step "Name your farm" form (placeholder org name; editable in Story 2.3 step 1 or later in farm profile editor in Epic 3).

**Given** vendor signup
**When** the Clerk Org is auto-created
**Then** org metadata is set: `tier: "foundation"` (FR32 — default at signup), `slug` (URL-safe derived from farm name; collision-suffix added if taken), `status: "onboarding"`, `vendorId` (Convex `_id` populated by the sync mutation in Story 1.5)
**And** the signing-up user is the org `owner` (Clerk role)
**And** the corresponding `organizations` row in Convex carries the same metadata (synced via Story 1.5's webhook).

**Given** the Clerk Org is created
**When** Story 1.5's webhook handler fires
**Then** a `vendor.orgCreated` domain event is emitted
**And** an audit log entry records the org creation with `system` actor type
**And** the Foundation tier subscription record is created (no payment; `subscriptions` table row with `tier: "foundation"`, `commissionRate: 0.22`, `productLimit: 5`, `variantsPerProduct: 2`, `teamMemberLimit: 5`).

**Given** the vendor portal app
**When** the developer wires `proxy.ts` `publicRoutes`
**Then** `/sign-in`, `/sign-up`, Clerk callback routes, and `/api/clerk/webhook` (the marketplace app already owns this; vendor app does not host webhooks) are public
**And** all other vendor routes are auth-gated to vendor-org membership (the gating wrapper rejects users with no active vendor org).

**Given** Playwright E2E
**When** the vendor signup flow runs end-to-end
**Then** the flow creates a Clerk user → creates a Clerk Org → triggers the webhook sync → arrives at the onboarding wizard entry point (Story 2.3) within 60 seconds on a typical mid-tier mobile device
**And** axe-core finds no a11y regressions on the signup pages.

**Given** rate limiting (NFR17)
**When** an attacker hits `/sign-up` repeatedly
**Then** Clerk's auth-endpoint rate limiting blocks further attempts (per AR14 — Clerk handles this layer; no Convex code needed).

### Story 2.3: Onboarding wizard shell + Step 1 (state + category selection)

As **a newly-signed-up vendor**,
I want **a guided multi-step wizard that opens with state + category selection, persists my progress per step so I can resume if I close the tab, and immediately previews "here's what you'll need to upload" based on my selections**,
so that **I see the regulatory load up front, can decide whether to continue or abandon early, and trust that the platform knows my situation**.

**Acceptance Criteria:**

**Given** the vendor app and rules engine exist
**When** the developer creates `apps/vendor/app/(onboarding)/` with `layout.tsx`, `category/page.tsx` (Step 1), and the `VendorOnboardingFlow` component in `packages/ui/components/VendorOnboardingFlow/`
**Then** the wizard shell shows: sticky step counter ("Step 1 of 4"), step content area, footer with Back / Continue, per-step `aria-current="step"`, step-change announcement to assistive tech (UX-DR22)
**And** wizard state persists to a `vendorApplications` row (created on first Continue) with `currentStep`, `state`, `categories`, `products` fields
**And** vendor can close the tab and resume from the most recent step on next sign-in.

**Given** Step 1 is rendered
**When** the vendor selects a state from a dropdown of US states + DC and one or more categories from `farm`, `cottage_food`, `commercial_food`, `beekeeper`, `egg_producer`, `meat_producer`, `dairy_producer` (FR16)
**Then** the wizard calls `rulesEngine.lookup(state, categories, products)` (products optional at this step)
**And** an inline preview renders: "Because you selected Cottage Food in Florida, you'll need: 1) FL Department of Business and Professional Regulation cottage food registration, 2) business license / DBA, 3) compliance attestation acknowledging FL labeling and revenue-cap rules" (Square voice, UX-DR45)
**And** if the lookup returns `restrictedCombos`, the offending combination is blocked inline with the rules-engine reason (FR22) and the Continue button is disabled until the vendor resolves the conflict.

**Given** restricted combos
**When** an FL vendor selects "raw dairy" as a category
**Then** the inline message reads: "Raw milk for human consumption isn't permitted in Florida — only pet sales. Farm2Table doesn't list raw dairy in FL. Choose a different category to continue, or contact us if you think this is a mistake."
**And** `restrictedCombos` events are NOT logged as application-blocking errors (NFR57); they're shown as guidance.

**Given** the form validates
**When** the vendor clicks Continue
**Then** the wizard writes `state`, `categories`, and the captured `rulesVersion` to the `vendorApplications` row
**And** advances to Step 2 (Story 2.4)
**And** `rulesVersion` will travel with the application through approval (Story 2.8) for audit-replay defense (NFR66).

**Given** Playwright E2E with the meaningful-tests `Protects:` block
**When** the test runs the flow on Mobile Safari at 320px
**Then** the wizard renders correctly, the state dropdown is keyboard-accessible, restricted-combo blocking works inline, and the Continue button enables only when at least one valid category is selected
**And** axe-core passes WCAG 2.1 AA on the wizard.

**Given** the wizard re-renders on resume
**When** the vendor closes the tab mid-Step-1 and re-opens it
**Then** the previously-selected state and categories restore from the persisted `vendorApplications` row
**And** the rules-engine preview re-renders without the vendor having to re-pick.

### Story 2.4: Step 2 — document upload + image pipeline + compliance attestation

As **a vendor on Step 2 of onboarding**,
I want **to see exactly the documents I need to upload (drawn from the rules engine for my state + categories), upload them with format validation feedback as I go, sign a state-specific compliance attestation, and have my docs stored encrypted with admin-only access**,
so that **I'm not asked for documents I don't need, I see and fix format issues immediately rather than at admin review, my home address (for cottage-food vendors) doesn't leak through EXIF metadata (NFR27), and my docs are protected from any unauthorized access (NFR11)**.

**Acceptance Criteria:**

**Given** the rules engine and wizard shell exist
**When** the developer creates `apps/vendor/app/(onboarding)/documents/page.tsx` and the `DocumentUploader` component in `packages/ui/components/DocumentUploader/`
**Then** Step 2 renders a list of required documents from `rulesEngine.lookup(state, categories, products).requiredDocs`, each with name, format guidance, an inline registry-lookup link where applicable, and an upload affordance
**And** `DocumentUploader` states are: empty, hover-drop-zone, uploading, valid, invalid, upload-error (UX-DR23)
**And** required documents stay visible until the vendor uploads the right type; "wrong document type uploaded" is flagged inline with rules-engine guidance ("This appears to be a food-handler cert; FDACS commercial-food permit format is `FD-XXXXX`").

**Given** the upload flow needs to land
**When** the developer creates the **image/document upload pipeline (AR44)** in `packages/backend/convex/`
**Then** the flow is: client requests upload URL via Convex query → client POSTs file directly to Convex storage signed URL → client calls `vendorDocuments.mutations.attachDocument({ storageId, vendorApplicationId, docType })` → mutation schedules action `vendorDocuments.internal.processUpload({ storageId, docType })`
**And** the action (V8 isolate, no Node) validates content type and size (rejects >10MB, accepts image/png, image/jpeg, image/heic, application/pdf), strips EXIF metadata (NFR27) using a V8-compatible library, generates responsive variants for images, parses PDFs for permit-number extraction where applicable (V8-compatible PDF parser)
**And** the resulting `vendorDocuments` row carries `vendorId`, `docType` (literal from `state_ag_license | fdacs_permit | usda_exemption | apiary_registration | business_license | food_handler_cert | coi`), `storageId`, `filename`, `uploadedAt`, `uploadedBy`, `expiry?`, `status: "pending"`, `rulesVersion`.

**Given** format validation (FR50 admin-side benefit; vendor-side here)
**When** the vendor uploads a permit
**Then** the action runs the format-validation regex from the rules engine (e.g., FDACS `FD-XXXXX` pattern, FL DBPR cottage-food registration format) on the extracted permit number
**And** an inline status badge appears: green "Format valid", yellow "Format unrecognized — please verify", red "Format invalid — expected `FD-XXXXX`"
**And** invalid-format docs are still saved (admin makes final call) but flagged in the rules-engine checklist for Story 2.7.

**Given** access control (NFR11, AR15)
**When** any non-admin, non-owner-of-this-vendor user tries to read a `vendorDocuments` storageId
**Then** the request is rejected
**And** `vendorOwnDocReadUrl(docId)` returns a short-lived signed URL only to the document's vendor org owners
**And** `adminDocReadUrl(docId)` returns one only to platform-admin Clerk org members.

**Given** compliance attestation (FR19)
**When** the vendor reviews the state-specific attestation copy (drawn from rules engine — labeling rules, revenue cap, food-safety acknowledgments, attestation-of-truthfulness language)
**Then** the vendor signs by typing their full legal name and clicking "I attest"
**And** the attestation is stored as a row in `complianceAttestations` with `vendorId`, `signedAt`, `legalName`, `attestationVersion`, `rulesVersion`, IP address, user agent
**And** an audit log entry records the signing via the subscriber pattern (NFR61).

**Given** Vitest + Playwright tests
**When** they run with the meaningful-tests `Protects:` block
**Then** they cover: EXIF stripped from a test JPEG with embedded GPS data verified before storage; document-format-invalid flag surfaces inline; access denied for a different vendor's docs; storage URL signed and short-lived (returns 403 after expiry); attestation captures legal name and `rulesVersion`; intentional-break check passes for the EXIF-strip assertion (commenting out the strip causes the test to fail).

**Given** the vendor completes Step 2
**When** they click Continue
**Then** the wizard advances to Step 3 (Story 2.5)
**And** `vendorApplications.currentStep` updates.

### Story 2.5: Step 3 — Stripe Connect hosted onboarding + webhook idempotency dispatcher

As **a vendor on Step 3**,
I want **to complete identity and bank-account verification through Stripe Connect's hosted onboarding flow without ever sharing W-9 or banking data with Farm2Table directly**,
so that **PCI scope and KYC liability stay with Stripe per NFR9 + NFR10, my onboarding feels professional rather than makeshift, and the platform can pay me out cleanly once orders start flowing**.

**Acceptance Criteria:**

**Given** the wizard exists and Stripe SDK is configured in `apps/vendor/lib/stripe-server.ts`
**When** the developer creates `apps/vendor/app/(onboarding)/stripe-connect/actions.ts` (Server Action per AR39)
**Then** the action calls `stripe.accountLinks.create()` for the vendor's Connect account (creating the Stripe Connect Express account if one doesn't exist; storing the resulting `stripeAccountId` on the `organizations` row)
**And** the action returns the hosted onboarding URL
**And** the page redirects the vendor to that URL.

**Given** the vendor completes Stripe-hosted KYC (or partially completes and returns)
**When** Stripe redirects back to the configured return URL
**Then** the page renders a "Verifying your account…" state and polls (or waits for the webhook) for `account.updated` events to signal completion
**And** NFR10 is upheld: at no point is W-9, banking, or government-ID data persisted in Convex.

**Given** the webhook dispatcher needs to land
**When** the developer creates `apps/marketplace/app/api/stripe/webhook/route.ts` and `packages/backend/convex/stripeWebhooks/internal.ts` per AR19
**Then** the route is added to `proxy.ts` `publicRoutes` (external Stripe callback)
**And** verifies the HMAC signature via `stripe.webhooks.constructEvent` (NFR16); unverified requests are rejected
**And** calls Convex internal mutation `stripe.processWebhook({ event })`
**And** the mutation does an atomic idempotency check on `stripeEventId` against the `stripeWebhookEvents` table (NFR34) — replays produce no double-processing
**And** dispatches by `event.type` (initially: `account.updated`; payment-event handlers added in Epic 5)
**And** stores the payload for 30-day replay capability (NFR56) with a cron purge of payload field after 30 days.

**Given** the dispatcher
**When** an `account.updated` event arrives
**Then** the handler updates the vendor's `organizations` row with the latest Stripe Connect status (`charges_enabled`, `payouts_enabled`, `details_submitted`, `requirements`)
**And** emits a `vendor.stripeConnectUpdated` domain event with the relevant fields
**And** writes an audit log entry via the subscriber pattern.

**Given** the vendor's Stripe Connect status reaches "fully onboarded"
**When** the wizard's poll/subscription detects `charges_enabled === true && payouts_enabled === true && details_submitted === true`
**Then** Step 3 is marked complete and Continue routes to Step 4
**And** if Stripe rejects KYC or requires more info, the vendor sees Stripe's explanatory message inline with a "Resume Stripe verification" button.

**Given** test mode in dev/qa
**When** the vendor uses Stripe's test KYC accounts (e.g., `000-00-0000` SSN test cases)
**Then** the flow completes against Stripe's test endpoints
**And** Playwright fixtures simulate the `account.updated` webhook with test event payloads.

**Given** webhook replay capability (NFR56)
**When** an admin (in Epic 8) calls `adminMutation stripe.replayWebhook({ eventId })`
**Then** the stored payload re-runs through the dispatcher
**And** idempotency prevents double-processing
**And** the replay is recorded in the audit log with the admin actor.

### Story 2.6: Step 4 — vendor agreement signing + submit for verification

As **a vendor on Step 4**,
I want **to read and sign the Vendor Agreement (drafted by Farm2Table's attorney), then submit my application for admin review with a clear "we typically review within 24 hours" expectation**,
so that **the legal contract between me and Farm2Table is in place before listings go live (FR21), I know what to expect next, and I receive a confirmation email so I have a paper trail**.

**Acceptance Criteria:**

**Given** the wizard and the vendor-agreement page from Epic 1's Story 1.11 exist
**When** the developer creates `apps/vendor/app/(onboarding)/agreement/page.tsx`
**Then** the page renders the vendor-agreement content from the marketplace app's `/vendor-agreement` page (gated on the `attorney-review-complete` feature flag)
**And** if the flag is off in dev/qa, a banner reads "Vendor agreement is being finalized by counsel — content shown is placeholder and not legally binding in this environment"
**And** the page is auth-gated to the signing vendor's org owner (vendor team members other than the owner cannot sign).

**Given** the vendor reads the agreement
**When** they sign by typing their full legal name and clicking "I agree"
**Then** a `vendorAgreementSignings` row is created with `vendorId`, `signedAt`, `legalName`, `agreementVersion`, IP address, user agent
**And** an audit log entry records the signing via the subscriber pattern (NFR61)
**And** a `vendor.agreementSigned` domain event fires.

**Given** all four steps are complete
**When** the vendor clicks "Submit for verification"
**Then** the `vendorApplications` row updates to `status: "pending_verification"`, `submittedAt: now`, `rulesVersion` (carried forward from Step 1)
**And** a `vendorApplication.submitted` domain event fires
**And** the email pipeline sends a `VendorApplicationSubmitted` email with "we typically review within 24 hours" copy and a link back to the vendor portal status page
**And** the vendor lands on a status screen showing the timer-since-submission and a checklist of what was submitted.

**Given** the application is pending
**When** the vendor returns to the vendor portal
**Then** the dashboard route shows the pending status (no product creation possible until Approved — gating wired in Epic 3)
**And** the status screen offers an "Edit submission" affordance only if status is still `pending_verification` (locks once admin opens the row in Story 2.7).

**Given** the vendor's application is submitted
**When** Story 2.8's admin approval fires
**Then** the vendor's status flips to `active`
**And** the vendor's portal unlocks the Epic 3 product/farm/fulfillment/dashboard surfaces
**And** the vendor can share their storefront link (Epic 3 Story 3.5) to start single-player-mode customer outreach.

**Given** Playwright E2E
**When** a complete onboarding flow runs end-to-end (signup → wizard step 1–4 → submit) in QA tier
**Then** the flow completes in under 30 minutes for a Foundation-tier cottage-food vendor with all required docs ready (the Mike journey speed target)
**And** the `Protects:` block on the test asserts: agreement signing creates the audit row, submission fires the domain event, the confirmation email is enqueued through the canonical pipeline.

### Story 2.7: Admin verification queue with RulesEngineChecklist

As **the admin (Jen)**,
I want **a Linear-tier dense queue of pending vendor applications, each opening with an auto-populated rules-engine checklist showing present / missing / wrong-doc-uploaded per item, format-validation results on permit numbers and expiry dates, one-action public-registry lookup links, and the audit trail visible inline — all keyboard-driven**,
so that **I can clear a typical Monday morning queue in under 15 minutes total without remembering a single state law (the rules engine front-loads the expertise), and the documentation generated by my decisions is the paper trail that protects against negligence claims (NFR59–62)**.

**Acceptance Criteria:**

**Given** the admin app and rules engine exist
**When** the developer creates `apps/admin/app/verification-queue/page.tsx` and the `AdminTriageQueue` + `RulesEngineChecklist` components in `packages/ui/components/`
**Then** the queue lists all `vendorApplications` with `status: "pending_verification"` (newest first by `submittedAt`)
**And** each row shows: vendor name, state, categories, days-since-submission, status pill (`pending`)
**And** the queue is the default landing for `apps/admin` (auth-gated to platform-admin Clerk org with mandatory 2FA per NFR12).

**Given** the queue is rendered
**When** the admin opens an application row (click or `↵` after `j/k` navigation)
**Then** the row inline-expands (no modal per UX-DR21) showing the `RulesEngineChecklist` with rows of (required document × status × validation result × admin action)
**And** each row's status is auto-determined: green ✓ "Present and format-valid"; red ✗ "Missing"; red ✗ "Wrong document type uploaded — expected `<docType>`, got `<actualType>`"; yellow ⚠ "Format unrecognized — please verify manually"
**And** for documents with public-registry APIs (e.g., USDA Local Food Directory), an inline "Open registry lookup" link is surfaced with the candidate permit number pre-filled.

**Given** the checklist is auto-populated
**When** the admin reviews an FL cottage-food application
**Then** the checklist shows the rules-engine-determined required docs for FL cottage food (DBPR registration, business license/DBA, compliance attestation)
**And** if the application is for an FL egg producer, the FL-specific note surfaces inline: "All FL egg vendors require a FDACS Limited Poultry and Egg Farm Operation permit regardless of flock size. There is no small-flock exemption in FL law"
**And** the audit trail (admin actions, vendor messages, document uploads with timestamps) is visible inline below the checklist.

**Given** keyboard-first interaction (UX-DR21)
**When** the admin uses the queue
**Then** `j/k` navigates next/previous row, `↵` opens detail, `Esc` collapses, `⌘K` opens the command palette filter, `a` triggers approve (Story 2.8), `r` triggers request-more (Story 2.9), `x` triggers reject (Story 2.10)
**And** keyboard shortcuts are visible in the UI (status bar showing `↵ Open · a Approve · r Request more · x Reject · ⌘K Filter · ? Help`)
**And** mouse fallback works equivalently.

**Given** the queue is auth-gated
**When** a non-admin authenticated user attempts to access `/verification-queue`
**Then** the request is rejected with `appError("auth.forbidden", ...)` and the user is redirected to a clear "this area requires platform-admin access" page
**And** the admin app's `proxy.ts` enforces platform-admin Clerk org membership + 2FA at the network boundary.

**Given** Playwright E2E
**When** the admin walks through opening an application, viewing the checklist, and observing the rules-engine-surfaced state-specific note
**Then** the test passes on Chromium and WebKit
**And** axe-core finds no a11y regressions on the queue or expanded detail
**And** the `Protects:` block asserts: queue shows only pending applications; format validation status reflects rules-engine output; FL-specific egg-permit note surfaces correctly; queue is admin-org-gated.

**Given** the AdminTriageQueue component is built here
**When** Epic 8 needs the customer-report queue (FR54) and the audit-log queue
**Then** those surfaces compose the same component
**And** the keyboard shortcuts and inline-expand pattern are the same.

### Story 2.8: Admin approve action

As **the admin**,
I want **a single keystroke (`a`) or button to approve a vendor application — which sends a templated approval email with state-specific context auto-inserted, flips the vendor's org status to active, writes the approval to the audit log with the rules-engine version that approved them, and emits a domain event so downstream subscribers (vendor portal unlock, welcome email) react**,
so that **the typical clean application takes under 90 seconds total to approve, the approval is fully traceable for regulatory defense, and the vendor can immediately share their storefront link to start single-player-mode operations**.

**Acceptance Criteria:**

**Given** the verification queue exists and the rules-engine checklist is auto-populated
**When** the admin presses `a` (or clicks Approve) with all checklist items green
**Then** Convex `adminMutation vendorApplications.approve({ applicationId })` runs, gated by the `adminMutation` wrapper which requires platform-admin Clerk org membership with 2FA
**And** the mutation transitions `vendorApplications.status` from `pending_verification` to `approved`, sets `approvedAt`, `approvedBy: ctx.user._id`, `approvedRulesVersion: <current>`
**And** updates the corresponding `organizations` row to `status: "active"`.

**Given** the approval mutation succeeds
**When** the audit log subscriber (Story 1.3) fires
**Then** an `auditLog` entry is written with actor (admin user), action (`vendor.approved`), affected entity (`vendorId`, `applicationId`), timestamp, `rulesVersion` — satisfying NFR61 + NFR66
**And** a `vendorApplication.approved` domain event fires.

**Given** email subscribers
**When** the `vendorApplication.approved` event lands
**Then** the email pipeline sends a `VendorApplicationApproved` template email to the vendor's owner
**And** the email body uses Square's voice ("You're approved. Your storefront is live, and you can start adding products and sharing your link.") with state-specific context auto-inserted where applicable (FL → "Don't forget the FL cottage-food labeling requirement on every product")
**And** the email includes the storefront-link URL and a deep link into the vendor portal's "add your first product" path (Epic 3).

**Given** the vendor's org is now active
**When** the vendor logs into the vendor portal
**Then** all Epic 3 surfaces unlock (product creation, fulfillment configuration, storefront link, dashboard)
**And** the onboarding wizard is no longer the default landing.

**Given** the approval action is keyboard-driven
**When** the admin presses `a` and the next row auto-advances per UX-DR21
**Then** focus moves to the next pending application in the queue
**And** the just-approved row is removed from the active queue (still queryable from "all applications" view)
**And** the action takes <90 seconds for a clean application.

**Given** Playwright E2E with `Protects:` block
**When** an approve flow runs end-to-end in QA tier
**Then** the test verifies: vendor org status flipped to active; audit row written with `rulesVersion`; approval email enqueued via canonical pipeline; vendor's portal now unlocks Epic 3 routes; intentional-break check passes (commenting out the org-status flip causes the assertion to fail).

### Story 2.9: Admin request-more-info action

As **the admin**,
I want **a single keystroke (`r`) to request additional or corrected documents from a vendor — pre-populating the modal with the rules-engine's specific reason ("expected FDACS Commercial Food Permit; got food-handler cert"), sending a templated email with state-specific FDACS guidance link auto-inserted, and routing the application to "awaiting documents"**,
so that **I never have to compose a state-specific compliance email from scratch, the vendor knows exactly what to fix and how, and the round-trip stays under 90 seconds on my side**.

**Acceptance Criteria:**

**Given** the verification queue exists and a checklist row is red
**When** the admin presses `r` (or clicks Request more)
**Then** a Sheet opens with the email pre-populated from the `VendorMoreInfoRequested` template
**And** the rules-engine surfaces the specific issue inline: "This vendor selected 'Commercial Food' which requires a FDACS Commercial Food Permit (FDACS form CF-1, format `FD-XXXXX`). Document uploaded appears to be a food-handler certification (different document, not sufficient for this category). Suggested action: request the correct document."
**And** the templated email body includes the specific document needed, the format expected, the FDACS guidance link, and a deep link the vendor can use to re-upload.

**Given** the admin reviews and (optionally) edits the email
**When** they click "Send request"
**Then** Convex `adminMutation vendorApplications.requestMoreInfo({ applicationId, message })` runs
**And** transitions `vendorApplications.status` to `awaiting_documents`, sets `lastInfoRequestAt`, `infoRequestCount += 1`
**And** the email pipeline sends the `VendorMoreInfoRequested` template
**And** an audit log entry records the request with the message body
**And** a `vendorApplication.moreInfoRequested` domain event fires.

**Given** the vendor receives the email
**When** they click the deep link and re-upload the corrected document
**Then** the application status flips back to `pending_verification`
**And** the application returns to the admin queue (sortable by "recently re-submitted" so admin sees it surfaced).

**Given** the admin can approve while awaiting docs (e.g., they've decided to drop a category instead of waiting)
**When** the admin presses `a` from `awaiting_documents` status
**Then** approval proceeds normally (Story 2.8 mutation)
**And** the audit log records the admin acted while in `awaiting_documents` state.

**Given** the in-app inbox (Epic 6 will add this for vendors more broadly; Story 2.9 surfaces the request via email + a placeholder notification record)
**When** the request is sent
**Then** a `notifications` row is written for the vendor's owner with the templated message, ready for the in-app NotificationCenter when Epic 6 lands
**And** the admin's queue entry shows "info requested 2h ago" status.

**Given** Playwright E2E with `Protects:` block
**When** the request-more flow runs
**Then** the test verifies: status flips to awaiting_documents; templated email body includes state-specific guidance; rules-engine reason surfaces correctly in the modal; audit log entry includes the message body verbatim.

### Story 2.10: Admin reject action

As **the admin**,
I want **a single keystroke (`x`) to reject a vendor application — sending a templated rejection email with reason + clear can-reapply path, transitioning the application to rejected status, and emitting a domain event**,
so that **rejections are documented for regulatory defense (e.g., a FL egg producer without the required FDACS Limited Poultry/Egg permit), the vendor understands what to do to re-apply, and the audit log carries the rejection reason and rules-engine version**.

**Acceptance Criteria:**

**Given** the verification queue exists
**When** the admin presses `x` (or clicks Reject)
**Then** a Sheet opens prompting the admin to select a rejection reason from a curated list (rules-engine-blocked combo, missing required document repeatedly, format-invalid documents, attestation refused, other-with-explanation)
**And** the templated `VendorApplicationRejected` email auto-populates with the reason + a clear can-reapply path ("You can re-apply once you obtain the FDACS Limited Poultry/Egg permit. Here's the FDACS link.")
**And** an admin-editable freeform field captures additional context if needed.

**Given** the admin sends the rejection
**When** Convex `adminMutation vendorApplications.reject({ applicationId, reason, message })` runs
**Then** transitions `vendorApplications.status` to `rejected`, sets `rejectedAt`, `rejectedBy`, `rejectionReason`, `rejectionMessage`, `rulesVersion`
**And** the corresponding `organizations` row remains at `status: "onboarding"` (vendor can re-apply; Clerk Org persists)
**And** an audit log entry records the rejection with reason and full message body for regulatory defense
**And** a `vendorApplication.rejected` domain event fires.

**Given** the vendor receives the rejection email
**When** they later return to the vendor portal
**Then** the wizard is unlocked again (vendor can edit their application)
**And** a clear notification on the dashboard explains "Your application was rejected on `<date>`. Reason: `<reason>`. You can update your information and re-submit."
**And** re-submission creates a fresh `vendorApplications` row referencing the prior rejected application.

**Given** repeated rejections (anti-abuse)
**When** the same vendor org has 3+ rejections within 30 days
**Then** an internal flag is set on the org for admin review (not user-facing); does not block re-application but shows in the admin queue as "repeat rejection — review carefully"
**And** the audit log notes this pattern for defense in case of future state AG inquiries about pattern-of-rejection compliance practice.

**Given** Playwright E2E with `Protects:` block
**When** the reject flow runs end-to-end
**Then** the test verifies: status flips to rejected with reason and rulesVersion captured; templated email includes can-reapply path; audit log carries the full rejection context; re-application creates a fresh row referencing the rejected one.

## Epic 3: Vendor Storefront & Operations

A verified vendor logs into the vendor portal and configures everything they need to start selling: edits their farm profile with live-preview Squarespace-lite editing, creates products with variants and traceability fields under Foundation-tier limits (5 products, 2 variants/product, 5 team members), tracks inventory, configures per-product fulfillment (pickup windows, local-delivery zip+fee, shipping by state+product+fee, cancellation cutoffs), generates a shareable storefront link with attribution tracking they can paste into their Instagram bio, and views a sales dashboard showing GMV plus the load-bearing marketplace-sourced-vs-vendor-shared-link split. Everything is built so single-player mode is immediately useful — the cold-start strategy depends on this epic being usable before Epic 4 (marketplace browse) makes the marketplace flywheel turn.

### Story 3.1: Vendor portal app shell + active-vendor gating

As **a verified vendor (or vendor team member)**,
I want **to land in the vendor portal with a clear top-nav (Dashboard / Products / Orders / Storefront / Settings) that's appropriately gated so only active vendor orgs can access vendor functionality**,
so that **pending/rejected/onboarding orgs don't see surfaces they can't use, my team members see the same nav I do based on their role, and the portal feels like Square's "tool for the protagonist" rather than a sterile SaaS dashboard**.

**Acceptance Criteria:**

**Given** the vendor app exists at `vendors.farm2table.app`
**When** the developer creates `apps/vendor/app/layout.tsx`, `providers.tsx`, `proxy.ts`, and the `VendorTopNav` component in `packages/ui/components/VendorTopNav/`
**Then** `VendorTopNav` renders logo + tabs (Dashboard / Products / Orders / Storefront / Settings) + Notifications bell (Epic 6 wires the count) + theme toggle + Org switcher (Clerk's `<OrganizationSwitcher>` for vendors who own multiple farms — rare but possible per AR12)
**And** at <600px viewport, tab labels shrink to icons with accessible labels (UX-DR29)
**And** the layout wraps every authenticated route.

**Given** auth gating
**When** a user navigates to any non-auth vendor route (e.g., `/dashboard`, `/products`)
**Then** the `proxy.ts` checks Clerk session
**And** Convex `vendorQuery` wrappers verify the active Clerk Org's `organizations.status === "active"` (per Story 2.8's status flip)
**And** orgs in `pending_verification` / `awaiting_documents` / `rejected` / `onboarding` see a "Your application is still in review — return to the onboarding wizard" gate page that links back to the appropriate Epic 2 surface
**And** users with no active vendor org context get redirected to vendor sign-up.

**Given** `proxy.ts publicRoutes`
**When** the developer wires the allowlist
**Then** only `/sign-in`, `/sign-up`, `/sign-up/[[...catchall]]`, `/sign-in/[[...catchall]]`, and Clerk callback routes are public
**And** every other vendor route is auth-gated.

**Given** team member roles (per AR12: `owner`, `admin`, `fulfillment`)
**When** the layout renders
**Then** the nav adapts to role — `owner` sees all tabs including Settings (which gates to `vendorOwnerMutation`-required surfaces); `admin` sees Dashboard / Products / Orders / Storefront but Settings is read-only; `fulfillment` sees Dashboard / Orders only
**And** role-gating is enforced server-side via the appropriate Convex wrapper, not just visually.

**Given** Foundation tier team-member limits
**When** the owner attempts to invite a 6th team member via Clerk's invitation flow
**Then** the Convex `addOrgMember` mutation rejects with `appError("vendor.tier_limit_exceeded", "Foundation tier allows up to 5 team members. Upgrade to Growth to invite more.", { currentTier: "foundation", limit: 5 })`
**And** the UI surfaces the error with a deep link to the (Growth-deferred) tier upgrade page.

**Given** Playwright E2E
**When** the test runs sign-in → vendor portal load on Mobile Safari at 320px
**Then** the nav renders with icon-only tabs, the layout works, the active-vendor gate accepts the active vendor user
**And** axe-core passes WCAG 2.1 AA on the portal shell.

### Story 3.2: Farm profile editor with live preview

As **the vendor (org owner)**,
I want **a Squarespace-lite live-preview editor where I can edit my farm name, address (with control over how granular the public display is), declared practices, farmer story, hero photo, optional quote and secondary photo, certification claims, and contact preferences**,
so that **I can craft a real public face for my farm without hiring a designer, my home address (if I'm a cottage-food vendor) doesn't have to be the public-facing contact location, and I can see my changes update in real time without a save-and-view loop**.

**Acceptance Criteria:**

**Given** the vendor portal shell exists
**When** the developer creates `apps/vendor/app/profile/page.tsx` and the `FarmStorefrontEditor` component in `packages/ui/components/FarmStorefrontEditor/`
**Then** the editor presents an edit panel (left at desktop, top stack at mobile) and a live preview (right at desktop, below stack at mobile) that updates as the vendor types
**And** preview matches the eventual public render layout from Epic 4 (UX-DR38 magazine spread) — so what the vendor sees here is what customers will see at `/farms/<slug>` when Epic 4 ships.

**Given** editable fields
**When** the vendor edits
**Then** the form supports (FR25):
- **Farm name** (required, used for Clerk Org name + slug derivation; collision detection on slug)
- **Slug** (auto-derived from name; vendor can override; uniqueness validated server-side; `appError("validation.invalid", "Slug already taken — try '<suggestion>'")` on collision)
- **Address granularity** (radio: `full_address` / `city_only` / `region_only`); the public render in Epic 4 respects this — cottage-food at-home vendors can hide their home street address
- **Declared practices** (multi-select: organic, regenerative, pasture-raised, certified-naturally-grown, biodynamic, no-spray, conventional, etc.) — these populate the `Practices` filter in Epic 4 marketplace browse
- **Farmer story** (markdown textarea, max 2000 chars)
- **Hero photo** (21:9 aspect at desktop, 4:3 at mobile; uploaded via Epic 2's image pipeline with EXIF strip per NFR27)
- **Optional farmer quote** (with quote attribution)
- **Optional secondary photo** (4:5 portrait — UX-DR53 imagery pattern)
- **Certification claims** (multi-select with cert badges from a curated list; verification linking to issuing body per FR5 + UX-DR18; vendor's claim is "claimed" until cert is verified — Growth phase's registry adapter cross-checks land in FR53)
- **Contact preferences** (which channels to surface publicly: email-form, phone, in-app message; per UX-DR53)

**Given** the vendor saves edits
**When** the mutation runs
**Then** changes write to the `organizations` row + `farmProfiles` table (separate row for non-org-essential profile data)
**And** `vendor.profileUpdated` domain event fires
**And** the audit log records the change via the subscriber pattern (NFR61)
**And** the `revalidateTag('catalog:<slug>')` Cache Components tag fires so any Epic 4 farm-profile page render is invalidated.

**Given** image upload (FR25 photos with EXIF strip per NFR27, AR44)
**When** the vendor uploads a hero or secondary photo
**Then** the image flows through Epic 2's pipeline (signed upload URL → Convex storage → V8 action validates content type/size, strips EXIF, generates responsive variants)
**And** the editor shows an upload progress affordance and an error inline if the upload fails (e.g., file too large, EXIF strip failed for an unsupported format).

**Given** Playwright E2E with `Protects:` block
**When** the editor flow runs end-to-end
**Then** the test verifies: live preview updates as the vendor types; slug collision is caught; hero photo upload completes with EXIF stripped (assertion fails if EXIF persists); address granularity setting is respected in the live preview render; audit log captures the change
**And** axe-core passes (semantic form, labels, aria-describedby for errors).

### Story 3.3: Product creation & editing (CRUD)

As **the vendor**,
I want **to create, edit, publish, unpublish, and remove product listings — each with up to 2 variants under Foundation tier limits, weight-based pricing, photos with required alt text, descriptions, traceability fields (lot number, batch, harvest/pack date), and labeling fields (ingredients, allergens, applicable disclaimers)**,
so that **I can list real products my customers can buy, my listings carry the provenance density Farm2Table is built around, and Foundation tier limits are enforced gracefully when I bump against them (5 products max)**.

**Acceptance Criteria:**

**Given** the vendor portal shell and farm profile exist
**When** the developer creates `apps/vendor/app/products/page.tsx`, `products/new/page.tsx`, `products/[productId]/edit/page.tsx`, and the corresponding Convex backend in `packages/backend/convex/products/`
**Then** the schema adds `products`, `productVariants`, `productImages` tables with appropriate indexes (by_vendor, by_status, by_category, search index from Story Epic 4)
**And** `products` row carries `vendorId`, `name`, `slug` (per-vendor unique), `description`, `category`, `subcategory?`, `practices` (denormalized from farm), `certifications` (denormalized claimed), `traceability` (lot/batch/harvest+pack date as optional fields), `labeling` (ingredients, allergens, disclaimers), `status` (literals: `draft | published | archived`), `createdAt`, `updatedAt`, `archivedAt?`.

**Given** the products list page
**When** the vendor visits `/products`
**Then** they see all their products grouped by status (Published / Draft / Archived) with `ProductCard` (UX-DR15) compact variant
**And** an "Add product" CTA at the top with a Foundation-tier counter ("3 of 5 products") and disabled state at limit
**And** archived products are shown collapsed by default ("3 archived — show").

**Given** product creation
**When** the vendor opens `/products/new` and fills the form
**Then** the form (React Hook Form + Zod per AR8) supports:
- **Name + description + category** (required); **subcategory** (optional, used for tax-PTC override per AR18 — beverage and snack subcategories)
- **Up to 2 variants** (Foundation cap per FR32 / AR12) — each with its own size/weight, price, weight-based pricing toggle (per-lb / per-each), SKU (auto-generated)
- **Photos** (1–5 per product, 4:3 aspect via PhotoHero, alt text **required at upload** per UX-DR53 with rules-engine guidance prompt "describe the photo in one sentence — what's in it and where", EXIF stripped)
- **Traceability fields** (optional at MVP per PRD's "FSMA 204 ahead of July 2028 deadline" framing): lot number, batch, harvest date, pack date
- **Labeling fields**: ingredients (list), allergens (multi-select FDA-recognized list), disclaimers (markdown — required for FL cottage-food per the rules-engine attestation Story 2.4 captured)
- **Cancellation cutoff** (per-product override of the vendor default; defaults to vendor-config setting from Story 3.5)

**Given** Foundation tier limits
**When** the vendor attempts to create a 6th product
**Then** Convex `vendorMutation products.create` rejects with `appError("vendor.tier_limit_exceeded", "Foundation tier allows up to 5 products. Upgrade to Growth for unlimited products.", { currentTier: "foundation", productLimit: 5, currentCount: 5 })`
**And** the UI surfaces the error with a "Manage products" affordance (so the vendor can archive an existing product to free a slot) and a deep link to the Growth-deferred tier upgrade page.

**Given** state machine
**When** the vendor saves a draft product
**Then** `status: "draft"` and the product is not visible to customers in Epic 4
**And** transition to `status: "published"` via "Publish" button validates: at least one photo with alt text, all required fields populated, vendor's compliance status is `verified` (Story 2.8), at least one fulfillment method configured (Story 3.5)
**And** `published` products emit `product.published` domain event (Epic 4 Cache Components `revalidateTag('catalog')` subscriber)
**And** archive action (soft delete per AR11) sets `status: "archived"`, frees a tier-limit slot, and is recoverable.

**Given** image upload reuses Epic 2's pipeline
**When** the vendor uploads product photos
**Then** EXIF stripped, responsive variants generated, alt text required (no save without alt text per WCAG)
**And** Vitest test asserts EXIF stripped from a test image with embedded GPS data; intentional-break check passes.

**Given** Playwright E2E with `Protects:` block
**When** the create-edit-publish-archive cycle runs end-to-end
**Then** the test verifies: tier limit blocks at 5; alt text required; published products visible to public queries (using a stub for Epic 4); archive recovers; intentional-break check confirms the publish-validation logic actually gates publish.

### Story 3.4: Inventory management

As **the vendor**,
I want **per-variant inventory tracking with vendor-set low-stock thresholds, an automatic sold-out state when quantity hits zero, a restock action, and the option to disable inventory tracking for unlimited-supply items (e.g., subscription-style products)**,
so that **I don't oversell, I get a heads-up before I run out of something popular, and customers see accurate availability on the marketplace**.

**Acceptance Criteria:**

**Given** the products schema exists
**When** the developer adds `inventory` fields to `productVariants` (or a separate `inventory` table keyed by variant)
**Then** each variant carries `quantity` (nullable for "unlimited"), `lowStockThreshold?`, `inventoryEnabled: boolean` (default true), `lastRestockedAt?`, `lastSoldOutAt?`
**And** inventory adjustments are append-only via `inventoryAdjustments` table for audit (`variantId`, `delta`, `reason` literals: `manual_adjust | order_placed | order_cancelled | order_refunded | restock`, `actorId`, `at`).

**Given** the inventory page
**When** the vendor visits `/inventory`
**Then** they see all their variants in a dense table (UX-DR4 dense density variant) with current quantity, low-stock badge if at/below threshold, sold-out badge if zero
**And** can adjust quantity inline with a stepper or direct entry
**And** can set/edit low-stock threshold per variant
**And** can toggle `inventoryEnabled` per variant (off = "unlimited" — no quantity tracking).

**Given** automatic state transitions
**When** an inventory adjustment writes a new quantity
**Then** crossing zero automatically sets `lastSoldOutAt` and emits `inventory.soldOut` domain event
**And** crossing the low-stock threshold (going down) emits `inventory.lowStock` domain event (used by Epic 5/6 for in-cart "1 left" warnings — display itself is Growth real-time per FR70, but the event fires now for analytics)
**And** restocking from zero emits `inventory.restocked`.

**Given** product visibility on the marketplace
**When** Epic 4's product detail / browse queries read variant availability
**Then** sold-out variants are visibly badged but not hidden (per UX-DR15 ProductCard `out-of-stock` state)
**And** `inventoryEnabled: false` variants always appear available.

**Given** order placement (Epic 5) will decrement inventory
**When** the inventory mutations are written
**Then** the decrement is wrapped in the order-creation transaction (Convex mutation atomicity)
**And** Epic 5's checkout will use these mutations (no need for cart inventory holds at MVP — that's Vision FR72)
**And** the inventory mutation rejects with `appError("inventory.insufficient", ...)` if a checkout attempts to decrement below zero on a tracked variant.

**Given** Playwright E2E with `Protects:` block
**When** the inventory flow runs
**Then** the test verifies: manual adjustment writes audit row; sold-out auto-transition; low-stock event fires at threshold; `inventoryEnabled: false` variants never decrement; intentional-break check confirms the zero-quantity guard actually prevents over-decrement.

### Story 3.5: Per-vendor fulfillment configuration

As **the vendor**,
I want **per-product fulfillment configuration covering pickup windows (day-of-week + time), local-delivery zip codes with my fee, shipping by destination state with my fee + packaging method, and per-product cancellation cutoffs — with the rules engine blocking combinations my license doesn't permit (e.g., FL cottage food can't ship interstate by default)**,
so that **customers see exactly what I offer at checkout, my pickup windows feed the customer's `PickupWindowPicker` cleanly, and I'm not exposed to compliance risk by accidentally enabling shipping I'm not licensed for**.

**Acceptance Criteria:**

**Given** the products and rules engine exist
**When** the developer creates `apps/vendor/app/fulfillment/page.tsx` and `vendorFulfillmentConfig` table schema
**Then** the page lists all the vendor's published products with current fulfillment summary per product
**And** each product can be configured per AR12 fulfillment dimensions:
- **Farm pickup**: enable/disable; pickup address (defaults to farm address from Story 3.2; can override per product); day-of-week availability (multi-select Mon–Sun); time-window per available day (e.g., "9am–11am, 4pm–6pm"); IANA timezone (defaults to vendor's timezone per AR54)
- **Local delivery**: enable/disable; zip-code coverage list (vendor enters zips); fee per delivery; delivery-day availability
- **Shipping**: enable/disable; destination-state coverage (multi-select states the vendor can ship to — gated by rules engine per FR23 — FL cottage food can't ship interstate); fee per package; packaging method (insulated cooler / dry ice / room temp / other); cold-chain capable flag

**Given** rules-engine enforcement (FR23)
**When** an FL cottage-food vendor attempts to enable shipping to TX
**Then** the form blocks the selection with `appError("rules_engine.shipping_not_permitted", "FL cottage food shipping interstate is ambiguous; defaults to in-state only. Contact us to enable other states once FDACS confirms broader scope.")`
**And** the rules-engine reason is shown inline with the FDACS link.

**Given** cancellation cutoffs (FR39)
**When** the vendor sets a per-product cancellation cutoff (default 24h, configurable 0–168 hours)
**Then** the config is stored with the product and surfaces on the customer-facing listing in Epic 4 ("Cancellable until 24h before pickup")
**And** the cutoff drives Epic 6's per-line cancellation logic (vendor can cancel anytime; customer can cancel only before cutoff per FR37 hold-request flow).

**Given** pickup windows feed Epic 5
**When** the customer in Epic 5 selects pickup at this vendor for the next 14 days (UX-DR14 PickupWindowPicker horizon)
**Then** the picker reads from this vendor's configured availability + cancellation cutoff to determine the soonest available window
**And** vendors are given a "Pickup window preview" affordance on this page so they can see what the customer will see for the next 14 days.

**Given** the fulfillment config writes
**When** changes are saved
**Then** `vendor.fulfillmentConfigured` domain event fires
**And** `revalidateTag('catalog:<vendor-slug>')` invalidates the vendor's farm-profile and product pages
**And** audit log records the change (relevant if a vendor changes shipping coverage and a state-AG inquiry follows).

**Given** Playwright E2E with `Protects:` block
**When** the config flow runs
**Then** the test verifies: rules-engine blocks restricted shipping; pickup windows render correctly in the preview; cancellation cutoffs persist; intentional-break check confirms the rules-engine block actually fails the save when bypassed.

### Story 3.6: Vendor-shareable storefront link with attribution tracking

As **the vendor**,
I want **a shareable storefront link (`farm2table.app/farms/<slug>`) with copy-to-clipboard, a QR code I can print on my market booth signage, and attribution tracking so orders coming from my shared link are distinguished from orders that found me through marketplace browse**,
so that **I can paste the link into my Instagram bio (the Mike journey single-player-mode entry point), my regulars can use it without ever browsing the marketplace, and the dashboard in Story 3.7 can tell me whether the marketplace is producing real demand vs. just hosting my existing customers**.

**Acceptance Criteria:**

**Given** the vendor portal shell and farm profile exist
**When** the developer creates `apps/vendor/app/storefront-link/page.tsx`
**Then** the page shows the vendor's storefront URL `https://farm2table.app/farms/<slug>` (using current slug from Story 3.2) with copy-to-clipboard
**And** a QR code rendered client-side (no external SaaS) that encodes the URL with attribution params; downloadable as PNG for printing on booth signage
**And** a "Link options" section explaining UTM-style parameters that can be appended for finer-grained attribution (e.g., `?campaign=instagram-bio` vs. `?campaign=email-list`).

**Given** the attribution mechanism
**When** a visitor lands on `/farms/<slug>?src=vendor-share&vendor=<slug>` (the link this page generates)
**Then** Epic 1's site-wide layout reads the `src` and `vendor` query params on first page load and writes them into the cart session (cookie-based per AR7 anonymous cart) as `attributionSource: "vendor-share"`, `attributionVendor: <slug>`
**And** these persist across page navigation within the session
**And** when the customer eventually checks out (Epic 5), the order's `vendorOrders[]` rows attributed to this vendor record `attributionSource: "vendor-share"` rather than the default `"marketplace"`.

**Given** marketplace-sourced default
**When** a visitor lands on the marketplace home, browse page, or any non-`?src=vendor-share` route
**Then** their cart session's `attributionSource` defaults to `"marketplace"`
**And** orders placed from marketplace-discovered carts are recorded as marketplace-sourced.

**Given** attribution is captured per-vendor-line not per-order
**When** a customer's cart includes items from Vendor A (came in via Vendor A's shared link) and items from Vendor B (discovered while browsing the marketplace)
**Then** the order's vendorOrder row for Vendor A is `attributionSource: "vendor-share"` while Vendor B's is `"marketplace"`
**And** Vendor B benefits from the marketplace-sourced metric exactly as if they'd been discovered without Vendor A's shared link involved.

**Given** Story 3.7's dashboard depends on this
**When** Story 3.7 reads the marketplace-sourced ratio from the events
**Then** the read is correct because attribution writes happened at order placement (not retroactively).

**Given** the storefront link page
**When** the vendor copies the URL or downloads the QR
**Then** a `vendor.storefrontLinkShared` domain event fires (lightweight analytics — used to correlate growth in vendor-sourced orders with sharing actions)
**And** the page provides clear copy explaining single-player mode in Square's voice ("Your link is ready. Paste it into your Instagram bio or print the QR for your booth — your customers will check out through Farm2Table without ever needing to browse anyone else").

**Given** the public render at `/farms/<slug>` doesn't exist yet (lands in Epic 4)
**When** the vendor clicks the link from this page in dev/qa
**Then** they reach a placeholder page on the marketplace app that says "Storefront preview coming soon" — Epic 4 wires the actual render
**And** the link generation, attribution capture, QR encoding, and copy-to-clipboard all work fully in Story 3.6 even before Epic 4 lands.

**Given** Playwright E2E with `Protects:` block
**When** the test simulates a customer visiting `/farms/<slug>?src=vendor-share&vendor=<slug>` and proceeding to a stub checkout
**Then** the cart session captures the attribution; the eventual order records `attributionSource: "vendor-share"` for this vendor's lines
**And** intentional-break check: removing the attribution-capture code causes the order's source to default to `"marketplace"` — test fails.

### Story 3.7: Vendor sales dashboard

As **the vendor**,
I want **a dashboard showing my GMV, order count, marketplace-sourced vs. vendor-shared-link order split, and a quiet tier-upgrade math suggestion when my volume justifies it**,
so that **I see whether the marketplace is producing real demand for me (the load-bearing question for the platform's value), I'm never surprised by my numbers, and I can see future tier savings without being pressured into upgrading**.

**Acceptance Criteria:**

**Given** the vendor portal and Story 3.6's attribution exist
**When** the developer creates `apps/vendor/app/dashboard/page.tsx` and the `VendorDashboardStats` + `VendorSimpleChart` + `TierUpgradeCallout` components in `packages/ui/components/`
**Then** the dashboard is the default landing route for active vendors per Story 3.1
**And** renders four stat cards (FR30): GMV (this month, last month, all-time); Orders (this month, last month, all-time); Marketplace-sourced ratio (this month, last month — the load-bearing PRD metric); Active products (current count vs. tier cap)
**And** below the cards: an 8-bar weekly-orders chart using `VendorSimpleChart` (CSS-only, no JS chart library per UX-DR30); the chart is split by attribution source (marketplace-sourced bars in `--success`, vendor-shared-link in `--accent` with text labels — color is never the only signal per UX-DR7).

**Given** marketplace-sourced ratio comes from order vendorOrder rows
**When** the dashboard query reads
**Then** it computes `marketplaceSourced / total` per time window using `vendorOrders.attributionSource` from Story 3.6
**And** the ratio displays as both a percentage and an absolute count
**And** if the vendor has fewer than 10 orders, the ratio is suppressed with "Not enough data yet" (per UX-DR17 low-data suppression pattern) to avoid noise
**And** the PRD's 20%-by-month-6 platform-wide threshold is not exposed per-vendor (that's a platform-level metric in Epic 8 admin dashboard); per-vendor framing is informational only.

**Given** tier-upgrade math
**When** the vendor's monthly GMV (last 30 days rolling) crosses a Foundation→Growth break-even threshold
**Then** `TierUpgradeCallout` (UX-DR31) appears on the dashboard with quiet copy: "If you'd been on Growth tier last month, you'd have saved $X in commission ($59/mo subscription − $Y commission savings = net $Z)" — non-forced (UX-DR54 voice rule)
**And** the math uses real Foundation 22% vs. Growth 18% rates against actual last-month GMV
**And** dismissal of the callout persists per-vendor for 30 days (avoid auto-tier resentment per Tom journey emotional goal)
**And** clicking through routes to the (Growth-deferred) tier subscription page; at MVP this is a static "Coming soon — Growth tier launches once we have ≥50 active Foundation vendors" page.

**Given** Cache Components (AR32)
**When** the dashboard renders
**Then** stats are computed by Convex queries (reactive on order events) and the page is a Client Component using the wrapped `useQuery` for live data
**And** auth-gated surfaces are never CDN-cached (per AR32 policy).

**Given** cross-tab freshness
**When** the vendor has the dashboard open in one tab and an order arrives via Epic 5 in another
**Then** the dashboard updates reactively via Convex's reactive query layer (the foundation for Growth's FR68 live dashboard — reactive query already in place; only the UX framing as "live" is deferred)
**And** there's no manual refresh required.

**Given** Playwright E2E with `Protects:` block
**When** a test seeds 30 orders (mix of marketplace-sourced and vendor-shared) and renders the dashboard
**Then** the marketplace-sourced ratio is computed correctly; the chart bars match the seeded distribution; the tier-upgrade callout appears at the right GMV threshold; dismissal persists across page reloads; intentional-break check confirms swapping attribution sources produces a different ratio.

## Epic 4: Marketplace Discovery & Provenance

A customer arrives via SEO ("buy pastured eggs Sarasota"), a vendor's shared link, or direct navigation. They browse the marketplace by product / farm name / location / certification / practice with filters that reflect into the URL for shareability. They land on editorial farm profiles with verified certs linking to issuing authorities, view product detail pages with traceability fields, navigate geo-targeted landing pages, and save farms they want to remember (with sign-in prompt for anonymous users). All public surfaces server-render with full Schema.org structured data so they index in search results — the marketplace's organic acquisition strategy depends on this.

### Story 4.1: Search infrastructure (Convex `searchIndex` + denormalized `searchableText`)

As **the platform**,
I want **Convex `searchIndex` defined on `products` and `farms` with `searchableText` denormalized at write time and filter fields wired**,
so that **Stories 4.2 and 4.5 can serve fast (<500ms p95 per NFR4) search and filter results without an external search service at MVP, and the escalation point to Algolia/Typesense at Growth is a clean swap**.

**Acceptance Criteria:**

**Given** the products and farms tables exist (Epic 3 Story 3.3 + Story 3.2)
**When** the developer adds `searchableText` to both schemas + `searchIndex` definitions per AR10
**Then** `products.searchIndex("by_text", { searchField: "searchableText", filterFields: ["category", "subcategory", "vendorState", "vendorCity", "practices", "certifications", "fulfillmentMethods", "status"] })` is defined
**And** `farms.searchIndex("by_text", { searchField: "searchableText", filterFields: ["state", "city", "practices", "certifications", "status"] })` is defined
**And** a schema-level comment documents the Growth-phase escalation to Algolia or Typesense if `<500ms p95 NFR4>` is missed at pilot scale.

**Given** Epic 3 mutations write products and farms
**When** product create/update mutations run (Story 3.3) and farm profile updates run (Story 3.2)
**Then** `searchableText` is denormalized at write time from: product name + description + category + subcategory + practices + certifications + farm name + farm city for products; farm name + city + state + practices + certifications + story for farms
**And** `vendorState`, `vendorCity`, `practices`, `certifications` filter fields are populated from the vendor's `organizations` row (denormalized; updated by a subscriber when the farm profile changes via `vendor.profileUpdated` event from Story 3.2).

**Given** any pre-existing rows from dev/qa testing
**When** the developer runs the one-shot backfill action `products.internal.backfillSearchableText` and `farms.internal.backfillSearchableText`
**Then** the action paginates through the tables and populates `searchableText` on every existing row idempotently
**And** the backfill is gated to `internalMutation` (not vendor-callable).

**Given** searchable filters
**When** unit tests run via `convex-test`
**Then** tests cover: searching for `"sourdough"` returns only published cottage-food products containing "sourdough" in name/description; filtering `vendorState: "FL"` excludes a TX vendor's products; filtering `practices: ["pastured"]` returns only pastured products; filtering `status: "draft"` is forbidden on the public query (only `published` is allowed)
**And** the `Protects:` block asserts "denormalization keeps searchableText current after farm profile updates" — intentional-break check: removing the subscriber that re-syncs on `vendor.profileUpdated` causes the assertion to fail.

**Given** performance NFR4
**When** a typical query (single-state scope, <10 facets) runs
**Then** the search returns within 500ms at p95 in QA tier with seeded data of 200 products across 50 farms
**And** the test harness asserts the latency.

### Story 4.2: Marketplace browse page (FR1)

As **a curious customer (Sarah)**,
I want **to land on the marketplace browse page and filter by product category, farm name, location, certification, and farming practice — anonymously, with no signup wall — and see editorial product cards that show me named producers with their cert badges and locations**,
so that **I can find what I'm looking for in under 90 seconds (the returning-user speed target), I can share or bookmark a filtered view via URL, and I can use the back button without losing my filter state**.

**Acceptance Criteria:**

**Given** the search infrastructure exists
**When** the developer creates `apps/marketplace/app/(storefront)/products/page.tsx` (Server Component with `preloadQuery`) and `app/(storefront)/products/ProductBrowseClient.tsx` (Client Component with `usePreloadedQuery`)
**Then** the page renders within Epic 1's site shell with a 3/2/1 editorial grid (UX-DR37) — 3 columns desktop, 2 tablet, 1 mobile — using `ProductCard` editorial variant (UX-DR15)
**And** a persistent left `FilterRail` (UX-DR35, 256px) on desktop; on tablet/mobile a filter Sheet opens via a "Filters" button
**And** filter groups are collapsible, expanded by default for top 3 (Location, Category, Certifications); other groups (Farm name search, Practice) are collapsed by default
**And** "Clear all filters" CTA at the top of the rail
**And** the page is added to `proxy.ts publicRoutes` (anonymous-accessible).

**Given** filter state and URL reflection (per AR36)
**When** the customer applies filters
**Then** the URL updates with camelCase search params (`?category=eggs&practices=pastured&certifications=usdaOrganic&state=FL&city=sarasota&radius=25`)
**And** the back button restores the previous filter combination cleanly
**And** sharing the URL produces the same filtered view for another visitor
**And** filter state persists across page navigation within the session.

**Given** Cache Components (per AR32)
**When** the page renders
**Then** the empty/default browse view (no filters applied) is `use cache`-tagged with `catalog` (short TTL)
**And** filtered views are not cached (filter combinatorics make caching uneconomical)
**And** Epic 3 Story 3.3's product publish/unpublish mutations call `revalidateTag('catalog')` so the unfiltered view picks up newly published products within seconds.

**Given** location filtering
**When** the customer enters a zip and a radius (5/10/25/50 miles)
**Then** the filter restricts results to vendors whose city is within that radius of the entered zip (using a static city-to-coordinates dataset for MVP; refines to a geocoding service at Growth if needed)
**And** vendors who ship nationally show up regardless of location filter (with a "ships nationally" badge on the card)
**And** vendors restricted to in-state shipping (per Epic 2 Story 2.1's FL cottage-food default) only show up when the customer's filter state matches.

**Given** an empty result state
**When** the customer's filter combination produces no products
**Then** an `EmptyState` (UX-DR28) appears: "No products match these filters" with suggestions: "Try expanding your radius / browsing all eggs in Florida / clearing filters"
**And** the empty state is never a dead end (UX-DR28 — actionable CTAs always present).

**Given** SEO indexability per FR6
**When** an unfiltered or category-only view renders
**Then** Schema.org `BreadcrumbList` + `ItemList` JSON-LD is present
**And** unique `<title>` and meta description per facet combination (templated)
**And** the page is server-rendered with full HTML for crawlers.

**Given** Playwright E2E with `Protects:` block
**When** the test runs filter → URL → back-button → filter again on Mobile Safari at 320px
**Then** filter state persists correctly through navigation
**And** the filter Sheet works at 320px (UX-DR6 floor)
**And** axe-core passes WCAG 2.1 AA on the browse page in light + dark modes
**And** intentional-break check: removing the URL search-params sync causes the back-button assertion to fail.

### Story 4.3: Farm profile page (FR2 + structured data per FR6)

As **a customer**,
I want **to land on a farm's profile page (`/farms/<slug>`) and see a magazine-spread editorial layout — full-bleed hero photo, farm name + farmer attribution overlapping the hero, trust-signal stats, the farmer's story with optional quote, fulfillment summary, and the farm's current products**,
so that **I can resolve "who made this and how do I trust them?" in one click, I see verified third-party certifications linking to issuing bodies, and I can save the farm or browse its products without losing the editorial register that signals real-place real-people**.

**Acceptance Criteria:**

**Given** the farm profile data model from Epic 3 Story 3.2 exists
**When** the developer creates `apps/marketplace/app/(storefront)/farms/[slug]/page.tsx`
**Then** the page is a Server Component with `preloadQuery` (per AR30) using the slug to load the farm
**And** the layout follows UX-DR38 magazine spread: full-bleed hero photo (21:9 desktop, 4:3 mobile) → `FarmProfileHeader` (UX-DR16) profile card overlapping the hero with eyebrow + farm name + farmer attribution + cert badges + Save-farm heart button (Story 4.7) → `FarmTrustStats` (UX-DR17) trust-signal row → asymmetric story section with optional farmer quote and secondary photo → fulfillment summary → this farm's products grid (`ProductCard` editorial variant)
**And** the page is added to `proxy.ts publicRoutes`.

**Given** address granularity from Epic 3 Story 3.2
**When** the farm has `addressGranularity: "city_only"` (e.g., a cottage-food at-home vendor)
**Then** the public render shows only "Plant City, FL" — never the full street address
**And** Schema.org `LocalBusiness` JSON-LD includes only the granularity the vendor has chosen — `geo` coordinates omitted for `city_only` / `region_only`
**And** the contact form respects the vendor's contact preferences (email-form / in-app-message / phone — only those chosen).

**Given** trust-signal stats (UX-DR17)
**When** `FarmTrustStats` renders
**Then** the four cells show: "On Farm2Table since `<month-year>`", "Permit status `<verified | expiring soon | expired>`", "Reorder rate `<%>`", "Cancellation rate `<%>`"
**And** with <30 orders the reorder/cancellation cells suppress to "Not enough data yet" (UX-DR17 low-data suppression)
**And** if the vendor's permit expires in <30 days (data from Epic 8 Story 8.5's expiry tracking), the permit-status cell shows "Expiring in N days" with `--warning` color + text label (color is never the only signal per UX-DR7).

**Given** cert badges per FR5 (full wiring in Story 4.6)
**When** the profile renders
**Then** each `CertBadge` shows the cert name with text + dot, has an `aria-label` describing the cert + that the link opens the issuing authority's verification page, and is keyboard-reachable.

**Given** SEO indexability per FR6
**When** the page server-renders
**Then** `LocalBusiness` JSON-LD includes name, address (per granularity), telephone (if vendor opted in), opening hours (derived from pickup-window day-of-week availability from Epic 3 Story 3.5), and `aggregateRating` (omitted at MVP; added in Growth when reviews land)
**And** `BreadcrumbList` JSON-LD includes "Home > Farms > <state> > <farm name>"
**And** unique `<title>` and meta description: "<Farm name> — <city>, <state> — Farm2Table"
**And** the page is in the auto-generated `farms.xml` sitemap.

**Given** save-farm heart button
**When** an anonymous customer clicks the heart
**Then** they're prompted to sign in via Epic 1's auth flow with `redirect_to=/farms/<slug>` so they return to the same page after sign-in
**And** an authenticated customer's click optimistically toggles the heart (filled / unfilled) and writes to `savedFarms` from Story 4.7.

**Given** vendor-currently-paused state (UX-DR16 state)
**When** the vendor's `organizations.status === "suspended"` (Epic 8 enforcement) or all their products are unpublished
**Then** the profile page renders with a clear "Currently not accepting orders" banner instead of the products grid
**And** the page is still indexable (suspended vendors aren't deindexed) but Add-to-Cart actions are disabled.

**Given** Playwright E2E with `Protects:` block
**When** the test loads a farm profile on Mobile Safari at 320px and tabs through every interactive element
**Then** layout collapses cleanly to the 4:3 hero + 40px overlap pattern
**And** axe-core passes (semantic `<article>`, `<h1>` is the farm name, hero photo has alt text from farm name + scene)
**And** intentional-break check: removing the address-granularity respect causes the assertion to fail (full address leaks through).

### Story 4.4: Product detail page (FR3 + structured data per FR6)

As **a customer**,
I want **to view a product's detail page with photo on the left, info on the right (or stacked on mobile), showing the vendor name (linkable to their farm profile), price, available variants, fulfillment options preview, traceability fields the vendor provides, and applicable certifications with verification links**,
so that **I have full provenance density before adding to cart, I can navigate back to the farm to see other products, and the page indexes in search results for queries like "pastured eggs Sarasota"**.

**Acceptance Criteria:**

**Given** the products data model from Epic 3 Story 3.3 exists
**When** the developer creates `apps/marketplace/app/(storefront)/products/[productId]/page.tsx`
**Then** the page is a Server Component with `preloadQuery`
**And** the layout follows UX-DR39: photo-left + info-right at desktop, stacked at mobile (Filson register)
**And** the page is added to `proxy.ts publicRoutes`.

**Given** the page renders
**When** the customer views it
**Then** the info column shows: vendor name (linked to `/farms/<slug>`), product name (Fraunces), price + variant selector (variants from Epic 3 Story 3.3, weight-based pricing rendered correctly), description (markdown), traceability fields when present (lot/batch/harvest date/pack date), labeling fields (ingredients, allergens, disclaimers — required for FL cottage-food per Epic 2 Story 2.4 attestation), cert badges (`CertBadge` from Epic 1 Story 1.7 + Story 4.6 verification linking), per-vendor cancellation cutoff displayed (FR39, from Epic 3 Story 3.5).

**Given** fulfillment options preview
**When** the page renders
**Then** the customer sees the methods this vendor offers for this product: pickup at farm with day-of-week availability summary, local delivery if customer's saved zip (or geolocated zip) is in the vendor's coverage with the fee, shipping to customer's saved state if eligible with the fee
**And** if the customer has no saved location, a generic "Pickup at <city, state> · Local delivery · Ships to <N> states" summary shows
**And** the actual selection happens at checkout (Epic 5 Story 5.4) — this is a preview only.

**Given** Add-to-Cart visual button (Decision A from epic breakdown)
**When** the customer clicks "Add to Cart" at this stage (before Epic 5 ships)
**Then** a Toast appears: "Cart launches in next release — for now, you can save this farm to find it later"
**And** the button is fully keyboard-accessible and announces correctly to screen readers
**And** Epic 5 Story 5.1 will replace the toast handler with the actual `cart.mutations.addItem` call without changing the visual button.

**Given** SEO indexability per FR6
**When** the page server-renders
**Then** `Product` + `Offer` JSON-LD includes name, description, image URLs, brand (= farm name), category, price, priceCurrency, availability (`InStock` / `OutOfStock` from Epic 3 Story 3.4 inventory), and shipping info where applicable
**And** `BreadcrumbList` JSON-LD includes "Home > Products > <category> > <product>"
**And** unique `<title>` and meta description: "<Product> from <Farm> — Farm2Table"
**And** the page is in the auto-generated `products.xml` sitemap.

**Given** out-of-stock variant (Epic 3 Story 3.4)
**When** all variants of a product are sold out
**Then** the page shows the product but the Add-to-Cart button is disabled with a clear "Out of stock — save this farm for back-in-stock alerts" alternate CTA
**And** Schema.org `Offer` reflects `OutOfStock` so search engines can de-prioritize accordingly
**And** the substitute-suggestion pattern (Epic 6 Story 6.6) doesn't fire here yet — sub suggestions are scoped to vendor-cancellation flow, not browse out-of-stock at MVP.

**Given** Playwright E2E with `Protects:` block
**When** the product page test runs on all five browser projects
**Then** layout collapses cleanly at 320px, the variant selector is keyboard-reachable with arrow-key navigation
**And** axe-core passes (semantic structure, alt text, focus rings)
**And** intentional-break check: removing the labeling-fields render causes the FL-cottage-food-disclosure assertion to fail.

### Story 4.5: Geo-targeted SEO landing pages (FR4)

As **a curious visitor searching Google for "buy pastured eggs Sarasota"**,
I want **to land on a Farm2Table page that lists local Sarasota farms offering pastured eggs, with structured data so the page ranks in local search results**,
so that **the marketplace's organic acquisition strategy works (the wedge gets discovered at the moment of intent), I see real local farms rather than warehouse-aggregated "local," and I can click through to the farm I find most compelling**.

**Acceptance Criteria:**

**Given** the search infrastructure exists
**When** the developer creates `apps/marketplace/app/(storefront)/local/[city]/[product]/page.tsx`
**Then** the page is a Server Component with `preloadQuery` and `use cache` (per AR32) tagged with `catalog:<city>:<product>`
**And** the page lists farms in the city offering the product, each with `ProductCard`-style summary (farm name, location, distance from city center, cert badges, fulfillment options, price)
**And** the page is added to `proxy.ts publicRoutes`.

**Given** the URL pattern
**When** routes are generated
**Then** URLs follow the architecture's pattern: `/local/sarasota/eggs`, `/local/sarasota/raw-honey`, `/local/gainesville/sourdough` — lowercase, hyphenated, semantic per the PRD's Web App Specific Requirements §SEO strategy
**And** product names map to URL-friendly slugs from a curated taxonomy (slug + display name pairs in `packages/seed-data/`) so `/local/sarasota/pastured-eggs` and `/local/sarasota/eggs` route consistently
**And** city slugs use canonical lowercase (e.g., `tampa-bay-sarasota` for the multi-city metro at MVP launch).

**Given** Cache Components invalidation
**When** Epic 3 Story 3.3 publishes a new product matching a city × product combo
**Then** the relevant `revalidateTag('catalog:<city>:<product>')` fires
**And** the geo landing page picks up the new farm/product within seconds.

**Given** SEO indexability per FR6
**When** the page server-renders
**Then** Schema.org `BreadcrumbList` ("Home > Local > Sarasota > Eggs") + `ItemList` JSON-LD enumerating the listed farm/product offerings
**And** unique `<title>` and meta description templated from city + product: "Buy pastured eggs in Sarasota — Local farms on Farm2Table"
**And** an auto-generated `local-pages.xml` sitemap is submitted to Google Search Console + Bing Webmaster (NFR55 traceability — sitemap-submission status visible on the admin dashboard from Epic 8).

**Given** an empty result for a (city, product) combo
**When** no vendors offer the product in the city
**Then** the page does not render a 404; instead it renders `EmptyState` with: "No farms in Sarasota currently offer pastured eggs. Browse all pastured eggs across nearby cities, or tell us where to launch next" — links to the broader browse and to FR49's launch-interest form (Epic 7)
**And** the page is `noindex` in this state to avoid thin-content SEO penalties.

**Given** Playwright E2E with `Protects:` block
**When** the geo landing page test runs end-to-end
**Then** the test verifies: Schema.org JSON-LD validates against schema.org's structured-data testing tool; the empty state renders with `noindex` meta tag; revalidation works when a product is published; intentional-break check confirms the city-scope filter is actually applied (commenting it out causes a FL-egg vendor in Tampa to leak into a Sarasota geo page).

### Story 4.6: Cert badge filter + verification linking (FR5)

As **a customer who cares about provenance**,
I want **to filter the marketplace by third-party certifications (USDA Organic, Animal Welfare Approved, Certified Naturally Grown, etc.) and tap a cert badge anywhere on the site to verify it with the issuing authority**,
so that **I can find products from farms with the credentials I trust, and "verified" actually means something — not a marketing graphic**.

**Acceptance Criteria:**

**Given** the curated cert-list seed data
**When** the developer creates `packages/seed-data/src/definitions/certifications.ts`
**Then** the seed data enumerates cert definitions with `slug`, `displayName`, `issuingBody`, `verificationUrlPattern` (URL template parameterized by the vendor's claimed cert ID), `verificationApiUrl?` (where API exists, used in Growth FR53)
**And** the initial set covers: USDA Organic, Animal Welfare Approved (AWA), Certified Naturally Grown (CNG), Real Organic Project, Regenerative Organic Certified, Demeter (Biodynamic), Non-GMO Project Verified, plus state-level certs as relevant.

**Given** Story 4.2 browse filter rail
**When** the developer wires the `certifications` filter group into `FilterRail`
**Then** the filter shows the curated cert list with checkboxes; selections update the URL search param (`?certifications=usdaOrganic,awa`) and filter the result set via the Convex `searchIndex` filterField
**And** the filter group is one of the three top-3 expanded-by-default groups per UX-DR35.

**Given** `CertBadge` component from Epic 1 Story 1.7
**When** the badge renders on `ProductCard` (4.2), `FarmProfileHeader` (4.3), or `ProductDetail` (4.4)
**Then** tap/click opens the issuing authority's verification page in a new tab using `verificationUrlPattern` populated with the vendor's claimed cert ID from Epic 3 Story 3.2
**And** hover (desktop) shows a tooltip: "<Cert name> verifies <one-line meaning>. Click to verify with <issuing body>."
**And** keyboard focus + Enter opens the same link with focus restored to the badge on tab return.

**Given** unverified-claim state
**When** a vendor has claimed a cert but the verification linking is broken (e.g., 404 from the issuing body, vendor's claimed ID is malformed)
**Then** the badge renders with a yellow "Claimed — verification link unavailable" state and the click goes to a Farm2Table explainer page rather than the broken external link
**And** an admin alert is queued (Epic 8 dashboard surfaces these for manual review)
**And** the cert is NOT excluded from filter results — it shows but the customer is forewarned.

**Given** screen reader semantics (UX-DR11)
**When** a screen reader encounters a `CertBadge`
**Then** the announced text is "USDA Organic certification — verifies that this farm meets USDA Organic standards. Link opens USDA's verification page in a new tab."
**And** keyboard navigation reaches every badge in tab order.

**Given** Playwright E2E with `Protects:` block
**When** the test exercises filter → URL → click-through-to-issuing-body
**Then** the URL reflects the filter selection; the click opens a new tab with the correct issuing-body URL (test asserts the URL pattern, doesn't require live external response); the keyboard-focus restoration works
**And** axe-core passes on the filter rail
**And** intentional-break check: making the verification URL a no-op causes the assertion to fail.

### Story 4.7: Saved farms list (FR7)

As **a customer**,
I want **a heart button on every farm I see (in browse, on farm profiles, on product cards) to save it to my saved-farms list, plus a `/saved-farms` page in my account showing my saved farms with their latest products, and an option to receive emails when a saved farm publishes new products**,
so that **I can build a personal pantry of farms I want to come back to, the second-cart speed target (under 90 seconds returning) becomes possible because I'm one tap away from my favorites, and I find out when my favorite farms have new products without having to remember to check**.

**Acceptance Criteria:**

**Given** the customer accounts data model from Epic 1 Story 1.9 exists
**When** the developer adds `savedFarms` table with composite key (`userId`, `vendorId`), `savedAt`
**Then** an index `by_user` enables fast load of a customer's saved-farms list
**And** an index `by_vendor` enables the email subscriber to fan out to all customers who saved a vendor when that vendor publishes a new product.

**Given** the heart-button trigger on browse and farm profile
**When** an anonymous customer clicks the heart on `ProductCard` (4.2), `FarmProfileHeader` (4.3), or `ProductDetail` (4.4)
**Then** the page redirects to Epic 1's sign-up/sign-in flow with `redirect_to=<original-page-url>`
**And** after sign-in completes, the customer returns to the original page with the heart immediately filled (the save is queued via session and committed post-auth so they don't have to click again)
**And** an authenticated customer's click optimistically toggles the heart (filled ↔ unfilled) and writes to `savedFarms` via Convex `customerMutation`.

**Given** the saved-farms list page
**When** the developer creates `apps/marketplace/app/(customer)/saved-farms/page.tsx`
**Then** the page is auth-gated (not in `publicRoutes`) and shows the customer's saved farms with their latest 3 published products each, a fulfillment summary per farm, and an "unsave" action
**And** an empty state encourages the customer to browse: "Save farms you love and they'll appear here" (UX-DR28 actionable CTA — UX-DR42 customer account minimal tabs).

**Given** the email subscriber for new products
**When** Epic 3 Story 3.3 publishes a product
**Then** the `product.published` domain event fires
**And** a subscriber in `convex/domainEvents/emailSubscribers/savedFarmEmails.ts` queries `savedFarms.by_vendor` to find customers who saved this vendor
**And** for each customer, schedules a `SavedFarmNewProduct` email **only if** that customer's `lifecycleEmailOptIn` flag is true (per UX-DR56 three-tier notification model — saved-farm new-product alerts are lifecycle/opt-in, off by default)
**And** the email batches if multiple products from the same farm publish within an hour (avoid spam) — single email with N products listed.

**Given** in-app notification (always-on per UX-DR56)
**When** the same `product.published` event fires
**Then** an in-app `notifications` row is written for every customer who saved this vendor (even if their email opt-in is off)
**And** the bell-icon count in `SiteHeader` from Epic 1 Story 1.8 reflects unread notifications (the actual `NotificationCenter` UI component is wired in Epic 6 Story 6.3; this story writes the data so the count is correct from launch).

**Given** account deletion (Epic 7 Story 7.3)
**When** a customer deletes their account
**Then** their `savedFarms` rows are hard-deleted along with the user (NFR23 customer data purge)
**And** the audit log records the deletion via the subscriber pattern.

**Given** Playwright E2E with `Protects:` block
**When** the test runs anonymous-save-redirect-signin-return → save persists → unsave → re-save
**Then** the save state persists across the auth redirect; the heart toggles correctly; the `/saved-farms` page reflects current state; intentional-break check confirms the `redirect_to` carries through Clerk's auth flow (commenting it out causes the customer to land on `/account` instead of the original page).

**Given** notification opt-in defaults
**When** a customer signs up via Epic 1 Story 1.9 with the lifecycle-emails checkbox unchecked
**Then** they don't receive saved-farm new-product emails until they opt in via account settings (Epic 7 Story 7.4 wires that toggle)
**And** in-app notifications still fire (per UX-DR56 — in-app is always-on for lifecycle tier).

## Epic 5: Multi-Vendor Cart & Checkout (the wedge)

A customer adds items from multiple farms to a single cart with no "switch carts" wall, sees a clean per-farm grouping with a first-time hint, edits the cart through a slide-over Sheet or a dedicated `/cart` page, captures their email at checkout-start, picks per-vendor fulfillment (pickup window / local-delivery zip / shipping by state), sees per-line tax computed via Stripe Tax with PTC mapping across multiple states from day one, completes a single Stripe Connect split payment, and lands on a confirmation page showing the "Your week" plan view with per-vendor sub-receipts. Each vendor receives their own per-vendor confirmation email. Per-line refunds reverse splits without affecting other vendors. Vendors are paid 7 days after delivery confirmation. Stripe webhooks for payment, refund, dispute, and transfer events flow through the idempotent dispatcher established in Epic 2.

### Story 5.1: Cart data model + Add-to-Cart + MultiFarmCart UI (sheet + page) (FR8)

As **a customer (anonymous or authenticated)**,
I want **to add items from multiple farms into a single cart that visually groups by farm with a smooth 200ms grouping animation when I add my first item from a new farm, edit quantities or remove or save-for-later, and access the cart either via a slide-over Sheet (quick edit) or a dedicated `/cart` page (review)**,
so that **the wedge interaction works on first try without a "switch carts" fork in the road, the multi-vendor mental model is taught by the layout itself rather than a tutorial, and my cart persists across sessions whether or not I'm signed in**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer adds the AR7 schema (`carts` with `sessionId?`, `userId?`, `createdAt`, `updatedAt`, `abandonedAt?`, `email?`, `emailSource?`, `emailCapturedAt?`, `abandonmentEmailSentAt?`, `unsubscribedFromCartEmails?`; `cartItems` with `cartId`, `productId`, `variantId?`, `vendorId`, `quantity`, `unitPriceSnapshot`, `addedAt`, `availability`; `cartFulfillmentChoices` with `cartId`, `vendorId`, `fulfillmentMethod`, `fulfillmentDetails`)
**Then** indexes `by_session`, `by_user`, `by_cart`, `by_cart_vendor` are defined
**And** anonymous cart cookie is set: `httpOnly`, `secure`, `sameSite=lax`, sliding 30-day Max-Age, named `f2t_session`.

**Given** the cart schema exists
**When** the developer creates the `MultiFarmCart` component in `packages/ui/components/MultiFarmCart/` per UX-DR12
**Then** the component supports both `sheet` (slide-over right at desktop, full-screen at mobile) and `page` (`/cart` route) variants
**And** renders cart header (item count + farm count), first-time multi-farm hint banner (dismissable, never re-shown after dismissal — persisted per-customer or per-session), farm groups (each with farm header + fulfillment status pill + line items with quantity stepper + remove + save-for-later), totals, CTAs
**And** UX states are exercised: empty / single-farm / multi-farm (first-time hint) / multi-farm (returning) / out-of-stock-on-line / cutoff-passed-on-line / restricted-state-on-line / loading.

**Given** Add-to-Cart wiring
**When** the developer wires `cart.mutations.addItem({ productId, variantId?, quantity })` from `apps/marketplace/app/(storefront)/products/[productId]/page.tsx` (replacing Epic 4 Story 4.4's toast stub)
**Then** the mutation creates a cart row on first add (anonymous: keyed by `sessionId` from the cookie; authenticated: keyed by `userId`), appends or increments the corresponding `cartItems` row, takes a `unitPriceSnapshot` so subsequent price changes don't surprise the customer, validates the variant is published and available
**And** the cart icon in `SiteHeader` (Epic 1 Story 1.8) updates with item count + farm count badge
**And** a small toast at viewport-bottom (mobile) / top-right (desktop) confirms: "Added to your <farm name> group · view cart"
**And** if the item is the first from a new farm, the cart sheet's farm-group insertion uses a 200ms ease-out animation (UX-DR5).

**Given** the cart sheet on a returning user
**When** the user clicks the cart icon
**Then** the sheet slides over from the right (desktop) or fills the screen (mobile) within 200ms
**And** items are grouped by farm with the farm header showing name, location, fulfillment-method status pill (`Choose fulfillment` default until checkout)
**And** quantity stepper has min 1, max derived from inventory (Epic 3 Story 3.4) — disabled if at inventory cap
**And** save-for-later moves the item to a separate "Saved" section within the sheet (per-cart, anonymous-OK)
**And** the sheet has focus trap with `Esc` to close.

**Given** the `/cart` page variant
**When** the customer navigates to `/cart`
**Then** the same component renders as a full page within Epic 1's site shell with the same farm-group structure
**And** `/cart` is added to `proxy.ts publicRoutes` (anonymous-accessible).

**Given** edge-case states
**When** an item in the cart goes out of stock (Epic 3 Story 3.4 emits `inventory.soldOut`)
**Then** the line greys with substitute suggestion adjacent (substitute matching engine wired in Epic 6 Story 6.6 — at this story the suggestion shows a placeholder "Other vendors carrying this product" pulling from a category-match Convex query); customer can keep for later, remove and replace, or remove
**And** when a vendor's per-product cancellation cutoff has passed (Epic 3 Story 3.5), the line shows soonest-next-available date with "save for later" or "remove"
**And** when shipping is restricted to the customer's state (FL cottage food → out of state, per Epic 2 Story 2.1's rules-engine default), the line shows the restriction reason inline + alternative same-product vendors who can ship.

**Given** screen reader semantics (UX-DR11)
**When** the cart composition changes
**Then** `aria-live="polite"` announces: "Item added. Cart now has 5 items from 3 farms"
**And** every interactive element is keyboard-reachable.

**Given** Playwright E2E with `Protects:` block
**When** a test runs the wedge flow on Mobile Safari at 320px (anonymous → add from Vendor A → add from Vendor B with first-time hint → save one item for later → remove one → reach `/cart` → continue to checkout stub)
**Then** the cart persists across page navigation and tab close-reopen (cookie); the first-time hint shows only on the first multi-farm transition; the farm-grouping animation runs at 200ms (or instant under `prefers-reduced-motion`)
**And** axe-core passes WCAG 2.1 AA on the cart sheet and `/cart` page in light + dark modes
**And** intentional-break check: removing the per-farm grouping logic causes the multi-vendor visualization assertion to fail.

### Story 5.2: Authenticated cart merge + abandonment data capture

As **a customer who built up an anonymous cart and then signed in (or signed up) at checkout**,
I want **my anonymous cart items to merge cleanly into my authenticated cart with no items lost and no duplicates**,
so that **the friction of having to start over after sign-in doesn't push me to abandon, and my cart is the same cart whether or not I'm signed in**.

**Acceptance Criteria:**

**Given** the cart schema and Clerk → Convex sync (Story 1.5) exist
**When** an anonymous customer (with a non-empty cart keyed by `sessionId`) signs in or signs up
**Then** the Clerk webhook handler dispatches to a Convex internal mutation `cart.internal.mergeOnSignIn({ sessionId, userId })`
**And** the mutation runs the AR7 merge logic: sums quantities for the same `productId × variantId × vendorId` triple; takes the most-recent `addedAt` per item; takes the most-recent `cartFulfillmentChoices` row per vendor on conflict; takes the latest `unitPriceSnapshot` (with a "prices may have changed" banner shown to the customer post-merge)
**And** the anonymous cart cookie is cleared after a successful merge.

**Given** the merge operates idempotently
**When** the same merge fires twice (e.g., webhook retry)
**Then** no duplicate items are created (idempotency keyed on `(sessionId, userId)` pair recorded in the merge action)
**And** the audit log records the merge for support traceability.

**Given** post-merge price-change handling
**When** a merged item's current price differs from its snapshot
**Then** the cart sheet/page renders a non-blocking banner at the top: "Prices on 2 items have changed since you added them — review before checkout"
**And** each affected line shows old price struck through and new price next to it
**And** the customer can dismiss the banner to confirm acceptance.

**Given** abandonment data capture (AR7)
**When** a cart row has no `cartItems` activity for 7 days
**Then** a daily cron sets `abandonedAt: now` on the cart
**And** at 30 days idle (anonymous) the cart is hard-purged via the cron
**And** authenticated carts persist indefinitely while account active (purged on account deletion per Epic 7 Story 7.3 + NFR23)
**And** **email *delivery* for abandonment is deferred to Growth** — schema captures `abandonedAt`, `abandonmentEmailSentAt`, `unsubscribedFromCartEmails` now; Growth flips on the cron that sends emails.

**Given** the email-delivery deferral
**When** the developer adds the cron
**Then** the cron writes the `abandonedAt` timestamp but does NOT call the email pipeline at MVP
**And** a code comment + AGENTS.md note documents the deferral and points to the Growth-phase activation procedure (just enable the email-send call).

**Given** Playwright E2E with `Protects:` block
**When** the test runs anonymous cart → sign-in → cart merge → no duplicates → price-change banner if applicable
**Then** the merge completes in <2 seconds for a cart of 10 items across 3 vendors
**And** intentional-break check: removing the dedup logic causes a duplication assertion to fail.

### Story 5.3: Checkout step 1 — per-vendor fulfillment selection (FR9)

As **a customer at checkout**,
I want **to pick fulfillment method per farm — pickup at the farm with a day-of-week + time-window picker, vendor-run local delivery if my zip is in their coverage with the fee shown, vendor-run shipping if they ship and my state is allowed — without leaving the checkout page**,
so that **I make these decisions inline (the hardest single screen in the product per the PRD), I see the consequences of each choice (fees, dates) immediately, and the multi-pickup reality feels like a "weekly plan" rather than five separate flows**.

**Acceptance Criteria:**

**Given** the cart from Story 5.1 and Epic 3 Story 3.5's vendor fulfillment config exist
**When** the developer creates `apps/marketplace/app/checkout/page.tsx`
**Then** the page is a single-page accordion (UX-DR41) with a section per farm group from the cart
**And** each section uses `FarmFulfillmentSelector` (UX-DR13) — farm header → status line → option cards (pickup / local delivery / shipping — only what vendor offers) → conditional sub-controls
**And** the page is added to `proxy.ts publicRoutes` (anonymous customers can reach checkout, but they're prompted for email at checkout-start and routed to sign-in/sign-up after).

**Given** email capture at checkout-start (AR7)
**When** an anonymous customer reaches checkout
**Then** the first interaction is a single-field `EmailCaptureField` ("Where should we send your confirmation?") that writes `email` and `emailSource: "checkout_start"` to the cart row
**And** an authenticated customer skips this field (their email is already known)
**And** the field validates email format on blur per UX-DR9 (form patterns).

**Given** pickup option
**When** the customer selects pickup at a farm
**Then** `PickupWindowPicker` (UX-DR14) renders a horizontal scroll of day chips for the next 14 days with vendor-available days highlighted (from Epic 3 Story 3.5 `vendorFulfillmentConfig.pickup.dayOfWeekAvailability`)
**And** selecting a day reveals the vendor's time windows for that day; the customer selects one
**And** the pickup address is shown (respecting the farm's `addressGranularity` from Epic 3 Story 3.2 — full address on checkout for the customer to actually go to)
**And** the cancellation cutoff is shown ("Cancel until 24h before pickup").

**Given** local-delivery option
**When** the customer selects local delivery
**Then** the selector shows a zip-code field (defaulting to the customer's saved zip if present) and validates against the vendor's `vendorFulfillmentConfig.localDelivery.zipCodes` from Epic 3 Story 3.5
**And** a valid zip shows the fee and earliest delivery date; an invalid zip shows "Out of <vendor>'s delivery zone — try pickup or shipping"
**And** the delivery address (collected once at the page top if any line is local-delivery, defaults to shipping address if any line ships) flows into the order.

**Given** shipping option
**When** the customer selects shipping
**Then** the selector validates the customer's destination state against the vendor's `vendorFulfillmentConfig.shipping.stateCoverage`
**And** for restricted vendors (e.g., FL cottage-food → out of state), the option doesn't appear or shows the restriction reason inline
**And** the shipping fee + packaging method (insulated cooler / dry ice / room temp) is shown.

**Given** sticky order summary (UX-DR41)
**When** the page renders on desktop
**Then** an order summary right rail shows: item count, farm count, subtotal per farm, fulfillment fees per farm, running grand total (tax in Story 5.4, payment in Story 5.5)
**And** at mobile the summary collapses to top + a sticky-bottom Continue CTA
**And** "Your week" preview (UX-DR25 `WeeklyPlanView`) renders below the summary showing the customer's pickups/deliveries/shipments laid out across the next 14 days as the customer makes selections.

**Given** validation gating
**When** the customer attempts to continue with any farm group having no fulfillment selected
**Then** an inline error highlights the missing groups
**And** the Continue button is enabled (UX-DR9 — submit button never disables) but clicking it scrolls to the first invalid group and announces the validation failure to assistive tech.

**Given** Playwright E2E with `Protects:` block
**When** a test runs the fulfillment selection on Mobile Safari at 320px with a 3-vendor cart (one pickup, one delivery, one ship)
**Then** all three options surface their right sub-controls; the weekly plan view updates as selections change; the sticky bottom CTA is visible across viewport heights (the iOS Safari address-bar quirk per UX-DR58 is handled correctly)
**And** axe-core passes
**And** intentional-break check: removing the rules-engine restricted-shipping check causes a FL cottage-food vendor to incorrectly offer interstate shipping.

### Story 5.4: Checkout step 2 — Stripe Tax with PTC mapping + facilitator threshold monitoring (FR11 + FR12)

As **the platform**,
I want **per-line-item tax calculated via Stripe Tax based on origin × destination × Product Tax Code mapping, applying state grocery exemptions and prepared-food taxability rules, with marketplace facilitator threshold monitoring across all states from day one**,
so that **the platform stays compliant with multi-state marketplace facilitator law (the ~$100K/state threshold, Stripe handling per-jurisdiction calculation), customers see honest itemized tax with no surprises, and the admin gets alerted when a state threshold is approaching so registration can happen before the platform's obligation kicks in**.

**Acceptance Criteria:**

**Given** Stripe Tax is enabled on the platform's Stripe account
**When** the developer creates `packages/backend/convex/products/taxMapping.ts` per AR18
**Then** `PTC_BY_CATEGORY` enumerates the platform's product categories (vegetables, fruits, eggs, dairy, meat, poultry, grains, baked-goods, jams-and-preserves, honey, beverages, snacks, etc.) → Stripe PTC defaults
**And** `PTC_BY_SUBCATEGORY` enumerates the subcategory overrides per the PRD: `beverages-craft-soda` (taxable), `beverages-milk` (grocery-exempt), `snacks-chips` (taxable in some states), etc.
**And** `lookupPTC(category, subcategory?)` returns the right PTC with subcategory taking precedence; defaults to a safe `txcd_99999999` if no mapping exists.

**Given** Stripe Tax integration
**When** Story 5.3's checkout reaches the tax-calculation step
**Then** the platform calls Stripe Tax with per-line-item data: vendor's address (origin from Epic 2's Stripe Connect onboarding), destination (delivery address for shipped/delivered lines, pickup-vendor address for picked-up lines), `stripePTC` (resolved via `lookupPTC` per line at order creation), unit price × quantity
**And** Stripe Tax returns per-jurisdiction tax breakdown which the platform stores per-line in `orderItems.taxAmount`, `orderItems.taxJurisdictions[]`
**And** state-level grocery exemptions and prepared-food rules are honored automatically by Stripe Tax based on the PTC.

**Given** mixed-fulfillment cart
**When** a cart has eggs picked up at the FL farm (origin = vendor address; destination = vendor address — pickup) + raw honey shipped to the FL customer (origin = different FL vendor; destination = customer address — destination-based) + sourdough delivered locally in Sarasota (origin = vendor address; destination = customer address)
**Then** Stripe Tax computes each line's tax based on the right origin × destination × PTC combination per the PRD §Domain-Specific Requirements destination/origin sourcing rules
**And** tax breakdown rendered in the order summary (UX-DR52 itemized) per state with the taxable/exempt distinction visible.

**Given** marketplace facilitator threshold monitoring (FR12)
**When** Stripe Tax surfaces sales totals per state
**Then** a daily Convex cron polls Stripe Tax's per-state sales data and writes to `marketplaceFacilitatorState` table tracking per-state YTD sales, transaction count, threshold values, registration status (`unregistered`, `registration_pending`, `registered`)
**And** when YTD sales reach 80% of a state's threshold (FL: $100K revenue-only; most others: $100K OR 200 transactions), the cron emits `marketplaceFacilitator.thresholdApproaching` event
**And** an email subscriber sends an alert to the admin (Epic 8 surfaces the threshold dashboard); the admin handles registration with the state's revenue department per the runbook (Epic 1 Story 1.16's deployment runbook gets a section added).

**Given** the admin marketplace-facilitator dashboard (Epic 8 surfaces this; this story creates the data)
**When** the admin views per-state status
**Then** they see: state, YTD sales, threshold, % of threshold, registration status, last-updated
**And** the dashboard is queryable on demand for state revenue department audits per NFR65.

**Given** documented runbook (FR12 + AR65)
**When** the developer updates `docs/DEPLOYMENT_RUNBOOK.md`
**Then** a new "Marketplace facilitator registration" section enumerates the registration steps per state (per the PRD's enumeration)
**And** documents the Stripe Tax registration toggle per state
**And** notes that registering is the founder's manual operational task triggered by the threshold-approaching alert.

**Given** Vitest tests with `Protects:` block
**When** they run with sample carts
**Then** tests cover: per-line tax calculation for mixed-fulfillment cart; subcategory override (e.g., a craft-soda product taxable, a milk product grocery-exempt in FL); threshold-approaching event fires when crossing 80%
**And** intentional-break check: removing the destination-based logic for shipped lines causes the FL → TX shipped-honey assertion to fail (tax should be TX rate, not FL).

### Story 5.5: Checkout step 3 — Stripe Connect split payment (FR10)

As **the customer**,
I want **to enter my card (or use Apple Pay / Google Pay), see one charge for the total, and have my payment behind the scenes split across all vendors via Stripe Connect with the platform deducting per-vendor commission and a 4% service fee**,
so that **I pay once, each vendor receives their right share net of fees, and the multi-vendor complexity stays invisible to me**.

**Acceptance Criteria:**

**Given** Stripe is configured with Connect (Epic 2 Story 2.5) and Tax (Story 5.4)
**When** the developer creates `apps/marketplace/lib/stripe-client.ts` initializing Stripe Elements client-only
**Then** Stripe Elements loads in the checkout page as the payment step
**And** Apple Pay / Google Pay are enabled for mobile per UX-DR55
**And** `STRIPE_PUBLISHABLE_KEY` is `NEXT_PUBLIC_*` per AR49 env topology.

**Given** PaymentIntent generation
**When** the customer clicks "Place order"
**Then** a Server Action (`apps/marketplace/app/checkout/actions.ts` per AR39) generates a single PaymentIntent with `transfer_data` per vendor: each vendor's `transfer_data.amount` = (line subtotals + line tax + fulfillment fee) × (1 − 0.22 commission − 0.04 platform fee for Foundation tier)
**And** the platform's `application_fee_amount` aggregates the commission + platform-service-fee components across all vendors
**And** the PaymentIntent's `metadata` includes the cart's `cartId` and the resolved `rulesVersion` per Story 5.4 audit-replay (NFR66).

**Given** the customer confirms the payment via Stripe Elements
**When** Stripe processes the charge
**Then** on success: Story 5.6's order placement runs (triggered by `payment_intent.succeeded` webhook from Story 5.7); the customer is redirected to the confirmation page
**And** on failure: Stripe Elements surfaces the failure inline with a clear message per UX-DR54 ("Your card was declined — try a different card or use Apple Pay") and the customer can retry without losing their cart or fulfillment selections
**And** specific failure codes (insufficient funds, card declined, fraud rule, expired card, incorrect CVC) map to user-friendly messages.

**Given** PCI scope minimization (NFR9)
**When** the customer enters card data
**Then** card data goes only to Stripe Elements (iframed) — never touches Farm2Table infrastructure
**And** the platform handles only Stripe-issued tokens (PaymentIntent ID, last4, brand, expiration)
**And** Sentry event filters strip any card data from any error payload before send.

**Given** test mode in dev/qa
**When** the customer uses Stripe test cards
**Then** test cards `4242 4242 4242 4242` (success), `4000 0000 0000 9995` (insufficient funds), `4000 0025 0000 3155` (3DS auth required) all flow correctly through the checkout
**And** Playwright fixture `stripe.ts` (from Epic 1 Story 1.14) helpers automate the test-card entry.

**Given** Stripe Connect destination accounts
**When** a vendor's `charges_enabled === false` (e.g., compliance hold)
**Then** the platform blocks adding their products to checkout earlier in the flow with a clear message ("This farm isn't currently accepting orders")
**And** the customer sees this state on the cart page before reaching checkout, not at PaymentIntent creation time.

**Given** end-to-end checkout speed target NFR5
**When** Playwright E2E runs a 3-vendor checkout end-to-end
**Then** cart-load → payment-confirmation completes within 8 seconds at p95 inclusive of Stripe round-trips
**And** the test asserts the latency
**And** axe-core passes on the payment step (Stripe Elements iframe excluded from scan since it's Stripe's surface)
**And** intentional-break check: removing the per-vendor `transfer_data` causes a single-account assertion to fail.

### Story 5.6: Order placement + per-vendor sub-receipts + confirmations (FR13)

As **the customer**,
I want **the order to be created when payment succeeds, inventory decremented atomically, one consolidated confirmation email with per-vendor sub-receipts, a confirmation page showing the "Your week" plan view, and each vendor to receive their own confirmation for just their items**,
so that **I have a clear record of what's coming when from whom, my "wait, this works?" moment is the first cart completing cleanly, and each vendor knows immediately what to prepare without sifting through someone else's order**.

**Acceptance Criteria:**

**Given** Story 5.5's PaymentIntent succeeded (via Story 5.7's webhook handler)
**When** the order-placement mutation runs
**Then** AR6 envelope is created atomically: `orders` row (customer-facing envelope: `customerId`, `email`, `placedAt`, `paymentIntentId`, `subtotal`, `taxTotal`, `feeTotal`, `commissionTotal`, `total`, `status: "placed"`); per-vendor `vendorOrders` row (per-vendor slice: `orderId`, `vendorId`, `fulfillmentMethod`, `fulfillmentDetails`, `vendorStatus: "preparing"`, `stripeTransferId`, `vendorSubtotal`, `attributionSource` from Epic 3 Story 3.6); per-line `orderItems` row (`vendorOrderId`, `productId`, `variantId?`, `quantity`, `unitPrice`, `taxAmount`, `taxJurisdictions[]`, `lineStatus: "pending"`, `stripePTC`, `rulesVersion`)
**And** inventory decrement (Epic 3 Story 3.4) runs in the same transaction; if any variant is now insufficient, the entire order creation fails and the PaymentIntent is automatically refunded (rare race condition; logged for admin review).

**Given** the cart is consumed
**When** the order is created
**Then** the `cartItems` are cleared (the `cart` row itself is preserved with `clearedAt` for audit traceability; purged on a longer cron)
**And** `order.placed` and per-vendor `vendorOrder.created` domain events fire (one per vendor in cart).

**Given** email subscribers
**When** `order.placed` fires
**Then** a `OrderConfirmation` template email is sent to the customer via canonical pipeline with per-vendor sub-receipts inline, weekly-plan summary at the top, and total/itemized totals at the bottom
**And** for each `vendorOrder.created`, a `VendorOrderReceived` template email goes to that vendor's owner with **only that vendor's items** — order number, customer name, items, fulfillment method, pickup window or shipping address (per the customer's selection from Story 5.3)
**And** all email sends use `Idempotency-Key: ${eventId}-${emailType}` per Story 1.4 — re-fired events don't double-email.

**Given** the order confirmation page
**When** the customer is redirected to `/checkout/confirmation/[orderId]` after success
**Then** the page renders within the site shell with `WeeklyPlanView` (UX-DR25) at the top showing the customer's week (e.g., "Saturday: Pickup at Frank's Farm 10am · Tuesday: Porch drop from Mike's Sourdough · Thursday: Honey ships from Wesley")
**And** below: per-vendor `OrderSubReceipt` (UX-DR26) blocks with itemized contents, pickup/shipping details, vendor contact info
**And** one-tap "Save this farm" and "Favorite this product" affordances on each block (writes to Story 4.7's `savedFarms` and a new `favoriteProducts` table)
**And** "Order another" CTA routes back to the marketplace home.

**Given** access control on the confirmation page
**When** an unauthenticated customer reaches `/checkout/confirmation/[orderId]` with an email-link parameter
**Then** the page renders for that email's order (anonymous order tracking via signed-URL token, time-limited to 30 days)
**And** an authenticated customer accessing their own order sees the page directly via `customerQuery` auth check.

**Given** Playwright E2E with `Protects:` block
**When** the test runs full checkout end-to-end (cart → fulfillment → tax → payment → order placement → confirmation page) on a 3-vendor cart
**Then** all three sub-receipts render correctly; the weekly plan view shows the right dates and fulfillment methods; the customer email arrives in Resend sandbox with the right HTML; each vendor's email arrives with only their items
**And** axe-core passes on the confirmation page
**And** intentional-break check: removing the per-vendor email fan-out causes the assertion that 3 distinct emails are sent to fail.

### Story 5.7: Stripe webhook payment event handling (FR65 extended)

As **the platform**,
I want **the Stripe webhook idempotency dispatcher (established in Epic 2 Story 2.5) extended to handle the full set of payment-lifecycle events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `charge.dispute.created`, `transfer.created`, `transfer.failed`, `transfer.reversed`, `payout.paid`, `payout.failed`**,
so that **order state, refund state, and payout state stay synchronized with Stripe's authoritative event stream, and the audit trail covers every payment-related state change**.

**Acceptance Criteria:**

**Given** Epic 2 Story 2.5 established the idempotent dispatcher with `account.updated` handling
**When** the developer extends `convex/stripeWebhooks/internal.ts` with payment event handlers
**Then** each handler:
- Atomically idempotency-checks `stripeEventId` (no double-processing per NFR34)
- Updates the relevant Convex row(s) (orders / vendorOrders / orderItems / refunds / payouts)
- Emits the corresponding domain event
- Writes to `auditLog` via the subscriber pattern.

**Given** `payment_intent.succeeded`
**When** the webhook arrives after Story 5.5's customer payment
**Then** the handler triggers Story 5.6's order placement mutation (the order isn't created until the webhook confirms — handles edge cases where Stripe Elements client thinks payment succeeded but webhook says otherwise)
**And** emits `payment.succeeded` event.

**Given** `payment_intent.payment_failed`
**When** the webhook arrives
**Then** the handler updates the cart with the failure metadata
**And** does NOT create an order (the customer can retry)
**And** emits `payment.failed` event with the failure reason
**And** the customer sees the failure inline on the checkout page (the webhook-driven update reaches the client via Convex's reactive query layer).

**Given** `charge.refunded`
**When** the webhook arrives (triggered by Story 5.8's refund or Epic 6 Story 6.5 vendor cancellation refund or Epic 8 Story 8.6 admin refund)
**Then** the handler updates the relevant `orderItems.lineStatus` to `refunded`, sets `orderItems.refundedAt`, `orderItems.refundAmount`
**And** if all `orderItems` for a `vendorOrders` are refunded, `vendorOrders.status` → `cancelled`
**And** emits `payment.refunded` event with the per-line scope.

**Given** `charge.dispute.created`
**When** the webhook arrives
**Then** the handler creates a row in `disputes` table (`orderId`, `vendorOrderId?`, `disputeId`, `amount`, `reason`, `status`, `evidenceDueBy`)
**And** sends a `DisputeOpened` email to the admin with deep link to the dispute in Stripe dashboard
**And** emits `payment.disputed` event
**And** Epic 8 admin queue surfaces disputes with priority.

**Given** `transfer.created` / `transfer.failed` / `transfer.reversed`
**When** these arrive (triggered by Story 5.9 payouts or Story 5.8 refund-driven transfer reversals)
**Then** the handler updates the relevant `vendorOrders.payoutStatus` accordingly
**And** emits `payout.scheduled` / `payout.failed` / `payout.reversed`.

**Given** `payout.paid` / `payout.failed`
**When** these arrive (final payout event from Stripe)
**Then** the handler updates `vendorOrders.paidOutAt` and the vendor's portal dashboard reflects "Paid" status
**And** sends `PayoutCompleted` email to vendor (per Story 5.9).

**Given** webhook replay capability (NFR56)
**When** an admin (Epic 8) replays a stored webhook payload
**Then** the dispatcher re-runs and idempotency prevents double-processing
**And** the replay action is logged with the admin actor.

**Given** Vitest + integration tests with `Protects:` block
**When** they run
**Then** tests cover each event type with a synthetic Stripe payload; idempotency holds across replay; audit log entries match each handler's actions
**And** intentional-break check: removing the idempotency check causes a duplicate-processing assertion to fail.

### Story 5.8: Per-line refunds — batched per `vendorOrder` (FR14)

As **an admin or vendor (depending on initiating actor)**,
I want **to refund one or more lines from a single `vendorOrder` in one batched submission — selecting which lines to refund via checkboxes, picking a reason, and submitting — so that one Stripe API loop runs, one Convex transaction commits all per-line state changes, one batched domain event fires, and the customer receives one consolidated email per vendor cancellation/refund event**,
so that **a customer doesn't get spammed with separate emails when a vendor or admin cancels multiple lines from the same vendor in one decision, the audit trail still records each line's refund as its own atomic Stripe operation, and the per-vendor independence principle (FR14) is preserved (other vendors' lines stay completely unaffected)**.

**Acceptance Criteria:**

**Given** Stories 5.5–5.7 are operational
**When** the developer creates `apps/marketplace/app/admin/orders/[orderId]/actions.ts` (admin Server Action) and `apps/vendor/app/orders/[vendorOrderId]/actions.ts` (vendor Server Action)
**Then** both call the same Convex internal mutation `orders.internal.recordLineRefunds({ vendorOrderId, lineIds[], reason, message?, initiator })` after the Server Action has completed Stripe API calls
**And** the mutation rejects with `appError("order.lines_already_refunded", ...)` if any of the provided lines are already refunded
**And** the mutation rejects with `appError("validation.invalid", "All lines must belong to the same vendorOrder")` if `lineIds[]` spans multiple `vendorOrders` — batching is always per-`vendorOrder`.

**Given** the Server Action receives the batched submission
**When** it runs
**Then** it loops `lineIds[]` calling Stripe `Refund` API per line with idempotency key `${orderItemId}-${initiator}-${batchSubmissionId}` (the batch submission ID is generated server-side per submission so retries within a submission don't double-refund)
**And** if any individual Stripe call fails, the Server Action does NOT call the Convex mutation — the failed call is surfaced to the actor (admin or vendor) inline with retry guidance, and the lines stay in `placed` state for retry
**And** if all Stripe calls succeed, the Server Action calls `recordLineRefunds` with the resulting refund IDs.

**Given** the Convex mutation runs
**When** `recordLineRefunds` executes
**Then** it atomically (within a single Convex transaction):
- Sets each `orderItems.lineStatus: "refund_requested"` (will become `"refunded"` on webhook confirmation per Story 5.7), records `orderItems.refundRequestedAt`, `orderItems.refundReason`, `orderItems.refundInitiator`, `orderItems.stripeRefundId`
- For each line: per-vendor `transfer` reversal for that line's vendor portion + platform `application_fee` partial reversal for that line's commission + service fee share
- Verifies other lines in the same order are completely unaffected (their `transfers` remain, their `lineStatus` remains `placed`)
- Writes per-line audit log entries via the subscriber pattern (NFR61) — one per line for clear regulatory traceability
- Emits **one batched domain event** `vendorOrder.linesRefunded({ vendorOrderId, lineIds[], reason, initiator, isFullVendorOrderRefund })` — `isFullVendorOrderRefund` is true if all active lines in the `vendorOrder` were just refunded
- Emits per-line `payment.refunded` events (so other subscribers like analytics + Stripe-state reconciliation see them) but the email subscriber listens to the **batched event**, not the per-line events.

**Given** customer notification
**When** the batched `vendorOrder.linesRefunded` event fires
**Then** Epic 6 Story 6.6's email subscriber consumes it (vendor-initiated cancellation case) OR a separate `OrderLineRefunded` template subscriber consumes it (admin-initiated discretionary refund case) — the subscriber chooses based on `event.initiator`
**And** **one email per vendorOrder per submission**, never one email per line
**And** the email body lists all refunded lines from this submission with the consolidated reason, amount per UX-DR52 format, and the still-active lines from the same `vendorOrder` (or "Frank's Farm cancelled their portion of your order" copy if `isFullVendorOrderRefund`).

**Given** state machine on `orderItems`
**When** Stripe webhook `charge.refunded` arrives per refund (Story 5.7)
**Then** the corresponding `orderItems.lineStatus` transitions `refund_requested` → `refunded`
**And** if Stripe rejects a refund post-submission, transitions to `refund_failed` with admin alert (rare given Server Action-side validation, but handled defensively)
**And** webhook arrival does NOT re-trigger the email (the email already fired from the batched mutation event; webhook is confirmatory only).

**Given** vendor cancellation will use this from Epic 6 Story 6.5
**When** Epic 6 Story 6.5's vendor UI submits `vendor.cancelLines(vendorOrderId, lineIds[], reason, message?)`
**Then** the action calls Stripe per line, then calls `recordLineRefunds` with `initiator: "vendor"` and `reason: "vendor_cancellation"`
**And** Epic 6 Story 6.6's substitute-suggestion logic subscribes to the batched event (not per-line events).

**Given** admin discretionary refund from Epic 8 Story 8.6
**When** the admin's UI submits a batch with `initiator: "admin"`
**Then** the same flow runs but the email uses the `OrderLineRefunded` template (no substitute suggestions inline — admin discretionary refunds typically don't carry the cancellation-as-discovery framing)
**And** the audit-log entries record the admin actor.

**Given** Vitest + integration tests with `Protects:` block
**When** they run
**Then** tests cover: batched refund of 3 lines from one vendorOrder produces one email (not three); cross-vendorOrder batch is rejected; partial Stripe failure leaves all lines in `placed` (no partial state); other vendorOrders' lines are completely untouched after a refund; webhook idempotency holds; `isFullVendorOrderRefund` flag is set correctly when all lines refunded
**And** intentional-break check: removing the batched-event emission and reverting to per-line `payment.refunded`-driven email triggers causes the "exactly one email per submission" assertion to fail.

### Story 5.9: 7-day post-delivery vendor payouts (FR15)

As **a vendor**,
I want **to be paid 7 days after my order line is marked delivered, faster than weekly Friday batch payouts elsewhere, with a clear payout email when funds arrive**,
so that **my cash flow is predictable, I don't wait two weeks for money I've earned, and I have a paper trail of every payout for accounting**.

**Acceptance Criteria:**

**Given** Stories 5.5–5.8 are operational and `vendorOrders.deliveredAt` is set when Epic 6 Story 6.1 marks delivery
**When** the developer creates a daily cron in `convex/crons.ts`
**Then** the cron scans `vendorOrders` where `deliveredAt + 7 days <= now AND payoutStatus === "pending" AND no open dispute or refund-flagged-issue`
**And** for each match, schedules a Convex action `payouts.internal.issuePayout({ vendorOrderId })` to issue the Stripe transfer.

**Given** the payout action
**When** it runs
**Then** it calculates the vendor's payout amount from the `vendorOrders.vendorSubtotal` minus the already-deducted commission and platform fee (these were partitioned at PaymentIntent creation in Story 5.5; this story makes the funds settle to the vendor)
**And** issues a Stripe transfer to the vendor's Connect account for that amount
**And** sets `vendorOrders.payoutStatus: "in_transit"`, `vendorOrders.payoutInitiatedAt`
**And** emits `payout.scheduled` event.

**Given** Stripe webhook `transfer.paid` arrives (from Story 5.7)
**When** the handler runs
**Then** sets `vendorOrders.payoutStatus: "paid"`, `vendorOrders.paidOutAt`
**And** emits `payout.completed` event
**And** sends `PayoutCompleted` email to vendor's owner with amount, vendor-order details, expected-arrival in their bank account.

**Given** `transfer.failed` arrives
**When** the handler runs
**Then** sets `vendorOrders.payoutStatus: "failed"` with the Stripe failure reason
**And** emits `payout.failed` event
**And** alerts admin (Epic 8 surfaces the alert) for manual retry; the vendor sees "Payout failed — we're working on it" with a clear link to support.

**Given** inspection-window logic
**When** a customer has flagged the order as having an issue (Epic 7 Story 7.5 customer reports — including foodborne illness Story 7.6) within 7 days
**Then** the payout for the affected vendor's lines is paused (`payoutStatus: "on_hold"`)
**And** admin must explicitly release the hold (Epic 8) for the payout to proceed
**And** the vendor sees "Payout on hold pending issue resolution" in their dashboard.

**Given** the vendor dashboard from Epic 3 Story 3.7
**When** the vendor views the dashboard
**Then** payout status per `vendorOrder` is visible (Pending / In transit / Paid / Failed / On hold)
**And** "Next expected payout: $X on YYYY-MM-DD" surfaces for upcoming payouts.

**Given** Vitest + integration tests with `Protects:` block
**When** they run with QA-tier seeded data (delivered orders at various ages)
**Then** tests cover: cron picks up only ≥7-day-old delivered orders; payout amount is correct net of fees; on-hold logic works for issue-flagged orders; payout email arrives via canonical pipeline
**And** intentional-break check: removing the dispute/issue check causes an under-investigation order to incorrectly pay out.

## Epic 6: Order Lifecycle, Fulfillment & Substitute Discovery

A vendor manages incoming orders through `preparing → ready/in_transit → delivered` state transitions on each per-vendor `vendorOrder`. The customer tracks per-vendor status in their order detail (data is reactive now per the AR23 backbone; the user-visible "live" framing is Growth FR70). Customer ↔ vendor messaging keeps in-cart and in-flight communication on-platform via an in-app inbox. Customers can request holds for later pickup/delivery dates, vendors accept or counter-propose. When a vendor cancels lines (one or several from the same vendorOrder, batched in one UI submission), one Stripe-refund loop runs, one email goes to the customer with substitute suggestions inline (cancellation-as-discovery), and other vendors' lines stay completely unaffected. The substitute matching engine surfaces alternative vendors offering the same product category with one-tap reorder.

### Story 6.1: Vendor order management — state transitions (FR28)

As **a vendor (or vendor team member with the right role)**,
I want **to see incoming orders in my vendor portal, transition each `vendorOrder` through the right states (preparing → ready or in_transit → delivered), and capture shipping carrier + tracking number for shipped lines**,
so that **the customer's tracking page (Story 6.2) reflects accurate status, the 7-day-post-delivery payout cron (Epic 5 Story 5.9) starts ticking when I mark delivered, and my Foundation tier team members with the `fulfillment` role can run day-to-day fulfillment without needing owner privileges**.

**Acceptance Criteria:**

**Given** the vendor portal shell from Epic 3 Story 3.1 exists
**When** the developer creates `apps/vendor/app/orders/page.tsx` and `orders/[vendorOrderId]/page.tsx`
**Then** the orders list shows all `vendorOrders` for the vendor's active Clerk Org with state-pill filtering (Preparing / Ready / In Transit / Delivered / Cancelled)
**And** orders list defaults to "needs my attention" filter (Preparing + cutoff approaching) sorted by `placedAt` ascending
**And** the detail page shows the customer's per-line picks, fulfillment method + details (pickup window or shipping address), customer name + masked email + masked phone (full only when revealed via "I need to contact this customer" button — minimal-PII-exposure pattern), order placement timestamp, and per-line state actions.

**Given** the state machine
**When** the vendor takes an action on a `vendorOrder` or individual line
**Then** transitions are: `preparing` (default on placement) → `ready` (pickup-method) or `in_transit` (shipping/local-delivery) → `delivered` (terminal); `cancelled` is a separate terminal state reached via Story 6.5
**And** `mark ready` is only valid when fulfillmentMethod is `pickup`
**And** `mark in_transit` requires carrier + tracking number for shipping (validated as conforming to the carrier's tracking-number format) or a delivery-window confirmation for local delivery
**And** `mark delivered` is only valid from `ready` or `in_transit`
**And** each transition emits the corresponding `vendorOrder.markedReady` / `vendorOrder.markedInTransit` / `vendorOrder.markedDelivered` domain event with timestamps + actor.

**Given** role-based action gating (per Epic 3 Story 3.1's role gating)
**When** a `fulfillment`-role team member attempts state transitions
**Then** they can `markReady`, `markInTransit`, `markDelivered` (these are day-to-day fulfillment ops)
**And** they CANNOT cancel lines (Story 6.5 requires `owner` or `admin` role)
**And** the UI hides the cancel action from `fulfillment` users; the mutation also rejects server-side via the appropriate auth wrapper.

**Given** transactional emails from state transitions
**When** `vendorOrder.markedReady` fires
**Then** an `OrderReadyForPickup` email goes to the customer via the canonical pipeline (transactional, always-sent per UX-DR56)
**And** when `vendorOrder.markedInTransit` fires, an `OrderShipped` email with tracking link goes to the customer
**And** when `vendorOrder.markedDelivered` fires, an `OrderDelivered` email goes to the customer with a "How was it?" CTA (the actual review/feedback feature is Growth-deferred; the email link routes to a placeholder at MVP).

**Given** payout scheduling (Epic 5 Story 5.9)
**When** `vendorOrder.markedDelivered` fires
**Then** the `vendorOrders.deliveredAt` timestamp is set
**And** the daily payout cron from Epic 5 Story 5.9 will pick this `vendorOrder` up at `deliveredAt + 7 days` for payout (subject to inspection-window holds).

**Given** local delivery completion ambiguity
**When** the vendor's local delivery doesn't have a clear "delivered" signal (no carrier tracking)
**Then** the vendor is responsible for marking delivered after the porch drop or hand-off
**And** if the vendor doesn't mark delivered within 48 hours of the chosen delivery window, an admin alert fires (Epic 8) so admin can prompt the vendor.

**Given** Playwright E2E with `Protects:` block
**When** the test runs a full vendorOrder lifecycle (preparing → ready → delivered for pickup; preparing → in_transit → delivered for shipping)
**Then** state transitions persist correctly; emails fire from the canonical pipeline; role-gating blocks `fulfillment`-role users from cancellation; intentional-break check confirms the carrier-tracking-validation step actually rejects malformed tracking numbers.

### Story 6.2: Customer order tracking with per-vendor status (FR35)

As **the customer**,
I want **to view my order history and drill into a specific order's detail showing per-vendor status (preparing → ready/in_transit → delivered), pickup or shipping details per vendor, and per-line refund/cancellation visibility**,
so that **I always know what's coming when from whom, the multi-pickup feels like an organized weekly plan rather than a juggling act, and I see exactly what was refunded if a line was cancelled (without having to dig through email)**.

**Acceptance Criteria:**

**Given** the customer account routes from Epic 1 Story 1.9 exist
**When** the developer creates `apps/marketplace/app/(customer)/orders/page.tsx` (history) and `[orderId]/page.tsx` (detail)
**Then** the history page lists the customer's orders newest-first with order ID, placement date, total, count of vendors, and overall order status (a derived pill: `Preparing` if any vendorOrder is preparing; `Partial` if some are delivered and some pending; `Delivered` if all delivered; `Cancelled` if all cancelled; etc.)
**And** the detail page shows order-level summary at the top + per-vendor sections (one `OrderSubReceipt` per vendorOrder, UX-DR26) below
**And** routes are auth-gated to the order's customer (and accessible via signed-link token for 30 days post-placement for emailed receipts).

**Given** the per-vendor sections
**When** the page renders
**Then** each section shows: vendor name (linked to farm profile), per-line items with quantity + unitPrice + per-line status pill (`preparing` / `ready` / `in_transit` / `delivered` / `cancelled` / `refunded`), fulfillment method + details (pickup address with Google Maps link + chosen window, shipping carrier + tracking link, local delivery address + date), per-vendor subtotal, refund amount if applicable
**And** for `cancelled` or `refunded` lines, a clear "$X refunded — 1–3 business days to your card" line is shown with the cancellation/refund reason if provided.

**Given** reactive status updates
**When** Story 6.1's vendor mark-ready or mark-shipped fires from the same minute
**Then** the customer's open detail page reflects the new status without manual refresh (Convex reactive queries via wrapped `useQuery` from Epic 1)
**And** while the user-visible "live" UX framing is Growth FR70, the data is reactive now — the only difference at MVP is no animated badge or push notification.

**Given** the WeeklyPlanView (UX-DR25)
**When** the customer views an upcoming order detail
**Then** the WeeklyPlanView at the top shows the next 14 days with each vendor's pickup/delivery/shipment-arrival highlighted on the right day
**And** for shipped lines without a guaranteed arrival date, the WeeklyPlanView shows an estimated range based on carrier defaults (e.g., USPS Priority Mail: 2–3 days from `markedInTransit`).

**Given** mobile responsiveness
**When** the customer opens the page on Mobile Safari at 320px
**Then** the layout collapses to single-column with per-vendor sections stacked
**And** axe-core passes WCAG 2.1 AA on history + detail
**And** the WeeklyPlanView reduces to a vertically-stacked list-style view at the floor breakpoint per UX-DR25 mobile variant.

**Given** edge cases
**When** an order's payment failed (Story 5.5 → Story 5.7's `payment_intent.payment_failed`)
**Then** the order does NOT appear in history (the order envelope was never created — only carts can hold failed-payment state)
**And** the customer's cart still shows the items so they can retry
**And** UX-DR54 voice rules apply: "Your card was declined — try a different card or use Apple Pay" (not "Payment failed").

**Given** Playwright E2E with `Protects:` block
**When** a test runs: place order → vendor marks ready (in another tab) → customer's detail page picks up the change reactively
**Then** the customer's detail reflects the new status without manual reload within 2 seconds
**And** intentional-break check: removing the reactive subscription causes the cross-tab assertion to fail.

### Story 6.3: Customer-vendor in-app messaging (FR29 + FR64)

As **a customer or vendor with an active order between us**,
I want **to send and receive in-app messages threaded by `(orderId, vendorOrderId)` with a clear inbox showing read/unread state and email notifications when a new message lands in a thread I'm part of**,
so that **hold/cancellation requests, "can you save the bigger ones," and quality questions stay on-platform with an audit trail rather than leaking to texts/Venmo**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer adds `messages` table per AR46
**Then** schema carries `_id`, `threadKey: ${orderId}-${vendorOrderId}`, `vendorOrderId`, `orderId`, `senderId`, `senderType` (`customer` | `vendor` | `admin`), `body`, `messageType` (`text` | `hold_request` | `system_event`), `sentAt`, `readBy[]` (array of userIds with read timestamps)
**And** indexes: `by_thread_sentAt` for thread loading; `by_recipient_unread` for inbox unread-count badges.

**Given** messaging UIs
**When** the developer creates `apps/marketplace/app/(customer)/messages/page.tsx` and `apps/vendor/app/messages/page.tsx`
**Then** both render a list of threads (sorted by latest message `sentAt`) on the left and the selected thread's messages on the right (stacked on mobile)
**And** each thread shows the counterparty's name (vendor/farm name on customer side; customer first-name + last-initial on vendor side per minimal-PII-exposure), the order/vendorOrder reference, the latest message preview, an unread badge if applicable
**And** opening a thread marks all messages in it as read for the viewer (writes to `readBy[]`).

**Given** message composition
**When** the user types a message and submits
**Then** the message is text-only at MVP (no attachments — added in Growth)
**And** the mutation rate-limits per AR14 (token bucket: max 30 messages per hour per `(senderId, threadKey)` pair) to prevent spam
**And** body is XSS-sanitized server-side before storage
**And** a `message.sent` domain event fires.

**Given** email subscriber for new messages
**When** `message.sent` fires
**Then** the email pipeline sends a `MessageReceived` template email to the recipient (transactional, always-sent per UX-DR56) with the message body, sender name, order reference, and a deep link to the in-app thread
**And** if the recipient has the thread open in a browser tab (their `readBy[]` was updated within the last 5 minutes), the email is **not** sent — they're already engaged (debounce to avoid email spam during active conversation).

**Given** the bell-icon NotificationCenter (UX-DR32) from Epic 4 Story 4.7
**When** unread messages exist for the user
**Then** the bell icon badge shows the count (separate from order/system notifications)
**And** clicking the bell opens NotificationCenter with tabs (All / Orders / Vendor / Marketing) per UX-DR32
**And** message threads appear in the Orders tab with one entry per thread.

**Given** access control
**When** a customer attempts to read a thread they're not part of
**Then** the `customerQuery` rejects with `appError("auth.forbidden", ...)`
**And** vendors only see threads where their org is the counterparty
**And** admins (Epic 8 Story 8.5) can read any thread for investigation purposes — flagged in the audit log.

**Given** message retention
**When** an order is older than the retention horizon
**Then** messages are retained per the same retention rules as the order itself (NFR29) — typically 7 years for food-safety/tax minimums
**And** message content survives customer account deletion as pseudonymized "former customer" entries (NFR23 — audit-relevant references preserved).

**Given** Playwright E2E with `Protects:` block
**When** the test runs: customer sends message → vendor receives email + in-app notification → vendor replies → customer receives email + in-app notification
**Then** rate-limiting blocks a 31st message in an hour; XSS injection attempts are sanitized; thread access is gated correctly
**And** intentional-break check: removing the active-tab debounce causes the email-during-active-conversation assertion to fail.

### Story 6.4: Customer hold requests (FR37 + FR39 cutoff enforcement)

As **a customer with an in-progress order**,
I want **to request that a vendor hold my order for a later pickup or delivery date through a structured form (not an open-ended message), and the vendor can accept the new date, decline, or counter-propose — all before the per-product cancellation cutoff (FR39)**,
so that **my "can you save this for next week" question is unambiguous, the vendor can act on it without parsing free-text, and after the cutoff the option becomes "contact vendor" (regular message) rather than a structured form (because at that point there's no SLA on what the vendor can accommodate)**.

**Acceptance Criteria:**

**Given** the messaging system from Story 6.3 and per-product cancellation cutoffs from Epic 3 Story 3.5 exist
**When** the developer adds the structured `hold_request` message type
**Then** the message body schema (Zod-validated) includes `requestedNewDate: ISO date string`, `requestedNewWindow?: { start, end }` (for pickup), `reason: string` (max 500 chars)
**And** the customer's order detail page (Story 6.2) shows a "Request a hold" CTA per `vendorOrder` line — only visible when `now < lineCancellationCutoff` (FR39 enforced).

**Given** the customer submits a hold request
**When** the form is filled and submitted
**Then** a `hold_request`-typed message is created in the thread with the structured payload
**And** a `vendorOrder.holdRequested` domain event fires
**And** the email subscriber sends a `HoldRequested` template email to the vendor's owner with the structured detail and a deep link to accept/counter/decline
**And** the customer's order detail page shows a clear "Hold requested for <date> — awaiting vendor response" badge.

**Given** the vendor's response
**When** the vendor's order management (Story 6.1) shows the hold request
**Then** they see structured options: **Accept new date** (updates `vendorOrders.fulfillmentDetails.pickupAt` or shipping/delivery date), **Counter-propose** (opens a new `hold_request` message with their proposed alternative), **Decline** (closes the request without state change; customer can still cancel via Story 6.5 if a line is uncancelled)
**And** acceptance triggers `vendorOrder.holdAccepted` event + `HoldAccepted` email to customer with the new fulfillment date confirmed
**And** counter-proposal triggers `HoldCounterProposed` email + the customer can accept/decline the counter
**And** decline triggers `HoldDeclined` email with the vendor's optional reason.

**Given** post-cutoff behavior
**When** the customer's `now >= lineCancellationCutoff`
**Then** the "Request a hold" CTA is replaced with "Contact vendor" — opens a regular text message (Story 6.3) without structured form
**And** copy explains: "We're inside this farm's cancellation window. Send a message and they'll do their best, but they can't always accommodate late changes."

**Given** vendor-initiated cancellation as escalation
**When** a customer's hold request is declined and the customer subsequently cancels via messaging
**Then** the vendor uses Story 6.5 to cancel the line (vendor-driven cancellation; customer can't unilaterally cancel)
**And** the `reason: "customer_requested_via_messaging"` is recorded in the audit log.

**Given** Playwright E2E with `Protects:` block
**When** the test runs: customer requests hold pre-cutoff → vendor accepts → fulfillment date updates; customer attempts hold post-cutoff → CTA shows "Contact vendor" instead
**Then** the structured form data flows correctly to the vendor; the cutoff enforcement is exact (1-second precision); the fulfillment-date update propagates to the customer's WeeklyPlanView
**And** intentional-break check: removing the cutoff check exposes the "Request a hold" form post-cutoff incorrectly.

### Story 6.5: Vendor-initiated batched cancellation (FR36)

As **a vendor (`owner` or `admin` role)**,
I want **to select one or more lines from a single `vendorOrder` via checkboxes, pick a reason from a curated list, optionally add a message, and submit one batch — so that one Stripe-refund loop runs, one Convex transaction commits, one batched event fires, and the customer receives one email about my cancellation with substitute suggestions inline**,
so that **batching matches my decision unit ("I'm cancelling this whole order today" or "I'm cancelling these two lines but the third is fine"), customers don't get spammed with multiple emails for what was one decision, and other vendors' lines on the same order remain completely unaffected (FR14)**.

**Acceptance Criteria:**

**Given** Story 6.1's vendor order detail page exists
**When** the developer adds the batched-cancellation UI
**Then** the page shows checkboxes next to each active line in the `vendorOrder` (lines already in `cancelled` / `refunded` state are read-only and not selectable)
**And** the vendor selects 1+ lines, picks a reason from a curated list (`vendor_unavailable | inventory_issue | quality_issue | customer_requested_via_messaging | other_with_explanation`), and optionally enters a freetext message
**And** the cancel action is gated to `owner` or `admin` role per Epic 3 Story 3.1 (`fulfillment` role hides the action and the mutation rejects server-side).

**Given** the vendor submits the batch
**When** the Server Action `apps/vendor/app/orders/[vendorOrderId]/actions.ts` runs
**Then** it loops `lineIds[]` calling Stripe `Refund` API per line with the idempotency key from Story 5.8 (`${orderItemId}-vendor-${batchSubmissionId}`)
**And** if all Stripe calls succeed, it calls Convex `orders.internal.recordLineRefunds({ vendorOrderId, lineIds, reason, message?, initiator: "vendor" })` per Story 5.8's contract
**And** if any Stripe call fails, the entire batch is rolled back (no Convex mutation called; lines stay in `placed`); the vendor sees inline retry guidance.

**Given** the batched event fires
**When** `vendorOrder.linesRefunded({ ..., initiator: "vendor", ..., isFullVendorOrderRefund })` lands
**Then** Story 6.6's substitute-suggestion subscriber consumes it (because `initiator === "vendor"`)
**And** other vendors' lines on the same order remain in `placed` state with their transfers intact (per FR14)
**And** the audit log records the batch with one entry per line + a parent batch entry referencing the submission ID for traceability.

**Given** the cancelled lines visible on customer's order detail (Story 6.2)
**When** the customer views the page
**Then** each cancelled line shows its status pill (`cancelled`), the reason (translated to customer-friendly copy — "Vendor unavailable" rather than `vendor_unavailable`), and the refund amount
**And** the order's overall pill becomes `Partial` (some delivered/in-progress, some cancelled).

**Given** the vendor's reason choice flows to the customer email
**When** the email subscriber fires
**Then** the customer-facing reason copy is curated (no internal codes leak to customer) and the optional vendor message is included verbatim if provided
**And** `customer_requested_via_messaging` reason maps to "Cancelled at your request" copy (no need to repeat back to the customer that they asked).

**Given** Playwright E2E with `Protects:` block
**When** the test runs: vendor selects 3 of 5 lines, submits, → one Stripe API loop, one Convex mutation, one batched event, one email; the unselected 2 lines stay `placed`
**Then** the vendor's order list refreshes to show the cancelled lines in `cancelled` state
**And** the customer's order detail reflects the partial cancellation
**And** intentional-break check: routing the cancellation through a per-line loop (instead of the batched mutation) causes the "exactly one email" assertion to fail.

### Story 6.6: Substitute matching engine + cancellation-as-discovery flow (FR38)

As **a customer whose vendor just cancelled some of my lines**,
I want **to receive one email about the cancellation with substitute suggestions inline (other Farm2Table vendors carrying the same product category, in my location, with compatible fulfillment), and to see the same suggestions in my in-app order detail and notification — with one-tap "Add to cart" links**,
so that **the cancellation becomes a discovery moment rather than a dead end (Journey 2 — failure-mode-2 mitigation), I find new farms I'd otherwise have missed, and the platform's promise of "we have alternatives" feels true rather than hollow**.

**Acceptance Criteria:**

**Given** the project structure exists
**When** the developer creates `packages/backend/convex/products/substitutes.ts` per AR45
**Then** `findSubstitutes(productId, customerLocation, fulfillmentPreferences, excludeVendorId?)` returns matched alternative vendors offering the same product category, scoped to:
- Same product category (MVP: category match only; deeper attribute matching is Growth FR40)
- Customer's state for shipping eligibility OR within local-delivery zip range OR within reasonable pickup distance — the function ranks by fulfillment-compatibility-with-customer-preferences first, then proximity, then availability
- `status: "published"` only; in-stock only (variant inventory > 0 OR `inventoryEnabled === false`)
- Excluding `excludeVendorId` (the cancelling vendor)
- Limited to top 5 results
**And** the function is pure (deterministic for the same inputs at the same data version) and tested against `Protects:` block.

**Given** the substitute engine is operational
**When** Story 6.5's `vendorOrder.linesRefunded({ initiator: "vendor" })` event fires
**Then** the email subscriber `convex/domainEvents/emailSubscribers/orderEmails.ts` consumes it
**And** for each refunded line, the subscriber calls `findSubstitutes` to get up to 5 alternatives
**And** the consolidated `OrderLineCancelled` template email is rendered with: customer-friendly reason at the top, list of cancelled lines with `OrderSubReceipt`-style summary, refund amount in UX-DR52 format, and a "Other vendors carrying these products on Farm2Table" section showing each cancelled line with its top 3 substitutes inline (using `SubstituteSuggestion` UX-DR24 cards with farm photo + name + price + fulfillment + one-tap "Add to cart" CTA)
**And** if `isFullVendorOrderRefund === true`, the email copy shifts to "Frank's Farm cancelled their portion of your order" (warmer full-cancellation framing); otherwise "1 of 3 lines from Frank's Farm cancelled" (partial framing).

**Given** in-app notification mirrors email
**When** the same event fires
**Then** an in-app `notifications` row is written for the customer with the same content
**And** NotificationCenter (UX-DR32) renders it with the substitute suggestions rendered as tappable cards.

**Given** customer's order detail (Story 6.2) shows cancelled lines
**When** the customer opens the order
**Then** each cancelled line shows substitute suggestions inline (same `SubstituteSuggestion` cards) in the per-vendor section
**And** the customer can tap a substitute → routes to that vendor's product detail page (Epic 4 Story 4.4) with `?from=substitute&original=<vendorId>` query params for analytics tracking ("did the cancellation produce a substitute order?").

**Given** admin discretionary refund (Epic 8 Story 8.6) — `initiator: "admin"`
**When** that flow fires `vendorOrder.linesRefunded({ initiator: "admin" })`
**Then** Story 5.8's separate `OrderLineRefunded` email subscriber consumes it (no substitute suggestions inline — admin discretionary refunds are typically issued for service issues, not "this product is unavailable, here are alternatives")
**And** Story 6.6's substitute subscriber **does not fire** for admin-initiated events — keeps the cancellation-as-discovery framing scoped to actual vendor cancellations.

**Given** validation success metrics (PRD Innovation §Validation Approach for substitute matching)
**When** the substitute engine emits `substitute.suggested` events with each suggestion impression
**Then** click-throughs (when customer taps a substitute) and follow-on orders (when customer places an order with the substitute vendor within 14 days) are tracked
**And** Epic 8's admin dashboard surfaces the click-through rate and 14-day-follow-on rate per the PRD targets (≥30% CTR, ≥50% of CTRs become follow-on orders).

**Given** Vitest tests with `Protects:` block
**When** they run
**Then** tests cover: substitute engine excludes the cancelling vendor; respects fulfillment compatibility (a customer who chose pickup gets pickup-or-local-delivery substitutes when available, ship-only only as fallback); excludes out-of-stock variants; returns empty array gracefully when no substitutes exist (email then renders the cancellation with "No substitutes currently available — sorry about that" copy, no dead-end SubstituteSuggestion section)
**And** intentional-break check: removing the `excludeVendorId` causes the substitute engine to suggest the cancelling vendor's other products as substitutes (incorrect)
**And** email integration test: vendor-initiated batched cancellation → 1 email with substitutes; admin-initiated batched refund → 1 email without substitutes.

## Epic 7: Customer Account, Trust & Privacy

A customer manages their account through a minimal-tab dashboard (Orders / Saved farms / Favorite products / Settings), exports their data within 24 hours per NFR22, deletes their account with a 30-day grace window and pseudonymized audit retention per NFR23, exercises CCPA/CPRA rights including the functional Do-Not-Sell-or-Share opt-out, controls notification preferences across the three-tier model (transactional always-on, lifecycle opt-in, marketing opt-in), files structured reports of vendor misrepresentation or cancellation/service-quality issues scoped per `vendorOrder`, files foodborne-illness reports with multi-vendor selection and the graduated-response design (single-vendor auto-pauses; multi-vendor or "not sure" routes to admin investigation without auto-pause), and contributes "where should we launch next" interest signals through a public form.

### Story 7.1: Customer account dashboard + profile + payment methods (FR42)

As **a customer**,
I want **a clean account dashboard with minimal tabs (Orders / Saved farms / Favorite products / Settings) where I can edit my profile, manage my saved payment methods through Stripe's hosted customer portal, and reach my order history and saved/favorite items in one tap**,
so that **the account surface feels like a tool I use, not a dashboard I navigate, and my payment data stays with Stripe (never on Farm2Table) per NFR9**.

**Acceptance Criteria:**

**Given** Epic 1 Story 1.9's signup and Epic 4 Story 4.7's saved farms exist
**When** the developer creates `apps/marketplace/app/(customer)/account/page.tsx`
**Then** the page is auth-gated to the signed-in customer (rejects anonymous + redirects to sign-in with `redirect_to`)
**And** the layout follows UX-DR42 — minimal tabs (Orders / Saved farms / Favorite products / Settings); no sidebar, editorial register
**And** Orders tab links to Epic 6 Story 6.2's order history; Saved farms tab links to Epic 4 Story 4.7's list; Favorite products tab shows the customer's favorited products in a `ProductCard`-grid (analogous schema/component to saved farms — `favoriteProducts` table keyed by `(userId, productId)`); Settings tab links to Story 7.4.

**Given** profile editor
**When** the customer opens the profile section under Settings
**Then** they can edit: first name, last name (optional — used in vendor-facing display per Epic 6 Story 6.3 minimal-PII pattern), default zip code (used to default location filters in Epic 4 browse and to default to local-delivery zip in Epic 5 checkout), optional phone (used only if customer enables it for vendor messaging — UX-DR53 contact preferences)
**And** email is shown read-only (managed via Clerk; change-email flow happens in Clerk's hosted account UI)
**And** form uses React Hook Form + Zod per AR8 with field validation per UX-DR9.

**Given** payment methods
**When** the customer clicks "Manage payment methods"
**Then** a Server Action (`apps/marketplace/app/(customer)/account/actions.ts`) generates a Stripe customer portal session and redirects the customer
**And** Stripe's hosted portal handles add/remove/default card without any card data ever touching Farm2Table per NFR9
**And** on return from the portal, the customer lands back on `/account` with a confirmation toast.

**Given** favorite products mirror saved farms behavior
**When** the customer clicks the heart icon on a `ProductCard` (Epic 4 Story 4.2) or `ProductDetail` (Epic 4 Story 4.4)
**Then** anonymous users redirect to sign-in with `redirect_to` like Epic 4 Story 4.7
**And** authenticated users optimistically toggle the heart and write to `favoriteProducts`
**And** the Favorite products tab shows them in `ProductCard` editorial variant grid with an unsave action.

**Given** Playwright E2E with `Protects:` block
**When** the test runs the account flow on Mobile Safari at 320px
**Then** all four tabs render correctly; profile edits persist; Stripe portal redirect works in test mode (returns to `/account` with proper session)
**And** axe-core passes on every account tab in light + dark modes
**And** intentional-break check: removing the auth gate exposes account routes to anonymous visitors — test fails.

### Story 7.2: Data export within 24h (FR43 + NFR22)

As **a customer**,
I want **to request a complete export of my Farm2Table data and receive a download link within 24 hours that gives me my orders, profile, saved farms, favorites, attestations, and messages in a portable format (JSON + CSV)**,
so that **I can fulfill my CCPA/CPRA right of access on demand and the platform meets its 24-hour SLA per NFR22**.

**Acceptance Criteria:**

**Given** the customer account routes exist
**When** the developer creates `apps/marketplace/app/(customer)/account/data-export/page.tsx` and the supporting Convex action `customers/internal.requestDataExport`
**Then** the page shows a "Request export" button + a list of past export requests with their status (pending / ready / expired) and download links for ready/non-expired exports
**And** rate-limiting per AR14: max 1 export request per 7 days (token bucket) — the button is disabled with the next-eligible-time copy if recently requested.

**Given** the customer requests an export
**When** the action runs
**Then** a `dataExportRequests` row is written with `userId`, `requestedAt`, `status: "pending"`
**And** the action enqueues a scheduled Convex action `customers/internal.assembleDataExport({ requestId })` that:
- Queries the customer's data: profile, orders (Epic 5 Story 5.6's envelope including all `vendorOrders` and `orderItems`), saved farms (Epic 4 Story 4.7), favorite products (Story 7.1), compliance attestations the customer signed (e.g., ToS acceptance from Epic 1 Story 1.9), messages they sent or received (Epic 6 Story 6.3)
- Renders the data into both a JSON file (full structured form) and a CSV bundle (one CSV per entity, zipped)
- Uploads both to Convex storage with a 7-day-expiry signed URL each
- Updates the `dataExportRequests` row with the URLs and `status: "ready"`, `readyAt`
- Sends a `DataExportReady` email to the customer via canonical pipeline with the download links and a notice that the links expire in 7 days.

**Given** SLA per NFR22
**When** an export is requested
**Then** the action completes within 24 hours (typical case: minutes; edge case: backed-up scheduled-job queue could approach 24h but never exceed)
**And** if the assembly action fails (e.g., upload error), the action retries via `scheduler.runAfter` with exponential backoff up to 5 attempts; failures beyond max surface to admin queue (Epic 8) per AR41 generic email-failure pattern.

**Given** the customer downloads the export
**When** they click the link before expiry
**Then** the file streams from Convex storage signed URL
**And** an audit log entry records the download (NFR62 — privacy-request audit trail).

**Given** post-expiry
**When** the customer clicks an expired link
**Then** they see a clear "This export expired on YYYY-MM-DD — request a new one" page
**And** the customer can request a new export (rate-limit aware).

**Given** account deletion (Story 7.3)
**When** a customer's account is deleted
**Then** all `dataExportRequests` rows for that user are hard-deleted (the customer's data is gone; export records pointing to it are no longer meaningful)
**And** any non-expired signed URLs become 404 immediately (NFR23 — data purge propagates).

**Given** Vitest + integration tests with `Protects:` block
**When** they run with QA-tier seeded data
**Then** tests cover: export bundle includes all enumerated data categories; signed URL expires at 7 days; rate-limit blocks back-to-back requests; export fails gracefully (admin alert) on assembly error
**And** intentional-break check: removing one of the data categories from the bundle causes the "all categories present" assertion to fail.

### Story 7.3: Account deletion with PII purge + audit pseudonymization (FR44 + NFR23)

As **a customer**,
I want **to delete my Farm2Table account through a deliberate confirmation flow with a 30-day grace window during which I can cancel deletion, and after which my PII is permanently purged while audit-relevant references are pseudonymized rather than hard-deleted**,
so that **the platform meets NFR23 (PII purge within 30 days) while preserving the regulatory paper trail for food-safety and tax compliance, and I have a chance to undo a deletion I initiated impulsively**.

**Acceptance Criteria:**

**Given** the customer account routes exist
**When** the developer creates `apps/marketplace/app/(customer)/account/settings/delete-account/page.tsx`
**Then** the page warns clearly about consequences (saved farms/favorites lost, payment methods removed from Stripe, order history pseudonymized, future Farm2Table use requires a new account)
**And** the destructive confirmation pattern per UX-DR47 requires: re-entering email + typing "DELETE" + clicking the confirm button (Alert Dialog for irreversible-feeling action even though it's reversible during the grace window)
**And** mismatched email or text rejects with `appError("validation.invalid", ...)`.

**Given** confirmation succeeds
**When** the deletion mutation runs
**Then** the mutation transitions the user's `status: "deletion_scheduled"`, sets `deletionScheduledAt: now`, sets `deletionEffectiveAt: now + 30 days`
**And** sends a `DeletionScheduled` email confirming the date and offering a one-click cancellation link (signed-URL token, valid 30 days)
**And** the customer's session is preserved (they stay signed in so they can cancel)
**And** a banner across all customer-app surfaces shows: "Your account is scheduled for deletion on YYYY-MM-DD. Cancel anytime before then" with a Cancel CTA
**And** during the grace period: order placement is BLOCKED (UX shows clear message routing to cancel deletion); messaging, browse, profile-view all still work.

**Given** the customer cancels deletion during the grace window
**When** they click the cancel link or the in-app banner CTA
**Then** the mutation transitions `status` back to `"active"`, clears the deletion timestamps
**And** a `DeletionCancelled` email confirms reversal
**And** the customer's banner disappears and full functionality returns.

**Given** the grace period elapses
**When** a daily cron scans for `deletionEffectiveAt <= now AND status === "deletion_scheduled"`
**Then** the deletion-finalize action runs:
- **Hard-delete PII fields:** firstName, lastName, email, phone, defaultZip, profile photo if any (anonymized to deterministic placeholder values in Clerk + Convex)
- **Hard-delete relationship rows:** `savedFarms`, `favoriteProducts`, `dataExportRequests`, `userNotificationPreferences`, `userPrivacyPreferences` for this user
- **Pseudonymize references** in tables that must retain rows for audit: `orders.email` → `"deleted-customer@redacted"`, customer name on `vendorOrders` view → `"Former customer"`, audit log entries are NOT modified (they preserve the actor reference per NFR59 immutability — but the user's display name is rendered via a render-time pseudonymization layer that returns "Former customer" when a user has been deleted)
- **Stripe customer object:** delete via Stripe API (which retains a tombstone for compliance but removes the active customer record)
- **Clerk user:** delete via Clerk API (Clerk webhook from Story 1.5 triggers a final sync; no-op since Convex already cleaned up).

**Given** the finalization completes
**When** the mutation finishes
**Then** a `DeletionCompleted` email is sent to the customer's last-known email **before** the email field is purged (one final notice, then truly gone)
**And** an audit log entry records the deletion completion (actor: system; action: `customer.accountDeleted`; affected entity: original `userId` preserved as the audit key; PII redacted in the entry per NFR23 spirit)
**And** the customer can no longer sign in (Clerk rejects).

**Given** order history with future deliveries
**When** a customer attempts deletion while they have orders in `preparing`, `ready`, or `in_transit` state
**Then** the deletion-request page shows: "You have 2 active orders that haven't been delivered yet. We can schedule your deletion for after they complete, or you can contact us to cancel them first" — provides a clear path: option A (delay deletion until all active orders complete; deletion auto-fires on the day after last delivery + 7 days payout window completes), option B (contact support — links to a help page or messaging)
**And** the deletion is gated on no-active-orders OR explicit-acceptance-of-deletion-after-completion.

**Given** Vitest + integration tests with `Protects:` block
**When** they run
**Then** tests cover: confirmation flow rejects mismatched email; grace-period cancellation works; finalization purges PII while preserving audit log; pseudonymization renders "Former customer" in vendor-facing order views; Stripe + Clerk deletion happens
**And** intentional-break check: removing the audit-log preservation logic (e.g., hard-deleting audit entries) causes the "audit retained" assertion to fail.

### Story 7.4: Account settings — notification preferences + privacy controls (FR45 + NFR21–29 + UX-DR56)

As **a customer**,
I want **a single Settings page where I can control my notification preferences across the three-tier model (transactional, lifecycle, marketing), exercise my CCPA/CPRA Do-Not-Sell-or-Share right with a functional toggle, and manage cookie consent**,
so that **I can opt in or out of lifecycle/marketing emails granularly post-signup, the platform's NFR24 footer link goes to a real opt-out (not just an info page), and my consent choices are honored across the platform**.

**Acceptance Criteria:**

**Given** Epic 1 Story 1.11 rendered the Do-Not-Sell page shell
**When** the developer creates `apps/marketplace/app/(customer)/account/settings/page.tsx`
**Then** the page is auth-gated and organized into sections: Notifications, Privacy & data, Account (links to delete-account and data-export from Stories 7.2/7.3)
**And** all sections render within Epic 1's site shell.

**Given** the Notifications section
**When** the customer views it
**Then** four toggles + their state per UX-DR56:
- **Order updates** — locked ON, can't toggle off, helper text: "Required to use Farm2Table" (transactional tier — receipts, cancellation notices, hold-request responses, payout-related, foodborne-illness incident notices, account/security)
- **Substitute & "back in season" alerts** — opt-in, default OFF, helper text: "Notify me when products I've cancelled or items in carts I abandoned are available again"
- **Saved-farm news** — opt-in, default OFF (or default to whatever the customer chose at signup if Epic 1 Story 1.9 captured it), wires Epic 4 Story 4.7's email subscriber gating
- **Newsletter & seasonal recipes** — opt-in, default OFF (or default to whatever the customer chose at signup), CAN-SPAM unsubscribe link is automatic in every marketing email per UX-DR56
**And** changes write to `userNotificationPreferences` table (key-value: `userId × preference` with `enabled: boolean`, `updatedAt`)
**And** Epic 4 Story 4.7's saved-farm email subscriber and other lifecycle/marketing subscribers across the platform read from this table to gate sends.

**Given** the Privacy & data section
**When** the customer views it
**Then** the **Do Not Sell or Share My Personal Information** toggle is functional (FR45) — wires the Epic 1 Story 1.11 page shell
**And** toggling ON writes `userPrivacyPreferences.doNotSellOrShare: true, optedInAt, lastConfirmedAt`, emits `customer.doNotSellOptedIn` event, and shows a toast: "Confirmed. We won't sell or share your personal information"
**And** the platform doesn't currently sell customer data (NFR28), so the toggle's primary effect is preventative + audit-record compliance — but if the platform ever begins data-sharing arrangements (Growth+), this opt-out is the gate
**And** an audit log entry records each toggle change.

**Given** CCPA/CPRA right of access/deletion links
**When** the customer scrolls within Privacy & data
**Then** clear links route to: Story 7.2 data export ("Download my data"), Story 7.3 account deletion ("Delete my account"), and a "Submit a privacy request" form for non-standard requests (e.g., "correct my data" — routes to a free-form admin queue entry that admin handles manually at MVP scale; Growth automates).

**Given** cookie consent management (NFR25)
**When** an anonymous visitor first lands on the marketplace (any page) at runtime
**Then** a non-blocking cookie banner appears at the bottom of the viewport explaining essential vs. analytics/marketing cookies
**And** offers three buttons: "Accept all," "Reject non-essential," "Customize" (opens a popover with per-category toggles)
**And** essential cookies (auth session, cart, language preference) are always set; analytics/marketing cookies are gated on the customer's choice
**And** the customer's choice persists in a `cookie_consent` cookie (sliding 1-year Max-Age) and writes to `userPrivacyPreferences.cookieConsent` for authenticated users
**And** the banner doesn't re-appear after a choice is made (until the consent cookie expires).

**Given** Playwright E2E with `Protects:` block
**When** the test runs the settings flow on Mobile Safari at 320px
**Then** all toggles persist; the cookie banner appears for first-time visitors and not subsequently; CCPA toggle writes to the right table and emits the right event; saved-farm email subscriber actually checks the opt-in flag
**And** axe-core passes
**And** intentional-break check: removing the opt-in gate from Epic 4 Story 4.7's email subscriber causes saved-farm emails to send to opted-out users — test fails.

### Story 7.5: Customer reports — misrepresentation + cancellation/service quality (FR46 + FR48)

As **a customer who experienced an issue with a vendor (false provenance, miscategorized listing, repeated cancellations, or service-quality concern)**,
I want **a structured report form that asks me which order and which vendor's `vendorOrder` the report is about, captures the issue type and details cleanly, and routes my report to the admin team with a confirmation reference number**,
so that **the admin investigation is properly scoped to the right vendor (per the per-`vendorOrder` admin scoping decision), my report has structure rather than free-text-only intake, and I have a reference number to follow up if needed**.

**Acceptance Criteria:**

**Given** the customer account routes exist
**When** the developer creates `apps/marketplace/app/(customer)/reports/page.tsx` (history of customer's reports) and `reports/new/page.tsx` (new-report wizard)
**Then** the new-report wizard step 1 asks the customer to pick an order from their history (last 90 days default; "show all" expands)
**And** step 2 asks which `vendorOrder` within that order the report is about (radio buttons listing vendors in the selected order with each vendor's status pill — most reports are about one vendor's portion per Jen's design call)
**And** step 3 asks the report type: misrepresentation (FR46) / cancellation patterns (FR48) / service quality (FR48 — "other") / **foodborne illness routes to Story 7.6's separate flow** with a clear callout and link.

**Given** misrepresentation report (FR46)
**When** the customer selects it
**Then** structured intake fields: claim type (false provenance / miscategorized listing / unverifiable certification claim / mislabeled product), description (textarea, max 2000 chars), optional photo upload (uses Epic 2 Story 2.4's image pipeline)
**And** submission writes a `customerReports` row with `vendorOrderId`, `reportType: "misrepresentation"`, structured payload, `submittedAt`, `referenceNumber` (auto-generated short ID).

**Given** cancellation patterns report (FR48)
**When** the customer selects it
**Then** structured intake fields: pattern observed (vendor cancelled my order multiple times / vendor consistently misses cutoffs / vendor doesn't respond to messages / other), date range, description
**And** submission references all the customer's recent orders with the same vendor (auto-pulled) so admin sees the pattern context immediately.

**Given** service quality report (FR48 catch-all)
**When** the customer selects it
**Then** structured intake fields: issue type (product damaged on arrival / pickup wasn't ready when scheduled / wrong item received / other), description, optional photo upload.

**Given** submission completes
**When** the report is filed
**Then** a `customerReport.filed` domain event fires with the structured payload
**And** Epic 8 Story 8.5's admin queue surfaces the report with the right scope (links directly to `/admin/orders/[orderId]?focus=<vendorOrderId>`)
**And** the customer receives a `ReportReceived` email via canonical pipeline with the reference number and a reasonable response-time expectation ("typically within 5 business days")
**And** the customer can view their report status on `/reports` (history page).

**Given** rate limiting per AR14
**When** a customer submits more than 5 reports in a rolling 24-hour window
**Then** subsequent submissions are blocked with `appError("rate_limit.exceeded", ...)` and a clear message ("If you have a serious safety concern, contact us directly at <support email>")
**And** this prevents abuse while allowing legitimate multi-issue reporting.

**Given** Playwright E2E with `Protects:` block
**When** the test runs the multi-step report submission for each report type
**Then** the wizard correctly scopes to the chosen `vendorOrder`; structured fields validate per AR8 (Zod); submission produces the right event with the right `vendorOrderId`; rate-limit blocks excessive submissions
**And** axe-core passes
**And** intentional-break check: removing the `vendorOrder` scoping causes a report to land in the admin queue without a clear scope — test fails.

### Story 7.6: Customer foodborne-illness reports with multi-vendor selection + graduated response (FR47)

As **a customer or member of a customer's household experiencing symptoms after consuming Farm2Table products**,
I want **a dedicated, expedited intake form that captures structured medical detail (symptom onset, description, household members affected) and lets me select the vendor I suspect — single, multi, or "I'm not sure which" — with an FDACS-contact opt-in**,
so that **single-vendor reports trigger the documented FR56 auto-pause for that vendor, multi-vendor or "not sure" reports flag for high-priority admin investigation **without** auto-pausing anyone unjustly (the graduated-response design), and FDACS coordination follows when I consent**.

**Acceptance Criteria:**

**Given** Story 7.5's report types include a foodborne-illness call-out
**When** the developer creates `apps/marketplace/app/(customer)/reports/foodborne-illness/new/page.tsx`
**Then** the form is distinct from the general report form with copy explaining the structured intake and the FDACS-coordination pathway
**And** the form is reachable from a clear-and-prominent link in Story 7.5's wizard, in the customer's order detail (Epic 6 Story 6.2), and in the safety-related help center.

**Given** the structured intake fields per the PRD
**When** the customer fills the form
**Then** required fields: order reference (auto-fills from selected order), products consumed (multi-select from order's lines), symptom onset time (date + approximate hour), symptom description (structured: nausea / vomiting / diarrhea / fever / other-with-text), household members affected (count + ages-or-age-ranges optional), customer contact info (phone + email — pre-filled, editable)
**And** **vendor selection** with three modes per Jen's design call: **single** (radio: pick one vendor from the order), **multi** (checkboxes: pick multiple vendors from the order), **"I'm not sure which"** (no vendor selection — the customer indicates uncertainty)
**And** **FDACS-contact opt-in checkbox** with clear explanation: "Allow Farm2Table to share my report and contact info with FDACS (Florida Department of Agriculture) so they can follow up directly".

**Given** submission with single-vendor selection
**When** the customer submits with one vendor
**Then** an `incident.foodborneIllnessReported` domain event fires with `vendorOrders: [<vendorOrderId>]`, `certainty: "single_vendor"`, full structured payload
**And** Epic 8 Story 8.4's foodborne-illness handler subscribes to this event and **auto-pauses that vendor's listings** (existing FR56 behavior — defensible because the customer named one vendor)
**And** sends a high-priority alert to admin (Epic 8 Story 8.5 queue with red-state pill).

**Given** submission with multi-vendor or "not sure" selection
**When** the customer submits with multiple vendors or "I'm not sure"
**Then** the same event fires with `vendorOrders: [<v1>, <v2>, ...]` (or empty for "not sure"), `certainty: "multi_vendor" | "uncertain"`
**And** Epic 8 Story 8.4's handler **does NOT auto-pause any vendor** — surfaces a high-priority alert with a 1-hour-acknowledgment SLA and 4-hour customer-call SLA per the graduated-response design
**And** the admin investigates per the PRD Journey 6 path; if/when evidence narrows the source, admin manually pauses the targeted vendor(s) at that point with audit-log basis
**And** if the source remains unidentifiable, no vendor is paused — F2T documents the report and the inability-to-identify-source for regulatory record (NFR62 audit trail).

**Given** confirmation
**When** submission completes
**Then** the customer sees a confirmation page with the case reference number and clear next-steps copy: "We've received your report. A team member will call you within 4 business hours. If you're experiencing severe symptoms, please contact a medical provider or 911 immediately"
**And** receives a confirmation email via canonical pipeline (transactional — always sent regardless of opt-ins)
**And** the customer's full refund + credit (per PRD Journey 6 outcome) is admin-discretionary (FR62 + Epic 8 Story 8.6) regardless of fault finding.

**Given** the legal-review requirement
**When** the developer creates the form
**Then** a placeholder legal-review feature flag gates the form's "active" state — copy reviewed by Jen's $2-5K attorney before commercial launch (Tampa Bay-Sarasota Q1 2027 per PRD)
**And** the developer creates `docs/LEGAL_REVIEW_ITEMS.md` (or appends to deployment runbook) listing this story's design choices for attorney consultation: the graduated-response auto-pause logic; the FDACS-coordination consent flow; the disclaimers in the confirmation copy; the multi-vendor vs. single-vendor pausing distinction.

**Given** rate limiting (NFR17 + AR14)
**When** the customer submits foodborne-illness reports
**Then** rate-limit is much more permissive than general reports (e.g., max 3 per 24 hours rather than 5 — but still enforced to prevent abuse); the limit blocks with copy that says "If you have an urgent concern, contact us directly"
**And** repeated reports against the same vendor by the same customer surface to admin as a pattern flag (not blocking, just informational).

**Given** Vitest + integration tests with `Protects:` block — **scoped to event emission only**
**When** they run
**Then** tests cover: single-vendor submission emits `incident.foodborneIllnessReported` with `certainty: "single_vendor"` and `vendorOrders: [<one vendorOrderId>]`; multi-vendor submission emits the same event with `certainty: "multi_vendor"` and the full selected `vendorOrders` array; "not sure" submission emits the event with `certainty: "uncertain"` and `vendorOrders: []`; FDACS opt-in flag is captured in the event payload and flows correctly to the audit log; the structured intake (symptom onset, products, household members, contact info) is captured in the event payload exactly as submitted
**And** intentional-break check: removing the `certainty` field from the event payload causes the assertion to fail; mis-populating `vendorOrders` (e.g., setting it to `[]` for a single-vendor submission) causes the assertion to fail.

**Note on test boundary:** Story 7.6's tests verify *event emission with the correct payload*. The downstream **graduated-response auto-pause behavior** (single-vendor → auto-pause that vendor; multi-vendor / uncertain → no auto-pause) is owned by Story 8.4's subscriber and is tested in Story 8.4's `Protects:` block. This split keeps Story 7.6 independently completable without requiring Story 8.4 implementation, and keeps the legally-defensible graduated-response assertion in the story that owns the behavior.

### Story 7.7: "Tell us where to launch next" interest signal capture (FR49)

As **a curious visitor or existing customer who lives outside Farm2Table's current launch metros**,
I want **a public form where I can tell Farm2Table where I'd like them to launch next, what products I'm interested in, and optionally my email for "let us know when you launch in my area" follow-up**,
so that **my interest counts toward the launch-priority decisions Jen makes (the PRD's GTM expansion strategy depends on this signal), and I can be notified when Farm2Table arrives**.

**Acceptance Criteria:**

**Given** the marketplace app exists
**When** the developer creates `apps/marketplace/app/launch-interest/page.tsx`
**Then** the route is added to `proxy.ts publicRoutes` (anonymous-accessible per FR49)
**And** the form captures: location (zip code — required, validated as US zip; city/state derived for display), product interests (multi-select from cert/practice/category taxonomy from Epic 4 Story 4.6's seed data), optional email (with separate opt-in checkbox: "Email me when Farm2Table launches in my area" — lifecycle tier per UX-DR56), optional first name
**And** the form uses React Hook Form + Zod per AR8.

**Given** form submission
**When** the visitor submits
**Then** a `launchInterest` row is written with the structured fields, `submittedAt`, and `consentToContact: boolean` (true if email + opt-in checkbox both filled)
**And** rate limiting per AR14: max 3 submissions per IP per 24 hours (token bucket) to prevent abuse
**And** if the visitor opted in to follow-up, a confirmation email goes out via canonical pipeline ("Thanks for telling us about your area — we'll reach out when we launch nearby")
**And** if no opt-in, no email is sent (consent boundary respected).

**Given** the form is accessible from contextual surfaces
**When** the developer wires entry points
**Then** a "Tell us where to launch next" link/CTA is placed on: Epic 1 Story 1.10's `/for-farmers` and `/about` marketing pages; Epic 4 Story 4.5's geo landing pages when no results found (the "no farms in <city> currently offer <product>" empty state — UX-DR28); the marketplace footer (Epic 1 Story 1.8); a banner shown to visitors whose IP geolocates to a non-launched metro (banner is dismissable per-session).

**Given** the admin dashboard surfaces aggregated demand
**When** Epic 8's admin business-metrics dashboard renders
**Then** it shows aggregated launch interest by metro (zip-rolled-up to metro-area boundaries) with the count of unique submissions, the most-requested products per metro, and trend over time
**And** this data drives the launch-priority decisions per PRD GTM strategy (Tampa Bay-Sarasota Q1 2027 → Metro #2 Q1–Q2 2028 etc.).

**Given** Playwright E2E with `Protects:` block
**When** the test runs the form submission with and without opt-in
**Then** submission succeeds; opt-in case sends the confirmation email via Resend sandbox; non-opt-in case does not send an email; rate-limit blocks excessive submissions; admin dashboard query reflects the new submission within seconds
**And** axe-core passes
**And** intentional-break check: removing the opt-in gate causes a non-opted-in visitor to receive an email — test fails.

## Epic 8: Admin Enforcement, Incident Response & Compliance Operations

The admin (Jen at MVP) operates the platform from the admin app at `admin.farm2table.app` with mandatory 2FA per NFR12. The business-metrics dashboard surfaces every load-bearing PRD signal at a glance. Customer reports route into a Linear-tier dense queue with per-`vendorOrder` scoping; investigation tools include admin-vendor and admin-customer messaging through the in-app inbox plus deep-linking to the order detail. Enforcement actions (warn / suspend / restore / remove) write to the immutable audit log. Foodborne-illness incidents follow the graduated-response design — single-vendor reports auto-pause that vendor; multi-vendor or "I'm not sure" reports flag for high-priority investigation without auto-pausing anyone unjustly. Vendor cancellation rates are tracked against admin-configurable thresholds with auto-warn and auto-suspend escalation. Permit/cert expiry alerts ramp up at 90/60/30 days then auto-pause on expiry. Admin discretionary refunds use the same per-`vendorOrder` batched contract from Epic 5 Story 5.8.

### Story 8.1: Admin app shell + business-metrics dashboard + legal review doc (NFR55, AR50, AR65)

As **Jen (the admin)**,
I want **the admin app at `admin.farm2table.app` with a top nav covering Dashboard / Verification / Reports / Incidents / Enforcement / Audit log / Feature flags / Monitoring, mandatory 2FA enforced at the network boundary, dark theme by default, and a business-metrics dashboard surfacing every load-bearing PRD metric**,
so that **I have one place to see how the platform is performing, the surfaces I need for day-to-day enforcement and investigation are one tab away, and the platform's compliance posture (mandatory 2FA, audit log, immutable record) is visible by default**.

**Acceptance Criteria:**

**Given** the admin app exists at `admin.farm2table.app`
**When** the developer creates `apps/admin/app/layout.tsx`, `providers.tsx`, `proxy.ts`, `global-error.tsx` and the `AdminTopNav` component in `packages/ui/components/AdminTopNav/`
**Then** `AdminTopNav` renders logo + tabs (Dashboard / Verification / Reports / Incidents / Enforcement / Audit log / Feature flags / Monitoring) + theme toggle (default dark per UX-DR29 Linear pattern) + admin user identity
**And** `proxy.ts` enforces platform-admin Clerk org membership + mandatory 2FA (NFR12) at the network boundary; non-admin users get redirected to a clear "this area requires platform-admin access" page
**And** **no `publicRoutes`** — every admin route is auth-gated.

**Given** the dashboard is the default landing
**When** the developer creates `apps/admin/app/dashboard/page.tsx`
**Then** the page surfaces business metrics in a dense card grid (UX-DR4 dense density variant): GMV (today / 7-day / 30-day / all-time); orders count (same windows); vendor onboarding velocity (applications/week, approvals/week); admin queue depth (verification queue from Epic 2, customer reports from Story 8.2, incidents from Story 8.4); marketplace-sourced order ratio with the PRD's 20%-by-month-6 threshold called out in red/yellow/green per current state; customer reorder rate within 30 days against the ≥25% PRD threshold; cart abandonment when ≥2 pickup locations against the <40% PRD threshold; vendor cancellation rates aggregate with FR58 threshold breaches surfaced.

**Given** cross-cutting metrics from other epics
**When** the dashboard renders
**Then** it includes: marketplace-facilitator threshold dashboard from Epic 5 Story 5.4 (per-state YTD sales / threshold / registration status); aggregated launch interest by metro from Epic 7 Story 7.7 (zip-rolled-up to metro boundaries with count, top requested products, trend); substitute click-through rate + 14-day-follow-on rate from Epic 6 Story 6.6 (against PRD's ≥30% CTR / ≥50% follow-on targets); webhook delivery health from Story 5.7 + Epic 1 Story 1.5 (Stripe / Clerk / Resend success rates per event type per NFR56)
**And** every metric supports drill-down: click → routes to the relevant detail surface (e.g., click marketplace-sourced ratio → routes to a detailed view by vendor and metro).

**Given** the dashboard is for sub-linear founder bandwidth
**When** the developer wires alert badges
**Then** any metric breaching its PRD threshold renders with a `--destructive` badge + explicit alert (e.g., "Marketplace-sourced ratio dropped below 20% — strategy revisit needed")
**And** alerts are persistent (don't auto-dismiss) until resolved.

**Given** dark theme default
**When** the admin first loads the app
**Then** dark theme is the default per UX-DR29 Linear pattern; toggle persists user choice (UX-DR2 light + dark mode parity)
**And** axe-core passes WCAG 2.1 AA contrast in both modes (verifies the dashboard's denser surfaces meet AA — admin surfaces are pragmatic-AA per NFR47, but contrast and keyboard nav are mandatory).

**Given** legal review documentation per AR65 + Epic 7 Story 7.6's reference
**When** the developer creates `docs/LEGAL_REVIEW_ITEMS.md`
**Then** the doc enumerates items requiring attorney consultation before commercial Tampa-Bay-Sarasota launch (Q1 2027): foodborne-illness graduated-response auto-pause logic (single-vendor pauses; multi-vendor / uncertain does not auto-pause); vendor agreement pause-clause language for "reasonable basis" pausing; ToS framing on customer self-service cancellation (currently routed via vendor through messaging); FDACS-coordination consent flow disclosures; Do-Not-Sell-or-Share enforcement on a platform that doesn't currently sell data (NFR28); cookie-banner consent language; account-deletion grace-window legal sufficiency; per-`vendorOrder` admin-action scoping rationale
**And** the doc is referenced from `README.md` and `docs/DEPLOYMENT_RUNBOOK.md` so the launch-readiness checklist surfaces it.

**Given** Playwright E2E with `Protects:` block
**When** the test runs admin sign-in (with 2FA simulated) → dashboard load → click on each metric for drill-down
**Then** all surfaces render correctly; metrics reflect QA-tier seeded data; alert badges fire when seeded data crosses thresholds; non-admin user is redirected from `/admin/*`
**And** intentional-break check: removing the 2FA enforcement at `proxy.ts` exposes admin routes to non-2FA users — test fails.

### Story 8.2: Customer report queue + admin investigation tools (FR54)

As **Jen**,
I want **a Linear-tier dense queue at `/admin/reports` showing all customer reports (misrepresentation, cancellation patterns, service quality, foodborne-illness as cross-link to incident queue) with per-`vendorOrder` scoping, deep-link to the order detail at `/admin/orders/[orderId]?focus=<vendorOrderId>`, admin-vendor + admin-customer messaging via the in-app inbox, and structured resolution outcomes**,
so that **investigation time stays sub-linear as customer count grows, the per-`vendorOrder` admin scoping (Jen's design call) keeps each investigation focused on the right vendor, and the audit log captures the full investigation timeline for regulatory defense (NFR62)**.

**Acceptance Criteria:**

**Given** the admin app shell exists from Story 8.1
**When** the developer creates `apps/admin/app/reports/page.tsx` composing Epic 2 Story 2.7's `AdminTriageQueue` component
**Then** the queue lists all `customerReports` from Epic 7 Story 7.5 + 7.6 sorted by submitted-at descending with state-pill filtering (pending / under-investigation / resolved-no-action / resolved-warning / resolved-suspended / resolved-removed / referred-to-incident)
**And** each row shows: customer first-name + last-initial (per minimal-PII pattern); vendor name; report type; days-since-submission; state pill
**And** `j/k/↵/a/r/x/⌘K` keyboard shortcuts are wired (with action keys mapped to: `↵` open detail, `r` resolve, `x` reject, `⌘K` filter palette).

**Given** opening a report
**When** the admin presses `↵` or clicks a row
**Then** the row inline-expands showing: full structured report payload (the customer's intake from Epic 7 Story 7.5), the customer's recent report history with this vendor (pattern detection), the vendor's report history across all customers (pattern detection on the vendor side), and a deep-link CTA to `/admin/orders/[orderId]?focus=<vendorOrderId>` (per Jen's per-`vendorOrder` admin-scoping design)
**And** an investigation timeline panel below shows audit-log entries scoped to this report (admin actions taken so far + admin notes).

**Given** admin-vendor + admin-customer messaging
**When** the admin needs to communicate
**Then** the report detail panel offers "Message vendor" and "Message customer" actions
**And** each opens a thread in the in-app inbox from Epic 6 Story 6.3 — admin's read-any-thread access is already wired and audit-logged per Epic 6 Story 6.3
**And** vendor sees the message in their `apps/vendor/app/messages` inbox; customer sees it in `apps/marketplace/app/(customer)/messages`.

**Given** investigation tools
**When** the admin investigates
**Then** the panel includes: "View related orders" (lists orders involving this vendor for this customer); "Request more info from customer" (templated message in the messaging thread); "Request response from vendor" (templated message); "View vendor compliance docs" (links to the vendor's verified docs from Epic 2 Story 2.4 — read access via `adminDocReadUrl` signed URL with admin-only access)
**And** all admin viewing actions on PII or compliance docs write to the audit log (NFR19 + NFR62).

**Given** structured resolution
**When** the admin resolves a report
**Then** they pick a structured outcome from a curated list: **No action** (false alarm / insufficient evidence); **Warning issued** (links to Story 8.3 warn action); **Suspended pending action plan** (links to Story 8.3 suspend); **Removed** (links to Story 8.3 remove); **Referred to incident** (only valid for foodborne-illness reports — routes to Story 8.4 incident queue)
**And** structured resolution writes to `customerReports.resolution`, `customerReports.resolvedAt`, `customerReports.resolvedBy`
**And** the customer receives a `ReportResolved` email with the outcome and any admin freetext context
**And** the audit log records the resolution with the actor.

**Given** admin sees the whole order at `/admin/orders/[orderId]?focus=<vendorOrderId>` (Jen's design call)
**When** the admin navigates from a report
**Then** the order detail page shows the full order with per-`vendorOrder` sections; auto-scrolled to the focused vendorOrder; report context inline (the customer's structured report visible adjacent to the lines they're complaining about); refund/cancel/message actions scoped per-`vendorOrder` (Story 8.7 admin discretionary refunds; messaging from this story).

**Given** rate-limit + spam protection
**When** a single customer files >5 reports in a rolling 7 days
**Then** the queue surfaces them with a "high-volume reporter" pattern flag (informational; does not block investigation)
**And** any report from a customer with this flag includes the pattern in the report detail panel.

**Given** Playwright E2E with `Protects:` block
**When** the test runs report submission (Epic 7 Story 7.5) → admin queue surfaces it → admin opens detail → resolves with "No action" → customer receives ReportResolved email
**Then** the queue updates correctly; the resolution is recorded in audit log; per-`vendorOrder` deep-link works
**And** axe-core passes
**And** intentional-break check: removing the per-`vendorOrder` deep-link causes the admin to lose scope context — test fails.

### Story 8.3: Admin enforcement actions — warn / suspend / restore / remove (FR55)

As **Jen**,
I want **canonical enforcement actions (warn / suspend / restore / remove) callable from the report queue, the incident queue, the vendor profile page, or as a direct CLI-style action — each with structured reason capture, templated communications to the vendor, automatic platform state updates, and immutable audit log entries**,
so that **enforcement is consistent across investigation paths, the vendor agreement's enforcement loop has a single canonical implementation rather than ad-hoc actions, and the regulatory paper trail (NFR59-66) is complete for any state AG inquiry or litigation discovery**.

**Acceptance Criteria:**

**Given** the admin app shell exists
**When** the developer creates the canonical enforcement Server Actions in `apps/admin/app/enforcement/actions.ts`
**Then** four actions exist: `warn(vendorId, reason, message)`, `suspend(vendorId, reason, message, requireActionPlan?)`, `restore(vendorId, reason, message)`, `remove(vendorId, reason, message)`
**And** each is callable from any admin surface (report detail panel from Story 8.2; incident detail from Story 8.4; vendor profile page; an `/admin/enforcement` direct-action page).

**Given** **Warn**
**When** the admin invokes warn
**Then** mutation writes a `vendorEnforcementActions` row (`vendorId`, `actionType: "warn"`, `reason`, `message`, `actorId`, `at`)
**And** sends a `VendorWarningIssued` email via canonical pipeline (transactional, always-sent) with the reason and message
**And** writes a notification to the vendor's NotificationCenter (UX-DR32 — bell-icon visible in `VendorTopNav` from Epic 3 Story 3.1)
**And** emits `vendor.warned` domain event
**And** writes audit log entry per NFR61
**And** vendor's `organizations` row remains `status: "active"` (warnings don't suspend).

**Given** **Suspend**
**When** the admin invokes suspend
**Then** mutation writes the enforcement row, transitions `organizations.status: "active" → "suspended"`, sets `suspendedReason` + `requireActionPlan: boolean`
**And** Convex publishes a coordinated update so: vendor's published products are hidden from public queries (their `products.status` doesn't change but the public query filters out products whose vendor is suspended); vendor portal shows a clear suspension banner with reason, restore-conditions copy, and "Submit corrective action plan" CTA if `requireActionPlan === true`
**And** sends `VendorSuspended` email + sets refund-pending payouts on hold per Epic 5 Story 5.9 inspection-window logic
**And** emits `vendor.suspended` domain event
**And** writes audit log entry; the suspension is the documented action that turns "willful blindness" risk into "actively enforcing" defense per the PRD's risk mitigation framing.

**Given** **Restore**
**When** the admin invokes restore
**Then** mutation validates the precondition (e.g., if suspended `requireActionPlan: true`, an `actionPlans` row with `status: "approved"` must exist; if suspended for `compliance_doc_expired`, the document must now be `status: "verified"` per Story 8.6)
**And** transitions `organizations.status: "suspended" → "active"`, products re-publish to public queries, suspension banner clears
**And** sends `VendorRestored` email
**And** previously-held payouts (Epic 5 Story 5.9 inspection-window holds tied to this suspension) are released for processing
**And** emits `vendor.restored` event + audit log entry.

**Given** **Remove**
**When** the admin invokes remove
**Then** mutation transitions `organizations.status: "removed"` (terminal — no automatic restore path; re-application requires a new vendor org from scratch per Epic 2 Story 2.10's pattern)
**And** Clerk Org is deactivated via Clerk API (vendor team members can't sign in); customer-facing `/farms/<slug>` page returns 410 Gone (per UX-DR54 — clear, not silent failure)
**And** open vendorOrders are flagged for admin review — admin manually decides per `vendorOrder`: refund customer (Story 8.7); allow vendor to fulfill (rare, only if vendor is removed for non-fulfillment reasons); other handling
**And** sends `VendorRemoved` email
**And** emits `vendor.removed` event + audit log entry; the removal is the documented severe-incident action (PRD Journey 6 path) and the audit-trail entry is what protects in litigation discovery.

**Given** the vendor agreement enforcement loop (warning → suspension → removal)
**When** a vendor accumulates enforcement actions over time
**Then** the admin sees the vendor's full enforcement history on the vendor profile page (`/admin/vendors/[orgId]`)
**And** patterns (e.g., 3 warnings in 90 days) surface in the queue as recommended-escalation flags (advisory; admin still decides).

**Given** corrective action plans (when `requireActionPlan === true`)
**When** the suspended vendor submits an action plan via vendor portal
**Then** an `actionPlans` row is written with the plan content; admin reviews via the report queue (Story 8.2 mechanism) and approves/rejects/requests-more
**And** approval triggers admin's restore action.

**Given** Playwright E2E with `Protects:` block
**When** the test runs warn → suspend → restore → remove sequences for a test vendor
**Then** state transitions are correct; emails fire; audit log is complete; products visibility tracks vendor status; restore validates preconditions; remove triggers Clerk Org deactivation
**And** intentional-break check: skipping the audit log write on a suspend action causes the regulatory-paper-trail assertion to fail.

### Story 8.4: Foodborne-illness incident response with graduated response (FR56 + FR57)

As **Jen**,
I want **a dedicated incident queue at `/admin/incidents` with the graduated-response pattern wired (single-vendor reports auto-pause that vendor; multi-vendor or "I'm not sure" reports flag for high-priority investigation without auto-pausing anyone), 1-hour acknowledgment + 4-hour customer-call SLAs surfaced, structured investigation-timeline tooling, FDACS-coordination report generation when consent is given, and resolution paths (no-fault-found / vendor-at-fault / serious-incident-removal)**,
so that **the regulatory framing in the PRD's Journey 6 is operationalized correctly, F2T isn't legally exposed by auto-pausing vendors on speculative reports (the graduated-response design is the legal defense), and the investigation timeline is regulatory-defensible per NFR62**.

**Acceptance Criteria:**

**Given** the admin app shell from Story 8.1
**When** the developer creates `apps/admin/app/incidents/page.tsx` composing `AdminTriageQueue`
**Then** the queue subscribes to `incident.foodborneIllnessReported` events from Epic 7 Story 7.6 with state-pill filtering (acknowledgment-pending / under-investigation / FDACS-coordinating / resolved-no-fault / resolved-vendor-at-fault / resolved-removed)
**And** each row shows: incident reference number; certainty level (`single_vendor` / `multi_vendor` / `uncertain`); affected vendor count; symptom-onset date; minutes since submission (with red highlight if past 1-hour-acknowledgment SLA); state pill.

**Given** the auto-pause routing per the graduated-response design
**When** an `incident.foodborneIllnessReported` event lands with `certainty: "single_vendor"`
**Then** Story 8.4's handler **auto-pauses that vendor's listings** (calls Story 8.3's `suspend(vendorId, "foodborne_illness_report_received", "Listings paused as a precaution while we investigate. Not a finding of fault.", requireActionPlan: false)`)
**And** sends a `FoodborneIllnessIncidentNotice` email to the vendor's owner explaining the precautionary pause, the 24-hour vendor-response window, and the investigation procedure
**And** sends a high-priority alert to admin (queue gets a red state pill).

**Given** multi-vendor or uncertain certainty
**When** the event lands with `certainty: "multi_vendor"` or `certainty: "uncertain"`
**Then** the handler **does NOT auto-pause any vendor** — the graduated-response design from Jen's call
**And** the handler creates the incident queue row with red `acknowledgment-pending` state pill, 1-hour SLA timer running
**And** sends a urgent alert to admin via email + Sentry alert + `BetterStack` page (if configured)
**And** the audit log records the receipt of the report with all selected vendors but no enforcement action taken yet (NFR62 — paper trail is complete even without action).

**Given** admin acknowledges within the SLA
**When** the admin opens the incident detail
**Then** they see: full structured intake from Epic 7 Story 7.6 (symptom onset, products, household, vendor selection, FDACS opt-in); customer contact info; investigation-timeline panel for logging calls and evidence; vendor history (each selected vendor's prior reports + compliance status); cross-link to the customer's order detail at `/admin/orders/[orderId]?focus=<vendorOrderId>` per the per-`vendorOrder` scoping
**And** the SLA timer pauses on first admin acknowledgment.

**Given** the customer-call SLA
**When** the admin needs to call within 4 business hours
**Then** the timeline tool prompts admin to record the call (timestamp, summary, follow-up actions)
**And** the audit log captures the call as part of the regulatory paper trail
**And** if the SLA is missed, the incident queue surfaces a `--destructive` warning.

**Given** investigation narrows source (multi-vendor or uncertain case)
**When** the admin determines a specific vendor is the most-likely source
**Then** the admin can manually invoke Story 8.3's suspend on that targeted vendor with reason `"foodborne_illness_evidence_narrowed_to_this_vendor"` and an evidence summary
**And** the audit log records the basis for the targeted suspension (defensible under the "reasonable basis" standard)
**And** other selected vendors remain unaffected.

**Given** FDACS coordination (FR57)
**When** the customer's intake had FDACS-contact opt-in checked AND the admin determines FDACS coordination is appropriate
**Then** the admin can generate a FDACS-ready report bundle from the incident detail panel — exports the structured intake + investigation timeline as a PDF + CSV
**And** the admin records the coordination start (timestamp, FDACS contact name, action items) in the timeline
**And** subsequent FDACS communications are logged in the timeline
**And** the FDACS bundle generation writes an audit log entry.

**Given** resolution paths
**When** the admin closes the incident
**Then** structured outcomes:
- **No fault found** — restores the (auto- or manually-)paused vendor via Story 8.3's restore action with `reason: "no_fault_found"` and a documented "no fault" note in the audit log; customer receives full refund + credit at admin discretion via Story 8.7; PRD Journey 6 happy-path
- **Vendor at fault** — vendor remains suspended pending corrective action plan; refund pursued through vendor's product-liability insurance per the vendor agreement; if vendor agreement doesn't carry insurance for that category (PRD's tiered insurance — cottage food doesn't require), the platform's product-liability insurance ($42-100/mo per PRD §Domain-Specific Requirements) is the secondary recourse; the audit-log entry references the indemnification clause invocation
- **Serious or repeat incident** — `remove` action via Story 8.3 with reason `"foodborne_illness_serious_or_repeat"`; permanent removal from platform; PRD's vendor-agreement-enforcement-as-defense framing is documented in the audit log entry.

**Given** Playwright E2E with `Protects:` block
**When** the test runs single-vendor incident submission (seeded `incident.foodborneIllnessReported` with `certainty: "single_vendor"` → auto-pause → admin acknowledges → no-fault resolution → restore)
**Then** auto-pause fires immediately on the named vendor only; admin SLA is tracked; no-fault restore works; customer refund + credit issued via Story 8.7
**And** runs multi-vendor incident submission (seeded event with `certainty: "multi_vendor"` and multiple `vendorOrders` → **no auto-pause on any vendor** → admin acknowledges within 1h → narrows to one vendor → manually suspends targeted vendor → at-fault resolution → corrective action plan path)
**And** runs uncertain incident submission (seeded event with `certainty: "uncertain"` and empty `vendorOrders` → **no auto-pause on any vendor** → admin acknowledges within 1h → if source remains unidentifiable, no vendor paused, F2T documents inability-to-identify-source for regulatory record)
**And** intentional-break check: changing the auto-pause trigger to fire on `multi_vendor` or `uncertain` events causes the graduated-response assertion to fail (this is the legally-defensible boundary — the test owns it)
**And** axe-core passes on the incident queue.

**Note on test boundary:** Story 8.4 owns the **graduated-response system behavior** assertions (single → auto-pause; multi/uncertain → no auto-pause). Tests are seeded with `incident.foodborneIllnessReported` events directly rather than driving them through Story 7.6's customer form, so this story is independently completable and the legally-defensible graduated-response design is regression-protected here regardless of Story 7.6's implementation order.

### Story 8.5: Vendor cancellation-rate tracking with admin-configurable thresholds (FR58)

As **Jen**,
I want **automated vendor cancellation-rate tracking computed on a rolling 30-day window with admin-configurable thresholds for warn (initially 10%) and auto-review (initially 20%), automatic warn-emails when crossed, automatic admin-queue review entries at the higher threshold, and auto-suspend on repeated breaches — all with a minimum sample size to avoid noise on low-volume vendors**,
so that **vendor service quality stays measurable and self-enforcing without consuming founder bandwidth, vendors see their own cancellation rate transparently with the threshold values, and the system protects against one-off-flukes inflating into actions via the minimum-sample guard**.

**Acceptance Criteria:**

**Given** Story 6.5 records vendor cancellations and Epic 5 Story 5.6 records orders
**When** the developer adds `vendorCancellationStats` table (or computed-on-demand query) and a daily Convex cron `vendors/internal.computeCancellationRates`
**Then** the cron runs nightly, computing per-vendor: total `vendorOrders` placed in last 30 days; total `vendorOrders` with vendor-initiated cancellation in same window; cancellation rate = cancelled/placed (only computed if placed >= minimum sample, default 10)
**And** writes results to `vendorCancellationStats` for fast dashboard reads
**And** emits `vendor.cancellationRateComputed` event per vendor.

**Given** admin-configurable thresholds (FR58)
**When** the developer creates `featureFlags` rows for `cancellationRate.warnThreshold` (default 0.10), `cancellationRate.autoReviewThreshold` (default 0.20), `cancellationRate.minimumSampleSize` (default 10), `cancellationRate.windowDays` (default 30)
**Then** admin can edit these via `/admin/feature-flags` (Story 8.1's nav tab) which writes to `featureFlags` table
**And** changes take effect on the next cron run
**And** changes are audit-logged (NFR61).

**Given** threshold breach detection
**When** a vendor's computed rate crosses warnThreshold (going from below to above)
**Then** mutation sends `VendorCancellationRateWarning` email to vendor's owner with the rate, the threshold, the rolling window, the count of cancelled vs. placed, and improvement guidance
**And** writes a notification to vendor NotificationCenter
**And** writes audit log entry

**And** when the rate crosses autoReviewThreshold
**Then** mutation creates a row in the report queue (Story 8.2) with `reportType: "system_cancellation_threshold"`, structured payload (vendor, rate, threshold, sample size, window)
**And** admin reviews per the standard queue flow.

**Given** auto-suspend on repeated breaches
**When** a vendor remains above autoReviewThreshold for 14 consecutive days OR breaches autoReviewThreshold a second time within 90 days
**Then** the system auto-invokes Story 8.3's suspend with `reason: "cancellation_rate_threshold_persistent"`, `requireActionPlan: true`
**And** vendor sees clear suspension reason on their portal banner with the rate, threshold, window
**And** admin can override (manually restore via Story 8.3 if action plan is acceptable).

**Given** vendor transparency
**When** the vendor views their own dashboard from Epic 3 Story 3.7
**Then** their cancellation rate is visible alongside the threshold values (so they know where they stand)
**And** UX is non-punitive — the metric is shown alongside other dashboard stats, not as a "naughty list"
**And** if their sample is below minimum, they see "Not enough orders yet — your cancellation rate will compute once you reach 10 orders".

**Given** dashboard surfacing for admin
**When** the admin views Story 8.1's business-metrics dashboard
**Then** vendor cancellation rates aggregate is shown with a list of vendors at/above warnThreshold
**And** the admin can drill down to per-vendor detail.

**Given** Playwright E2E with `Protects:` block
**When** the test runs threshold breaches with QA-tier seeded data (vendor with 12% rate; vendor with 22% rate; vendor with 5% rate; vendor with 25% rate persistent)
**Then** warn email fires for the 12% and 22% vendors (both above warnThreshold); auto-review queue entry for the 22% and 25% vendors; auto-suspend for the 25%-persistent vendor; minimum-sample guard prevents low-volume vendors from triggering
**And** intentional-break check: removing the minimum-sample guard causes a 1-of-2-cancelled vendor to incorrectly trigger 50% threshold breach.

### Story 8.6: Permit + certification expiry alerts with auto-pause on expiry (FR59)

As **Jen and the platform**,
I want **automated permit/cert expiry tracking with 90/60/30-day-before-expiry email alerts to the vendor, automatic listing pause on expiry day if not renewed, a renewal verification flow that's lighter than full onboarding, and audit-log entries for the regulatory paper trail**,
so that **the platform doesn't carry vendors with expired permits (compliance defense), vendors get plenty of warning to renew without surprise pauses, and the renewal verification flow doesn't require redoing the full onboarding wizard**.

**Acceptance Criteria:**

**Given** Epic 2 Story 2.4 captures `vendorDocuments.expiry` for documents that have expiry dates (state agricultural license, FDACS commercial food permit, cottage food registration, COI)
**When** the developer adds the daily Convex cron `vendorDocuments/internal.scanExpiry`
**Then** the cron scans `vendorDocuments` where `status: "verified" AND expiry IS NOT NULL` daily
**And** computes days-to-expiry per document
**And** triggers per-document alerts at 90 / 60 / 30 days before expiry (each only once per threshold per document — uses `vendorDocuments.expiryAlertsSent[]` to track)
**And** triggers expiry on the day-of: `expiry <= now AND status === "verified"`.

**Given** advance-warning alerts
**When** a doc reaches 90 / 60 / 30 days before expiry
**Then** sends `ComplianceDocExpiring` email (transactional always-sent per UX-DR56) with the doc name, the expiry date, the renewal instructions per the rules engine (Epic 2 Story 2.1 — points to FDACS link or state registry depending on doc type), and a deep link to upload the renewed doc
**And** writes notification to vendor NotificationCenter
**And** emits `complianceDoc.expiryWarningSent` domain event with the threshold (90 / 60 / 30)
**And** vendor sees their expiring docs prominently on their dashboard from Epic 3 Story 3.7 (red highlight if within 30 days).

**Given** expiry day
**When** the day-of-expiry hits without a renewal
**Then** the auto-pause action calls Story 8.3's suspend with `reason: "compliance_doc_expired"`, `requireActionPlan: false` (the action plan IS uploading the renewed doc; no separate plan)
**And** sends `ComplianceDocExpired` email + `VendorListingsAutoPaused` email with clear copy: "Your <doc> expired today. Listings have been paused. Upload your renewed <doc> to restore listings"
**And** emits `complianceDoc.expired` event
**And** writes audit log entry with the doc, expiry date, vendor.

**Given** renewal flow
**When** the suspended vendor uploads a renewed document via Epic 2 Story 2.4's pipeline
**Then** the new `vendorDocuments` row is created with `status: "pending"` and a reference to the previous doc (`previousDocId`)
**And** routes to a lighter admin verification queue at `/admin/verification-queue?type=renewal` (separate filter from full-onboarding queue) — only the renewed doc needs review, not the full onboarding
**And** admin verifies (approve / request-more / reject) using the same `RulesEngineChecklist` pattern from Epic 2 Story 2.7 — but the checklist is scoped to just this one doc.

**Given** renewal approval
**When** admin approves the renewed doc
**Then** the previous doc is marked `status: "superseded"` (not deleted — retention per NFR63)
**And** the new doc becomes `status: "verified"`, with the new `expiry` date
**And** Story 8.3's restore action is automatically invoked with `reason: "compliance_doc_renewed"`
**And** sends `VendorRestored` email
**And** vendor's listings re-publish.

**Given** the renewal flow handles the case where the previous doc had partially incorrect data
**When** admin requests more info on the renewed upload
**Then** the same templated request-more-info flow from Epic 2 Story 2.9 applies
**And** the vendor remains suspended until the doc is approved.

**Given** retention per NFR63
**When** documents transition to `status: "superseded"`
**Then** they are retained for the document's vendor account duration + 7 years after deactivation
**And** no application code path can hard-delete a doc before retention expires.

**Given** Playwright E2E with `Protects:` block
**When** the test runs (with QA-tier seeded data manipulating doc expiry dates): vendor with doc expiring in 30 days → email fires; vendor with doc expiring today → auto-suspend; vendor uploads renewal → goes to admin queue → admin approves → auto-restore
**Then** all paths work; emails fire from the canonical pipeline; audit log captures every transition; previous docs are retained as `superseded`
**And** intentional-break check: removing the per-threshold dedup (`expiryAlertsSent[]`) causes a doc to trigger multiple emails at the same threshold — test fails.

### Story 8.7: Admin discretionary refunds + customer credits (FR62)

As **Jen**,
I want **an order detail view at `/admin/orders/[orderId]` showing the full order with per-`vendorOrder` sections (per Jen's design call), where I can issue a per-`vendorOrder` batched refund (selecting lines from one vendor at a time, picking reason, submitting one batch) using Epic 5 Story 5.8's contract, and separately issue a customer credit for use on future orders**,
so that **discretionary refunds work correctly with the per-vendor independence principle (FR14), customer credits offer a non-monetary recourse for service issues without forcing a Stripe refund, and the audit log records every admin financial action for regulatory defense**.

**Acceptance Criteria:**

**Given** the admin app shell exists
**When** the developer creates `apps/admin/app/orders/[orderId]/page.tsx`
**Then** the page shows the full order with per-`vendorOrder` sections (one section per vendor in the order) per Jen's design call
**And** order-level metadata visible (customer name + masked email + order ID + placed-at + total)
**And** each `vendorOrder` section has its own action surface scoped to that vendor: Refund lines, Cancel lines (only if vendor hasn't yet — admin can act on vendor's behalf), Message vendor, Message customer, Open dispute (rare).

**Given** admin batched refund
**When** the admin clicks "Refund lines" on a `vendorOrder` section
**Then** a Sheet opens with checkboxes for each active line in that `vendorOrder` (lines already in `cancelled` / `refunded` state are read-only)
**And** the admin selects 1+ lines, picks reason from curated list (`compensation_for_service_issue | dispute_resolution | goodwill | other_with_explanation`), optionally adds a message
**And** clicks "Issue refund" → Server Action calls Stripe Refund API per line per Story 5.8 → calls `recordLineRefunds({ vendorOrderId, lineIds, reason, message?, initiator: "admin" })` per Story 5.8's contract.

**Given** the batched refund per Story 5.8
**When** the mutation completes
**Then** one batched event `vendorOrder.linesRefunded({ initiator: "admin" })` fires
**And** Story 5.8's `OrderLineRefunded` template subscriber consumes it (no substitute suggestions per Story 6.6 — admin discretionary context)
**And** the customer receives one consolidated email per vendor cancellation/refund event
**And** other vendors' lines on the same order remain completely unaffected (FR14 — Story 5.8 already enforces).

**Given** cross-`vendorOrder` admin actions in one investigation
**When** the admin needs to refund lines from Vendor A AND Vendor B
**Then** the admin makes two separate batched submissions (one per vendor)
**And** the customer receives two emails (one per vendor — correct per FR14 per-vendor independence and per Jen's design call: "the customer mentally tracks per-vendor portions independently").

**Given** customer credits (separate from Stripe refunds)
**When** the admin issues a credit instead of (or in addition to) a refund
**Then** mutation writes `customerCredits` row (`customerId`, `amount`, `reason`, `issuedBy`, `issuedAt`, `expiresAt?` (optional, default 1 year), `redeemedAt?`, `redeemedAgainstOrderId?`)
**And** sends `CustomerCreditIssued` email with the amount, reason, expiry (if applicable)
**And** writes audit log entry
**And** Epic 5 Story 5.5's checkout reads available credits and applies them at checkout (the credit balance is visible + redeemable; partial redemptions split into multiple `customerCredits` rows for clean accounting).

**Given** the credit redemption flow
**When** a customer with available credit places an order
**Then** the checkout summary shows: subtotals, fees, tax, then "Available credit: $X — apply" toggle, then total
**And** if applied, the credit reduces the customer's payment amount; the platform absorbs the credit (it's a goodwill cost, not a Stripe refund)
**And** vendor payouts are unaffected (vendor still gets their full share; the credit doesn't reduce vendor commission).

**Given** audit log entries (NFR61)
**When** any refund or credit action runs
**Then** structured audit entries record: actor (admin user), action type, amount, reason, message, affected vendor + customer + order
**And** queryable for FDACS / state-AG inquiries / litigation discovery (NFR62).

**Given** the admin can also see customer credits history
**When** the admin views a customer's profile (or the order detail page)
**Then** their credits balance + history is visible
**And** the admin can revoke a credit if it was issued in error (with audit log entry + customer notification).

**Given** Playwright E2E with `Protects:` block
**When** the test runs: admin selects 2 of 3 lines from Vendor A's `vendorOrder` → submits → one Stripe API loop, one Convex mutation, one email; the unselected 1 line stays `placed`; Vendor B's lines untouched
**Then** the customer receives exactly one email (per Story 5.8 batched contract)
**And** when admin issues a credit + a refund → customer receives the refund email + a separate credit email
**And** when customer redeems credit at checkout → balance reduces correctly; payout is unaffected
**And** intentional-break check: routing the admin refund through per-line submissions instead of the batched contract causes the "exactly one email per submission" assertion to fail.
