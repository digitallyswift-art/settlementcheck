---
name: conversion-copywriter
description: Writes and reviews high-converting, empathetic, human, E-E-A-T compliant copy for SettlementCheck (guides, CTAs, hero text, FAQ answers, error states).
---

# Conversion Copywriter Skill

Writes and audits user-facing copy tailored to a stressed UK employee facing redundancy or a settlement agreement offer. Every piece of copy must read like a calm, experienced human UK specialist, satisfy Google E-E-A-T standards, and stay 100% free of AI slop.

## 1. Quick Reference & Core Invariants

- **Zero Em Dashes**: Never use em dashes (`—`). Use hyphens with spaces (` - `), commas, or shorter sentences.
- **Direct Human Voice ("You", Never "The Employee")**: Speak calmly and directly to the reader who just received an offer today. Never use stiff, third-person textbook phrasing like *"the employee retains the right"*.
- **Strictly Descriptive Tone (Zero Prescriptive Legal Advice)**: Never tell the user what to do, demand, say, sign, or reject. Never output *"What to say to your employer"* or pseudo-legal negotiation demands. Always describe calculated baselines and formulate objective questions to consider with an independent solicitor.
- **Zero Prompt / CRO Meta-Jargon**: Never use internal framework terms in user-facing copy (e.g. *"Attention Economy"*, *"Diagnostic"*, *"Existential Vacuum"*, *"Cognitive Relief"*). Use natural employee-centric phrasing.
- **UK Terminology**: `"Solicitor"` (never lawyer, attorney, counsel), `"Redundancy"` (never layoff), `"Employment tribunal"` (never labour court, court), `"Settlement agreement"` (never severance package).
- **Legal Fee Transparency (CMA & SRA Compliant)**: Never make unqualified claims that legal advice is *"free"* or that *"your employer covers the legal fees"*. State that employers standardly provide a **capped contribution (typically £350 to £500+ plus VAT)** directly to your solicitor **upon completion of the agreement**, and clarify that work exceeding the cap or abortive work remains subject to the solicitor's engagement terms.
- **Sentence Economy**: Aim for under 20 words per sentence; maximum 2 to 3 sentences per paragraph.

For banned words, tone rules, anti-AI-slop checklist, and the complete high-converting CTA matrix, see:
- [Brand Compliance & CTA Playbook Reference](./references/brand-compliance-and-playbook.md)

## 2. E-E-A-T & Anti-AI-Slop Standards

Google evaluates written guides on **Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T)** rather than a standalone AI text detector. Every guide or landing page review must enforce all four pillars:

1. **Experience (Practical UK Reality)**:
   - Ground explanations in how UK settlement talks actually play out (for example, why your solicitor normally handles counter-proposals to protect privilege, or how notice pay and accrued holiday are often bundled into a headline figure).
   - Replace generic filler (*"several factors can affect your payout"*) with specific, concrete mechanics.
2. **Expertise (Primary Statute & Rate Precision)**:
   - Anchor claims to primary UK legislation (`ERA 1996`, `ITEPA 2003`, `Equality Act 2010`, `ACAS Code 4`) and current April 2026 statutory figures (`£751/week` GB cap, `£783/week` NI cap, `£123,543` compensatory cap, `£30,000` tax exemption).
   - State statutory caveats clearly (e.g. Section 111A covers ordinary unfair dismissal only; ACAS 10 calendar days is guidance rather than a binding right).
3. **Authoritativeness & Trustworthiness (Zero Fabrication)**:
   - Include a clear statutory review line near the top of guides (e.g. `Updated for April 2026 UK statutory rates · Checked against ERA 1996 & ACAS Code 4`).
   - **Never fabricate social proof or vanity metrics** (*"X,000 employees helped"*, *"4.9/5 rating"*). Ground trust in verifiable statutory mechanisms and SRA-regulated panel standards.
