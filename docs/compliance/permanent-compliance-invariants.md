# Standing Operational Mandate & Permanent Compliance Invariants Protocol

**Document Reference:** `SC-POL-COMP-2026-v1.0`  
**Governing Entity:** Digitally Swift Ltd (Trading as *SettlementCheck* / *settlementcheck.co.uk*)  
**Effective Date:** 2 November 2026  
**Supervisory Oversight:** SRA Regulatory Compliance Lead & Engineering Leadership  
**Classification:** Standing Engineering & Operational Compliance Mandate  

---

## 1. Operational Mandate Purpose

This protocol establishes the permanent, non-negotiable operational and technical invariants governing the SettlementCheck software platform. It translates SRA Standards and Regulations, UK primary employment statutes, CMA consumer protection regulations (DMCC Act 2024 / CPUTR 2008), and ASA/CAP Code requirements into automated, deterministic engineering gates.

No code commit, content publication, algorithmic update, or partner integration may be deployed to production if it breaches any invariant codified herein.

---

## 2. Core Legal & Regulatory Invariants

### Invariant 1: Non-Provision of Reserved Legal Activities (LSA 2007 ss. 12–14)
- **Rule**: SettlementCheck is an independent technology platform, not an SRA-regulated law firm. It does not provide legal advice, conduct litigation, or perform reserved legal activities.
- **Enforcement**:
  - All public pages, intake flows, and evaluation summaries must contain the canonical SRA boundary disclaimer.
  - Generative AI outputs and copywriting must be strictly descriptive, never prescriptive.
  - Forbidden phrases (e.g., *"we advise you to"*, *"our legal advice is"*, *"do not accept this offer"*, *"demand £X"*) are programmatically blocked by `lib/agentic-engine/guardrails/sra-boundary-guard.ts`.

### Invariant 2: SRA Code of Conduct Paragraph 5.1 Introductions Transparency
- **Rule**: Every consumer introduction to an SRA-regulated solicitor must be accompanied by explicit, pre-capture disclosures specifying:
  1. The non-advisory nature of SettlementCheck;
  2. The £0 cost charged to the consumer;
  3. The fixed administrative technology fee (£95 + VAT) paid by the introduced solicitor to SettlementCheck;
  4. The non-contingent nature of the fee (zero outcome/settlement percentage commission);
  5. The consumer's complete freedom to instruct any independent solicitor of their choosing.
- **Enforcement**:
  - Embedded as non-bypassable pre-capture text above the submission action on all lead generation components (`LeadForm.tsx`, `EmployeeLeadTypeform.tsx`, `GetMatchedClient.tsx`).

### Invariant 3: Legal Fee Transparency & Abortive Risk Disclosure (DMCC Act 2024 / CAP Code 3.38)
- **Rule**: No copy may state or imply that legal advice is unconditionally "free" or that employers are under a statutory mandate to pay unlimited legal fees.
- **Enforcement**:
  - Explains that under Section 203(3) ERA 1996, independent advice is a validity condition, while employer contributions are a commercial convention.
  - States the typical market contribution range (£350 to £500+ plus VAT).
  - Explicitly warns that legal work exceeding the employer's contribution cap or work on abortive negotiations where no agreement is signed may incur fees under the solicitor's terms of business.

### Invariant 4: Common Law Offer Revocation & Consideration Period Calibration
- **Rule**: The platform must protect employees from prejudicing their employment status or forfeiting settlement offers.
- **Enforcement**:
  - *Hyde v Wrench* warning: Submitting a formal counter-proposal legally revokes the original offer.
  - *Routledge v Grant* warning: Employers may withdraw settlement proposals prior to acceptance.
  - *Rush & Tompkins* / *Barnetson* privilege notice: Direct-to-HR "Without Prejudice proposals" are strictly prohibited; outputs must be framed as a "Solicitor Discussion Agenda".
  - ACAS Code 4 Paragraph 12 clarification: 10 calendar days is an evidentiary benchmark for assessing improper behaviour under Section 111A(4) ERA 1996, not an absolute limitation deadline.

