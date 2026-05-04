# Skill: Stack & Architecture

## Actual tech stack (installed versions)

- Next.js 14.2.35, React 18.3.1, TypeScript 6.0.3
- Tailwind CSS 3.4.19, PostCSS, Autoprefixer
- @vercel/analytics 2.0.1, framer-motion 11.18.2
- **Not yet installed:** @supabase/supabase-js, resend, @fontsource/inter

## File structure (as built)

```
app/
  layout.tsx              root layout, fonts, metadata
  page.tsx                thin shell → HomeClient
  HomeClient.tsx          full homepage (hero, stats, how-it-works, trust, FAQ, CTA)
  not-found.tsx
  disclaimer/page.tsx
  for-solicitors/page.tsx
  how-it-works/page.tsx
  privacy/page.tsx
  results/page.tsx        thin shell → ResultsClient
  results/ResultsClient.tsx
  terms/page.tsx
components/
  Calculator.tsx          6-field calculator widget (all inline styles + .calc-* CSS classes)
  FaqAccordion.tsx
  Footer.tsx
  LeadForm.tsx            lead capture (currently posts to Formspree placeholder — needs Supabase)
  Nav.tsx                 sticky nav with mobile hamburger
lib/
  calculations.ts         getVerdict(), verdict types, currency formatting
```

## Tailwind tokens — always use these, never arbitrary values

**Colours:**
```
ink / ink-2          #0B1F3A / #1A2F4E   — headings, nav, buttons
paper / paper-2      #F7F4EE / #EFEAE0   — page backgrounds
card                 #FFFFFF             — card backgrounds
rule / rule-strong   #E2DCCE / #C9C0AC   — borders, dividers
muted / muted-2      #5B6577 / #8A93A3   — body text, labels
coral / coral-ink    #D9603B / #B14A28   — CTA buttons, accents
crimson              #A8341F             — error states
```

**Spacing:** `section` = 96px, `sectionSm` = 64px  
**Radius:** `xs`=4px, `sm`=6px, `md`=10px, `lg`=14px, `pill`=999px  
**Fonts:** `font-serif` = Source Serif 4, `font-sans` = Inter, `font-mono` = JetBrains Mono

## Key patterns

- Pages that need interactivity: `'use client'` at top, or split into server shell + Client component
- Calculator passes results to `/results` via URL search params (salary, years, age, offer, reason, discrimination)
- CSS classes `.calc-*` and `.sc-*` are defined in `app/globals.css` — prefer these over inline styles for new additions
- `getVerdict()` in `lib/calculations.ts` is the single source of truth for all calculator logic
- No external state management — useState + useRouter only

## Environment variables (when Supabase/Resend are added)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      ← server-side only, never NEXT_PUBLIC_
RESEND_API_KEY                 ← server-side only, never NEXT_PUBLIC_
NEXT_PUBLIC_APP_URL=https://settlementcheck.co.uk
```
