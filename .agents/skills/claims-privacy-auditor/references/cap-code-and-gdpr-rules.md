# ASA / CAP Code & UK GDPR Privacy Reference Guide

## 1. ASA & CAP Code (Edition 12) — Substantiation Standards

### Rule 3.1 & 3.7 — Objective Claims Must Be Substantiated
Under the UK Code of Non-broadcast Advertising and Direct & Promotional Marketing (CAP Code):
- Before distributing or submitting a marketing communication for publication, marketers must hold documentary evidence to prove all claims, whether direct or implied, that are capable of objective substantiation.
- The adequacy of evidence will be judged if such evidence is sampled randomly or if there is a statistically significant sample size.

### High-Risk Unsubstantiated Terminology Checklist
1. **"Typical settlement"**: Suggests a standard market norm. Unless backed by a published statistical dataset across all UK industries, this is misleading under CAP Code 3.1.
2. **"One to three months' salary"**: Frequent informal rule of thumb used by HR. Citing this as an objective legal benchmark violates CAP Code 3.7 unless clearly qualified as an anecdotal industry observation.
3. **"Most employers pay / agree"**: Unsubstantiated collective claim.
4. **"Average settlement payout"**: Requires an authentic, verifiable sample size and date range.
5. **"Market data shows"**: Requires explicit citation to source dataset, methodology, and sample volume.
6. **"Most solicitors charge / agree"**: Unsubstantiated profession-wide assertion.
7. **"True maximum compensation"**: Ambiguous and misleading given statutory unfair dismissal caps vs uncapped discrimination claims.

---

## 2. UK GDPR & Data Protection Act 2018 (ICO Guidance)

### Article 9 — Processing of Special Category Data
- Settlement agreements and dispute chronologies frequently contain Special Category Data:
  - Physical or mental health details (disability discrimination, sick leave, stress, psychiatric injury).
  - Trade union membership or activities.
  - Racial or ethnic origin, religious beliefs, sex life, sexual orientation.
- **Lawful Basis Requirements**:
  - In addition to an Article 6 legal basis (e.g., legitimate interests or contract performance), processing requires an Article 9 condition:
    - **Article 9(2)(f)**: Processing is necessary for the establishment, exercise or defence of legal claims.
    - **Article 9(2)(a)**: Explicit consent of the data subject.
- **Data Minimisation & Privacy by Design (Articles 5 & 25)**:
  - AI document review pipelines must NOT permanently store raw uploaded settlement agreement text unless explicitly authorized by the user for case tracking.
  - LLM API gateway transmission (Anthropic Claude, Google Gemini): Must operate under zero-data-retention terms where uploaded user documents are not used for model training or retained in persistent model logs.

### Supabase Row-Level Security (RLS) Standards
- Public/anonymous client keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) must NEVER have SELECT permissions on tables containing employee PII or special category dispute details (`leads`, `lead_claims`, `otp_verifications`).
- All reads/writes of sensitive lead and dossier records must occur server-side through `SUPABASE_SERVICE_ROLE_KEY` inside authenticated Next.js API routes.
