# ForSolicitors Onboarding & Inbound Acquisition Implementation Plan

> **Target Route:** `/for-solicitors/` (`app/for-solicitors/page.tsx`, `app/for-solicitors/ForSolicitorsClient.tsx`)  
> **Supporting Routes & APIs:** `/api/solicitor-application/`, `/api/solicitor-application/verify/`, `/api/solicitor-demand/`, `/portal/`, `components/Nav.tsx`  
> **Database:** Supabase (`solicitor_applications`, `solicitor_panel`, `leads`)  
> **Audit Status:** Revised & hardened after Pre-Implementation Technical, Legal Compliance & CRO Audit

---

## How to Run This Plan

Execute one phase at a time using the **Execution Prompt** embedded at the end of each phase. Every prompt automatically loads the required skills/agents, enforces the phase's verification gate, and **outputs the next phase's prompt** upon completion so you can chain Phases 1 → 6 seamlessly.

---

## Executive Summary

An audit of `/for-solicitors/` revealed **6 live code/security/UX defects** and **4 structural conversion & acquisition blockers** preventing employment law solicitors from discovering and completing panel onboarding:

1. **Broken Data & Compliance Mechanics:** `SraSlide` stores `sraId` (`'568912'`) and `feeShieldAgreed` (`true`) in local child state, never passes `sra_number` to `submitApplication()`, and `POST /api/solicitor-application/` never persists `sra_number`. Additionally, `ForSolicitorsClient.tsx` initializes `coverage_radius_miles` to `null` (colliding with `National: null`), and `route.ts` interpolates unescaped `contact_name` and `firm_name` into the applicant confirmation email HTML while mixing `hello@` and `team@settlementcheck.co.uk`.
2. **Mid-Form OTP Momentum Killer:** An 8-step Typeform wizard with a mandatory 6-digit email OTP gate at **Step 4** forces busy partners/fee earners to leave the page and wait on corporate spam filters (Mimecast/Outlook) *before* selecting their territory.
3. **Regulatory & COLP Trust Gaps:** No explicit SRA Rule 5.1 / LASPO 2012 compliance explanation, no conflict-of-interest credit guarantee, and phrasing across lines 1199, 1663, 1666, 1926, and 2508 that risks Trap 5 (implied statutory fee payment / missing abortive-fee contingency) or CAP Code substantiation (*"universally cover"*).
4. **Zero Inbound Pull ("Uber Driver" Flywheel):** `/for-solicitors/` is absent from top navigation (`Nav.tsx`), lacks B2B SEO keyword targeting, and shows no real-time regional demand signals when a firm checks its postcode.

---

## Phase 1: Database Schema & Backend API Hardening

**Objective:** Fix data loss, HTML injection, duplicate handling, and validation on the database and API layer first—without wasting effort patching the 8-slide UI that Phase 2 replaces.

### Required Agents & Skills
- **`supabase-postgres-best-practices`** + **`calculator-and-data`**: Schema migration, indexes, and RLS verification on `solicitor_applications`.
- **`legal-compliance-auditor`** + **`claims-privacy-auditor`**: Validate explicit `sra_confirmed` & `fee_shield_agreed` persistence and UK GDPR hygiene.
- **`stack-and-architecture`**: API validation, rate limiting (`lib/security/rate-limiter.ts`), and email standardisation.

### Implementation Tasks
1. **Database Migration (`supabase/migrations/` & `supabase/schema.sql`):**
   - Add columns to `solicitor_applications`:
     - `sra_number text`
     - `fee_shield_agreed boolean not null default false`
     - `email_verified boolean not null default false`
     - `verification_token_hash text`
     - `verification_token_expires_at timestamptz`
   - Add partial unique index on `(lower(email)) WHERE status = 'pending'` (or handle duplicate pending applications gracefully with a friendly `409` / upsert update).
   - Update `supabase/schema.sql` line 25 comment (remove stale *"Email is verified via OTP before the application is accepted"*).
