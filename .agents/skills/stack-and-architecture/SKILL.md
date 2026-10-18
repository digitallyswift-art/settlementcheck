---
name: stack-and-architecture
description: Technical architecture, Next.js 14 App Router layout, Tailwind CSS color tokens, font tokens, and development standards for SettlementCheck.co.uk.
---

# SettlementCheck — Stack & Architecture Skill

Technical stack guidelines, Next.js 14 App Router conventions, and design system tokens.

## 1. Actual Tech Stack (Installed Versions)

- **Framework**: Next.js 14.2.35 (App Router), React 18.3.1, TypeScript 6.0.3
- **Styling**: Tailwind CSS 3.4.19, PostCSS, Autoprefixer
- **Motion & Analytics**: framer-motion 11.18.2, @vercel/analytics 2.0.1
- **Backend / Data**: Supabase (`@supabase/supabase-js`), Resend (`resend`)

---

## 2. File & Route Structure

```text
app/
  layout.tsx              # Root layout, fonts, metadata
  page.tsx                # Thin shell → HomeClient
  HomeClient.tsx          # Full homepage (hero, stats, how-it-works, trust, FAQ, CTA)
  not-found.tsx
  disclaimer/page.tsx
  for-solicitors/page.tsx
  how-it-works/page.tsx
  privacy/page.tsx
  results/page.tsx        # Thin shell → ResultsClient
  results/ResultsClient.tsx
  terms/page.tsx
  guides/                 # Programmatic SEO pillar & spoke hubs
components/
  Calculator.tsx          # 6-field calculator widget (all inline styles + .calc-* classes)
  FaqAccordion.tsx
  Footer.tsx
  LeadForm.tsx            # Lead capture form with OTP verification
  Nav.tsx                 # Sticky nav with mobile menu
lib/
  calculations.ts         # getVerdict(), verdict types, currency formatting
  statutory-rates.ts      # April 2026 rates and statutory caps
  agentic-engine/         # In-code autonomous agents and orchestration
```

---

## 3. Tailwind Tokens — Strictly Enforced

Never use arbitrary values. Always use curated brand theme tokens:

**Colours:**
```text
ink / ink-2          #0B1F3A / #1A2F4E   — Headings, nav, primary text
paper / paper-2      #F7F4EE / #EFEAE0   — Page backgrounds, alternated sections
card                 #FFFFFF             — Card backgrounds
rule / rule-strong   #E2DCCE / #C9C0AC   — Borders, dividers
muted / muted-2      #5B6577 / #8A93A3   — Body text, labels
coral / coral-ink    #D9603B / #B14A28   — High-intent CTA buttons, accents
crimson              #A8341F             — Error states, below-minimum alert
```
*Hard stop*: **Never use green** anywhere on SettlementCheck.

**Typography & Spacing:**
- Spacing: `section` = 96px, `sectionSm` = 64px
- Radius: `xs` = 4px, `sm` = 6px, `md` = 10px, `lg` = 14px, `pill` = 999px
- Fonts: `font-serif` = Source Serif 4, `font-sans` = Inter, `font-mono` = JetBrains Mono

---

## 4. Key Engineering Invariants

1. **Client vs Server Components**: Interactive pages use `'use client'` at the top or are split into a server shell (`page.tsx`) + Client component (`*Client.tsx`).
2. **Calculator Query Parameter Contract**: Calculator submits to `/results/` with search params: `salary`, `years`, `age`, `offer`, `reason`, `discrimination`.
3. **Canonical Single Source of Truth**: All calculation logic must invoke `lib/calculations.ts` (`getVerdict()`). Never recreate formula logic inline.
4. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Server-side only in API routes; NEVER prefix with `NEXT_PUBLIC_`)
   - `RESEND_API_KEY` (Server-side only)
   - `NEXT_PUBLIC_APP_URL=https://settlementcheck.co.uk`
