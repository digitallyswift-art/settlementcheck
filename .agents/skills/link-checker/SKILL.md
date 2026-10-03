---
name: link-checker
description: Automated broken link and trailing-slash route auditor for SettlementCheck.
---

# Link Checker Skill

Ensures zero 404s, zero redirect lag, and complete sitemap coverage across SettlementCheck.co.uk.

## Execution

Run the automated link auditor:
```bash
npm run check:links
```

## Checks Performed

1. **Broken Internal Routes**: Verifies every `href` points to an actual page in Next.js `app/`.
2. **Trailing Slash Compliance**: Confirms all links include trailing slashes to avoid 308 redirect overhead under `trailingSlash: true`.
3. **Sitemap Coverage**: Ensures all published guides and tools exist in both `app/sitemap.ts` and `app/sitemap/page.tsx`.
