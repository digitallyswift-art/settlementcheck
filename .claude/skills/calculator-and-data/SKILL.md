# Skill: Calculator & Data Layer

## Statutory rates 2025/26

- Weekly pay cap: **£719**
- Redundancy multiplier by age: under 22 = 0.5×, 22–40 = 1.0×, 41+ = 1.5×
- Max years counted: 20
- Notice pay: <1 month = 0 weeks, <2 years = 1 week, 2–12 years = 1 week/year, 12+ years = capped at 12 weeks

## Verdict logic (`lib/calculations.ts` → `getVerdict()`)

```
redundancyPay = weeklyPay × cappedYears × multiplier   (0 if not redundancy)
noticePay     = weeklyPay × noticeWeeks
minimum       = redundancyPay + noticePay
typicalLow    = max(minimum × 1.5, monthSalary × 2)
typicalHigh   = max(minimum × 4,   monthSalary × 6)

BELOW_MINIMUM  → reason=redundancy AND offer < minimum
BELOW_TYPICAL  → offer < typicalLow
WITHIN_RANGE   → typicalLow ≤ offer ≤ typicalHigh
ABOVE_TYPICAL  → offer > typicalHigh

discriminationFlag = true if discrimination = 'yes' or 'not_sure'
```

## Supabase schema (to be created)

Three tables: `leads`, `otp_verifications`, `solicitor_applications`

**leads:** id, created_at, salary, years_service, age, offer_amount, reason, discrimination, verdict, minimum_estimate, typical_low, typical_high, discrimination_flag, first_name, email, phone, preferred_time, status (new/sent/closed), email_verified, notes

**otp_verifications:** id, created_at, email, code (text, 6 digits), expires_at (now+10min), used (bool), attempts (int, max 5)

**solicitor_applications:** id, created_at, firm_name, contact_name, email, phone, geographic_coverage, sra_regulated, cases_per_year, status (pending/approved/rejected)

**RLS:** anon INSERT only on solicitor_applications. All lead/OTP writes go through service_role key in API routes.

## OTP flow (to be built)

```
STATE 1: User fills lead form → POST /api/send-otp { email, first_name }
  → generate 6-digit code, store in otp_verifications, send via Resend

STATE 2: User enters code → POST /api/verify-otp { email, code, ...leadData }
  → check code matches, not expired, attempts < 5
  → mark otp as used, INSERT into leads

STATE 3: Success — show confirmation
```

**Brute force:** increment attempts on each wrong guess, return 429 after 5.  
**Resend from:** `verify@settlementcheck.co.uk`  
**Solicitor applications:** bypass OTP — submit direct to Supabase with anon key.

## lib/supabase.ts pattern

```typescript
// Browser — anon key (solicitor applications only)
export const supabaseBrowser = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Server — service role, bypasses RLS (API routes only, never import client-side)
export function createSupabaseServer() {
  return createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}
```