2. **Backend API Hardening (`app/api/solicitor-application/route.ts`):**
   - Strictly validate `email` format, `sra_number` (`/^\d{5,7}$/`), `sra_confirmed === true`, and `fee_shield_agreed === true`.
   - Persist `sra_number`, `fee_shield_agreed`, `email_verified: false`, `verification_token_hash` (SHA-256 of CSPRNG `crypto.randomBytes(32).toString('hex')`), and `verification_token_expires_at` (`+48h`).
   - Apply `escapeHtml()` to `contact_name` and `firm_name` in the applicant confirmation email HTML (lines 152–153), matching the owner notification email.
   - Standardise all reply-to/support email references to `team@settlementcheck.co.uk` (replacing `hello@settlementcheck.co.uk` on lines 145 & 154).

### Phase 1 Verification Gate
```bash
npx tsc --noEmit
```

### Phase 1 Execution Prompt (Copy & Paste)
```text
Execute Phase 1 of @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md.

Load skills: @supabase-postgres-best-practices @calculator-and-data @legal-compliance-auditor @claims-privacy-auditor @stack-and-architecture

Tasks:
1. Create a new Supabase migration in `supabase/migrations/` adding `sra_number`, `fee_shield_agreed`, `email_verified`, `verification_token_hash`, and `verification_token_expires_at` to `solicitor_applications`, plus a partial unique index on `(lower(email)) WHERE status = 'pending'`. Update `supabase/schema.sql` accordingly (including removing the stale OTP comment on line 25).
2. Harden `app/api/solicitor-application/route.ts`:
   - Validate `email`, `sra_number` (`/^\d{5,7}$/`), `sra_confirmed === true`, and `fee_shield_agreed === true`.
   - Handle duplicate pending applications gracefully (friendly 409 or controlled upsert).
   - Generate a CSPRNG verification token, store its SHA-256 hash + 48h `verification_token_expires_at`, and include the verification link in the applicant email.
   - Apply `escapeHtml()` to `contact_name` and `firm_name` in the applicant confirmation email HTML and standardise `team@settlementcheck.co.uk` across all copy.
3. Run `npx tsc --noEmit` and confirm zero TypeScript errors.

When Phase 1 is complete and verified, automatically output the Phase 2 Execution Prompt from @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md in your final response so I can run Phase 2 next.
```

---

## Phase 2: Frictionless 2-Step Onboarding, Safe-Links Verification & Mobile UX

**Objective:** Replace the 8-screen OTP-gated Typeform wizard with a high-velocity **2-step progressive form** (~45 seconds to complete), move email verification post-submission with corporate Safe Links protection, and resolve all UI/mobile defects in one pass.

### Required Agents & Skills
- **`journey-architect`**: Preserve postcode/lookup state seamlessly from the Hero Postcode Checker into Step 1.
- **`cro`** + **`cro/references/form.md`**: Field reduction, visible labels, single-column mobile layout, inline validation, and explicit unselected defaults.
- **`onboarding`**: Apply Minimum Path to Value (MPTV) and Endowed Progress Effect (pre-filling territory when checked in hero).
- **`ux-heuristics`** + **`stack-and-architecture`**: Single primary CTA per viewport, 44px+ tap targets, `375px` responsive header/inputs, Next.js `<Link>` navigation.

