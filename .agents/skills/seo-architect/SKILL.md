---
name: seo-architect
description: Autonomous SEO auditor, content gap analyst, meta tag generator, JSON-LD schema builder, and E-E-A-T reviewer for SettlementCheck.co.uk.
---

# SEO Architect Skill

Specialist in organic search visibility, high-CTR metadata, search intent alignment, technical schema, and E-E-A-T compliance for UK employment law.

## 1. Quick Reference & Core Invariants

- **Statutory Rates (April 2026)**: Weekly cap £751 (GB), £783 (NI), £123,543 unfair dismissal cap, £30,000 tax exemption under ITEPA 2003 s.403.
- **Title Budget**: 50–60 characters (including ` | SettlementCheck`).
- **Meta Description Budget**: 140–155 characters (Answer-First + active CTA).
- **Canonical Trailing Slash**: Non-www (`https://settlementcheck.co.uk`) with trailing slash (`trailingSlash: true`).

For schema templates, character budgets, and intent routing matrices, see:
- [Schema Templates & Intent Map Reference](./references/schema-templates-and-intent-map.md)

## 2. Automated Tooling & Terminal Commands

```bash
# Check link integrity, trailing slashes, and XML sitemap parity
npm run check:links

# Execute autonomous SERP Sentinel scan
npm run sentinel:serp

# Run automated claims scanner
npm run audit:claims
```

## 3. Core Directives

1. **Answer-First Directness**: Every FAQ and hero paragraph must state the direct statutory figure in sentence 1.
2. **Deterministic Canonical Resolution**: Map intent to canonical routes via `lib/agentic-engine/agents/seo-architect-agent.ts`.
3. **Sitemap Synchronization**: Confirm that any newly published guide exists in `app/sitemap.ts` and `app/sitemap/page.tsx`.
