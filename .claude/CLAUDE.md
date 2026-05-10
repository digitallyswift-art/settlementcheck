# SettlementCheck — Project Brief

**Product:** UK settlement agreement calculator + solicitor-matching platform.  
**Revenue:** Solicitors pay per-lead or monthly subscription for pre-qualified employee enquiries.  
**Stack:** Next.js 14.2.35 (App Router), TypeScript 6, React 18.3, Tailwind CSS 3.4, Vercel.  
**Domain:** settlementcheck.co.uk — deployed via Vercel, repo: github.com/digitallyswift-art/settlementcheck

---

## Current phase — May 2026

**Done:** 
- Core structure: Homepage, results page, calculator component, mobile layout.
- Phase 1 SEO Strategy: Refactored `HomeClient` and created programmatic SEO landing pages (`/redundancy-calculator`, `/unfair-dismissal-calculator`, `/constructive-dismissal-calculator`).
- Phase 2 SEO Strategy: Initiated Hub & Spoke content model. Created the "How to Negotiate a Settlement Agreement" guide using modern, visually appealing layout components (UI callouts, numbered timelines, no walls of text). 
- Brand Guidelines updated: Enforced strict visual design rules and highly readable, factual UK-targeted language for all future AI content generation.
- Component Refactoring: Made `FaqAccordion` dynamic and standard across all guides. Updated Footer and Nav for optimized internal linking.
**Next:** 
- Content Expansion: Generate additional core pillar guides using the newly established visual layout and copy rules.
- Backend Infrastructure: Supabase integration, Resend OTP email verification, lead capture data layer.  
**Not started:** API routes (`/api/send-otp`, `/api/verify-otp`), Supabase schema, Framer Motion animations.

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
