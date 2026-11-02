# Section 203(3)(d) ERA 1996 & Professional Indemnity Insurance Verification Protocol

**Document Reference:** `docs/compliance/s203-pii-verification-protocol.md`  
**Governing Statute:** Employment Rights Act 1996, Section 203(3)(d) & Section 203(3A)  
**Regulatory Standards:** SRA Indemnity Insurance Rules (SIIR) & SRA Minimum Terms and Conditions (MTC)  
**System Target:** Panel Onboarding, Automated Pre-Flight Lead Triage, and Annual Audit Log  

---

## 1. Statutory Foundation & Regulatory Necessity

### 1.1 The Section 203(3)(d) Enforceability Trap
Under **Section 203(1) of the Employment Rights Act 1996 (ERA 1996)**, any contractual provision attempting to exclude or limit the jurisdiction of an Employment Tribunal or the operation of statutory employment protections is void as a matter of law.

The sole statutory exception enabling binding settlement of employment claims is provided under Section 203(2)(f) and conditioned upon the six cumulative requirements of Section 203(3).

Section 203(3)(d) creates a mandatory statutory condition of validity:
> *"there was in force, when the adviser gave the advice or received the information, a contract of insurance, or an indemnity provided for members of a profession or professional body, covering the risk of a claim by the employee in respect of loss arising in consequence of the advice"*

### 1.2 Legal Consequence of Non-Compliance
If an introduced adviser provides Section 203(3) certification while their Professional Indemnity Insurance (PII) policy is lapsed, cancelled, invalid, or inadequate:
1. **Total Agreement Invalidity**: The entire settlement agreement is void ab initio. The waiver of statutory claims is legally ineffective (*Bathgate v Technip Singapore PTE Ltd [2023]*; *BCCI v Ali [2001]*).
2. **Employer Repudiation Risk**: The employer can reclaim payments made or, conversely, find itself exposed to unbarred Employment Tribunal claims despite having paid substantial settlement monies.
3. **Solicitor & Platform Liability**: The adviser faces severe professional negligence claims and SRA disciplinary sanctions. SettlementCheck's credibility and partnership network would suffer catastrophic damage.

Therefore, verification of qualifying Professional Indemnity Insurance and SRA practicing status is a non-negotiable operational invariant.

---

## 2. Mandatory Verification Components

```
+---------------------------------------------------------------------------------------------------+
|                           S203 PII & PRACTISING CERTIFICATE VERIFICATION GATES                     |
|                                                                                                   |
|  [ Panel Law Firm Application / Annual Renewal ]                                                  |
|         |                                                                                         |
|         +---> Gate 1: SRA Entity Authorisation Check (SRA Digital Register / API)                 |
|         |     - SRA ID, Organisation Status, Disciplinary Findings, Regulatory Conditions         |
|         |                                                                                         |
|         +---> Gate 2: Individual Fee Earner Practising Certificate Audit                          |
|         |     - SRA Roll Number, Unrestricted Practising Certificate (current year)               |
|         |                                                                                         |
|         +---> Gate 3: Qualifying PII Policy Verification (ERA 1996 s.203(3)(d))                   |
|         |     - SRA Participating Insurer verification                                            |
|         |     - Minimum limit of indemnity (£3,000,000 body / £2,000,000 sole practice)           |
|         |     - Specific coverage for employment law advice & settlement agreement certificates   |
|         |     - Effective date & unexpired policy window verification                             |
|         |                                                                                         |
|         v                                                                                         |
|  [ APPROVED & CERTIFIED: Registered in Immutable Verification Audit Log (7-Year Retention) ]      |
+---------------------------------------------------------------------------------------------------+
```

### 2.1 Component A: SRA Practising Certificate & Entity Authorisation
Before any law firm is admitted to the SettlementCheck panel or dispatched client dossiers:
1. **SRA Entity Status**: The firm must be verified against the official SRA Solicitors Register (`sra.org.uk/check`).
   - Must be categorized as an SRA-authorized body (Recognised Body, Licensed Body / ABS, or Recognised Sole Practice).
   - Status must be "Active" with zero regulatory suspensions, closures, or intervention orders.
2. **Individual Fee Earner Roll Verification**:
   - The primary designated employment partner and all fee earners handling SettlementCheck referrals must possess a valid, current Practising Certificate issued by the SRA.
   - Practising certificates must be checked for restrictions or conditions (e.g., conditions prohibiting unsupervised client advice or managing client money).

### 2.2 Component B: Qualifying PII Policy Criteria (SRA MTC Standard)
Under Section 203(3)(d) ERA 1996, the insurance must cover the specific risk of a claim by the employee client. SettlementCheck requires every Panel Firm to submit documentary evidence demonstrating:
1. **Participating Insurer**: The policy must be underwritten by an authorized Qualifying Insurer that has signed the SRA Participating Insurers Agreement for the relevant indemnity year.
2. **Minimum Indemnity Limit**:
   - **£3,000,000 (Three Million Pounds Sterling)** per single claim for any recognized body or licensed body (ABS).
   - **£2,000,000 (Two Million Pounds Sterling)** per single claim for an incorporated sole practitioner.
