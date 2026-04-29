---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
filesIncluded:
  prd: _bmad-output/planning-artifacts/prd.md
  architecture: _bmad-output/planning-artifacts/architecture.md
  epics: _bmad-output/planning-artifacts/epics.md
  ux: _bmad-output/planning-artifacts/ux-design-specification.md
  supporting:
    - _bmad-output/planning-artifacts/prd-validation-report-2026-04-25.md
    - _bmad-output/planning-artifacts/prfaq-Farm2Table.md
    - _bmad-output/planning-artifacts/prfaq-Farm2Table-distillate.md
---

# Implementation Readiness Assessment Report

**Date:** 2026-04-26
**Project:** Farm2Table

## Document Inventory

| Type | File | Size | Modified |
|------|------|------|----------|
| PRD | `prd.md` | 142,296 B | 2026-04-25 |
| Architecture | `architecture.md` | 127,555 B | 2026-04-26 |
| Epics & Stories | `epics.md` | 377,507 B | 2026-04-26 |
| UX Design | `ux-design-specification.md` | 97,499 B | 2026-04-26 |

**Supporting context (not assessed directly):**
- `prd-validation-report-2026-04-25.md` — prior PRD validation pass
- `prfaq-Farm2Table.md`, `prfaq-Farm2Table-distillate.md` — PRFAQ source upstream of PRD

**Duplicates:** None.
**Missing required documents:** None.
**Notes:** `epics.md` is large (377KB); sharding deferred — non-blocking for readiness.

## PRD Analysis

PRD release mode: **phased** (MVP / Growth / Vision). Phase tags `[Growth]` / `[Vision]` on individual FRs flag deferred capabilities; everything untagged is MVP. Implementation readiness is being assessed against **MVP scope**.

### Functional Requirements (extracted)

**Marketplace Discovery & Provenance**
- **FR1:** Customers can browse the marketplace by product category, farm name, location, certification, and farming practice without authentication.
- **FR2:** Customers can view a farm profile that displays the farm's name, address, declared practices, verified third-party certifications, and the products it currently offers.
- **FR3:** Customers can view a product detail page that displays the product's vendor, price, available variants, fulfillment options, traceability fields the vendor provides, and applicable certifications.
- **FR4:** Customers can navigate to geo-targeted landing pages keyed by (product, city) that surface local farms offering that product.
- **FR5:** The Platform can present third-party certifications as filterable badges on listings, with verification linking back to the issuing body.
- **FR6:** The Platform can render farm profiles, product detail pages, and category/landing pages as indexable content with structured data so they appear in search-engine results.
- **FR7:** Customers can save farms to a personal saved-farms list accessible from their account, and view those farms' new products and availability changes.

**Multi-Vendor Cart, Checkout & Tax**
- **FR8:** Customers can add items from multiple vendors to a single cart and see each line item attributed to its vendor with the vendor's available fulfillment options.
- **FR9:** Customers can select fulfillment method per vendor (farm pickup, vendor-run local delivery, or vendor-run shipping) at checkout, where each option respects the vendor's configured availability for that product, the customer's location, and applicable per-state shipping eligibility.
- **FR10:** Customers can complete a single payment that splits across all vendors in the cart, with the Platform deducting per-vendor commission and platform service fee.
- **FR11:** The Platform can calculate sales tax per line item based on origin × destination × product tax category, applying state grocery exemptions and prepared-food taxability rules.
- **FR12:** The Platform can register as a marketplace facilitator and remit sales tax in each state once that state's facilitator threshold is reached.
- **FR13:** Customers and Vendors can receive per-vendor sub-receipts that show the vendor's items, prices, fulfillment method, and pickup/shipping details for that vendor's portion of the order.
- **FR14:** The Platform can issue per-line-item refunds that reverse the original payment split without affecting other vendors' line items in the same order.
- **FR15:** Vendors can receive payouts seven days after delivery confirmation for each fulfilled line item, net of commission and fees.

**Vendor Onboarding & Compliance Verification**
- **FR16:** Vendors can apply by selecting their state and one or more vendor categories (farm, cottage food, commercial food, beekeeper, egg producer, meat producer, dairy producer).
- **FR17:** Vendors are presented with the exact required documents/attestations/shipping-eligibility rules for their (state, category, products) from the rules engine.
- **FR18:** Vendors can upload required documents (state ag license, FDACS commercial food permit, cottage food registration, USDA exemption, apiary registration, business license, food handler cert, COI as applicable).
- **FR19:** Vendors can sign a compliance attestation acknowledging applicable state labeling, revenue-cap, and food-safety requirements.
- **FR20:** Vendors complete identity and bank-account verification through Stripe Connect's hosted onboarding before payouts.
- **FR21:** Vendors sign the vendor agreement before listings go live.
- **FR22:** The Platform blocks category × state combinations restricted by law (raw dairy in FL pet-only; raw milk for human consumption excluded; CBD/cannabis/regulated supplements; alcohol; restaurants/prepared meals; wholesale-to-business at MVP).
- **FR23:** The Platform defaults vendors in states with ambiguous interstate cottage food law (e.g., FL) to in-state-only shipping; vendors can extend coverage only to states their license actually authorizes.

**Vendor Storefront & Operations**
- **FR24:** Vendors can create/edit/publish/unpublish/remove product listings with variants, weight-based pricing, photos with required alt text, descriptions, traceability fields, and labeling fields.
- **FR25:** Vendors can edit their farm profile (name, address, practices, story, photos, certification claims, contact preferences).
- **FR26:** Vendors can configure fulfillment per product/product set: farm pickup with day/time-window availability, vendor-run local delivery by zip code with vendor-set fee, vendor-run shipping by destination state with vendor-set fee and packaging method.
- **FR27:** Vendors can manage inventory (current quantity, low-stock alerts, sold-out, restock).
- **FR28:** Vendors can view and act on incoming orders: accept, mark in preparation, ready/shipped, delivered, cancel, refund.
- **FR29:** Vendors can communicate with customers about active orders (hold/reschedule/cancellation).
- **FR30:** Vendors can view a sales dashboard showing GMV, orders, marketplace-sourced vs. vendor-shared-link orders, and tier-upgrade math.
- **FR31:** Vendors can share a storefront link displaying only their own products for use in their own customer outreach.
- **FR32:** Vendors can subscribe to the Foundation tier (free, 22% commission).
- **FR32a [Growth]:** Vendors can subscribe to Growth and Pro tiers when those launch in Phase 2.
- **FR33 [Growth]:** Vendors can purchase add-on capabilities individually (Email Promotions, Advanced Analytics, CSA Manager, Route Planner, Accounting Sync); all included free at Pro tier.
- **FR34 [Growth]:** Vendors can opt into featured-listing promotion for vendor-set durations and budgets.

