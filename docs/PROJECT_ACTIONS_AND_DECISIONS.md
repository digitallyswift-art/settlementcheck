# SettlementCheck — Master Project Actions & Architectural Decisions Log

This document serves as the persistent source of truth for all strategic decisions, competitive findings, and architectural implementations agreed upon for **SettlementCheck (settlementcheck.co.uk)**.

---

## 1. Project North Star & Success Metric

**Primary Commercial Goal**:
Establish deep, indispensable software and pipeline **dependency** among UK employment law firms (SRA-regulated solicitors). 

**The Three Pillars of Solicitor Dependency**:
1. **Acquisition Dependency**: Exclusive, pre-qualified employee instruction pipeline delivered at zero direct PPC ad spend for the law firm.
2. **Operational Dependency**: AI Pre-Flight Case Dossiers and automated Section 203 ERA 1996 adviser packs that slash solicitor review time from 90 minutes down to 20 minutes, tripling matter realization profitability on fixed employer fee contributions (£500–£750 + VAT).
3. **Information & Negotiation Dependency**: Exclusive access to the proprietary **SettlementCheck Telemetry Flywheel** (real-world empirical settlement payout data), providing statistical leverage in negotiations against employer HR teams.

---

## 2. Competitive Landscape Audit Matrix (October 2026)

| Competitor Category | Key Players | Strengths | Critical Weaknesses / Strategic Vulnerabilities | SettlementCheck's Competitive Advantage |
| :--- | :--- | :--- | :--- | :--- |
| **Vertically Integrated Tech Law Firms** | **Monaco Solicitors** (Grapple Law), **Lawhive** (Lawrence AI) | High venture capital, proprietary in-house legal AI for drafting, national brand recognition. | **They are law firms competing against all other UK solicitors**. They cannot license their technology to independent SRA firms. Law firms view them as existential threats. | **Neutral SaaS & Marketplace Partner**: SettlementCheck does not provide statutory advice under S.203; it empowers independent law firms to beat Monaco and Lawhive. |
| **Specialist Boutique & High-Street Law Firms** | **Deen & Co**, **Springhouse**, **GTE Settlement Solicitors**, **KLG Law** | Deep legal expertise, strong local reputation, personalized client handling. | Crushed by high PPC costs (£85–£220+ per click on Google Ads). No in-house engineering team to build custom AI or maintain programmatic SEO. Low margins on standard £500 fees. | **Turnkey Tech Engine**: Provides them enterprise-grade AI intake, pre-flight dossiers, and qualified regional client instructions without PPC risk. |
| **Legacy Lead Brokers & Aggregators** | **Settlement Hub**, **FairSettlement**, **The Law Superstore** | Established SEO rankings for generic settlement terms, basic calculators. | **"Dumb Lead" Distribution**: Dump unverified, untriaged lead forms into solicitors' inboxes. High client drop-off, no statutory discrepancy checks, zero CRM workflow integration. | **Instruction-Ready Dossier**: Delivers structured, SRA-compliant, pre-calculated briefs directly into PMS systems (Clio/LEAP) with verified OTP contact details. |
| **Statutory & Government Portals** | **GOV.UK Redundancy Calculator**, **ACAS Helpline** | Ultimate public trust, zero commercial motive. | Static statutory redundancy only. **Legally prohibited from offering interactive settlement agreement calculations or recommending legal representation**. | **The Private Sector Standard**: Fills the gap where GOV.UK/ACAS stop, bridging the statutory baseline to commercial negotiation. |

---

## 3. The Watertight MOAT: 6-Tool Agentic Infrastructure

To prevent commoditization by generic LLM wrappers, the SettlementCheck Agentic AI relies on a deterministic **Tool-Calling Architecture** where AI models act as reasoning orchestrators over non-hallucinatory legal and statutory invariants.

```
                    ┌──────────────────────────────────────────────┐
                    │       Antigravity AI Reasoning Gateway       │
                    │      (Gemini 3.8 Flash / Claude 3.5 / Pro)    │
                    └──────────────────────┬───────────────────────┘
                                           │
          ┌────────────────────────────────┼────────────────────────────────┐
          ▼                                ▼                                ▼
┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
│   Tool 1: Statutory│          │  Tool 2: S.203 ERA │          │ Tool 3: Bi-dir PMS │
│  Invariant Verifier│          │ Adviser Pack Gen.  │          │   Sync (Clio/LEAP) │
│ (Pure TS formulas) │          │ (Checklist + Cert) │          │  (Zero Data Entry) │
└────────────────────┘          └────────────────────┘          └────────────────────┘
          │                                │                                │
          ▼                                ▼                                ▼
┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
│  Tool 4: Empirical │          │ Tool 5: SRA & Post-│          │ Tool 6: Autonomous │
│  Outcome Telemetry │          │ code Match Engine  │          │    SERP Sentinel   │
│  (DB Benchmarks)   │          │ (Territory Exclus.)│          │ (Competitor Watch) │
└────────────────────┘          └────────────────────┘          └────────────────────┘
```

### Detailed Tool Specifications

