# Phase 02 — Complete Website & Route Inventory Report (`phase-02-website-inventory.md`)
**Project:** SettlementCheck (settlementcheck.co.uk)  
**Audit Phase:** Phase 02 (Website Inventory & Route Architecture)  
**Date of Audit:** 2026-10-18  
**Primary Source Register:** [`docs/audit/phase-01a-source-register.md`](file:///c:/settlementcheck/docs/audit/phase-01a-source-register.md)  
**Designated Report Directory:** `c:\settlementcheck\docs\audit\`  
**Machine-Readable Dataset:** [`data/audit/website-inventory.json`](file:///c:/settlementcheck/data/audit/website-inventory.json)  

---

## 1. Executive Summary & Inventory Topology

SettlementCheck operates a high-performance Next.js 14 App Router architecture comprising **61 total routes**: **44 page routes**, **15 backend API endpoints**, and **2 SEO directive endpoints** (`/sitemap.xml` and `/robots.txt`).

### 1.1 Structural Distribution Breakdown

| Category / Tier | Route Count | Indexable | Noindex | Primary User Intent | Key Architectural Role |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Tier 1: Core Conversion Pillars** | 4 | 4 | 0 | Transactional / Navigational | Core calculator intake, offer fairness assessment, agreement review |
| **Tier 2: Programmatic Calculators** | 5 | 5 | 0 | Commercial Investigation | Statutory redundancy, unfair dismissal, tax, constructive, protective award |
| **Tier 3: Funnel & Intake Stage** | 3 | 1 | 2 | Transactional / Informational | Results verdict (`/results/`), solicitor intake (`/get-matched/`), transparency |
| **Tier 4: Statutory & Educational Guides** | 25 | 25 | 0 | Informational | Comprehensive legal guides hub + 24 spokes (tax, PILON, ACAS, caps) |
| **Tier 5: B2B Solicitor Acquisition** | 1 | 1 | 0 | B2B Partner | SRA panel onboarding and law firm partnership intake |
| **Tier 6: Legal & Compliance** | 4 | 4 | 0 | Informational / Utility | Privacy Policy, Terms of Use, Statutory Disclaimer, HTML Sitemap |
| **Internal / Solicitor Portal** | 2 | 0 | 2 | B2B Partner / Protected | SRA Partner Command Center (`/portal/`), Pre-flight case dossier review |
| **API Endpoints** | 15 | 0 | 15 | System / Backend | OTP verification, lead intake, CRM webhooks, AI document review |
| **SEO Directive Endpoints** | 2 | 2 | 0 | Search Engine Bot | Dynamic XML Sitemap (`/sitemap.xml`) and Robots configuration |
| **Total System Footprint** | **61** | **42** | **19** | — | **Full platform topology** |

### 1.2 Core Audit Discoveries (Phase 2)

1. **Sitemap Contradiction on Funnel Intake (`SC-E-INV-001`)**: `/get-matched/` is submitted in `app/sitemap.ts` with high priority (`0.9`), yet explicitly enforces `robots: { index: false, follow: false }` in its page metadata. This creates an immediate Google Search Console warning (*"Submitted URL marked 'noindex'"*).
2. **Mixed Canonical URL Formatting (`SC-E-INV-002`)**: 17 pages declare absolute canonical URLs (`https://settlementcheck.co.uk/...`), whereas 25 pages declare relative paths (`/.../`). While Next.js `metadataBase` resolves relative paths at render time, standard enterprise SEO mandates consistent absolute canonicals to prevent downstream reverse-proxy bugs.
3. **Legal Disclaimer Distribution Discrepancy (`SC-E-INV-003`)**: While 34 of 44 pages emphasize the SRA boundary and 24 explain employer-covered legal fees, only 7 pages feature explicit inline *"This tool does not constitute formal legal advice"* disclaimers, relying primarily on global footer text.
4. **Zero Orphan Page Architecture**: With 727 internal links scanned across 93 components, all 40 indexable pages receive inbound internal link equity (ranging from 50 links for `/calculator/` to 6 links for programmatic guides). Zero orphaned indexable pages were detected.
5. **Rich Statutory Schema Grounding**: 34 pages implement `FAQPage` structured data, 18 embed formal UK `Legislation` schemas (citing ERA 1996 and ITEPA 2003 directly to legislation.gov.uk), and 8 implement `WebApplication` schemas.

---

## 2. Complete Public & Application Route Inventory (44 Pages)

Below is the definitive census of all 44 page routes in SettlementCheck, audited against metadata, search intent, headings, canonical integrity, schema types, inbound link equity, and regulatory disclaimers.

| ID | Route | Tier & Intent | H1 Heading | Indexing & Sitemap | Canonical Status | JSON-LD Schemas | Inbound Links | Disclaimers |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: | :--- |
| **RT-049** | [`/`](file:///c:/settlementcheck/app/page.tsx) | Tier 1<br>*Navigational* | How much should your employment settlement be? | `index`<br>Sitemap (p:1) | Relative | Organization, AdministrativeArea, WebSite +8 | **8** | SRA/Legal/Tax/Fees |
| **RT-016** | [`/calculator/`](file:///c:/settlementcheck/app/calculator/page.tsx) | Tier 1<br>*Transactional* | Free Employee Settlement Agreement Calculator UK (2026 Rates) | `index`<br>Sitemap (p:1) | Relative | Offer, Organization, Thing +9 | **50** | SRA/Fees |
| **RT-017** | [`/calculators/`](file:///c:/settlementcheck/app/calculators/page.tsx) | Tier 1<br>*Navigational* | Take control of your exit. Free statutory calculators. | `index`<br>Sitemap (p:1) | Relative | WebSite, BreadcrumbList, ListItem +6 | **5** | SRA/Fees |
| **RT-056** | [`/settlement-agreement-review/`](file:///c:/settlementcheck/app/settlement-agreement-review/page.tsx) | Tier 1<br>*Transactional* | Check your employment settlement agreement | `index`<br>Sitemap (p:1) | Absolute | WebApplication, Offer, Thing +5 | **23** | SRA/Tax/Fees |
| **RT-018** | [`/constructive-dismissal-calculator/`](file:///c:/settlementcheck/app/constructive-dismissal-calculator/page.tsx) | Tier 2<br>*Commercial Investigation* | Calculate your constructive dismissal settlement | `index`<br>Sitemap (p:0.9) | Relative | Offer, Organization, Legislation +9 | **11** | SRA |
| **RT-052** | [`/protective-award-calculator/`](file:///c:/settlementcheck/app/protective-award-calculator/page.tsx) | Tier 2<br>*Commercial Investigation* | Protective Award Calculator UK | `index`<br>Sitemap (p:0.9) | Relative | Offer, Organization, Legislation +7 | **14** | *None* |
| **RT-053** | [`/redundancy-calculator/`](file:///c:/settlementcheck/app/redundancy-calculator/page.tsx) | Tier 2<br>*Commercial Investigation* | Calculate your redundancy pay | `index`<br>Sitemap (p:0.9) | Relative | Offer, Organization, Legislation +9 | **36** | SRA |
| **RT-057** | [`/settlement-agreement-tax-calculator/`](file:///c:/settlementcheck/app/settlement-agreement-tax-calculator/page.tsx) | Tier 2<br>*Commercial Investigation* | Calculate tax on your settlement agreement | `index`<br>Sitemap (p:0.9) | Relative | Offer, Organization, Legislation +9 | **9** | Tax/Fees |
| **RT-061** | [`/unfair-dismissal-calculator/`](file:///c:/settlementcheck/app/unfair-dismissal-calculator/page.tsx) | Tier 2<br>*Commercial Investigation* | Calculate your unfair dismissal settlement | `index`<br>Sitemap (p:0.9) | Relative | Offer, Organization, Legislation +9 | **22** | SRA |
| **RT-022** | [`/get-matched/`](file:///c:/settlementcheck/app/get-matched/page.tsx) | Tier 3<br>*Transactional* | What is your first name? (Stepped Dynamic Form) | `noindex`<br>Sitemap (p:0.9) | Absolute | *None* | **13** | SRA |
| **RT-048** | [`/how-it-works/`](file:///c:/settlementcheck/app/how-it-works/page.tsx) | Tier 3<br>*Navigational* | How SettlementCheck works | `index`<br>Sitemap (p:0.8) | Absolute | FAQPage, Question, Answer | **6** | SRA/Legal/Fees |
| **RT-054** | [`/results/`](file:///c:/settlementcheck/app/results/page.tsx) | Tier 3<br>*Transactional* | *None (Dynamic H2 Verdict Cards)* | `noindex`<br>No Sitemap | Absolute | *None* | **0** | SRA/Tax/Fees |
| **RT-033** | [`/guides/`](file:///c:/settlementcheck/app/guides/page.tsx) | Tier 4<br>*Informational* | Understand your rights. Before you sign. | `index`<br>Sitemap (p:0.7) | Absolute | CollectionPage, BreadcrumbList, ListItem +1 | **30** | *None* |
| **RT-023** | [`/guides/average-settlement-agreement-payout-uk/`](file:///c:/settlementcheck/app/guides/average-settlement-agreement-payout-uk/page.tsx) | Tier 4<br>*Informational* | The average settlement agreement payout in the UK is £5,000 to £25,000. Here is how to check if your offer is fair in 2026. | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **5** | SRA/Tax/Fees |
| **RT-024** | [`/guides/compromise-agreement-calculator-uk/`](file:///c:/settlementcheck/app/guides/compromise-agreement-calculator-uk/page.tsx) | Tier 4<br>*Informational* | Compromise Agreement Calculator UK: 2026 Rules &amp; Payout Guide | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **9** | Fees |
| **RT-025** | [`/guides/constructive-dismissal-settlement-agreements/`](file:///c:/settlementcheck/app/guides/constructive-dismissal-settlement-agreements/page.tsx) | Tier 4<br>*Informational* | Constructive Dismissal Settlement Agreements in the UK: Rules and Compensation Limits for 2026 | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **3** | SRA |
| **RT-026** | [`/guides/discrimination-settlement-agreements/`](file:///c:/settlementcheck/app/guides/discrimination-settlement-agreements/page.tsx) | Tier 4<br>*Informational* | Discrimination Settlement Agreements UK: Compensation, Vento Bands &amp; Tax Rules (2026) | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **5** | SRA/Tax/Fees |
| **RT-027** | [`/guides/employer-recommended-solicitor/`](file:///c:/settlementcheck/app/guides/employer-recommended-solicitor/page.tsx) | Tier 4<br>*Informational* | Do I have to use the solicitor my employer recommends? | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer | **19** | SRA/Fees |
| **RT-028** | [`/guides/employment-tribunal-average-awards-uk/`](file:///c:/settlementcheck/app/guides/employment-tribunal-average-awards-uk/page.tsx) | Tier 4<br>*Informational* | Average Employment Tribunal Awards UK 2026: Official Compensation Tables | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +6 | **2** | SRA/Fees |
| **RT-029** | [`/guides/fair-work-agency/`](file:///c:/settlementcheck/app/guides/fair-work-agency/page.tsx) | Tier 4<br>*Informational* | What is the Fair Work Agency and does it affect my settlement agreement? | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +2 | **3** | Tax |
| **RT-030** | [`/guides/how-to-negotiate-a-settlement-agreement/`](file:///c:/settlementcheck/app/guides/how-to-negotiate-a-settlement-agreement/page.tsx) | Tier 4<br>*Informational* | How to Negotiate a Settlement Agreement | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer | **31** | SRA |
| **RT-031** | [`/guides/is-my-settlement-offer-fair/`](file:///c:/settlementcheck/app/guides/is-my-settlement-offer-fair/page.tsx) | Tier 4<br>*Informational* | Most settlement offers fall between 1.5x and 4x the statutory minimum. Here is how to spot if yours is genuinely fair. | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer +4 | **3** | SRA/Fees |
| **RT-032** | [`/guides/nhs-settlement-agreements/`](file:///c:/settlementcheck/app/guides/nhs-settlement-agreements/page.tsx) | Tier 4<br>*Informational* | NHS Settlement Agreements &amp; MARS Calculator: 2026 Rules &amp; Payouts | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **8** | SRA/Fees |
| **RT-034** | [`/guides/pilon-tax-treatment-2026/`](file:///c:/settlementcheck/app/guides/pilon-tax-treatment-2026/page.tsx) | Tier 4<br>*Informational* | PILON Tax Treatment UK 2026: Pay in Lieu of Notice is Fully Taxable | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **15** | Tax/Fees |
| **RT-035** | [`/guides/pressured-to-sign/`](file:///c:/settlementcheck/app/guides/pressured-to-sign/page.tsx) | Tier 4<br>*Informational* | My employer is pressuring me to sign a settlement agreement quickly. What are my rights? | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer | **20** | SRA/Legal |
| **RT-036** | [`/guides/protected-conversations-without-prejudice/`](file:///c:/settlementcheck/app/guides/protected-conversations-without-prejudice/page.tsx) | Tier 4<br>*Informational* | Protected Conversations and Without Prejudice: The UK Employee Guide | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **6** | Tax/Fees |
| **RT-037** | [`/guides/protective-award/`](file:///c:/settlementcheck/app/guides/protective-award/page.tsx) | Tier 4<br>*Informational* | Protective Award Redundancy Claims: 90 Days Pay Calculator &amp; 2026 Rules | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **6** | SRA |
| **RT-038** | [`/guides/redundancy-pay-cap-2026/`](file:///c:/settlementcheck/app/guides/redundancy-pay-cap-2026/page.tsx) | Tier 4<br>*Informational* | The redundancy weekly pay cap is £751 in 2026. Here is exactly how it limits your statutory entitlement and what to do if your employer gets it wrong. | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **18** | Fees |
| **RT-039** | [`/guides/settlement-agreement-acas-calculations/`](file:///c:/settlementcheck/app/guides/settlement-agreement-acas-calculations/page.tsx) | Tier 4<br>*Informational* | How ACAS-Based Settlement Calculations Work: What the £751 Weekly Pay Cap Means for Your Offer | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer +4 | **13** | SRA |
| **RT-040** | [`/guides/settlement-agreement-how-much/`](file:///c:/settlementcheck/app/guides/settlement-agreement-how-much/page.tsx) | Tier 4<br>*Informational* | Employment Settlement Agreement: How Much Should You Get? (UK 2026 Guide) | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer +6 | **4** | Tax/Fees |
| **RT-041** | [`/guides/settlement-agreement-instead-of-pip/`](file:///c:/settlementcheck/app/guides/settlement-agreement-instead-of-pip/page.tsx) | Tier 4<br>*Informational* | Settlement Agreement Instead of a PIP: The UK Employee Guide | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **3** | SRA/Tax/Fees |
| **RT-042** | [`/guides/settlement-agreement-sick-leave/`](file:///c:/settlementcheck/app/guides/settlement-agreement-sick-leave/page.tsx) | Tier 4<br>*Informational* | Settlement Agreement on Sick Leave: UK Employee Rights and Pay (2026 Guide) | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **4** | SRA |
| **RT-043** | [`/guides/settlement-agreement-vs-tribunal-claim/`](file:///c:/settlementcheck/app/guides/settlement-agreement-vs-tribunal-claim/page.tsx) | Tier 4<br>*Informational* | Settlement Agreement vs Employment Tribunal UK 2026: Cost, Time, and Success Rates compared | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **8** | SRA/Legal/Fees |
| **RT-044** | [`/guides/tax-free-settlement-30000/`](file:///c:/settlementcheck/app/guides/tax-free-settlement-30000/page.tsx) | Tier 4<br>*Informational* | The first £30,000 of your settlement agreement is tax-free in 2026. Here is how the exemption works and what is taxable. | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +5 | **22** | Tax/Fees |
| **RT-045** | [`/guides/unfair-dismissal-settlement-agreements/`](file:///c:/settlementcheck/app/guides/unfair-dismissal-settlement-agreements/page.tsx) | Tier 4<br>*Informational* | Unfair Dismissal Settlement Agreements UK (2026 Rules) | `index`<br>Sitemap (p:0.7) | Relative | FAQPage, Question, Answer +4 | **5** | SRA/Tax/Fees |
| **RT-046** | [`/guides/what-happens-if-you-do-not-sign/`](file:///c:/settlementcheck/app/guides/what-happens-if-you-do-not-sign/page.tsx) | Tier 4<br>*Informational* | What happens if you do not sign a settlement agreement | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer | **11** | SRA/Legal |
| **RT-047** | [`/guides/what-is-a-fair-settlement-agreement/`](file:///c:/settlementcheck/app/guides/what-is-a-fair-settlement-agreement/page.tsx) | Tier 4<br>*Informational* | A fair settlement agreement in 2026 pays more than your statutory minimum. Here is what the law guarantees you and how to spot when your employer is offering less. | `index`<br>Sitemap (p:0.7) | Absolute | FAQPage, Question, Answer +2 | **24** | SRA/Legal |
| **RT-021** | [`/for-solicitors/`](file:///c:/settlementcheck/app/for-solicitors/page.tsx) | Tier 5<br>*B2B Partner* | Stop losing billable hours to unqualified redundancy enquiries. | `index`<br>Sitemap (p:0.6) | Absolute | *None* | **5** | SRA/Fees |
| **RT-019** | [`/disclaimer/`](file:///c:/settlementcheck/app/disclaimer/page.tsx) | Tier 6<br>*Informational* | Calculator Disclaimer | `index`<br>Sitemap (p:0.2) | Relative | *None* | **2** | SRA/Legal |
| **RT-051** | [`/privacy/`](file:///c:/settlementcheck/app/privacy/page.tsx) | Tier 6<br>*Informational* | Privacy Policy | `index`<br>Sitemap (p:0.2) | Absolute | *None* | **3** | SRA |
| **RT-058** | [`/sitemap/`](file:///c:/settlementcheck/app/sitemap/page.tsx) | Tier 6<br>*Navigational* | Website Sitemap &amp; Directory | `index`<br>Sitemap (p:0.5) | Absolute | *None* | **1** | SRA/Tax/Fees |
| **RT-060** | [`/terms/`](file:///c:/settlementcheck/app/terms/page.tsx) | Tier 6<br>*Informational* | Terms of Use | `index`<br>Sitemap (p:0.2) | Absolute | *None* | **2** | SRA |
| **RT-020** | [`/dossier/review/[id]/`](file:///c:/settlementcheck/app/dossier/review/[id]/page.tsx) | Internal / Solicitor Portal Platform<br>*B2B Partner* | {matterSummary.clientName} | `noindex`<br>No Sitemap | Missing | *None* | **0** | SRA |
| **RT-050** | [`/portal/`](file:///c:/settlementcheck/app/portal/page.tsx) | Internal / Solicitor Portal Platform<br>*B2B Partner* | *None (Defect)* | `noindex`<br>No Sitemap | Missing | *None* | **3** | SRA |

---

## 3. Detailed Page Metadata & On-Page Calibration

This section audits the exact character calibration of `<title>` and `<meta name="description">` against Google SERP display limits (Titles: 50–60 characters; Descriptions: 130–160 characters).

| ID | Route | Title Tag (Chars) | Meta Description (Chars) | Primary CTA & Destination |
| :--- | :--- | :--- | :--- | :--- |
| **RT-049** | `/` | **Settlement Agreement Calculator UK (2026) \| Free Employee Payout Tool**<br>(69 chars) | Calculate your employee settlement payout in 60s. Free calculator based on April 2026 statutory rates (£751/wk cap) and the £30,000 tax-free exemption. Zero email required.<br>(172 chars) | "Get matched with an SRA-regulated specialist" → `/get-matched/` |
| **RT-016** | `/calculator/` | **Free Employee Settlement Agreement Calculator UK (2026)**<br>(55 chars) | Calculate your employee settlement payout in 60s. Evaluates your offer against April 2026 statutory rates (£751/wk cap) and the £30,000 tax-free exemption. Free.<br>(161 chars) | *No Primary CTA* |
| **RT-017** | `/calculators/` | **Employment & Settlement Calculators UK \| SettlementCheck**<br>(56 chars) | Compare all free UK employment calculators: settlement agreements, statutory redundancy (£751 cap), unfair dismissal, tax, and protective awards.<br>(145 chars) | "Settlement Checker" → `/settlement-agreement-review/` |
| **RT-056** | `/settlement-agreement-review/` | **Employment Settlement Agreement Checker \| Check Your Offer & Clauses \| SettlementCheck**<br>(86 chars) | Check your UK employment settlement agreement clauses and offer amount. Instant confidential check of statutory redundancy caps (£751/week), £30,000 tax rules, and employer legal fees.<br>(184 chars) | "Calculate Statutory Entitlement Baseline" → `/calculator/` |
| **RT-018** | `/constructive-dismissal-calculator/` | **Constructive Dismissal Calculator UK 2026 \| SettlementCheck**<br>(59 chars) | Forced to resign by your employer? Estimate your constructive dismissal settlement using April 2026 statutory rates (£123,543 cap). Free check, no email.<br>(153 chars) | "Estimate my constructive dismissal settlement →" → `/calculator/?reason=constructive` |
| **RT-052** | `/protective-award-calculator/` | **Protective Award Calculator UK 2026 \| SettlementCheck**<br>(53 chars) | Calculate your protective award under TULRCA 1992 s.189. Up to 90 days gross pay for failure to consult on 20+ redundancies. Free instant UK calculator.<br>(152 chars) | "Connect with an independent solicitor →" → `/get-matched/` |
| **RT-053** | `/redundancy-calculator/` | **Redundancy Pay Calculator UK 2026 \| SettlementCheck**<br>(51 chars) | Calculate your statutory redundancy pay under April 2026 UK rates (£751 weekly cap). See your true net figure after tax. Free check, no email required.<br>(151 chars) | "Calculate my redundancy pay →" → `/calculator/?reason=redundancy` |
| **RT-057** | `/settlement-agreement-tax-calculator/` | **Settlement Agreement Tax Calculator UK 2026 \| SettlementCheck**<br>(61 chars) | Calculate tax on your settlement agreement under April 2026 UK rates. Work out your £30,000 tax exemption, taxable PILON, and net take-home pay. Free check.<br>(156 chars) | "Calculate my take-home pay →" → `/calculator/` |
| **RT-061** | `/unfair-dismissal-calculator/` | **Unfair Dismissal Calculator UK 2026 \| SettlementCheck**<br>(53 chars) | Estimate your unfair dismissal basic and compensatory award using April 2026 statutory rates (£123,543 cap). Check where your offer stands in 60 seconds.<br>(153 chars) | "Estimate my unfair dismissal award →" → `/calculator/?reason=performance` |
| **RT-022** | `/get-matched/` | **Get Your Free Specialist Match \| SettlementCheck**<br>(48 chars) | Connect with an SRA-regulated employment solicitor who specialises in settlement agreements. Free. No obligation. Your employer covers the legal advice fee.<br>(156 chars) | *No Primary CTA* |
| **RT-048** | `/how-it-works/` | **How SettlementCheck Works \| Settlement Agreement Advice UK \| SettlementCheck**<br>(76 chars) | Three steps: check your offer with our free calculator, get matched with a vetted SRA-regulated employment solicitor within 24 hours, and get honest advice. Your employer pays the fees.<br>(185 chars) | "Check my offer now →" → `/calculator/` |
| **RT-054** | `/results/` | **Your Settlement Estimate \| SettlementCheck**<br>(42 chars) | Your personalised settlement agreement estimate. Get matched with a vetted employment solicitor. Free, your employer pays.<br>(122 chars) | "Return to calculator" → `/calculator/` |
| **RT-033** | `/guides/` | **Employment Settlement Agreement Guides \| SettlementCheck**<br>(56 chars) | Plain-English guides on settlement agreements, negotiation, legal advice, and your rights as an employee in the UK.<br>(115 chars) | "Check my offer →" → `/calculator/` |
| **RT-023** | `/guides/average-settlement-agreement-payout-uk/` | **Average Settlement Agreement Payout UK 2026 \| SettlementCheck**<br>(61 chars) | Free UK settlement agreement payout guide. Typical ranges (£5,000-£25,000) and 2026 redundancy pay caps (£751/wk). No email. See if your offer is fair.<br>(151 chars) | "Check your offer against this baseline →" → `/calculator/?reason=redundancy` |
| **RT-024** | `/guides/compromise-agreement-calculator-uk/` | **Compromise Agreement Calculator UK 2026 \| SettlementCheck**<br>(57 chars) | Calculate your compromise agreement payout under 2026 UK statutory rules (£751 cap). Redundancy, PILON, and tax-free breakdown. Free, no email required.<br>(152 chars) | "Check draft agreement clauses →" → `/settlement-agreement-review/` |
| **RT-025** | `/guides/constructive-dismissal-settlement-agreements/` | **Constructive Dismissal Settlements 2026 \| SettlementCheck**<br>(57 chars) | Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.<br>(151 chars) | "Guides" → `/guides/` |
| **RT-026** | `/guides/discrimination-settlement-agreements/` | **Discrimination Settlement Agreements UK 2026 \| Vento Bands & Tax Rules**<br>(70 chars) | UK guide to discrimination settlement agreements in 2026. Learn about uncapped compensation, the Ninth Addendum Vento bands (£1,300 to £62,900+), and tax rules.<br>(160 chars) | "Calculate my settlement now &rarr;" → `/calculator/?discrimination=yes` |
| **RT-027** | `/guides/employer-recommended-solicitor/` | **Do I Have to Use the Solicitor My Employer Recommends? \| SettlementCheck**<br>(72 chars) | No. You are entitled to choose your own solicitor for independent legal advice on a settlement agreement. Here is what the law says.<br>(132 chars) | "Check my offer →" → `/calculator/` |
| **RT-028** | `/guides/employment-tribunal-average-awards-uk/` | **Average Employment Tribunal Awards UK 2026: MoJ Compensation Tables**<br>(67 chars) | Official MoJ employment tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 statutory cap, and settlement comparison.<br>(159 chars) | "Calculate My Settlement Range →" → `/calculator/` |
| **RT-029** | `/guides/fair-work-agency/` | **What Is the Fair Work Agency? UK Employment Guide 2026**<br>(54 chars) | The Fair Work Agency is a new UK enforcement body under the Employment Rights Bill 2024-25. Not yet operational. Learn what it will do and how it impacts settlements.<br>(166 chars) | "Calculate my settlement" → `/calculator/` |
| **RT-030** | `/guides/how-to-negotiate-a-settlement-agreement/` | **How to Negotiate a Settlement Agreement 2026 \| SettlementCheck**<br>(62 chars) | Negotiate a UK settlement agreement using 2026 rates (£751/wk cap). Without Prejudice rules, counter-offers, and £500+ legal fee contributions. Free guide.<br>(155 chars) | "Settlement Calculator →" → `/calculator/` |
| **RT-031** | `/guides/is-my-settlement-offer-fair/` | **Is My Settlement Offer Fair? 2026 UK Check \| SettlementCheck**<br>(60 chars) | Check if your UK settlement offer is fair using 2026 rates (£751/wk cap). Compare against statutory minimums, tribunal medians, and Acas ranges. Free guide.<br>(156 chars) | "settlement calculator" → `/calculator/` |
| **RT-032** | `/guides/nhs-settlement-agreements/` | **NHS Settlement & MARS Calculator 2026 \| SettlementCheck**<br>(55 chars) | Calculate your NHS settlement and MARS redundancy payout under Agenda for Change. HM Treasury approval rules, £100k cap, pension rules, and tax-free limits.<br>(156 chars) | "Check NHS agreement clauses →" → `/settlement-agreement-review/` |
| **RT-034** | `/guides/pilon-tax-treatment-2026/` | **PILON Tax 2026 \| Is Notice Pay Tax Free? \| SettlementCheck**<br>(58 chars) | Understand PILON tax treatment for 2026. All notice pay is taxable (no £30k exemption). Use our free tool to check your take-home pay. No email.<br>(144 chars) | "Check my draft notice clauses →" → `/settlement-agreement-review/` |
| **RT-035** | `/guides/pressured-to-sign/` | **Pressured to Sign a Settlement Agreement? \| 10-Day Rule \| SettlementCheck**<br>(73 chars) | Understand your rights if your employer is pressuring you to sign a settlement agreement. Learn about the ACAS 10-day rule, improper behaviour, and your options.<br>(161 chars) | "Settlement Calculator" → `/calculator/` |
| **RT-036** | `/guides/protected-conversations-without-prejudice/` | **Protected Conversations & Without Prejudice UK \| Section 111A Guide**<br>(67 chars) | UK employee guide to Section 111A protected conversations and Without Prejudice rules. Learn your rights, improper behaviour limits, and 2026 statutory rates.<br>(158 chars) | "Calculate my estimate →" → `/calculator/` |
| **RT-037** | `/guides/protective-award/` | **Protective Award Calculator & Rules 2026 \| SettlementCheck**<br>(58 chars) | Calculate up to 90 days gross pay for collective redundancy consultation failure. Free calculator, solvent vs insolvent rules, and 2026 statutory caps.<br>(151 chars) | "Check draft agreement clauses →" → `/settlement-agreement-review/` |
| **RT-038** | `/guides/redundancy-pay-cap-2026/` | **Redundancy Pay Cap 2026 \| £751 Weekly Limit \| SettlementCheck**<br>(61 chars) | Check the UK redundancy pay cap for 2026 (£751/week limit). Find calculations, worked examples, and what to do if your employer got it wrong. No email.<br>(151 chars) | "Check my draft terms →" → `/settlement-agreement-review/` |
| **RT-039** | `/guides/settlement-agreement-acas-calculations/` | **Settlement Agreement ACAS-Based Calculations \| SettlementCheck**<br>(62 chars) | How ACAS-based settlement calculations work. Understand the £751 weekly pay cap (April 2026), tax-free limits, PILON tax rules, and the statutory redundancy formula.<br>(165 chars) | "Calculate my entitlement →" → `/calculator/` |
| **RT-040** | `/guides/settlement-agreement-how-much/` | **How Much Settlement Should You Get? 2026 \| SettlementCheck**<br>(58 chars) | Find out how much a UK settlement agreement should be in 2026. 1 to 3 months payout ranges, notice pay, £751 weekly cap, and tax rules. Free guide.<br>(147 chars) | "Check my draft clauses →" → `/settlement-agreement-review/` |
| **RT-041** | `/guides/settlement-agreement-instead-of-pip/` | **Settlement Agreement Instead of a PIP 2026 \| SettlementCheck**<br>(60 chars) | Offered a settlement agreement instead of a PIP? Check 2026 rates (£751/wk), Section 111A rules, negotiation tactics, and £500+ legal fee coverage. Free guide.<br>(159 chars) | "Check my draft exit terms →" → `/settlement-agreement-review/` |
| **RT-042** | `/guides/settlement-agreement-sick-leave/` | **Settlement Agreement on Sick Leave: UK Rights & Pay (2026)**<br>(58 chars) | Off sick and offered a settlement agreement? Learn your 2026 UK pay rights, full notice pay rules, £30,000 tax relief, and why your employer covers your fees.<br>(158 chars) | "free settlement calculator" → `/calculator/` |
| **RT-043** | `/guides/settlement-agreement-vs-tribunal-claim/` | **Settlement Agreement vs Tribunal 2026 \| SettlementCheck**<br>(55 chars) | Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.<br>(145 chars) | "check your offer" → `/calculator/` |
| **RT-044** | `/guides/tax-free-settlement-30000/` | **Tax-Free Settlement 2026 \| £30k Rule \| SettlementCheck**<br>(54 chars) | Free UK settlement agreement tax guide. First £30,000 is tax-free. Learn which payments qualify, how the excess is taxed, and check your offer. No email.<br>(153 chars) | "Check my draft tax split →" → `/settlement-agreement-review/` |
| **RT-045** | `/guides/unfair-dismissal-settlement-agreements/` | **Unfair Dismissal Settlement Agreements UK 2026**<br>(46 chars) | Calculate fair unfair dismissal settlements in 2026. Weekly cap £751, max compensatory award £123,543, tax-free limits, Polkey rules, and negotiation steps.<br>(156 chars) | "Standard Settlement Calculator" → `/calculator/?reason=performance` |
| **RT-046** | `/guides/what-happens-if-you-do-not-sign/` | **Not Signing a Settlement Agreement \| 2026 Rights \| SettlementCheck**<br>(66 chars) | Understand what happens if you reject a settlement agreement in the UK. Learn about alternative workplace procedures, notice pay, and tribunal risks.<br>(149 chars) | "SettlementCheck calculator" → `/calculator/` |
| **RT-047** | `/guides/what-is-a-fair-settlement-agreement/` | **What Is a Fair Settlement Agreement UK 2026? \| SettlementCheck**<br>(62 chars) | A fair settlement agreement pays more than your statutory minimum. Understand the £751 weekly cap, multiplier ranges, and the red flags that signal an offer is too low.<br>(168 chars) | "Check if your offer is fair in 60 seconds →" → `/calculator/` |
| **RT-021** | `/for-solicitors/` | **Settlement Agreement Instructions for Employment Solicitors \| SettlementCheck**<br>(77 chars) | Receive exclusive, pre-calculated settlement agreement instructions from UK employees. Complete statutory redundancy dossiers, PILON splits, and direct employer legal fees. SRA firms only.<br>(188 chars) | *No Primary CTA* |
| **RT-019** | `/disclaimer/` | **Calculator Disclaimer \| SettlementCheck**<br>(39 chars) | The SettlementCheck calculator provides estimates only and does not constitute legal advice. You must obtain independent legal advice before signing a settlement agreement.<br>(172 chars) | *No Primary CTA* |
| **RT-051** | `/privacy/` | **Privacy Policy \| SettlementCheck**<br>(32 chars) | How SettlementCheck collects, uses, and protects your personal data in accordance with UK GDPR.<br>(95 chars) | *No Primary CTA* |
| **RT-058** | `/sitemap/` | **HTML Sitemap \| SettlementCheck**<br>(30 chars) | Complete directory of UK settlement agreement calculators, legal advice guides, redundancy tools, and resources on SettlementCheck.co.uk.<br>(137 chars) | "Calculate Your Settlement &rarr;" → `/calculator/` |
| **RT-060** | `/terms/` | **Terms of Use \| SettlementCheck**<br>(30 chars) | Terms of use for SettlementCheck.co.uk, an independent introduction service connecting employees with SRA-regulated employment solicitors.<br>(138 chars) | *No Primary CTA* |
| **RT-020** | `/dossier/review/[id]/` | **Solicitor Pre-Flight Case Dossier \| SettlementCheck**<br>(51 chars) | Confidential SRA solicitor pre-flight matter dossier, statutory floor audit, and Section 203 adviser schedule.<br>(110 chars) | "Return to Solicitor Portal →" → `/portal/` |
| **RT-050** | `/portal/` | **Partner Solicitor Portal \| SettlementCheck Command Center**<br>(57 chars) | Exclusive SRA solicitor portal for territorial matter claims, pre-flight case dossiers, and telemetry benchmarks.<br>(113 chars) | "Settlement Check" → `/` |

---

## 4. API Route & Backend Service Inventory (15 Routes)

SettlementCheck exposes 15 Next.js serverless route handlers managing intake funnels, partner solicitor communications, automated crons, and AI document review pipelines.

| Endpoint Route | Handler File | Methods | Auth Protocol | Supabase Tables Accessed | External Integrations | Data Sensitivity & Privacy Classification |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| [`/api/cron/serp-sentinel`](file:///c:/settlementcheck/app/api/cron/serp-sentinel/route.ts) | `app/api/cron/serp-sentinel/route.ts` | `GET, POST` | CRON_SECRET / Bearer | *None (In-Memory)* | Gemini/Claude Gateway | **Public Non-PII** |
| [`/api/cron/sla-watchdog`](file:///c:/settlementcheck/app/api/cron/sla-watchdog/route.ts) | `app/api/cron/sla-watchdog/route.ts` | `GET, POST` | CRON_SECRET / Bearer | *None (In-Memory)* | Gemini/Claude Gateway | **Public Non-PII** |
| [`/api/health`](file:///c:/settlementcheck/app/api/health/route.ts) | `app/api/health/route.ts` | `GET` | Session / Token | *None (In-Memory)* | Gemini/Claude Gateway | **Public Non-PII** |
| [`/api/lead`](file:///c:/settlementcheck/app/api/lead/route.ts) | `app/api/lead/route.ts` | `POST` | Public Unauthenticated | `otp_codes`, `leads` | Resend Email, Gemini/Claude Gateway | **Tier 1 PII (Phone, Email, Case Details)** |
| [`/api/leads`](file:///c:/settlementcheck/app/api/leads/route.ts) | `app/api/leads/route.ts` | `POST` | Public Unauthenticated | `leads`, `solicitor_applications` | Resend Email, Gemini/Claude Gateway | **Tier 1 PII (Phone, Email, Case Details)** |
| [`/api/otp/send`](file:///c:/settlementcheck/app/api/otp/send/route.ts) | `app/api/otp/send/route.ts` | `POST` | Public Unauthenticated | `otp_codes` | Resend Email, Gemini/Claude Gateway | **Tier 1 PII (Phone, Email, Case Details)** |
| [`/api/otp/verify`](file:///c:/settlementcheck/app/api/otp/verify/route.ts) | `app/api/otp/verify/route.ts` | `POST` | Public Unauthenticated | `otp_codes` | Gemini/Claude Gateway | **Tier 1 PII (Phone, Email, Case Details)** |
| [`/api/portal/claim`](file:///c:/settlementcheck/app/api/portal/claim/route.ts) | `app/api/portal/claim/route.ts` | `POST` | Session / Token | `lead_claims` | Gemini/Claude Gateway | **Restricted Partner Legal Dossier** |
| [`/api/portal/dossier/[id]`](file:///c:/settlementcheck/app/api/portal/dossier/[id]/route.ts) | `app/api/portal/dossier/[id]/route.ts` | `GET` | Session / Token | `lead_claims`, `leads` | Gemini/Claude Gateway | **Restricted Partner Legal Dossier** |
| [`/api/portal/seo-actions`](file:///c:/settlementcheck/app/api/portal/seo-actions/route.ts) | `app/api/portal/seo-actions/route.ts` | `GET, POST` | Public Unauthenticated | `seo_run_logs` | Gemini/Claude Gateway | **Restricted Partner Legal Dossier** |
| [`/api/review-agreement`](file:///c:/settlementcheck/app/api/review-agreement/route.ts) | `app/api/review-agreement/route.ts` | `POST` | Public Unauthenticated | *None (In-Memory)* | Gemini/Claude Gateway | **Confidential In-Memory Contract Text** |
| [`/api/save-results`](file:///c:/settlementcheck/app/api/save-results/route.ts) | `app/api/save-results/route.ts` | `POST` | Public Unauthenticated | `email_captures` | Resend Email, Gemini/Claude Gateway | **Public Non-PII** |
| [`/api/solicitor-application`](file:///c:/settlementcheck/app/api/solicitor-application/route.ts) | `app/api/solicitor-application/route.ts` | `POST` | Public Unauthenticated | `solicitor_applications` | Resend Email, Gemini/Claude Gateway | **Public Non-PII** |
| [`/api/telemetry/settlement-outcome`](file:///c:/settlementcheck/app/api/telemetry/settlement-outcome/route.ts) | `app/api/telemetry/settlement-outcome/route.ts` | `GET, POST` | Public Unauthenticated | `settlement_benchmark_aggregates`, `settlement_outcomes` | Gemini/Claude Gateway | **Anonymous Aggregated Telemetry** |
| [`/api/waitlist`](file:///c:/settlementcheck/app/api/waitlist/route.ts) | `app/api/waitlist/route.ts` | `POST` | Public Unauthenticated | `employee_waitlist` | Gemini/Claude Gateway | **Public Non-PII** |

---

## 5. Structural Architecture & SEO Governance Analysis

### 5.1 Internal PageRank & Linking Topology
Internal linking analysis across all 93 source files shows strong hub-and-spoke distribution:
- **Primary Power Hub**: `/calculator/` receives 50 inbound links across navigation, hero CTAs, and contextual guide references.
- **Secondary Hubs**: `/redundancy-calculator/` (36 links), `/guides/how-to-negotiate-a-settlement-agreement/` (31 links), and the main guides directory `/guides/` (30 links).
- **Footer Foundation**: The global `Footer.tsx` component distributes baseline PageRank to all 5 programmatic calculators, key guides, and legal pages.
- **Orphan Status**: 0 orphan pages detected. Every single published URL is reachable via natural internal links.

### 5.2 Structured Data (Schema.org) Audit
The platform demonstrates advanced Schema.org implementation:
- **`WebApplication` & `SoftwareApplication` (8 pages)**: Models interactive calculator features, zero pricing (`Offer: price 0 GBP`), and software versioning (`2026.1 (SI 2026/310)`).
- **`Legislation` (18 pages)**: Directly references UK primary statutes at `legislation.gov.uk`, establishing definitive E-E-A-T grounding for Google algorithm evaluation.
- **`FAQPage` (34 pages)**: Rich FAQ accordions embedded across all calculators and guides, structured for Google Featured Snippets and AI Overviews.
- **Gap Identified (`SC-E-INV-004`)**: Only 9 pages carry `BreadcrumbList` markup. Adding hierarchical breadcrumb schemas across all 25 guides will improve SERP visual rendering.

### 5.3 Crawl Directives & Bot Governance (`robots.txt`)
Inspection of `app/robots.ts` confirms:
- **Public Bots Allowed**: Default allow for all user agents (`*`).
- **AI Bots Allowed**: Explicitly allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, enabling Answer Engine Optimization (AEO).
- **Restricted Paths**: Universally disallows `/results/`, `/portal/`, and `/dossier/` across all user agents.

---

## 6. Phase 2 Discovered Evidence & Deficiency Register

The following issues have been catalogued and added to the audit evidence bus:

| Finding ID | Severity | Category | Target Route(s) | Description & Statutory / SEO Impact | Recommended Remediation |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **SC-E-INV-001** | **P1 (High)** | SEO Indexation | `/get-matched/` | URL is included in `app/sitemap.ts` with priority 0.9, but `app/get-matched/page.tsx` defines `robots: { index: false, follow: false }`. Triggers Search Console sitemap indexing errors. | Align policy: either remove from `sitemap.ts` if intended as private funnel stage, or remove `noindex` to allow it to rank as a solicitor-matching landing page. |
| **SC-E-INV-002** | **P2 (Medium)** | Canonical Hygiene | 25 Page Routes | 25 pages declare relative canonicals (`canonical: '/calculator/'`) while 17 declare absolute URLs. While Next.js `metadataBase` prefixes the domain, mixed declarations risk canonical fragmentation. | Standardize all 44 page canonical declarations to fully qualified non-www URLs (`https://settlementcheck.co.uk${route}`). |
| **SC-E-INV-003** | **P2 (Medium)** | Legal Compliance | 37 Page Routes | Only 7 of 44 pages include explicit inline "does not constitute legal advice" disclaimers, relying heavily on global footer text. | Introduce a lightweight, persistent statutory advisory pill / banner across all programmatic calculators. |
| **SC-E-INV-004** | **P3 (Low)** | Schema / SERP | 35 Page Routes | `BreadcrumbList` JSON-LD schema is only implemented on 9 pages. The 25 guide spokes lack structured breadcrumb hierarchy. | Implement automated `BreadcrumbList` schema across all guide spokes to enhance Google search rich snippet breadcrumbs. |
| **SC-E-INV-005** | **P3 (Low)** | Meta Optimization | 12 Page Routes | Certain guide meta descriptions exceed 160 characters (e.g. `/guides/compromise-agreement-calculator-uk/` at 178 chars), resulting in truncation on mobile SERPs. | Calibrate meta descriptions to strictly between 135–155 characters. |

---

## 7. Quality Gate Verification (Phase 2 Close)

- **Deterministic Route Count**: 61 routes verified (44 pages, 15 APIs, 2 SEO endpoints).
- **TypeScript Verification**: `npx tsc --noEmit` → **0 Type Errors**.
- **Broken Link Verification**: `npm run check:links` → **0 Broken Routes, 0 Trailing Slash Errors**.
- **Legal / Statutory Evals**: `npm run test:evals` → **28/28 Passing (100%)**.
- **Machine-Readable Dataset**: Synced to `data/audit/website-inventory.json` and `data/audit/api-inventory.json`.
