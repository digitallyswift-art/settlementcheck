# Phase 01B — Project Discovery & Architecture Baseline Report (`phase-01b-project-discovery.md`)
**Project:** SettlementCheck (settlementcheck.co.uk)  
**Audit Phase:** Phase 01B (Project Discovery & Application Architecture Baseline)  
**Date of Audit:** 2026-10-18  
**Auditor Protocol:** Antigravity Zero-Assumption Protocol & Mandatory Evidence Standard  
**Designated Report Directory:** `c:\settlementcheck\docs\audit\`

---

## 1. Executive Overview & Scope Assessment

SettlementCheck is a specialized, pre-solicitor decision-support platform designed for UK employees who have received a settlement agreement offer or are facing redundancy. It models statutory entitlements (redundancy pay, notice pay/PILON, basic awards), evaluates offer fairness, identifies contract clause risks, and connects employees with SRA-regulated employment law solicitors under Section 203(3) of the Employment Rights Act 1996.

This Phase 1 Discovery audit establishes the comprehensive structural baseline of the repository, inventorying all tools, runtime agentic engines, custom skills, API routes, database schemas, and external dependencies, while cataloguing access limitations and assigning distinct workstreams across the specialist agent fleet.

---

## 2. Antigravity Project Structure & Agent Fleet

### 2.1 Workspace Customization Roots & Discovery
The repository leverages Antigravity Workspace Customizations located in `.agents/`:
- **Rules**: `.agents/rules/engineering-standards.md` & root `AGENTS.md`.
- **Specialist Skills (9 Total in `.agents/skills/`)**:
  1. `legal-compliance-auditor` (ERA 1996, SRA boundary, Equality Act 2010, TUPE)
  2. `tax-compliance-auditor` (ITEPA 2003, PENP s.402D, HMRC EIM, Class 1/1A NIC)
  3. `calculator-auditor` (IEEE Boundary Value Analysis, SI 2026/310 rates)
  4. `claims-privacy-auditor` (ASA CAP Code Rule 3, UK GDPR Article 9 Special Category Data)
  5. `forum-demand-researcher` (Qualitative demand mining across Reddit, MSE, Mumsnet)
  6. `seo-architect` (7-tier intent classification, Schema.org JSON-LD, trailing slashes)
  7. `conversion-copywriter` (BRAND.md compliance, 0 em dashes, empathetic UK copy)
  8. `link-checker` (Deterministic 61-route & 727-link integrity crawler)
  9. `sentinel-fleet` (SERP competitor tracking & 15-minute territorial SLA watchdog)

### 2.2 Application Architecture & Tech Stack
- **Framework**: Next.js 14.2.35 (App Router, Server Components + Client Hydration)
- **Runtime**: Node.js v24.14.1 with native ES Modules (`.mjs`) and TypeScript (`npx tsx`)
- **Language**: TypeScript 6.0.3 (`tsconfig.json` with strict type checking)
- **Styling**: Tailwind CSS 3.4.19 with custom design tokens (Navy `#0B1F3A`, Coral `#D9603B`, Off-white `#F7F4EE`)
- **Database & Storage**: Supabase (`@supabase/supabase-js` v2.49.4) via server-side service role proxy in `lib/supabase.ts`
- **Email & Communications**: Resend (`resend` v4.3.0) via `lib/resend.ts`
- **Analytics**: `@vercel/analytics` v2.0.1
- **Deployment**: Vercel Serverless Platform (`vercel.json`) with scheduled crons for SERP Sentinel (`0 3 * * *`) and SLA Watchdog (`*/15 * * * *`)

---

## 3. Route, Component & API Topology

### 3.1 Route Distribution (61 Total Routes Discovered)
- **Core Conversion Pillars (4 routes)**:
  - `/` (Homepage & Hero Intake)
  - `/calculator/` (Stepped 6-stage interactive settlement calculator)
  - `/calculators/` (Hub directory)
  - `/settlement-agreement-review/` (Clause and document review intake)
- **Programmatic Statutory Calculators (5 routes)**:
  - `/redundancy-calculator/`
  - `/unfair-dismissal-calculator/`
  - `/constructive-dismissal-calculator/`
  - `/settlement-agreement-tax-calculator/`
  - `/protective-award-calculator/`
