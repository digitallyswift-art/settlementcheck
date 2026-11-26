---
name: pages-and-components
description: UI component catalog, page routing contracts, Conversion Rate Optimization (CRO) rules, and LeadForm state machine for SettlementCheck.
---

# SettlementCheck — Pages & Components Skill

Component catalog, URL search param contracts, CRO layout rules, and user interaction states.

## 1. Component Map

| File | What it renders |
| :--- | :--- |
| `app/HomeClient.tsx` | Hero (pill + H1 + stats), How It Works, Trust, FAQ, CTA banner |
| `components/Calculator.tsx` | 6-field calculator card (salary, years, age, offer, reason, discrimination) |
| `components/LeadForm.tsx` | Lead capture form (first name, email, phone, contact time, consent) |
| `app/results/ResultsClient.tsx` | Verdict card, breakdown, discrimination flag, testimonial, lead form |
| `components/Nav.tsx` | Sticky nav, desktop links, mobile hamburger |
| `components/Footer.tsx` | Footer with statutory legal disclaimer |
| `components/FaqAccordion.tsx` | Accessible FAQ accordion (homepage and how-it-works page) |
| `components/PostcodeInput.tsx` | UK postcode lookup (`postcodes.io`); supports `id`, `variant` (`typeform` \| `boxed`), `initialValidLabel` |
| `app/for-solicitors/ForSolicitorsClient.tsx` | B2B solicitor panel sales page, sample statutory dossiers, and 2-step SRA registration wizard |
| `lib/calculations.ts` | `getVerdict()` - all calculator logic (do not duplicate) |

---

## 2. Calculator → Results URL Contract

The calculator submits to `/results/` with these query parameters:
`salary`, `years`, `age`, `offer`, `reason`, `discrimination`

`ResultsClient.tsx` reads these parameters, executes `getVerdict()`, and renders the verdict breakdown.

---

## 3. CRO Rules (Conversion Rate Optimization)

1. **Calculator is Hero**: Visible without scrolling on mobile devices above the fold.
2. **Value Before Commitment**: The statutory estimate and verdict are shown immediately *before* requesting any user contact details (never email gate the result).
3. **Employer Fee Reassurance**: "Your employer pays" appears in: hero subtext, stats bar (£0), result page, FAQ, and footer.
4. **Lead Form Simplicity**: Maximum 5 fields (first name, email, phone, preferred contact time, consent checkbox).
5. **Zero Lead Form on Homepage**: Lead capture is reserved for `/results/` after the user has received initial value.
6. **Factual Urgency**: 10-day ACAS reasonable timeframe referenced in subtext; no artificial countdown timers.
7. **Trust Signals Above Fold**: Statutory and regulatory anchors only (SRA-regulated panel · April 2026 statutory rates · Employer fee contribution standard under ERA 1996 s.203(3)). Never hardcode fabricated review scores or user-count vanity metrics.

---

## 4. Lead Form States (`ResultsClient`)

- **STATE 1 — Form Entry**: Validate inputs → `POST /api/send-otp` (triggers 6-digit code via Resend).
- **STATE 2 — OTP Verification**: 6-digit code entry, 60s resend countdown, "Wrong email? Go back" action.
- **STATE 3 — Success**: Green-free verified badge, "A specialist solicitor will contact you within 24 hours", no further action required.

---

## 5. Alternating Background Tokens

```text
bg-paper      #F7F4EE  — Hero, about, how-it-works sections
bg-paper-2    #EFEAE0  — Stats bar, trust section, FAQ (with border-y border-rule)
bg-card       #FFFFFF  — Card interiors
#0B1F3A                — CTA banner (Navy)
```

---

## 6. Verdict Badge Theme

| Verdict | Background | Border | Badge Text |
| :--- | :--- | :--- | :--- |
| `BELOW_MINIMUM` | `crimson-tint` | `crimson` | Action recommended |
| `BELOW_TYPICAL` | `amber-tint` | `amber` | Worth reviewing |
| `WITHIN_RANGE` | `sage-tint` | `sage` | Looks reasonable |
| `ABOVE_TYPICAL` | `sage-tint` | `sage` | Strong offer |

---

## 7. Shared Input & Form Contracts

- **`PostcodeInput`**:
  - Use `variant="boxed"` inside standard card forms (e.g. `/for-solicitors/`) and `variant="typeform"` (default) inside Typeform slides (`/get-matched/`, `EmployeeLeadTypeform`).
  - Always pass `id` paired with `<label htmlFor="...">`, and pass `initialValidLabel` when mounting with a pre-validated postcode so it renders as valid without re-fetching.
  - Keep `placeholder` concise (`e.g. M2 5PF`); never duplicate the example in helper text below the input.
  - Callback props (`onValidated`) are stored in refs internally to avoid infinite `postcodes.io` lookup loops.
- **Multi-Step Forms**: Wrap each step in `<form onSubmit>` with a `type="submit"` primary button, use `<fieldset>`/`<legend>` + `aria-pressed` for button option groups, and compute progress bar percentages from actual completed required fields.
