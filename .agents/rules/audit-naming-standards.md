# Audit Artifact & Naming Convention Invariants

## 1. Context & Purpose
SettlementCheck's comprehensive audit consists of 10 distinct phases producing 14 structured markdown reports and associated machine-readable JSON datasets in `docs/audit/` and `data/audit/`.

To ensure total transparency, human scannability, and deterministic alphabetical and chronological sorting across all operating systems, terminals, and IDE file explorers, all files and headings MUST strictly comply with this standard.

---

## 2. Mandatory File Naming Pattern (Two-Digit Zero Padding)

All audit deliverables in `docs/audit/` MUST strictly match the two-digit zero-padded canonical schema:

$$\texttt{phase-0<phase\_id>-<descriptive-kebab-case>.md}$$

### Canonical Deliverables Register:
- `README.md` (Master Table of Contents and Deliverables Index)
- `phase-01a-source-register.md`
- `phase-01b-project-discovery.md`
- `phase-02-website-inventory.md`
- `phase-03-implementation-review.md`
- `phase-04a-legal-compliance-audit.md`
- `phase-04b-tax-compliance-audit.md`
- `phase-05-calculator-audit.md`
- `phase-06-product-gap-analysis.md`
- `phase-07-unsupported-claims-and-privacy.md`
- `phase-08a-seo-aeo-audit.md`
- `phase-08b-conversion-commercial-audit.md`
- `phase-09-forum-demand-matrix.md`
- `phase-10a-prioritised-remediation-backlog.md`
- `phase-10b-executive-summary.md`

**Strict Anti-Patterns (Forbidden):**
- ❌ Single-digit unpadded prefixes (`phase-1-`, `phase-2-`) — causes `phase-10` to sort before `phase-2` in file trees.
- ❌ Ad-hoc non-prefixed filenames (`website-inventory.md`, `source-register.md`, `tax-audit.md`).
- ❌ Uppercase or snake_case (`Phase_01A.md`, `phase-01A.md`).

---

## 3. Mandatory Document Structure & Headings

Line 1 of every deliverable MUST strictly follow:
```markdown
# Phase 0<ID> — <Descriptive Title> Report (`phase-0<id>-<name>.md`)
```

The preamble MUST explicitly include:
```markdown
**Project:** SettlementCheck (settlementcheck.co.uk)  
**Audit Phase:** Phase 0<ID> (<Phase Title>)  
**Specialist Auditor:** <agent-owner>  
**Date of Audit:** YYYY-MM-DD  
**Auditor Protocol:** Antigravity Zero-Assumption Protocol & Mandatory Evidence Standard  
**Designated Report Directory:** `c:\settlementcheck\docs\audit\`  
**Primary Source Register:** [`docs/audit/phase-01a-source-register.md`](file:///c:/settlementcheck/docs/audit/phase-01a-source-register.md)  
**Machine-Readable Dataset:** [`data/audit/<artifact>.json`](file:///c:/settlementcheck/data/audit/<artifact>.json)  
```

---

## 4. Deterministic Verification Gate (Scoped to `docs/audit/` Changes)

Only when creating, renaming, or editing audit deliverables in `docs/audit/`, run:
```bash
npm run lint:audit
```
This linter statically parses every file in `docs/audit/`, verifying:
1. Canonical filename match.
2. Line 1 H1 match.
3. Metadata completeness (`Project`, `Audit Phase`, `Date of Audit`).
4. Absence of broken cross-document local markdown links.
