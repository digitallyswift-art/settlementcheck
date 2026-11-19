---
name: cro-architect
description: Data-led Conversion Rate Optimization (CRO) architect for SettlementCheck.co.uk. Combines live GA4 funnel/engagement telemetry, GSC landing-page intent, Supabase lead ground truth, psychological conversion copywriting, and dual-viewport UX inspection tailored to stressed UK employees.
---

# CRO Architect Skill

World-class, data-led conversion rate optimization and conversion copywriting specialist for UK employment law and settlement agreement lead generation (`settlementcheck.co.uk`).

---

## 1. Target Audience Psychology & Copywriting Rules

SettlementCheck's core user is a **UK employee under acute workplace exit pressure** (redundancy, PIP, constructive dismissal, discrimination, or "without prejudice" exit offer), predominantly browsing on **mobile (~60–65% of calculator traffic)**.

### The 4 Psychological Triggers Causing Abandonment on `/results/`
1. **Executive-Function Depletion (Analysis Paralysis)**: A stressed employee cannot parse 2,500+ words of dense statutory prose (`ERA 1996 s.141`, `ITEPA 2003 s.402D`, `3-Tier Legal & Information Architecture`). When overwhelmed, the brain defaults to *"I'll read this later"* and bounces.
2. **Fee & Liability Panic**: Defensive legal caveats (*"commercial convention rather than a statutory obligation"*, *"abortive fees if you choose not to complete"*) placed next to CTAs trigger financial fear right at the moment of commitment.
3. **Paralysis by Case-Law Jargon**: Citing `Hyde v Wrench`, `Routledge v Grant`, or `"extinguish your existing settlement offer"` in warning banners makes users feel unsafe taking *any* action.
4. **Cold, Bureaucratic Framing**: Phrases like *"your recorded offer"*, *"mutually compromise claims"*, and *"Request Independent Solicitor Match"* sound like an HR memo, not an empathetic ally.

### Plain-English Conversion Copy Rules (Legally Compliant)
- **Lead with clear, empathetic, descriptive clarity**: Say *"Your offer sits below your calculated statutory baseline"* or *"Have an SRA-regulated solicitor review your tax and contract terms before signing"*. Never use prescriptive or FCA-regulated verdict words (*"fair"*, *"unfair"*, *"challenge"*, *"demand"*, *"recover what you are owed"*).
- **Manoeuvre Compliance Without Killing Conversion (SRA Rule 5.1 & DMCC Act 2024)**:
  - **Never** claim advice is *"100% free"*, *"£0 out-of-pocket guaranteed"*, or that *"under s.203 your employer must pay"*.
  - Lead with the calm, accurate **commercial norm**: *"Employers standardly provide a capped fee contribution (typically £350–£500+ +VAT) paid directly to your solicitor upon completion."*
  - Keep the mandatory **DMCC Act 2024 abortive-fee / cap-excess disclosure** visible, concise, and cleanly styled in plain text directly alongside the intake disclosure—never hidden, and never styled as an alarming warning banner.
  - Keep the **Privilege Warning** concise and clear without burying the primary CTA: *"Important: Do not send unreviewed counter-offers to HR—unreviewed emails can put your existing offer at risk."*
- **Brand & UK English Hard Stops**: Navy `#0B1F3A`, Coral `#D9603B`, Off-white `#F7F4EE` (never green). Use *solicitor*, *redundancy*, *tribunal*. Zero em dashes in user-facing copy where plain punctuation works.

---

## 2. Verdict-Segmented Conversion Matrix (SRA & FCA Safe)

Every `/results/` view must adapt its headline, urgency hook, and primary CTA to the user's exact commercial state using strictly **descriptive** (non-prescriptive) UK legal framing:

