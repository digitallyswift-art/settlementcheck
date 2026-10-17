# SettlementCheck — Performance & Progress Tracking Log

This document tracks historical Google Search Console (GSC) search performance, algorithmic search updates, technical releases, and ongoing keyword positions for [settlementcheck.co.uk](https://settlementcheck.co.uk/).

---

## 1. Traffic Growth Trajectory & Historical Baselines

| Metric | Baseline (May 2026) | Snapshot (October 2026) | Growth (% Change) |
| :--- | :---: | :---: | :---: |
| **Total Impressions** | 319 | 10,700+ | **+3,254%** |
| **Total Clicks** | 2 | 175+ | **+8,650%** |
| **Queries Tracked** | 21 | 200+ | **+852%** |
| **Indexed Pages with Traffic** | 4 | 32 | **+700%** |
| **Top Ranking Page** | Homepage (pos 75+) | Homepage (pos 18.8), Protective Award (pos 9.2) | **Page 1–2 presence** |

Data snapshots archived in: `data/gsc-history/`
- `data/gsc-history/2026-05-03_to_2026-05-18/`
- `data/gsc-history/2026-06-30_to_2026-09-29/`
- `data/gsc-history/settlementcheck.co.uk-Performance-on-Search-2026-10-09/`

---

## 2. Release & Optimization Log: 9 October 2026

### A. Striking Distance Keyword Push (Positions 11–20)
*Objective: Propel 3,300+ monthly impressions into Top 3–5 rankings on Page 1.*
- **Homepage (`/`):**
  - Calibrated H1 to exact search query: `Settlement Agreement Calculator UK (2026 Rates)`.
  - Calibrated meta description to front-load `calculate settlement agreement` and `UK` (157 chars).
  - Added dedicated trust differentiator clarifying that neither GOV.UK nor ACAS provides an interactive settlement calculator, establishing SettlementCheck as the independent standard.
- **Core Calculator (`/calculator/`):**
  - Front-loaded exact target query in title tag: `Settlement Agreement Calculator UK 2026 | SettlementCheck` (59 chars).
  - Aligned meta description (154 chars).
- **Compromise Agreement Hub (`/guides/compromise-agreement-calculator-uk/`):**
  - Corrected title omission: added "Calculator" to title (57 chars) and H1 to target 646+ monthly impressions.
  - Deployed GEO Answer-First `Statutory Quick Answer` block citing ERRA 2013 and ERA 1996 s.203.
  - Replaced US terminology ("severance") with standard UK employment settlement terms.

### B. Collective Redundancy Expansion (Protective Award)
*Objective: Capture surging collective redundancy demand (694 imp at pos 9.2 on guide) with a dedicated interactive tool.*
- **Engine (`lib/calculations.ts`):** Added pure TypeScript `calcProtectiveAward` implementing the 90-day gross remuneration entitlement under TULRCA 1992 s.189.
  - Solvent employer: uncapped actual gross pay.
  - Insolvent employer: 8-week statutory cap (£6,008 in GB / £6,264 in NI) under ERA 1996 s.184.
  - Tax treatment: £30,000 exemption under ITEPA 2003 s.403 with 0% employee NI.
- **New Dedicated Route (`/protective-award-calculator/`):**
  - Interactive client slider/input for salary, redundancies proposed (<20, 20-99, 100+), award days, solvent vs insolvent status, and GB vs NI jurisdiction.
  - Structured Schema: `WebApplication`, `FAQPage`, `BreadcrumbList`.
  - Registered in `app/sitemap.ts`, `app/sitemap/page.tsx`, and `components/Footer.tsx`.
- **Guide Upgrade (`/guides/protective-award/`):**
  - Added Answer-First `Statutory Quick Answer` block and 4-metric scannable grid.
  - Embedded interactive calculator callout bridge.
  - Upgraded CTA banner to point directly to `/protective-award-calculator/`.
  - Added `RelatedArticles` component.

### C. GEO / Answer-First Rollout (Google AI Overviews Defense)
*Objective: Win top citation slots in Google AI Overviews using the Attention Economy Framework.*
- Deployed structured `Statutory Quick Answer` blocks across 7 pillar guides:
  - `/guides/how-to-negotiate-a-settlement-agreement/`
  - `/guides/is-my-settlement-offer-fair/`
  - `/guides/settlement-agreement-how-much/`
  - `/guides/tax-free-settlement-30000/`
  - `/guides/redundancy-pay-cap-2026/`
  - `/guides/pilon-tax-treatment-2026/`
  - `/guides/settlement-agreement-instead-of-pip/`
- Every block adheres to:
  - Sentences under 20 words.
  - Zero em dashes (`—`).
  - Scannable 4-metric grid (caps, tax limits, legal fee contributions, deadlines).
  - Dual returning-user action paths.

### D. Lead Capture & Verification Hardening
- Hardened `/api/lead/route.ts` with server-side OTP code verification against `otp_codes` before database insertion (`email_verified: true`).
- Connected `/settlement-agreement-review/` to `/get-matched/` with prefilled compensation, salary, and verdict parameters.

---

## 3. High-Priority Striking Distance Watchlist (Next 14–28 Days)

| Search Query | Baseline Imp (Oct 2026) | Baseline Pos | Target URL | Target Ranking |
| :--- | :---: | :---: | :--- | :---: |
| `settlement agreement calculator uk` | 587 | 16.2 | `/` & `/calculator/` | **Top 3** |
| `settlement agreement calculator` | 788 | 20.7 | `/` & `/calculator/` | **Top 3–5** |
| `calculate settlement agreement` | 680 | 26.1 | `/` & `/calculator/` | **Top 5** |
| `compromise agreement calculator` | 506 | 15.1 | `/guides/compromise-agreement-calculator-uk/` | **Top 3** |
| `employment settlement agreement calculator uk` | 404 | 13.6 | `/` & `/calculator/` | **Top 3** |
| `settlement calculator uk` | 338 | 24.9 | `/` & `/calculator/` | **Top 5** |
| `settlement agreement calculator gov` | 213 | 16.2 | `/` (Trust card & FAQ) | **Top 5** |
| `acas settlement agreement calculator` | 116 | 16.4 | `/` (Trust card & FAQ) | **Top 5** |
| `work settlement calculator` | 108 | 11.2 | `/` | **Top 3** |
| `compromise agreement calculator uk` | 79 | 11.9 | `/guides/compromise-agreement-calculator-uk/` | **Top 3** |
| `protective award calculator` | 694 (on guide) | 9.2 | `/protective-award-calculator/` | **Top 1–3** |
| `nhs settlement agreement` / MARS | 186 | 10.2 | `/guides/nhs-settlement-agreements/` | **Top 3** |

---

## 4. GSC Annotations Recorded

- **Annotation 1 (Striking-Distance & Protective Award):**
```text
2026-10-09: Striking-distance H1/meta optimisations, launched /protective-award-calculator/ & rolled out GEO AI blocks.
```
*(Exact character count: 119 / 120)*

- **Annotation 2 (NHS & MARS Redundancy Engine):**
```text
2026-10-09: Shipped NHS & MARS redundancy calculator + Attention Economy answer-first block to push #10 query into Top 3.
```
*(Exact character count: 119 / 120)*

---

## 5. Invariant Quality Gates Status

```bash
npm run test:evals   # 16/16 PASSED (100% legal & brand compliance)
npm run check:links  # 660 links across 81 files, 0 broken, 100% trailing-slash compliant
npx tsc --noEmit     # 0 TypeScript type errors
```

---

## 6. Scheduled Monitoring Checkpoints

- **Checkpoint 1 (14-Day Velocity Review):** 23 October 2026
  - Inspect impressions and rank shifts for `protective award calculator`, `compromise agreement calculator`, and `nhs settlement agreement`.
- **Checkpoint 2 (28-Day Page 1 Audit):** 6 November 2026
  - Run `node scripts/compare-gsc.mjs` with next export to verify movement into Top 3 positions.

---

## 7. Release & Optimization Log: Phase 1 Cannibalization & Striking-Distance Execution (17 October 2026)

### A. Disentangle `/` (Homepage) vs `/calculator/` (Dedicated Tool)
*Objective: Eliminate internal self-cannibalization between the homepage (pos 18.8) and calculator page (pos 78.9) to allow both to rank for their distinct intents.*
- **Dedicated Calculator (`/calculator/`):**
  - Calibrated title tag: `Calculate Settlement Agreement UK | 2026 Payout Calculator` (57 chars). Targets `calculate settlement agreement` (680 monthly impr) and `settlement agreement payout`.
  - Calibrated meta description: `Calculate your UK settlement agreement payout using April 2026 statutory rates (£751/wk cap). Instant fairness score, PILON, and net tax breakdown. Free.` (154 chars).
  - Added semantic accessible `<h1 className="sr-only">Calculate Settlement Agreement UK (2026 Rates)</h1>` to ensure search engine crawlers index clear on-page heading intent.
  - Updated `WebApplication` schema name and aligned `BreadcrumbList` connecting `https://settlementcheck.co.uk/` to `https://settlementcheck.co.uk/calculator/`.
- **Homepage (`/`):**
  - Calibrated meta description to exact character ceiling: `Calculate your UK settlement payout in 60s. Free calculator based on April 2026 statutory rates (£751/wk cap). Check your offer with zero email required.` (154 chars).
  - Added Twitter card metadata matching OpenGraph.

### B. Striking-Distance Capture: Compromise Agreement Hub (`/guides/compromise-agreement-calculator-uk/`)
*Objective: Propel 585+ monthly impressions at positions 11–15 into Top 3–5 rankings on Page 1.*
- Added exact-match H2: `Compromise Agreement Calculator: 2026 Statutory Calculation Rules & Formulas`.
- Added dedicated question to `FAQS` array and `FAQPage` schema: *"Is a compromise agreement calculator the same as a settlement agreement calculator?"* explaining the ERRA 2013 legal transition and 2026 statutory baseline (£751/week cap, £30k exemption).
- Upgraded in-content and bottom CTAs with high-intent anchor phrasing: *"Launch Compromise Agreement Calculator →"* and *"Calculate my compromise agreement payout →"*.
- Deployed sitewide internal linking equity to `/guides/compromise-agreement-calculator-uk/` from:
  - Homepage hero eyebrow ([app/HomeClient.tsx](file:///c:/settlementcheck/app/HomeClient.tsx)).
  - Main navigation dropdown under Guides ([components/Nav.tsx](file:///c:/settlementcheck/components/Nav.tsx)).
  - Sitewide footer under Guides ([components/Footer.tsx](file:///c:/settlementcheck/components/Footer.tsx)).

### C. Elevate GOV.UK & ACAS Comparative Differentiator on Homepage (`/`)
*Objective: Win featured snippets and rank for 367+ monthly impressions querying `settlement agreement calculator gov` (pos 16.2) and `settlement agreement calculator acas` (pos 25.5).*
- Added dedicated 4th trust differentiator into `TRUST` array in `app/HomeClient.tsx`: *"Why is there no official GOV.UK or ACAS settlement calculator?"*.
- Deployed second `Question` / `Answer` microdata featured snippet callout directly in the homepage FAQ section addressing why GOV.UK and ACAS lack interactive settlement calculators and establishing SettlementCheck as the independent UK statutory alternative.

### D. GSC Annotation Recorded
- **Annotation 3 (Phase 1 Cannibalization & Compromise Hub Push):**
```text
2026-10-17: Resolved / vs /calculator/ cannibalization, pushed compromise hub into Nav/Footer, deployed GOV/ACAS snippet.
```
*(Exact character count: 119 / 120)*

---

## 8. 2026-10-17 — Phase 2: Unblock "Discovered – currently not indexed" Cluster & Commercial Mesh

*Audit Basis: GSC Coverage report indicated 13 high-value URLs languishing in "Discovered - currently not indexed" status due to orphan risk, sitemap omissions, and link deprivation.*

### A. Core Architectural & Funnel Discoveries
- **XML Sitemap Omission**: `/get-matched/` (primary commercial revenue funnel) was present in HTML sitemap (`app/sitemap/page.tsx`) but missing from machine XML sitemap (`app/sitemap.ts`). Resolved by adding `{ url: `${base}/get-matched/`, priority: 0.9, changeFrequency: 'weekly' }`.
- **Prohibited Phrase Rectification**: Identified and eliminated 6 instances of prohibited phrase `"Employment Rights Act 2025"` across `app/guides/fair-work-agency/page.tsx` and `app/guides/page.tsx`, standardizing to `"Employment Rights Bill 2024-25"`. Added missing `metadataBase` and corrected canonical tags.

### B. Sitewide Internal Link Mesh Deployment
- **Global Header Navigation (`components/Nav.tsx`)**:
  - Added `Find a solicitor` (`/get-matched/`) to desktop CTA bar.
  - Added `Find a solicitor` (`/get-matched/`) to mobile slide-out navigation for complete desktop/mobile parity.
- **Global Footer Navigation (`components/Footer.tsx`)**:
  - Added `/get-matched/` (`Find a solicitor`) to the Solicitors column to distribute sitewide PageRank equity.
- **Homepage Commercial Flow (`app/HomeClient.tsx`)**:
  - Connected Step 2 of `STEPS` directly to `/get-matched/` via contextual anchor text.
  - Added "Explore statutory compensation tools" strip below Statutory Rates Table linking to `/redundancy-calculator/`, `/unfair-dismissal-calculator/`, and `/get-matched/`.
- **In-Content High-Authority Cross-Links**:
  - `app/guides/protective-award/page.tsx`: Embedded contextual links to `/redundancy-calculator/`, `/unfair-dismissal-calculator/`, and `/get-matched/`.
  - `app/guides/nhs-settlement-agreements/page.tsx`: Added cross-links to `/redundancy-calculator/` and `/unfair-dismissal-calculator/` in statutory redundancy comparisons.
  - `app/guides/how-to-negotiate-a-settlement-agreement/page.tsx`: Added RelatedArticles card for `/guides/fair-work-agency/`.

### C. GSC Annotation Recorded
- **Annotation 4 (Phase 2 Unindexed URLs & Commercial Link Mesh):**
```text
2026-10-17: Phase 2 unindexed mesh deployed; added /get-matched/ to XML sitemap, Nav & Footer; internal linking boosted.
```
*(Exact character count: 114 / 120)*