**Order Lifecycle, Fulfillment & Substitute Discovery**
- **FR35:** Customers can view an order's overall status and per-line-item fulfillment status (preparing/ready/in transit/delivered) and pickup/shipping details.
- **FR36:** Vendors can cancel an order line, triggering automatic refund to the customer for that line, leaving other vendors unaffected.
- **FR37:** Customers can request a vendor hold their order for a later pickup/delivery date, subject to vendor acceptance.
- **FR38:** When a vendor cancels a line item, the Platform surfaces alternative Farm2Table vendors offering the same product category, with one-action reorder.
- **FR39:** The Platform displays per-vendor cancellation cutoffs on listings (typically 24–48 hours before fulfillment).
- **FR40 [Growth]:** The Platform matches substitutes by deeper attributes than category match (taxonomy depth, practice/certification compatibility, sub-product attributes).

**Customer Account, Trust & Reporting**
- **FR41:** Customers can create an account with email verification, accept the customer ToS, and complete first-order purchase.
- **FR42:** Customers can view order history, saved farms, payment methods, and account profile.
- **FR43:** Customers can export their account data (orders, profile) in a portable format.
- **FR44:** Customers can delete their account and the associated personal data the Platform stores, in accordance with applicable privacy law.
- **FR45:** Customers can exercise CCPA/CPRA rights including "Do Not Sell or Share" and access/deletion requests, with the Platform confirming each request.
- **FR46:** Customers can submit reports of suspected vendor misrepresentation with structured intake.
- **FR47:** Customers can submit foodborne-illness reports with structured intake (order ref, products consumed, symptom onset/description, household members, FDACS-contact consent).
- **FR48:** Customers can submit reports of vendor cancellation patterns or service quality issues.
- **FR49:** Customers can submit "tell us where to launch next" interest signals including location and product interests.

**Admin Verification, Enforcement & Incident Response**
- **FR50:** Admins view a vendor application queue with rules-engine-generated checklist, present/missing/wrong-doc status, format-validation results on permit numbers and expiry dates, and one-action public-registry links.
- **FR51:** Admins can approve, request additional/corrected documents (templated email with state-specific context), or reject the application (templated reason).
- **FR52 [Growth]:** The Platform auto-fills the verification checklist via AI-assisted document extraction and routes to a fast-lane queue when confidence is high.
- **FR53 [Growth]:** The Platform cross-checks documents against state public registries via state-specific adapters where APIs exist, with confidence scoring.
- **FR54:** Admins view a customer-report queue with structured intake and admin-vendor messaging tools.
- **FR55:** Admins can issue warnings, suspend listings, restore suspended listings, and remove vendors.
- **FR56:** The Platform automatically pauses a vendor's listings on receipt of a foodborne-illness report and notifies the vendor with an incident-notice email.
- **FR57:** Admins coordinate FDACS reporting with the affected customer and vendor; investigation timeline recorded in audit log.
- **FR58:** The Platform tracks vendor cancellation rates against configurable thresholds (initial: warn >10% over 30-day rolling window with ≥10 orders; auto-review >20%); thresholds and window length must be admin-configurable.
- **FR59:** The Platform sends permit/certification expiry alerts at 90/60/30 days before expiry and auto-pauses listings on expiry if not renewed.
- **FR60 [Growth]:** The Platform prompts all vendors annually to re-attest current compliance; non-response triggers listing pause.
- **FR61:** The Platform records every admin action in an immutable audit log with actor, timestamp, vendor/customer affected, and reason.
- **FR62:** Admins can issue refunds and credits as a discretionary action, recorded in audit log.

**Platform Communication & Real-Time Foundations**
- **FR63:** The Platform sends transactional emails for vendor application status, order confirmations and updates, vendor order notifications, cancellation notices, substitute-suggestion notices, expiry alerts, and incident notifications.
- **FR64:** Customers and Vendors can read messages from each other through an in-app inbox.
- **FR65:** The Platform ingests Stripe webhook events and propagates state changes through the same event-emission system as user-driven mutations.
- **FR66:** The Platform emits a domain event on every state change such that subscribers consume events without modifying the publishing code.
- **FR67 [Growth]:** Customers and Vendors receive in-app notifications via real-time push for order status changes, vendor messages, expiry alerts, admin requests.
- **FR68 [Growth]:** Vendors see live updates to their order list and dashboard without manual refresh.
- **FR69 [Growth]:** Admins see live updates to verification queue and report queue without manual refresh.
- **FR70 [Growth]:** Customers see live inventory counts on product pages and order tracking updates on order pages.
- **FR71 [Vision]:** Customers can opt into web push notifications for order updates and vendor alerts.
- **FR72 [Vision]:** Customers and Vendors can hold inventory during checkout with optimistic locking and live count visibility.

**Total FRs:** 73 (FR1–FR72 plus FR32a). **MVP-scope FRs:** 60. **Growth-tagged:** 11 (FR32a, FR33, FR34, FR40, FR52, FR53, FR60, FR67–FR70). **Vision-tagged:** 2 (FR71, FR72).

### Non-Functional Requirements (extracted)

**Performance**
- **NFR1:** SEO-critical pages achieve LCP <2.5s, INP <200ms, CLS <0.1 on mid-tier mobile (3G Fast equivalent), p75.
- **NFR2:** SSR pages return TTFB <600ms cached, <1s uncached, p95.
- **NFR3:** Authenticated dashboards reach interactive paint within 1.5s of navigation, p95.
- **NFR4:** Search/filter results return within 500ms for typical queries, p95.
- **NFR5:** End-to-end checkout (cart load → payment confirmation) completes within 8s for a 3-vendor order, p95, inclusive of Stripe round-trips.
- **NFR6:** Image delivery uses modern formats (AVIF/WebP fallback), responsive sizing, lazy loading; vendor product photos compressed to ≤200KB at displayed size, p95.

**Security**
- **NFR7:** All network traffic encrypted via TLS 1.3 (or current best practice); HSTS enforced; HTTPS-only.
- **NFR8:** Sensitive data at rest is encrypted (database, file storage, backups).
- **NFR9:** Customer payment card data is never stored on Farm2Table infrastructure; only Stripe-issued tokens.
- **NFR10:** Vendor banking, tax, and identity-verification data handled by Stripe Connect's hosted onboarding; never stored on Farm2Table.
- **NFR11:** Vendor-uploaded compliance documents stored with at-rest encryption and access-controlled to admin role only.
- **NFR12:** Admin authentication requires mandatory 2FA from day one (TOTP or hardware key).
- **NFR13:** Vendor authentication requires email verification at signup; 2FA optional at MVP, mandatory at Growth tier and above.
- **NFR14:** Customer authentication requires email verification before first order; passwords meet OWASP minimum strength rules (≥12 chars, breach-list checked).
- **NFR15:** Session tokens expire (idle ≤24h, absolute ≤30d), can be invalidated server-side; logout-everywhere works.
- **NFR16:** All Stripe webhook payloads have HMAC signature verification; unverified webhooks rejected.
- **NFR17:** Rate limiting protects auth endpoints, order placement, report submission, and password-reset flows.
- **NFR18:** Application secrets stored in env vars or managed secrets store; never committed to source control.
- **NFR19:** Internal staff PII access follows least-privilege; access logged in audit trail.
- **NFR20:** Annual security review (OWASP Top 10) starts at MVP+1 year or upon first incident.

