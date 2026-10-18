# Phase 04A — Legal Compliance Audit Report (`phase-04a-legal-compliance-audit.md`)
**Project:** SettlementCheck (settlementcheck.co.uk)  
**Audit Phase:** Phase 04A (UK Employment Law, SRA Regulatory Boundaries & Statutory Invariants)  
**Specialist Auditor:** `legal-compliance-auditor`  
**Date of Audit:** 2026-10-18  
**Auditor Protocol:** Antigravity Zero-Assumption Protocol & Mandatory Evidence Standard  
**Designated Report Directory:** `c:\settlementcheck\docs\audit\`  
**Primary Source Register:** [`docs/audit/phase-01a-source-register.md`](file:///c:/settlementcheck/docs/audit/phase-01a-source-register.md)  
**Machine-Readable Evidence Bus:** [`data/audit/findings.json`](file:///c:/settlementcheck/data/audit/findings.json) (68 Total Findings)

---

## 1. Executive Summary

This report delivers a forensic audit of SettlementCheck against UK primary employment legislation ([`legislation.gov.uk`](https://www.legislation.gov.uk)), the Legal Services Act 2007, SRA Standards and Regulations, and ACAS statutory codes of practice.

Because SettlementCheck operates as the pre-solicitor decision-support standard for UK employees, regulatory and legal accuracy represents the platform's core business credibility and defensible MOAT. Any statutory inaccuracy could mislead stressed employees negotiating their exits or invite regulatory challenge from the Solicitors Regulation Authority (SRA) or Advertising Standards Authority (ASA).

### Key Legal Audit Findings
1. **Outdated Vento Bands in Calculator Engine (`SC-E-LEG-001` - P1 High)**:
   In [`lib/calculations.ts:200-208`](file:///c:/settlementcheck/lib/calculations.ts#L200-L208), the Vento injury to feelings bands are hardcoded to outdated 2024/25 Eighth Addendum values (`11800, 35300, 58900`). The active Ninth Addendum (effective 6 April 2026 for claims presented on or after that date) increases bands to **£1,300–£12,600** (Lower), **£12,600–£37,700** (Middle), and **£37,700–£62,900** (Upper). The discrimination guide ([`app/guides/discrimination-settlement-agreements/page.tsx:144`](file:///c:/settlementcheck/app/guides/discrimination-settlement-agreements/page.tsx#L144)) correctly cites the Ninth Addendum, creating an internal contradiction with the interactive calculator widget in `ResultsClient.tsx`.
2. **Statutory Cap Enforcement for Northern Ireland Suppressed (`SC-E-LEG-003` - P2 Med)**:
   [`components/SteppedCalculator.tsx:177`](file:///c:/settlementcheck/components/SteppedCalculator.tsx#L177) hardcodes `const jurisdiction: 'GB' | 'NI' = 'GB'`. Northern Ireland employees cannot toggle jurisdiction, denying them the higher statutory weekly pay cap of **£783/week** under the Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (GB is £751/week), causing an undercount of up to £960 on a statutory redundancy floor.
3. **TUPE Transfer Rights & Settlement Guidance Void (`SC-E-LEG-002` - P2 Med)**:
   Google Search Console telemetry confirms recurring user searches for *"tupe redundancy calculator"*, yet the site contains zero dedicated guides or calculator features addressing Transfer of Undertakings (Protection of Employment) Regulations 2006 (TUPE Regs 4 & 7).
4. **SRA Boundary Phrasing Verification (Passed)**:
   Automated scanning across all 93 components confirmed **0 instances of unauthorized legal advice phrasing** (e.g. *"we advise you to"*, *"our legal advice is"*). The agentic engine strictly enforces [`lib/agentic-engine/guardrails/sra-boundary-guard.ts`](file:///c:/settlementcheck/lib/agentic-engine/guardrails/sra-boundary-guard.ts).

---

## 2. Primary Statute Audit & Statutory Invariants

### 2.1 Employment Rights Act 1996 (ERA 1996)

#### A. Section 203(3) — Validity Conditions for Settlement Agreements
Under Section 203(1), any agreement that seeks to exclude or limit an employee's right to bring employment tribunal proceedings is void unless it satisfies the 6 strict conditions of Section 203(3):
1. **In Writing**: Verified throughout platform.
2. **Particular Complaints / Proceedings**:
   - Case Law: *BCCI v Ali* [2001] UKHL 8 and *Bathgate v Technip Singapore PTE Ltd* [2023] CSIH 48 establish that blanket waivers of unknown future claims are unenforceable.
   - **Audit Verdict**: [`lib/agentic-engine/tools/legal-pack-tools.ts:83-89`](file:///c:/settlementcheck/lib/agentic-engine/tools/legal-pack-tools.ts#L83-L89) correctly checks whether an agreement identifies particular complaints. However, public intake copy on `/settlement-agreement-review/` should proactively educate employees on the *Bathgate* ruling (`SC-E-LEG-004`).
3. **Independent Legal Advice**:
   - Must be delivered by a qualified independent adviser (solicitor, certified trade union official, advice centre worker) with professional indemnity insurance.
   - **Audit Verdict**: Verified. The platform consistently reinforces that the employer is required to contribute to the employee's legal fees and that SettlementCheck does not replace the statutory independent adviser.
4. **Professional Indemnity Insurance**: Verified in solicitor panel requirements (`solicitor_panel.sra_confirmed`).
5. **Adviser Identification**: Verified in case dossier templates.
6. **Statutory Statement**: Verified in `legal-pack-tools.ts:88`.

#### B. Section 111A vs Common Law Without Prejudice
- **Section 111A(1)**: Shields pre-termination negotiations from being used as evidence in ordinary unfair dismissal claims, even if no dispute existed when the offer was made.
- **Section 111A(4) & (5) Exclusions**:
  - Does NOT protect claims of discrimination, harassment, victimisation (Equality Act 2010), whistleblowing (s.103A), or breach of contract.
  - Inadmissibility is lost if the employer engages in "improper behaviour".
- **Audit Verdict**: Accurately distinguished in [`app/guides/protected-conversations-without-prejudice/page.tsx:40-46`](file:///c:/settlementcheck/app/guides/protected-conversations-without-prejudice/page.tsx#L40-L46).

#### C. Sections 162 & 227 — Statutory Redundancy Pay (SRP) Multiplier Invariant
**Governing Statutory Instrument:** The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310).
- **Weekly Pay Cap**: £751/week (GB) / £783/week (NI).
- **Service Ceiling**: 20 qualifying years (s.162(3)).
- **Multiplier Logic**: 0.5x (<22), 1.0x (22–40), 1.5x (41+).
- **Audit Verdict**: 100% Pass in [`lib/calculations.ts:67-84`](file:///c:/settlementcheck/lib/calculations.ts#L67-L84). Tested against 19 IEEE boundary conditions in `scripts/audit/run-calculator-bva.ts`.

#### D. Section 124(1ZA) — Unfair Dismissal Compensatory Award Cap
- **Statutory Cap (SI 2026/310)**: **£123,543** or 52 weeks' gross pay, whichever is lower.
- **Audit Verdict**: 100% Pass in `lib/calculations.ts:197` (`Math.min(salary, rates.compensatoryAwardLimitGB)`).

---

## 3. Equality Act 2010 & Discrimination Invariants

### 3.1 Uncapped Compensation (Section 124 Equality Act 2010)
Tribunal compensation for unlawful discrimination, harassment, or detriment is completely uncapped by statute.
- **Audit Verdict**: [`lib/calculations.ts:193`](file:///c:/settlementcheck/lib/calculations.ts#L193) sets `typicalHighUncapped = true` whenever `discrimination === 'yes'`. The UI displays *"Potentially uncapped"* rather than showing an artificial ceiling. This accurately reflects Employment Tribunal jurisdiction.

### 3.2 Vento Bands for Injury to Feelings (Ninth Addendum Audit)
**Authority:** Employment Tribunal Presidential Guidance (Ninth Addendum, applicable for claims presented on or after 6 April 2026).

| Vento Band | Official Ninth Addendum (2026/27) | Current Code Value (`lib/calculations.ts:200`) | Discrepancy Status |
| :--- | :---: | :---: | :---: |
| **Lower Band** | **£1,300 to £12,600** | £1,200 to £11,800 | **Outdated by £800 (6.8%)** |
| **Middle Band** | **£12,600 to £37,700** | £11,800 to £35,300 | **Outdated by £2,400 (6.8%)** |
| **Upper Band** | **£37,700 to £62,900** | £35,300 to £58,900 | **Outdated by £4,000 (6.8%)** |
| **Exceptional Cases** | **Exceeding £62,900** | Exceeding £58,900 | **Outdated by £4,000 (6.8%)** |

> [!IMPORTANT]
> **Deficiency `SC-E-LEG-001`**: The interactive `VentoBandWidget` rendered in [`app/results/ResultsClient.tsx:613-650`](file:///c:/settlementcheck/app/results/ResultsClient.tsx#L613-L650) displays the outdated 2024/25 Eighth Addendum values. When an employee selects "Middle Band", the calculator shows £11,800–£35,300 instead of £12,600–£37,700, under-evaluating injury to feelings claims by up to £2,400.

---

## 4. SRA Regulatory Boundaries & Legal Services Act 2007

### 4.1 Reserved Legal Activities (Legal Services Act 2007 ss.12–14)
SettlementCheck is operated by Digitally Swift Ltd, an independent software and introduction platform, not an SRA-regulated law firm.  
- Under Section 12 of the Legal Services Act 2007, reserved legal activities include:
  1. The exercise of a right of audience
  2. The conduct of litigation
  3. Reserved instrument activities
  4. Probate activities
  5. Notarial activities
  6. The administration of oaths
- **Audit Verdict**: SettlementCheck performs none of these reserved activities. It functions purely as a decision-support calculator and introduces users to independent SRA-regulated solicitors.

### 4.2 SRA Transparency Rules & Mandatory Disclaimers
1. **Disclaimer Audit**:
   - 34 of 44 pages state the SRA boundary.
   - [`lib/agentic-engine/guardrails/sra-boundary-guard.ts:7`](file:///c:/settlementcheck/lib/agentic-engine/guardrails/sra-boundary-guard.ts#L7) enforces:
     > *"This pre-flight case audit and statutory evaluation is generated by SettlementCheck strictly for objective information and triage purposes. It does not constitute formal legal advice or create a solicitor-client relationship. Under Section 203(3) of the Employment Rights Act 1996, formal statutory advice must be delivered by your instructed independent SRA-regulated solicitor."*
2. **Deterministic Scan**:
   Running `npm run audit:legal` scanned 93 source files and detected **0 unauthorized practice violations**.

---

## 5. ACAS Code of Practice 4 & Collective Redundancy

### 5.1 ACAS Code 4 Paragraph 12 Consideration Period
- ACAS Code of Practice 4 recommends a minimum of **10 calendar days** for an employee to consider settlement terms and seek independent legal advice.
- **Audit Verdict (`SC-E-LEG-005`)**: Certain copy in [`app/guides/pressured-to-sign/page.tsx`](file:///c:/settlementcheck/app/guides/pressured-to-sign/page.tsx) implies that 10 days is a hard statutory deadline. Legally, the 10-day benchmark is an evidentiary standard: giving less than 10 days without justification constitutes "improper behaviour" under ERA 1996 s.111A(4), stripping the employer of statutory confidentiality. Phrasing must be calibrated.

### 5.2 TULRCA 1992 ss.188–190 Protective Awards
- **Thresholds**: 20–99 proposed redundancies = minimum 30 days consultation; 100+ proposed redundancies = minimum 45 days.
- **Protective Award (s.189)**: Up to 90 days' gross pay, uncapped by weekly statutory limit against a solvent employer.
- **Insolvency Cap**: When paid by the Insolvency Service Redundancy Payments Service (RPS) via the National Insurance Fund, capped at 8 weeks at the statutory cap (£751/wk = £6,008).
- **Audit Verdict**: [`lib/calculations.ts:350-356`](file:///c:/settlementcheck/lib/calculations.ts#L350-L356) correctly implements both the solvent (90 days uncapped) and insolvent (8 weeks capped) calculations.

---

## 6. Phase 4A Legal Evidence Register

The following 5 legal findings have been catalogued and synchronized with the Evidence Bus:

| Finding ID | Severity | Statutory Authority | Source Location | Exact Finding Description | Required Remediation |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **`SC-E-LEG-001`** | **P1 (High)** | Equality Act 2010 s.124; Ninth Addendum | `lib/calculations.ts:200` | Vento injury to feelings bands are hardcoded to outdated 2024/25 Eighth Addendum values (£11,800/£35,300/£58,900) instead of Ninth Addendum rates (£12,600/£37,700/£62,900). | Update `ventoBands` object in `lib/calculations.ts` to active Ninth Addendum thresholds. |
| **`SC-E-LEG-002`** | **P2 (Med)** | TUPE Regulations 2006 (SI 2006/246) | `app/guides/` & `app/calculators/` | Total absence of TUPE guidance or calculator tools despite proven user demand in Search Console ("tupe redundancy calculator"). | Create a dedicated TUPE settlement rights guide and interactive transfer-risk checker. |
| **`SC-E-LEG-003`** | **P2 (Med)** | ERO(NI) 1996; SR 2026 | `components/SteppedCalculator.tsx:177` | Calculator hardcodes GB jurisdiction (`const jurisdiction = 'GB'`), preventing NI employees from accessing the £783 weekly cap. | Add a jurisdiction selection toggle allowing Northern Ireland employees to calculate at £783/wk. |
| **`SC-E-LEG-004`** | **P2 (Med)** | ERA 1996 s.203(1); *Bathgate v Technip* | `app/settlement-agreement-review/` | Document review copy does not proactively warn employees that generic blanket waivers of unknown future claims are legally void. | Add an explicit callout citing *Bathgate v Technip* regarding particular complaints waivers. |
| **`SC-E-LEG-005`** | **P2 (Med)** | ACAS Code of Practice 4 para 12 | `app/guides/pressured-to-sign/` | Copy frames 10-day ACAS period as a statutory limitation rather than an improper behaviour evidentiary benchmark. | Calibrate copy: 10 days is an evidentiary benchmark under ACAS Code 4; shorter periods constitute improper behaviour. |

---

## 7. Quality Gate Verification (Phase 4A Close)

- `npx tsc --noEmit` → **0 Type Errors (100% Pass)**
- `npm run check:links` → **61 Routes, 727 Links, 0 Broken Links**
- `npm run test:evals` → **28/28 Statutory & Legal Evals Passing**
- `data/audit/findings.json` → **Synchronized**
