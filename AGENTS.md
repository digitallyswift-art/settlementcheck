# SettlementCheck — Agentic System & AI Pair Programming Guide

This repository contains specialised AI agents and workflow instructions for **SettlementCheck (settlementcheck.co.uk)** — the UK's leading independent settlement agreement calculator and SRA-regulated solicitor-matching platform.

---

## 1. How to Mention and Trigger Agents

In your chat canvas:
- **Mention with `@`**: Type `@` to open the context dropdown. You can mention:
  - `@AGENTS.md` — Loads the full agent routing and system context.
  - `@seo-architect` — Invokes the SEO Architect for audits, meta tags, schema, keyword gaps, and internal linking.
  - `@conversion-copywriter` — Invokes the Conversion Copywriter for hero copy, CTAs, FAQs, and brand compliance.
  - `@link-checker` — Invokes the automated route and link verification workflow.
  - `@stack-and-architecture` — Invokes Next.js App Router standards, Tailwind tokens, and tech stack guidelines.
  - `@pages-and-components` — Invokes component catalog, CRO rules, and Calculator-to-Results URL contracts.
  - `@calculator-and-data` — Invokes statutory formulas, Supabase database schemas, and OTP verification flows.
  - Any file or directory (e.g., `@app/sitemap.ts`, `@components/Nav.tsx`).
- **Trigger Actions with `/`**: Type `/` to run built-in actions:
  - `/plan` — Create a structured step-by-step roadmap before executing large SEO or feature migrations.
  - `/goal` — Run thorough multi-step background optimization and validation tasks.
  - `/grill-me` — Interactive interview to clarify design, copy, or technical decisions before building.

---

## 1.5 Architectural Separation: IDE Customizations vs Application Engine

- **Design-Time IDE Customizations (`.agents/`)**:
  - Contains Antigravity IDE skills (`.agents/skills/`) and behavioral rules (`.agents/rules/`).
  - Provides prompt runbooks that assist developers during AI pair programming.
  - Never compiled into production bundles or executed by Next.js runtime.
- **Production Runtime Engine (`lib/agentic-engine/`)**:
  - Live TypeScript application code running in Next.js, APIs, and cron jobs:
    - **`agents/`**: Cognitive entities calling LLMs via `callAI()` (`SeoArchitectAgent`, `ConversionCopywriterAgent`, `LegalComplianceAuditorAgent`).
    - **`guardrails/`**: Deterministic regulatory and quality filters (`SraBoundaryGuard`, `CapCodeClaimsGuard`, `AntiAiQualityGuard`).
    - **`orchestrator/`**: Master multi-agent state machines (`AgenticOrchestrator`, `SeoWorkflowOrchestrator`).
    - **`workers/`**: Scheduled background executors and worker task definitions (`slaWatchdogWorker`, `triageWorker`, etc.).
    - **`tools/`**: Pure deterministic calculation and lookup tools (`statutory-tools.ts`, `serp-tools.ts`).
    - **`services/`**: External API clients and file system persistence (`gsc-client.ts`, `seo-actuator-service.ts`, `google-indexing-client.ts`).

---

## 2. Available Agents & Core Commands

### A. `seo-architect`
Specialist in technical SEO, programmatic page architecture, search intent, JSON-LD schema, and statutory E-E-A-T compliance.

**Key Commands to prompt the agent with:**
- `audit [page]` — Full on-page SEO, E-E-A-T, metadata, schema, and layout audit.
- `quick audit [page]` — Fast scan of title, headings, statutory accuracy, and mobile CTA visibility.
- `meta [page or topic]` — Generates character-calibrated, high-CTR `<title>` and `<meta name="description">`.
- `schema [page type]` — Generates valid Schema.org JSON-LD (WebApplication, FAQPage, CollectionPage, HowTo).
- `internal links [page]` — Audits inbound and outbound internal links to ensure maximum PageRank flow and zero orphans.
- `statutory check [text block]` — Verifies employment law figures (e.g., April 2026 cap of £751/week, £123,543 unfair dismissal compensatory cap, £30,000 tax exemption under ITEPA 2003 s.403).
- `gaps [category]` — Identifies high-volume search queries and topics missing from the site.
- `archive gsc` / `analyze gsc` — Automatically archives previous search console data and computes progress vs latest data.
- `full site audit` — Comprehensive technical audit across all site routes.

**Autonomous Multi-Agent Worker Fleet:**
- `seoOpportunityWorker` (`lib/agentic-engine/workers/seo-opportunity-worker.ts`) — Evaluates GSC query signals and creates `SeoTechnicalBrief`.
- `seoCopyWorker` (`lib/agentic-engine/workers/seo-copy-worker.ts`) — Generates 50-60 character titles, 140-155 character descriptions, and Answer-First FAQ blocks.
- `legalComplianceWorker` (`lib/agentic-engine/workers/legal-compliance-worker.ts`) — Enforces April 2026 statutory rates, SRA boundary disclaimers, and ASA/CAP Code rules.
- `seoActuatorWorker` (`lib/agentic-engine/workers/seo-actuator-worker.ts`) — Deploys validated optimizations to production and notifies Google Indexing API.