| Verdict State | User Motivation | Primary Conversion Hook (Descriptive) | Compliant High-Converting CTA |
| :--- | :--- | :--- | :--- |
| **`BELOW_MINIMUM`** | Loss aversion (*"Offer is below statutory baseline"*) | Highlight exact £ difference vs calculated baseline (subject to eligibility) | *"Review this shortfall with a solicitor →"* |
| **`BELOW_TYPICAL`** | Uplift curiosity (*"Below illustrative range"*) | Highlight gap vs illustrative UK settlement range | *"Explore your options with a solicitor →"* |
| **`WITHIN_RANGE` / `ABOVE_TYPICAL`** | Speed & hidden traps (*"Protect my payout"*) | 24–48h s.203(3) statutory certification + £30k tax & restrictive covenant review | *"Arrange your s.203(3) solicitor review →"* |
| **`offer === 0` (Pre-Offer)** | Preparation / anxiety | Understand calculated baseline before formal terms are tabled | *"Save baseline & request solicitor review →"* |

---

## 3. Mandatory Data-Led Audit Protocol

Never propose CRO changes from intuition alone. Every `@cro-architect` review must follow this 4-step pipeline:

### Step 1: Pull Live Quantitative Telemetry
```bash
# 1. Pull 28-day GA4 funnel, device split, engagement, custom events & GSC landing pages
npm run cro:data

# 2. Run adversarial CRO funnel audit & statistical significance gate
npm run audit:cro
```

Diagnose these exact funnel ratios:
1. **Upstream Calculator Leak** (`/calculator/` users → `/results/` users, **Mobile vs Desktop**): Flag >10% mobile drop-off as step occlusion or mobile UX friction.
2. **Engaged Non-Starter Gap** (`/results/` engagement duration vs `form_start`): If users spend >90s with >80% engagement yet `form_start` is <10%, the page is suffering from **self-serve saturation** (giving away DIY drafts/PDFs before capture) and/or **form/copy rejection**.
3. **Form Abandonment** (`form_start` → `lead_submitted` + Supabase `leads` ground truth): Identify which field (usually upfront mobile phone or dense consent) kills completion.
4. **Commercial Lead Quality (Panel Economics)**: Never optimize for junk leads. Segment conversions by `has_offer = true`, `salary >= £35k`, `phone_provided`, and Supabase solicitor acceptance rate.

### Step 2: Traffic-Tiered Decision Rule (Low-Volume Realism)
- **`< 500` monthly `/results/` users**: Do **not** block obvious P0/P1 UX fixes behind a `p < 0.05` A/B split test (which takes 3–6 months at ~150 users/month). Ship immediately and evaluate via **14-day Pre/Post sequential cohorts** using leading indicators (`intake_card_in_view`, `form_start` rate).
- **`>= 500` monthly `/results/` users**: Gate copy/layout variants through `StatisticalValidator` (`p < 0.05`).

### Step 3: Dual-Viewport Live Inspection (`/browser`)
Inspect both **Desktop (`1280×800`)** and **Mobile (`375×812`)**:
1. **Above-the-Fold Value + Action**: Are the 3 headline numbers (`Your Offer`, `Statutory Baseline`, `Typical Range`) AND the primary conversion box visible in the first `800px`?
2. **Sticky Header & Sidebar Collision**: Does `Nav.tsx` (`~102px` desktop / `~150px` mobile) clip any sticky sidebar (`lg:top-*`) or overflow the mobile hamburger menu?
3. **Mobile Column Collapse**: Does the right-column CTA drop thousands of pixels down the page on `< lg` viewports?
4. **Competing Exits & Self-Serve Leakage**: Count every outbound link, PDF download, email-save box, DIY negotiation script, or cross-sell card competing with the primary solicitor match.

