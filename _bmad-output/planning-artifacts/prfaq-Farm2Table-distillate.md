---
title: "PRFAQ Distillate: Farm2Table"
type: llm-distillate
source: "prfaq-Farm2Table.md"
created: "2026-04-25"
purpose: "Token-efficient context for downstream PRD creation"
---

# Concept

- Two-sided D2C marketplace connecting local farmers and artisan food producers with consumers
- **Wedge:** multi-farm cart + named-farm provenance (one cart from multiple farms; every line item shows the named producer)
- **Wedge confirmed across four LLMs** (Claude, Grok, ChatGPT/Cursor, Source D) — no competitor occupies this whitespace
- Brand: **Farm2Table** (locked as consumer-facing brand). Founder owns Farm2Table Market, LLC (FL) + farm2table.app domain + 5+ years of work history. Trademark strategy: compound mark "Farm2Table, The Online Farmer's Market" (Class 35) + distinctive design mark for logo. Federal Principal Register protection may be limited due to TTAB descriptiveness precedent (In re Fowles Wine, 2017); compound + design marks plus brand-building investment compensate. Realistic budget: ~$2-3.5K legal/design over 12-18 months.
- **Concept type:** commercial product

# Customer ICP

- **Primary:** health-conscious millennial / Gen X parents seeking farm-direct food that grocery delivery (Whole Foods, Instacart, Misfits Market) can't credibly deliver
- **Secondary:** mobility-limited 65+ adults in Sarasota who can't reliably attend physical farmers markets (BUT tech-adoption barrier is real; the more honest secondary persona may be **adult children buying for aging parents**)
- **Common pain:** distrust of warehouse-mediated "local"; CSA mystery box fatigue (NYT April 2026 "boatload of chard"); inability to know which farm produced their food

# Vendor ICP (segmented for GTM)

- **Tier A — cottage food, new-to-online producers:** pitch is "free online storefront, no monthly cost, no commitment, pay only when you sell." Easiest acquisition.
- **Tier B — established vendors with existing channels (Barn2Door, Shopify, Instagram):** pitch is "incremental orders from multi-farm-cart customers you wouldn't have gotten otherwise — not a replacement for your direct channel." Hardest pitch; depends on multi-farm-cart actually generating volume.
- **Tier C — mature vendors at $10K+/mo GMV:** pitch is "Pro tier 12% commission beats Market Wagon's 20-30%." Cost-savings angle.

# Why Now (April 2026)

- **MAHA federal policy momentum** (RFK Jr. + USDA Sec. Rollins): $700M Regenerative Pilot, raw milk loosening, regenerative-ag endorsement
- **Cottage food + interstate-shipment liberalization** (PA, ND, GA, TN, TX SB 541 in 2025-2026)
- **USDA cancelled Regional Food Business Centers + Farm-to-School funding (Aug 2025)** — small regenerative farms losing institutional channels
- **GLP-1 grocery basket shrinkage + per-calorie quality-spend shift**
- **CSA box fatigue** (NYT April 2026)

# Geography Strategy

- **Phase 1 (May-Oct 2026):** Gainesville pilot (low cost of operation, dense farm supply per USDA, 2hr from Tampa for founder presence)
- **Phase 2 (Q1 2027 — Feb 13, 2027):** Tampa Bay-Sarasota commercial launch with sub-zone anchor in Sarasota-Bradenton (~1M pop, in operational sweet spot)
- **Future Hub #2 candidates:** Greenville-Spartanburg SC, Raleigh-Durham NC, Austin TX (decision driven by Y2 traction + founder location post-AI-training)
- **Asheville rejected** despite top data score: requires founder relocation, Helene supply fragility, Market Wagon presence per ChatGPT

# Operating Model (LOCKED — non-negotiable choices)

- **NO shared community pickup hub.** Each vendor handles its own fulfillment exclusively (farm-direct pickup, local delivery, or shipping). Multi-farm cart = potentially multiple pickup locations.
- **Vendor-managed fulfillment.** Each vendor exposes their fulfillment options (pickup at farm, local delivery in select zip codes, shipping for shelf-stable goods, perishable shipping with insulated coolers/dry ice if licensed).
- **No subscription / no auto-renewal** for consumers. Pay per order.
- **No auto-tier graduation** for vendors. Vendors choose their tier; platform shows "save $X/month by upgrading" notifications.
- **Cottage food INCLUDED** with conservative shipping defaults (in-state default; vendor opt-in for interstate where state law allows).
- **Raw dairy excluded** (FL pet-only restriction).
- **Eggs require FDACS Limited Poultry/Egg Farm permit** (no platform "small backyard exemption"; no "50-hen" threshold exists in FL law).

