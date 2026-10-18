# SettlementCheck — Audit Deliverables Index & Phase Directory

**Project:** SettlementCheck (settlementcheck.co.uk)  
**Audit Standard:** Antigravity Zero-Assumption Protocol & Mandatory Evidence Standard  
**Report Directory:** `docs/audit/`  
**Data Directory:** `data/audit/`  
**Automated Naming Linter:** `npm run lint:audit` (scripts/audit/lint-audit-naming.ts)  

---

## 1. Master Phase Directory & Deliverables Index

To maintain absolute human clarity, deterministic alphabetical and chronological sorting across all file explorers, and strict architectural uniformity, every deliverable follows the two-digit zero-padded schema:

$$\text{File: } \texttt{docs/audit/phase-0<id>-<title>.md} \quad \longleftrightarrow \quad \text{H1: } \texttt{# Phase 0<id> — <Title> Report}$$

| Phase | Phase Title & Scope | Primary Deliverable File | Machine-Readable Data | Specialist Agent Owner | Audit Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01A** | **Statutory & Legal Source Register** | [`phase-01a-source-register.md`](file:///c:/settlementcheck/docs/audit/phase-01a-source-register.md) | `data/audit/sources.json` | Master Orchestrator | **Complete** |
| **01B** | **Project Discovery & Architecture Baseline** | [`phase-01b-project-discovery.md`](file:///c:/settlementcheck/docs/audit/phase-01b-project-discovery.md) | `package.json`, `vercel.json` | Master Orchestrator | **Complete** |
| **02** | **Complete Website & Route Inventory** | [`phase-02-website-inventory.md`](file:///c:/settlementcheck/docs/audit/phase-02-website-inventory.md) | [`data/audit/website-inventory.json`](file:///c:/settlementcheck/data/audit/website-inventory.json)<br>[`data/audit/api-inventory.json`](file:///c:/settlementcheck/data/audit/api-inventory.json) | `link-checker`<br>`seo-architect` | **Complete** |
| **03** | **Source Code & Implementation Review** | [`phase-03-implementation-review.md`](file:///c:/settlementcheck/docs/audit/phase-03-implementation-review.md) | [`data/audit/findings.json`](file:///c:/settlementcheck/data/audit/findings.json) | `calculator-auditor`<br>`claims-privacy-auditor` | **Complete** |
| **04A** | **UK Employment Law & SRA Boundary Audit** | [`phase-04a-legal-compliance-audit.md`](file:///c:/settlementcheck/docs/audit/phase-04a-legal-compliance-audit.md) | [`data/audit/findings.json`](file:///c:/settlementcheck/data/audit/findings.json) | `legal-compliance-auditor` | **Complete** |
| **04B** | **UK Employment Tax & HMRC Compliance Audit** | [`phase-04b-tax-compliance-audit.md`](file:///c:/settlementcheck/docs/audit/phase-04b-tax-compliance-audit.md) | [`data/audit/findings.json`](file:///c:/settlementcheck/data/audit/findings.json)<br>[`data/audit/penp-tests.json`](file:///c:/settlementcheck/data/audit/penp-tests.json) | `tax-compliance-auditor` | **Complete** |
| **05** | **Settlement Calculator & Statutory Formula Audit** | [`phase-05-calculator-audit.md`](file:///c:/settlementcheck/docs/audit/phase-05-calculator-audit.md) | [`data/audit/tests.json`](file:///c:/settlementcheck/data/audit/tests.json) (19 BVA tests) | `calculator-auditor` | **Complete** |
| **06** | **Product & User Protection Gap Analysis** | [`phase-06-product-gap-analysis.md`](file:///c:/settlementcheck/docs/audit/phase-06-product-gap-analysis.md) | [`data/audit/findings.json`](file:///c:/settlementcheck/data/audit/findings.json) | Master Orchestrator | **Complete** |
| **07** | **Unsupported Claims & Document Privacy Register** | [`phase-07-unsupported-claims-and-privacy.md`](file:///c:/settlementcheck/docs/audit/phase-07-unsupported-claims-and-privacy.md) | [`data/audit/claims-findings.json`](file:///c:/settlementcheck/data/audit/claims-findings.json) | `claims-privacy-auditor` | **Complete** |
| **08A** | **SEO & AEO Technical Architecture Audit** | [`phase-08a-seo-aeo-audit.md`](file:///c:/settlementcheck/docs/audit/phase-08a-seo-aeo-audit.md) | [`data/audit/seo-aeo-findings.json`](file:///c:/settlementcheck/data/audit/seo-aeo-findings.json) | `seo-architect` | **Complete** |
| **08B** | **Conversion & Commercial Opportunities Audit** | [`phase-08b-conversion-commercial-audit.md`](file:///c:/settlementcheck/docs/audit/phase-08b-conversion-commercial-audit.md) | [`data/audit/commercial-findings.json`](file:///c:/settlementcheck/data/audit/commercial-findings.json) | `conversion-copywriter` | **Complete** |
| **09** | **Qualitative Forum Demand & Anxiety Matrix** | [`phase-09-forum-demand-matrix.md`](file:///c:/settlementcheck/docs/audit/phase-09-forum-demand-matrix.md) | [`data/audit/forum-demand.json`](file:///c:/settlementcheck/data/audit/forum-demand.json) | `forum-demand-researcher` | **Complete** |
| **10A** | **Prioritised Remediation Backlog (HITL Dashboard)** | [`phase-10a-prioritised-remediation-backlog.md`](file:///c:/settlementcheck/docs/audit/phase-10a-prioritised-remediation-backlog.md) | [`data/audit/remediation-backlog.json`](file:///c:/settlementcheck/data/audit/remediation-backlog.json) | Master Orchestrator | **Complete** |
| **10B** | **Final Executive Summary & Business MOAT Review** | [`phase-10b-executive-summary.md`](file:///c:/settlementcheck/docs/audit/phase-10b-executive-summary.md) | Executive Summary Deck | Master Orchestrator | **Complete** |

---

## 2. Mandatory Naming & Invariant Quality Rules

1. **Two-Digit Zero-Padding (Natural Chronological & Alphabetical Sorting)**:
   - Every markdown report in `docs/audit/` MUST strictly begin with `phase-01a-`, `phase-01b-`, `phase-02-` ... up to `phase-10b-` in lowercase kebab-case.
   - Single-digit prefixes (`phase-1-`) are strictly forbidden because standard file trees (VS Code, Explorer, GitHub) sort `phase-10` immediately after `phase-1` and before `phase-2`.

2. **Standard Document Headers**:
   - Line 1 of every markdown report MUST feature an H1 header matching `# Phase 0<N> — <Title> Report`.
   - Metadata preamble MUST explicitly include:
     - `**Project:** SettlementCheck (settlementcheck.co.uk)`
     - `**Audit Phase:** Phase 0<N>`
     - `**Specialist Auditor:** <agent-name>`
     - `**Date of Audit:** YYYY-MM-DD`
     - `**Primary Source Register:** [docs/audit/phase-01a-source-register.md](...)`
     - `**Machine-Readable Dataset:** [data/audit/...]`

3. **Deterministic CI Linter Gate**:
   - `npm run lint:audit` runs before any task is marked complete.
   - Any unapproved filename, malformed H1, missing metadata, or broken local link causes the quality gate to fail with exit code 1.

4. **Schema Discipline**:
   - Sources: `SC-S-000`
   - Test Cases (BVA & Invariants): `SC-T-000`
   - Empirical Findings: `SC-E-<DOM>-000`
   - Backlog Remediations: `SC-B-000`