1. **`verify_statutory_invariants`**
   - **File**: `lib/ai/tools/statutory-tools.ts`
   - **Capability**: Deterministically executes calculations against `lib/calculations.ts` and `lib/statutory-rates.ts`. Validates ERA 1996 weekly cap (£751/week), maximum compensatory award (£123,543), ITEPA 2003 s.403 £30,000 tax exemption, and TULRCA 1992 s.189 90-day protective awards.

2. **`generate_s203_adviser_pack`**
   - **Capability**: Audits the draft agreement against the statutory 6-point requirement of Section 203(3) ERA 1996. Produces:
     - S.203 Solicitor Adviser Certificate (ready for signature).
     - Carve-Out Risk Report (identifying accrued pension, personal injury, or whistleblower claim waiver issues).
     - Standardized Employer Legal Fee Invoice draft (directed to employer's finance dept).

3. **`sync_pms_intake`**
   - **Capability**: Automatically formats and dispatches the lead, client profile, and AI Pre-Flight Dossier into partner firms' Practice Management Systems (Clio API, LEAP, or PracticeEvolve webhooks), eliminating manual intake and CRM setup.

4. **`query_settlement_benchmarks`**
   - **File**: `lib/ai/tools/telemetry-tools.ts`
   - **Capability**: Queries `settlement_outcomes` and `settlement_benchmark_aggregates` view in Supabase. Returns industry-specific, tenure-specific, and claim-specific settlement multipliers to empower solicitor counter-offers with empirical market data.

5. **`match_and_lock_territory`**
   - **Capability**: Resolves employee postcodes via `lib/postcodes.ts`, matches exclusive territorial partner firms in `solicitor_applications`, locks instruction to prevent multi-firm spamming, and starts the 15-minute SLA timer.

6. **`sentinel_monitor_serp`**
   - **Capability**: Autonomous Antigravity scheduled task monitoring competitor SERP movements, ad copy changes, and Google AI Overview citations across 200+ tracked queries in `data/gsc-history/`.

---

## 4. Agreed Implementation Phases

- [x] **Phase 1: Watertight Tool-Calling Core & Pre-Flight Case Dossier** (Completed & Audited: 17 Oct 2026)
  - Formalized 6 deterministic invariant tools in `lib/agentic-engine/tools/` (Statutory, Captive Threat, Legal Pack, Telemetry, Territorial, PMS Sync).
  - Deployed 5 specialized workers (`triage`, `captive-threat`, `clause-risk`, `benchmark`, `crm-dispatch`) with master `AgenticOrchestrator`.
  - Integrated Pre-Flight Case Dossier generator into `/api/review-agreement` and Clio/LEAP-ready intake into `/api/leads` with partner email brief cards.
  - Passed full audit verifying qualifying service (ERA 1996 s.155), Equality Act 2010 uncapped discrimination, fee disparity regex extraction, and strict trailing slash invariants.
- [x] **Phase 2: Partner Portal & Territorial Lead Lock** (Completed & Audited: 17 Oct 2026)
  - Created database migration `supabase/migrations/20261017_solicitor_panel_and_territories.sql` and updated master `supabase/schema.sql` with `solicitor_panel`, `lead_claims`, indexes, RLS, and atomic matter claim counters.
  - Implemented pure TypeScript Haversine distance geocoding and outward postal code priority matcher in `lib/agentic-engine/tools/territorial-tools.ts` with 15-minute SLA exclusivity lock token generation.
  - Built Partner Portal Command Center (`/portal/`) featuring live instruction queue, 15-minute exclusivity watchdog timer, territorial mapping by outward code cluster, empirical telemetry tables, and PMS webhook configuration (Clio Manage, LEAP, PracticeEvolve).
  - Built interactive, one-click Pre-Flight Legal Dossier Review Portal (`/dossier/review/[id]/`) with live countdown timer, atomic instruction lock button, multi-tab statutory shortfall breakdowns, tactical negotiation points, and PMS intake JSON export.
  - Built backend APIs `/api/portal/claim/` and `/api/portal/dossier/[id]/` with atomic claim handling and fallback dossier generation.
  - Added strict `robots: { index: false, follow: false }` metadata and `app/robots.ts` disallow rules to protect sensitive matter confidentiality from search spiders.
  - Added `/portal/` to footer navigation under Solicitors section.
  - Passed deterministic quality gates: `npx tsc --noEmit` (0 errors), `npm run test:evals` (16/16 - 100%), and `npm run check:links` (58 routes, 717 links, 0 errors).
- [x] **Phase 3: Antigravity Autonomous Background Fleet & GSC API Connection** (Completed & Audited: 17 Oct 2026)
  - Built Tool 6: Autonomous SERP Sentinel tool in `lib/agentic-engine/tools/serp-tools.ts` monitoring 295+ queries, calculating climber/dropper dynamics, AI Overview trigger candidates, and competitor threat intercepts.
  - Connected direct Google Search Console API via Google Cloud Service Account OAuth2 JWT authorization (`sc-domain:settlementcheck.co.uk`) with zero npm dependencies and 100% free forever (£0.00 spend).
  - Implemented Google Cloud Fleet Quota Guards in `scripts/sentinel/serp-sentinel.mjs` (6-hour caching debounce, 2,500 row limit, and weekly cron schedule in `vercel.json` running Sundays at 03:00 UTC).
  - Deployed 5 high-impact quick wins:
    1. CTR metadata recalibration for Rank 4.1 query `"employee settlement calculator"` on `app/page.tsx` and `app/calculator/page.tsx`.
    2. Contextual internal link equity channeling to `app/guides/compromise-agreement-calculator-uk/` (Rank 16.1 · 131 impressions) from homepage, negotiation guide, and how-much guide.
    3. Deployed `FAQPage` Schema.org JSON-LD and semantic SEO content on `/calculator/` targeting `"settlement agreement calculator gov"` (Pos 15.4) and `"settlement agreement calculator acas"` (Pos 20.6).
    4. Integrated live GSC API pulls into serverless endpoint `app/api/cron/serp-sentinel/route.ts` with `AutonomousSeoActionService`.
  - Implemented 15-Minute SLA Watchdog Worker in `lib/agentic-engine/workers/sla-watchdog-worker.ts` with automated lead lock timeout expiration, secondary SRA panel failover cascade, and breach rate tracking.
  - Built CLI runners: `scripts/sentinel/serp-sentinel.mjs` (`npm run sentinel:serp`) and `scripts/sentinel/test-gsc-connection.mjs` (`npm run test:gsc`).
  - Implemented serverless HTTP cron endpoints `/api/cron/serp-sentinel/` and `/api/cron/sla-watchdog/` with `CRON_SECRET` bearer token authentication.
  - Passed deterministic quality gates: `npx tsc --noEmit` (0 errors), `npm run test:evals` (19/19 - 100%), and `npm run check:links` (60 routes, 726 links, 0 errors).
- [x] **Phase 4 (Track 2): 24/7 Autonomous SEO Fleet with 4-Agent Review & Persistent Change Logging** (Completed & Audited: 17 Oct 2026)
  - Deployed 4-Agent Collaborative Invariant Pipeline:
    1. **SEO Architect Agent** (`lib/agentic-engine/agents/seo-architect-agent.ts`): Intent classification, canonical URL integrity (strict trailing slash), Schema.org JSON-LD generation (`FAQPage`/`WebApplication`), and character budget enforcement (50-60 title, 140-155 meta).
    2. **Conversion Copywriter Agent** (`lib/agentic-engine/agents/conversion-copywriter-agent.ts`): Empathetic UK demographic tone, high-CTR active copy, 0 em dashes (strict `BRAND.md` compliance), and fee reassurance ("your employer covers the legal fees").
    3. **Statutory & Legal Auditor Agent** (`lib/agentic-engine/agents/statutory-auditor-agent.ts`): Forensic statutory compliance auditing all copy against ERA 1996 s.162 (April 2026 £751/week cap), ITEPA 2003 s.403 (£30k tax-free floor), S.203(3) ERA 1996 independent solicitor requirement, and SRA regulatory boundaries.
    4. **Anti-AI Quality & E-E-A-T Evaluator Agent** (`lib/agentic-engine/agents/anti-ai-quality-guard.ts`): Eliminates robotic clichés ("delve", "furthermore", "navigating the complexities", "tapestry"), scores burstiness/sentence rhythm, enforces Answer-First directness, and guarantees content is never flagged as low-effort AI.
  - Implemented 24/7 Computer-Off Cloud Autonomy:
    - Updated `vercel.json` with daily SERP Sentinel execution (`0 3 * * *`) and 15-minute SLA Watchdog (`*/15 * * * *`).
    - Built redundant cloud scheduled runner in `.github/workflows/sentinel-cron.yml` running daily at 03:30 UTC with automated git commits for change logs.
  - Built Dual-Persistence Change Logging:
    - Cumulative audit log in `data/serp-actions/CHANGE_LOG.md` recording timestamp, query, metrics, 4-agent verdicts, and authenticity scores.
    - Cloud database schema migration `supabase/migrations/20261017_autonomous_seo_logs.sql` and `supabase/schema.sql` (`seo_run_logs` and `seo_autonomous_actions`).
    - Staged review packages in `data/serp-actions/staging/latest-staged-actions.{json,md}`.
    - Exposed query API endpoint at `/api/portal/seo-actions/` for historical action retrieval.
  - Passed deterministic quality gates: `npx tsc --noEmit` (0 errors), `npm run test:evals` (28/28 - 100%), and `npm run check:links` (61 routes, 726 links, 0 errors).
- [ ] **Phase 4 (Track 1 & 3): Empirical Benchmark Intelligence & Commercialization**
  - Expose interactive Benchmark Query API for partner solicitors (`/portal/benchmarks/`).
  - Outcome feedback loop API (`/api/portal/outcome/`) to capture realized settlement amounts.
  - Roll out territorial subscription / per-completed-instruction monetization.

---

*Last Updated: 17 October 2026 | SettlementCheck System Architecture*
