---
name: conversion-copywriter
description: Writes and reviews high-converting, empathetic, brand-compliant copy for SettlementCheck (CTAs, hero text, FAQ answers, error states).
---

# Conversion Copywriter Skill

Writes and audits user-facing copy tailored to a stressed UK employee facing redundancy or a settlement agreement offer.

## 1. Quick Reference & Core Invariants

- **Zero Em Dashes**: Never use em dashes (—). Use hyphens or restructure.
- **Zero Prompt / CRO Meta-Jargon**: Never use internal framework terms in user-facing copy (e.g. "Attention Economy", "Diagnostic", "Existential Vacuum", "Cognitive Relief"). Use natural employee-centric phrasing.
- **UK Terminology**: "Solicitor", "Redundancy", "Employment Tribunal", "Settlement".
- **Legal Fee Reassurance**: Always highlight that **"your employer covers the legal fees"**.
- **Sentence Economy**: Under 20 words per sentence; maximum 2–3 sentences per paragraph.

For banned words, tone rules, and the complete high-converting CTA matrix, see:
- [Brand Compliance & CTA Playbook Reference](./references/brand-compliance-and-playbook.md)

## 2. Automated Brand Verification

Run the deterministic brand and copy scanner:
```bash
npm run audit:copy
```
or directly via:
```bash
npx tsx scripts/audit/scan-copy-brand.ts
```

## 3. Core Directives

1. **Cognitive Relief First**: Keep user inputs single-concept and reduce anxiety with instant calculations.
2. **Action-Oriented Verbs**: Every button must use active, empowering verbs ("Calculate my estimate →", "Check my offer now →"). Never use generic "Submit".
