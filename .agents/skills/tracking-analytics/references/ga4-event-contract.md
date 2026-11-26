# GA4 Event Contract & Employee vs. Solicitor Lead Separation

This contract ensures **Employee Client Leads** and **Solicitor Partner Onboarding Leads** never collide in GA4 Key Events, Funnels, or DataLayer triggers—and remain unmistakable to any layman reading a GA4 report.

---

## 1. The Conversion Moat (Why Two Separate Event Trees)

| Dimension | Employee Client Lead (B2C) | Solicitor Partner Onboarding (B2B) |
| :--- | :--- | :--- |
| **Route** | `/get-matched/` ([GetMatchedClient.tsx](../../../../app/get-matched/GetMatchedClient.tsx)) | `/for-solicitors/` ([ForSolicitorsClient.tsx](../../../../app/for-solicitors/ForSolicitorsClient.tsx)) |
| **Plain-English Meaning** | An employee requesting a free solicitor match for their settlement agreement. | A law firm / SRA-regulated solicitor applying to join the SettlementCheck panel. |
| **GA4 Key Event** | `generate_lead` (+ `qualify_lead`, `lead_submitted`) | `solicitor_application_submitted` (**NEVER** `generate_lead`) |
| **`event_category`** | `employee_lead` | `solicitor_application` |
| **`audience_role`** | `'Employee Client'` | `'Solicitor Partner'` |
| **Funnel Step Event** | `lead_form_step` | `solicitor_form_step` |
| **Value / Currency** | `currency: 'GBP', value: 150` | Omit `value`—never mix B2B applications into B2C lead value |

### Layman-Readable & GA4 Admin Rules
1. **Never reuse `generate_lead` for B2B**: Reserving `generate_lead` exclusively for Employee Client Leads guarantees GA4's built-in "Leads" / Key Events count equals real employee enquiries.
2. **Always attach `audience_role`**: Pass `audience_role: 'Employee Client'` or `audience_role: 'Solicitor Partner'` on every funnel and conversion event.
3. **Register `audience_role` in GA4 Admin**: In GA4 (`Admin → Data display → Custom definitions → Create custom dimension`), register `audience_role` (Scope: **Event**, Event parameter: `audience_role`, Display name: `Audience Role`) so non-technical stakeholders see `Employee Client` vs `Solicitor Partner` directly in GA4 reports and Looker Studio.
4. **Campaign & Category Prefixing**: All B2C categories/campaigns start with `employee_`; all B2B categories/campaigns start with `solicitor_`.

---

## 2. Canonical Event Inventory

### A. Employee Client Funnel (`audience_role: 'Employee Client'`)
- `primary_match_cta_click` (`event_category: 'conversion_funnel'`) — via `trackSolicitorMatchClick()` in `lib/telemetry.ts`.
- `lead_form_step` (`event_category: 'employee_lead'`, `audience_role: 'Employee Client'`) — step progression in `/get-matched/`.
- `lead_submitted` / `generate_lead` / `qualify_lead` (`event_category: 'employee_lead'`, `audience_role: 'Employee Client'`) — successful submission in `GetMatchedClient.tsx`.

### B. Solicitor Partner Funnel (`audience_role: 'Solicitor Partner'`)
- `solicitor_form_step` (`event_category: 'solicitor_application'`, `audience_role: 'Solicitor Partner'`) — step progression in `/for-solicitors/`.
- `solicitor_postcode_checked` (`event_category: 'solicitor_application'`, `audience_role: 'Solicitor Partner'`) — office postcode/radius lookup.
- `solicitor_application_submitted` (`event_category: 'solicitor_application'`, `audience_role: 'Solicitor Partner'`) — successful firm onboarding submission.

### C. Trust & Navigation (Site-Wide)
- `outbound_citation_click` (`event_category: 'trust_citation'`) — via `trackOutboundCitation()` in `lib/telemetry.ts`.
- Internal header/nav clicks (e.g., website header logo click) — use `trackClientEvent('nav_logo_click', { event_category: 'navigation' })` instead of UTMs.

---

## 3. Consent Mode v2, PECR & PII Guardrails

- **Default Denied**: `app/layout.tsx` sets `analytics_storage: 'denied'` unless `sc_cookie_consent` cookie (`v: '2026-11'`) grants `analytics: true`.
- **URL PII Stripping**: `app/layout.tsx` strips `salary`, `offer`, `age`, `reason`, `discrimination`, `yearsNum`, `monthsNum`, `years`, `contractualNotice`, `offerIncludesNotice` from `page_location` on initial load while **preserving `utm_*` parameters**. Ensure GTM History Change / Page View triggers also strip these parameters on client-side soft navigations (`/calculator/` → `/results/`).
- **Zero PII in Events**: Never include `email`, `phone`, `firstName`, `postcode`, or `sra_number` in `trackClientEvent()` payloads.
