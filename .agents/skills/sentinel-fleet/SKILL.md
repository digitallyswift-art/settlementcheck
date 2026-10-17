---
name: sentinel-fleet
description: Autonomous SERP Sentinel and 15-Minute SLA Watchdog Fleet for SettlementCheck.co.uk.
---

# Autonomous Sentinel & SLA Watchdog Fleet Skill

Manages the background agent fleet responsible for organic SERP intelligence and territorial SLA lock enforcement across the UK partner panel.

---

## 1. Core Fleet Agents

### A. SERP Sentinel (`npm run sentinel:serp`)
- **Frequency**: Daily or weekly scheduled run.
- **Data Source**: `data/gsc-history/` and Google Search Console performance extracts.
- **Responsibilities**:
  1. Tracks top mover queries (position gains, click-through rates, impressions).
  2. Identifies emerging high-intent queries (e.g. "employment settlement calculator", "settlement agreement how much").
  3. Monitors competitor intercepts from commercial law firms (`monacosolicitors.co.uk`, `landaulaw.co.uk`) and advisory bodies (`acas.org.uk`).
  4. Audits Google AI Overview citations and flags at-risk informational keywords.
  5. Outputs dated JSON snapshots into `data/serp-snapshots/`.

### B. 15-Minute SLA Watchdog (`npm run watchdog:sla`)
- **Frequency**: Continuous daemon (every 60s) or scheduled cron (every 5-15 mins).
- **Data Source**: Supabase `lead_claims` and `solicitor_panel` tables.
- **Responsibilities**:
  1. Monitors employee instructions reserved under territorial exclusivity locks (`status = 'locked'`).
  2. Detects expired locks where `now() > expires_at` without solicitor claim.
  3. Executes atomic failover re-routing:
     - Assigns lead to secondary regional SRA partner firm with a fresh 15-minute lock.
     - Or releases matter into the general unreserved partner queue.
  4. Prevents client lead stagnation and guarantees rapid employee response times.

---

## 2. Terminal Commands

```bash
# Run single-pass SERP Sentinel scan and save snapshot
npm run sentinel:serp

# Run single-pass SLA Watchdog inspection
npm run watchdog:sla

# Run SLA Watchdog as continuous background daemon (60s loop)
node scripts/watchdog/sla-watchdog.mjs --daemon --interval=60
```

---

## 3. Serverless HTTP Cron Endpoints

Both background agents are exposed as secure serverless cron endpoints:
- `GET /api/cron/serp-sentinel/` (with optional `Authorization: Bearer <CRON_SECRET>`)
- `GET /api/cron/sla-watchdog/` (with optional `Authorization: Bearer <CRON_SECRET>`)
