---
name: journey-architect
description: End-to-end user journey and personalised form orchestrator for SettlementCheck.co.uk. Ensures frictionless continuity across /guides/*, /calculator/, /results/, /get-matched/, and /settlement-agreement-review/ by combining wondelai/skills (cro-methodology, conversion-optimization), marketingskills (cro + references/form.md, onboarding), and SettlementCheck's statutory & regulatory guardrails.
---

# Journey Architect Skill

Orchestrates **cross-route funnel continuity** and **consistent yet personalised form journeys** for stressed UK employees from first guide visit through to solicitor match submission.

---

## 1. Skill Stack & Routing

Always combine the right specialist skill for the layer you are auditing or building:

| Layer | Skill to Load | Responsibility |
| :--- | :--- | :--- |
| **End-to-End Flow** | `journey-architect` (this skill) | Cross-route state continuity, zero re-entry, topic-to-form personalisation |
| **Form Mechanics** | `cro` + [form.md](../cro/references/form.md) | Field reduction, progressive disclosure, inline validation, mobile ergonomics |
| **Time-to-Value** | `onboarding` + [minimum-path-to-value.md](../onboarding/references/minimum-path-to-value.md) | Minimum Path to Value (MPTV), momentum, zero premature gates |
| **Scientific Audit** | `cro-methodology` + `cro-architect` | Clarity, relevance, friction, anxiety, live GA4/GSC telemetry (`npm run cro:data`) |
| **Funnel Orchestration** | `conversion-optimization` | 7-phase diagnostic & experiment logging for leaking flows |
| **Tracking & UTMs** | `tracking-analytics` | Outbound UTMs (`lib/utm.ts`), B2C vs B2B lead separation, GA4 events |
| **Compliance Gate** | `legal-compliance-auditor` + `claims-privacy-auditor` | SRA Rule 5.1, DMCC Act 2024, UK GDPR Art. 9, EBIAP (`AGENTS.md` §4.6) |

---

## 2. Canonical `JourneyContext` Contract

Every transition (`Guide → Calculator → Results → Form` or `Guide → Review → Form`) must preserve user-supplied data and guide intent so a stressed employee **never has to re-enter information**:

- **URL Query Parameters (Canonical)**:
  - `salary` (number)
  - `years` / `yearsNum` (number — also accept legacy `tenure` on ingress)
  - `months` / `monthsNum` (number)
  - `age` (number)
  - `offer` (number)
  - `reason` (canonical dispute reason — also accept legacy `dispute` on ingress)
  - `discrimination` (`yes` | `no`)
  - `jurisdiction` (`GB` | `NI`)
  - `sourceGuide` (guide slug, e.g. `pip-settlement`, `tax-free-settlement-30000`)
- **Rule**: Any embedded guide widget (`EmbeddedCalculatorCard`, `StickyMobileCta`, `ReviewCallout`, `InteractiveToolHook`) must pass `reason` and `sourceGuide` when linking into `/calculator/`, `/get-matched/`, or `/settlement-agreement-review/`.

---

## 3. Consistent Yet Personalised Form Architecture

1. **One Canonical Submission Mechanic**:
   - **Step 1 (Low-friction micro-commitment)**: `First Name` + `Email` (with calm 1-line confidentiality & standard employer contribution reassurance).
   - **Step 2 (Callback & Statutory Consent)**: `Mobile Phone` + `Preferred Time` (`Morning` | `Afternoon` | `Evening`) + explicit SRA Rule 5.1 & UK GDPR Art. 9 consent + concise DMCC Act 2024 cap/abortive-fee disclosure.
   - **Never** gate `/results/` behind email or OTP before showing the statutory calculation.

2. **Personalised Framing Layer (`guideTopic × verdict × hasOffer`)**:
   - Keep the form structure identical across routes, while adapting the **headline, reassurance bullet, pre-filled context pill, and CTA** to match what the user just read and calculated:
     - **`BELOW_MINIMUM`**: Highlight exact £ shortfall vs calculated statutory baseline → *"Review this £X gap with a solicitor →"*
     - **`BELOW_TYPICAL`**: Highlight illustrative range gap & tax-free split → *"Explore your options with a solicitor →"*
     - **`WITHIN_RANGE` / `ABOVE_TYPICAL`**: Highlight 24–48h s.203(3) statutory sign-off, £30k tax split, and restrictive covenants → *"Arrange your s.203(3) solicitor review →"*
     - **`offer === 0` (Pre-Offer)**: Highlight preparation before formal terms arrive → *"Save baseline & request solicitor review →"*
     - **Topic overlays** (when arriving from a guide):
       - `pip` → Notice pay, PILON, and performance-exit terms
       - `discrimination` / `maternity` / `whistleblowing` → Potential uncapped Equality Act / statutory claims & UK GDPR Art. 9 protection
       - `tax` / `pilon` → £30,000 ITEPA 2003 s.403 exemption & PENP s.402D split
       - `draft_review` → s.203(3) ERA 1996 independent advice & fee contribution check

---

## 4. Non-Negotiable Journey & Compliance Guardrails

- **No Vanity Metrics (`AGENTS.md` §4.6)**: Never fabricate user counts or ratings; anchor trust in statutory mechanisms (s.203(3) ERA 1996, April 2026 caps £751 GB / £783 NI, ACAS 10-day period, SRA-regulated panel).
- **Descriptive UK English Only**: Never use *"fair"*, *"unfair"*, *"demand"*, or *"challenge"* in CTAs or sticky banners. Use *solicitor*, *redundancy*, *tribunal*.
- **Mobile-First (`375×812`)**: Primary CTA visible without scrolling past 2,500 words of legal prose; `StickyMobileCta` on `/guides/*` must be topic-aware and compliant.
- **Post-Edit Gates**:
  ```bash
  npx tsc --noEmit
  npm run check:links
  npm run audit:legal && npm run audit:claims && npm run audit:copy
  ```

---

## 5. Key Commands

- `audit journey [route|slug]` — Audits the full path from entry page → calculator → results → form submission for context drops, field friction, and compliance.
- `personalise form [topic]` — Generates compliant `(guideTopic × verdict)` form framing copy using `cro/references/form.md` and `conversion-copywriter`.