**Privacy & Data Lifecycle**
- **NFR21:** CCPA/CPRA from day one; parallel-state-law compatibility (VCDPA, CPA, CTDPA, UCPA, others).
- **NFR22:** Customers can export all personal data within 24 hours of request, in JSON or CSV.
- **NFR23:** Customer account deletion purges PII within 30 days; audit-relevant references pseudonymized rather than deleted.
- **NFR24:** "Do Not Sell or Share" link prominently placed (footer of every page), functional, opt-out confirmed.
- **NFR25:** Cookie consent management distinguishes essential from analytics/marketing cookies; non-essential require opt-in.
- **NFR26:** DPAs in place with every third-party data processor (Stripe, email, analytics, error tracking, image CDN, foundation-model API at Growth).
- **NFR27:** EXIF metadata stripped from all uploaded images at upload, before storage or display.
- **NFR28:** Customer data is not sold or shared with third parties for marketing.
- **NFR29:** Personal data retention policies documented per category (food safety: 7 years; tax: 7 years; consumer privacy: per state law).

**Reliability & Availability**
- **NFR30:** Marketplace storefront uptime ≥99.9% at MVP, ≥99.95% by end of Y2.
- **NFR31:** Higher-priority availability during peak ordering windows (Sun 6–11pm local, market days for that metro); maintenance scheduled outside.
- **NFR32:** RTO ≤2 hours for total platform recovery from catastrophic failure.
- **NFR33:** RPO ≤15 minutes for the primary datastore.
- **NFR34:** Stripe webhook handlers are idempotent.
- **NFR35:** Background-job retry policies use exponential backoff; permanent failures surface to admin queue.
- **NFR36:** Transactional email queued and retried; eventual delivery success ≥99.5%.
- **NFR37:** Graceful degradation: non-critical service failures don't break core flows.
- **NFR38:** Disaster recovery procedure documented and tested annually starting Y2.

**Scalability**
- **NFR39:** MVP capacity: 1,000 concurrent browsing, 100 concurrent checkout, 50 active vendors, ≤200 daily orders.
- **NFR40:** Y2 capacity: 10,000 concurrent browsing, 500 concurrent checkout, 200 active vendors, ≤2,000 daily orders, on the same architecture.
- **NFR41:** Y3 capacity: 50,000 concurrent browsing, 2,000 concurrent checkout, 500+ active vendors across multiple metros, ≤10,000 daily orders.
- **NFR42:** Adding new states requires only rules-engine data updates and Stripe Tax registration; no architectural changes.
- **NFR43:** Vendor count growth is linear in resource consumption; no per-vendor infrastructure provisioning.
- **NFR44:** Critical-path queries indexed; no full-table scans on order/vendor/product/audit-log tables at production scale.
- **NFR45:** Platform handles 10× peak load above weekly average without availability impact (≤50% latency degradation accepted for spike).

**Accessibility**
- **NFR46:** Consumer-facing surfaces meet WCAG 2.1 Level AA at MVP.
- **NFR47:** Vendor and admin surfaces meet WCAG 2.1 AA targets at MVP for keyboard nav, contrast, focus, screen-reader labels; advanced patterns may slip to Growth with documented exceptions.
- **NFR48:** Automated accessibility testing (axe-core or equivalent) gates every PR.
- **NFR49:** Manual screen-reader testing of critical flows performed before every public release.
- **NFR50:** Third-party accessibility audit annually starting at Growth scale.

**Observability & Operability**
- **NFR51:** Backend services emit structured logs with correlation IDs; retained ≥30d MVP, ≥90d Growth.
- **NFR52:** Error tracking integrated (Sentry or equivalent) with on-call alerting on spikes/new fingerprints/regressions.
- **NFR53:** Uptime monitoring covers storefront, vendor dashboard, admin queue, checkout, Stripe webhook intake; alerting routes to on-call.
- **NFR54:** Application metrics (request rates, latencies, error rates, DB query perf) collected and dashboarded.
- **NFR55:** Business metrics (GMV, orders, vendor onboarding velocity, admin queue depth, marketplace-sourced ratio, reorder rate) collected and dashboarded.
- **NFR56:** Stripe webhook delivery monitored per event type with replay capability for any missed event in last 30 days.
- **NFR57:** User-facing error messages don't leak internals; unique error reference shown for support escalation.
- **NFR58:** Maintenance windows communicated ≥48h in advance via email and in-app banner; emergency maintenance best-effort.

**Compliance & Auditability**
- **NFR59:** Audit log is immutable — no edit/delete/backdate at app or DB layer; tampering detectable.
- **NFR60:** Audit log retention ≥7 years (food-safety + tax minimums); longer where active litigation hold applies.
- **NFR61:** Audit log records every admin action, every vendor agreement signing/re-attestation, every compliance document upload/decision, every customer privacy request, every foodborne-illness incident with full timeline.
- **NFR62:** Audit log queryable for state AG / FDACS / FDA inquiries and litigation discovery, with admin-grade access controls and access logging.
- **NFR63:** Vendor verification documentation retained per vendor for account duration plus 7 years after deactivation.
- **NFR64:** FDACS-coordination and foodborne-illness investigation records retained per food-safety regulatory minimums and made available to FDACS on request.
- **NFR65:** Stripe Tax reporting available on demand for state revenue department audits.
- **NFR66:** Documented data lineage exists per vendor approval, substitute suggestion, and tax calculation; versioned and replayable for audit defense.

**Total NFRs:** 66.

### Additional Requirements (beyond FR/NFR labels)

