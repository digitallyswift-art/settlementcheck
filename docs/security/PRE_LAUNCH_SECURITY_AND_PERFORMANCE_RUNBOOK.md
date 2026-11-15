# SettlementCheck — Pre-Launch Security & Performance Implementation Runbook

**Document Version:** 2.0 (November 2026)  
**Standard Compliance:** Pre-Launch Security Audit v2.0 (85 Checks across 13 Areas + H1–H18 Human Checklist), UK GDPR Article 9, SRA Regulatory Boundaries, OWASP Top 10  
**Target Repository:** `c:\settlementcheck`  
**Execution Model:** Phased, zero-downtime, non-breaking rollout across independent chat sessions.

---

## 1. Architectural Philosophy & Safety Invariants

This runbook establishes a bank-grade cybersecurity defense and performance optimization framework for **SettlementCheck (`settlementcheck.co.uk`)**. 

Every phase adheres to **5 Strict Invariants**:
1. **Zero Live Downtime & Zero Conversion Breakage**: Legitimate UK employees must never experience false-positive blocks, UI regressions, or dropped leads. Rate limits and thresholds are set generously above human speed with backwards-compatible fallbacks.
2. **Deterministic Rate & Statutory Invariants**: Statutory calculation logic (`lib/calculations.ts`, `lib/statutory-rates.ts`) remains pure TypeScript and 100% compliant with SI 2026/310 (April 2026 caps).
3. **Fail-Closed Security**: All background jobs, cron endpoints, and protected routes must fail closed (deny access when credentials/tokens are missing or invalid), eliminating bypass vulnerabilities.
4. **Data Minimization & UK GDPR Article 9**: Confidential employee terms, salaries, redundancy figures, and health disclosures must never leak through unauthenticated endpoints, stack traces, or un-redacted AI prompts.
5. **Phase-by-Phase Verification**: No phase is considered complete until verified with static compilation (`npx tsc --noEmit`), route integrity (`npm run check:links`), and deterministic evals (`npm run test:evals`).

---

