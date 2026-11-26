# Uniform UTM Naming Convention & Matrix

All outbound links pointing to `https://settlementcheck.co.uk` **must** be built with `buildTrackedUrl()` in [lib/utm.ts](../../../../lib/utm.ts) so GA4 Default Channel Grouping and custom campaign reports classify traffic quality accurately.

---

## 1. Formatting Rules (Strict)

1. **Character Set**: Lowercase `snake_case` only (`^[a-z0-9_]+$`). Never use spaces, uppercase letters, hyphens (`-`), dots, or `%20`.
2. **Canonical URL**: Always `https://settlementcheck.co.uk` (non-www) + trailing slash (`/`) before `?utm_source=...`. `buildTrackedUrl()` enforces this automatically and safely merges with existing query params and `#hash` fragments.
3. **Never on Internal Links**: Do **not** append `utm_*` to `<Link>`, `<a>`, or `router.push()` inside the Next.js web app (`Nav.tsx`, `Footer.tsx`, guide cards). Internal UTMs break GA4 session attribution.
4. **GA4 Default Channel Grouping Alignment**: Always use `utm_medium=email` for email traffic (never `transactional_email` or `solicitor_alert` as `utm_medium`) so GA4 natively buckets all email clicks into the **Email** channel rather than `Unassigned`. Differentiate email types in `utm_campaign`.

---

## 2. Standard Parameter Dictionary

| Parameter | Purpose | Allowed Values / Pattern |
| :--- | :--- | :--- |
| `utm_source` | **Who** sent the traffic | `email`, `google`, `bing`, `linkedin`, `reddit`, `facebook`, `partner_<firm_slug>` |
| `utm_medium` | **How** it arrived (matches GA4 Channel Grouping) | `email`, `cpc`, `paid_social`, `organic_social`, `referral` |
| `utm_campaign` | **Why** / which initiative (`employee_*` or `solicitor_*`) | `employee_call_prep`, `employee_save_results`, `solicitor_lead_alert`, `solicitor_onboarding_welcome` |
| `utm_content` | **Which exact link/button** was clicked | `header_logo`, `primary_cta_revisit_calc`, `primary_cta_solicitor_match`, `guide_<slug>`, `footer_home` |
| `utm_term` | Optional keyword or A/B variant | `variant_a`, `settlement_agreement_solicitor` |

> **Why prefix `utm_campaign` with `employee_` or `solicitor_`?**
> Any non-technical stakeholder opening GA4 *Traffic acquisition* immediately sees whether a campaign brought **Employee Clients** or **Solicitor Partners** without needing regex filters.

---

## 3. Outbound Email UTM Matrix

### A. Employee Lead Confirmation / Call-Prep Email (`lib/leads/lead-ingestion-service.ts`)
- **Email Header Logo** (`/`):
  `utm_source=email&utm_medium=email&utm_campaign=employee_call_prep&utm_content=header_logo`
- **Primary CTA** (`/results/` or `/calculator/`):
  `utm_source=email&utm_medium=email&utm_campaign=employee_call_prep&utm_content=primary_cta_revisit_calc` (or `primary_cta_run_calc`)
- **Recommended Guide Cards** (`/guides/<slug>/`):
  `utm_source=email&utm_medium=email&utm_campaign=employee_call_prep&utm_content=guide_<slug>` (via `guideUtmContent(g.path)`)

### B. Save Results & 3-Point Checklist Email (`app/api/save-results/route.ts`)
- **Email Header Logo** (`/`):
  `utm_source=email&utm_medium=email&utm_campaign=employee_save_results&utm_content=header_logo`
- **Primary CTA** (`/results/?...#solicitor-intake-card`):
  `utm_source=email&utm_medium=email&utm_campaign=employee_save_results&utm_content=primary_cta_solicitor_match`

### C. Solicitor Partner Emails (Onboarding & Lead Alerts)
- **Email Header Logo** (`/for-solicitors/` or `/`):
  `utm_source=email&utm_medium=email&utm_campaign=solicitor_onboarding_welcome&utm_content=header_logo`
- **Dossier / Claim Lead CTA**:
  `utm_source=email&utm_medium=email&utm_campaign=solicitor_lead_alert&utm_content=claim_dossier_cta`

---

## 4. Paid, Social & Partner Channels

| Channel | `utm_source` | `utm_medium` | `utm_campaign` Example | `utm_content` Example |
| :--- | :--- | :--- | :--- | :--- |
| Google Ads (Employee) | `google` | `cpc` | `employee_calculator_search` | `rsa_redundancy_v1` |
| LinkedIn Ads (Solicitor) | `linkedin` | `paid_social` | `solicitor_panel_recruitment` | `carousel_fee_shield` |
| LinkedIn Organic | `linkedin` | `organic_social` | `employee_april2026_rates` | `post_link` |
| Partner Referral | `partner_<slug>` | `referral` | `employee_partner_handoff` | `sidebar_widget` |
