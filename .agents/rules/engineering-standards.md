# Zero-Assumption Engineering Protocol

Strict operational rules for all AI coding and architecting in SettlementCheck:

## 1. Never Assume — Inspect First
- **Action**: Always run `view_file` or `grep_search` on the source file to inspect exported names, function signatures, and types BEFORE writing consuming code, wrappers, or adapters.
- **Forbidden**: Never guess function names or interfaces from memory.

## 2. No Phantom Redirects
- **Action**: Always run `git status` before touching redirects in `next.config.js`.
- **Forbidden**: Never add a 301 redirect for a route that was only created in the local working tree and never pushed to `main` or indexed in search engines.

## 3. SEO & Cognitive Framing Calibration
- **Action**: Validate UK search queries and emotional resonance before creating any route directory.
- **Rule**: Stressed UK employees search for "review" or "check", not corporate "audit" agreements.

## 4. Verification Gate (Change-Scoped)
- **Skip on non-code turns**: Do not run verification commands on Q&A, planning, or research turns.
- **Run only what applies to the files touched** (or use `npm run verify` once at the end of a multi-file implementation for a single-line pass summary):
  1. `npx tsc --noEmit` — when `.ts` / `.tsx` files change
  2. `npm run test:evals` — when statutory rates, calculations, or agent guardrails change
  3. `npm run check:links` — when routes (`app/`), sitemaps, or internal links change
  4. `npm run lint:audit` — when files in `docs/audit/` change

## 5. ACAS Trademark & Entity Protection Standard
- **Action**: Always use **"ACAS-based"** or **"ACAS-aligned"** when referencing calculators, formulas, or statutory baselines (e.g. "ACAS-based calculator", "ACAS-based settlement calculations").
- **Forbidden**: Never use "ACAS Calculator" or imply SettlementCheck is an official tool of or affiliated with ACAS (the Advisory, Conciliation and Arbitration Service).
- **Disclaimers**: Maintain prominent disclaimers confirming independent educational status on calculator and guidance pages.

## 6. Root Domain Authority & Intent Invariant (Anti-Decoupling Law)
- **Principle**: The root domain (`/`) carries >95% of domain PageRank, backlink equity, and historical trust.
- **Strictly Forbidden**: NEVER decouple the root domain (`/`) from core transactional calculator keywords (e.g. "Settlement Agreement Calculator UK") under the guise of "de-cannibalization" or pivoting `/` to an abstract "institutional triage hub".
- **Rule**: De-cannibalization must be achieved via internal anchor text discipline, contextual comparison modules, and canonical hierarchy, NEVER by castrating or diluting the root domain's primary search intent.
- **Schema**: The root domain MUST retain `WebApplication` / `SoftwareApplication` structured data. Never downgrade to generic `Service` schema without keeping `WebApplication`.

## 7. SERP Pixel Budget & Jargon Guard
- **Title Budget**: 50 to 60 characters maximum (including ` | SettlementCheck`). Titles >60 characters will be truncated by Google desktop/mobile SERPs and are strictly prohibited.
- **Banned Consumer-Facing Jargon**: Never use administrative/corporate terms in SERP titles or meta descriptions: "Triage", "Platform", "Intake", "Dossier", "Workflow", "Audit".
- **Interactive Tool Standard**: Any interactive calculation tool (e.g., `/redundancy-calculator/`, `/settlement-agreement-tax-calculator/`) MUST explicitly include "Calculator" or "Calculate" in its `<title>` and `<h1>` to avoid zero-click informational abandonment. Never reduce a tool title to a static statutory descriptor (e.g., NEVER use "Redundancy Pay Cap 2026 (£751/wk)").


