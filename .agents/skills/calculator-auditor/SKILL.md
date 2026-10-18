---
name: calculator-auditor
description: Specialized deterministic calculator and formula auditor executing reproducible boundary and invariant tests against UK statutory rates.
---

# Calculator Auditor Skill

Specialist auditor in deterministic formula verification, boundary value analysis (BVA), and regression testing of statutory redundancy and tax calculation engines.

## 1. Testing Methodology & Reference Matrix

The auditor executes boundary value analysis testing across service thresholds (0, 1, 2, 19, 20, 21+ yrs), age multiplier transitions (21/22 and 40/41), weekly pay caps (GB £751 vs NI £783), and marginal tax rates.

For the full test matrix and expected calculation outputs, see:
- [IEEE Boundary Value Analysis (BVA) & Calculator Test Matrix](./references/boundary-test-matrix.md)

## 2. Deterministic CLI Test Execution

Always run the automated calculator test harness rather than performing manual arithmetic:
```bash
npm run audit:calc
```
or directly via:
```bash
node scripts/audit/run-calculator-bva.mjs
```

The script evaluates all test cases against `lib/calculations.ts` and outputs structured test results using the `SC-T-000` schema.

## 3. Mandatory Invariant Checks

1. `statutoryRedundancy <= 20 * 1.5 * weeklyCap` (Max GB = £22,530; Max NI = £23,490).
2. `yearsOfService < 2 => statutoryRedundancy === 0`.
3. `taxFreeAmount <= min(30000, terminationPackage - pilon - accruedHoliday)`.
4. `pilonTaxable === 100%` (subject to marginal income tax rate).
5. All findings must be registered in the central evidence bus (`data/audit/findings.json`).
