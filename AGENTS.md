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
Scans all 46+ routes and 530+ internal links to verify:
- Zero 404 or broken internal links.
- Consistent trailing slashes (`trailingSlash: true` compliance to prevent 308 redirect lag).
- Inclusion in XML (`/sitemap.xml`) and HTML (`/sitemap/`) sitemaps.

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
     npx tsc --noEmit     # 0 TypeScript type errors
     ```

