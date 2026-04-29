---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
status: complete
completedAt: 2026-04-25
releaseMode: phased
inputDocuments:
  - _bmad-output/planning-artifacts/prfaq-Farm2Table.md
  - _bmad-output/planning-artifacts/prfaq-Farm2Table-distillate.md
  - _bmad-output/research/domain-food-marketplace-platform-liability-research-2026-03-02.md
  - _bmad-output/research/market-d2c-farm-marketplace-research-2026-03-01.md
  - _bmad-output/research/vendor-subscription-tiers.md
documentCounts:
  briefs: 0
  research: 3
  brainstorming: 0
  projectDocs: 0
  prfaq: 2
workflowType: 'prd'
project_name: Farm2Table
classification:
  projectType: web_app
  projectTypeNotes: Two-sided marketplace with SaaS characteristics (vendor subscription tiers, multi-tenant)
  domain: marketplace-regulated
  subdomain: food-marketplace
  domainNotes: Food marketplace with cross-cutting regulatory complexity (marketplace facilitator tax, FDACS/USDA vendor verification, product liability, CCPA, FSMA 204)
  complexity: medium-high
  projectContext: greenfield
---

# Product Requirements Document - Farm2Table

**Author:** Jen
**Date:** 2026-04-25
**Release Mode:** Phased (MVP / Growth / Vision)

## Reading Guide

This PRD is the source of truth for Farm2Table's product scope. It is the input to downstream BMad workflows: UX Design → Architecture → Epics & Stories → Development. Sections are ordered for human readability (vision → strategy → requirements) and tagged for LLM consumption (`## Level 2` headers throughout).

For quick navigation:
- **Executive Summary, Project Classification, Success Criteria** — vision, target users, measurable outcomes. Read these for the *what* and *why*.
- **Product Scope, User Journeys** — phased delivery, capability stories per user type. Read these for *who does what* and *when*.
- **Domain-Specific Requirements, Innovation & Novel Patterns, Web App Specific Requirements** — regulatory constraints, vertical-specific innovation, web-app architecture constraints. Read these for *what shapes the build*.
- **Project Scoping & Phased Development** — locked decisions, open decisions, MVP/Growth/Vision splits, scoping risks.
- **Functional Requirements (FR1–FR72)** — the binding capability contract. Anything not here doesn't exist in the product.
- **Non-Functional Requirements (NFR1–NFR66)** — measurable quality attributes (performance, security, privacy, reliability, scalability, accessibility, observability, compliance/auditability).

## Executive Summary

Farm2Table is a two-sided online marketplace that lets households build a single cart from named local farms — with each farm fulfilling its own items by farm pickup, vendor-run local delivery, or vendor-run shipping — and gives small farms and food artisans a discovery channel that brings them customers without 30% logistics-platform commission, geographic lock-in, or loss of brand and data ownership. **All fulfillment is performed by the vendor; Farm2Table never takes possession of food and operates no shared pickup or warehouse infrastructure.**

The problem is structural. Households who want to know exactly who grew, raised, or made every item in their cart currently have to choose between (1) driving to multiple Saturday farmers markets, (2) settling for warehouse-aggregated "local" from grocery delivery whose provenance is unenforced, or (3) signing up for a CSA mystery box they can't customize. Small farms face the inverse problem: ~52 farmers-market days per year, no demand-generation from existing SaaS tools (Barn2Door, Local Line, GrazeCart), and a 20–30% commission ceiling on logistics-heavy marketplaces (Market Wagon).

The product reaches customers along two parallel paths from day one: a **national shipping channel** for shelf-stable and cold-chain-capable vendors, who can sell wherever the law allows them to ship; and **launch-market expansion**, where Farm2Table builds vendor density and local customer awareness one metro at a time so that pickup and local-delivery options become viable in that area — starting with a Gainesville pilot in 2026 and a Tampa Bay-Sarasota commercial launch in Q1 2027, then additional metros over time. Long-term arc: a national footprint of launch markets running alongside the always-on shipping channel. The unit of geographic expansion is vendor density and customer awareness — not platform infrastructure. Fulfillment is vendor-managed everywhere, in every metro, on every order.

### What Makes This Special

Farm2Table occupies a five-pillar position no competitor holds simultaneously: marketplace demand-generation + no platform-owned logistics + multi-vendor consumer cart + tiered SaaS upsell path + fast vendor payouts. Market Wagon ($14.1M funded, 20 metros over 9 years) owns logistics — capital-bound and slow to scale per metro because each metro requires a hub, drivers, and warehouse capacity. Barn2Door and Local Line are pure SaaS — every farm self-acquires customers. Misfits Market and Imperfect Foods are warehouse-aggregated — consumers report "feels like organic grocery delivery, not farm-direct." Homegrown's "$10/mo flat" is the closest direct comparable but is family-scale and early-stage with effective take rate ~4.5–6.5% once processing fees are included.

Three things make the position defensible:

- **The wedge is the multi-farm cart with named-farm provenance** — every line item names the farm; verification is documented at onboarding (state ag license, USDA Local Food Directory cross-check, third-party certifications validated with issuing bodies); listings can be flagged and removed for misrepresentation. "Local" on Farm2Table is enforced; "local" on grocery delivery is a marketing word.
- **Zero platform-owned logistics, anywhere** — Farm2Table has no warehouses, no drivers, no fleet, no community pickup hubs, and no per-metro fulfillment infrastructure. Every order moves directly from the vendor's hands to the customer's via the vendor's chosen method. Geographic expansion is therefore vendor-acquisition + local-customer-awareness, not infrastructure build-out — which compresses Market Wagon's 9-year metro-by-metro cadence and makes Farm2Table cheaper and faster to scale per market.
- **Compliance is treated as differentiation, not cost** — tiered vendor verification by category (farm / cottage food / commercial food / micro-producer), Stripe Tax marketplace-facilitator integration with product-tax-code mapping across all states from day one, FSMA 204-ready vendor onboarding ahead of the July 2028 deadline, and a vendor agreement with reps/warranties + indemnification + tiered insurance + compliance attestation. Most marketplaces ship loose; Farm2Table ships compliant.

The cold-start problem — the existential risk for any two-sided marketplace — is solved by **single-player value first**: the platform is immediately useful to a farmer for managing existing customers (replacing DM-and-Venmo chaos with a real online storefront, payment processing, inventory, and pre-orders) before the marketplace generates new demand. Farmers bring their existing customer base to Farm2Table, those customers discover other vendors via the multi-farm cart, and the marketplace flywheel turns. Liquidity milestone: >20% of orders sourced from marketplace discovery (vs. farmer-shared links) by month 6 of public launch.

The accepted trade-off named openly: a multi-farm cart spanning vendors with different fulfillment methods may require more than one pickup. Farm2Table positions for customers who value provenance and discovery over single-trip convenience; the multi-pickup reality is acknowledged in customer-facing copy rather than papered over.

Why now (2026): MAHA federal tailwind (raw-milk loosening, $700M Regenerative Pilot, regenerative-ag endorsement); cottage food liberalization in TX/GA/TN/ND in 2025 expanding the addressable vendor pool; USDA cuts to Regional Food Business Centers and Farm-to-School funding (Aug 2025) pushing small regenerative farms toward new D2C outlets; GLP-1-driven shift in grocery-basket spend toward per-calorie quality; CSA-box fatigue; and FSMA 204's July 2028 deadline creating a build-window where compliance can become a moat before it's mandatory.

## Project Classification

