# Vendor Subscription Tiers

This document outlines the three-tier subscription system for Farm2Table vendors, including features, limits, and pricing.

## Tier Overview

| Tier           | Monthly Price       | Transaction Fee | GMV Range  | Payout Timing         |
| -------------- | ------------------- | --------------- | ---------- | --------------------- |
| **Foundation** | Free                | 22%             | $0 - $3K   | 7 days after delivery |
| **Growth**     | $59/mo ($590/yr)    | 18%             | $3K - $10K | 7 days after delivery |
| **Pro**        | $149/mo ($1,490/yr) | 12%             | $10K+      | 7 days after delivery |

> **Note:** Yearly billing saves approximately 15%.

---

## Resource Limits

| Tier           | Products  | Variants/Product | Team Members |
| -------------- | --------- | ---------------- | ------------ |
| **Foundation** | 5         | 2                | 5            |
| **Growth**     | 20        | 5                | Unlimited    |
| **Pro**        | Unlimited | Unlimited        | Unlimited    |

---

## Features by Tier

### Foundation (Free)

Core features for vendors just getting started:

- Unlimited products (limited to 5 active)
- Basic sales & view metrics
- Order management dashboard
- Customer messaging
- Basic farm profile page
- Email support (48-hour response)
- Basic food-safety checklists
- Can purchase add-ons individually

**Best for:** New vendors testing online sales or farms with under $3K monthly GMV.

---

### Growth ($59/month)

Everything in Foundation, plus:

- Lower transaction fee (18% vs 22%)
- Advanced sales analytics
- Customer segmentation & CRM
- Full inventory management with alerts
- Batch order updates
- Email & chat support (24-hour response)
- Can purchase all add-ons
- **14-day free trial available**

**Best for:** Established farms with $3K-$10K monthly GMV ready to grow.

**Savings Example:** Save ~$200/month on $5K GMV (4% fee difference).

---

### Pro ($149/month)

Everything in Growth, plus:

- Lowest transaction fee (12%)
- **All add-ons included FREE** (~$115/month value)
- Advanced analytics & forecasting
- Customer lifetime value tracking
- Multi-location support
- API access for integrations
- Dedicated support representative
- Quarterly business reviews
- **14-day free trial available**

**Best for:** High-volume farms with $10K+ monthly GMV.

**Savings Example:** Save ~$720/month on $12K GMV (6% fee difference vs Growth).

---

## Available Add-Ons

Add-ons are premium features that can be purchased individually by Foundation/Growth tier vendors, or are included free with Pro tier.

| Add-On                 | Monthly Price | Description                                              | Status      |
| ---------------------- | ------------- | -------------------------------------------------------- | ----------- |
| **Email Promotions**   | $24.99        | Targeted campaigns, segmentation, automation             | Available   |
| **Advanced Analytics** | $19.99        | LTV tracking, cohort analysis, forecasting               | Available   |
| **Route Planner**      | $29.99        | Delivery optimization, multi-stop routing                | Coming Soon |
| **CSA Manager**        | $24.99        | Recurring subscriptions, box curation, automated billing | Available   |
| **Accounting Sync**    | $14.99        | QuickBooks/Xero integration, transaction export          | Coming Soon |

### Add-On Features Breakdown

Each add-on unlocks specific features:

- **Email Promotions:** Email campaigns, segmentation, automation, advanced promo codes
- **Advanced Analytics:** LTV tracking, cohort analysis, forecasting, advanced dashboards
- **Route Planner:** Delivery optimization, multi-stop routing, customer clustering
- **CSA Manager:** Recurring subscriptions, box curation, automated billing
- **Accounting Sync:** QuickBooks integration, Xero integration, transaction export

> **Trial:** Each add-on offers a **7-day free trial** (once per vendor).

---

## GMV Thresholds

GMV (Gross Merchandise Value) is calculated based on trailing 30-day sales:

| Threshold  | Amount (cents) | Amount (dollars) |
| ---------- | -------------- | ---------------- |
| Foundation | 0 - 300,000    | $0 - $3,000      |
| Growth     | 300,000 - 1M   | $3,000 - $10,000 |
| Pro        | 1,000,000+     | $10,000+         |

Tiers adjust monthly with 7-day advance notification.

---

## Cost Examples

| Scenario             | Subscription | Transaction Fees | Total Monthly Cost |
| -------------------- | ------------ | ---------------- | ------------------ |
| Foundation @ $3K GMV | $0           | $660 (22%)       | $660               |
| Growth @ $5K GMV     | $59          | $900 (18%)       | $959               |
| Pro @ $12K GMV       | $149         | $1,440 (12%)     | $1,589             |

---

## Source Files

- Tier limits: `types/subscriptions.ts` → `TIER_LIMITS`
- Membership plans: `data/membership.ts` → `MembershipPlans`
- Add-on metadata: `lib/addOns.ts` → `ADD_ON_METADATA`
- Tier config (database): `convex/seed/tierConfig.ts`
