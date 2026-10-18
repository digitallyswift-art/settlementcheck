---
name: link-checker
description: Automated broken link and trailing-slash route auditor for SettlementCheck.
---

# Link Checker Skill

Ensures zero 404s, zero redirect lag, and complete sitemap coverage across SettlementCheck.co.uk.

## 1. Quick Reference & Core Invariants

- **Trailing Slash**: Mandatory trailing slashes on all internal links (`/guides/`, not `/guides`).
- **Domain Canonical**: `https://settlementcheck.co.uk` (non-www).
- **Sitemap Invariant**: Every public guide must exist in `app/sitemap.ts` and `app/sitemap/page.tsx`.

For route verification rules and sitemap parity guidelines, see:
- [Route Integrity Rules Reference](./references/route-integrity-rules.md)

## 2. Automated Tooling & Terminal Commands

Run the deterministic link integrity and trailing slash scanner:
```bash
npm run check:links
```
or directly via:
```bash
node scripts/check-links.mjs
```

## 3. Checks Performed

1. **Broken Internal Routes**: Verifies every `href` points to an actual page in Next.js `app/`.
2. **Trailing Slash Compliance**: Confirms all links include trailing slashes to avoid 308 redirect overhead.
3. **Sitemap Coverage**: Ensures all published guides exist in both XML and HTML sitemaps.
