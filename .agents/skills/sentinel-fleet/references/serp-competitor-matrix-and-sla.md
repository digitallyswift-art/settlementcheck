# Sentinel Fleet: SERP Competitor Intelligence & 15-Minute Territorial SLA Reference

## 1. SERP Sentinel Intelligence Framework (`scripts/sentinel/serp-sentinel.mjs`)

### Primary Competitor Intercept Targets
- **Commercial Law Firms**:
  - `monacosolicitors.co.uk` (High VC spend, in-house AI drafting, aggressive Google Ads).
  - `landaulaw.co.uk` (Dominant boutique ranking for termination terms).
  - `redmans.co.uk`, `klglaw.co.uk`, `springhouselegal.com`.
- **Public & Advisory Bodies**:
  - `acas.org.uk` (Helpline and statutory redundancy advisory).
  - `gov.uk` (Static statutory redundancy calculator).
- **Lead Aggregators**:
  - `settlementagreementcalculator.co.uk`.

### Tracked Query Clusters
1. **High-Intent Calculator**: "settlement agreement calculator", "redundancy payment calculator", "unfair dismissal calculator".
2. **Statutory Caps**: "redundancy pay cap 2026", "statutory redundancy calculator 2026", "settlement agreement tax 30000".
3. **Employee Anxieties**: "can employer withdraw settlement offer", "settlement agreement instead of pip", "tax on pilon 2026".

---

## 2. 15-Minute Territorial SLA Watchdog (`scripts/watchdog/sla-watchdog.mjs`)

### The 15-Minute Exclusivity Lock Protocol
1. **Lead Intake**: Employee submits enquiry in an outward postal area (e.g. `SW1`, `M1`, `B1`).
2. **Atomic Lock**: The lead is exclusively reserved for the primary regional SRA partner firm for **15 minutes (900 seconds)**:
   - `status = 'locked'`
   - `locked_at = now()`
   - `expires_at = now() + interval '15 minutes'`
3. **Solicitor Claim**: Partner firm solicitor receives an immediate SMS/email notification with Pre-Flight Case Dossier link.
4. **Watchdog Intervention (`watchdog:sla`)**:
   - If `now() > expires_at` without solicitor claiming the matter:
     - Lock expires automatically.
     - Secondary panel firm in adjacent catchment area receives instruction.
     - If no secondary firm accepts within 15 minutes, lead is released to the general national panel queue.
   - Eliminates lead stagnation and guarantees the stressed employee receives contact within 15 minutes.