### Implementation Tasks
1. **Collapse 8 Slides into 2 Focused Steps (`app/for-solicitors/ForSolicitorsClient.tsx`):**
   - Lift `sra_number` and `fee_shield_agreed` into parent `FormData` so `submitApplication()` sends the full validated payload.
   - Initialize `coverage_radius_miles` to `undefined` (or `'unset'`)—distinct from `null` (`National`)—so `National` only highlights when explicitly selected and Step 1 validates that a choice was made.
   - Initialize `sra_number` to `''` (empty string) and `fee_shield_agreed` to `false` (explicit opt-in required).
   - **Step 1 — Territory & Firm (4 fields):**
     - `Office Postcode` (auto-populated if already checked in hero, with live `postcodes.io` district badge)
     - `Coverage Radius` (`25 miles` | `50 miles` | `100 miles` | `National`)
     - `Firm Name`
     - `Work Email`
   - **Step 2 — Contact & SRA Compliance (4 fields):**
     - `Contact Name` (Partner / Designated Fee Earner)
     - `Direct Telephone` (optional)
     - `SRA Firm Number` (5–7 digits, label: `"✓ Valid 5–7 digit SRA format"` — never implying live SRA API lookup)
     - Explicit unchecked `SC-B-024` Fee Shield + SRA 5.1 Partner Terms checkbox → **Submit**
2. **Post-Submit Email Verification with Corporate Safe-Links Protection (`app/api/solicitor-application/verify/route.ts`):**
   - Because UK law firms use Mimecast / Microsoft Defender Safe Links (which auto-prefetch `GET` URLs), `GET /api/solicitor-application/verify/?token=...` **must NOT mutate database state**.
   - Instead, `GET` renders a lightweight branded confirmation page with a `"Confirm Work Email"` button that submits `POST /api/solicitor-application/verify/` (rate-limited via `rateLimitRequest`), verifies the SHA-256 hash + 48h TTL, sets `email_verified = true`, and clears `verification_token_hash` (single-use).
3. **Mobile & Navigation Hygiene (`ForSolicitorsClient.tsx`):**
   - Fix `375px` mobile header crowding (hide/collapse `"Solicitor Panel Portal"` badge on `<640px`), allow flex-wrap on the hero postcode checker and SRA badge row.
   - Replace raw `<a href="/portal/?demo=true">` and `<a href="/">` with Next.js `<Link>`.
   - On `SuccessSlide`, show a 3-step next-action checklist (1. Confirm work email via link, 2. SRA Register check within 1 business day, 3. Explore `/portal/?demo=true` now).

### Phase 2 Verification Gate
```bash
npx tsc --noEmit
npm run check:links
```

### Phase 2 Execution Prompt (Copy & Paste)
```text
Execute Phase 2 of @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md.

Load skills: @journey-architect @cro @onboarding @ux-heuristics @stack-and-architecture

Tasks:
1. Refactor `app/for-solicitors/ForSolicitorsClient.tsx` to replace the 8-slide OTP-gated wizard with the 2-step progressive form (Step 1: Office Postcode, Coverage Radius, Firm Name, Work Email; Step 2: Contact Name, Direct Phone, SRA Firm Number, explicit unchecked SC-B-024 Fee Shield + SRA 5.1 consent).
2. Lift `sra_number` (default `''`) and `fee_shield_agreed` (default `false`) into `FormData`, distinguish unselected `coverage_radius_miles` from `National` (`null`), reset `advancingRef` on back navigation, fix `375px` mobile header/input wrapping, and replace raw `<a>` internal links with Next.js `<Link>`.
3. Create `app/api/solicitor-application/verify/route.ts` with corporate Safe-Links protection (`GET` renders a branded confirmation button without mutating DB; `POST` rate-limits, verifies SHA-256 token + 48h TTL, sets `email_verified = true`, and clears the token hash).
4. Run `npx tsc --noEmit && npm run check:links` and confirm zero errors.

When Phase 2 is complete and verified, automatically output the Phase 3 Execution Prompt from @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md in your final response so I can run Phase 3 next.
```

---

## Phase 3: Solicitor Psychology, COLP Trust & Compliance Copy Overhaul

**Objective:** Address the specific commercial and regulatory objections of UK employment law partners and COLPs while eliminating all Trap 5 and CAP Code compliance risks across `ForSolicitorsClient.tsx`.

