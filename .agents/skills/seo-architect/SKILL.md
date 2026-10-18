---
name: seo-architect
description: Autonomous SEO auditor, content gap analyst, meta tag generator, JSON-LD schema builder, and E-E-A-T reviewer for SettlementCheck.co.uk.
---

# SEO Architect Skill

Specialist in organic search visibility, high-CTR metadata, search intent alignment, technical schema, and E-E-A-T compliance for UK employment law.

## 1. Quick Reference & Core Invariants

- **Statutory Rates (April 2026)**: Weekly cap £751 (GB), £783 (NI), £123,543 unfair dismissal cap, £30,000 tax exemption under ITEPA 2003 s.403.
- **Title Budget**: 50 to 60 characters (including ` | SettlementCheck`).
- **Meta Description Budget**: 140 to 155 characters (Answer-First + active CTA).
- **Canonical Trailing Slash**: Non-www (`https://settlementcheck.co.uk`) with trailing slash (`trailingSlash: true`).

For schema templates, competitor intelligence, keyword tiers, and audit checklists, see:
- [Schema Templates & Intent Map Reference](./references/schema-templates-and-intent-map.md)
- [Competitor Matrix & Moat Strategy](./references/competitor-matrix-and-moat.md)
- [Keyword Tiers & Ranking Targets](./references/keyword-tiers-and-ranking.md)
- [SEO Audit Methodology & Checklists](./references/audit-methodology-and-checklists.md)

## 2. Autonomous Multi-Agent SEO Worker Pipeline

The autonomous SEO workflow is executed by four specialized workers conforming to the `AgenticWorker` contract:

1. **`seoOpportunityWorker`** (`lib/agentic-engine/workers/seo-opportunity-worker.ts`):
   - Ingests GSC query telemetry and identifies high-intent striking distance / low-CTR opportunities.
   - Generates the deterministic `SeoTechnicalBrief`.
2. **`seoCopyWorker`** (`lib/agentic-engine/workers/seo-copy-worker.ts`):
   - Synthesizes calibrated titles (50-60 chars) and meta descriptions (140-155 chars).
   - Constructs Answer-First FAQ blocks and contextual hub-and-spoke anchor blocks.
3. **`legalComplianceWorker`** (`lib/agentic-engine/workers/legal-compliance-worker.ts`):
   - Audits copy against April 2026 statutory rates, Section 203(3) ERA 1996, and SRA boundaries.
   - Enforces ASA / CAP Code Rules 3.1 & 3.7 against unverified marketing claims.
4. **`seoActuatorWorker`** (`lib/agentic-engine/workers/seo-actuator-worker.ts`):
   - Deploys validated packages to disk/Supabase, manages rollbacks, and notifies the Google Indexing API.

## 3. Automated Tooling & Terminal Commands

```bash
# Check link integrity, trailing slashes, and XML sitemap parity
npm run check:links

# Execute autonomous SERP Sentinel scan
npm run sentinel:serp

# Run automated marketing claims scanner
npm run audit:claims

# Run statutory invariant & brand compliance evals
npm run test:evals
```

## 4. Core Directives

1. **Answer-First Directness**: Every FAQ and hero paragraph must state the direct statutory figure in sentence 1.
2. **Deterministic Canonical Resolution**: Map intent to canonical routes via `lib/agentic-engine/agents/seo-architect-agent.ts`.
3. **Sitemap Synchronization**: Confirm that any newly published guide exists in `app/sitemap.ts` and `app/sitemap/page.tsx`.
4. **Zero Em Dashes**: Never use em dashes in generated copy; restructure using hyphens or clean punctuation.
