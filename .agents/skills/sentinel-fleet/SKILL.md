---
name: sentinel-fleet
description: Autonomous SERP Sentinel and 15-Minute SLA Watchdog Fleet for SettlementCheck.co.uk.
---

# Autonomous Sentinel & SLA Watchdog Fleet Skill

Manages the background agent fleet responsible for organic SERP intelligence and territorial SLA lock enforcement across the UK partner panel.

## 1. Quick Reference & Core Invariants

- **SERP Sentinel Targets**: Monaco Solicitors, Landau Law, ACAS, GOV.UK, Redmans, Springhouse.
- **SLA Watchdog Window**: **15 minutes (900 seconds)** exclusivity lock before secondary failover cascade.
- **Google Cloud Quota Guard**: 6-hour caching debounce, 2,500 row max API fetch.

For competitor matrices, query clusters, and the complete territorial lock protocol, see:
- [SERP Competitor Matrix & 15-Minute SLA Reference](./references/serp-competitor-matrix-and-sla.md)

## 2. Automated Tooling & Terminal Commands

```bash
# Run single-pass SERP Sentinel scan
npm run sentinel:serp

# Run single-pass SLA Watchdog inspection
npm run watchdog:sla

# Run SLA Watchdog as continuous daemon (60s loop)
node scripts/watchdog/sla-watchdog.mjs --daemon --interval=60
```

## 3. Serverless HTTP Cron Endpoints

Both background agents are exposed as secure serverless cron endpoints:
- `GET /api/cron/serp-sentinel/` (Bearer `<CRON_SECRET>`)
- `GET /api/cron/sla-watchdog/` (Bearer `<CRON_SECRET>`)
