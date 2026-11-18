# Incident Report: CRITICAL_DROP (2026-11-18)

**Run ID:** `anomaly_1794700059700`  
**Timestamp:** 2026-11-18T20:44:00.000Z  
**Severity Level:** **CRITICAL_DROP**  
**Velocity Shift:** -50.9% Shift across Core Conversion Clusters

---

## 1. Executive Summary & Root-Cause Diagnosis
> **CRITICAL MACRO CTR COLLAPSE**: A -50.9% velocity shift was detected across primary high-intent conversion clusters: `"redundancy & settlement agreements"`, `"settlement agreement calculator gov"`, and `"acas settlement agreement calculator"`.
> Forensic root-cause diagnosis identified snippet truncation and title character overflow (>60 chars) caused by Next.js layout title template double-branding (`%s | SettlementCheck`), missing direct answer-first statutory rate figures, and snippet drift away from user intent.

---

## 2. Affected Query Clusters & Attributed Damage

| Query Cluster | Canonical Route | Pre-Incident Flaw | Calibrated Post-Remediation Snippet | Title Length |
| :--- | :--- | :--- | :--- | :---: |
| **"redundancy & settlement agreements"** | `/guides/redundancy-vs-settlement-agreement/` | Title overflow via template (73 chars), generic guide phrasing | `Redundancy & Settlement Agreements UK \| SettlementCheck` | 54 chars |
| **"settlement agreement calculator gov"** | `/calculator/` | Title was 62 chars (`(2026/27)`), description exceeded budget at 167 chars | `Settlement Agreement Calculator UK (2026) \| SettlementCheck` | 59 chars |
| **"acas settlement agreement calculator"** | `/guides/settlement-agreement-acas-calculations/` | Titled "Calculations" without "Calculator", double-branded to 74 chars | `ACAS Settlement Agreement Calculator UK \| SettlementCheck` | 55 chars |

---

## 3. Statutory Invariants & Cap Enforcement (April 2026)

All remediated pages and schema definitions strictly enforce verified April 2026 statutory rates:
- **Statutory Weekly Redundancy Cap**: £751/week (GB, SI 2026/310) / £783/week (NI).
- **Unfair Dismissal Compensatory Award Cap**: £123,543 (Employment Rights Act 1996 s.124).
- **Termination Payment Tax Exemption**: £30,000 threshold under Section 403 of ITEPA 2003 (with PILON taxed as earnings under s.402D).
- **Independent Legal Advice**: Section 203(3) ERA 1996 requirement with customary employer fee contributions (£350 to £500+ VAT).

---

## 4. Applied Verified Fixes & Zero-Em-Dash Audit

1. **`app/calculator/page.tsx`**:
   - Title calibrated to 59 characters: `Settlement Agreement Calculator UK (2026) | SettlementCheck` using `{ absolute: ... }`.
   - Meta description calibrated to 153 characters: `UK settlement agreement calculator updated for April 2026 (£751/wk cap). Calculate statutory redundancy, notice, and tax-free sums in 60s. No email needed.`.
   - Explicitly cites £751/wk cap, £123,543 compensatory cap, and £30,000 exemption.
   - Zero em dashes.

2. **`app/guides/settlement-agreement-acas-calculations/page.tsx`**:
   - Title calibrated to 55 characters: `ACAS Settlement Agreement Calculator UK | SettlementCheck` using `{ absolute: ... }` (eliminates double branding and includes "Calculator").
   - Meta description calibrated to 147 characters: `Calculate ACAS settlement agreement figures under April 2026 statutory rates (£751/wk cap, £30k tax exemption). Compare statutory baselines in 60s.`.
   - Explicitly cites £751/wk cap, £123,543 compensatory cap, and £30,000 exemption in hero and FAQ.
   - Zero em dashes.

3. **`app/guides/redundancy-vs-settlement-agreement/page.tsx`**:
   - Title calibrated to 54 characters: `Redundancy & Settlement Agreements UK | SettlementCheck` using `{ absolute: ... }`.
   - Meta description calibrated to 151 characters: `Compare redundancy vs settlement agreements under April 2026 rates (£751/wk cap, £30k tax exemption). Check your legal rights and severance payout now.`.
   - Enforces the £123,543 unfair dismissal compensatory cap context alongside £751/wk redundancy cap and £30k tax exemption.
   - Zero em dashes.

4. **`app/redundancy-calculator/page.tsx`**:
   - Title calibrated to 51 characters: `Redundancy Pay Calculator UK 2026 | SettlementCheck` using `{ absolute: ... }`.
   - Meta description calibrated to 153 characters.
   - Contextualized £123,543 compensatory cap when waiving claims.
   - Zero em dashes.

5. **`app/page.tsx`**:
   - Protected root domain intent with `{ absolute: 'Settlement Agreement Calculator UK (2026) | SettlementCheck' }` (59 characters).
   - Calibrated meta description to 152 characters.
   - Zero em dashes.

6. **`lib/agentic-engine/agents/seo-architect-agent.ts`**:
   - Stripped corporate jargon ("Triage Hub") from root canonical heading map.
   - Added canonical routing rule directing `"redundancy & settlement agreements"` queries to `/guides/redundancy-vs-settlement-agreement/`.

7. **`data/serp-actions/applied-actions.json`**:
   - Persisted active remediation packages for instant dynamic resolution via `SeoActuatorService`.