- **User Results & Intake Funnel (3 routes)**:
  - `/results/` (Financial baseline verdict, tax estimates, solicitor match CTA)
  - `/get-matched/` (Dedicated solicitor intake flow)
  - `/how-it-works/` (Explainer and transparency overview)
- **Partner Solicitor Infrastructure (2 routes)**:
  - `/portal/` (Partner Solicitor Command Center, territorial lead locks, PMS webhook config)
  - `/dossier/review/[id]/` (Interactive solicitor pre-flight case dossier review)
- **Statutory & Educational Guides (25 routes)**:
  - `/guides/` (Hub directory)
  - 24 topic-specific spokes (e.g. `settlement-agreement-how-much`, `compromise-agreement-calculator-uk`, `tax-free-settlement-30000`, `redundancy-pay-cap-2026`, `pilon-tax-treatment-2026`, `average-settlement-agreement-payout-uk`)
- **Supplier & Panel Application (1 route)**:
  - `/for-solicitors/` (SRA panel onboarding)
- **Public Legal & Administrative Pages (4 routes)**:
  - `/privacy/`
  - `/terms/`
  - `/disclaimer/`
  - `/sitemap/`
- **API Endpoints (17 routes)**:
  - `/api/review-agreement` (Document clause parsing & pre-flight dossier dispatch)
  - `/api/leads` (Lead intake & Clio/LEAP PMS dispatch)
  - `/api/lead` (Single lead endpoint)
  - `/api/otp` (OTP verification flow)
  - `/api/portal/claim` (Atomic 15-minute lead lock claim)
  - `/api/portal/dossier` (Dynamic dossier fetch)
  - `/api/portal/seo-actions` (Historical autonomous SEO actions)
  - `/api/solicitor-application` (Panel intake)
  - `/api/telemetry` (Anonymous outcome telemetry recording)
  - `/api/waitlist` (Employee waitlist capture)
  - `/api/save-results` (Session persistence)
  - `/api/cron/serp-sentinel` (Scheduled SERP monitor)
  - `/api/cron/sla-watchdog` (Scheduled SLA lead lock watchdog)
  - `/api/health` (Healthcheck probe)

---

## 4. Test Suite & Invariant Quality Gates

The project is governed by 4 deterministic quality gates:

| Quality Gate | Terminal Command | Target Invariant | Current Status |
| :--- | :--- | :--- | :---: |
| **Legal & Statutory Evals** | `npm run test:evals` | 28 statutory rules, caps, em dashes, US terms | **28/28 (100% Pass)** |
| **Route & Link Checker** | `npm run check:links` | 61 routes, 727 links, strict trailing slash | **0 Errors (100% Pass)** |
| **TypeScript Typecheck** | `npx tsc --noEmit` | Strict compilation with 0 type errors | **0 Errors (100% Pass)** |
| **Deterministic Audit Fleet** | `npm run audit:all` | 19 BVA tests, 41 claims, 0 SRA breaches, 4 PENP | **100% Verified** |

---

## 5. Storage, Authentication & Data Flow Inspection