### Required Agents & Skills
- **`conversion-copywriter`**: Rewrite hero, objections, FAQs, and CTAs in plain, authoritative UK legal English.
- **`legal-compliance-auditor`**: Audit SRA Rule 5.1, LASPO 2012 referral-fee boundaries, Section 203(3) ERA 1996 accuracy, and **Trap 5** (fee contribution contingencies).
- **`claims-privacy-auditor`**: Eliminate unsubstantiated absolute claims (*"universally cover"*) and verify UK GDPR notice for applicant data.

### Implementation Tasks
1. **Fix All Fee Contribution & Substantiation Copy in `ForSolicitorsClient.tsx` (lines 1199, 1663, 1666, 1926, 2508):**
   - **Trap 5 & CAP Code Alignment:** Never state that fees are *"paid under Section 203"* or that employers *"universally cover"* legal costs.
   - **Standardised Replacement:** *"While Section 203(3) ERA 1996 requires independent legal advice for a valid waiver, UK employers standardly provide a capped commercial contribution (typically £350–£750+ + VAT, and higher for senior exits) paid directly to your firm upon completion of the agreement."*
   - **Abortive-Cost Clarity (`SC-B-024`, line 2508):** Explicitly clarify that the zero-employee-shortfall covenant applies to **completed** standard Section 203(3) statutory reviews where the employer contribution is £500 + VAT or higher, and note that abortive fees (if an employee aborts or declines to sign) or extended negotiation work remain governed by the firm's engagement terms.
2. **Add Dedicated "SRA Compliance & Conflict Guarantee" Section:**
   - **SRA Rule 5.1 & LASPO 2012 Transparency:** Explicitly explain that SettlementCheck operates as a transparent introducer platform with zero prohibited fee-sharing on client damages and full solicitor independence.
   - **Conflict-of-Interest Protection:** State clearly that if a firm's conflict check identifies an existing relationship with the employer, the instruction can be declined immediately with zero penalty and re-routed.
   - **Minimum Fee / Matter Preferences:** Clarify that during onboarding, firms can set preferred matter tiers (e.g., minimum employer fee contribution or senior/director exits).
3. **Update Timeline Expectation Copy:**
   - Replace *"Application takes under 3 minutes"* (line 2022) with *"Register your practice in under 60 seconds"*.

### Phase 3 Verification Gate
```bash
npm run audit:legal
npm run audit:claims
npm run audit:copy
```

### Phase 3 Execution Prompt (Copy & Paste)
```text
Execute Phase 3 of @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md.

Load skills: @conversion-copywriter @legal-compliance-auditor @claims-privacy-auditor

Tasks:
1. Audit and update all fee-contribution, Trap 5, and CAP Code copy in `app/for-solicitors/ForSolicitorsClient.tsx` (specifically lines 1199, 1663, 1666, 1926, and 2508 / `SC-B-024`), removing *"universally cover"* and *"paid... under Section 203"* and adding explicit completion-contingency & abortive-cost clarity.
2. Add a dedicated "SRA Compliance & Conflict Guarantee" section covering SRA Rule 5.1 / LASPO 2012 transparency, zero-penalty conflict-check re-routing, and configurable minimum employer fee/matter tier preferences.
3. Update the application time expectation copy to reflect the 60-second 2-step flow.
4. Run `npm run audit:legal && npm run audit:claims && npm run audit:copy` and confirm all checks pass.

When Phase 3 is complete and verified, automatically output the Phase 4 Execution Prompt from @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md in your final response so I can run Phase 4 next.
```

---

## Phase 4: Live Demand Signals & Partner Portal "Aha Moment"

**Objective:** Replicate the Uber "live rider demand nearby" psychological pull using real, privacy-safe database telemetry (strictly obeying `AGENTS.md` §4.6 EBIAP and UK GDPR k-anonymity).

### Required Agents & Skills
- **`calculator-and-data`** + **`supabase-postgres-best-practices`**: Build an aggregated, k-anonymous regional demand endpoint querying `leads` (`consent = true`) and `solicitor_panel` (`status = 'active'`).
- **`cro-architect`**: Ensure telemetry-backed conversion nudges without leaking employee PII or enabling small-area re-identification.
- **`refactoring-ui`**: Polish the Hero Postcode Checker result card and `/portal/?demo=true` banner.

