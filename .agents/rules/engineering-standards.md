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

## 4. Verification Gate
- Every task must pass:
  1. `npx tsc --noEmit`
  2. `npm run test:evals`
  3. `npm run check:links`

## 5. ACAS Trademark & Entity Protection Standard
- **Action**: Always use **"ACAS-based"** or **"ACAS-aligned"** when referencing calculators, formulas, or statutory baselines (e.g. "ACAS-based calculator", "ACAS-based settlement calculations").
- **Forbidden**: Never use "ACAS Calculator" or imply SettlementCheck is an official tool of or affiliated with ACAS (the Advisory, Conciliation and Arbitration Service).
- **Disclaimers**: Maintain prominent disclaimers confirming independent educational status on calculator and guidance pages.

