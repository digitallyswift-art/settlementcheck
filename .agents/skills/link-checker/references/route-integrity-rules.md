# Link Checker: Route & Sitemap Integrity Invariants

## 1. Non-Negotiable Route Invariants

1. **Strict Trailing Slash (`trailingSlash: true`)**:
   - Every internal link pointing to a page route must end with a trailing slash (`/`).
   - Example: `<Link href="/calculator/">` (CORRECT) vs `<Link href="/calculator">` (INCORRECT — causes 308 redirect lag).
2. **Zero Dead Links**:
   - Every internal `href` must resolve to an existing Next.js `page.tsx` or static route.
3. **Canonical Domain Standard**:
   - Primary domain is strictly non-www: `https://settlementcheck.co.uk`.
   - Never hardcode internal links to absolute URLs (`https://...`); always use relative paths (`/calculator/`).

---

## 2. XML Sitemap & HTML Directory Parity

1. **XML Sitemap (`app/sitemap.ts`)**:
   - Every public, indexable guide or calculator published in `app/` must be explicitly listed in `app/sitemap.ts`.
2. **HTML Sitemap (`app/sitemap/page.tsx`)**:
   - The user-facing sitemap must categorize all guides by topic and link directly to them.
3. **Noindex Exceptions**:
   - Internal portal pages (`/portal/`, `/dossier/review/[id]/`) must be omitted from `app/sitemap.ts` and blocked in `app/robots.ts` to protect solicitor and client confidentiality.