### Implementation Tasks
1. **Create `GET /api/solicitor-demand/?postcode=...`:**
   - Apply `rateLimitRequest` (`lib/security/rate-limiter.ts`).
   - Resolve postcode `admin_district`, `region`, `latitude`, `longitude` via `postcodes.io`.
   - Query `leads` where `consent = true` and `created_at >= now() - interval '30 days'`, filtering by Haversine distance in TypeScript against `postcode_lat`/`postcode_lng`.
   - Query `solicitor_panel` where `status = 'active'` to check existing territorial coverage.
   - **k-Anonymity & Privacy Guardrail:** Only return `activeDemandCount` when `count >= 3` within the 30-day window (otherwise omit count and return `"Territory open for exclusive allocation"`). Omit `avgOfferBand` from the public unauthenticated endpoint (or gate strictly to `count >= 5`). Never fabricate numbers.
2. **Upgrade Hero Postcode Checker (`ForSolicitorsClient.tsx`):**
   - Display real regional availability + aggregated recent enquiry count (when `>= 3`) alongside a direct `"Claim [District] Territory →"` button that pre-fills Step 1.
3. **Close the `/portal/?demo=true` Loop (`app/portal/PortalClient.tsx`):**
   - Pass `?from=portal-demo` from the demo banner into `/for-solicitors/` and track `solicitor_demo_to_apply` in GA4.

### Phase 4 Verification Gate
```bash
npx tsc --noEmit
npm run test:evals
npm run audit:claims
```

### Phase 4 Execution Prompt (Copy & Paste)
```text
Execute Phase 4 of @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md.

Load skills: @calculator-and-data @supabase-postgres-best-practices @cro-architect @refactoring-ui

Tasks:
1. Create `app/api/solicitor-demand/route.ts` with `rateLimitRequest`, `postcodes.io` lookup, Haversine filtering over `leads` (`consent = true`, last 30 days), `solicitor_panel` (`status = 'active'`) coverage check, and strict k-anonymity (`activeDemandCount` only returned when `>= 3`, no unauthenticated `avgOfferBand` leakage, zero fabricated numbers).
2. Upgrade the Hero Postcode Checker in `app/for-solicitors/ForSolicitorsClient.tsx` to display live regional availability + k-anonymous demand telemetry and pre-fill Step 1 via `"Claim [District] Territory →"`.
3. Update `app/portal/PortalClient.tsx` demo banner link to `/for-solicitors/?from=portal-demo` and track `solicitor_demo_to_apply` in GA4.
4. Run `npx tsc --noEmit && npm run test:evals && npm run audit:claims` and confirm zero errors.

When Phase 4 is complete and verified, automatically output the Phase 5 Execution Prompt from @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md in your final response so I can run Phase 5 next.
```

---

## Phase 5: Inbound Acquisition Flywheel ("Uber Driver" Pull) & B2B SEO

**Objective:** Build repeatable inbound channels so SRA employment solicitors proactively discover SettlementCheck and apply without cold outbound dependency.

### Required Agents & Skills
- **`seo-architect`**: B2B keyword targeting, metadata, and `Service`/`FAQPage` JSON-LD schema on `/for-solicitors/`.
- **`sentinel-fleet`**: Automated detection of uncovered postcodes when verified employee leads arrive.
- **`cro-architect`** + **`link-checker`**: Navigation discoverability, internal linking, and trailing-slash compliance.

### Implementation Tasks
1. **B2B SEO Metadata & Structured Data (`app/for-solicitors/page.tsx`):**
   - Update `<title>` and `<meta description>` to target high-intent B2B queries (*"Employment Law Settlement Agreement Leads | SRA Partner Panel | SettlementCheck"*).
   - Add `FAQPage` and `WebPage` JSON-LD schema matching the updated solicitor FAQs.