### B. `conversion-copywriter`
Specialist in high-converting, empathetic, legally accurate copy tailored to stressed UK employees.

**Key Commands to prompt the agent with:**
- `review copy [file]` — Audits copy against `.agents/rules/brand-standards.md` rules (no em dashes, active voice, plain UK English, "your employer pays the fees", no banned corporate buzzwords).
- `rewrite cta [page]` — Generates high-intent CTA copy (e.g., "Check my offer now →", "Calculate my estimate →").
- `faq [topic]` — Writes concise, answer-first FAQ accordions that qualify for Google Featured Snippets.

### C. `link-checker`
Automated deterministic link and route integrity verification.

**Terminal Command:**
```bash
npm run check:links
```
Scans all 58+ routes and 710+ internal links to verify:
- Zero 404 or broken internal links.
- Consistent trailing slashes (`trailingSlash: true` compliance to prevent 308 redirect lag).
- Inclusion in XML (`/sitemap.xml`) and HTML (`/sitemap/`) sitemaps.

### D. `sentinel-fleet`
Specialist autonomous background fleet managing SERP intelligence and 15-minute territorial SLA watchdog.

**Terminal Commands:**
```bash
npm run sentinel:serp  # Runs SERP Sentinel scan, checks climbers/droppers, AI Overviews, saves snapshot
npm run watchdog:sla   # Inspects lead locks, triggers failover cascade on expired 15-minute locks
```

### E. `legal-compliance-auditor`
Specialist in UK employment law, SRA regulatory boundaries, Section 203(3) ERA 1996 waiver validity, Equality Act 2010 Vento bands, TUPE, and protected conversations.

**Key Commands to prompt the agent with:**
- `audit legal [page or text]` — Verifies legal claims against primary statutes (legislation.gov.uk) and ACAS codes.
- `verify s203 [terms]` — Verifies draft settlement terms against the 6 conditions of Section 203(3) ERA 1996.
- `audit sra-boundary [copy]` — Confirms zero unauthorized practice of law and enforces statutory triage disclaimers.

### F. `tax-compliance-auditor`
Specialist in ITEPA 2003 Part 6 Chapter 3, HMRC Employment Income Manual (EIM12800–14000), Post-Employment Notice Pay (PENP s.402D), £30k exemption, and Class 1/1A NICs.

**Key Commands to prompt the agent with:**
- `audit tax [page or calculation]` — Scrutinizes simplified tax claims and checks compliance with HMRC EIM guidance.
- `calculate penp [params]` — Executes statutory PENP formula `((BP × D) / P) - T` to verify taxable notice pay.
- `check nic-rates [year]` — Audits employer Class 1A NIC (15.0% for 2026/27) and employee exemptions.

### G. `calculator-auditor`
Specialist in deterministic formula verification, IEEE boundary value analysis (BVA), and regression testing of statutory redundancy and tax calculation engines.

**Key Commands to prompt the agent with:**
- `test calculator [scenario]` — Runs deterministic test case against `lib/calculations.ts` using the `SC-T-000` schema.
- `audit boundaries` — Tests service cap (20 yrs), age multipliers, weekly pay caps (GB £751 vs NI £783), and compensatory caps (£123,543).

### H. `claims-privacy-auditor`
Specialist in ASA/CAP Code claim substantiation ("average settlement", "market data", "most employers"), UK GDPR, Special Category Data, and document privacy security.

**Key Commands to prompt the agent with:**
- `audit claims [page]` — Detects unsubstantiated statistics or marketing assertions and logs them in `unsupported-claims-register.md`.
- `audit privacy [pipeline]` — Inspects data retention, Supabase RLS, OTP flow, and third-party AI gateway data transmission.

### I. `forum-demand-researcher`
Specialist qualitative researcher mining real-world employee anxieties, settlement questions, and solicitor friction points from public forums (Reddit, MSE, Mumsnet).

**Key Commands to prompt the agent with:**
- `mine demand [topic]` — Extracts qualitative user demand evidence and builds structured entries for `forum-demand-matrix.md`.

### J. `stack-and-architecture`
Specialist in Next.js 14 App Router layout, Tailwind design tokens, typography, component hierarchies, and environment variables.

**Key Commands to prompt the agent with:**
- `check tokens [file]` — Audits CSS and Tailwind classes for brand token compliance (no arbitrary values).
- `verify env` — Verifies client vs server environment variable boundaries.

### K. `pages-and-components`
Specialist in UI component architecture, Calculator-to-Results URL query param contracts, CRO rules, and LeadForm state machines.

