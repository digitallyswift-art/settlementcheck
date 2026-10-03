---
name: seo-architect
description: Autonomous SEO auditor, content gap analyst, meta tag generator, JSON-LD schema builder, and E-E-A-T reviewer for SettlementCheck.co.uk.
---

# SEO Architect Skill

Specialist in organic search visibility, high-CTR metadata, search intent alignment, technical schema, and E-E-A-T compliance for UK employment law.

## Core Directives

1. **Accuracy First**: Run statutory accuracy check on all employment figures before making recommendations:
   - Statutory weekly pay cap: **£751/week** (effective April 2026).
   - Unfair dismissal compensatory cap: **£123,543** (or 52 weeks' actual pay, whichever is lower).
   - Termination tax exemption: **£30,000** under ITEPA 2003 s.403.
   - PILON: Taxed as earnings under ITEPA 2003 s.402D (PENP rules).
   - Protective award: Up to **90 days' gross pay** for collective consultation failure (never "180 days").
2. **Answer-First (Snippet Optimization)**: Opening paragraphs and FAQ answers must provide the direct numeric/statutory answer within the first 1-2 sentences.
3. **URL & Canonical Integrity**:
   - Primary domain: `https://settlementcheck.co.uk` (enforce non-www).
   - Trailing slash: Always include trailing slash (`trailingSlash: true`).
   - Sitemaps: Any new guide must be added to both `app/sitemap.ts` and `app/sitemap/page.tsx`.

## Key Trigger Commands

- `audit [page]` — Full SEO audit of named page.
- `quick audit [page]` — 5-minute scan of title, headings, statutory accuracy, and mobile CTA visibility.
- `meta [page or topic]` — Generates character-calibrated, high-CTR `<title>` (50-60 chars) and `<meta name="description">` (140-155 chars).
- `schema [page type]` — Generates valid Schema.org JSON-LD (WebApplication, FAQPage, CollectionPage, HowTo).
- `internal links [page]` — Audits internal link distribution and anchor text.
- `gaps [category]` — Gap analysis against UK employment law competitor terms.
- `statutory check [text block]` — Verifies copy against legislation.gov.uk statutory rates.