- **Strategic platform dependencies (PRD-level commitments):** Stripe (Connect + Tax + Webhooks) is load-bearing for PCI scope minimization, marketplace-facilitator strategy, and KYC delegation. Architect treats "swap Stripe for X" as out of scope without revisiting PCI/tax/KYC strategy. Sentry-or-equivalent (NFR52) and axe-core-or-equivalent (NFR48) are substitutable.
- **Domain regulatory constraints (drive FRs but specified separately):** marketplace facilitator sales tax thresholds (FL $100K revenue-only; most others $100K OR 200 transactions); destination vs. origin sourcing per state; tiered vendor licensing per category; interstate shipping eligibility (FL cottage food = in-state default, PA LFE allows non-TCS interstate, ND/GA/TN/TX 2025 expansions allow); FSMA 204 effective July 20, 2028; CCPA/CPRA + parallel state laws.
- **Locked scoping decisions (11 items)** including: phased delivery, Tampa Bay-Sarasota Q1 2027 commercial launch with Gainesville Oct 2026 pilot, national shipping channel from MVP day one, Foundation tier only at MVP, Layer 1 rules engine MVP / Layer 2 AI Growth / Layer 3 monitoring Vision, real-time-ready architecture MVP but user-visible push UX Growth, Convex (or equivalent) leading platform candidate, multi-state tax + PTC mapping non-deferrable, all six MVP user journeys supported end-to-end at launch.
- **Open architecture decisions:** stack (Convex / Supabase / self-hosted), image pipeline service, framework, hosting platform, email service provider, error tracking, analytics platform.
- **Architectural prep (no UX exposure at MVP, but baseline):** event-driven architecture with domain events on every state change; reactive query layer or pub/sub bus with topic-based fan-out; subscribers (email, audit log, expiry alerts, analytics) consume without modifying publishers; transport-abstracted frontend data layer.

### PRD Completeness Assessment

- **Structure:** PRD is well-organized with explicit reading guide, phased scope definition, quantified success criteria, and a clean separation of capability contract (FRs) from quality attributes (NFRs).
- **Traceability inputs:** FRs are numbered FR1–FR72 (plus FR32a) with explicit `[Growth]`/`[Vision]` phase tags — strong traceability foundation. NFRs numbered NFR1–NFR66 across 7 categories.
- **Capability contract clarity:** PRD explicitly states "Anything not here doesn't exist in the product" — gives readiness assessment a hard scoping line.
- **Initial gaps to watch downstream:**
  - FR58 cancellation thresholds called out as "tunable post-launch" — confirm epics treat these as configuration, not constants.
  - Foundation tier numeric limits (5 products, 2 variants/product, 5 team members) appear in Product Scope but not in any FR — verify epics enforce them.
  - FR4 geo-targeted landing pages depend on city → vendor data; verify epics include the data model and content-generation flow.
  - The "customer-facing certification badges" are deferred to Growth in Product Scope, but FR5 (filterable certification badges with verification linking) appears MVP — possible conflict to resolve in epic coverage step.
  - Real-time-ready event layer is FR65/FR66 (MVP) but the user-visible push capabilities (FR67–FR72) are Growth/Vision; epics must clearly mark this boundary.

PRD analysis complete; proceeding to Epic Coverage Validation.

## Epic Coverage Validation

The epics document includes an explicit **FR Coverage Map** (epics.md L470–573) mapping each FR to its primary epic, with cross-cutting FRs (FR61 audit log, FR63 email pipeline, FR65 Stripe webhooks, FR66 domain events) flagged. Eight epics cover the full MVP scope.

### Epic Inventory

| Epic | Scope |
|------|-------|
| Epic 1 | Foundation, Public Site, Auth & Legal — 16 stories (1.1–1.16) |
| Epic 2 | Vendor Onboarding & Verification — 10 stories (2.1–2.10) |
| Epic 3 | Vendor Storefront & Operations — 7 stories (3.1–3.7) |
| Epic 4 | Marketplace Discovery & Provenance — 7 stories (4.1–4.7) |
| Epic 5 | Multi-Vendor Cart & Checkout — 9 stories (5.1–5.9) |
| Epic 6 | Order Lifecycle, Fulfillment & Substitute Discovery — 6 stories (6.1–6.6) |
| Epic 7 | Customer Account, Trust & Privacy — 7 stories (7.1–7.7) |
| Epic 8 | Admin Enforcement, Incident Response & Compliance Operations — 7 stories (8.1–8.7) |

**Total stories:** 69.

### Coverage Matrix (MVP FRs)

