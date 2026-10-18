---
name: calculator-and-data
description: Statutory calculation logic, April 2026 caps, verdict mathematical formulas, Supabase database schemas, and OTP security flow for SettlementCheck.
---

# SettlementCheck — Calculator & Data Layer Skill

Mathematical formulas, statutory rates, Supabase table definitions, and OTP verification pipeline.

## 1. Statutory Rates (April 2026, SI 2026/310)

- **Weekly Pay Cap (GB)**: **£751** (Employment Rights Act 1996 s.227)
- **Weekly Pay Cap (NI)**: **£783** (Employment Rights Order (NI) 1996)
- **Redundancy Multiplier by Age**:
  - Under age 22 = 0.5× week's pay per year of service
  - Age 22 to 40 = 1.0× week's pay per year of service
  - Age 41 and over = 1.5× week's pay per year of service
- **Maximum Service Years**: 20 years strictly capped (ERA 1996 s.162)
- **Maximum Statutory Redundancy Pay (GB)**: £22,530 (20 × 1.5 × £751)
- **Unfair Dismissal Compensatory Award Cap**: £123,543 (ERA 1996 s.124)
- **Tax Exemption Threshold**: £30,000 (ITEPA 2003 s.403)
- **Statutory Notice Pay**:
  - Under 1 month = 0 weeks
  - 1 month to 2 years = 1 week
  - 2 to 12 years = 1 week per full year of service
  - 12+ years = capped at 12 weeks

---

## 2. Verdict Mathematical Engine (`lib/calculations.ts`)

```typescript
redundancyPay = weeklyPay × cappedYears × multiplier   // 0 if reason != redundancy
noticePay     = weeklyPay × noticeWeeks
minimum       = redundancyPay + noticePay
typicalLow    = Math.max(minimum × 1.5, monthSalary × 2)
typicalHigh   = Math.max(minimum × 4,   monthSalary × 6)

// Verdict Thresholds:
if (reason === 'redundancy' && offer < minimum) -> BELOW_MINIMUM
else if (offer < typicalLow)                    -> BELOW_TYPICAL
else if (offer >= typicalLow && offer <= typicalHigh) -> WITHIN_RANGE
else                                            -> ABOVE_TYPICAL

discriminationFlag = (discrimination === 'yes' || discrimination === 'not_sure')
```

---

## 3. Supabase Schema Architecture

Three core tables: `leads`, `otp_verifications`, `solicitor_applications`.

- **`leads`**:
  `id`, `created_at`, `salary`, `years_service`, `age`, `offer_amount`, `reason`, `discrimination`, `verdict`, `minimum_estimate`, `typical_low`, `typical_high`, `discrimination_flag`, `first_name`, `email`, `phone`, `preferred_time`, `status` (`new` / `sent` / `closed`), `email_verified` (boolean), `notes`.
- **`otp_verifications`**:
  `id`, `created_at`, `email`, `code` (6-digit string), `expires_at` (now + 10 min), `used` (boolean), `attempts` (int, max 5).
- **`solicitor_applications`**:
  `id`, `created_at`, `firm_name`, `contact_name`, `email`, `phone`, `geographic_coverage`, `sra_regulated`, `cases_per_year`, `status` (`pending` / `approved` / `rejected`).

**Row-Level Security (RLS)**:
- Anonymous `INSERT` permitted on `solicitor_applications`.
- Lead and OTP tables are secured with RLS: all mutations execute server-side via `SUPABASE_SERVICE_ROLE_KEY` inside Next.js API routes (`/api/lead/`, `/api/verify-otp/`).

---

## 4. OTP Verification Pipeline

```text
Step 1: User fills lead form → POST /api/send-otp { email, first_name }
        Generate 6-digit cryptographic code, persist in otp_verifications, send via Resend.

Step 2: User enters code → POST /api/verify-otp { email, code, ...leadData }
        Verify code matches, not expired, attempts < 5.
        Mark otp as used, insert verified record into leads (email_verified: true).

Step 3: Success state rendered in UI.
```
- **Brute Force Protection**: Increment attempts on each invalid guess; return HTTP 429 after 5 failures.
- **Resend Origin**: `verify@settlementcheck.co.uk`.
