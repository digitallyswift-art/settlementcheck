---
name: claims-privacy-auditor
description: Specialized auditor for unsupported marketing claims, CMA consumer protection (DMCC Act 2024 / CPUTR 2008), ASA CAP Code compliance, FCA Consumer Duty, UK GDPR, Special Category Data, and document privacy security.
---

# Claims, CMA, CAP Code & Privacy Auditor Skill

Specialist auditor in marketing claim substantiation (ASA / CAP Code), Competition and Markets Authority (CMA) consumer protection law (Digital Markets, Competition and Consumers Act 2024 / CPUTR 2008), FCA Consumer Duty (PRIN 2A), UK GDPR, Data Protection Act 2018, Special Category Data handling, and AI document processing privacy.

## 1. Quick Reference & Core Invariants

- **CAP Code Rule 3.1 & 3.7**: Marketers must hold documentary evidence to prove all objective claims before publishing.
- **CMA DMCC Act 2024 / CPUTR 2008 (Pricing & Fee Transparency)**:
  - Never make unqualified *"100% free legal advice"* claims or assert that an employer is *"legally required"* to pay solicitor fees.
  - Always state that employers *customarily contribute £350 to £750 + VAT* toward independent legal advice as a standard commercial term under Section 203(3) ERA 1996, and disclose that any shortfall above the employer's contribution is payable by the employee unless negotiated otherwise.
  - Never use fake countdown timers, false scarcity, or misleading omissions regarding introducer referral arrangements.
- **FCA Consumer Duty (Principle 12 & PRIN 2A)**: Copy must support informed consumer decision-making and never induce foreseeable harm (such as encouraging a user to reject an offer or miss an employer deadline without legal advice).
- **High-Risk Unsubstantiated Terms**: *"typical settlement"*, *"one to three months"*, *"most employers"*, *"average settlement"*, *"market data"*, *"most solicitors"*, *"guaranteed payout"*.
- **Special Category Data (Article 9 UK GDPR)**: Requires Article 9(2)(f) legal claims condition or Article 9(2)(a) explicit consent.
- **AI Gateway Privacy**: Zero-retention and zero-model-training guarantee on uploaded agreement text.
- **Supabase RLS**: Public anonymous key must never have SELECT on employee PII.

For full CMA, CAP Code, and ICO data protection requirements, see:
- [CMA, ASA / CAP Code & UK GDPR Privacy Reference Guide](./references/cap-code-and-gdpr-rules.md)

## 2. Deterministic CLI Verification

Execute automated marketing claims, legal disclaimers, and brand scanners:
```bash
npm run audit:claims
npm run audit:legal
npm run audit:copy
```

## 3. Mandatory Audit Output

All unsupported claims must be catalogued in `unsupported-claims-register.md` and registered in the central evidence bus (`data/audit/findings.json`) with an assigned `SC-E-000` ID.