2. **Surface `/for-solicitors/` in Primary Navigation (`components/Nav.tsx`):**
   - Add a low-contrast `text-muted` `"For Solicitors"` link in the desktop nav (and bottom of mobile drawer), keeping the mobile sticky header bar 100% focused on the employee CTA (`Check my offer →`).
3. **Neutral Printable Attribution + Web-Only Partner Link (`app/results/`):**
   - Keep printable employee statutory summaries strictly neutral (*"Calculated via SettlementCheck.co.uk · April 2026 UK statutory rates"*). Any `"For Solicitors"` partner link on `/results/` must be `print:hidden` so it never appears as commercial solicitation on documents handed to HR or a solicitor.
4. **"Unclaimed Matter Alert" Outbound-to-Inbound Trigger (Ops/Worker Spec):**
   - Extend `lib/agentic-engine/workers/` to flag `leads` (`consent = true`) in locations with **0 active `solicitor_panel` firms**.
   - **Privacy Guardrail:** Any outbound alert brief sent to local SRA firms must use **coarse region + banded offer tier only** (e.g., *"Redundancy enquiry in Greater Manchester (£20k–£35k band)"*)—never outward codes or exact offer figures—to prevent employee re-identification.

### Phase 5 Verification Gate
```bash
npx tsc --noEmit
npm run check:links
npm run verify
```

### Phase 5 Execution Prompt (Copy & Paste)
```text
Execute Phase 5 of @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md.

Load skills: @seo-architect @sentinel-fleet @cro-architect @link-checker

Tasks:
1. Update `app/for-solicitors/page.tsx` metadata (`<title>`, `<meta description>`) for B2B solicitor search intent and add valid `FAQPage` + `WebPage` JSON-LD schema.
2. Add a low-contrast `text-muted` `"For Solicitors"` link in `components/Nav.tsx` desktop nav and bottom of the mobile drawer (keep mobile sticky bar employee-focused).
3. On `/results/` printable summaries, ensure attribution stays strictly neutral and any partner link uses `print:hidden`.
4. Implement the privacy-safe Unclaimed Matter Alert detector in `lib/agentic-engine/workers/` (coarse region + banded offer tier only, zero outward codes or exact figures).
5. Run `npx tsc --noEmit && npm run check:links && npm run verify` and confirm full pass.

When Phase 5 is complete and verified, automatically output the Phase 6 Execution Prompt from @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md in your final response so I can run Phase 6 next.
```

---

## Phase 6: Post-Deploy Measurement & Continuous CRO

**Objective:** Verify funnel lift, measure step-by-step drop-off, and validate lead quality.

### Required Agents & Skills
- **`cro-architect`**: Pull 28-day GA4 funnel (`solicitor_form_step`, `solicitor_application_submitted`, `solicitor_demo_to_apply`) via `npm run cro:data` and run `npm run audit:cro`.
- **`ux-heuristics`**: Dual-viewport (`1440×900` desktop + `375×812` mobile) visual & interaction check.

### Success Metrics
- Step 1 → Step 2 completion rate vs. baseline 8-step OTP wizard.
- Hero postcode check → application submission conversion rate.
- `email_verified` confirmation rate within 24 hours of submission.
- Zero `npm run verify` / `audit:legal` / `audit:claims` regressions.

### Phase 6 Execution Prompt (Copy & Paste)
```text
Execute Phase 6 of @docs/FOR_SOLICITORS_IMPLEMENTATION_PLAN.md.

Load skills: @cro-architect @ux-heuristics

Tasks:
1. Run `npm run cro:data` and `npm run audit:cro` to capture baseline/post-change GA4 funnel telemetry (`solicitor_form_step`, `solicitor_application_submitted`, `solicitor_demo_to_apply`) and `solicitor_applications` `email_verified` rates.
2. Inspect `/for-solicitors/` at `1440×900` (desktop) and `375×812` (mobile) for layout, tap-target, and single-CTA compliance.
3. Produce a concise post-launch CRO scorecard and next-experiment recommendations.
```