| FR | Capability | Epic Coverage | Status |
|----|------------|---------------|--------|
| FR1 | Anonymous marketplace browse | Epic 4 (Story 4.2) | ✓ Covered |
| FR2 | Farm profile page | Epic 4 (Story 4.3) | ✓ Covered |
| FR3 | Product detail page | Epic 4 (Story 4.4) | ✓ Covered |
| FR4 | Geo-targeted SEO landing pages | Epic 4 (Story 4.5) | ✓ Covered |
| FR5 | Filterable cert badges + verification | Epic 4 (Story 4.6) | ✓ Covered |
| FR6 | Indexable structured data | Epic 4 (Stories 4.3–4.5) | ✓ Covered |
| FR7 | Saved farms list | Epic 4 (Story 4.7) | ✓ Covered |
| FR8 | Multi-vendor cart | Epic 5 (Story 5.1) | ✓ Covered |
| FR9 | Per-vendor fulfillment selection | Epic 5 (Story 5.3) | ✓ Covered |
| FR10 | Stripe Connect split payment | Epic 5 (Story 5.5) | ✓ Covered |
| FR11 | Per-line tax via Stripe Tax | Epic 5 (Story 5.4) | ✓ Covered |
| FR12 | Marketplace facilitator threshold monitoring | Epic 5 (Story 5.4) | ✓ Covered |
| FR13 | Per-vendor sub-receipts | Epic 5 (Story 5.6) | ✓ Covered |
| FR14 | Per-line refunds reversing splits | Epic 5 (Story 5.8) | ✓ Covered |
| FR15 | 7-day post-delivery payouts | Epic 5 (Story 5.9) | ✓ Covered |
| FR16 | Vendor application by state + categories | Epic 2 (Story 2.3) | ✓ Covered |
| FR17 | Rules-engine-surfaced required documents | Epic 2 (Story 2.1, 2.4) | ✓ Covered |
| FR18 | Document upload | Epic 2 (Story 2.4) | ✓ Covered |
| FR19 | Compliance attestation | Epic 2 (Story 2.4) | ✓ Covered |
| FR20 | Stripe Connect hosted onboarding | Epic 2 (Story 2.5) | ✓ Covered |
| FR21 | Vendor agreement signing | Epic 2 (Story 2.6) | ✓ Covered |
| FR22 | Restricted state×category combos blocked | Epic 2 (Story 2.1, 2.3) | ✓ Covered |
| FR23 | FL cottage food in-state shipping default | Epic 2 (Story 2.1) | ✓ Covered |
| FR24 | Product CRUD with variants/photos/traceability/labeling | Epic 3 (Story 3.3) | ✓ Covered |
| FR25 | Farm profile editor | Epic 3 (Story 3.2) | ✓ Covered |
| FR26 | Per-vendor fulfillment configuration | Epic 3 (Story 3.5) | ✓ Covered |
| FR27 | Inventory management | Epic 3 (Story 3.4) | ✓ Covered |
| FR28 | Vendor order management state transitions | Epic 6 (Story 6.1) | ✓ Covered |
| FR29 | Vendor-customer order communication | Epic 6 (Story 6.3) | ✓ Covered |
| FR30 | Vendor sales dashboard | Epic 3 (Story 3.7) | ✓ Covered |
| FR31 | Vendor-shareable storefront link | Epic 3 (Story 3.6) | ✓ Covered |
| FR32 | Foundation tier subscription | Epic 2 (Story 2.2) | ✓ Covered |
| FR35 | Customer order tracking | Epic 6 (Story 6.2) | ✓ Covered |
| FR36 | Vendor line cancellation w/ auto refund | Epic 6 (Story 6.5) | ✓ Covered |
| FR37 | Customer hold requests | Epic 6 (Story 6.4) | ✓ Covered |
| FR38 | Substitute matching on cancellation | Epic 6 (Story 6.6) | ✓ Covered |
| FR39 | Per-vendor cancellation cutoffs displayed | Epic 6 (Story 6.4) | ✓ Covered |
| FR41 | Customer signup + email verification | Epic 1 (Story 1.9) | ✓ Covered |
| FR42 | Customer account dashboard | Epic 7 (Story 7.1) | ✓ Covered |
| FR43 | Data export within 24h | Epic 7 (Story 7.2) | ✓ Covered |
| FR44 | Account deletion w/ PII purge | Epic 7 (Story 7.3) | ✓ Covered |
| FR45 | CCPA/CPRA rights incl. Do-Not-Sell | Epic 7 (Story 7.4) + Epic 1 (Story 1.11) | ✓ Covered |
| FR46 | Customer misrepresentation reports | Epic 7 (Story 7.5) | ✓ Covered |
| FR47 | Foodborne-illness reports | Epic 7 (Story 7.6) | ✓ Covered |
| FR48 | Vendor cancellation/service quality reports | Epic 7 (Story 7.5) | ✓ Covered |
| FR49 | "Tell us where to launch next" interest signal | Epic 7 (Story 7.7) | ✓ Covered |
| FR50 | Admin vendor application queue w/ rules-engine checklist | Epic 2 (Story 2.7) | ✓ Covered |
| FR51 | Admin approve / request more / reject | Epic 2 (Stories 2.8, 2.9, 2.10) | ✓ Covered |
| FR54 | Admin customer-report queue | Epic 8 (Story 8.2) | ✓ Covered |
| FR55 | Admin warn / suspend / restore / remove | Epic 8 (Story 8.3) | ✓ Covered |
| FR56 | Foodborne-illness auto-pause + incident notice | Epic 8 (Story 8.4) | ✓ Covered |
| FR57 | FDACS coordination + investigation timeline | Epic 8 (Story 8.4) | ✓ Covered |
| FR58 | Cancellation-rate tracking w/ admin-configurable thresholds | Epic 8 (Story 8.5) | ✓ Covered |
| FR59 | Permit/cert expiry alerts + auto-pause | Epic 8 (Story 8.6) | ✓ Covered |
| FR61 | Immutable audit log | Epic 1 (Story 1.3, infrastructure); cross-cutting | ✓ Covered |
| FR62 | Admin discretionary refund + credit | Epic 8 (Story 8.7) | ✓ Covered |
| FR63 | Transactional email pipeline | Epic 1 (Story 1.4, infrastructure); cross-cutting | ✓ Covered |
| FR64 | Customer-vendor in-app inbox | Epic 6 (Story 6.3) | ✓ Covered |
| FR65 | Stripe webhook ingestion (Connect events + payment events) | Epic 2 (Story 2.5) + Epic 5 (Story 5.7) | ✓ Covered |
| FR66 | Domain event backbone | Epic 1 (Story 1.3, infrastructure); cross-cutting | ✓ Covered |

**60 / 60 MVP FRs covered.** All MVP-scope FRs traced to a primary epic and at least one specific story.

### Out-of-MVP FRs (correctly deferred and acknowledged)

The coverage map's "Out-of-MVP" section explicitly defers each phase-tagged FR with no design work in this document:

- **[Growth]:** FR32a, FR33, FR34, FR40, FR52, FR53, FR60, FR67, FR68, FR69, FR70 (11 FRs)
- **[Vision]:** FR71, FR72 (2 FRs)

This matches the PRD phase tags exactly — no scope drift.

### FRs in Epics but Not in PRD

None. Spot-checked story headers reference only PRD-defined FR numbers (FR1–FR72 ∪ FR32a). No extras introduced.

### Gap-Watch Items from PRD Analysis — Resolved

- **Foundation tier numeric limits (5 products / 2 variants / 5 team members):** epics enforce these explicitly. Story 3.1 throws `appError("vendor.tier_limit_exceeded", "Foundation tier allows up to 5 team members…")`; Story 3.3 enforces `5 products max` and `up to 2 variants` per product with matching `appError`. ✓
- **FR58 cancellation thresholds tunable post-launch:** Story 8.5 implements thresholds and rolling-window length as admin-configurable, not hard-coded. ✓
- **FR4 geo-landing data model:** Story 4.5 defines `/local/[city]/[product]` routes, slug taxonomy in `packages/seed-data/`, Cache Components revalidation on product publish, and noindex empty-state to avoid thin-content. ✓
- **FR5 vs. "customer-facing certification badges deferred to Growth":** No conflict. Story 4.6 ships the *functional* MVP — filter + click-through verification with issuing body. The Growth bullet ("public vendor profile enhancement: story, photos, traceability") refers to enhanced visual treatment, not the badges themselves. ✓
- **Real-time-ready event layer at MVP / push UX at Growth boundary:** FR66 (event backbone) is Story 1.3 in Epic 1; FR67–FR70 (live UX) explicitly listed in the Out-of-MVP section. Boundary clean. ✓

### Coverage Statistics

- Total PRD FRs: 73 (FR1–FR72 plus FR32a)
- MVP FRs in PRD: 60
- MVP FRs covered in epics: **60 / 60 (100%)**
- Growth FRs deferred and acknowledged: 11 / 11
- Vision FRs deferred and acknowledged: 2 / 2
- Total stories defined: 69 across 8 epics
- FRs not covered: **0**

Epic coverage validation complete; proceeding to UX Alignment.

## UX Alignment Assessment

### UX Document Status