# Pricing Model (LOCKED)

| Tier | Monthly | Commission | GMV guidance |
|---|---|---|---|
| Foundation | Free | 22% | $0-$3K/mo |
| Growth | $59/mo ($590/yr) | 18% | $3K-$10K/mo |
| Pro | $149/mo ($1,490/yr) | 12% | $10K+/mo |

- Consumer service fee: 4% per order
- Add-ons: Email Promotions $24.99/mo, Advanced Analytics $19.99/mo, Route Planner $29.99/mo, CSA Manager $24.99/mo, Accounting Sync $14.99/mo
- Payment processing markup: 0.6%
- Featured listings: $5-50/wk per vendor
- AOV planning assumption: $60 (conservative; founder vision is grocery-replacement upside)

# Founder Path (LOCKED — Path C)

- Jen has 5+ years of side-build commitment to this concept; commitment is established, not in question
- AI training in Austin (~April 27 - mid-July 2026) is the **funding mechanism** for Farm2Table, not an alternative
- Husband co-collaborates on operational work (Tampa-Sarasota vendor recon during training, contingent on remaining in area)
- Realistic founder draw curve: ~$0-30K Y1, $80-130K Y2, $200K+ Y3
- Founder transitions from W-2 to full-time on Farm2Table when platform revenue can support it (Y3 target)

# Capital + Runway

- **Year 1 capital required:** $10-37K (DIY-build scenario)
- **Funding source:** AI training W-2 income (Path C); existing savings as buffer; NO external investors, NO debt
- **Burn rate:** $1-3K/mo recurring opex Y1
- **Cash-flow positive:** ~Q2-Q3 of Y2

# Build Plan

- Founder-built using AI training skills
- Modern web stack (Next.js or similar) + Stripe Connect
- NO contractor, NO marketplace platform-as-a-service like Sharetribe
- **MVP timeline:** July - September 2026 part-time (aggressive; risk of slip to early 2027)
- **Hardest features to build:**
  1. Multi-vendor cart UX with per-vendor fulfillment selection at checkout
  2. Tiered vendor onboarding with document verification
  3. Substitute matching engine (requires product taxonomy)
  4. Stripe Connect marketplace integration

# Realistic Timeline (LOCKED)

| Phase | Date | Milestone |
|---|---|---|
| AI training | April 27 - mid-July 2026 | Husband does Tampa-Sarasota vendor recon |
| MVP build sprint | July - September 2026 | Multi-vendor cart, Stripe Connect, vendor onboarding |
| First vendor onboarded | Late September 2026 | (~21 weeks from PRFAQ) |
| Gainesville pilot soft launch | October 2026 | First customer orders |
| Tampa Bay-Sarasota commercial launch | **Feb 13, 2027** | Public launch, press, customer marketing |
| Cash-flow positive | Q3-Q4 2027 | (~16-20 months from PRFAQ) |
| Hub #2 launch | Q1-Q2 2028 | (~24 months from PRFAQ) |
| Founder draw $200K reachable | 2028-2029 | (~3 years from PRFAQ) |

# Regulatory Framework (corrections from 4-LLM verification)

- **FL marketplace facilitator threshold:** $100K only (NO 200-tx alternative — this is a corrected error)
- **FL egg producers:** ALL need FDACS Limited Poultry/Egg Farm permit (no "50-hen" exemption — this is a corrected error)
- **PA program:** "Limited Food Establishment" (LFE), NOT "Local Food Establishment" — and not a recent 2025 expansion (longstanding)
- **Oberdorf v. Amazon panel decision was vacated on en banc rehearing** — cite carefully, not as clean controlling precedent
- **FL cottage food interstate shipping:** GENUINELY AMBIGUOUS — Source D + Grok say in-state only (conservative reading of FL Stat. § 500.80); Cursor + GPT cite UF/IFAS guidance suggesting interstate may be allowed. Defaults to conservative pending FDACS confirmation. Worth a direct query.
- **Cottage food INCLUDED on platform** with conservative shipping defaults
- **Per-state cottage food expansions confirmed:** TX SB 541 (Sept 1, 2025), GA HB 398 (July 1, 2025), TN HB 130 (July 1, 2025), ND SB 2386 (March 21, 2025)
- **NC has NO cottage food law** — uses Home Processor program with NCDA&CS inspection, no formal revenue cap
- **Vendor non-compliance liability:** marketplace has residual exposure; mitigated by strong vendor agreement (reps, warranties, indemnification, insurance requirement), documented verification, marketplace-facilitator framing in ToS, active enforcement on reports, liability insurance

# Required Operational Commitments (from FAQs)

