---
name: claims-privacy-auditor
description: Specialized auditor for unsupported marketing claims, CAP Code compliance, UK GDPR, Special Category Data, and document privacy security.
---

# Claims & Privacy Auditor Skill

Specialist auditor in marketing claim substantiation (ASA / CAP Code), UK GDPR, Data Protection Act 2018, Special Category Data handling, and AI document processing privacy.

## 1. Quick Reference & Core Invariants

- **CAP Code Rule 3.1 & 3.7**: Marketers must hold documentary evidence to prove all objective claims before publishing.
- **High-Risk Terms**: *"typical settlement"*, *"one to three months"*, *"most employers"*, *"average settlement"*, *"market data"*, *"most solicitors"*.
- **Special Category Data (Article 9 UK GDPR)**: Requires Article 9(2)(f) legal claims condition or Article 9(2)(a) explicit consent.
- **AI Gateway Privacy**: Zero-retention and zero-model-training guarantee on uploaded agreement text.
- **Supabase RLS**: Public anonymous key must never have SELECT on employee PII.

For full CAP Code rules and ICO data protection requirements, see:
- [ASA / CAP Code & UK GDPR Privacy Reference Guide](./references/cap-code-and-gdpr-rules.md)

## 2. Deterministic CLI Verification

Execute automated marketing claims scanner:
```bash
npm run audit:claims
```
or directly via:
```bash
node scripts/audit/scan-marketing-claims.mjs
```

## 3. Mandatory Audit Output

All unsupported claims must be catalogued in `unsupported-claims-register.md` and registered in the central evidence bus (`data/audit/findings.json`) with an assigned `SC-E-000` ID.