**Found.** `ux-design-specification.md` is complete (frontmatter `status: complete`, all 14 workflow steps marked done, 2026-04-26). Sections cover Executive Summary, Core User Experience, Desired Emotional Response, UX Pattern Analysis & Inspiration, Design System Foundation, Defining Experience, Visual Design Foundation, Design Direction Decision, User Journey Flows (mermaid), Component Strategy, UX Consistency Patterns, Responsive Design & Accessibility.

UX requirements have been extracted into the epics document as **UX-DR1 through UX-DR64** (epics.md L338–L466) and referenced by number in story acceptance criteria.

### UX ↔ PRD Alignment

| Area | PRD | UX | Alignment |
|------|-----|----|-----------|
| Six user journeys | PRD §User Journeys (J1–J6) | UX §User Journey Flows — five mermaid flows; J4 omitted as mechanically similar to J3 | ✓ Aligned (J4 omission justified) |
| Mobile breakpoint | "primary breakpoint design starts at ~360px wide" | "320px Galaxy Fold cover-screen floor" | ✓ UX is *stricter*; not a gap |
| Accessibility | WCAG 2.1 AA mandatory consumer-facing (NFR46) | UX-DR8 WCAG 2.1 AA across entire product, consumer-mandatory + vendor/admin pragmatic-AA | ✓ Aligned, UX extends bar to vendor/admin |
| Touch targets | 44×44pt HIG / 48dp Material | UX-DR7 same | ✓ Aligned |
| Real-time-ready / push UX deferral | Locked decision #7: real-time-ready MVP, push UX Growth | UX §Platform Strategy: "Architecture is event-driven and real-time-ready from day one; user-visible real-time UX deferred to Growth." | ✓ Aligned |
| Notification model | NFR21–29 (CCPA/CPRA), FR45, FR63 | UX-DR56 three-tier notification model: transactional always-sent, lifecycle/marketing opt-in with explicit signup checkbox | ✓ Aligned, formalized into a contract epics implement |
| Multi-vendor cart wedge | FR8, FR9 | UX-DR12 MultiFarmCart Tier 1 critical; UX-DR13 FarmFulfillmentSelector Tier 1 critical | ✓ Aligned |
| Substitute matching | FR38 | UX-DR24 SubstituteSuggestion Tier 1 + Journey 2 mermaid | ✓ Aligned |
| Rules engine surfaces | FR17, FR50 | UX-DR20 RulesEngineChecklist Tier 1 admin + UX-DR22 VendorOnboardingFlow Tier 1 | ✓ Aligned |
| SEO landing pages | FR4, FR6 | UX-DR36 marketing/landing layout; UX-DR37 marketplace browse; SEO discussed in journey 1 | ✓ Aligned |
| Image pipeline + EXIF strip | NFR27 | UX-DR33 PhotoHero + UX-DR53 imagery patterns | ✓ Aligned |
| Stripe Connect KYC | FR20, NFR10 | UX Journey 3 Mike's onboarding incl. Stripe Connect hosted flow | ✓ Aligned |

### UX ↔ Architecture Alignment

| Area | Architecture | UX | Alignment |
|------|-------------|----|-----------|
| Frontend framework | Next.js 16 (App Router, SSR + hybrid client routing, React 19.2) | UX presupposes RSC content surfaces, server components for SSR | ✓ Aligned |
| Design system | Tailwind v4 + shadcn/ui (Base UI primitives) | UX §Design System Foundation: "Tailwind v4 + shadcn/ui (Base UI primitives) — locked by the architecture"; UX-DR1 tokens in `packages/ui/styles/tokens.css` using Tailwind v4 `oklch()` | ✓ Aligned (UX explicitly cites architecture lock) |
| Backend platform | Convex (reactive backend, scheduled functions, file storage) | UX-DR53 vendor uploads through "Convex EXIF strip + responsive variant pipeline" | ✓ Aligned |
| Email pipeline | `@convex-dev/resend` Convex component, React Email | UX-DR63 "Email components isolated in `packages/email-templates/` using table-based markup with inlined styles (React Email at MVP)" | ✓ Aligned |
| Real-time data layer | Convex reactive queries native; transport hidden | UX defers user-visible push to Growth; uses email + polling for MVP | ✓ Aligned |
| Performance targets | NFR1 LCP <2.5s / INP <200ms / CLS <0.1 | UX-DR60 Lighthouse CI enforces same thresholds | ✓ Aligned |
| Accessibility CI | NFR48 axe-core in CI per PR | UX-DR8 axe-core in CI per NFR48; UX-DR59 Chromatic visual regression at 320/768/1024/1440 | ✓ Aligned |
| Vendor portal layout | Single Next.js app (`apps/storefront`) at MVP | UX-DR43 vendor portal top nav + main content, no left sidebar at MVP, Squarespace-lite live-preview | ✓ Aligned |

### Alignment Issues / Misalignments

**None blocking.** The following are minor strengthenings, not gaps:

- **UX-DR62 commits to a pre-launch third-party accessibility audit before Feb 13, 2027 Sarasota commercial launch.** PRD NFR47/NFR50 says third-party audit "annually starting at Growth scale (Phase 2)." UX is *more aggressive* than PRD requirement — pre-launch instead of post-Growth-launch. This is a positive deviation; epics should fund the ~$2–3K budget item.
- **UX adopts a 320px Galaxy Fold floor** vs. PRD's ~360px primary breakpoint. UX is stricter; epics already adopt the 320px floor in stories that test layout collapse (e.g., Story 1.6 Harvest tokens, Story 4.2 browse).
- **UX names commercial launch as Feb 13, 2027** while PRD says "Q1 2027." Specific date is consistent within the quarter.

### Warnings

None. UX document is present, comprehensive, internally consistent, and aligned with both PRD capability/quality contract and architecture stack/platform decisions. UX requirements are extracted into the epics' UX-DR1–UX-DR64 inventory and referenced by number in story acceptance criteria, providing a clean traceability chain UX → epics → stories.

UX alignment assessment complete; proceeding to Epic Quality Review.

## Epic Quality Review

Validated 8 epics × 69 stories against BMad create-epics-and-stories standards.

### Epic Structure Validation