- Vendor agreement with 5-provision liability transfer structure (~$2-5K legal budget; teeth-strong, not template)
- Tiered vendor application form (farm / cottage / commercial / micro-producer with branching document requirements)
- Cross-check capability against state ag + FDACS + business records
- Third-party certification verification + display (USDA Organic, AWA, CNG)
- Customer reporting + investigation channel (email-based at launch)
- FDACS reporting process for foodborne illness incidents
- Stripe Connect integration (table-stakes)
- Customer data export feature (basic CSV from account settings)
- Per-vendor independent fulfillment at the technical level
- Product taxonomy / category system (enables substitute matching)
- Substitute suggestion engine (when vendor cancels, surface alternatives in same category)
- Cancellation notification system (email/in-app, with substitute links)
- Per-vendor cancellation cutoffs displayed on listings
- Customer-vendor messaging channel ("can you hold this for me?")
- "Tell us where to launch next" interest form (snowbird signal)
- Vendor onboarding asks about shipping capabilities and methods per-product (including perishable shipping with cold-chain methods)
- Listings display shipping methods and special handling requirements
- No subscriptions / no auto-renewal (structural)
- Lead-time + fulfillment-schedule field on vendor profiles
- Account persistence (no auto-deletion of inactive accounts)
- 30-day shutdown notice policy (informal commitment)

# Required Pre-Launch Tasks

1. Reactivate Farm2Table Market, LLC (Florida); register Florida fictitious name (DBA) for "Farm2Table"
2. Trademark attorney knockout clearance opinion for "Farm2Table, The Online Farmer's Market" compound mark (~$300-700)
3. File compound mark application USPTO Class 35 ("Farm2Table, The Online Farmer's Market") via TEAS Plus (~$350-550 USPTO + optional attorney fees)
4. Commission distinctive logo design (~$500-1,500 freelance designer)
5. File design mark application for logo USPTO Class 35 (~$350-550 USPTO + attorney)
6. Decide primary domain strategy: farm2table.app (owned), farm2table.market (acquire), farm2table.co (acquire), or pursue farm2table.com from current owner
7. Vendor agreement drafting + food/marketplace attorney review (~$500 consultation = significant risk reduction)
8. FDACS direct query to resolve cottage food interstate shipping ambiguity
9. MVP scope finalization (multi-vendor cart UX, vendor onboarding flow priority)
10. AOV validation methodology for Gainesville pilot
11. Husband recon plan (4-6 hrs × 8-10 weekends Tampa-Sarasota markets during AI training)
12. Insurance carrier selection + coverage levels
13. Stripe Connect + Stripe Tax integration architecture decisions

# Top 3 Failure Modes (with early warning signals)

1. **Two-sided cold-start failure** (highest probability)
   - Signals: <15 vendors signed by end of August 2026; <25 vendors live by end of September 2026; <50 customer accounts by end of Q4 2026; vendor referral rate <30% by month 3; >20% marketplace-sourced orders by month 6 fails to materialize
   - Response: slow expansion, double down on vendor recruitment, consider geographic narrowing
2. **Customer experience failure from multi-pickup friction** (moderate prob, high severity)
   - Signals: customer reorder rate <25% within 30 days; average cart spans <2 vendors; logistics complaints concentrated in reviews; cart abandonment >40% with multi-pickup
   - Response: revisit shared community hub model (would reverse stated commitment) OR shift positioning toward single-farm focus
3. **Founder bandwidth collapse** (moderate prob, terminal severity)
   - Signals: MVP build slipping >4 weeks; husband recon hours dropping; founder time-on-project below baseline; external job time pressure increasing
   - Response: explicit timeline reset, scope reduction, evaluate pause vs press through

# Competitive Defense

- **Defensible:** auto-tier-friendly vendor economics (12% Pro vs Market Wagon 20-30%), no platform-owned logistics, multi-farm cart UX (different model from Market Wagon), deeper local relationships, 12-24 month timing advantage
- **Not defensible:** brand recognition, capital depth, marketing budget, technical sophistication
- **Real defense:** speed of execution + vendor lock-in + hyperlocal relationships before competitors evaluate Sarasota
- **Bigger threat than Market Wagon:** the next bootstrapped multi-farm-cart marketplace (post-proof copycats)

# Open Questions / Unknowns

- Actual AOV in Sarasota market (validate in Gainesville pilot)
- Multi-vendor cart adoption rate (does the wedge actually drive multi-farm shopping?)
- Customer reorder rate (does multi-pickup friction kill retention?)
- Vendor recruitment velocity (can husband + founder hit 25-50 vendors by end of Sept 2026?)
- Cottage food interstate shipping legality from FL (FDACS confirmation needed)
- Insurance carrier specifics + product liability program for vendors
- Y2 stretch-vs-conservative expansion decision criteria (needs explicit framework)
- Post-AI-training employment + Farm2Table time allocation (job offer terms TBD)