1. **Database Access Layer**:
   - `lib/supabase.ts` implements a lazy-loaded proxy using `SUPABASE_SERVICE_ROLE_KEY`.
   - **Observation**: Anonymous browser client (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is not exported to client components, protecting direct table reads from the browser.
   - **Finding (`SC-E-PRIV-001`)**: `supabase/schema.sql` lacks explicit `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` definitions, meaning table protection relies entirely on server-side key confidentiality.
2. **AI Gateway & Document Review Pipeline**:
   - `lib/ai/gateway.ts` handles model routing (Gemini 3.8 Flash, Anthropic Claude 3.5, OpenAI, with deterministic `mock` fallback).
   - Document upload endpoint `/api/review-agreement` receives raw agreement text in-memory.
   - **Privacy Verification**: Document text is parsed for terms and discarded from serverless memory; raw full-text documents are NOT persisted in the Supabase database.

---

## 6. Access Limitations & Project Constraints

1. **Inaccessible Live Production Services (Expected Guardrail)**:
   - Live Supabase production console (access restricted to offline SQL schema and environment variables).
   - Live Google Cloud Service Account OAuth2 live token generation (simulated safely via mock/local cached data in development).
   - Live Resend email dispatch (verified via mock test mode).
2. **Tooling Availability**:
   - Windows PowerShell environment with Node.js v24.14.1 and `npx tsx` v4.23.15 fully available.
   - Git repository clean on branch `main`.
3. **Hardstop Compliance**:
   - Zero modifications to production routes, components, or calculation formulas have been made.
   - All audit test scripts operate non-destructively in `scripts/audit/` and `data/audit/`.

---

## 7. Workstream Allocation Across Specialist Agents

To ensure zero duplicated effort during the audit:

| Workstream | Specialist Agent Owner | Key Responsibilities & Deliverable Target |
| :--- | :--- | :--- |
| **Phase 01: Project Discovery & Sources** | Master Orchestrator | Architecture baseline & statutory sources -> [`phase-01a-source-register.md`](file:///c:/settlementcheck/docs/audit/phase-01a-source-register.md), [`phase-01b-project-discovery.md`](file:///c:/settlementcheck/docs/audit/phase-01b-project-discovery.md) |
| **Phase 02: Website Inventory** | `link-checker` & `seo-architect` | Full 61-route inventory, metadata, CTAs -> [`phase-02-website-inventory.md`](file:///c:/settlementcheck/docs/audit/phase-02-website-inventory.md) |
| **Phase 03: Implementation Review** | `calculator-auditor` & `claims-privacy-auditor` | Code inspection of formulas, API routes, Supabase RLS -> [`phase-03-implementation-review.md`](file:///c:/settlementcheck/docs/audit/phase-03-implementation-review.md) |
| **Phase 04: Legal & Tax Verification** | `legal-compliance-auditor` & `tax-compliance-auditor` | Statutory cross-checks -> [`phase-04a-legal-compliance-audit.md`](file:///c:/settlementcheck/docs/audit/phase-04a-legal-compliance-audit.md), [`phase-04b-tax-compliance-audit.md`](file:///c:/settlementcheck/docs/audit/phase-04b-tax-compliance-audit.md) |
| **Phase 05: Calculator Testing** | `calculator-auditor` | 19+ IEEE BVA test cases with `SC-T-000` schema -> [`phase-05-calculator-audit.md`](file:///c:/settlementcheck/docs/audit/phase-05-calculator-audit.md) |
| **Phase 06: Product & User Protection** | Master Orchestrator | High-risk scenarios, offer-vs-baseline -> [`phase-06-product-gap-analysis.md`](file:///c:/settlementcheck/docs/audit/phase-06-product-gap-analysis.md) |
| **Phase 07: Claims & Privacy Review** | `claims-privacy-auditor` | 41 flagged claims & GDPR review -> [`phase-07-unsupported-claims-and-privacy.md`](file:///c:/settlementcheck/docs/audit/phase-07-unsupported-claims-and-privacy.md) |
| **Phase 08: SEO, AEO & Commercial** | `seo-architect` & `conversion-copywriter` | Indexability, E-E-A-T, commercial models -> [`phase-08a-seo-aeo-audit.md`](file:///c:/settlementcheck/docs/audit/phase-08a-seo-aeo-audit.md), [`phase-08b-conversion-commercial-audit.md`](file:///c:/settlementcheck/docs/audit/phase-08b-conversion-commercial-audit.md) |
| **Phase 09: Forum Demand Research** | `forum-demand-researcher` | Qualitative anxiety matrix -> [`phase-09-forum-demand-matrix.md`](file:///c:/settlementcheck/docs/audit/phase-09-forum-demand-matrix.md) |
| **Phase 10: Prioritisation & Escalation** | Master Orchestrator | Top ranked backlog & board summary -> [`phase-10a-prioritised-remediation-backlog.md`](file:///c:/settlementcheck/docs/audit/phase-10a-prioritised-remediation-backlog.md), [`phase-10b-executive-summary.md`](file:///c:/settlementcheck/docs/audit/phase-10b-executive-summary.md) |