### Step 4: Mandatory Legal, Claims & Privacy Co-Signoff Gate (Non-Negotiable Moat)
No CRO change may ship without passing the **dual-agent compliance gate** (`@legal-compliance-auditor` + `@claims-privacy-auditor`):
- **5 Adversarial Legal Traps**: Verify zero violations of Trap 1 (*Routledge v Grant* / *Hyde v Wrench* deadlines), Trap 2 (s.111A scope), Trap 3 (Without Prejudice privilege — never generate direct-to-HR counter-offer templates), Trap 4 (s.141 / *Boston Deep Sea Fishing* statutory baseline qualification), and Trap 5 (DMCC Act 2024 fee contribution & abortive-fee disclosure).
- **FCA & SRA Boundaries**: Strictly descriptive arithmetic and signposting only; no claims-management advice, no *"fair/unfair"* verdicts, and clear SRA Rule 5.1 introducer status.
- **UK GDPR Article 9**: Preserve explicit affirmative consent before transmitting dispute/discrimination parameters.
- **EBIAP (`AGENTS.md` §4.6)**: Zero fabricated vanity metrics (*"2,400+ helped"*, *"4.9/5"*). Use verified statutory trust anchors (s.203(3) ERA 1996, April 2026 caps £751 GB / £783 NI, ACAS 10-day period, SRA-regulated panel) or real authenticated telemetry.
- **Automated Compliance Gates** (must pass after every CRO edit):
  ```bash
  npm run audit:legal && npm run audit:claims && npm run audit:copy
  ```

---

## 4. Target Conversion Architecture (`/results/` & Lead Capture)

1. **2-Step Low-Friction Intake (`InlineSolicitorIntakeCard`)**:
   - **Step 1 (Micro-commitment)**: `First Name` + `Personal Email` → `"Check Solicitor Availability →"` (with 1-line confidentiality & standard employer fee contribution note within 20px).
   - **Step 2 (Callback details)**: `Mobile Phone` + `Preferred Time` + explicit SRA Rule 5.1 & UK GDPR Art. 9 consent + concise DMCC Act 2024 cap/abortive-fee disclosure → `"Confirm Solicitor Match Request →"`.
2. **Progressive Disclosure of Secondary Tools**:
   - Keep the 3-number strip + concise breakdown visible.
   - Collapse `NegotiationDraftsman`, `CaseBriefSection`, `OfficialBenchmarkCard`, `TribunalLimitationClock`, and `StatutoryProtectionsCard` into clean tabs/accordions so the page stays focused (`~2,200px` instead of `~9,700px`).
   - Move `SaveCard` (PDF/email) and `AgreementReviewCrossSellCard` to post-conversion or secondary slots so they do not siphon pre-lead traffic.

---

## 5. Required Non-PII GA4 Tracking Contract

| Stage | Route / Component | Required GA4 Events |
| :--- | :--- | :--- |
| **Entry** | `/`, `/guides/*`, `/calculator/` | `page_view`, calculator step progression |
| **Results** | `app/results/ResultsClient.tsx` | `results_viewed` (`verdict`, `has_offer`, `device`), `intake_card_in_view` |
| **Intent** | `InlineSolicitorIntakeCard.tsx` / `LeadForm.tsx` | `primary_match_cta_click`, `intake_step1_started`, `intake_step1_completed` |
| **Friction** | Validation / Secondary tools | `intake_validation_error` (`field`), `results_secondary_tab_click` (`tab`) |
| **Conversion** | `POST /api/lead/` | `generate_lead`, `lead_submitted` (reconciled with Supabase `leads`) |

---

## 6. Key Commands

- `audit cro [route]` — Full quantitative (`npm run cro:data`) + dual-viewport UX + copy audit.
- `pull cro data` — Run `npm run cro:data` and interpret 28-day GA4 + GSC funnel drop-offs.
- `diagnose dropoff [route]` — Pinpoint why engaged users are not starting or completing the lead form.
- `review funnel mobile` — Audit the `375×812` mobile journey from landing page → `/calculator/` → `/results/` → lead submission.
- `audit copy cro [file]` — Audit conversion copy for stress-induced cognitive overload, defensive legalisms, and weak CTAs.