# Strategic Decision Points (timing-sensitive)

1. **Within 2 days (April 25-27, 2026):** Decide AI training (per Path C, take it as funding mechanism)
2. **Mid-July 2026 (post-training):** Decide post-training employment terms (full-time, part-time, remote? affects Farm2Table time allocation)
3. **End of Y2 (late 2027):** Decide conservative (2-3 metro) vs. aggressive (5 metro with hired metro leads) Y3 expansion based on Sarasota traction, founder bandwidth, capital reinvestment comfort
4. **Y3 (2028):** Decide whether to take external capital for faster scale vs. continue bootstrapped

# Long-Term Vision (Year 10+ / 2035-2036)

- 50-metro national footprint (one per state, with major-pop states having 2)
- ~$200-240M GMV at maturity
- ~$38-40M platform revenue
- ~30-100 employees
- Founder as CEO of a national company
- $150-400M equity value at typical marketplace multiples (assuming bootstrapped)
- Real exit potential: IPO, strategic acquisition (Whole Foods, Amazon Fresh, Walmart food, Sprouts, regional grocery), PE buyout
- 5+ year side-build commitment becomes 15-20 year founder commitment

# Distilled Realistic Outcome Distribution

- **Conservative success:** $2-3M GMV across 2 metros by 2028-2029, $200-300K founder draw, full-time on Farm2Table
- **Aggressive success:** $2.5-3.6M GMV across 5 metros by 2028-2029, $300-500K founder compensation, manager-of-metros role
- **Most likely:** $1M GMV in Sarasota-Bradenton by 2028, $80-150K founder draw on top of W-2, Hub #2 deferred — meaningful side business
- **Realistic failure:** Slow burn, never reaches commercial launch; $30K+ invested, 18-24 months effort, project shut down; lessons learned, AI training career intact as safety net
- **Long-term upside:** 50-metro national footprint with $150-400M equity value (10+ year horizon)

# Press Release Headline (LOCKED — for downstream PR/marketing reference)

> "Pastured eggs, sourdough, and honey from three Sarasota farms — one cart, one checkout, every producer named."

Subheadline:
> "For Sarasota families and seniors who want to know exactly who grew, raised, or made every item in their cart — without the warehouse middleman or another CSA mystery box."

# Rejected Framings (don't re-propose)

- **Single founder owns all metro recruitment** — rejected in favor of metro leads for aggressive expansion
- **Auto-tier vendor graduation** — rejected; vendors stay on chosen tier with notifications
- **In-person founder visits to every vendor for verification** — rejected; documentation-based verification only
- **Video walk-through requirement at vendor onboarding** — rejected; documentation only
- **Shared community pickup hub** — rejected; vendor-managed fulfillment exclusively
- **"First 500 customers free pickup" launch promotion** — rejected
- **Excluding cottage food entirely** — rejected; cottage food is core to vendor base and wedge
- **Pure SaaS positioning competing with Barn2Door** — rejected; loses on price
- **Owning logistics like Market Wagon** — rejected; capital-intensive failure mode
- **National Year-1 launch** — rejected; hyperlocal density required for wedge
- **Differential commission based on vendor-sourced vs marketplace-sourced** — deferred to Year 2+ (attribution complexity)
- **November 2026 launch** — corrected to Q1 2027 (Feb 13, 2027) per realistic timeline
- **"Founder fixes the multi-pickup friction"** — corrected; honest acknowledgment of multi-pickup as real trade-off
- **"50 hens" small-farm egg exemption in FL** — corrected; doesn't exist in FL law
- **Asheville as Hub #1** — rejected despite best data score; requires founder relocation
- **Brand-naming exercise to replace Farm2Table** — explored extensively (4-LLM naming exercise, Shepherd's Table consideration, Farm2Table Market variants), founder ultimately locked Farm2Table as brand. Trademark strategy is compound mark + design mark, not coined replacement. Naming research files preserved in `_bmad-output/research/naming/` if reconsideration ever needed.
- **"Shepherd's Table" as brand name** — explored; blocked by direct same-category competitor (Minneapolis Shepherds Table farm-to-fridge market, Sept 2025) + Silver Spring MD nonprofit + Wolf Lake MN restaurant.
- **Path B (distinctive consumer brand on top of LLC)** — considered; rejected in favor of leveraging Farm2Table existing assets (LLC, .app domain, 5+ year history).
