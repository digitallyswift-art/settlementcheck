---
name: tax-compliance-auditor
description: Specialized UK employment tax auditor for settlement agreements, ITEPA 2003, HMRC Employment Income Manual, PENP, and National Insurance.
---

# Tax Compliance Auditor Skill

Specialist auditor in UK employment taxation, ITEPA 2003, HMRC manuals, Post-Employment Notice Pay (PENP), Class 1/1A NICs, and termination payment exemptions.

## 1. Quick Reference & Core Tax Invariants (2026/27)

- **Termination Tax-Free Floor**: **£30,000** under ITEPA 2003 s.403 (genuine compensation & statutory redundancy only).
- **Notice Pay / PILON**: 100% Taxable as earnings under ITEPA 2003 s.402D (PENP rules).
- **Employer Legal Fee Contribution**: Tax-free under s.413A & EIM13740 if paid direct to solicitor.
- **Employer Class 1A NIC on Termination > £30k**: **15.0%** via RTI (Autumn Budget rate; flag legacy 13.8%).
- **Employee NIC on Termination > £30k**: **0% (Exempt)**.
- **Scottish Tax Bands**: 6 bands (19%, 20%, 21%, 42%, 45%, 48%).

For full HMRC manual citations, PENP formulas, and NIC schedules, see:
- [HMRC Employment Income Manual & Tax References](./references/hmrc-manual-excerpts.md)

## 2. Core Audit Directives

1. **Scrutinize Blanket Tax Claims**:
   - Flag any unqualified claim that *"the first £30,000 is tax-free"*.
   - Require explicit component classification (PILON, holiday pay, and bonus are never tax-free).
2. **Audit Legal Fee Exemption**:
   - Verify that the 3 conditions of s.413A ITEPA 2003 are stated (direct payment to solicitor, termination advice only, specified in agreement).
3. **Audit Employer NIC Rate**:
   - Verify that all calculations and guidance reflect the **15.0%** Class 1A employer rate for 2026/27.
4. **Structured Output**:
   - Register findings using Finding ID (`SC-E-000`) and log in the shared evidence bus.