- **Project Type:** `web_app` — two-sided marketplace web app (consumer storefront + vendor portal), mobile-first responsive, modern web stack with Stripe Connect for marketplace payments and split payouts, SEO-driven local discovery. Has `saas_b2b` characteristics (multi-tenant vendor accounts, three-tier subscription model — Foundation/Growth/Pro at 22%/18%/12% commission — with paid add-ons), but the consumer-facing marketplace is the primary surface and the wedge.
- **Domain:** `general` (food marketplace doesn't map cleanly to any specialized catalog domain), with substantial cross-cutting regulatory complexity: multi-state marketplace facilitator sales tax (Stripe Tax with PTC mapping), tiered vendor licensing verification (FDACS, USDA, state cottage food, apiary registration), product liability under the Oberdorf line of cases (vendor agreement carries indemnification + insurance requirements), CCPA/CPRA and parallel state privacy laws, and FSMA 204 traceability becoming enforceable July 2028.
- **Complexity:** `medium-high` — driven by multi-state regulatory cross-cuts, multi-vendor cart UX with per-vendor fulfillment and Stripe Connect split payments, branching tiered vendor onboarding with category-specific document verification, and the two-sided cold-start GTM. Not driven by industry certifications, novel tech, or hard real-time requirements.
- **Project Context:** `greenfield` — concept-stage; no existing codebase or project documentation in the working tree. Five years of prior founder iteration on the concept.

## Strategic Platform Dependencies

A small number of third-party platforms are elevated to PRD-level commitments rather than left as architecture-step decisions. They appear by name throughout the FRs and NFRs and should be treated as load-bearing platform assumptions, not casual implementation choices.

- **Stripe (Connect + Tax + Webhooks)** — committed at PRD level for three reasons: (1) **PCI scope minimization** — customer card data is never stored on Farm2Table infrastructure (NFR9); (2) **marketplace-facilitator strategy** — Stripe Tax handles per-jurisdiction sales-tax calculation and threshold monitoring across all states (FR11–12, NFR65), which is a non-trivial regulatory and engineering surface; (3) **KYC delegation** — vendor identity and bank-account verification go through Stripe Connect's hosted onboarding (FR20, NFR10), so Farm2Table never stores W-9/W-8 or banking data. Stripe is referenced explicitly in FR20, FR65, NFR9–10, NFR16, NFR26, NFR34, NFR42, NFR56, NFR65 and in the Domain-Specific Requirements and Web App Specific Requirements sections. The architect should treat "swap Stripe for X" as out of scope without a revisit of the PCI, tax, and KYC strategy decisions above.

- **Tooling commitments with substitution latitude** — error tracking (Sentry *or equivalent*, NFR52) and accessibility CI (axe-core *or equivalent*, NFR48) are named for clarity but explicitly substitutable. The architect can choose alternatives that meet the underlying capability requirement.

No other third-party platform is elevated to PRD level. Stack decisions (frontend framework, backend platform, database, hosting, CDN, image pipeline, job runner, transactional email service) remain open for the architecture step, with constraints documented in the Web App Specific Requirements section.

## Success Criteria

### User Success

Two users, two success conditions:

**Customer success — the "this is exactly what I needed" moment.**

- **First-cart aha:** A customer completes a single checkout with items from ≥2 named farms, sees each line item attributed to its farm, and selects per-vendor fulfillment (pickup / local delivery / shipping) without confusion. Target: ≥15% of orders contain items from ≥2 vendors by month 6 of public launch (post-MVP); ≥25% by end of Y2.
- **Discovery moment:** A customer finds a farm through Farm2Table they had not previously known about, and orders from it. Tracked as `marketplace-sourced orders` — orders where the customer entered through Farm2Table (not via a vendor-shared link). Liquidity milestone: ≥20% marketplace-sourced by month 6 of public launch. Below that bar, Farm2Table is operating as a SaaS storefront for individual farms, not as a marketplace.
- **Trust moment:** A customer can resolve "who made this and how do I trust them?" in one click — every listing surfaces farm name, address, practices, certifications (verified with issuing bodies), and the farm's own profile. No "local" sticker without a name behind it.
- **Reorder behavior (the real signal):** ≥25% of customers reorder within 30 days of first order (research benchmark for marketplace retention; below this, the multi-pickup trade-off is unsustainable).
- **Friction the product accepts:** A multi-farm cart may require >1 pickup. We do not paper this over — the customer sees per-vendor fulfillment clearly at checkout. Cart abandonment at checkout when multiple pickup locations are required must stay <40% (early-warning threshold; above it, the operating model needs revisit).

**Vendor success — the "this replaced my chaos" moment.**

- **Onboarded in <30 minutes:** From signup to first product listed in under 30 minutes for a Foundation-tier vendor, including state/category classification and document upload. Above 30 minutes, abandonment spikes (research benchmark, validated against Homegrown's stated bar).
- **DM/Venmo replaced:** Vendor accepts pre-orders, takes payment via Stripe (no Venmo, no notebook), tracks inventory, and messages customers — all on Farm2Table — within their first week.
- **First sale ≤30 days:** First customer order, even via vendor-shared link in single-player mode, within 30 days of going live. If the vendor is on Foundation tier and this hasn't happened by 60 days, single-player adoption is broken.
- **New customers from marketplace ≥30 days in:** Vendor sees ≥1 marketplace-sourced order per month by month 3 of being live in a metro that has hit the 25-vendor density floor. Below this, the marketplace isn't producing the demand its commission justifies.
- **Vendor referral rate ≥30% by month 3 of public launch in a metro:** the proxy for "vendors are recommending this to other vendors." Below 30%, supply-side flywheel is stalled. **Note:** at MVP this is an *observational* metric — vendors self-attribute referral source at signup or in conversation; the formal vendor referral *program* (mutual-incentive mechanic) ships in Growth (see Post-MVP Features). MVP measures the organic word-of-mouth baseline; Growth measures the program's lift over that baseline.
- **Payout speed:** Vendor receives funds 7 days after delivery (Foundation/Growth/Pro all). Faster than weekly Friday batch payouts (Market Wagon) and standard SaaS Stripe cycles.

### Business Success

Three time horizons:

| Horizon | GMV | Tier mix (Foundation/Growth/Pro) | Platform revenue | Founder draw |
|---|---|---|---|---|
| **Y1 (2026: Gainesville pilot + early Tampa Bay-Sarasota)** | $200K | 90/8/2 | ~$58K | $0 — reinvested |
| **Y2 (2027: Tampa Bay-Sarasota scaling)** | $1M | 70/25/5 | ~$302K | $80–130K |
| **Y3 (2028: Tampa Bay-Sarasota mature + Metro #2)** | $2M | 55/35/10 | ~$608K | **$180–300K — $200K target reachable** |
| Y4–5 | $5M | 50/35/15 | ~$1.49M | $500–800K |

Driver assumptions (treat as plan, not certainty):

- **AOV $60** (conservative; founder vision implies grocery-replacement upside)
- **Customer CAC <$20** in launch metro via organic channels (vendor-shared content, USDA Local Food Directory, local press, mom/family Facebook groups, SEO)
- **Vendor CPVA <$50** (boots-on-the-ground market recon + farmer-to-farmer referral; near-zero paid acquisition)
- **Customer count Y2: ≥320 weekly active in Tampa Bay-Sarasota** (~0.03% of metro population — achievable but requires real CAC discipline)
- **Cash-flow positive ~Q3-Q4 2027** (Y2)
- **Capital required Y1: $10–37K total**, bootstrapped (no external investors, no debt)
- **Y1 monthly burn: $1–3K recurring opex** (hosting, software, insurance, accounting)

Stretch path: with Y2 Tampa Bay-Sarasota traction validating the model, optional aggressive expansion to 5 metros + parallel national shipping channel by end of Y3 produces $2.5–3.6M GMV, $300–500K founder compensation, and requires hiring 4 metro leads ($200–400K cumulative Y2-Y3 capital, funded from platform revenue reinvestment). Decision criteria for stretch vs. conservative path documented at end of Y2.

### Technical Success

The platform is technically successful when these capabilities are in production and operating without manual intervention:

- **Multi-vendor cart with per-vendor fulfillment selection at checkout** — customer adds items from N vendors, selects fulfillment method per vendor (pickup at vendor / vendor-run delivery / vendor-run shipping), payment splits across vendors via Stripe Connect, each vendor receives their share net of commission and fees.
- **Stripe Connect marketplace integration** — vendor onboarding with Stripe-hosted identity and bank verification, split payments, payouts on the 7-day post-delivery schedule, refund flow that reverses splits correctly.
- **Stripe Tax marketplace-facilitator integration with PTC mapping** — every product category is mapped to a Stripe Product Tax Code from day one (default at category, override at subcategory for Beverages and Nuts & Snacks). Multi-state, with destination-based sourcing for delivered items and pickup-location sourcing for picked-up items, calculated per line item.
- **Tiered vendor onboarding by category** — branching application form for farm / cottage food / commercial food / micro-producer, document upload (state ag license, FDACS permit, USDA exemption, apiary registration, business license, food handler cert, COI as applicable), cross-check against public registries where available, manual review queue for ambiguous cases.
- **Vendor agreement enforcement loop** — customer reporting → admin investigation queue → vendor warning / suspension / removal. Documented enforcement creates the paper trail that protects against negligence claims.
- **Substitute matching engine (basic at MVP, improving over time)** — when a vendor cancels, surface other Farm2Table vendors carrying the same product category, with one-click reorder. Requires a product taxonomy from day one.
- **Search and filter** — by farm name, product, certification, location, practice — at a quality bar comparable to standard ecommerce.
- **Mobile-first responsive UX** — most consumer traffic is mobile; checkout must complete cleanly on a phone.
- **Privacy compliance** — CCPA/CPRA-compliant privacy policy, "Do Not Sell or Share" mechanism, customer data export, account deletion, data processing agreements with Stripe and analytics providers.

### Measurable Outcomes

The signals that make success vs. failure observable:

| Signal | Healthy | Warning | Trigger Action |
|---|---|---|---|
| Vendors signed end of Aug 2026 | ≥20 | <15 | Slow expansion; double down on Sarasota recon |
| Vendors live end of Sept 2026 | ≥25 | <25 | Same as above |
| Customer accounts end of Q4 2026 | ≥75 | <50 | Revisit consumer marketing strategy |
| Vendor referral rate (month 3 of public launch) — *observational at MVP; formal program ships in Growth* | ≥30% | <30% | Supply-side flywheel review |
| Marketplace-sourced order ratio (month 6) | ≥20% | <20% | Liquidity failure — marketplace strategy revisit |
| Customer reorder rate within 30 days | ≥25% | <25% | Multi-pickup friction may be killing retention |
| Avg cart vendor count (multi-farm cart usage) | ≥2 | <2 | Wedge isn't being used — reposition or pivot |
| Cart abandonment when ≥2 pickup locations | <40% | >40% | Operating model revisit |
| MVP build slip vs. July-Sept schedule | ≤2 weeks | >4 weeks | Founder bandwidth review; consider scope cut |

## Product Scope

### MVP — Minimum Viable Product

**Build window:** July–September 2026. Pilot launch Gainesville October 2026; commercial launch Tampa Bay-Sarasota Q1 2027.

**MVP scope is what's required for a credible commercial launch and zero more.** The bar for inclusion: it directly serves the wedge (multi-farm cart + named-farm provenance), is required for compliant operation, or is required for trust at first contact. Everything else moves to Growth.

**Customer-facing**
- Marketplace browse (search by product, farm name, location, practice, certification)
- Farm profile page (name, address, practices, certifications with verification, products, fulfillment options)
- Multi-vendor cart with per-vendor fulfillment selection at checkout
- Account, order history, customer data export
- Order tracking + per-vendor cancellation/refund visibility
- Customer-vendor messaging (basic — for "can you hold this?" / cancellation requests)
- Customer reporting flow (suspected misrepresentation, food safety, vendor cancellation issues)
- Mobile-first responsive web (no native apps)

**Vendor-facing**
- Tiered onboarding by category (farm / cottage food / commercial food / micro-producer) with document upload + admin verification queue
- **State + category compliance rules engine (Layer 1, data-driven)** — for every (state, vendor category, product mix) combination, canonical list of required documents, expected formats, public-registry lookup links, and state-specific notes/edge cases. Sourced from regulatory research; stored as code/config. Drives both vendor onboarding (vendor sees exact required document list) and admin verification queue (auto-generated expected-documents checklist with present / missing / wrong-doc-uploaded status, format validation on permit numbers and expiry dates, one-tap links to public registries, templated request-more-info and rejection emails with state-specific context auto-inserted)
- Foundation tier (free, 22% commission, 5 products, 2 variants/product, 5 team members) — the only paid tier required at MVP is Foundation; Growth and Pro can come at Growth scope
- Product/inventory management (variable weights, simple)
- Order management, fulfillment status updates
- Stripe Connect onboarding (Stripe-hosted identity and bank verification, required before payouts)
- Per-vendor fulfillment configuration (pickup address, local delivery zip codes, shipping coverage by state and product category)
- Vendor profile editor

**Platform / admin**
- Vendor agreement (drafted by food/marketplace attorney, $2–5K legal budget)
- Customer ToS with arbitration + class-action waiver
- Privacy policy, CCPA/CPRA compliance, "Do Not Sell or Share" flow
- Vendor verification admin queue (approve / reject / request more)
- Customer report investigation queue
- Vendor agreement enforcement (warning → suspension → removal)
- Stripe Tax marketplace-facilitator integration with category→PTC mapping (multi-state from day one — non-negotiable)
- Basic substitute matching (category-match only at MVP; surface "other vendors carrying X" on cancellation)
- Per-vendor cancellation cutoffs displayed on listings
- "Tell us where to launch next" interest form (snowbird / out-of-metro signal capture)
- Operational monitoring + on-call for outages

**Explicitly NOT in MVP**
- Paid Growth and Pro tiers (Foundation only at launch; Growth/Pro added once Foundation has critical mass)
- Add-ons (Email Promotions, Advanced Analytics, Route Planner, CSA Manager, Accounting Sync)
- Embedded vendor insurance
- AI document verification
- QR-code product traceability
- Vendor trust scoring
- Native mobile apps
- SNAP/EBT
- Founder in-person vendor visits / video walk-throughs (documentation-only verification)
- Loyalty programs, featured listings, paid boosts
- API for integrations

### Growth Features (Post-MVP)

Sequenced for Y2 (Tampa Bay-Sarasota commercial launch through end of 2027):

**Tier expansion**
- Growth tier ($59/mo, 18% commission, 14-day free trial) — launch when Foundation has ≥50 active vendors and clear graduation candidates
- Pro tier ($149/mo, 12% commission) — launch when ≥10 vendors are at $10K+ monthly GMV
- Auto-suggest tier upgrade notifications ("save $X/mo by upgrading") — non-forced

**Add-ons (sequenced, each unlocks specific features)**
- Email Promotions ($24.99/mo) — campaigns, segmentation, automation
- Advanced Analytics ($19.99/mo) — LTV, cohort, forecasting
- CSA Manager ($24.99/mo) — recurring subscriptions, box curation
- Route Planner ($29.99/mo) — vendor delivery optimization
- Accounting Sync ($14.99/mo) — QuickBooks/Xero integration

**Compliance and trust infrastructure**
- **AI-assisted document review (Layer 2)** — OCR + foundation-model field extraction (permit number, expiry date, business name, jurisdiction), automated registry cross-check via state-specific adapters where APIs exist, confidence scoring, anomaly detection (state mismatch, claim mismatch, format violations), confidence-thresholded fast-lane vs. needs-review routing, "why this needs human review" specific-uncertainty surfacing. AI auto-fills, scores, and flags — never auto-approves; human approve/reject gate stays. Justified once vendor application volume reaches ~10/week (~3 months post-launch typical).
- Annual vendor re-attestation workflow
- Automated permit/certification expiry alerts (30/60/90 day)
- Vendor compliance dashboard (status, expiries, complaint history)
- FSMA 204-ready vendor onboarding (basic traceability fields, lot tracking) — ahead of July 2028 deadline
- Customer-facing certification badges (verified with issuing bodies)
- Public vendor profile enhancement (story, photos, traceability)

**Marketplace mechanics**
- Improved substitute matching (beyond category match — taxonomy depth, sub-product attributes)
- Featured listings ($5–50/wk per vendor) — vendor-paid discovery boost
- Customer loyalty rewards / repeat-buyer flow
- Consumer referral / share-a-cart viral mechanic
- Inventory alerts (low stock, harvest-fresh)

**GTM / market expansion**
- Metro #2 launch (Greenville-Spartanburg / Raleigh-Durham / Austin) Q1-Q2 2028
- Vendor referral program with mutual incentive (reduced commission for both parties for 3 months)
- Market-manager partnership tooling
- USDA Extension office partnership content / certifications

### Vision (Future)

Year 3+ and the long-term arc:

**Compliance-as-moat at scale**
- Embedded vendor insurance (insurtech partnership — NEXT Insurance, Huckleberry, or similar) with automated COI verification and usage-based premiums affordable for cottage-food vendors
- **Continuous regulatory monitoring (Layer 3)** — rules data auto-updated when state laws change via regulatory-monitoring SaaS (foodflou, SGS Digicomply) or proprietary scraping/LLM pipeline against state legislative databases; "your rules data may be out of date in $STATE because their cottage food law was amended on $DATE" alerts
- Real-time compliance monitoring with auto-suspension for known violations
- Cross-platform vendor reputation / portable compliance history (vendor's compliance record travels with them across marketplaces)
- FSMA 204 full traceability (CTEs, KDEs, 24-hour FDA response capability) for all vendors handling Food Traceability List items

**Trust infrastructure**
- QR-code product traceability (consumer-facing — scan and see farm origin, batch, certifications)
- Vendor trust scoring (composite from compliance, reviews, complaint resolution, insurance)
- Cross-platform vendor reputation / portable compliance history

**Marketplace maturity**
- 5-metro footprint (Year 3 stretch path) → 50-metro national footprint (10+ year horizon)
- ~$200–240M annual GMV at full national maturity (~50 metros + national shipping channel)
- Founder transition from operator to CEO of distributed metro operations
- Optional B2B tooling for market managers (vendor management, market analytics, consumer CRM) as channel
- Optional enterprise partnerships (regional grocery, restaurant supply, CSA aggregators)
- SNAP/EBT acceptance (USDA SNAP Online) — differentiator for mission, GTM, and grant eligibility

**Strategic optionality**
- Decision point at Y3+: continue bootstrapped or accept external capital for faster expansion. Both paths preserved by current structure.

## User Journeys

The platform serves four user types: **customers** (consumers buying food), **vendors** (farms and food artisans selling), **admin/platform operators** (Jen and any future ops staff verifying vendors and investigating reports), and an implicit **regulatory audience** (FDACS, state revenue departments, FDA) that interacts with the platform through documentation and records, not a UI. No public API is exposed at MVP.

### Journey 1 — Customer Success Path: Sarah's First Multi-Farm Cart

**Sarah K., 36, Sarasota mom of three, household income ~$110K.** Cooks at home most nights. Drives 45 minutes each way to two farmers markets. Just unsubscribed from her CSA after a third week of beets she didn't ask for. Her grocery delivery's "local" sticker stopped feeling honest the day she watched the same pastured-egg brand appear in three Whole Foods promos.

**Opening scene:** Sunday night, kitchen table, kids in bed. Sarah Googles "buy pastured eggs Sarasota" and lands on a Farm2Table SEO page listing 4 named local egg producers. She clicks the first one, lands on a farm profile with a real address, a photo of the actual pasture, the farmer's first name, and an Animal Welfare Approved certification badge that links out to AWA's verification page.

**Rising action:** She browses the marketplace and adds:
- 2 dozen pastured eggs from one Sarasota farm (pickup at the farm, free)
- A loaf of country sourdough from a Sarasota cottage-food baker (porch drop, $3)
- A jar of raw honey from a Plant City beekeeper (shipped, $7)

At checkout, each line shows the farm's name, the fulfillment method, and the cost. She pays once, total $58. Confirmation email lands within seconds with three sub-receipts — one per vendor — each with the right pickup or shipping detail.

**Climax:** Friday afternoon, the eggs are ready at the farm. The farmer recognizes the order number from the email, hands her the carton, asks if she wants to be on his text list for the next chicken-share. Saturday, the bread shows up on her porch in a paper bag with a hand-written tag. Tuesday, the honey arrives with a note from the beekeeper's daughter.

**Resolution:** The eggs are visibly farm-fresh; the bread crusts the way grocery sourdough never does; the honey is cloudier than Whole Foods' but the label names the apiary. Sarah reorders the next Sunday — and adds two new farms she discovered while browsing.

**Capabilities revealed:** SEO-driven landing pages, marketplace browse with filters (product, location, certification, practice), farm profile pages with verified certifications, multi-vendor cart with per-vendor fulfillment selection, single-pay checkout splitting across vendors, per-vendor confirmation and pickup/shipping details, customer order history, marketplace-sourced order tracking.

### Journey 2 — Customer Edge Case: Vendor Cancellation Becomes Discovery

**Same Sarah, four weeks later.** She's now placed three orders. This week's cart includes pastured bacon from Frank's Farm in Plant City for Saturday morning's brunch.

**Opening scene:** Wednesday evening, Sarah gets an email: "Your bacon order from Frank's Farm has been cancelled." She opens it expecting frustration.

**Rising action:** The email shows: the bacon line item is automatically refunded to her original payment method (Stripe, 1–3 business days). The other items in her cart — apples from one farm, kefir from another — are still scheduled and unaffected. Below the cancellation notice: "Other Farm2Table vendors carrying pastured bacon: **Smith Farm** (Sarasota, pickup Saturday) and **Wesley Pastures** (Wesley Chapel, ships)." Both are tappable.

**Climax:** Sarah taps Smith Farm. New profile. Different farmer. Their pastured pork operation is regenerative — a practice Frank's Farm doesn't list. She adds Smith bacon to a new cart, checks out, total $34.

**Resolution:** The cancellation didn't become a dead end — it became a discovery moment. Smith Farm is now in her saved farms. She'll order from them next week even without bacon.

**Capabilities revealed:** Vendor-initiated cancellation flow with automatic per-line-item refund through Stripe, substitute matching engine (category-match: "pastured bacon" → other Farm2Table vendors carrying it), in-email substitute surfacing with one-tap to product, customer notification system for cancellation events, no-impact-to-other-vendors fulfillment isolation.

### Journey 3 — Vendor Success Path (Tier A, Cottage Food): Mike Replaces His DM Chaos

**Mike Reyes, 34, Sarasota cottage-food sourdough baker.** Bakes 30–40 loaves weekly out of his home kitchen. Sells at the Saturday Sarasota Farmers Market and via Instagram DMs to ~25 regulars. Gross monthly revenue: ~$1,800. His Tuesday-Thursday looks like: copy-Venmo-link-into-text, write down the pickup time in a notebook, hope no one shows up at the wrong time.

**Opening scene:** Saturday market. Another baker mentions Farm2Table after Mike vents about losing two orders to forgotten texts that week. Mike Googles it that night.

**Rising action:** Sunday morning, Mike signs up. He picks his state (FL) and category ("Cottage Food"); the **rules engine immediately shows him exactly what he needs to upload** — FL cottage food registration, business license / DBA, and a compliance attestation acknowledging FL labeling and revenue-cap rules. He photographs the registration on his fridge, uploads both docs, signs the attestation, lists 5 sourdough variants at $9 each, configures fulfillment (home pickup Tuesday and Friday afternoons + local delivery to four nearby zip codes for $4), and connects Stripe Connect (Stripe-hosted identity + bank verification, 6 minutes). Total elapsed time: **24 minutes.**

**Climax:** Monday morning, Mike pastes his Farm2Table store link into his Instagram bio and sends a one-line DM to three regulars: "I built a real ordering page — here's the link." By Friday, he's received 6 pre-orders through the link, taken payment cleanly through Stripe, and avoided exactly zero "did you Venmo me yet?" texts.

**Resolution:** Two weeks in, a customer who found him through Farm2Table's "sourdough Sarasota" search lands her first order. Mike is now booking pre-orders, accepting payment, and tracking inventory entirely through Farm2Table. His notebook stays on the counter, untouched.

**Capabilities revealed:** Tiered vendor onboarding by category (cottage food branch), state + category compliance rules engine surfacing exact required documents, document upload with state-specific compliance attestation, Stripe Connect onboarding via hosted flow, product/variant listing, per-vendor fulfillment configuration (pickup with day-of-week windows, local delivery by zip with vendor-set fee), Stripe checkout with per-order payment split, vendor-shareable storefront link for single-player mode, vendor inventory and order management, marketplace-sourced search surfacing.

### Journey 4 — Vendor Edge Case (Tier B, Established): Tom Adds Farm2Table as a Channel

**Tom, 51, Sarasota-area pastured-egg producer.** Runs a Shopify store, sells at two markets, and has ~400 weekly egg subscribers from his own list. Monthly Farm2Table-relevant revenue: ~$5,000. Skeptical of platforms — got burned once by a CSA aggregator that took 25%.

**Opening scene:** A farmer he respects DMs him: "F2T sent me four new customers last week, and the commission is lower than Market Wagon. Worth a look."

**Rising action:** Tom signs up on Foundation tier (free, 22%) — no risk if it does nothing. The rules engine, on seeing he's a FL egg producer, immediately shows him that he needs a FL Limited Poultry/Egg Farm Operation permit (no small-flock exemption in FL law), plus his business license. He uploads both. He decides not to migrate his entire catalog; he lists only his weekly egg-subscription variant and the occasional duck-egg surplus. He configures fulfillment: pickup at his farm Wednesday and Saturday, local delivery for an extra $5, no shipping (he doesn't want the cold-chain headache).

**Climax:** Day 30: Farm2Table dashboard shows 8 marketplace-sourced orders totaling $420 — customers he wouldn't have reached through his own list. None of his existing 400 subscribers used Farm2Table; they kept their own routine. The platform did exactly what was promised: produced incremental demand, didn't cannibalize.

**Resolution:** Day 60: Farm2Table notifies Tom, "If you'd been on Growth tier this month, you'd have saved $34 in commission." Tom declines to upgrade — his Farm2Table volume is still under the breakeven threshold. He does, however, ship a few jars of his wife's homemade jam under a new product listing, which triggers the rules engine to show the FDACS commercial-food vs. cottage-food path; he picks cottage-food and uploads her registration. His Farm2Table revenue grows; his own Shopify store is unaffected.

**Capabilities revealed:** Rules engine handles edge cases (FL egg producer permit requirement surfaced inline), Foundation tier with full feature set (no crippled trial), GMV dashboard with tier-upgrade math surfaced as suggestion (not auto-tier), incremental-channel positioning (vendor's existing brand and store untouched), multi-product-category support per vendor (eggs + cottage food jam under one account with appropriate compliance branches).

### Journey 5 — Admin / Platform Operator: Jen Clears the Verification Queue with the Rules Engine

**Jen, founder and sole admin in early days.** Spends ~3 hours weekly on vendor verification and reporting in Y1; this scales with vendor count, but the rules engine + AI-assist (post-launch) are designed to keep that number from scaling linearly.

**Opening scene:** Monday morning. The admin dashboard shows three new vendor applications, two flagged customer reports, and one expired-permit alert. Each application opens with a pre-built **expected-documents checklist** generated from the vendor's declared (state, category, product mix). Jen does not need to remember a single state law — the checklist tells her what should be there, what is there, what's missing, and what looks wrong.

**Application 1 — Cottage Food (Mike, from Journey 3):**
- Checklist auto-populated: ✅ FL cottage food registration uploaded (number cross-checks against FL DBPR public registry — match, expires 2027-09); ✅ business license / DBA uploaded (number format valid, no public-registry API in FL counties — manual link surfaced); ✅ compliance attestation signed.
- All green. Jen clicks Approve. Total time: under 2 minutes.

**Application 2 — Commercial Food (a packaged-hot-sauce producer):**
- Checklist: ❌ FDACS commercial food permit *expected for this category* — vendor uploaded a food handler certification instead.
- The rules engine flags the wrong-doc-type explicitly: *"This vendor selected 'Commercial Food' which requires a FDACS Commercial Food Permit (FDACS form CF-1, permit number format: FD-XXXXX). Document uploaded appears to be a food handler certification (different document, not sufficient for this category). Suggested action: request the correct document."*
- Jen clicks "Request Missing Document" — pre-written email with the specific permit name, link to FDACS guidance, and a "re-submit" link. Sent. Application moves to "awaiting documents." Total time: 90 seconds.

**Application 3 — Egg Producer:**
- Checklist: ❌ FL Limited Poultry/Egg Farm Operation permit *required for this category in this state* — not uploaded; vendor selected "Other" for permit type and uploaded a generic business license.
- The rules engine surfaces the FL-specific note: *"All FL egg vendors require a FDACS Limited Poultry and Egg Farm Operation permit regardless of flock size. There is no small-flock exemption in FL law. Vendor's profile claims 30 hens; the dozen-per-week threshold for permit requirement is well below this."*
- Jen has full context. She rejects with a templated reason that includes the FDACS link and a "you can re-apply once you obtain the permit" path. Total time: 90 seconds.

**Reports:**
- **Report 1** — pastured eggs photo dispute: the rules engine doesn't help with subjective claim verification, but the audit trail and admin-vendor messaging tools do. Jen requests a timestamped pasture photo within 7 days; vendor responds; she archives as no violation.
- **Report 2** — vendor cancellation-rate pattern: automated. Vendor's rate is at the 18% threshold; system has already auto-warned. Jen confirms and moves on.

**Permit-expiry alert:**
- A vendor's FL cottage food registration expires in 30 days. Automated email already sent. Jen confirms it went and moves on; if not renewed by expiry, listings auto-pause.

**Resolution:** Total queue time: **under 15 minutes** for what would have taken 45+ minutes without the rules engine. More importantly, Jen never had to look up a single state law — the engine surfaced exactly what to check, with the relevant context inline, and a one-tap link to the authoritative source for the few things that need human eyes.

When AI-assisted extraction lands in Growth (Layer 2), most of the "manual link surfaced" steps in this flow get replaced with auto-cross-check + confidence-scored auto-fill, and the queue time compresses further. The human approve/reject gate stays.

**Capabilities revealed:**
- State + category compliance rules engine (data-driven) — for every (state, vendor category, products) combination, the canonical list of required documents, expected formats, public-registry lookup links, and state-specific notes/edge cases.
- Auto-generated expected-documents checklist in the admin queue, with present / missing / wrong-doc-uploaded status per item.
- Document format validation (permit-number patterns, expiry-date sanity checks, jurisdiction match).
- Templated request-more-info and rejection emails with state-specific context auto-inserted.
- Same rules engine drives vendor onboarding — vendor sees the exact document list they need based on their (state, category, products), reducing rejection rate and round-trips.
- Customer-report investigation queue with admin-vendor messaging, vendor cancellation-rate tracking with automated thresholds, permit-expiry alert system with auto-pause-on-expiry, full action audit log.

### Journey 6 — Support / Safety Incident: Foodborne Illness Report

**A customer ate sourdough purchased through Farm2Table on Saturday. By Monday, three members of her household have GI symptoms.**

**Opening scene:** Monday afternoon. The customer files a foodborne illness report through Farm2Table's customer-reporting channel. The form captures: order number, products consumed, symptom onset time, symptom description, household members affected, contact info, and a checkbox indicating willingness to be contacted by FDACS.

**Rising action:** Within 1 hour, Farm2Table's automated routing:
- Pauses the implicated vendor's listings (precautionary; not a finding of fault).
- Sends the vendor an incident-notice email: "A foodborne illness report has been filed against an order containing your products. We are pausing your listings while we investigate. Please contact us within 24 hours."
- Surfaces the report to Jen's admin queue with high priority.

Jen calls the customer within 4 business hours, captures additional detail, and connects her with the vendor for direct conversation. Jen helps the customer file an FDACS report — Farm2Table's role is documented coordination, not investigation.

**Climax:** Investigation determines the sourdough is unlikely to be the cause — symptom timing and household pattern point to a different shared meal. The vendor's listings are restored after 5 days with a documented "no fault found" note in the audit log. The customer receives a full refund anyway plus a credit for two future orders.

**Resolution:** Had the investigation found vendor fault, the path forward would have been: refund pursued through the vendor's required product-liability insurance per the vendor agreement, vendor's listings remain suspended pending corrective action plan, and — for serious or repeat incidents — permanent removal from the platform. The vendor agreement's reps/warranties + indemnification + insurance-requirement clauses make the vendor the primary responsible party; Farm2Table's role is the marketplace facilitator with documented incident response.

**Capabilities revealed:** Customer foodborne-illness reporting channel with structured intake, automated vendor listing pause on report receipt, vendor incident-notification flow, admin high-priority investigation queue, FDACS reporting coordination workflow, audit trail of investigation timeline and findings, refund + credit issuance (admin-discretionary), vendor agreement enforcement path (suspension → corrective action plan → removal), customer-vendor connection facilitation.

### Journey Requirements Summary

The six journeys collectively reveal these capability areas the MVP must deliver:

| Capability area | Journeys that require it |
|---|---|
| Marketplace browse + farm profiles + filters | 1, 2, 3, 4 |
| Multi-vendor cart with per-vendor fulfillment selection | 1, 2 |
| Single-pay checkout with split payments via Stripe Connect | 1, 2, 3, 4 |
| Per-line-item refund flow that preserves the rest of the order | 2 |
| Substitute matching engine (category-match) | 2 |
| Tiered vendor onboarding with category-specific document requirements | 3, 4, 5 |
| State + category compliance rules engine (Layer 1) — drives both vendor onboarding and admin queue | 3, 4, 5 |
| Auto-generated expected-documents checklist in admin queue | 5 |
| Document format validation (permit-number patterns, expiry-date sanity checks) | 5 |
| Public-registry lookup links surfaced inline | 5 |
| Templated request-more-info and rejection emails with state-specific context | 5 |
| Stripe Connect hosted onboarding embed | 3, 4 |
| Per-vendor fulfillment configuration (pickup, local delivery, shipping) | 1, 3, 4 |
| Vendor product/inventory management (incl. variants and weights) | 3, 4 |
| Vendor-shareable storefront link for single-player mode | 3, 4 |
| Marketplace-sourced order tracking (vs. vendor-shared link) | 1, 4 |
| Vendor GMV dashboard with tier-upgrade suggestion math | 4 |
| Customer-report investigation queue with admin-vendor messaging | 5, 6 |
| Vendor cancellation-rate tracking with automated thresholds | 5 |
| Permit-expiry alerts with auto-pause-on-expiry | 5 |
| Foodborne-illness reporting with auto-pause + FDACS coordination | 6 |
| Vendor agreement enforcement loop (warning → suspension → removal) | 5, 6 |
| Full audit log of admin actions and incident timelines | 5, 6 |
| Customer order confirmation + per-vendor sub-receipts + pickup/shipping details | 1, 3 |
| SEO landing pages for "buy [product] [city]" queries | 1 |

**Capabilities deferred to Growth (Layer 2 — AI-assisted compliance):**

- AI-assisted document extraction (OCR + foundation-model field extraction)
- Automated registry cross-check via state-specific adapters where APIs exist; confidence-scored
- Anomaly detection (state mismatch, claim mismatch, format violations beyond simple regex)
- Confidence-thresholded fast-lane vs. needs-review routing
- "Why this needs human review" specific-uncertainty surfacing

**Capabilities deferred to Vision (Layer 3 — autonomous compliance):**

- Continuous regulatory monitoring with auto-updated rules data
- Cross-platform vendor reputation / portable compliance history
- Real-time compliance monitoring with auto-suspension for known violations

## Domain-Specific Requirements

The food-marketplace domain has no single regulatory framework — instead it sits at the intersection of multiple federal, state, and case-law regimes. The platform must operate cleanly in all of them simultaneously. This section captures the constraints; downstream architecture and epic work will reference these directly.

### Compliance & Regulatory

**Marketplace facilitator sales tax (state-by-state)**

- Once Farm2Table crosses a state's marketplace facilitator threshold, the platform — not the vendor — must collect and remit sales tax for sales delivered to or picked up in that state.
- FL threshold: **$100K in remote taxable sales (revenue-only — no transaction-count alternative exists in FL law).** Likely triggered in Y2 at $1M GMV.
- Most other states: $100K OR 200 transactions (varies).
- Most products on Farm2Table (eggs, produce, raw honey, meat, dairy, grains, unheated packaged baked goods) qualify as **unprepared food** and are **grocery-exempt** in ~36 states. Prepared food (hot meals, ready-to-eat items prepared by seller) is taxable at full rate.
- Beverage subcategory tax treatment varies by state: milk / 100% juice / unflavored water / loose tea = grocery-exempt; carbonated and sweetened beverages typically taxable. Subcategory-level tax codes required.
- Snack-food category exception in some states: chips, pretzels, popcorn may be taxable when other groceries are exempt.
- **Implementation: Stripe Tax with per-line-item Product Tax Code mapping** — category-default + subcategory override for Beverages and Nuts & Snacks. Stripe handles per-jurisdiction taxability and threshold monitoring; Farm2Table registers as marketplace facilitator with each state's revenue department once threshold is approached.
- **Multi-state from day one** — even at MVP, the platform serves shipping-capable vendors nationally, so multi-state tax architecture cannot be deferred.

**Tax sourcing**

- ~34 destination-based states: tax based on customer's delivery address (or pickup location for pickup orders).
- ~12 origin-based states: in-state transactions use vendor's location for state/county/city tax (Texas, California's hybrid rules, etc.). Destination-based for shipped-out-of-state.
- A multi-vendor cart with mixed fulfillment can produce different tax rates per line item based on origin × destination × product category. **Stripe Tax calculates per-line-item; Farm2Table groups order items by fulfillment method and passes the right destination address per group.**

**Vendor licensing — tiered by category**

The platform's vendor onboarding must enforce category-appropriate licensing at sign-up. Required documents per category (driven by the state + category compliance rules engine, MVP Layer 1):

- **Farms (produce, fresh):** state agricultural license/registration, USDA Local Food Directory listing where applicable, business license/DBA.
- **Cottage food producers** (home-kitchen baked goods, jams, granola, dried herbs, etc.): state cottage food registration where required, business license/DBA, compliance attestation acknowledging state labeling and revenue-cap rules. Cottage food revenue caps range $0 (unlimited) to $250K (FL).
- **Commercial food producers** (commercial-kitchen baked goods, fermented goods, packaged shelf-stable): state commercial food permit (FDACS in FL — form CF-1, "FD-XXXXX" format), commercial kitchen license where required, business license, food handler certification.
- **Beekeepers / honey producers:** state apiary registration + business license + cottage food OR commercial permit for sales side.
- **Egg producers:** **all FL egg vendors require FDACS Limited Poultry and Egg Farm Operation permit regardless of flock size** — no small-flock exemption exists in FL law. Other states have similar permits with different thresholds; rules engine surfaces per-state requirement.
- **Meat / poultry:** USDA-inspected OR USDA-exempt (in-state direct-to-consumer only for exempt). State-inspected under the Talmadge-Aiken Cooperative Inspection Program is acceptable in some states. Interstate shipping requires USDA inspection.
- **Raw dairy:** **excluded from the platform entirely in FL (pet-only sale by FL law)** and conditionally allowed in other states per their rules. Rules engine blocks raw dairy listings in FL at vendor onboarding.
- **Third-party certifications (USDA Organic, Animal Welfare Approved, Certified Naturally Grown, etc.):** verified with the issuing body where API or web-lookup exists; displayed as a badge on the listing; customers can filter by them.

**Interstate shipping eligibility**

- **Shelf-stable goods from FDACS commercial-permitted vendors:** generally OK for interstate shipping.
- **FL cottage food interstate:** ambiguous under current law; **defaults to in-state only** until FDACS confirms broader scope. Vendor onboarding sets this conservatively.
- **PA Limited Food Establishment (LFE):** allows interstate shipping for non-TCS foods (longstanding program, not new in 2025).
- **2025 state expansions explicitly allowing interstate cottage food shipping:** ND, GA, TN, TX (each under their respective frameworks).
- **Meat / dairy interstate:** requires USDA inspection.
- **Perishables (eggs, meat, dairy, fresh produce) shipping interstate:** vendors with appropriate USDA/FDACS licensing can ship using insulated coolers, ice packs or dry ice, and overnight or 2-day shipping. Many small farms don't have the licensing required.
- **Vendor onboarding captures shipping capabilities per product per state**; the rules engine enforces eligibility at listing time and at customer checkout (e.g., a TX cottage food vendor can ship to states that accept TX cottage food; an FL cottage food vendor cannot ship interstate by default).

**Product liability**

- Section 230 of the Communications Decency Act provides protection against third-party content claims (product descriptions, reviews) but **does NOT protect against product liability claims for physical injury from food** (Oberdorf v. Amazon panel decision; vacated on en banc rehearing but courts in multiple jurisdictions continue to treat marketplaces as potential "sellers" under state-specific strict product liability theories).
- Liability transfer mechanism: vendor agreement with reps/warranties, indemnification + hold-harmless + defense obligation, tiered insurance requirements (no insurance for cottage-food/small; recommended for mid-size; required minimum $1M general/product liability for large/high-risk vendors, with Farm2Table named as additional insured), compliance attestation, and platform disclaimer of liability.
- Customer ToS: AS IS warranty disclaimer, limitation of liability, binding arbitration with class-action waiver, FOB-at-vendor-origin transaction framing (product responsibility transfers at pickup/delivery — Market Wagon precedent), transaction-by-product-type framing (regulated food = direct vendor-to-customer; Farm2Table is merchant service provider).
- **Disclaimers alone do not protect from physical-injury claims** — courts often find them unconscionable in consumer contexts. The vendor agreement + insurance + indemnification stack is the actual protection.
- **Real budget commitment:** $2–5K Y1 legal for vendor agreement drafted by a food/marketplace attorney (not template). Single consultation w/ food attorney before launch (~$300–500) for vendor agreement and onboarding-process review.
- Platform-level coverage: **product liability insurance ~$42–100/month for $1M coverage** as a Y1 baseline.

**FSMA 204 Food Traceability Rule**

- Federal traceability rule for foods on the FDA Food Traceability List (leafy greens, certain fresh fruits, fresh herbs, certain cheeses, shell eggs, nut butters, etc.). Effective **July 20, 2028** (extended by FDA proposal + Congressional action).
- Most small farms are below the <$25K threshold and exempt; vendors at scale or shipping FTL items interstate are subject.
- **Farm2Table itself is generally not subject** (technology platform that doesn't take possession of food), but vendors handling FTL items will need to maintain Critical Tracking Events and Key Data Elements with 24-hour FDA response capability.
- **MVP commitment:** basic traceability fields (lot number, batch, harvest/pack date) in vendor product listing, surfaced on customer order confirmation. Full CTE/KDE workflow lands in Growth ahead of the July 2028 deadline.
- Strategic framing: building this ahead of the deadline turns a regulatory burden into a vendor-acquisition pitch ("Farm2Table makes you FSMA 204 compliant").

**Privacy (CCPA/CPRA + parallel state laws)**

- CCPA/CPRA (California, effective Jan 2026 updates): privacy policy, "Do Not Sell or Share My Personal Information" link, consumer data access/deletion/opt-out rights, expanded sensitive-PI definition (neural data, data from consumers under 16), stricter data-use transparency, opt-out confirmation.
- Parallel state laws Farm2Table will encounter as it expands: **VCDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), UCPA (Utah)**, and others — modeled on CCPA, with state-specific differences. Compliance is consumer-rights-driven, not state-of-business-driven; complying with California gets ~80% of the way there.
- **MVP requirements:** privacy policy, "Do Not Sell or Share" mechanism, consumer data access (order history, profile data), consumer data export (basic CSV), account deletion, cookie consent management, data processing agreements with Stripe and any analytics providers.
- Risk assessments for automated decision-making (AI-assisted vendor verification in Growth, recommendation algorithms): ensure documented purpose, accuracy testing, opt-out where applicable. Becomes more formal at scale.

**FDA registration & general food law**

- FDA facility registration (21 CFR Part 1, Subpart H) may be required for **vendors shipping food interstate**. Vendor's responsibility, not platform's. Rules engine surfaces requirement; vendor agreement reps the vendor as compliant.
- FDA truthful-labeling rules (ingredients, allergens, nutrition where applicable) — vendor's responsibility per agreement; platform requires labeling fields at product listing time.

### Technical Constraints

- **Multi-state, multi-tenant marketplace from day one** — no per-metro/per-state architecture branches; the platform is one system parameterized by (state, category, products) via the rules engine.
- **Per-line-item tax calculation via Stripe Tax** — line items can have different tax rates within a single order based on origin × destination × PTC.
- **Stripe Connect with split payments and split refunds** — refunds reverse the original split correctly (vendor commission portion + Farm2Table fee portion both reverse); per-line-item refunds preserve other vendors' payouts.
- **Vendor payout schedule:** 7 days post-delivery, holding through the customer's reasonable inspection window. Faster than weekly Friday batch (Market Wagon) and standard SaaS Stripe cycles.
- **Mobile-first responsive** — checkout completes cleanly on a phone; most consumer traffic is mobile.
- **Audit logging** — every admin action (vendor approve / reject / request-more-info, suspension, removal, refund issuance, incident investigation) is logged with actor, timestamp, vendor/customer affected, and reason. This is the paper trail that protects against negligence claims.
- **No platform-owned logistics, anywhere** — no warehouse software, no driver routing, no fleet management. Per-vendor fulfillment configuration is the only "logistics" surface, and it's vendor-managed.
- **Performance:** quantified per Performance NFRs (NFR1–NFR6). Event-driven architecture from day one supports user-visible real-time UX phased to Growth (FR67–FR72); see FR65–FR66 for the event-emission foundation. No hard real-time SLAs in the safety-critical / sub-second-control sense.
- **Availability:** marketplace storefront must be available during peak ordering windows (Sunday evening, market days). Standard 99.9% target. No disaster-recovery exotic requirements at MVP scale.

### Integration Requirements

| System | Purpose | MVP / Growth / Vision |
|---|---|---|
| **Stripe Connect** | Vendor onboarding (Stripe-hosted identity + bank verification), split payments, per-vendor payouts, per-line-item refunds | MVP |
| **Stripe Tax** | Marketplace-facilitator sales tax calculation, threshold monitoring per state, per-jurisdiction rate lookup, PTC-driven per-line-item calc | MVP |
| **State public registries** (USDA Local Food Directory, FL DBPR cottage food, FDACS commercial permit, state apiary registries) | Vendor verification cross-check links surfaced inline; auto-validation where API exists (USDA Local Food Directory has one; many state registries do not) | MVP (link surface) → Growth (auto-cross-check where APIs exist) |
| **Third-party certifying body lookups** (USDA Organic, AWA, Certified Naturally Grown, etc.) | Verify vendor-claimed certifications; surface verification link on customer-facing farm profile | MVP |
| **Email service provider (transactional)** | Vendor application/approval/rejection emails, customer order confirmations, cancellation notices, incident notifications | MVP |
| **Analytics** | Privacy-aware product analytics (opt-out compliant, server-side where feasible) | MVP |
| **Foundation model API (Anthropic / OpenAI / similar)** | AI-assisted document extraction, anomaly detection, substitute matching at scale | Growth |
| **Regulatory monitoring SaaS** (foodflou, SGS Digicomply, or equivalent) | Auto-update of state rules data when laws change | Vision |
| **Insurtech partner** (NEXT Insurance, Huckleberry, or similar) | Embedded vendor product-liability insurance with API-based COI verification | Vision |

### Risk Mitigations

| Risk | Likelihood | Severity | Mitigation | Residual |
|---|---|---|---|---|
| **Foodborne illness from vendor product** | Medium | Critical | Vendor agreement (indemnification + insurance requirement for higher-risk vendors), compliance attestation, tiered onboarding by category, customer reporting + investigation, FDACS coordination protocol, vendor agreement enforcement loop | Medium — vendor may be judgment-proof if uninsured; insurance requirement for higher-risk vendors closes most of this |
| **Product liability lawsuit naming platform** | Low–Medium | Critical | LLC structure (Farm2Table Market LLC), customer ToS with arbitration + class-action waiver, transaction-by-product-type framing (vendor-to-customer for regulated food), platform product liability insurance, vendor agreement indemnification + hold-harmless | Medium — courts may pierce disclaimers for physical injury; insurance + indemnification stack is the real defense |
| **Sales tax non-compliance** | Medium | High | Stripe Tax integration from day one with PTC mapping, marketplace-facilitator registration with each state's revenue department as thresholds approach, automated threshold monitoring | Low — automated tools handle this once configured |
| **Vendor selling non-compliant products** (wrong category, missing permit, mislabeled) | Medium | High | State + category compliance rules engine enforces correct documents at onboarding, vendor compliance attestation, customer reporting, vendor agreement enforcement (warning → suspension → removal), audit log for compliance defense | Medium — self-attestation isn't foolproof; customer reporting + active enforcement closes most of the gap |
| **Vendor lies about licensing or ships unlicensed** | Low–Medium | Medium–High | Documented verification at onboarding (good faith defense), customer reporting, active investigation on reports, immediate suspension on confirmed violation | Low–Medium — Farm2Table risk is low if verification was done in good faith and enforcement on reports is active |
| **Cottage food law violation by vendor** (mislabeling, TCS items, interstate shipping where prohibited) | Low–Medium | Medium | State-specific rules engine at vendor onboarding (right docs, right shipping eligibility), labeling fields on listings, vendor compliance attestation | Low — rules engine prevents most at-onboarding violations |
| **Data privacy violation (CCPA/parallel state laws)** | Low | High | Privacy policy + DPA with Stripe and analytics, "Do Not Sell or Share" mechanism, consumer data export and deletion, cookie consent | Low — well-trodden compliance path |
| **State AG action over pattern of violations** | Low | High | "Cannot be willfully blind" — investigate every report, enforce on confirmed violations, document everything in audit log, marketplace-facilitator framing in ToS | Low — visible compliance + documented enforcement is the defense |
| **FL cottage food interstate ambiguity** | Low | Medium | Default to in-state only for FL cottage food vendors; vendor sets shipping coverage explicitly; rules engine enforces; revisit if FDACS issues clarifying guidance | Low — conservative default protects the platform |
| **Vendor verification scaling beyond founder bandwidth** | Medium | Medium | MVP rules engine reduces per-application time to <2 minutes for clean cases; Layer 2 AI-assist in Growth absorbs the next wave; vendor agreement + audit log compound trust over time | Low–Medium — addressed by phased automation |
| **Hurricane / natural disaster disrupting launch metro** | Medium (FL) | Medium | National shipping channel from day one means revenue isn't 100% metro-dependent; metro launch is incremental, not all-in; communication protocols for vendor and customer notification during outages | Medium — accepted as cost of FL launch |
| **Trust incident** (vendor mislabel, foodborne illness, fraud) | Low–Medium | High | Active enforcement + documented response + transparent communication; first incident handled cleanly is a stronger trust signal than no incidents | Medium — accept that incidents will happen; the response is what matters |

### What's intentionally not in scope for the platform

- **Raw milk for human consumption** — excluded entirely from FL operation (pet-only by FL law); allowed in other states per their rules but de-prioritized.
- **Compounded / regulated supplements / CBD / cannabis** — not on the platform.
- **Alcohol** — out of scope at MVP. Considered for Vision once state-by-state alcohol-marketplace rules are studied.
- **Restaurants, prepared meals for immediate consumption** — out of scope. Farm2Table is a farm-direct marketplace, not a meal-delivery platform.
- **Wholesale-to-business transactions** — not at MVP. Possible Growth-tier feature for Pro vendors but separate flow.

## Innovation & Novel Patterns

Farm2Table is not a breakthrough-technology product. The wedge is strategic positioning (the five-pillar combo no competitor holds simultaneously) and execution discipline in an underserved vertical, not novel computer science. Most of the platform is standard marketplace technology applied carefully. The sections below identify the three places where genuine vertical-specific innovation sits — and explicitly disclaim everything else as "boring tech, well executed."

### Detected Innovation Areas

**1. Compliance-as-product (the state + category rules engine + AI-assisted document review pipeline)**

Most food marketplaces treat regulatory compliance as an internal-ops cost — the platform team manually verifies vendors, looks up state laws as needed, and absorbs the labor as overhead. Farm2Table inverts this: the rules engine is a **product feature** that actively reduces vendor friction (vendors see exactly what they need to upload), reduces admin friction (auto-generated checklists), and ultimately becomes the platform's most defensible moat (the regulatory data, the per-state adapter framework, and the AI extraction pipeline compound over time and across metros).

What's novel:
- **Vertical-specific structured regulatory data** — there is no existing public, accurate, machine-readable database of "what documents does each US state require for each vendor category at each scale." Farm2Table builds this from primary research (state law, FDACS guidance, USDA frameworks) and treats it as proprietary IP.
- **Same data drives two surfaces** — vendor onboarding and admin verification queue read from the same rules data. Most marketplaces have these as separate manual processes.
- **AI-assisted extraction with the right pipeline shape** — extraction → structured fields → registry cross-check (where API exists) → confidence score → human-flag-for-review. This pattern exists in adjacent verticals (Atlas Verified for hospitality compliance) but has not been built specifically for food-marketplace regulatory verification.

**2. Cancellation-as-discovery (substitute matching engine)**

When a vendor cancels an order, the standard marketplace pattern is to refund and apologize. Farm2Table converts the cancellation into a discovery moment: the customer's email and in-app notification surface other Farm2Table vendors carrying the same product category, with one-tap reorder. The cancellation becomes a way to deepen the customer's relationship with the marketplace rather than a dead end.

What's novel:
- The pattern requires a **product taxonomy from day one** that maps individual vendor SKUs to shared substitute categories ("pastured bacon" as a category that spans multiple vendors). Standard marketplaces don't maintain this depth of taxonomy.
- The **emotional reframe** — turning a service failure into a discovery moment — is a positioning choice that affects downstream design (notification copy, UI emphasis, the mental model the customer leaves with).
- Operationally beneficial as well: customers who reorder from a substitute farm don't churn from the marketplace; vendors lose a single sale rather than a customer.

**3. Single-player value first (cold-start architecture)**

The standard marketplace cold-start failure mode: build the marketplace, fail to attract supply, fail to attract demand, die. Farm2Table's solution is to make the platform **immediately useful to a vendor for managing existing customers** (replacing DM-and-Venmo chaos with a real online storefront, payment processing, inventory, and pre-order flow) before the marketplace generates any new demand. Vendors bring their existing customer bases to Farm2Table; those customers discover other vendors via the multi-farm cart; the marketplace flywheel turns.

What's novel:
- This is not a new pattern (Andrew Chen's "Cold Start Problem" describes it as "single-player mode"; Homegrown uses similar positioning). What's novel for Farm2Table is the **explicit instrumentation**: tracking marketplace-sourced order ratio (vs. vendor-shared link orders) as the primary liquidity metric, with a 20% threshold by month 6 of public launch as the success/failure signal.
- The architectural consequence: the same Stripe Connect onboarding, product/inventory tooling, customer messaging, and payment flow must work cleanly *whether or not* the marketplace is producing demand. This shapes the product priority order at MVP — single-player capabilities ship before any marketplace-discovery features.

### Market Context & Competitive Landscape

The vertical-specific innovations land in a market where competitors have addressed adjacent problems but missed this combination:

- **Barn2Door, Local Line, GrazeCart** — pure SaaS for individual farms. No marketplace, no cross-vendor discovery, no compliance infrastructure beyond standard payment processing.
- **Market Wagon** — marketplace with platform-owned logistics. Spent 9 years reaching 20 metros because every metro requires a hub. Compliance handled manually per state. No vertical-specific rules engine.
- **Homegrown** — closest direct comparable. Family-scale, ~700 vendors after ~1 year, "$10/mo flat" positioning (effective take rate ~4.5–6.5% with all fees). No state+category rules engine; manual verification. No public substitute matching engine.
- **Misfits Market / Imperfect Foods** — warehouse-aggregated. Different problem entirely (consumers report "feels like organic grocery delivery, not farm-direct").
- **Atlas Verified, foodflou, SGS Digicomply** — adjacent compliance technology, but built for enterprise food-safety teams, not for a marketplace's vendor onboarding flow.

The compliance-as-product positioning is genuinely unoccupied. The cancellation-as-discovery and instrumented-single-player patterns are less unique but become defensible when combined with the rest of the stack and the regulatory IP.

### Validation Approach

Each innovation has a specific way it can be tested before it's load-bearing in production:

- **Rules engine (Layer 1):** validated by the Gainesville pilot (Oct 2026 onwards). Success metric: vendor onboarding abandonment rate <30% (research benchmark) and admin queue per-application time <2 minutes for clean cases. If either metric misses, the rules data needs more depth or the UX is wrong — both fixable before commercial launch.
- **AI-assisted document review (Layer 2, Growth):** validated when application volume reaches ~10/week. Success metric: ≥80% of clean applications routed to fast-lane (auto-fill complete, no flags), ≤5% false-positive flag rate (cases where AI flagged but human review found no issue), zero false-negative approvals (cases where AI passed an application that should have been flagged). Roll out in shadow mode first — AI runs alongside manual review for 4 weeks, output compared, then graduates to fast-lane routing.
- **Substitute matching engine (MVP basic, Growth deeper):** validated by tracking customer behavior on cancellation emails. Success metric: ≥30% click-through to a suggested substitute, ≥50% of click-throughs result in a follow-up order from the substitute vendor within 14 days. If click-through is low, the substitute suggestions aren't relevant (taxonomy depth issue) or the email design is wrong.
- **Single-player value (cold-start architecture):** validated by tracking the marketplace-sourced order ratio over time. The 20% by month 6 threshold is the validation gate. Below that, the marketplace flywheel hasn't started turning; above that, it has.

### Risk Mitigation

- **Rules engine data accuracy:** the rules data is sourced from primary research and is only as good as the research behind it. Mitigation: every state+category rule cites its source (statute, FDACS bulletin, USDA guidance); regulatory monitoring SaaS in Vision (Layer 3) auto-flags when source documents change. Manual annual review of all states' rules in Growth.
- **AI-assisted review reliability (Layer 2):** the AI never auto-approves; it only auto-fills, scores, and flags. The human approve/reject gate stays. Even if AI accuracy degrades, the worst case is manual review reverting to MVP-equivalent throughput, not bad approvals.
- **Substitute matching false-positives:** suggesting a substitute that isn't actually equivalent (e.g., suggesting commercial-kitchen sourdough when the customer wanted cottage-food sourdough) erodes trust. Mitigation: substitute suggestions are scoped to the same product subcategory + comparable practices/certifications where available; customers can report a bad substitute suggestion to refine the engine.
- **Single-player adoption fails:** if vendors don't actually use the platform for existing customers before the marketplace works, the cold-start strategy fails. Mitigation: instrument vendor-shared-link orders as a leading indicator (target ≥80% of orders via vendor-shared link in months 1–3 of a vendor's life); intervene with onboarding-flow improvements or vendor success outreach if this metric misses.

### Explicitly Not-Innovation (Boring Tech, Well Executed)

Listed for clarity so downstream architecture and engineering decisions don't over-build:

- **Multi-vendor cart with per-vendor fulfillment.** Standard marketplace UX (Etsy and similar). Build with proven patterns, not a custom checkout framework.
- **Stripe Connect with split payments and split refunds.** Stripe's standard marketplace integration. Configure correctly; don't reinvent.
- **Stripe Tax with PTC mapping.** Standard marketplace facilitator integration. The novelty is the per-vendor-category PTC default + subcategory override mapping (data, not code).
- **Mobile-first responsive web app.** Standard. No native apps at MVP. No custom mobile framework.
- **SEO landing pages.** Standard. Use a well-trodden static-generation or server-rendered pattern.
- **CCPA/CPRA privacy compliance.** Standard. Use established privacy-policy templates + standard consent management.
- **Vendor profile pages, search, filter.** Standard ecommerce. Use proven patterns.
- **Customer order confirmation emails, vendor application/rejection emails.** Standard transactional email infrastructure (Postmark, SendGrid, Resend, etc.).

The build velocity of MVP depends on aggressively *not* innovating on these surfaces. Innovation budget goes to the three areas above; everything else is "ship the standard pattern and move on."

## Web App Specific Requirements

### Project-Type Overview

Farm2Table is a server-rendered web application with a hybrid (SSR + selectively interactive) architecture. The customer-facing surface is SEO-critical: marketplace browse, farm profile pages, product detail pages, and geo-targeted landing pages ("buy [product] in [city]") must render server-side with full structured data so they're indexable and rank in local search results. The vendor and admin surfaces are dashboard-style and can be more interactive (client-rendered routes within the same app shell), since they're behind authentication and not SEO-relevant.

No native mobile apps at MVP. No PWA install requirement at MVP. No offline support — the platform requires connectivity to function. Mobile-first responsive web is the entire mobile strategy.

**Real-time?** Architecturally yes, even when user-visible real-time UX is deferred. The platform is event-driven from day one — every domain state change emits a domain event — and the front-end data layer abstracts transport so polling → SSE/websocket is a swap, not a rewrite. MVP user surfaces use email + polling for most updates; Growth turns on live in-app notifications, live order/dashboard updates, and live inventory counts; Vision adds checkout inventory holds, real-time customer-vendor messaging, and web push.

### Technical Architecture Considerations

**Rendering strategy: SSR + hybrid (Next.js or equivalent)**

- **Server-rendered, indexable** — marketplace home, search results, category pages, farm profiles, product detail pages, geo-targeted landing pages, blog/content marketing pages, vendor public storefront pages.
- **Server-rendered, gated** — customer account pages, vendor dashboards, admin queue. Not indexable; SSR for first-paint speed, then client-rendered route transitions.
- **Static or ISR (incrementally revalidated)** — marketing/legal pages (ToS, privacy policy, "what we look for in vendors," "FSMA 204 explained"), state-by-state regulatory landing content, "tell us where to launch next" interest form.
- **Avoid pure SPA shell** — would require client-side rendering for SEO surfaces, which both hurts ranking and slows first-paint on mobile.

The PRFAQ names Next.js as the leading candidate. Equivalent acceptable options: Remix, SvelteKit, Astro (with SSR adapter for the dashboard side). Decision criteria for the architect: first-paint performance on mid-tier mobile, SEO-friendliness of routing model, ecosystem maturity for the integration list (Stripe Connect, Stripe Tax, transactional email), compatibility with the chosen backend platform.

**Browser matrix**

- **Required (consumer-facing):** latest 2 versions of Chrome, Safari (desktop + iOS Safari), Edge, Firefox. iOS Safari deserves explicit emphasis — mobile traffic skews iOS.
- **Required (vendor/admin-facing):** same browsers; vendors may run older devices, so test on iOS Safari ≥2 versions back specifically.
- **Not supported:** IE11, legacy Edge, browsers older than 2 versions back. Show a graceful "browser too old" message rather than silent failure.

**Responsive design**

- **Mobile-first** — primary breakpoint design starts at ~360px wide; all customer flows (browse, cart, checkout, account) must complete cleanly on a phone.
- **Tablet** — supported but not a separate design pass; layouts respond fluidly.
- **Desktop** — enhanced for vendor dashboards and admin queue (where multi-column layouts and dense data tables are appropriate).
- **Touch targets** — minimum 44×44pt per Apple HIG and 48dp per Material guidance. Especially load-bearing on the multi-vendor cart UI, where per-vendor fulfillment selection is the most state-heavy interaction in the product.

**Performance targets (Core Web Vitals)**

- **LCP (Largest Contentful Paint):** <2.5s on mid-tier mobile (3G Fast equivalent) for SEO-critical pages.
- **INP (Interaction to Next Paint):** <200ms on mid-tier mobile, especially for cart/checkout interactions.
- **CLS (Cumulative Layout Shift):** <0.1 — no late-loading hero images shifting layout, no late-injected ads or banners.
- **TTFB (Time to First Byte):** <600ms server-side render time on cached pages, <1s on uncached.
- **Image optimization** is the highest-impact lever — vendor product photos and farm pasture photos dominate page weight. Use a CDN with on-the-fly responsive resizing, modern formats (AVIF/WebP with fallback), and lazy-loading below the fold.

**SEO strategy**

The marketplace's organic acquisition depends on these surfaces ranking:

- **URL structure** — semantic, lowercase, hyphenated. Examples:
  - `/farms/sarasota/sunshine-creek-farm`
  - `/products/eggs/pastured`
  - `/local/sarasota/eggs`
  - `/local/sarasota/raw-honey`
- **Page-level SEO**
  - Unique `<title>` + meta description per page; templated for category/farm/product pages.
  - Canonical URLs to handle facet/filter combinations and same-product-across-vendors collisions.
  - `hreflang` not yet relevant (English-only at MVP); structure to add later.
- **Structured data (Schema.org JSON-LD)**
  - `LocalBusiness` on farm profile pages — name, address, geo-coordinates, opening hours, telephone, certifications.
  - `Product` + `Offer` on product detail pages — including price, availability, currency, and shipping info where applicable.
  - `Review` + `AggregateRating` once review data is captured (post-MVP).
  - `Breadcrumb` on all category/product pages.
  - `Organization` on the marketplace homepage.
- **Sitemap + robots.txt** — auto-generated, with separate sitemaps for farms, products, and category/landing pages. Submit to Google Search Console and Bing Webmaster.
- **Open Graph + Twitter Cards** — for social sharing; vendor-shared store links should preview cleanly on Instagram, Facebook, X.
- **Content marketing surfaces** — blog posts, FAQ pages, "[city] farmers market guide"-style content; SSG/ISR-rendered, indexable, internal-linked to relevant vendor and product pages.
- **Local SEO specifics** — Google Business Profile is owned by individual farms (not Farm2Table); strategy is to get vendor profiles linked from their GBP and to compete on long-tail "[product] [city]" queries where farms don't typically rank well individually.
- **No paid SEO services or schema-spam tactics** — the goal is durable ranking via real content depth and structured data, not link-buying.

**Accessibility (WCAG 2.1 AA target)**

- **Customer-facing surfaces: WCAG 2.1 AA mandatory.** Reasons:
  - Snowbird and aging-parent demographic has higher rates of vision and motor accessibility needs; this is a real audience, not a compliance check.
  - Online retailers are increasingly targeted in ADA Title III lawsuits in federal court (Domino's v. Robles upheld; Target settled $6M).
  - Several states (CA, NY, IL) have parallel state laws.
  - Schema.org structured data + semantic HTML benefits SEO simultaneously.
- **Vendor and admin surfaces: WCAG 2.1 AA target** but with realistic prioritization (keyboard navigation, color contrast, screen-reader labels mandatory; some advanced patterns may slip to Growth).
- **Specific minimums:**
  - Color contrast ≥4.5:1 for normal text, ≥3:1 for large text and UI components.
  - All interactive elements keyboard-reachable and focus-visible.
  - Form labels programmatically associated; error messages announced to assistive tech.
  - Image alt text required on all vendor-uploaded images (vendor-side validation prompts for it during product creation).
  - No reliance on color alone to convey information (cancellation badges, status indicators include text or icon).
  - Skip links and proper landmark structure on every page.
- **Testing approach** — automated (axe-core or similar) in CI for every PR; manual screen-reader testing on critical flows (checkout, vendor onboarding, admin queue) before launch; periodic third-party audit at Growth scale.

**Authentication model**

- **Customer authentication:** email + password OR email + magic link (passwordless). Customer accounts are low-stakes for security but need email verification before first order. Optional OAuth providers (Google, Apple) — deferrable post-MVP without architectural rework.
- **Vendor authentication:** email + password with mandatory email verification. Stripe Connect handles bank account / KYC separately — vendors authenticate to Farm2Table for everything else (listings, orders, messaging, settings). 2FA optional at MVP, mandatory at Growth (especially for vendors at higher GMV tiers where account takeover has financial impact).
- **Admin authentication:** email + password with **mandatory 2FA from day one** (TOTP or hardware key). Admin accounts have significant blast radius (vendor approve/reject, listing removal, refund issuance); password-only is unacceptable.
- **Session management:** JWT or signed cookies; reasonable expiration; logout-everywhere capability. No "remember me forever" — sessions expire and require re-auth.
- **Password reset:** standard email-link flow with rate limiting. No security-question patterns.

**Image handling and CDN**

- Vendor product images and farm profile images dominate page weight and are user-uploaded — must go through an image pipeline that:
  - Validates content type and size at upload (reject 30MB phone photos uncompressed).
  - Stores originals and serves transformed variants (responsive sizes, modern formats, automatic compression).
  - Strips EXIF metadata on upload (privacy — vendor's home address embedded in EXIF would leak through cottage food photos otherwise).
  - Delivers via CDN with regional edge caching.
- Reference services: Cloudflare Images, ImageKit, Cloudinary, or platform-native (Convex file storage, next/image + S3 + CloudFront). Decision in architecture step; the requirement is "transformed, compressed, EXIF-stripped, CDN-delivered."

**Caching strategy**

- **SEO-critical SSR pages:** server-side render with response-cache headers and CDN-edge caching; revalidation on data change (vendor publishes new product, vendor profile updates, etc.).
- **Authenticated pages:** no caching at CDN; client-side data caching via reactive subscriptions (Convex) or SWR/React Query patterns (non-Convex stacks) for dashboard data freshness.
- **Static assets:** long-cache with content hashing.
- **Search results:** can be cached briefly (60s) at edge; not critical to be perfectly fresh.

**Event-driven architecture & real-time readiness**

Real-time capability is treated as a first-class architectural concern from day one, not an enhancement. MVP ships without user-visible push UX (polling + email + Stripe webhooks cover the visible behaviors), but the underlying event layer must exist so future real-time features are a transport swap rather than a rewrite.

**MVP architectural prep (no UX exposure yet):**

- **Domain events emitted on every state change** — order placed/updated/cancelled, inventory delta, vendor application status changes, vendor profile/listing changes, admin action (approve/reject/suspend), customer-report filed, foodborne-illness incident reported, refund issued, payout completed.
- **Reactive query layer or pub/sub bus with topic-based fan-out** — in a Convex-based stack this is the platform's native query reactivity; in a Postgres-based stack this is Postgres `LISTEN/NOTIFY`, Redis pub/sub, or platform-managed equivalent (Inngest, Trigger.dev). The choice is in architecture; the requirement is that subscribers can attach without modifying the publishing code.
- **Email delivery, Stripe webhook handling, audit logging, expiry-alert scheduling, and analytics ingestion are all subscribers**, not inline writes. This is the pattern that makes future real-time features cheap to add.
- **Stripe webhooks** are themselves real-time inbound events — already required for payment success/failure, refund processing, payout completion, dispute creation, Connect account updates. These flow into the same event system rather than into bespoke handlers.
- **Frontend data layer abstracts transport** — in Convex this is built in (every `useQuery` is reactive); in non-Convex stacks use SWR, React Query, or equivalent fetching hooks with subscription-friendly patterns. Components don't know whether their data source is polling or pushed; the transport layer can be swapped.

**Growth — turn on user-visible real-time:**

- **In-app notification center** for customers (order placed, vendor accepted, fulfillment status, cancellation, substitute suggestions) and vendors (new order, customer message, expiry alerts, admin requests-more-info). Delivered via SSE or websocket; falls back to polling on incompatible browsers.
- **Live vendor dashboard** — new orders appear without page refresh; order status changes propagate instantly across vendor's open tabs.
- **Live admin queue** — new applications and reports appear live; reduces "Jen refreshes the queue every 5 minutes" pattern.
- **Live inventory display on product pages** — count ticks down as other customers buy; cart shows "1 left" warnings live.
- **Live order tracking for customers** — vendor marks "preparing → ready for pickup / out for delivery / delivered" and customer sees the change without refresh.

**Vision — full real-time:**

- **Checkout inventory holds with optimistic locking** — when a customer adds an item to cart, the inventory is held for a configurable window (e.g., 10 minutes during checkout); live count visible to other customers; hold expires and item returns to availability if checkout doesn't complete.
- **Real-time customer-vendor messaging** — chat-style UX with typing indicators and read receipts. (MVP uses email + in-app inbox; Growth adds in-app push delivery; Vision adds true chat semantics.)
- **Web push notifications** — opt-in browser notifications for order updates and vendor alerts. Requires PWA prerequisites; lands with PWA install support.
- **Real-time fulfillment tracking with optional integrations** — vendors with Route Planner add-on can stream live driver location to customers expecting local delivery (post-MVP add-on, opt-in per vendor).

**What this means for the stack choice:**

- **Real-time-ready is non-negotiable.** Whichever stack the architecture step selects, reactive subscriptions or push-capable query semantics must be a first-class platform feature, not a bolted-on layer. Convex meets this natively (every query is reactive); Supabase meets it via `LISTEN/NOTIFY` + websockets; a Postgres + custom-websocket build can meet it with explicit work.
- **Job runner / scheduled work** must support pub/sub or recurring/cron functions (Convex has scheduled functions and cron built in; Inngest, Trigger.dev, BullMQ on Redis qualify for non-Convex stacks).
- **Hosting** must support long-lived SSE/websocket connections or be on a platform like Convex that handles the transport. Some serverless edge runtimes have connection limits — verify before committing.
- **Stripe webhook ingestion** flows into the same event-emission system used by user-driven mutations. (In Convex this is an HTTP action that writes data and triggers reactive updates everywhere downstream. In a Postgres stack it's a webhook handler that writes to the DB and emits to the pub/sub bus.)
- **CDN-fronted SSR pages** still cache; real-time channels run on a separate connection topology regardless of stack choice.

### Implementation Considerations

**Stack guidance (advisory, not prescriptive)**

The architecture step (downstream BMad workflow) makes the final stack call. The PRD's role here is to constrain the choice with non-negotiable requirements:

- **Framework must support SSR + hybrid client routing** (Next.js, Remix, SvelteKit, Astro w/ SSR adapter). Not pure SPA.
- **Tight Stripe Connect + Stripe Tax integration** must be supported with first-class libraries — this is the most complex integration and the framework's ecosystem matters.
- **Image pipeline must be a known-good service**, not custom.
- **Database / backend platform** must support transactional integrity for marketplace orders and split payouts AND make real-time reactive queries cheap. Three candidates worth serious evaluation in the architecture step:
  - **Convex** (leading candidate) — TypeScript-native real-time backend platform with reactive queries by default, ACID mutations, built-in scheduling/cron/full-text/vector search/file storage, HTTP actions for Stripe webhooks. Collapses most of the "MVP architectural prep" plumbing into the platform itself. Strongest match for solo-founder build under a tight window with a real-time-first architecture requirement. Trade-offs: hosted-SaaS lock-in, no SQL (analytics belong in a warehouse anyway), schema-evolution patterns differ from SQL migrations.
  - **Supabase** (Postgres + realtime + auth + storage) — preserves SQL escape hatch and analytics-friendly schema; real-time via Postgres `LISTEN/NOTIFY` → websockets. Slightly more plumbing than Convex; more familiar mental model for SQL-experienced contractors.
  - **Self-hosted PaaS Postgres** (Neon/Supabase Postgres-only/RDS) + Redis + custom websocket layer + ORM (Prisma/Drizzle) — most flexible, lowest lock-in, highest build effort. Conservative fallback if either of the above proves insufficient.

  The architecture step makes the final call. The PRD's constraint is: **transactional integrity for marketplace flows + real-time reactive queries as a first-class capability + minimal infrastructure for solo-founder build.**
- **Background jobs** for async work: Stripe webhook handlers, registry cross-checks, expiry alerts, transactional email queueing. Convex has scheduled functions and cron built in; non-Convex stacks need a real job runner (BullMQ, Inngest, Trigger.dev, or platform-managed equivalent).

**Hosting and deployment**

- **Platform-as-a-service preferred for MVP** — Vercel, Render, Fly, Railway for the web app; Convex Cloud for the backend platform if Convex is selected.
- **Database hosting** — managed Postgres (Neon, Supabase) for non-Convex stacks; Convex Cloud for Convex.
- **CDN** — built into the PaaS or via Cloudflare in front.
- **Logging + monitoring** — error tracking (Sentry or similar), uptime monitoring (Better Uptime / similar), structured logs.
- **No on-prem, no Kubernetes at MVP** — over-engineering against the build window.

**What's intentionally not in scope for the web app at MVP**

- Native mobile apps (iOS, Android) — Vision.
- PWA install / offline mode — Vision.
- **User-visible push UX** (in-app notification center, live dashboards, live inventory counts, web push) — deferred to Growth. The architecture is real-time-ready from day one (event-driven, pub/sub or reactive-query-native, transport-abstracted data layer); only the user-visible push surfaces are deferred. Email + polling cover MVP UX needs.
- Multi-language support — English-only at MVP. Architecture should leave room for i18n but not implement it.
- Advanced personalization / recommendation engine — Growth onwards.
- Public API for partners or integrations — Growth onwards (when Accounting Sync add-on lands, that's the first real API consumer).
- A/B testing infrastructure — Growth.
- Real-time inventory with optimistic locking and cart-hold mechanics — MVP does pessimistic decrement at checkout; refined behavior is Growth.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** experience MVP + platform MVP (combined).

- **Experience MVP** — the multi-farm cart with named-farm provenance must work cleanly enough that early customers choose it over driving to multiple Saturday markets, settling for grocery-delivery "local," or signing up for a CSA mystery box. The wedge has to feel real on the first cart, not on the tenth.
- **Platform MVP** — the multi-state regulatory architecture (rules engine, Stripe Tax with PTC mapping, vendor agreement enforcement loop, audit logging) is **baseline infrastructure, not future scope**. Adding it later would require rebuilding vendor onboarding, the data model, and the admin queue. It's MVP because the cost of deferring it is higher than the cost of building it now.

Not chosen and not what this MVP is:
- Not a **revenue MVP** — Y1 platform revenue projection is ~$58K, cash-flow positive in Y2 Q3-Q4. The MVP is not designed to fund itself in Y1.
- Not a **minimum problem-solving MVP** in the lean-startup sense — the surface area is intentionally larger than "smallest thing that works" because the wedge requires both sides of the marketplace + compliant operation simultaneously. There is no smaller version of "two-sided multi-vendor compliant marketplace."
- Not a **growth MVP** with paid tiers, add-ons, AI document review, embedded insurance, or featured listings. Those are deliberately deferred.

The strategic question the MVP answers: **does the multi-farm cart wedge produce >20% marketplace-sourced order ratio by month 6 of public launch?** Above the line, the model works and Y2 scaling proceeds. Below the line, the operating model needs revisit (per the early-warning thresholds in Success Criteria).

**Resource Requirements:**

- **Founder-built; no contractor at MVP.** Modern web stack + Convex (or alternative real-time-ready backend, per architecture step) + Stripe Connect.
- **Build window:** July–September 2026 (12-week MVP build sprint).
- **Operational support during build:** legal review of vendor agreement and ToS by a food/marketplace attorney ($2–5K Y1 budget, with an additional ~$300–500 for a single pre-launch consultation).
- **Y1 capital:** $10–37K (bootstrapped, no external investors, no debt).
- **Y1 monthly recurring opex:** $1–3K (hosting, software, insurance, accounting).
- **Pilot operator:** Gainesville pilot Oct 2026 onwards is single-operator (founder) running vendor onboarding, customer support, and admin queue. Vendor application volume in pilot is expected to be low enough (1–5/week) that the rules engine alone is sufficient; AI-assisted Layer 2 lands in Growth when volume reaches ~10/week.

### MVP Feature Set (Phase 1)

The MVP is the smallest credible commercially-launchable version of Farm2Table. Pilot launches in Gainesville October 2026; commercial launch in Tampa Bay-Sarasota Q1 2027.

**Core User Journeys Supported (all six journeys from the User Journeys section):**

1. Customer success path — multi-farm cart, per-vendor fulfillment, single-pay checkout
2. Customer edge case — vendor cancellation with substitute matching as discovery
3. Vendor success path — Tier A cottage food onboarded in <30 minutes, single-player mode
4. Vendor edge case — Tier B established vendor adds Farm2Table as incremental channel
5. Admin / operations — verification queue with state + category compliance rules engine
6. Support / safety — foodborne-illness reporting with FDACS coordination

All six journeys must be supported end-to-end at MVP. None are deferred.

**Must-Have Capabilities (consolidated from Product Scope, Domain Requirements, Web App Requirements, and Journey Requirements Summary):**

*Customer-facing*
- Marketplace browse with filters (product, farm name, location, certification, practice)
- Server-rendered farm profile pages with verified third-party certifications
- Server-rendered product detail pages with structured data
- Geo-targeted SEO landing pages ("buy [product] in [city]")
- Multi-vendor cart with per-vendor fulfillment selection at checkout
- Single-pay Stripe checkout with split payments via Stripe Connect
- Customer account, order history, customer data export, account deletion
- Per-vendor sub-receipts with pickup/shipping details
- Order tracking with per-vendor cancellation/refund visibility
- Customer-vendor messaging (basic, for hold/cancellation requests)
- Customer reporting flow (misrepresentation, food safety, vendor cancellation issues)
- Mobile-first responsive web; WCAG 2.1 AA on consumer-facing surfaces

*Vendor-facing*
- Tiered onboarding by category (farm / cottage food / commercial food / micro-producer) with branching document requirements
- Foundation tier only at MVP (free, 22% commission, 5 products, 2 variants/product, 5 team members)
- Stripe Connect onboarding (Stripe-hosted identity and bank verification)
- Product/inventory management with variants and weight-based pricing
- Per-vendor fulfillment configuration (pickup address, local delivery zip codes, shipping coverage by state and product category)
- Vendor-shareable storefront link for single-player mode
- Vendor profile editor with practice/certification declarations and image upload
- Order management with fulfillment status updates
- Vendor GMV dashboard

*Platform / admin*
- State + category compliance rules engine (Layer 1, data-driven) — drives both vendor onboarding (vendor sees exact required documents) and admin verification queue (auto-generated checklist with present/missing/wrong-doc status, format validation, public-registry lookup links)
- Vendor agreement (drafted by food/marketplace attorney) + customer ToS with arbitration + class-action waiver
- Privacy policy + CCPA/CPRA-compliant data handling
- Admin verification queue with templated request-more-info and rejection emails
- Customer-report investigation queue with admin-vendor messaging
- Vendor agreement enforcement loop (warning → suspension → removal)
- Stripe Tax marketplace-facilitator integration with category→PTC mapping (multi-state from day one)
- Basic substitute matching (category-match)
- Per-vendor cancellation cutoffs displayed on listings
- "Tell us where to launch next" interest form
- Foodborne-illness reporting with auto-pause + FDACS coordination protocol
- Vendor cancellation-rate tracking with automated thresholds
- Permit-expiry alerts with auto-pause-on-expiry
- Full audit log of admin actions and incident timelines
- Operational monitoring + on-call for outages

*Architectural prep (no user-visible UX yet)*
- Event-driven architecture from day one — every domain state change emits a domain event onto a reactive query layer or pub/sub bus
- Real-time-ready data layer — transport-abstracted so polling → SSE/websocket is a swap, not a rewrite
- Stripe webhook ingestion flowing into the same event system
- Audit log as a subscriber, not an inline write

### Post-MVP Features

**Phase 2 (Growth, post-MVP through end of 2027 — Tampa Bay-Sarasota commercial launch and scaling):**

*Tier expansion*
- Growth tier ($59/mo, 18% commission, 14-day free trial)
- Pro tier ($149/mo, 12% commission)
- Auto-suggest tier upgrade notifications

*Add-ons*
- Email Promotions ($24.99/mo)
- Advanced Analytics ($19.99/mo)
- CSA Manager ($24.99/mo)
- Route Planner ($29.99/mo)
- Accounting Sync ($14.99/mo)

*Compliance Layer 2 — AI-assisted document review*
- OCR + foundation-model field extraction
- Automated registry cross-check with confidence scoring
- Anomaly detection
- "Why this needs human review" specific-uncertainty surfacing

*User-visible real-time UX*
- In-app notification center for customers and vendors
- Live vendor dashboard with new-order pop-in
- Live admin queue with new-application/new-report propagation
- Live inventory display on product pages
- Live order tracking for customers

*Compliance and trust*
- Annual vendor re-attestation workflow
- Vendor compliance dashboard (status, expiries, complaints)
- FSMA 204-ready vendor onboarding (basic traceability fields, lot tracking)
- Customer-facing certification badges
- Public vendor profile enhancement (story, photos, traceability)

*Marketplace mechanics*
- Improved substitute matching (taxonomy depth, sub-product attributes)
- Featured listings ($5–50/wk per vendor)
- Customer loyalty rewards / repeat-buyer flow
- Consumer referral / share-a-cart viral mechanic
- Inventory alerts (low stock, harvest-fresh)

*GTM / market expansion*
- Metro #2 launch (Greenville-Spartanburg / Raleigh-Durham / Austin) Q1–Q2 2028
- Vendor referral program
- Market-manager partnership tooling
- USDA Extension office partnership content

**Phase 3 (Vision, Year 3+ and the long-term arc):**

*Compliance-as-moat at scale*
- Embedded vendor insurance (insurtech partnership) with API-based COI verification
- Continuous regulatory monitoring with auto-updated rules data (Layer 3)
- Cross-platform vendor reputation / portable compliance history
- Real-time compliance monitoring with auto-suspension on known violations
- FSMA 204 full traceability (CTEs, KDEs, 24-hour FDA response)

*Trust infrastructure*
- QR-code product traceability (consumer-facing)
- Vendor trust scoring (composite from compliance, reviews, complaints, insurance)

*Full real-time UX*
- Checkout inventory holds with optimistic locking
- Real-time customer-vendor messaging (chat semantics)
- Web push notifications (PWA-prerequisite)
- Real-time fulfillment tracking (Route Planner integration)

*Marketplace maturity*
- 5-metro footprint (Year 3 stretch path) → 50-metro national footprint (10-year horizon)
- ~$200–240M annual GMV at full national maturity
- Optional B2B tooling for market managers
- Optional enterprise partnerships (regional grocery, restaurant supply, CSA aggregators)
- SNAP/EBT acceptance (USDA SNAP Online)

*Strategic optionality*
- Decision point at Y3+: bootstrapped vs. external capital. Both paths preserved by current structure.

### Risk Mitigation Strategy

**Technical Risks (scoping-relevant)**

| Risk | Mitigation in MVP scope | Validation gate |
|---|---|---|
| **Multi-vendor cart UX is the most state-heavy interaction in the product** — per-vendor fulfillment selection, payment splitting, edge cases on cancellation. Hardest single thing to get right. | Use proven marketplace patterns (Etsy-style); don't custom-build a checkout framework. Ship pilot on Gainesville to surface edge cases at low blast radius. | Customer cart abandonment <40% when ≥2 pickup locations required (early-warning threshold). |
| **Real-time-ready architecture under tight build window.** Risk: founder over-engineers and burns weeks; or under-engineers and locks the platform out of Growth real-time UX. | Prefer a stack where real-time is native (Convex as leading candidate per architecture step). Defer user-visible push UX to Growth. Don't build websocket infrastructure that doesn't yet have UX consumers. | MVP ships within 12-week build window without compromising real-time-ready data layer. |
| **Compliance rules engine data accuracy.** Wrong rule data → wrong vendor verification → liability exposure. | Source every state+category rule from primary research with citation; manual review of all rules data before launch; conservative defaults (FL cottage food shipping = in-state only) where ambiguous. | Pilot operates 6 months without a confirmed false approval (vendor approved who lacked required documents). |
| **Stripe Connect + Stripe Tax integration complexity** — KYC, split payments, split refunds, marketplace facilitator tax across 50 states. | Use Stripe's documented patterns; don't innovate. Stripe handles 90% of complexity. PTC mapping is data, not custom code. | Stripe Tax correctly calculates tax on multi-vendor mixed-fulfillment orders at pilot launch. |

**Market Risks (scoping-relevant)**

| Risk | Mitigation in MVP scope | Validation gate |
|---|---|---|
| **Two-sided cold-start failure** — most marketplaces die here. | Single-player value first: vendors use the platform to manage existing customers via vendor-shared link before the marketplace generates new demand. Boots-on-the-ground vendor recruitment in Sarasota markets. Vendor-shared content as primary customer acquisition. | ≥25 vendors live by end of Sept 2026; ≥75 customer accounts by end of Q4 2026. |
| **Multi-pickup friction kills customer retention** — the wedge wins on shopping but loses on fulfillment. PRFAQ identifies this as moderate-probability, high-severity. | Honest customer-facing copy about multi-pickup; substitute matching as discovery moment for cancellations; instrumentation to detect retention failure early. | Customer reorder rate ≥25% within 30 days; avg cart vendor count ≥2 by month 6. |
| **Marketplace liquidity never materializes** — vendors join but customers come only through vendor-shared links, not marketplace discovery. | Track marketplace-sourced order ratio explicitly. If <20% by month 6, the marketplace strategy revisits. | Marketplace-sourced orders ≥20% by month 6 of public launch. |
| **Funded competitor enters Sarasota** (Market Wagon expansion most likely). | Speed and vendor lock-in are the defense. Lower commission ceiling (Pro tier 12% vs. Market Wagon 20–30%) creates structural switching cost once vendors graduate. Multi-farm cart UX is fundamentally different from logistics-heavy marketplace. | Hub #2 launching by Q1–Q2 2028 before any plausible Market Wagon Sarasota entry timeline. |

**Resource Risks (scoping-relevant)**

| Risk | Mitigation in MVP scope | Validation gate |
|---|---|---|
| **Build window slippage** — 12-week MVP sprint with single-builder. | Aggressively *not innovating* on standard surfaces (Stripe Connect, image pipeline, auth, email, SEO) — use proven patterns. Innovation budget reserved for the three vertical-specific innovations only (rules engine, substitute matching, single-player instrumentation). Convex (or equivalent) collapses several plumbing layers. | MVP build complete by end of September 2026 with no >2-week slip vs. plan. |
| **Vendor onboarding scaling beyond founder bandwidth at pilot** — even with rules engine, manual review at high volume is unsustainable. | Layer 2 AI-assist scoped for Growth, sized to land when application volume reaches ~10/week. Pilot Gainesville volume expected at 1–5/week. | Founder verification queue time ≤3 hours/week through end of pilot. |
| **Legal/compliance budget overrun.** $2–5K vendor agreement could expand if attorney scope creeps. | Single attorney consultation pre-launch (~$300–500), templated agreement reviewed and customized rather than drafted from scratch. | Y1 legal spend ≤ $5K. |
| **Pilot fails to validate MVP and Sarasota commercial launch needs delay.** | Pilot Gainesville Oct–Dec 2026 is the validation window before Tampa Bay-Sarasota commercial Q1 2027. Explicit go/no-go gate at end of pilot. | All MVP early-warning thresholds (Measurable Outcomes table in Success Criteria) at "healthy" levels by end of Q4 2026. |

### Scoping Decisions Locked

The following decisions are explicitly locked through this scoping exercise and require new evidence (not just opinion change) to revisit:

1. **Phased delivery: MVP / Growth / Vision** — confirmed.
2. **MVP commercial launch metro: Tampa Bay-Sarasota, Q1 2027.** Pilot in Gainesville, Oct 2026.
3. **National shipping channel active from MVP day one** for shipping-capable vendors. Local fulfillment density expands metro-by-metro; the unit of expansion is vendor density + customer awareness, not platform infrastructure.
4. **Foundation tier only at MVP** — Growth and Pro tiers (and add-ons) deferred to Phase 2. Foundation must reach ≥50 active vendors and clear graduation candidates before Growth tier launches.
5. **State + category compliance rules engine (Layer 1) is MVP** — driven by the explicit founder requirement that the platform not depend on memorizing 50 states' worth of regulatory variance.
6. **AI-assisted document review (Layer 2) is Growth, not MVP** — landed after vendor application volume reaches ~10/week, with shadow-mode validation for 4 weeks before fast-lane routing.
7. **Real-time-ready architecture is MVP requirement; user-visible push UX is Growth.**
8. **Convex (or equivalent real-time-ready, transactionally-integral backend) is the leading platform candidate** — final stack decision in the architecture step.
9. **Multi-state regulatory architecture (Stripe Tax with PTC mapping, marketplace facilitator framing, FSMA 204-ready data model) is MVP** — cannot be deferred without rebuilding.
10. **Six MVP user journeys; all six are supported end-to-end at launch.** None are deferred.
11. **Out of scope at MVP and likely longer:** raw milk for human consumption (FL pet-only), CBD/cannabis/regulated supplements, alcohol, restaurants/prepared meals, wholesale-to-business. Reconsider individually if state law or strategic position changes.

### What's *Not* Locked (Open Decisions for Architecture Step)

- Final stack selection (Convex vs. Supabase vs. self-hosted Postgres + custom — the architecture step decides with the constraints from Web App Specific Requirements).
- Image pipeline service (Cloudflare Images / ImageKit / Cloudinary / platform-native).
- Specific framework (Next.js vs. Remix vs. SvelteKit vs. Astro).
- Hosting platform (Vercel / Render / Fly / Railway / Convex Cloud).
- Email service provider (Postmark / SendGrid / Resend).
- Error tracking / monitoring stack.
- Analytics platform (privacy-aware constraint applies; specific tool open).

## Functional Requirements

The functional requirements below are the **capability contract** for Farm2Table. Each FR states a testable capability — WHAT exists, not HOW it's implemented. Implementation choices (technology, UI, performance numbers, accessibility level) live in the Web App Specific Requirements, Domain Requirements, and Non-Functional Requirements sections, not here.

Actors used: **Customer** (end consumer buying food), **Vendor** (farm or food artisan selling), **Admin** (platform operator — Jen and any future ops staff), **Platform** (autonomous system behavior). Phase tags `[MVP]`, `[Growth]`, `[Vision]` indicate which delivery phase introduces each capability; capabilities without a tag are MVP.

### Marketplace Discovery & Provenance

- **FR1:** Customers can browse the marketplace by product category, farm name, location, certification, and farming practice without authentication.
- **FR2:** Customers can view a farm profile that displays the farm's name, address, declared practices, verified third-party certifications, and the products it currently offers.
- **FR3:** Customers can view a product detail page that displays the product's vendor, price, available variants, fulfillment options, traceability fields the vendor provides, and applicable certifications.
- **FR4:** Customers can navigate to geo-targeted landing pages keyed by (product, city) that surface local farms offering that product.
- **FR5:** The Platform can present third-party certifications (USDA Organic, Animal Welfare Approved, Certified Naturally Grown, and others) as filterable badges on listings, with verification linking back to the issuing body.
- **FR6:** The Platform can render farm profiles, product detail pages, and category/landing pages as indexable content with structured data so they appear in search-engine results.
- **FR7:** Customers can save farms to a personal saved-farms list accessible from their account, and view those farms' new products and availability changes.

### Multi-Vendor Cart, Checkout & Tax

- **FR8:** Customers can add items from multiple vendors to a single cart and see each line item attributed to its vendor with the vendor's available fulfillment options.
- **FR9:** Customers can select fulfillment method per vendor (farm pickup, vendor-run local delivery, or vendor-run shipping) at checkout, where each option respects the vendor's configured availability for that product, the customer's location, and applicable per-state shipping eligibility.
- **FR10:** Customers can complete a single payment that splits across all vendors in the cart, with the Platform deducting per-vendor commission and platform service fee.
- **FR11:** The Platform can calculate sales tax per line item based on origin (vendor location) × destination (delivery address or pickup location) × product tax category, applying state grocery exemptions and prepared-food taxability rules.
- **FR12:** The Platform can register as a marketplace facilitator and remit sales tax in each state once that state's facilitator threshold is reached.
- **FR13:** Customers and Vendors can receive per-vendor sub-receipts that show the vendor's items, prices, fulfillment method, and pickup/shipping details for that vendor's portion of the order.
- **FR14:** The Platform can issue per-line-item refunds that reverse the original payment split (vendor portion + platform portion) without affecting other vendors' line items in the same order.
- **FR15:** Vendors can receive payouts seven days after delivery confirmation for each fulfilled line item, net of commission and fees.

### Vendor Onboarding & Compliance Verification

- **FR16:** Vendors can apply to join the platform by selecting their state and one or more vendor categories (farm, cottage food, commercial food, beekeeper, egg producer, meat producer, dairy producer).
- **FR17:** Vendors can be presented with the exact set of required documents, attestations, and shipping-eligibility rules for their declared (state, category, products) combination, drawn from the state + category compliance rules engine.
- **FR18:** Vendors can upload required documents (state agricultural license, FDACS or equivalent commercial food permit, cottage food registration, USDA exemption, apiary registration, business license, food handler certification, COI where applicable).
- **FR19:** Vendors can sign a compliance attestation acknowledging applicable state labeling, revenue-cap, and food-safety requirements.
- **FR20:** Vendors can complete identity and bank-account verification through Stripe Connect's hosted onboarding before payouts are enabled.
- **FR21:** Vendors can sign the vendor agreement before listings go live.
- **FR22:** The Platform can block category × state combinations that are restricted by law (raw dairy in FL is pet-only; raw milk for human consumption excluded entirely; CBD/cannabis/regulated supplements; alcohol; restaurants / prepared meals for immediate consumption; wholesale-to-business at MVP).
- **FR23:** The Platform can default vendors in states with ambiguous interstate cottage food law (e.g., FL) to in-state-only shipping, and allow vendors to extend coverage only to states their license actually authorizes.

### Vendor Storefront & Operations

- **FR24:** Vendors can create, edit, publish, unpublish, and remove product listings, each with variants, weight-based pricing, photos with required alt text, descriptions, traceability fields (lot number, batch, harvest/pack date), and labeling fields (ingredients, allergens, applicable disclaimers).
- **FR25:** Vendors can edit their farm profile (name, address, declared practices, story, photos, certification claims, contact preferences).
- **FR26:** Vendors can configure fulfillment per product or product set: farm pickup with day-of-week and time-window availability, vendor-run local delivery by zip code with vendor-set fee, and vendor-run shipping by destination state with vendor-set fee and packaging method.
- **FR27:** Vendors can manage inventory (current quantity, low-stock alerts, sold-out state, restock).
- **FR28:** Vendors can view and act on incoming orders: accept, mark in preparation, mark ready or shipped, mark delivered, cancel, refund.
- **FR29:** Vendors can communicate with customers about active orders (hold, reschedule, or cancellation requests).
- **FR30:** Vendors can view a sales dashboard showing GMV, orders, marketplace-sourced vs. vendor-shared-link orders, and tier-upgrade math suggesting savings at the next subscription tier.
- **FR31:** Vendors can share a storefront link that displays only their own products, for use in their own customer outreach (Instagram bio, email lists, market booth signage), independently of the marketplace.
- **FR32:** Vendors can subscribe to the Foundation tier (free, 22% commission).
- **FR32a:** Vendors can subscribe to the Growth tier and Pro tier when those launch in Phase 2 `[Growth]`.
- **FR33:** Vendors can purchase add-on capabilities individually `[Growth]` (Email Promotions, Advanced Analytics, CSA Manager, Route Planner, Accounting Sync), with all add-ons included free at the Pro tier.
- **FR34:** Vendors can opt into featured-listing promotion for vendor-set durations and budgets `[Growth]`.

### Order Lifecycle, Fulfillment & Substitute Discovery

- **FR35:** Customers can view an order's overall status and each vendor's per-line-item fulfillment status (preparing, ready, in transit, delivered) and pickup/shipping details.
- **FR36:** Vendors can cancel an order line, triggering automatic refund to the customer for that line, leaving the order's other vendors unaffected.
- **FR37:** Customers can request that a vendor hold their order for a later pickup or delivery date, subject to vendor acceptance.
- **FR38:** When a vendor cancels a line item, the Platform can surface alternative Farm2Table vendors offering the same product category, with one-action reorder.
- **FR39:** The Platform can display per-vendor cancellation cutoffs on listings (typically 24–48 hours before fulfillment) so customers know when changes can still be made without vendor permission.
- **FR40:** The Platform can match substitutes by deeper attributes than category match `[Growth]` — taxonomy depth, practice/certification compatibility, sub-product attributes.

### Customer Account, Trust & Reporting

- **FR41:** Customers can create an account with email verification, accept the customer Terms of Service, and complete first-order purchase.
- **FR42:** Customers can view their order history, saved farms, payment methods, and account profile.
- **FR43:** Customers can export their account data (orders, profile) in a portable format.
- **FR44:** Customers can delete their account and the associated personal data the Platform stores, in accordance with applicable privacy law.
- **FR45:** Customers can exercise CCPA/CPRA rights including a "Do Not Sell or Share My Personal Information" choice and access/deletion requests, with the Platform confirming each request.
- **FR46:** Customers can submit reports of suspected vendor misrepresentation (false provenance, miscategorized listings) with structured intake.
- **FR47:** Customers can submit foodborne-illness reports with structured intake including order reference, products consumed, symptom onset and description, household members affected, and consent for FDACS contact.
- **FR48:** Customers can submit reports of vendor cancellation patterns or service quality issues.
- **FR49:** Customers can submit "tell us where to launch next" interest signals including their location and product interests.

### Admin Verification, Enforcement & Incident Response

- **FR50:** Admins can view a vendor application queue with each application displaying the rules-engine-generated checklist of expected documents, the present/missing/wrong-doc-uploaded status of each, format-validation results on permit numbers and expiry dates, and one-action links to the relevant public registry where applicable.
- **FR51:** Admins can approve a vendor application, request additional or corrected documents from the vendor with a templated email containing state-specific context, or reject the application with a templated reason.
- **FR52:** The Platform can auto-fill the verification checklist via AI-assisted document extraction (OCR + foundation-model field extraction) and route applications to a fast-lane queue when confidence is high and no flags are present `[Growth]`.
- **FR53:** The Platform can cross-check uploaded documents against state public registries via state-specific adapters where APIs exist, with confidence scoring `[Growth]`.
- **FR54:** Admins can view a customer-report queue with structured intake data and admin-vendor messaging tools to investigate reports.
- **FR55:** Admins can issue warnings to vendors, suspend vendor listings, restore suspended listings, and remove vendors from the platform.
- **FR56:** The Platform can automatically pause a vendor's listings on receipt of a foodborne-illness report and notify the vendor with an incident-notice email.
- **FR57:** Admins can coordinate FDACS reporting with the affected customer and vendor, including providing FDACS-relevant intake data and recording the investigation timeline in an audit log.
- **FR58:** The Platform can track vendor cancellation rates against configurable thresholds and automatically warn vendors who exceed them; repeated patterns auto-trigger admin review and listing suspension. **Initial thresholds (tunable post-launch from real data):** warn at >10% cancellation rate over a rolling 30-day window with a minimum sample of ≥10 orders; auto-trigger admin review at >20%. Thresholds and the rolling-window length must be admin-configurable, not hard-coded.
- **FR59:** The Platform can send permit and certification expiry alerts to vendors at 90, 60, and 30 days before expiry, and automatically pause listings on expiry if not renewed.
- **FR60:** The Platform can prompt all vendors annually to re-attest current compliance, with non-response triggering listing pause `[Growth]`.
- **FR61:** The Platform can record every admin action (vendor approve, reject, request more, warn, suspend, remove, refund, report investigation, incident response) in an immutable audit log with actor, timestamp, vendor/customer affected, and reason.
- **FR62:** Admins can issue refunds and credits to customers as a discretionary action, with the action recorded in the audit log.

### Platform Communication & Real-Time Foundations

- **FR63:** The Platform can send transactional emails for vendor application status changes, customer order confirmations and updates, vendor order notifications, cancellation notices, substitute-suggestion notices, expiry alerts, and incident notifications.
- **FR64:** Customers and Vendors can read messages from each other through an in-app inbox.
- **FR65:** The Platform can ingest Stripe webhook events (payment success, payment failure, refund processed, payout completed, dispute, Connect account update) and propagate the resulting state changes through the same event-emission system as user-driven mutations.
- **FR66:** The Platform can emit a domain event on every state change (order placed/updated/cancelled, inventory delta, vendor application status, vendor profile/listing change, admin action, customer report filed, refund issued, payout completed) such that subscribers (email delivery, audit logging, expiry-alert scheduling, analytics ingestion) consume events without modifying the publishing code.
- **FR67:** Customers and Vendors can receive in-app notifications via real-time push for order status changes, vendor messages, expiry alerts, and admin requests `[Growth]`.
- **FR68:** Vendors can see live updates to their order list and dashboard without manual refresh `[Growth]`.
- **FR69:** Admins can see live updates to the verification queue and report queue without manual refresh `[Growth]`.
- **FR70:** Customers can see live inventory counts on product pages and order tracking updates on order pages `[Growth]`.
- **FR71:** Customers can opt into web push notifications for order updates and vendor alerts `[Vision]`.
- **FR72:** Customers and Vendors can hold inventory during checkout for a configurable window with optimistic locking and live count visibility `[Vision]`.

### Capability Contract Note

This list is binding. Any feature not enumerated here will not exist in the final product unless it is explicitly added to this section. Downstream UX design, architecture, and epic breakdown will work from this list as the source of truth.

Capabilities deferred to **Growth** are committed for Phase 2 (Tampa Bay-Sarasota commercial launch through end of 2027). Capabilities deferred to **Vision** are committed for Phase 3 (Year 3+) but their specific shape may evolve based on Phase 2 learnings.

## Non-Functional Requirements

The non-functional requirements below specify HOW WELL Farm2Table must perform. Each NFR is testable. Categories that don't materially apply to the product (internationalization, native-app guidelines, hard real-time SLAs, geographic-compliance frameworks like FedRAMP) are not included.

### Performance

- **NFR1:** SEO-critical pages (marketplace home, search results, farm profiles, product detail, geo landing pages) achieve **LCP <2.5s, INP <200ms, CLS <0.1** on mid-tier mobile (3G Fast equivalent), measured at the 75th percentile.
- **NFR2:** Server-rendered pages return TTFB <600ms when CDN-cached, <1s when uncached, at the 95th percentile.
- **NFR3:** Authenticated dashboard surfaces (vendor dashboard, admin queue) reach interactive paint within 1.5s of navigation at the 95th percentile.
- **NFR4:** Search and filter results return within 500ms for typical queries (single-state scope, <10 facets) at the 95th percentile.
- **NFR5:** End-to-end checkout (cart load → payment confirmation) completes within 8 seconds for a 3-vendor order at the 95th percentile, inclusive of Stripe round-trips.
- **NFR6:** Image delivery uses modern formats (AVIF/WebP with fallback), responsive sizing, and lazy loading; vendor product photos are compressed to ≤200KB at displayed size at the 95th percentile.

### Security

- **NFR7:** All network traffic encrypted via TLS 1.3 (or current industry best practice); HSTS enforced; HTTPS-only.
- **NFR8:** Sensitive data at rest is encrypted (database, file storage, backups).
- **NFR9:** Customer payment card data is **never stored on Farm2Table infrastructure** — all card handling is delegated to Stripe (PCI scope minimization); the platform handles only Stripe-issued tokens.
- **NFR10:** Vendor banking, tax (W-9/W-8), and identity-verification data are handled by Stripe Connect's hosted onboarding and **never stored on Farm2Table infrastructure**.
- **NFR11:** Vendor-uploaded compliance documents (licenses, permits, certifications) are stored with at-rest encryption and access-controlled to admin role only.
- **NFR12:** Admin authentication requires **mandatory 2FA from day one** (TOTP or hardware key); password-only admin auth is not permitted.
- **NFR13:** Vendor authentication requires email verification at signup; 2FA is optional at MVP and **mandatory at Growth tier and above** (where account takeover has material financial impact).
- **NFR14:** Customer authentication requires email verification before first order; passwords meet OWASP minimum strength rules (≥12 chars, breach-list checked).
- **NFR15:** Session tokens expire (idle timeout ≤24 hours, absolute timeout ≤30 days), can be invalidated server-side, and logout-everywhere works for all users.
- **NFR16:** All Stripe webhook payloads have HMAC signature verification before processing; unverified webhooks are rejected.
- **NFR17:** Rate limiting protects authentication endpoints, order placement, report submission, and password-reset flows (anti-abuse, anti-credential-stuffing).
- **NFR18:** Application secrets (API keys, database credentials, Stripe keys) are stored in environment variables or a managed secrets store; never committed to source control.
- **NFR19:** Internal staff access to PII follows least-privilege; staff access to vendor or customer records is logged in the audit trail.
- **NFR20:** Annual security review covering OWASP Top 10 (injection, auth, sensitive data, XXE, access control, misconfig, XSS, deserialization, vulnerable components, logging) starts at MVP+1 year or upon first incident.

### Privacy & Data Lifecycle

- **NFR21:** CCPA/CPRA compliance from day one, with parallel state law compatibility (VCDPA, CPA, CTDPA, UCPA, and additional state privacy laws as they enter force).
- **NFR22:** Customers can export all personal data within 24 hours of request, in a portable format (JSON or CSV).
- **NFR23:** Customer account deletion purges PII within 30 days; audit-relevant references are pseudonymized rather than deleted to preserve regulatory defense.
- **NFR24:** "Do Not Sell or Share My Personal Information" link is prominently placed (footer of every page), functional, and the platform confirms each opt-out request.
- **NFR25:** Cookie consent management distinguishes essential cookies from analytics/marketing cookies; non-essential cookies require opt-in.
- **NFR26:** Data Processing Agreements are in place with every third-party data processor (Stripe, email service provider, analytics, error tracking, image CDN, foundation-model API at Growth).
- **NFR27:** EXIF metadata is stripped from all uploaded images at the time of upload, before storage or display (vendor-home-address leakage prevention).
- **NFR28:** Customer data is not sold or shared with third parties for marketing purposes; vendor data shared with the customer (farm address, certifications, product details) is the explicit publishing intent.
- **NFR29:** Personal data retention policies are documented per data category; retention durations align with regulatory minimums (food safety: 7 years; tax: 7 years; consumer privacy requests: per applicable state law).

### Reliability & Availability

- **NFR30:** Marketplace storefront uptime ≥**99.9%** (≤43 minutes downtime per month) at MVP, ≥99.95% by end of Y2.
- **NFR31:** Higher-priority availability targeted during **peak ordering windows** (per active metro: Sunday 6pm–11pm local time, market days for that metro); maintenance is scheduled outside these windows.
- **NFR32:** Recovery Time Objective (RTO) ≤2 hours for total platform recovery from a catastrophic failure.
- **NFR33:** Recovery Point Objective (RPO) ≤15 minutes for the primary datastore — order, payment, and audit-log data have near-zero loss tolerance.
- **NFR34:** Stripe webhook handlers are **idempotent** — replaying any webhook (e.g., on Stripe's automatic retry) produces no double-processing.
- **NFR35:** Background-job retry policies handle transient failures with exponential backoff; jobs that fail after retry are surfaced to the admin queue rather than dropped silently.
- **NFR36:** Transactional email delivery: messages are queued and retried on transient failure; eventual delivery success rate ≥99.5%.
- **NFR37:** Graceful degradation: if a non-critical service (analytics, public-registry lookup, AI document review) fails, core flows (browse, checkout, vendor onboarding, admin verification) continue to function.
- **NFR38:** Disaster recovery procedure is documented and tested annually starting in Y2.

### Scalability

- **NFR39:** MVP capacity: 1,000 concurrent browsing users, 100 concurrent checkout sessions, 50 active vendors, ≤200 daily orders, without degradation against the performance NFRs above.
- **NFR40:** Y2 capacity: 10,000 concurrent browsing users, 500 concurrent checkout sessions, 200 active vendors, ≤2,000 daily orders, on the same architecture (no rewrite).
- **NFR41:** Y3 capacity: 50,000 concurrent browsing users, 2,000 concurrent checkout sessions, 500+ active vendors across multiple metros, ≤10,000 daily orders.
- **NFR42:** Adding new states to the platform requires only **rules-engine data updates** (and Stripe Tax registration), not architectural changes.
- **NFR43:** Vendor count growth is linear in resource consumption; no per-vendor infrastructure provisioning is required.
- **NFR44:** Critical-path database queries are indexed; no full-table scans permitted on the order, vendor, product, or audit-log tables at production scale.
- **NFR45:** The platform handles 10× peak load above weekly average (e.g., a press hit on Saturday morning) without availability impact, accepting up to 50% latency degradation for the spike duration.

### Accessibility

- **NFR46:** Consumer-facing surfaces meet **WCAG 2.1 Level AA** at MVP. (Reaffirmed; see Web App Specific Requirements for the full specification.)
- **NFR47:** Vendor and admin surfaces meet WCAG 2.1 AA targets at MVP for keyboard navigation, color contrast, focus visibility, and screen-reader labeling; advanced patterns may slip to Growth with documented exceptions.
- **NFR48:** Automated accessibility testing (axe-core or equivalent) gates every pull request to prevent regressions.
- **NFR49:** Manual screen-reader testing of critical flows (browse, checkout, vendor onboarding, admin verification queue, customer reporting) is performed before every public release.
- **NFR50:** A third-party accessibility audit is commissioned annually starting at Growth scale (Phase 2).

### Observability & Operability

- **NFR51:** All backend services emit structured logs with request correlation IDs; logs are searchable and retained ≥30 days at MVP, ≥90 days at Growth.
- **NFR52:** Error tracking is integrated (Sentry or equivalent) with on-call alerting on error-rate spikes, new error fingerprints, and regressions.
- **NFR53:** Uptime monitoring covers customer storefront, vendor dashboard, admin queue, checkout flow, and Stripe webhook intake; alerting routes to on-call.
- **NFR54:** Application metrics (request rates, latencies, error rates, database query performance) are collected and dashboarded.
- **NFR55:** Business metrics (GMV, daily/weekly orders, vendor onboarding velocity, admin queue depth, marketplace-sourced order ratio, customer reorder rate) are collected and dashboarded for founder visibility.
- **NFR56:** Stripe webhook delivery is monitored — success/failure rates per event type — with replay capability for any missed event in the last 30 days.
- **NFR57:** Customer- and vendor-facing error messages do not leak internal implementation details (stack traces, database errors, internal IDs); a unique error reference is shown for support escalation.
- **NFR58:** Maintenance windows are communicated to vendors and customers ≥48 hours in advance via email and in-app status banner; emergency maintenance has best-effort communication.

### Compliance & Auditability

- **NFR59:** The audit log is **immutable** — no edit, delete, or backdate operations are possible at the application or database layer; tampering is detectable.
- **NFR60:** Audit log retention: ≥**7 years** (aligned with food-safety and tax regulatory minimums); longer where active litigation hold applies.
- **NFR61:** The audit log records every admin action (vendor approve, reject, request more, warn, suspend, remove, refund, report investigation, incident response), every vendor agreement signing and re-attestation, every compliance document upload and verification decision, every customer privacy request (export, deletion, opt-out), and every foodborne-illness incident with full investigation timeline.
- **NFR62:** The audit log is queryable for state AG investigations, FDACS inquiries, FDA inquiries (FSMA 204 at Growth), and litigation discovery, with admin-grade access controls and access logging.
- **NFR63:** Vendor verification documentation (uploaded permits, attestations, registry cross-check evidence) is retained per vendor for the duration of their account plus 7 years after deactivation.
- **NFR64:** FDACS-coordination and foodborne-illness investigation records are retained per food-safety regulatory minimums and made available to FDACS on request.
- **NFR65:** Stripe Tax reporting (sales by state, taxable vs. exempt breakouts) is available on demand for state revenue department audits.
- **NFR66:** Documented data lineage exists: each vendor's approval traces to the documents and rules-engine version that approved them; substitute suggestions to the taxonomy version that generated them; tax calculations to the PTC mapping version applied. Versioned and replayable for audit defense.

## Document Status

- **Status:** Complete — workflow finalized 2026-04-25
- **Workflow:** bmad-create-prd v1
- **Review state:** All sections explicitly approved through the create workflow
- **Next BMad workflow:** `bmad-create-architecture` (with optional `bmad-create-ux-design` first if UI/UX work warrants a dedicated pass)
- **Re-validation triggers:** any change to the locked scoping decisions in Project Scoping section, or addition/removal of a Functional Requirement
