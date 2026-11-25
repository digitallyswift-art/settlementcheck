#!/usr/bin/env tsx
/**
 * SettlementCheck 28-Day GA4 + GSC CRO Funnel & Engagement Data Pull
 *
 * Usage:
 *   npm run cro:data
 *   npx tsx scripts/audit/pull-cro-data.ts --days=28
 */

import fs from 'fs';
import path from 'path';
import { GoogleAnalytics4Client } from '../../lib/agentic-engine/services/ga4-client';
import { GoogleSearchConsoleClient } from '../../lib/agentic-engine/services/gsc-client';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

async function main() {
  loadEnvLocal();

  const daysArg = process.argv.find((a) => a.startsWith('--days='));
  const days = daysArg ? parseInt(daysArg.split('=')[1], 10) || 28 : 28;

  console.log(`\n===============================================================`);
  console.log(`📊 SETTLEMENTCHECK ${days}-DAY CRO FUNNEL & ENGAGEMENT REPORT`);
  console.log(`===============================================================\n`);

  const ga4 = await GoogleAnalytics4Client.getCroFunnelReport(days);

  console.log(`── 1. CORE FUNNEL PAGES BY DEVICE (${ga4.startDate} to ${ga4.endDate}) ──`);
  if (ga4.funnelPagesByDevice.length === 0) {
    console.log('No rows returned for funnel pages.');
  } else {
    console.table(
      ga4.funnelPagesByDevice.map((r) => ({
        Path: r.pagePath,
        Device: r.deviceCategory,
        Sessions: r.sessions,
        Users: r.activeUsers,
        Views: r.screenPageViews,
        'Eng.%': `${r.engagementRate}%`,
        'AvgDur(s)': r.averageSessionDuration,
        'Bounce%': `${r.bounceRate}%`,
        KeyEvents: r.keyEvents,
      }))
    );
  }

  console.log(`\n── 2. EVENT FUNNEL COUNTS (${days} Days) ──`);
  console.table(
    ga4.events.map((e) => ({
      Event: e.eventName,
      Count: e.eventCount,
      Users: e.totalUsers,
    }))
  );

  console.log(`\n── 3. TOP 15 LANDING / ENGAGEMENT PAGES BY DEVICE ──`);
  console.table(
    ga4.topPagesByDevice.slice(0, 15).map((r) => ({
      Path: r.pagePath,
      Device: r.deviceCategory,
      Sessions: r.sessions,
      Users: r.activeUsers,
      'Eng.%': `${r.engagementRate}%`,
      'AvgDur(s)': r.averageSessionDuration,
      'Bounce%': `${r.bounceRate}%`,
    }))
  );

  try {
    const end = new Date();
    end.setDate(end.getDate() - 2);
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const gscPages = await GoogleSearchConsoleClient.querySearchAnalytics({
      startDate: fmt(start),
      endDate: fmt(end),
      dimensions: ['page'],
      rowLimit: 15,
    });

    console.log(`\n── 4. TOP 15 GSC LANDING PAGES (${fmt(start)} to ${fmt(end)}) ──`);
    console.table(
      gscPages.map((row: any) => ({
        Page: (row.page || row.query || '').replace('https://settlementcheck.co.uk', '') || '/',
        Clicks: row.clicks,
        Impr: row.impressions,
        'CTR%': `${row.ctr ?? 0}%`,
        Pos: Math.round((row.position || 0) * 10) / 10,
      }))
    );
  } catch (err: any) {
    console.log(`\n[GSC skipped]: ${err?.message || err}`);
  }
}

main().catch((err) => {
  console.error('Fatal error pulling CRO data:', err);
  process.exit(1);
});