### Invariant 5: Pure Deterministic Statutory Calculations
- **Rule**: All statutory formulas must be executed via pure TypeScript functions based directly on legislation.gov.uk statutory instruments. Generative AI must never calculate, estimate, or hallucinate statutory figures.
- **Enforcement**:
  - Centralized rates repository: [`lib/statutory-rates.ts`](file:///c:/settlementcheck/lib/statutory-rates.ts).
  - Current statutory instruments enforced:
    - GB Weekly Pay Cap: £751 (SI 2026/310);
    - NI Weekly Pay Cap: £783 (ERO(NI) 1996; SR 2026);
    - Compensatory Award Limit: £123,543 or 52 weeks' pay (ERA 1996 s.124(1ZA));
    - Vento Ninth Addendum Bands: Lower £1.3k–£12.6k, Middle £12.6k–£37.7k, Upper £37.7k–£62.9k, Exceptional >£62.9k;
    - Tax-free threshold: £30,000 (ITEPA 2003 s.403);
    - Employer Class 1A NIC: 15.0% for 2026/27.

### Invariant 6: Evidence-Bounded Inter-Agent Protocol (EBIAP) & Zero Fabrication
- **Rule**: All agents, content generators, and UI components are strictly forbidden from generating fabricated volume metrics, hypothetical settlement averages, or vanity statistics.
- **Enforcement**:
  - Any factual or statistical claim must declare a verified statutory invariant, system telemetry endpoint, or verified case law citation.
  - Audited continuously via `scripts/audit/scan-marketing-claims.ts`.

---

## 3. Automated Continuous Verification Fleet

SettlementCheck maintains an automated verification pipeline that runs locally, on pre-commit git hooks, and in continuous integration environments.

```
+-------------------------------------------------------------------------------+
|                      npm run verify (Verification Engine)                     |
+-------------------------------------------------------------------------------+
       |                   |                   |               |
       v                   v                   v               v
+--------------+    +--------------+    +--------------+  +--------------+
|   tsc check  |    |  evals test  |    |  legal audit |  |  brand audit |
| (Type-Safety)|    | (Statute BVA)|    | (SRA/CMA/LSA)|  | (Plain UK Eng|
+--------------+    +--------------+    +--------------+  +--------------+
       |                   |                   |               |
       +-------------------+-------------------+---------------+
                                   |
                                   v
                    +------------------------------+
                    |       check:links scan       |
                    | (Zero 404s / Trailing Slash) |
                    +------------------------------+
```

### 3.1 Verification Commands and Checks

| Command | Script Path | Scope & Mandatory Pass Criteria |
| :--- | :--- | :--- |
| `npm run verify` | `scripts/verify-quiet.mjs` | Master orchestration running all 6 deterministic gates; zero failures allowed. |
| `npx tsc --noEmit` | `tsconfig.json` | 100% Type-safety across App Router, components, and calculation libraries. |
| `npm run test:evals` | `scripts/evals/eval-runner.mjs` | Executes 28 deterministic evals testing statutory redundancy, notice, and guardrails. |
| `npm run audit:legal` | `scripts/audit/scan-legal-disclaimers.ts` | Scans 93 UI files for SRA boundary, FCA CMC rules, CMA fee transparency, and 5 Traps. |
| `npm run audit:copy` | `scripts/audit/scan-copy-brand.ts` | Scans for banned buzzwords, US terminology (layoff, attorney), and ensures plain UK English. |
| `npm run audit:calc` | `scripts/audit/run-calculator-bva.ts` | IEEE Boundary Value Analysis across service years, age multipliers, and caps. |
| `npm run audit:claims` | `scripts/audit/scan-marketing-claims.ts` | Scans for unsubstantiated claims or vanity metrics (EBIAP enforcement). |
| `npm run check:links` | `scripts/check-links.mjs` | Scans all routes and internal links for zero 404s and consistent trailing slashes. |

---

## 4. Operational Panel Governance Protocol

To maintain compliance with SRA Code of Conduct Paragraph 5.1 on an ongoing basis:

1. **Bi-Annual SRA Register Verification**:
   The Compliance Lead conducts bi-annual audits of all panel firms against the SRA Solicitors Register to verify current authorization, active SRA ID, and practicing certificate validity.
2. **Professional Indemnity Insurance (PII) Audit**:
   Every participating firm must supply an updated Certificate of Insurance annually demonstrating a minimum of £3,000,000 PII cover with an SRA-participating insurer (ERA 1996 s.203(3)(d)).
3. **Mystery Shopping & Telemetry Monitoring**:
   Quarterly sampling of intake summaries and introduction records ensures that zero prescriptive advice or steering occurs.
4. **Immediate De-Listing Trigger**:
   Any panel firm subject to an SRA disciplinary finding, intervention, or failure to maintain qualifying insurance is suspended from introductions immediately.

---

## 5. Architectural Safeguards (IDE Customization vs Production Engine)

To prevent developer prompts or AI pair programming from compromising production integrity:
- **IDE Customizations (`.agents/`)**: Runbooks, rules, and skills exist strictly in `.agents/` to guide developers and are excluded from production bundles.
- **Production Runtime Engine (`lib/agentic-engine/`)**: Hardened, deterministic TypeScript guardrails (`sra-boundary-guard.ts`, `cap-code-claims-guard.ts`) execute at runtime, actively sanitizing any dynamic LLM output before it reaches the client.

This architectural separation ensures that even if an AI generation agent attempts to produce non-compliant advice, the deterministic runtime guardrail intercepts and replaces it with compliant statutory phrasing.

---

## 6. Review & Maintenance Schedule

This protocol is reviewed:
- Annually upon the publication of the annual Employment Rights (Increase of Limits) Order (each February/April);
- Immediately upon any relevant judicial ruling by the Court of Appeal, Supreme Court, or Employment Appeal Tribunal impacting Section 203 ERA 1996 or settlement agreement validity;
- Immediately upon any update to the SRA Standards and Regulations or thematic guidance.

**Governing Authority:** Digitally Swift Ltd Board of Directors  
**Designated Compliance Officer:** SRA Compliance Advisory Lead  