## 2. Multi-Phase Roadmap Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IMPLEMENTATION PHASES                           │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Engine Performance & Information Disclosure Hardening         │
│   • Parallelize Agentic Worker waterfall (Promise.all)                 │
│   • Fix React timer interval churn in dossier review                   │
│   • Sanitize /api/health and /api/solicitor-application error leaks    │
│   • Configure /api/cron/sla-watchdog in vercel.json                    │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Defense-in-Depth HTTP Headers & Script XSS Neutralization     │
│   • Configure Content-Security-Policy (CSP) & HSTS in next.config.js   │
│   • Enforce X-Frame-Options: DENY & nosniff MIME protection            │
│   • Neutralize JSON-LD script breakout XSS using safeJsonLdStringify   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Cryptographic OTP & Brute-Force Lockout Defense               │
│   • Upgrade Math.random() to crypto.randomInt() in /api/otp/send       │
│   • Implement 5-attempt brute-force lockout in /api/otp/verify         │
│   • Issue signed HMAC-SHA256 OTP session tokens (15-min TTL)           │
│   • Add honeypot bot trap to OTP dispatch                              │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: BOLA/IDOR Authorization, Dev Passkey Purge & Fail-Closed Crons│
│   • Restrict dev passkeys in middleware.ts strictly to dev mode        │
│   • Enforce mandatory claimToken on /api/portal/dossier/[id] & claim   │
│   • Enforce fail-closed constant-time auth on all /api/cron/* routes   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Unified Anti-Spam Pipeline, AI Gateway & Route Consolidation  │
│   • Sliding-window IP rate limiter across all public mutation routes   │
│   • Consolidate /api/leads and /api/leads/submit into /api/lead        │
│   • Implement partner token verification for B2B embeddable widget     │
│   • AI Gateway guardrails: 25k char ceiling, timeout, wallet defense   │
│   • Full pre-launch audit validation and launch sign-off               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Engine Performance & Information Disclosure Hardening

### Objectives
1. Eliminate the 4-stage sequential waterfall in `AgenticOrchestrator.executeCaseDossier`, dropping pre-flight dossier compilation time from ~1,200ms to ~300ms (75% latency reduction).
2. Fix timer interval churn in `ReviewDossierClient.tsx` where the 15-minute countdown interval is torn down and reallocated every 1,000ms.
3. Sanitize `GET /api/health` so unauthenticated callers cannot inspect database error strings, table availability errors, or service credentials.
4. Sanitize `POST /api/solicitor-application` to strip raw database exception messages (`insertError.message`) from user-facing JSON responses.
5. Register `/api/cron/sla-watchdog` (`*/15 * * * *`) in `vercel.json` so territorial lead locks automatically expire and failover in production.

### Target Files
- `lib/agentic-engine/orchestrator/engine.ts`
- `app/dossier/review/[id]/ReviewDossierClient.tsx`
- `app/api/health/route.ts`
- `app/api/solicitor-application/route.ts`
- `vercel.json`

### Implementation Instructions
1. **In `lib/agentic-engine/orchestrator/engine.ts`**:
   Replace sequential `await` calls:
   ```typescript
   // BEFORE (Waterfall):
   const statutoryReport = await triageWorker.execute(context, context);
   const threatReport = await captiveThreatWorker.execute(context, context);
   const clauseReport = await clauseRiskWorker.execute(context, context);
   const benchmarkReport = await benchmarkWorker.execute(context, context);

   // AFTER (High-Performance Parallel Execution):
   const [statutoryReport, threatReport, clauseReport, benchmarkReport] = await Promise.all([
     triageWorker.execute(context, context),
     captiveThreatWorker.execute(context, context),
     clauseRiskWorker.execute(context, context),
     benchmarkWorker.execute(context, context),
   ]);
   ```
2. **In `app/dossier/review/[id]/ReviewDossierClient.tsx`**:
   Change the dependency array from `[isClaimed, secondsRemaining]` to `[isClaimed]`, using a functional state updater:
   ```typescript
   useEffect(() => {
     if (isClaimed) return;
     const interval = setInterval(() => {
       setSecondsRemaining(prev => {
         if (prev <= 1) {
           clearInterval(interval);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
     return () => clearInterval(interval);
   }, [isClaimed]);
   ```
3. **In `app/api/health/route.ts`**:
   Return `{ status: 'ok', timestamp: new Date().toISOString() }` for public requests. Only return internal database diagnostic details if `Authorization: Bearer <CRON_SECRET>` or `INTERNAL_WORKER_KEY` is provided.
4. **In `app/api/solicitor-application/route.ts`**:
   Replace `{ error: 'Failed to save application', detail: insertError.message }` with `{ error: 'Failed to save application. Please try again or contact team@settlementcheck.co.uk.' }`.
5. **In `vercel.json`**:
   Add `/api/cron/sla-watchdog`:
   ```json
   {
     "crons": [
       { "path": "/api/cron/serp-sentinel", "schedule": "0 3 * * *" },
       { "path": "/api/cron/sla-watchdog", "schedule": "*/15 * * * *" }
     ]
   }
   ```

### Verification Commands
```bash
npx tsc --noEmit
npm run verify
```

---

### Copy-and-Paste Prompt to Run Phase 1
Copy the block below and paste it to begin Phase 1:

```markdown
You are a senior application security and performance engineer executing Phase 1 of the SettlementCheck Pre-Launch Security & Performance Framework.

Refer to `docs/security/PRE_LAUNCH_SECURITY_AND_PERFORMANCE_RUNBOOK.md` for full context.

Execute Phase 1: Engine Performance & Information Disclosure Hardening:
1. Parallelize the 4 worker executions in `lib/agentic-engine/orchestrator/engine.ts` using `Promise.all` to eliminate sequential waterfall latency.
2. Fix interval churn in `app/dossier/review/[id]/ReviewDossierClient.tsx` by setting dependencies to `[isClaimed]` and using functional state updates.
3. Harden `app/api/health/route.ts` so public requests receive only `{ status: 'ok', timestamp: ... }` with zero database error messages or table diagnostics (gate diagnostics behind Bearer authorization).
4. Sanitize error handling in `app/api/solicitor-application/route.ts` to remove raw `insertError.message` leaks.
5. Add `/api/cron/sla-watchdog` with schedule `*/15 * * * *` to `vercel.json`.

Run verification commands (`npx tsc --noEmit` and `npm run verify`). Confirm that all changes are 100% clean and non-breaking, and then provide the exact copy-and-paste prompt for Phase 2.
```

---

## Phase 2: Defense-in-Depth HTTP Headers & Script XSS Neutralization

### Objectives
1. Configure strict HTTP security headers in `next.config.js`:
   - `Content-Security-Policy`: Whitelist essential scripts (`googletagmanager.com`, `google-analytics.com`, `va.vercel-scripts.com`), fonts, and Supabase connections while prohibiting unauthorized origins and inline script attacks.
   - `X-Frame-Options: DENY`: Defends against iframe clickjacking.
   - `X-Content-Type-Options: nosniff`: Enforces MIME-type matching.
   - `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer data leakage.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Minimizes browser privilege footprint.
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`: Enforces TLS across all user visits.
2. Neutralize JSON-LD script breakout XSS by replacing un-escaped `JSON.stringify` inside `dangerouslySetInnerHTML` in older guide and hub pages (`app/page.tsx`, `app/guides/page.tsx`, `app/how-it-works/page.tsx`, etc.) with `safeJsonLdStringify`.

### Target Files
- `next.config.js`
- `app/page.tsx`
- `app/how-it-works/page.tsx`
- `app/guides/page.tsx`
- Other guide pages using raw `JSON.stringify` inside JSON-LD tags.

### Implementation Instructions
1. **In `next.config.js`**:
   Add `async headers()` declaring production defensive headers:
   ```javascript
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           { key: 'X-Frame-Options', value: 'DENY' },
           { key: 'X-Content-Type-Options', value: 'nosniff' },
           { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
           { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
           {
             key: 'Content-Security-Policy',
             value: [
               "default-src 'self'",
               "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com https://va.vercel-scripts.com https://identitytoolkit.googleapis.com",
               "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
               "font-src 'self' https://fonts.gstatic.com data:",
               "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://images.unsplash.com",
               "connect-src 'self' https://*.supabase.co https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://va.vercel-scripts.com",
               "frame-ancestors 'none'",
             ].join('; '),
           },
           {
             key: 'Strict-Transport-Security',
             value: 'max-age=63072000; includeSubDomains; preload',
           },
         ],
       },
     ];
   }
   ```
2. **In `app/page.tsx` and guides**:
   Replace raw `JSON.stringify(...)` in `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ... }} />` with `safeJsonLdStringify(...)` from `@/lib/seo/safe-json-ld`.

### Verification Commands
```bash
npx tsc --noEmit
npm run check:links
```

---

### Copy-and-Paste Prompt to Run Phase 2
Copy the block below and paste it into a new chat once Phase 1 is confirmed complete:

```markdown
You are a senior application security engineer executing Phase 2 of the SettlementCheck Pre-Launch Security & Performance Framework.

Refer to `docs/security/PRE_LAUNCH_SECURITY_AND_PERFORMANCE_RUNBOOK.md` for full context.

Execute Phase 2: Defense-in-Depth HTTP Headers & Script XSS Neutralization:
1. Configure strict HTTP security headers in `next.config.js` via `async headers()` including CSP (with verified whitelists for GTM, GA4, Vercel Analytics, Google Fonts, and Supabase), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy, and HSTS.
2. Scan and replace any raw `JSON.stringify` inside `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ... }} />` in `app/page.tsx`, `app/how-it-works/page.tsx`, `app/guides/page.tsx`, and relevant guide templates with `safeJsonLdStringify` to eliminate script breakout XSS risks.
3. Ensure all changes strictly preserve trailing slash redirects and domain canonicalization rules in `next.config.js`.

Run verification commands (`npx tsc --noEmit` and `npm run check:links`). Confirm that all changes pass without regressions, and then provide the exact copy-and-paste prompt for Phase 3.
```

---

## Phase 3: Cryptographic OTP & Anti-Brute-Force Lockout Defense

### Objectives
1. Replace predictable PRNG `Math.random()` with Node.js native `crypto.randomInt(100000, 1000000)` in `app/api/otp/send/route.ts` (`SC-E-SEC-001`).
2. Add bot honeypot detection (`website_hp`) in `app/api/otp/send/route.ts` to silently drop automated bots without generating Resend emails or database writes.
3. Implement failed attempt tracking in `app/api/otp/verify/route.ts`: track attempt counts and lock out the code after 5 failed attempts (`SC-E-SEC-003`). Use constant-time comparison for code verification.
4. Issue a signed HMAC-SHA256 session verification token (`lib/security/otp-tokens.ts`) with a 15-minute expiration upon successful OTP verification (`SC-E-SEC-005`).

### Target Files
- `lib/security/otp-tokens.ts` [NEW]
- `app/api/otp/send/route.ts`
- `app/api/otp/verify/route.ts`

### Implementation Instructions
1. **Create `lib/security/otp-tokens.ts`**:
   Implement `generateOtpSessionToken(email: string, formType: string): string` and `verifyOtpSessionToken(token: string, expectedEmail: string, expectedFormType: string): boolean` using `crypto.createHmac('sha256', secret)`.
2. **In `app/api/otp/send/route.ts`**:
   - Check honeypot: `if (body.website_hp) return NextResponse.json({ success: true });`
   - Use `crypto.randomInt(100000, 1000000).toString()` for code generation.
   - Enforce rate limit check (max 5 OTP sends per email per 15 minutes).
3. **In `app/api/otp/verify/route.ts`**:
   - Read and increment `attempts` in `otp_codes`.
   - If `attempts >= 5`, update `{ used: true }` and return `{ success: false, message: 'Too many failed attempts. Please request a new verification code.' }`.
   - Use constant-time comparison: `crypto.timingSafeEqual(...)`.
   - On success, issue signed OTP session token:
     `return NextResponse.json({ success: true, verificationToken: token });`

### Verification Commands
```bash
npx tsc --noEmit
npm run test:evals
```

---

### Copy-and-Paste Prompt to Run Phase 3
Copy the block below and paste it into a new chat once Phase 2 is confirmed complete:

```markdown
You are a senior cryptography and application security engineer executing Phase 3 of the SettlementCheck Pre-Launch Security & Performance Framework.

Refer to `docs/security/PRE_LAUNCH_SECURITY_AND_PERFORMANCE_RUNBOOK.md` for full context.

Execute Phase 3: Cryptographic OTP & Anti-Brute-Force Lockout Defense:
1. Create `lib/security/otp-tokens.ts` to generate and verify HMAC-SHA256 signed OTP session tokens with a 15-minute TTL.
2. In `app/api/otp/send/route.ts`, replace `Math.random()` with `crypto.randomInt(100000, 1000000)`, add honeypot bot filtering, and enforce email rate limiting.
3. In `app/api/otp/verify/route.ts`, implement a 5-attempt brute-force counter with automatic token invalidation upon exceeding 5 failed tries, verify codes using timing-safe comparison, and return a signed `verificationToken` on success.
4. Ensure the verification response maintains backward compatibility with client components (`success: true`).

Run verification commands (`npx tsc --noEmit` and `npm run test:evals`). Confirm that all changes pass cleanly, and then provide the exact copy-and-paste prompt for Phase 4.
```

---

## Phase 4: BOLA/IDOR Authorization, Dev Passkey Purge & Fail-Closed Crons

### Objectives
1. Purge hardcoded dev passkeys (`VALID_DEV_PASSKEYS = ['dev-passkey-admin2026', 'admin2026', ...]`) in `middleware.ts` from production and preview environments. Dev passkeys must strictly function only when `process.env.NODE_ENV === 'development'`.
2. Fix Broken Object-Level Authorization (BOLA/IDOR) in `app/api/portal/dossier/[id]/route.ts` (`SC-E-SEC-004`) and `app/api/portal/claim/route.ts`: enforce mandatory `claimToken` validation. Reject requests with missing or empty tokens with `401 Unauthorized`. Restrict demo matter bypasses exclusively to local development.
3. Convert all background cron endpoints (`/api/cron/sla-watchdog`, `/api/cron/serp-sentinel`, `/api/cron/ab-digest`, `/api/cron/evaluate-ab-winner`) from fail-open (`if (cronSecret && ...)`) to **fail-closed** with constant-time token comparison.

### Target Files
- `middleware.ts`
- `app/api/portal/dossier/[id]/route.ts`
- `app/api/portal/claim/route.ts`
- `app/api/cron/sla-watchdog/route.ts`
- `app/api/cron/serp-sentinel/route.ts`
- `app/api/cron/ab-digest/route.ts`
- `app/api/cron/evaluate-ab-winner/route.ts`

### Implementation Instructions
1. **In `middleware.ts`**:
   Update `verifyDevOrWorkerToken`:
   ```typescript
   function verifyDevOrWorkerToken(token: string): boolean {
     const cronSecret = cleanEnv(process.env.CRON_SECRET) || cleanEnv(process.env.INTERNAL_WORKER_KEY);
     if (cronSecret && constantTimeEqual(token, cronSecret)) {
       return true;
     }
     if (process.env.NODE_ENV === 'development') {
       return VALID_DEV_PASSKEYS.some(pass => constantTimeEqual(token, pass));
     }
     return false;
   }
   ```
2. **In `app/api/portal/dossier/[id]/route.ts` and `app/api/portal/claim/route.ts`**:
   - Make `claimToken` strictly mandatory:
     ```typescript
     if (!token || typeof token !== 'string' || token.trim() === '') {
       return NextResponse.json({ success: false, error: 'Unauthorized: A valid claim token is required.' }, { status: 401 });
     }
     ```
   - Gate demo bypass: `if (process.env.NODE_ENV === 'development' && isDemoMatter && isDemoToken) { ... }`
3. **In `app/api/cron/*`**:
   Enforce fail-closed authorization:
   ```typescript
   const authHeader = req.headers.get('authorization');
   const cronSecret = process.env.CRON_SECRET;
   if (!cronSecret || !authHeader || !constantTimeEqual(authHeader, `Bearer ${cronSecret}`)) {
     return NextResponse.json({ success: false, error: 'Unauthorized: Valid cron authorization required.' }, { status: 401 });
   }
   ```

### Verification Commands
```bash
npx tsc --noEmit
npm run verify
```

---

### Copy-and-Paste Prompt to Run Phase 4
Copy the block below and paste it into a new chat once Phase 3 is confirmed complete:

```markdown
You are a senior cyber security architect executing Phase 4 of the SettlementCheck Pre-Launch Security & Performance Framework.

Refer to `docs/security/PRE_LAUNCH_SECURITY_AND_PERFORMANCE_RUNBOOK.md` for full context.

Execute Phase 4: BOLA/IDOR Authorization, Dev Passkey Purge & Fail-Closed Crons:
1. In `middleware.ts`, restrict `VALID_DEV_PASSKEYS` strictly to `process.env.NODE_ENV === 'development'`, eliminating production backdoor bypass risks.
2. In `app/api/portal/dossier/[id]/route.ts` and `app/api/portal/claim/route.ts`, enforce mandatory `claimToken` validation to eliminate BOLA / IDOR vulnerabilities, and restrict demo mock bypasses strictly to development.
3. In all background cron routes (`app/api/cron/sla-watchdog/route.ts`, `app/api/cron/serp-sentinel/route.ts`, `app/api/cron/ab-digest/route.ts`, `app/api/cron/evaluate-ab-winner/route.ts`), replace fail-open auth checks with fail-closed constant-time token comparison against `process.env.CRON_SECRET`.

Run verification commands (`npx tsc --noEmit` and `npm run verify`). Confirm that all changes pass cleanly, and then provide the exact copy-and-paste prompt for Phase 5.
```

---

## Phase 5: Unified Anti-Spam Pipeline, AI Gateway & Route Consolidation

### Objectives
1. Implement a lightweight, edge-compatible sliding-window rate limiter in `lib/security/rate-limiter.ts`.
2. Create `lib/leads/lead-ingestion-service.ts` to centralize validation, SRA triage evaluation, Supabase persistence, and notification dispatch into a single source of truth.
3. In `app/api/lead/route.ts`: verify signed OTP tokens with backward-compatible fallback to verified `otp_codes` records, apply IP rate limiting (max 10 submissions/hour/IP), and check honeypot fields.
4. Consolidate redundant routes: update `app/api/leads/route.ts` and `app/api/leads/submit/route.ts` to delegate directly to the unified service. For external widgets (`public/widget.js`), require a valid `partner_id` verified against `solicitor_panel` (falling back gracefully to unverified queue if absent, ensuring zero dropped leads).
5. In `app/api/review-agreement/route.ts`: enforce a 25,000 character ceiling, a 15-second execution timeout, and rate limiting (max 10 reviews/hour/IP) to defend against AI wallet and token exhaustion attacks.
6. Apply rate limiting and honeypot checks to `app/api/save-results/route.ts`, `app/api/solicitor-application/route.ts`, and `app/api/waitlist/route.ts`.
7. Execute full pre-launch audit validation and generate the finalized verification report.

### Target Files
- `lib/security/rate-limiter.ts` [NEW]
- `lib/leads/lead-ingestion-service.ts` [NEW]
- `app/api/lead/route.ts`
- `app/api/leads/route.ts`
- `app/api/leads/submit/route.ts`
- `app/api/review-agreement/route.ts`
- `app/api/save-results/route.ts`
- `app/api/waitlist/route.ts`

### Implementation Instructions
1. **Create `lib/security/rate-limiter.ts`**:
   Implement an in-memory sliding-window rate limiter with per-endpoint buckets and IP extraction from headers (`x-forwarded-for`, `x-real-ip`).
2. **Create `lib/leads/lead-ingestion-service.ts`**:
   Encapsulate SRA triage calculation (`evaluateSraLeadTriage`), database insertion into `leads`, and email dispatch via Resend.
3. **In `app/api/lead/route.ts`**:
   - Check rate limit (10/hr).
   - Check honeypot: `if (body.website_hp) return NextResponse.json({ success: true });`.
   - Validate signed OTP verification token (from Phase 3) or fall back to recent verified record in `otp_codes`.
   - Delegate to `lead-ingestion-service`.
4. **In `app/api/review-agreement/route.ts`**:
   - Check character length: `if (agreementText.length > 25000) return NextResponse.json({ error: 'Agreement text exceeds maximum length of 25,000 characters.' }, { status: 400 });`.
   - Apply rate limit (10/hr/IP).
   - Enforce 15s timeout wrapper on LLM call.

### Verification Commands
```bash
npx tsc --noEmit
npm run check:links
npm run test:evals
npm run verify
```

---

### Copy-and-Paste Prompt to Run Phase 5
Copy the block below and paste it into a new chat once Phase 4 is confirmed complete:

```markdown
You are a senior full-stack cybersecurity engineer executing Phase 5 (Final Phase) of the SettlementCheck Pre-Launch Security & Performance Framework.

Refer to `docs/security/PRE_LAUNCH_SECURITY_AND_PERFORMANCE_RUNBOOK.md` for full context.

Execute Phase 5: Unified Anti-Spam Pipeline, AI Gateway & Route Consolidation:
1. Create `lib/security/rate-limiter.ts` providing an edge-compatible sliding-window rate limiter.
2. Create `lib/leads/lead-ingestion-service.ts` unifying lead validation, SRA triage evaluation, Supabase persistence, and notification dispatch.
3. Wire `app/api/lead/route.ts` to use signed OTP verification tokens, honeypot protection, and IP rate limiting, with graceful fallback to ensure zero legitimate user friction.
4. Consolidate redundant routes `app/api/leads/route.ts` and `app/api/leads/submit/route.ts` by delegating to the unified lead service with partner token validation for B2B widgets.
5. In `app/api/review-agreement/route.ts`, enforce a 25,000 character cap, 15-second execution timeout, and rate limiting to protect LLM spend balances.
6. Add honeypot and rate limiting protections to `app/api/save-results/route.ts`, `app/api/solicitor-application/route.ts`, and `app/api/waitlist/route.ts`.

Run the full pre-launch verification suite:
- `npx tsc --noEmit`
- `npm run check:links`
- `npm run test:evals`
- `npm run verify`

Confirm all checks pass and present the standardized final Pre-Launch Security & Performance Report.
```

---

## 3. Human Verification Checklist (H1–H18 Alignment)

Before deploying to live production, complete these 5 essential human verification items:
- **H1 (Secrets Rotation)**: Confirm live production keys (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`) are set strictly in Vercel Project Environment Variables and not committed to git.
- **H2 (Spend Limits)**: Configure spending caps in Resend dashboard and AI provider consoles (Gemini / Anthropic / OpenAI).
- **H4 (2FA)**: Confirm 2-factor authentication is active on GitHub, Vercel, Supabase, and Resend accounts.
- **H8 (Supabase Security)**: Confirm all tables in Supabase production have Row Level Security (RLS) enabled with default-deny policies via `supabase/migrations/20261018_enable_rls_all_tables.sql`.
- **H12 (Custom Domain Email)**: Confirm SPF, DKIM, and DMARC DNS records are verified for `settlementcheck.co.uk` in your domain registrar.
