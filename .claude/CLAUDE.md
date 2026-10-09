# SettlementCheck — Project Brief

**Product:** UK settlement agreement calculator + solicitor-matching platform.  
**Revenue:** Solicitors pay per-lead or monthly subscription for pre-qualified employee enquiries.  
**Stack:** Next.js 14.2.35 (App Router), TypeScript 6, React 18.3, Tailwind CSS 3.4, Vercel.  
**Domain:** settlementcheck.co.uk — deployed via Vercel, repo: github.com/digitallyswift-art/settlementcheck

---

## Current phase — October 2026

**Done:** 
- Core structure & programmatic SEO tools: Homepage, Results, Core Calculator, Redundancy, Unfair Dismissal, Constructive Dismissal, Tax Calculator, Agreement Review Tool.
- Hub & Spoke Content Architecture: 20+ pillar and spoke guides covering statutory redundancy, negotiation, ACAS procedures, and tax rules under April 2026 statutory rates (£751/wk, SI 2026/310).
- GEO / AI Overviews Defense: Deployed structured Answer-First `Statutory Quick Answer` citation blocks across all core pillar guides adhering to the Attention Economy Framework.
- Striking Distance Optimization: Calibrated Homepage H1/metas, core calculator metadata, and compromise agreement hub targeting Page 1 Top 3 positions.
- Protective Award Expansion: Launched `/protective-award-calculator/` with pure 90-day calculation engine under TULRCA 1992 s.189, upgraded `/guides/protective-award/`.
- Backend Security & Lead Infrastructure: Hardened `/api/lead` with server-side OTP verification against `otp_codes` before database insertion (`email_verified: true`).
- Performance Tracking: Full historical search log and keyword monitoring tracked in `data/PERFORMANCE_LOG.md`.

**Next:** 
- Monitor 14-day velocity and rankings for striking distance keywords and protective award queries.
- Solicitor panel onboarding and commercial funnel monetization.

---

## Hard stops — never do these

- Do NOT use `output: 'export'` in next.config.js — API routes require a full Next.js server
- Do NOT call Resend or use `SUPABASE_SERVICE_ROLE_KEY` from client-side code — server-side only
- Do NOT submit a lead to Supabase before OTP is verified
- Do NOT prefix `RESEND_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`
- Do NOT use arbitrary Tailwind values — use theme tokens only (see stack skill)
- Do NOT add more than 5 fields to the lead capture form
- Do NOT show the lead form before the calculator result (value before commitment)
- Do NOT use green — brand uses navy `#0B1F3A`, coral `#D9603B`, off-white `#F7F4EE`
- Do NOT assume exports or function signatures — inspect target files with `view_file` before writing code
- Do NOT add redirects in next.config.js for uncommitted, local-only, or newly created routes

---

## Dev commands

```bash
npm run dev       # start local dev server at localhost:3000
npm run build     # production build
git add <files> && git commit -m "..." && git push origin main
```

---

## Skills — load when relevant

- `.claude/skills/stack-and-architecture/SKILL.md` — tech stack, file structure, Tailwind tokens, patterns
- `.claude/skills/calculator-and-data/SKILL.md` — statutory rates, verdict logic, Supabase schema, OTP flow
- `.claude/skills/pages-and-components/SKILL.md` — component map, CRO rules, lead form states
- `.claude/skills/seo-architect.md` — SEO methodology, audit steps, keyword tiers, meta formulas, E-E-A-T rules

## Agents — invoke by name

- `conversion-copywriter` — any user-facing copy, CTAs, error states, FAQ, email templates
- `seo-architect` — SEO audits, metadata, canonical URLs, structured data, OG tags, content gaps, keyword targeting
  - Agent file: `.claude/agents/seo-architect-agent.md`
  - Skill file: `.claude/skills/seo-architect.md` (read first, always)
  - Read both files before any SEO, content, or meta tag task
  - Trigger commands: `audit [page]`, `quick audit [page]`, `meta [page]`, `gaps`, `snippet [query]`, `schema [page type]`, `statutory check [text]`, `content [topic]`, `full site audit`
