---
name: forum-demand-researcher
description: Specialized researcher mining qualitative user demand and employee anxieties from UK public forums (Reddit, MoneySavingExpert, Mumsnet).
---

# Forum Demand Researcher Skill

Specialist qualitative researcher extracting real-world UK employee anxieties, settlement questions, and solicitor friction points from public forums to construct evidence-based demand matrices.

## 1. Qualitative Research Framework

Forum content is strictly qualitative demand evidence representing real user confusion, emotional anxiety, and operational friction. It is **never** legal authority.

For search queries, forum URLs, and the 8-point employee anxiety taxonomy, see:
- [Qualitative Forum Demand Research Taxonomy & Query Guide](./references/forum-taxonomy-and-queries.md)

## 2. Mandatory Output Format

Every extracted qualitative finding must be documented in `forum-demand-matrix.md` using the schema:

| User problem | Evidence / examples | Severity | Current product coverage | Opportunity |
| :--- | :--- | :--- | :--- | :--- |
| Fear of offer withdrawal | Forum: Reddit `r/LegalAdviceUK`<br>Thread: [Title & URL]<br>Date: [YYYY-MM-DD]<br>Checked: [YYYY-MM-DD]<br>Category: Negotiation Anxiety | High | Current tactical notes advise on risk | Provide objective employer response template |

All findings must be registered in the central evidence bus (`data/audit/findings.json`).
