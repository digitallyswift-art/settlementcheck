---
name: legal-compliance-auditor
description: Specialized legal compliance auditor for UK employment law, SRA regulatory boundaries, Section 203 ERA 1996, and statutory invariants.
---

# Legal Compliance Auditor Skill

Specialist auditor in UK employment law, statutory invariants, Employment Rights Act 1996, SRA regulatory boundaries, and ACAS codes.

## 1. Quick Reference & Core Invariants (April 2026)

- **GB Weekly Pay Cap**: **£751/week** (ERA 1996 s.227; SI 2026/310).
- **NI Weekly Pay Cap**: **£783/week** (ERO(NI) 1996; SR 2026).
- **Unfair Dismissal Compensatory Cap**: **£123,543** (or 52 weeks' actual pay).
- **Statutory Redundancy Maximum**: 20 years service cap. Max GB = £22,530; Max NI = £23,490.
- **Vento Injury to Feelings (2026/27)**: Lower (£1,300–£12,600), Middle (£12,600–£37,700), Upper (£37,700–£62,900), Exceptional (>£62,900).
- **ACAS Offer Consideration Benchmark**: **10 calendar days minimum** (ACAS Code of Practice 4).

For complete statutory citations, case law, and Section 203(3) conditions, see:
- [Primary Legal Authorities & Statutory References](./references/primary-statutes-and-vento.md)

## 2. Core Audit Directives

1. **Verify Statutory Caps & Sections**:
   - Check all citations against `legislation.gov.uk` primary text.
   - Enforce 2-year service threshold for ordinary unfair dismissal and statutory redundancy pay.
   - Ensure collective redundancy protective awards cite up to 90 days (TULRCA 1992 s.189).
2. **Audit SRA Phrasing & Regulatory Boundary**:
   - Flag forbidden phrases: *"we advise you to"*, *"our legal advice is"*, *"as your solicitor"*.
   - Confirm mandatory SRA Section 203(3) disclaimer is present on all advisory content.
3. **Automated Verification**:
   - Run deterministic CLI disclaimer scanner: `node scripts/audit/scan-legal-disclaimers.mjs`.
4. **Structured Output**:
   - Register all findings using standard Finding ID (`SC-E-000`) and log in the shared evidence bus.