| Check | Result |
|-------|--------|
| Epic titles user-centric (not "Database Setup" / "API Infrastructure") | ✓ All 8 epics named for user capabilities (Vendor Onboarding, Multi-Vendor Cart & Checkout, etc.) |
| Epic goals describe user outcome | ✓ Each epic's narrative description leads with "A [user] can [action]…" |
| Epic 1 carries user value (not pure infrastructure) | ✓ Epic 1 ships customer signup + email verification, public marketing pages, legal pages, foundation footer Do-Not-Sell link — alongside cross-cutting infrastructure stories. Acceptable greenfield Epic-1 shape. |
| Epic independence — Epic N can function on Epic 1..(N-1) outputs | ✓ Forward direction observed; backward references throughout (Epic 5 → Epic 2's Stripe Connect, Epic 6 → Epic 3's products, etc.). See § Cross-epic Reference Audit below for the few forward references and their handling. |
| Greenfield setup pattern | ✓ Story 1.1 = project initialization from architecture's named starter template (Convex Turborepo monorepo); CI/CD in Story 1.13; testing infra in Story 1.14; runbooks in Story 1.16 |
| Database/entity creation timing | ✓ Cross-cutting Story Convention #2 codifies "Stories add only the tables/fields they need. No 'Story 1 creates all 50 tables' anti-pattern." Story 1.2 bootstraps `defineSchema`; later stories add their tables. |
| FR coverage maintained | ✓ Each epic block lists FRs covered; coverage matrix verified in Step 3 (60/60 MVP FRs) |

### Story Quality Assessment

| Check | Result |
|-------|--------|
| User-story format ("As X, I want Y, so that Z") | ✓ Used uniformly across all sampled stories |
| Acceptance criteria use BDD Given/When/Then | ✓ Every sampled story (1.1, 1.2, 1.3, 2.7–2.10, 3.1, 3.3, 4.5, 4.6, 4.7, 5.1, 5.7, 6.6, 7.5, 7.6, 8.4, 8.5) uses Given/When/Then exclusively |
| ACs cover happy path + error paths + edge cases | ✓ Stories include error states (Stripe decline, restricted state, expired cutoff, doc-format invalid, rate-limit exceeded, malformed permit number, etc.) |
| ACs are testable / measurable | ✓ Specific behaviors (e.g., "rejects with `appError('vendor.tier_limit_exceeded', …)`", "<2.5s LCP", "auto-suspend when above threshold for 14 consecutive days") |
| Stories are independently completable within their epic | ✓ within-epic; one cross-epic test-scope concern (see Major Issue 1) |
| `Protects:` block + intentional-break-check pattern | ✓ Many stories explicitly call out an "intentional-break check" — strong meaningful-tests pattern that aligns with the user's standing feedback to bias tests toward catching real regressions |
| Traceability to FR / NFR / AR / UX-DR | ✓ Stories reference FR/NFR by number; story headers carry the FR number (e.g., "Story 4.5: Geo-targeted SEO landing pages (FR4)") |

### Cross-epic Reference Audit

Forward references (Epic N referencing Epic N+M, where N+M ships later) were surveyed via grep for `Epic [n] Story [n].x`. The pattern in use is consistent: forward references are **descriptive of system architecture**, not story-internal dependencies, except in one test-scope case below.