3. **Explicit Scope of Coverage**:
   - The policy must not exclude employment law advice, draft settlement agreement evaluation, tribunal representation, or Section 203(3) ERA 1996 statutory certificates.
4. **Retroactive Coverage**: The policy must have an inception or retroactive date preceding all historical settlement agreements advised by the firm's fee earners.
5. **Run-Off & Successor Practice Protections**: Confirmation that the policy includes standard SRA 6-year mandatory run-off cover upon cessation of practice.

---

## 3. Operational Verification Workflow

### 3.1 Initial Onboarding Gate (T-0)
1. **Document Submission**: The applicant firm submits:
   - Certificate of Insurance (issued directly by the broker or participating insurer).
   - Policy Schedule confirming insured entity, policy number, limit of indemnity, and expiry date.
   - SRA Organisation ID and firm compliance officer (COLP) attestation.
   - List of designated employment solicitors and their SRA roll numbers.
2. **Deterministic Verification**: SettlementCheck Compliance Officer manually verifies the insurer against the current SRA List of Qualifying Insurers and validates firm details on the SRA Register.
3. **Audit Log Generation**: A permanent verification entry is written to the compliance log with status `ACTIVE`.

### 3.2 Automated 30-Day Pre-Expiry Renewal Cycle
Because PII policies in England and Wales predominantly renew on 1 October or 1 April annually, SettlementCheck enforces an automated 3-tier renewal countdown:

| Alert Tier | Timing | Automated Action | Escalation Level |
| :--- | :--- | :--- | :--- |
| **Tier 1 Alert** | 30 Days Prior to Expiry | Automated notification to COLP requesting renewed Certificate of Insurance | Operational Notice |
| **Tier 2 Alert** | 14 Days Prior to Expiry | Secondary reminder, requiring written confirmation that renewal terms are agreed | Warning Notice |
| **Tier 3 Warning** | 7 Days Prior to Expiry | Final urgent notice to Managing Partner: alert that dispatch suspension is scheduled | High Urgency |
| **SUSPENSION** | 00:00:01 on Expiry Date | **Automatic dispatch lock.** System halts lead routing to the firm immediately | **CRITICAL LOCKOUT** |

### 3.3 Zero-Tolerance Expiry Lockout
If a new, valid Certificate of Insurance is not uploaded, verified, and approved by 23:59:59 on the policy expiration date:
1. The firm's status in the dispatch database is instantly updated from `ACTIVE` to `SUSPENDED_PII_EXPIRED`.
2. The firm is immediately excluded from the territorial SLA matching algorithm.
3. No employee lead or case dossier can be routed to the firm under any circumstances.
4. Reactivation is prohibited until the compliance officer completes full re-verification of the renewed policy.

---

## 4. Immutable Audit Log Specification

To provide absolute legal defensibility for every settlement agreement advised through panel firms, SettlementCheck maintains an immutable, cryptographically verifiable audit log.

### 4.1 Log Record Schema
Each verification or renewal event is recorded with the following data schema:

```json
{
  "auditId": "PII-VERIF-2026-10-0012",
  "firmId": "firm_uk_bristol_employment_01",
  "firmLegalName": "Avenue Employment Solicitors LLP",
  "sraEntityId": "654321",
  "sraStatusVerified": true,
  "sraVerificationDate": "2026-10-01T09:15:00Z",
  "insurerName": "Travelers Insurance DAC",
  "isSraParticipatingInsurer": true,
  "policyNumber": "TRV-PII-99281-2026",
  "policyInceptionDate": "2026-10-01",
  "policyExpiryDate": "2027-09-30",
  "indemnityLimitGbp": 3000000,
  "excessGbp": 10000,
  "employmentLawCovered": true,
  "s203SpecificCoverageConfirmed": true,
  "verifiedBy": "compliance.officer@settlementcheck.co.uk",
  "verificationStatus": "PASSED_ACTIVE",
  "nextRenewalAuditDate": "2027-08-31",
  "documentSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

### 4.2 7-Year Statutory Record Retention
Under the Limitation Act 1980 and Employment Tribunal procedural rules:
1. All PII verification certificates, broker correspondence, and SRA registration records are retained for a minimum of **seven (7) years** following the expiration of the relevant insurance period.
2. In the event an employer, employee, or Employment Tribunal queries the Section 203(3)(d) qualification of an adviser at the time an agreement was signed, SettlementCheck can produce an authenticated evidentiary certificate confirming coverage within 24 hours.

---

## 5. Annual Compliance Audit & Reporting

On an annual basis (aligned with the October legal insurance renewal window), the Panel Compliance Officer executes a comprehensive portfolio audit:
1. Re-verifying 100% of panel law firms on the SRA Register.
2. Checking for any newly published SRA regulatory decisions, sanctions, or fines.
3. Confirming renewed PII policies for all active firms.
4. Delivering an annual Compliance Certification Report to the Board of Directors of Digitally Swift Ltd.
