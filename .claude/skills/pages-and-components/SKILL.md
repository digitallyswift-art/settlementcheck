# Skill: Pages & Components

## Component map

| File | What it renders |
|------|----------------|
| `app/HomeClient.tsx` | Hero (pill + H1 + stats) · How It Works · Trust · FAQ · CTA banner |
| `components/Calculator.tsx` | 6-field calculator card (salary, years, age, offer, reason, discrimination) |
| `components/LeadForm.tsx` | Lead capture form — first name, email, phone, contact time, consent |
| `app/results/ResultsClient.tsx` | Verdict card · breakdown · discrimination flag · testimonial · lead form |
| `components/Nav.tsx` | Sticky nav, desktop links, mobile hamburger |
| `components/Footer.tsx` | Footer with legal disclaimer |
| `components/FaqAccordion.tsx` | FAQ accordion (used on homepage and how-it-works page) |
| `lib/calculations.ts` | `getVerdict()` — all calculator logic, do not duplicate |

## Calculator → Results URL contract

Calculator submits to `/results` with these search params:
`salary`, `years`, `age`, `offer`, `reason`, `discrimination`

ResultsClient reads params, calls `getVerdict()`, renders verdict.

## CRO rules (condensed)

1. Calculator is the hero — visible without scrolling on mobile
2. Value before commitment — estimate shown before any contact details requested
3. "Your employer pays" appears in: hero subtext, stats bar (£0), result page, FAQ, footer
4. Lead form max 5 fields: first name, email, phone, preferred time, consent checkbox
5. Never show the lead form on the homepage
6. 10-day deadline referenced in hero subtext — factual, no countdown timers
7. Trust signals above fold: ★★★★★ 4.9/5 · 2,400+ helped · SRA-regulated · £0 cost

## Lead form states (ResultsClient)

- **STATE 1** — form entry: validate → POST /api/send-otp
- **STATE 2** — OTP input: 6-digit code, 60s resend countdown, "wrong email? go back" link
- **STATE 3** — success: checkmark, "solicitor will contact you within 24 hours", no further action

## Page backgrounds (alternating sections)

```
bg-paper      #F7F4EE  — hero, about, how-it-works page
bg-paper-2    #EFEAE0  — stats bar, trust section, FAQ (with border-y border-rule)
bg-card       #FFFFFF  — card interiors
#0B1F3A                — CTA banner (navy, always inline style)
```

## Verdict badge colours

| Verdict | Background | Border | Badge text |
|---------|-----------|--------|------------|
| BELOW_MINIMUM | crimson-tint | crimson | Action recommended |
| BELOW_TYPICAL | amber-tint | amber | Worth reviewing |
| WITHIN_RANGE | sage-tint | sage | Looks reasonable |
| ABOVE_TYPICAL | sage-tint | sage | Strong offer |
