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

## 8. Form, Shared-Input & Sample-Data Invariants
- **No Unstable Callbacks in Fetch Effects**: Never put callback props (`onValidated`, `onChange`) directly in a `useEffect` dependency array that triggers network requests or debounced lookups. Store them in a `useRef` and track the last validated normalised value to prevent infinite fetch loops or redundant re-fetches when sibling fields change.
- **Inspect Shared Inputs Before Passing Copy or Styles**: Before passing `placeholder` or helper text to a shared component (e.g. `PostcodeInput`), read the component to verify it does not prepend `e.g.` or duplicate the placeholder, and match its visual variant (`boxed` vs `typeform`) to sibling inputs in the same card.
- **Semantic Form & Keyboard Accessibility**: Wrap every form step in `<form onSubmit>` with a `type="submit"` primary CTA so `Enter` works; pair every `<label>` with `htmlFor`/`id`; use `<fieldset>`/`<legend>` and `aria-pressed` for button-based radio/option groups.
- **Truthful Progress Bars**: Compute progress from actual completed fields or completed steps (never display `50% complete` on an empty Step 1).
- **Zero Hand-Estimated Statutory Examples**: Every worked example or B2B sample dossier showing statutory redundancy or tax splits MUST be verified against ERA 1996 s.162 (exact age-band multipliers `0.5× / 1.0× / 1.5×`, April 2026 £751/wk cap) and ITEPA 2003 s.402D/s.403 (PILON is always taxable as earnings and never uses the £30,000 s.403 exemption).


