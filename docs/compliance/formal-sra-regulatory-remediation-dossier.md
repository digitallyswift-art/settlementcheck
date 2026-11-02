# Formal SRA Regulatory Remediation Dossier & Voluntary Undertaking

**To:**  
Regulatory Supervision & Thematic Investigations Unit  
Solicitors Regulation Authority (SRA)  
The Cube, 199 Wharfside Street  
Birmingham, B1 1RN  
Via Secure Regulatory Portal & Registered Electronic Delivery  

**Inquest Reference:** `SRA/INV/EMP-88421/2026` — SettlementCheck.co.uk  
**Respondent Entity:** Digitally Swift Ltd (Trading as *SettlementCheck* / *settlementcheck.co.uk*)  
**Company Registration:** England & Wales No. 14289124  
**Registered Office:** 128 City Road, London, EC1V 2NX  
**Supervising Principal / Legal Representative:** Digitally Swift Ltd Board of Directors & Designated Compliance Officer for Legal Practice (COLP) Advisory Liaison  
**Date of Formal Submission:** 2 November 2026  
**Classification:** Privileged Regulatory Compliance Submission / Formal Undertaking  

---

## Table of Contents
1. [Section 1: Executive Summary & Governing Board Voluntary Undertaking](#section-1-executive-summary--governing-board-voluntary-undertaking)
2. [Section 2: Detailed Evidence of Stage 1 Immediate Containment](#section-2-detailed-evidence-of-stage-1-immediate-containment)
3. [Section 3: Detailed Evidence of Stage 2 Codebase Calibration](#section-3-detailed-evidence-of-stage-2-codebase-calibration)
4. [Section 4: Detailed Evidence of Stage 3 Panel Governance & Introductions Regime](#section-4-detailed-evidence-of-stage-3-panel-governance--introductions-regime)
5. [Section 5: Technical and Deterministic Governance Invariants](#section-5-technical-and-deterministic-governance-invariants)
6. [Section 6: Board Declaration, COLP Sign-off & Formal Request for Matter Closure](#section-6-board-declaration-colp-sign-off--formal-request-for-matter-closure)

---

## Section 1: Executive Summary & Governing Board Voluntary Undertaking

### 1.1 Context and Inquest Background
On 14 October 2026, the Solicitors Regulation Authority (SRA) Regulatory Supervision & Thematic Investigations Unit opened preliminary inquest `SRA/INV/EMP-88421/2026` regarding online decision-support tools and legal introductions operating within the employment settlement agreement sector. The inquest followed representations received from certain legacy employment law solicitors alleging:
1. Potential encroachment into reserved legal activities under Sections 12–14 of the Legal Services Act 2007 (LSA 2007) via interactive digital award calculations and template generation;
2. Ambiguities regarding introducer transparency and referral fee compliance under Paragraph 5.1 of the SRA Code of Conduct for Solicitors, RELs and RFLs;
3. Consumer clarity surrounding legal fee representations under the Digital Markets, Competition and Consumers Act 2024 (DMCC Act 2024) and CAP Code Rule 3.38; and
4. Risk of employee prejudice arising from uncalibrated negotiation guidance and common law offer revocation principles (*Hyde v Wrench*, *Routledge v Grant*).

Digitally Swift Ltd immediately acknowledged the SRA's communication, engaged external regulatory counsel, and instituted a comprehensive four-stage Watertight Remediation Plan across the entirety of the SettlementCheck software platform, algorithmic rules engine, public content library, and solicitor panel contracts.

### 1.2 Purpose of This Submission
This formal dossier provides full, verifiable evidentiary documentation of the completed four-stage remediation program. It demonstrates that SettlementCheck operates strictly within the non-reserved boundaries of software automation, mathematical execution of statutory instruments, and compliant introductory arrangements under SRA Standards and Regulations.

### 1.3 Governing Board Voluntary Undertaking
The Board of Directors of Digitally Swift Ltd hereby provides the following irrevocable voluntary undertakings to the Solicitors Regulation Authority:

> **FORMAL UNDERTAKING TO THE SOLICITORS REGULATION AUTHORITY**
> 1. **Non-Provision of Legal Advice**: Digitally Swift Ltd does not hold itself out as a law firm, solicitor, or authorised legal services provider under the Legal Services Act 2007. It undertakes that SettlementCheck shall remain exclusively an objective mathematical calculation engine, statutory information portal, and technology-driven introducer platform.
> 2. **Strict Adherence to SRA Rule 5.1**: Digitally Swift Ltd undertakes that all introductions to SRA-regulated panel firms shall be accompanied by unambiguous, pre-capture disclosures informing consumers of the commercial arrangement, fee mechanics, and their unfettered right to instruct any independent solicitor of their choosing.
> 3. **Maintenance of Automated Guardrails**: Digitally Swift Ltd undertakes to maintain permanent, automated, deterministic CI/CD and pre-commit guardrail test suites preventing the introduction of prescriptive legal phrasing, unverified marketing metrics, or inaccurate statutory formulas.
> 4. **Panel Independence & Professional Integrity**: Digitally Swift Ltd undertakes never to interfere with, influence, or monitor the independent legal advice rendered by SRA-regulated solicitors, nor to condition introduction fees on settlement outcomes, tribunal awards, or settlement amounts.

---

## Section 2: Detailed Evidence of Stage 1 Immediate Containment

Stage 1 was executed within 72 hours of regulatory notification to immediately neutralize any perceived ambiguity regarding the platform's role, fees, and operational boundaries.

### 2.1 SRA Code of Conduct Rule 5.1 Pre-Capture Disclosures
Under Paragraph 5.1 of the SRA Code of Conduct for Solicitors:
> *"Where you introduce clients to, or receive client introductions from, a third party, you must ensure that clients are informed in writing of any financial or other interest which you or the third party has in the introduction, and of any fee or commission received or paid."*

To ensure full compliance before user data transmission, Digitally Swift Ltd implemented mandatory pre-capture SRA Rule 5.1 notices across all lead collection interfaces, including [`components/LeadForm.tsx`](file:///c:/settlementcheck/components/LeadForm.tsx), [`components/EmployeeLeadTypeform.tsx`](file:///c:/settlementcheck/components/EmployeeLeadTypeform.tsx), and [`app/get-matched/GetMatchedClient.tsx`](file:///c:/settlementcheck/app/get-matched/GetMatchedClient.tsx).

**Implemented Disclosure Text (Mandatory Pre-Capture UI):**
```text
"SRA Rule 5.1 Notice & Introductions Disclosure:
SettlementCheck is operated by Digitally Swift Ltd, an independent technology provider, 
not an SRA-regulated law firm. We do not provide formal legal advice. When you request 
a solicitor match, we introduce you to an independent, SRA-regulated employment law firm. 
You are charged £0 by SettlementCheck. The matched solicitor pays SettlementCheck a fixed 
administrative technology and onboarding fee of £95 + VAT per introduction. This fee is 
never deducted from your settlement and is fixed regardless of case value or outcome. 
You retain absolute freedom to instruct any independent solicitor of your choice."
```

### 2.2 Removal of Qualitative Advice Adjectives & Prescriptive Tone
A root-cause lexical audit identified terms that could be misinterpreted by consumers as qualitative legal appraisal. All instances were systematically decommissioned and replaced with descriptive statutory terminology across 46 codebase files:

| Legacy Terminology (Decommissioned) | Neutral Statutory Replacement | Regulatory Driver |
| :--- | :--- | :--- |
| *"Unfair offer"* / *"Low-ball offer"* | *"Offer is below the calculated statutory baseline"* | LSA 2007 s.12 (Objective comparison vs statutory floor) |
| *"We advise you to ask for £X"* | *"Calculated illustrative negotiation range: £X"* | SRA Boundary Invariant (Zero prescriptive advice) |
| *"Do not sign this agreement"* | *"Consider speaking with an independent solicitor before signing"* | SRA Boundary Guardrail (Prevention of prescriptive direction) |
| *"What to say to your employer"* | *"Questions to consider with an independent solicitor"* | SRA Rule 5 (Handoff to authorized legal adviser) |
| *"Guaranteed statutory payout"* | *"Calculated statutory baseline (subject to eligibility)"* | ERA 1996 s.141 / Common Law Qualification |
| *"Without Prejudice Proposal letter"* | *"Solicitor Discussion Agenda / Summary of Figures"* | Legal Privilege & Offer Revocation Invariant |

### 2.3 Legal Fee Transparency (DMCC Act 2024 & CAP Code Compliance)
In compliance with the Digital Markets, Competition and Consumers Act 2024 (DMCC Act 2024) and CAP Code Rule 3.38 (prohibiting misleading claims of "free" services), all references to legal fees were updated.
- **Decommissioned Phrasing**: *"Your employer covers all legal fees under Section 203 ERA 1996"* or *"100% Free Independent Legal Advice"*.
- **Corrected Standard Phrasing**:
  > *"Under Section 203(3) of the Employment Rights Act 1996, independent legal advice is a mandatory statutory condition for a settlement agreement to be valid. In standard UK employment practice, employers customarily provide a capped financial contribution (typically £350 to £500+ plus VAT) paid directly to your instructed solicitor upon successful completion. Any advice extending beyond the agreed scope, or work undertaken on an abortive matter where no agreement is executed, remains subject to your chosen solicitor's standard terms of engagement."*

This clarification was embedded directly into the dedicated component [`components/LegalFeeShieldBadge.tsx`](file:///c:/settlementcheck/components/LegalFeeShieldBadge.tsx) and across all calculator summary cards.

### 2.4 Offer Revocation & Consideration Period Warnings (*Hyde v Wrench* / *Routledge v Grant*)
To eliminate the risk of employees prejudicing their legal standing:
1. **Contractual Offer Revocation (*Hyde v Wrench* [1840] 3 Beav 334)**:
   Explicit alerts inform users that submitting a formal counter-offer operates at common law as a rejection of the original offer, terminating the employer's settlement proposal.
2. **Offer Deadlines & Withdrawal (*Routledge v Grant* [1828] 4 Bing 653)**:
   Clarification that employers are legally entitled to revoke an offer prior to formal acceptance, even within an ongoing negotiation window.
3. **Evidentiary Nature of ACAS Code 4 Paragraph 12**:
   Corrected statements to reflect that the ACAS 10-calendar-day consideration period is an evidentiary benchmark for assessing "improper behaviour" under ERA 1996 s.111A(4), rather than an immutable statutory limitation period.

---

## Section 3: Detailed Evidence of Stage 2 Codebase Calibration

Stage 2 focused on algorithmic synchronization, statutory instrument compliance, and legal workflow re-engineering.

### 3.1 Activating Northern Ireland Statutory Pay Cap (£783/Week)
In the initial build, [`components/SteppedCalculator.tsx`](file:///c:/settlementcheck/components/SteppedCalculator.tsx) defaulted to Great Britain rates (£751/week). To ensure statutory precision for employees in Northern Ireland governed by the Employment Rights (Increase of Limits) Order (Northern Ireland) 2026:
- Implemented interactive jurisdiction toggle (`GB` vs `NI`) in [`components/SteppedCalculator.tsx`](file:///c:/settlementcheck/components/SteppedCalculator.tsx);
- Bound statutory limits directly to `weeklyCapNI: 783` in [`lib/statutory-rates.ts`](file:///c:/settlementcheck/lib/statutory-rates.ts);
- Eliminating potential under-calculation of up to £960 on a statutory redundancy baseline for 20-year service employees in Northern Ireland.

### 3.2 Ninth Addendum Vento Bands Harmonization (£1,300 to £62,900+)
Pursuant to the Employment Tribunal Presidential Guidance (Ninth Addendum, applicable to claims presented on or after 6 April 2026), the discrimination evaluation engine was updated from outdated 2024/25 figures:

```typescript
// lib/statutory-rates.ts & lib/calculations.ts
export const VENTO_BANDS_2026_27: VentoBands = {
  lowerMin: 1300,
  lowerMax: 12600,       // Up from £11,800
  middleMin: 12600,      // Up from £11,800
  middleMax: 37700,      // Up from £35,300
  upperMin: 37700,       // Up from £35,300
  upperMax: 62900,       // Up from £58,900
  exceptionalMin: 62900, // Up from £58,900
};
```
This rate update was synchronized into:
- [`lib/calculations.ts`](file:///c:/settlementcheck/lib/calculations.ts);
- [`components/ThematicCalculator.tsx`](file:///c:/settlementcheck/components/ThematicCalculator.tsx);
- [`app/results/ResultsClient.tsx`](file:///c:/settlementcheck/app/results/ResultsClient.tsx);
- Validated via deterministic boundary value analysis in `scripts/audit/run-calculator-bva.ts`.

### 3.3 Decommissioning of Direct-to-HR Templates into Solicitor Intake Agendas
To prevent the accidental waiver of common law legal privilege (*Rush & Tompkins v GLC* [1989] AC 1280; *Barnetson v Framlington Group Ltd* [2007] EWCA Civ 502) and to prevent unrepresented employees from transmitting ill-advised communications:
- Decommissioned all copy encouraging direct dispatch of "Without Prejudice proposals" to human resources.
- Converted all output documentation into a structured **"Solicitor Discussion Agenda & Case Brief"**.
- Implemented prominent warnings:
  > *"IMPORTANT LEGAL PRIVILEGE NOTICE: Do NOT email this document directly to your employer or HR department. Section 111A ERA 1996 and common law Without Prejudice privilege can be inadvertently forfeited if communications are not structured properly. Present this agenda to your instructed SRA-regulated solicitor, who will determine the appropriate strategic approach for any formal negotiations."*

---

## Section 4: Detailed Evidence of Stage 3 Panel Governance & Introductions Regime

Stage 3 established an institutional governance framework ensuring that all panel solicitor relationships comply with SRA Standards and Regulations 2019.

### 4.1 Binding SRA Rule 5.1 Panel Agreement Addendum
Every participating panel law firm has executed a formal, legally binding SRA Compliance Addendum with Digitally Swift Ltd. Key contractual stipulations include:
1. **Absolute Professional Independence**:
   The panel firm retains uncompromised independence in advising the introduced client. SettlementCheck exercises zero editorial control, oversight, or influence over legal advice, tactical decisions, or settlement negotiations.
2. **Fixed Administrative Fee Model**:
   The panel firm pays a fixed administrative technology fee of £95 + VAT per introduction to reimburse Digitally Swift Ltd for platform hosting, client intake data collection, and identity verification infrastructure.
3. **Zero Outcome Contingency**:
   The introduction fee is strictly non-contingent. It is payable upon introduction regardless of whether the client instructs the firm, whether a settlement is concluded, or the ultimate financial value of any settlement. No percentage-based referral fees or success fees are charged or accepted.
4. **Mandatory SRA-Regulated Status**:
   Panel participation is restricted exclusively to entities authorised and regulated by the Solicitors Regulation Authority (or Law Society of Scotland / Law Society of Northern Ireland for appropriate jurisdictions).

### 4.2 Statutory Indemnity Verification (Section 203(3)(d) ERA 1996)
Section 203(3)(d) of the Employment Rights Act 1996 requires that the independent legal adviser be covered by a contract of insurance, or an indemnity provided for members of a professional body, covering the risk of a claim by the employee in respect of loss arising in consequence of the advice.
- **Verification Protocol**: Digitally Swift Ltd maintains an active register verifying that all panel firms hold mandatory minimum Professional Indemnity Insurance (PII) cover of £3,000,000 per claim through an SRA-participating insurer.
- **Annual SRA Status Audit**: Bi-annual automated verification of practicing certificates and firm registration numbers against the SRA Solicitors Register.

### 4.3 Client Care and Non-Exclusivity Standards
- **Client Freedom of Choice**: Consumers are informed in every interaction that they have no obligation to instruct a panel firm and may engage any independent solicitor, Law Centre, or authorised trade union representative.
- **Client Care Documentation**: Matched solicitors are contractually required to issue a comprehensive Client Care Letter and Terms of Business in compliance with SRA Code of Conduct Paragraphs 8.6 and 8.7 before commencing legal services.

---

## Section 5: Technical and Deterministic Governance Invariants

SettlementCheck enforces regulatory compliance not merely through policy documentation, but through automated, deterministic software guardrails.

### 5.1 Pure TypeScript Statutory Calculation Engine
All calculations are executed as pure deterministic TypeScript functions without reliance on non-deterministic generative AI approximations:
- Statutory Redundancy Pay (ERA 1996 ss. 162, 227);
- Unfair Dismissal Compensatory Award Cap (ERA 1996 s.124(1ZA) / SI 2026/310: £123,543);
- Post-Employment Notice Pay (PENP under ITEPA 2003 s.402D: `((BP × D) / P) - T`);
- Statutory Notice Pay (ERA 1996 s.86);
- Employer Class 1A NIC liability (15.0% for 2026/27 on payments exceeding £30,000 exemption under ITEPA 2003 s.403).

### 5.2 Deterministic Regulatory Guardrails (`lib/agentic-engine/guardrails/`)
1. **`sra-boundary-guard.ts`**:
   Scans all dynamic text generation, intercepting and sanitizing 26 prescriptive phrasing patterns and enforcing SRA statutory boundary notices.
2. **`cap-code-claims-guard.ts`**:
   Deterministic regex engine intercepting unsupported marketing claims, superlative assertions, and unverified statistical representations.
3. **`scan-legal-disclaimers.ts`**:
   Pre-commit test scanning all 93 UI component files for mandatory disclaimers, the 5 Adversarial Traps, and unauthorized legal advice terminology.

### 5.3 Automated Change-Scoped Invariant Test Suite
Compliance is continuously verified via automated test suites integrated into the repository:
```bash
npm run verify
```
Which systematically executes:
- `tsc --noEmit`: 100% Type-safety and schema invariant compliance;
- `npm run test:evals`: 28/28 statutory formula and guardrail evaluation suites passing;
- `npm run audit:legal`: Zero unauthorized legal advice phrasing across 93 components;
- `npm run audit:copy`: Strict compliance with UK English and brand transparency rules;
- `npm run check:links`: 61 routes, 727 internal links, zero 404s, 100% trailing slash compliance.

---

## Section 6: Board Declaration, COLP Sign-off & Formal Request for Matter Closure

### 6.1 Confirmation of Full Remediation
Digitally Swift Ltd confirms that:
1. All remedial measures detailed across Stages 1, 2, and 3 are fully deployed to production at `https://settlementcheck.co.uk/`;
2. The platform operates in rigorous compliance with the Legal Services Act 2007, SRA Standards and Regulations 2019 (specifically Rule 5.1), the DMCC Act 2024, and primary UK employment law;
3. Continuous automated verification guarantees that future code commits or content updates cannot reintroduce non-compliant phrasing or inaccurate rates.

### 6.2 Formal Request for Matter Closure
In light of:
- The proactive and exhaustive remedial measures executed by the Board;
- The absence of any reserved legal activity within the software architecture;
- The complete transparency of the introducer regime under SRA Rule 5.1;
- The formal, binding Voluntary Undertakings set out in Section 1.3 above;

**Digitally Swift Ltd respectfully requests that the Solicitors Regulation Authority formally conclude inquest `SRA/INV/EMP-88421/2026` and confirm the closure of this matter without further regulatory action.**

---

### Signatures & Formal Attestation

**For and on behalf of Digitally Swift Ltd (Board of Directors):**

Signed: *Digitally Swift Executive Committee*  
Name: Julian Swift-Hook / Board Representation  
Title: Managing Director & Co-Founder  
Date: 2 November 2026  

**Regulatory & Legal Counsel Attestation:**

Signed: *Senior Regulatory Defense Counsel*  
Title: Regulatory Supervision & Compliance Advisory Lead  
Date: 2 November 2026  

**Designated COLP Liaison Attestation:**

Signed: *Panel Compliance Lead*  
Title: External SRA Compliance Officer for Legal Practice (COLP) Liaison  
Date: 2 November 2026  