| Reference | Type | Handling |
|-----------|------|----------|
| Story 4.4 → Epic 5 Story 5.4 ("actual selection happens at checkout") | Descriptive (preview UI in 4.4, real flow in 5.4) | ✓ Story 4.4 ships with a preview only; 5.4 lands the real action |
| Story 4.4 → Epic 5 Story 5.1 ("will replace the toast handler") | Placeholder pattern | ✓ Story 4.4 toast stub; Story 5.1 replaces |
| Story 4.4 → Epic 6 Story 6.6 ("substitute pattern doesn't fire here yet") | Out-of-scope assertion | ✓ Explicitly excluded from 4.4 |
| Story 4.7 → Epic 6 Story 6.3 (NotificationCenter UI) | Data-first / UI-later | ✓ Story 4.7 writes data; Story 6.3 reads |
| Story 4.7 → Epic 7 Story 7.3 (account deletion cascade) | Schema-first / action-later | ✓ 4.7 schema; 7.3 cascade tests verify cleanup |
| Story 4.7 → Epic 7 Story 7.4 (notification toggle UI) | Schema-first / UI-later | ✓ 4.7 respects flag; 7.4 wires toggle |
| Story 4.3 → Epic 8 Story 8.5 (permit expiry data) | Conditional render with data dep | 🟡 Verify Story 4.3 renders gracefully if Story 8.5's expiry data isn't yet flowing |
| Story 7.5 → Epic 8 Story 8.5 ("admin queue surfaces the report") | Descriptive routing | ✓ 7.5 emits event with right scope; admin queue is 8.5's concern |
| Story 7.6 → Epic 8 Story 8.4 (auto-pause behavior in 7.6's E2E tests) | **Test-scope dep** | 🟠 See Major Issue 1 |

### Findings by Severity

#### 🔴 Critical Violations

**None.**

#### 🟠 Major Issues

**1. Story 7.6's E2E tests assert end-to-end auto-pause behavior owned by Story 8.4 (later epic).**

Story 7.6 (Epic 7) — "Customer foodborne-illness reports with multi-vendor selection + graduated response" — has a Vitest/integration test `Protects:` block that tests "single-vendor submission auto-pauses that vendor only; multi-vendor submission does NOT auto-pause anyone (graduated response)…" These behaviors require Story 8.4 (the foodborne-illness incident handler) and Story 8.3 (the suspend action) to be implemented for the tests to pass. Within BMad's "Epic N can use Epic 1..(N-1) outputs" rule, Story 7.6's tests technically depend on Epic 8 stories.

**Why this matters:** if 7.6 ships before 8.4 and 8.3, the tests fail; if the team workarounds by skipping or weakening tests, you lose the regression protection that makes the graduated-response design legally defensible.

**Recommended remediation (preferred):** rescope Story 7.6's `Protects:` block to verify *event emission* only — that the right `incident.foodborneIllnessReported` event fires with the correct `certainty` payload and `vendorOrders` array. Move the system-level "single-vendor → auto-pause" and "multi-vendor → no-pause" behavior tests into Story 8.4's `Protects:` block, where they belong (8.4 owns the subscriber and the suspend invocation). This is the standard event-driven testing seam and makes both stories independently completable.

**Alternative remediation:** explicitly document the cross-epic implementation sequence (Story 8.3 → Story 8.4 → Story 7.6) in sprint-planning, accepting that Story 7.6 cannot be marked "Done" until 8.3 + 8.4 are also Done. Less clean than the test rescoping above.

#### 🟡 Minor Concerns

**1. Story 4.3 (farm profile page) references Epic 8 Story 8.5's permit-expiry data in its acceptance criteria.**

Line 2087: "if the vendor's permit expires in <30 days (data from Epic 8 Story 8.5's expiry tracking), the permit-status cell shows 'Expiring in N days'…" Story 4.3 ships before Story 8.5, so when 4.3 lands, the expiry-tracking pipeline isn't running yet. The data field would be empty/null. Recommendation: confirm Story 4.3 renders gracefully (e.g., "permit status: verified at onboarding" without expiry-warning) when Story 8.5's data isn't flowing, and add a graceful-empty-state assertion to 4.3's tests. Likely already handled but worth a one-line check.

**2. Epic 1 mixes user-value stories (signup, marketing pages, legal) with infrastructure-only stories (Story 1.1 init, Story 1.3 event backbone, Story 1.13 CI/CD, Story 1.14 testing infra, Story 1.16 runbooks).**

This is acceptable for a greenfield Epic 1 — the BMad standard explicitly allows foundational infrastructure to ship in Epic 1 to enable the rest of the project. Each of these infra stories has clear FR/NFR/AR traceability (FR41, FR61, FR63, FR66; NFR48, NFR51–NFR58; AR1–AR4, AR20–AR23, AR40–AR43, AR47–AR51, AR56–AR63). The pattern is fine; this note exists only to flag the borderline.

### Best Practices Compliance Checklist (per epic)

| Epic | User value | Independence | Story sizing | No forward deps | Per-story schema | BDD ACs | FR traceability |
|------|------------|--------------|--------------|-----------------|------------------|---------|-----------------|
| Epic 1 | ✓ | ✓ (none required) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 2 | ✓ | ✓ on Epic 1 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 3 | ✓ | ✓ on Epic 1, 2 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 4 | ✓ | ✓ on Epic 1, 2, 3 | ✓ | 🟡 (Story 4.3 / 4.7 graceful-empty-state) | ✓ | ✓ | ✓ |
| Epic 5 | ✓ | ✓ on Epic 1, 2, 3, 4 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 6 | ✓ | ✓ on Epic 1, 2, 3, 4, 5 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 7 | ✓ | ✓ on Epic 1, 2, 3, 4, 5, 6 | ✓ | 🟠 (Story 7.6 test scope) | ✓ | ✓ | ✓ |
| Epic 8 | ✓ | ✓ on Epic 1, 2, 3, 5, 6, 7 | ✓ | ✓ | ✓ | ✓ | ✓ |

### Quality Summary

**8 epics, 69 stories, 60 MVP FRs covered, 0 critical violations.** The epic and story structure is rigorous: BDD acceptance criteria throughout, explicit `Protects:` test blocks with intentional-break checks (a meaningful-tests pattern that aligns with the user's standing preference for tests that catch real regressions), per-story schema discipline codified as a cross-cutting convention, FR/NFR/AR/UX-DR traceability via numbered references in story headers and ACs, and a clean event-driven seam between user-facing capabilities (Epic 7) and admin processing (Epic 8).

The single 🟠 Major Issue (Story 7.6 test-scope forward dependency) is a clean fix at the test-rescoping level and does not block readiness — but should be remediated before Story 7.6 enters the dev cycle.

Epic quality review complete; proceeding to Final Assessment.

## Summary and Recommendations

### Overall Readiness Status

**READY — with one targeted remediation recommended before Story 7.6 enters dev.**

The Farm2Table planning artifacts (PRD, Architecture, Epics & Stories, UX Design Specification) are aligned, complete, and traceable. MVP scope is unambiguous, FR coverage is 100% with explicit phase tagging, NFRs are quantified and testable, the architecture's stack and platform decisions are reflected in epic-level requirements (AR1–AR65+) and story acceptance criteria, and UX requirements are formally extracted (UX-DR1–UX-DR64) and referenced by number throughout the story set. Phase 4 (implementation) can begin with high confidence.

### Findings Inventory

| Severity | Count | Items |
|----------|-------|-------|
| 🔴 Critical | 0 | — |
| 🟠 Major | 1 | Story 7.6 E2E tests assert auto-pause behavior owned by Story 8.4 (forward dep in test scope) |
| 🟡 Minor | 2 | Story 4.3 graceful-empty-state when Story 8.5 expiry data not yet flowing; Epic 1 mixes user-value with infrastructure stories (acceptable for greenfield Epic 1) |
| ✅ Strengthenings observed | 3 | UX 320px floor stricter than PRD's 360px; UX-DR62 commits pre-launch third-party accessibility audit ahead of PRD's Growth-scale requirement; meaningful-tests pattern (`Protects:` block + intentional-break check) used uniformly across stories |

### Critical Issues Requiring Immediate Action

None.

### Recommended Next Steps

1. **Remediate Story 7.6's test scope (🟠 Major).** Rescope Story 7.6's `Protects:` block to verify event emission only — assert that the right `incident.foodborneIllnessReported` event fires with the correct `certainty` payload (`single_vendor` / `multi_vendor` / `uncertain`) and `vendorOrders` array. Move the system-level "single-vendor → auto-pause" and "multi-vendor → no-pause" behavior tests into Story 8.4's `Protects:` block, where the subscriber and suspend invocation actually live. This makes both stories independently completable and preserves the regression protection for the legally-defensible graduated-response design.

2. **Verify Story 4.3 graceful-empty-state for permit-status cell (🟡 Minor).** Add a one-line acceptance criterion to Story 4.3 ensuring the permit-status cell renders cleanly (e.g., shows "verified at onboarding" with no expiry-warning) when Story 8.5's expiry-tracking data hasn't yet flowed. Likely already handled in implementation; this just makes it explicit in the story spec.

3. **Begin Phase 4: Sprint Planning.** Per the BMad workflow path: invoke `bmad-sprint-planning` to generate the sprint status that the story cycle (Create Story → Validate Story → Dev Story → Code Review) will consume. Story 1.1 (project initialization) is the natural first story per the architecture's stated handoff (AR1).

4. **Optional pre-implementation cleanups (non-blocking):**
   - Shard `epics.md` (377KB) using `[SD] Shard Doc` for easier per-story navigation during the dev cycle.
   - Confirm legal review budget ($2–5K Y1 vendor-agreement attorney + ~$300–500 pre-launch consultation) is queued — Story 7.6 includes a `LEGAL_REVIEW_ITEMS.md` placeholder for attorney consultation on the foodborne-illness graduated-response copy and FDACS-coordination consent flow.
   - Confirm pre-launch third-party accessibility audit budget (~$2–3K per UX-DR62) is queued ahead of Tampa Bay-Sarasota Q1 2027 commercial launch.

### Final Note

This assessment found **3 issues** across **3 categories** — 1 Major (Story 7.6 test scope), 2 Minor (Story 4.3 empty state, Epic 1 borderline structure), and 0 Critical. The Major issue has a clean test-rescoping fix that does not block readiness. The Farm2Table planning stack is materially ready to enter implementation.

---

**Assessor:** Claude (BMad-method bmad-check-implementation-readiness skill v1)
**Assessment Date:** 2026-04-26
**Workflow Run:** Steps 1–6 complete
**Next BMad Workflow:** `bmad-sprint-planning` (Phase 4 entry)