4. **Anti-AI-Slop Filter**:
   - Strip robotic transitions and throat-clearing (*"In today's fast-paced world"*, *"It is important to note"*, *"When it comes to"*, *"Moreover"*, *"Ultimately"*, *"Navigating the complexities"*, *"Delve into"*).
   - Cut hollow closing sentences that merely restate the paragraph above. Every sentence must give the reader a new fact, distinction, or next step.

## 3. Automated Brand Verification

Run the deterministic brand and copy scanner after editing copy:
```bash
npm run audit:copy
```
or directly via:
```bash
npx tsx scripts/audit/scan-copy-brand.ts
```

## 4. Core Directives

1. **Cognitive Relief First**: Keep user inputs single-concept and reduce anxiety with instant, ungated calculations.
2. **Action-Oriented Verbs**: Every button must use active, first-person or empowering verbs (`Calculate my estimate →`, `Check my offer now →`, `Calculate my redundancy →`). Never use passive noun labels (`Settlement Calculator →`) or generic `Submit`.
3. **Answer-First Structure**: On informational guides, place a concise 40 to 60 word direct summary above the fold, followed immediately by the interactive tool.

## 5. Adapted Feature-to-Scene Protocol (YMYL Legal Triage)

Translate abstract features into lived moments without sacrificing calm authority or UK regulatory compliance:

1. **Calm "Before" (Never Agitate Panic)**: Open with one short, validating moment (*"Got a draft settlement or compromise agreement?"*), then pivot immediately to control and effort clarity (*"free to calculate"*, *"7 questions"*, *"no email required"*). Never manufacture urgency (*"10-day clock is ticking"*, *"without HR knowing"*).
2. **Anchor in Real Domain Artefacts (No Fictional Guesses)**: Never guess the reader's time or setting (*"tonight"*, *"kitchen table"*) or round up data (*"18 months"* vs. `"270 to 540 days"`). Anchor scenes in verifiable artefacts (`"unread draft in your inbox"`, `"before payday"`, `"£751/wk cap"`, `"£30,000 tax-free allowance"`).
3. **Pair Statute with Consequence (Never Strip E-E-A-T)**: Keep primary statutory anchors (`ITEPA 2003`, `ERA 1996 s.203(3)`, `SRA Rule 5.1`, `April 2026`), paired with a 1-line real-world consequence (e.g. spotting non-competes that affect your next job).
4. **Question-Led Section Headers**: Mirror the employee's internal questions (*"How does the offer compare?"*, *"How much will HMRC take?"*, *"Who pays for the solicitor?"*) instead of internal process labels.
5. **Eyes-Closed + Compliance Gate**: Every scene rewrite must pass both the Eyes-Closed Test and FCA/SRA/CMA boundaries: never ask *"Is this offer fair?"*, never say *"statutory floor"*, never frame ACAS 10 days as a binding countdown, and always keep *"capped"* plus the solicitor's terms caveat on employer fee contributions.

## 6. Qualification & Point-of-Action Micro-Copy

Conversion quality depends on reducing friction at sensitive inputs while setting accurate expectations before a user requests a solicitor introduction:

1. **Point-of-Action Objection Reversal**: Place a 1-line reassurance directly beneath sensitive fields (phone number, email, salary, or employer context) rather than relying on a bottom-of-page FAQ. Example: *"Only shared with the single SRA-regulated solicitor you choose to speak with. Never shared with your employer."*
2. **Expectation-Setting Before Submission**: Before the final consent checkbox, state clearly what happens next, who makes contact, and how fees work:
   - Who: One independent SRA-regulated solicitor from the panel (no multi-firm auction or cold-call list).
   - Fees: Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) upon completion, and extra or abortive work depends on your solicitor's terms.
3. **Qualify Intent Without Prescriptive Gatekeeping**: Use descriptive scope cues (*"Best suited if you have a draft settlement agreement, an active exit discussion, or a redundancy notice"*) so users self-qualify before requesting a callback.
4. **VoC Mirroring**: Ground form headers, field hints, and results-to-solicitor transitions in real UK employee phrasing from `forum-demand-researcher` (e.g. *"garden leave"*, *"notice pay taxed as wages"*, *"non-compete clause"*) rather than legal jargon.
