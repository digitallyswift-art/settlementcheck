---
name: tracking-analytics
description: >-
  Audits and generates uniform GA4 event schemas, Consent Mode v2 telemetry,
  and outbound UTM naming conventions for SettlementCheck. Enforces strict
  separation between Employee Client Leads and Solicitor Onboarding Leads.
  Use when adding or reviewing UTMs, email links, or GA4 events. Do NOT use
  for CRO copywriting (use cro-architect) or link 404 checks (use link-checker).
---

# Tracking & Analytics Skill

Standardises GA4 event tracking and outbound UTM attribution across **SettlementCheck (`settlementcheck.co.uk`)** using [lib/utm.ts](../../../lib/utm.ts) and [lib/telemetry.ts](../../../lib/telemetry.ts) so traffic quality, email engagement, and B2C vs B2B conversions are reported cleanly—and understood at a glance by any non-technical stakeholder.

---

## 1. Non-Negotiable Architecture Rules

1. **Strict B2C vs B2B Lead Separation (The Conversion Moat)**:
   - **Employee Client Leads** (`/get-matched/`): Exclusively fire `generate_lead`, `qualify_lead`, and `lead_submitted` with `event_category: 'employee_lead'` and `audience_role: 'Employee Client'`.
   - **Solicitor Partner Onboarding** (`/for-solicitors/`): **NEVER** fire `generate_lead` or `qualify_lead`. Fire `solicitor_application_submitted` (plus `solicitor_form_step`, `solicitor_postcode_checked`) with `event_category: 'solicitor_application'` and `audience_role: 'Solicitor Partner'`.
   - **GA4 Admin Requirement**: `audience_role` must be registered as an **Event-scoped Custom Dimension** in GA4 Admin so it appears in standard reports and Explorations. See [ga4-event-contract.md](./references/ga4-event-contract.md).

2. **UTMs Are Strictly for External/Outbound Links — NEVER Internal Site Links**:
   - **Allowed**: Outbound emails (header logo, primary CTA, article cards, solicitor alerts), social posts, paid ads, and partner referrals.
   - **Forbidden**: Internal `<Link href="...">`, `<a>`, or `router.push(...)` inside `settlementcheck.co.uk` (e.g., website `Nav.tsx` logo, footer, guide cards). Putting `utm_*` on internal links overwrites the user's original acquisition source. Use `trackClientEvent()` instead.

3. **Central Builder & GA4-Safe UTM Naming (`lib/utm.ts`)**:
   - Always generate outbound URLs via `buildTrackedUrl()` in [lib/utm.ts](../../../lib/utm.ts)—never hand-concatenate `?utm_source=...` strings.
   - Every UTM value must match `^[a-z0-9_]+$` (lowercase `snake_case` only).
   - Use `utm_medium=email` for all emails so GA4 Default Channel Grouping natively classifies them under **Email** (distinguish transactional vs onboarding in `utm_campaign`, e.g. `employee_call_prep`, `employee_save_results`, `solicitor_onboarding_welcome`).
   - See [utm-taxonomy.md](./references/utm-taxonomy.md).

4. **UK PECR & PII Hygiene (`app/layout.tsx`)**:
   - Never pass PII (`email`, `phone`, `name`, `postcode`, `sra_number`) or financial inputs (`salary`, `offer`, `age`) in GA4 event params.
   - Be mindful of Next.js App Router soft navigations: `app/layout.tsx` strips sensitive query params on initial hard load; any GTM Page View / History Change trigger must not forward raw `salary`/`offer`/`discrimination` params.

---

## 2. Core Workflows

### A. Generate UTMs (`utm [channel] [campaign] [destination]`)
1. Consult [utm-taxonomy.md](./references/utm-taxonomy.md) and use `buildTrackedUrl()` / `guideUtmContent()` from [lib/utm.ts](../../../lib/utm.ts).
2. For outbound emails, ensure **every** clickable link—including the **email header logo** (`utm_content=header_logo`), **primary CTA**, and **article/guide links** (`utm_content=guide_<slug>`)—is wrapped with `buildTrackedUrl()`.

### B. Audit Tracking & Lead Separation (`audit tracking`)
1. Run the deterministic audit script:
   ```bash
   node .agents/skills/tracking-analytics/scripts/audit-tracking.mjs
   ```
2. Verify zero errors for:
   - Internal links / `router.push` containing `utm_`
   - Non-`snake_case` UTM values (including `%20`, `.`, uppercase, hyphens)
   - B2C events (`generate_lead`, `qualify_lead`, `lead_submitted`) mixed with solicitor onboarding
   - Outbound email templates missing `buildTrackedUrl` / `utm_source`
   - Lead/funnel events missing `audience_role`