**Key Commands to prompt the agent with:**
- `audit cro [page]` — Checks above-the-fold value delivery, mobile responsiveness, and zero email gating.
- `verify contract [component]` — Validates search params contracts between Calculator and ResultsClient.

### L. `calculator-and-data`
Specialist in statutory calculation logic, April 2026 caps, verdict mathematical formulas, Supabase database schemas, and OTP security flow.

**Key Commands to prompt the agent with:**
- `audit rates` — Checks April 2026 statutory rates and caps across codebase.
- `verify otp flow` — Audits 3-state OTP pipeline and database mutation security.

---

## 3. Brand & Technical Hard Stops

- **Domain Canonical**: Always non-www (`https://settlementcheck.co.uk/`).
- **Trailing Slashes**: Always include trailing slashes on internal links (e.g. `/calculator/`, `/guides/`).
- **Brand Colors**: Navy `#0B1F3A`, Coral `#D9603B`, Off-white `#F7F4EE`. Never use green.
- **UK English**: "Solicitor" (not lawyer/attorney), "Redundancy" (not layoff), "Tribunal" (not court).
- **Legislation**: Cited to `legislation.gov.uk` (Employment Rights Act 1996, ITEPA 2003).

---

## 4. Zero-Assumption Engineering Protocol (Project Memory)

These rules are strictly binding on all AI pair programming sessions:

1. **Never Assume — Inspect First**:
   - Before writing or editing consuming code, adapters, or wrapper tools, ALWAYS use `view_file` or `grep_search` to inspect the actual exported functions, types, and parameter signatures in the target files (e.g. `lib/calculations.ts`, `lib/statutory-rates.ts`).
   - Never guess function names or interfaces from memory.

2. **No Phantom Redirects**:
   - Never add redirects to `next.config.js` for uncommitted, local-only, or newly created development routes.
   - Always run `git status` before writing redirects. 301 redirects are reserved solely for previously committed, published, or indexed URLs with live backlinks.

3. **SEO Intent & Emotional Framing Calibration**:
   - Before creating any route or directory in `app/`, verify the actual search query intent of UK employees.
   - Reject internal legal/corporate jargon (e.g. "audit") in favor of user-centric, empowering terms (e.g. "review", "check") that match brand identity (*SettlementCheck*).

4. **Deterministic Invariant Quality Gates (Change-Scoped & Token-Efficient)**:
   - All statutory calculations must remain pure TypeScript functions; AI agents must invoke them as tools rather than calculating approximations.
   - **Do NOT run verification commands on Q&A, research, planning, or discussion turns** where no project files were modified.
   - When files are modified, run **only** the check(s) relevant to the changed files (or run `npm run verify` once at the end of a multi-file change for a quiet 1-line summary):
     - TypeScript / component edits (`app/`, `components/`, `lib/`): `npx tsc --noEmit`
     - Route, navigation, or internal link edits: `npm run check:links`
     - Statutory formula, rate, or guardrail edits: `npm run test:evals`
     - Audit report edits (`docs/audit/`): `npm run lint:audit`
     - Full milestone / multi-domain check (quiet 1-line output): `npm run verify`

5. **Strict Audit Deliverables & Naming Invariants**:
   - All audit deliverables in `docs/audit/` must strictly use two-digit zero-padded prefixes (`phase-01a-`, `phase-01b-`, `phase-02-`, `phase-03-`, ... `phase-10b-`) to enforce deterministic alphabetical and chronological sorting across all OS file trees.
   - Ad-hoc, unpadded (`phase-1-`), or non-prefixed filenames are strictly prohibited.
   - Every markdown report's Line 1 H1 must strictly match `# Phase <ID> — <Title> Report`.
   - All references to other audit documents must be valid local file links.

6. **Evidence-Bounded Inter-Agent Protocol (EBIAP) & Zero-Fabrication Contract**:
   - **No Vanity Metrics**: Agents are strictly prohibited from generating hypothetical, estimated, or fabricated volume metrics (*"Over £XM evaluated"*, *"X,000 UK employees helped"*, *"4.9/5 satisfaction"*) as social proof.
   - **Default to Statute, Never Fiction**: When conversion psychology requires trust badges or reassurance, agents must **always** draw from verified statutory mechanisms (e.g., April 2026 statutory rates, £0 employee legal fee under Section 203(3) ERA 1996, 10-day ACAS Code 4 period, SRA-regulated panel network) rather than invented marketing metrics.
   - **The Coder Refusal Gate**: Coder agents must refuse to hardcode static string statistics or vanity counters unless backed by an authenticated SQL query / API endpoint or statutory constant in `lib/statutory-rates.ts`.
   - **Typed Handoff Schema**: All inter-agent work packages touching claims or copy must declare their `claimClassification` (`STATUTORY_INVARIANT` | `SYSTEM_TELEMETRY` | `REGULATORY_STATUS` | `PURE_UX_NAVIGATION`) and attach verifiable `substantiationProof` validated via `validateAgentHandoff()`.


