# SEO Architect Reference Guide: Schema Templates & Search Intent Architecture

## 1. Intent Classification Architecture

Search query intent is categorized into 7 programmatic routing tiers:

1. **TRANSACTIONAL_CALCULATOR**:
   - Queries containing: `calculator`, `calculate`, `calc`, `estimate`, `payout`.
   - Canonical Route: `/calculator/`
   - Primary Schema: `WebApplication` + `FAQPage`
2. **TAX_STATUTORY_EXEMPTION**:
   - Queries containing: `tax`, `pilon`, `30000`, `tax free`.
   - Canonical Route: `/settlement-agreement-tax-calculator/` or `/guides/tax-free-settlement-30000/`
   - Primary Schema: `WebApplication` + `Article`
3. **GOV_ACAS_BENCHMARK**:
   - Queries containing: `gov`, `acas`, `guidelines`.
   - Canonical Route: `/guides/settlement-agreement-acas-calculations/`
   - Primary Schema: `FAQPage` + `Article`
4. **COMPROMISE_AGREEMENT_LEGACY**:
   - Queries containing: `compromise agreement`.
   - Canonical Route: `/guides/compromise-agreement-calculator-uk/`
   - Primary Schema: `Article` (highlighting 2013 rebranding to settlement agreement under Enterprise and Regulatory Reform Act 2013)
5. **REDUNDANCY_DISPUTE**:
   - Queries containing: `redundancy`, `severance`, `dismissal`, `tribunal`.
   - Canonical Route: `/redundancy-calculator/` or `/unfair-dismissal-calculator/`
6. **SOLICITOR_SELECTION**:
   - Queries containing: `solicitor`, `legal advice`, `near me`, `who pays`.
   - Canonical Route: `/get-matched/` or `/guides/employer-recommended-solicitor/`
7. **GENERAL_SETTLEMENT**:
   - Fallback canonical route: `/guides/settlement-agreement-how-much/`

---

## 2. Character Budget Invariants

To avoid SERP pixel clipping and title truncation on mobile/desktop:
- **Title Tag**: Strictly **50 to 60 characters** (including brand suffix ` | SettlementCheck`).
- **Meta Description**: Strictly **140 to 155 characters** (Answer-First summary + clear active CTA).

---

## 3. Schema.org JSON-LD Specifications

### WebApplication Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SettlementCheck UK Calculator",
  "url": "https://settlementcheck.co.uk/calculator/",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "GBP"
  }
}
```

### FAQPage Schema
- Minimum 3 questions.
- Answers must provide direct numeric or statutory answer in the first 1-2 sentences.
- Must cite primary UK statutes (ERA 1996, ITEPA 2003, SI 2026/310).
