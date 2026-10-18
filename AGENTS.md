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
  - Any file or directory (e.g., `@app/sitemap.ts`, `@components/Nav.tsx`).
- **Trigger Actions with `/`**: Type `/` to run built-in actions:
  - `/plan` — Create a structured step-by-step roadmap before executing large SEO or feature migrations.
  - `/goal` — Run thorough multi-step background optimization and validation tasks.
  - `/grill-me` — Interactive interview to clarify design, copy, or technical decisions before building.

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

### B. `conversion-copywriter`
Specialist in high-converting, empathetic, legally accurate copy tailored to stressed UK employees.

**Key Commands to prompt the agent with:**
- `review copy [file]` — Audits copy against `.claude/BRAND.md` rules (no em dashes, active voice, plain UK English, "your employer pays the fees", no banned corporate buzzwords).
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

4. **Deterministic Invariant Quality Gates**:
   - All statutory calculations must remain pure TypeScript functions; AI agents must invoke them as tools rather than calculating approximations.
   - Before completing tasks, always run and pass:
     ```bash
     npm run test:evals   # 100% statutory and brand guardrail compliance
     npm run check:links  # 0 broken routes and strict trailing-slash enforcement
     npm run lint:audit   # 100% audit artifact naming, header, and link compliance
     npx tsc --noEmit     # 0 TypeScript type errors
     ```

5. **Strict Audit Deliverables & Naming Invariants**:
   - All audit deliverables in `docs/audit/` must strictly use two-digit zero-padded prefixes (`phase-01a-`, `phase-01b-`, `phase-02-`, `phase-03-`, ... `phase-10b-`) to enforce deterministic alphabetical and chronological sorting across all OS file trees.
   - Ad-hoc, unpadded (`phase-1-`), or non-prefixed filenames are strictly prohibited.
   - Every markdown report's Line 1 H1 must strictly match `# Phase <ID> — <Title> Report`.
   - All references to other audit documents must be valid local file links.


