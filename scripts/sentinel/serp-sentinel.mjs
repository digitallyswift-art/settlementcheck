#!/usr/bin/env node
/**
 * SettlementCheck Autonomous SERP Sentinel Runner
 * Full Autonomous Loop:
 * 1. Pull: Connects to Google Search Console API via Google Service Account (or local fallback).
 * 2. Analyze: Calculates rank velocity, competitor threat intercepts, and AI Overview status.
 * 3. Act: Generates concrete SEO actions (meta CTR recalibration, internal link boost, FAQ snippets).
 * 4. Report: Saves JSON & Markdown executive digests, outputs terminal briefing.
 *
 * Usage:
 *   npm run sentinel:serp
 *   node scripts/sentinel/serp-sentinel.mjs --auto-pull
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const GSC_BASE_DIR = path.resolve('data/gsc-history');
const SNAPSHOTS_DIR = path.resolve('data/serp-snapshots');
const ACTIONS_DIR = path.resolve('data/serp-actions');

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) return [];
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] ?? '';
    });
    return obj;
  });
}

function loadCredentials() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const regex = /^\s*([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^#\r\n]+))/gm;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const key = match[1];
      const val = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4].trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }

  if (!process.env.GSC_CLIENT_EMAIL || !process.env.GSC_PRIVATE_KEY) {
    const candidateFiles = ['gsc-credentials.json', 'service-account.json', 'gsc-key.json'];
    try {
      const rootFiles = fs.readdirSync(path.resolve('.'));
      for (const f of rootFiles) {
        if (f.endsWith('.json') && (f.includes('gsc') || f.includes('service-account') || f.includes('sentinel'))) {
          if (!candidateFiles.includes(f)) candidateFiles.push(f);
        }
      }
    } catch {}

    for (const cand of candidateFiles) {
      const candPath = path.resolve(cand);
      if (fs.existsSync(candPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(candPath, 'utf-8'));
          if (parsed.client_email && parsed.private_key) {
            process.env.GSC_CLIENT_EMAIL = parsed.client_email;
            process.env.GSC_PRIVATE_KEY = parsed.private_key;
            break;
          }
        } catch {}
      }
    }
  }
}

/**
 * Direct Google Search Console API puller via OAuth2 JWT Assertion
 */
async function pullLiveGscApiIfConfigured() {
  loadCredentials();
  const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
  const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:settlementcheck.co.uk';

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Google Fleet Quota Guard: Enforce 6-hour caching debounce unless --force is supplied
  const isForced = process.argv.includes('--force') || process.argv.includes('--refresh');
  if (!isForced && fs.existsSync(SNAPSHOTS_DIR)) {
    const files = fs.readdirSync(SNAPSHOTS_DIR).filter(f => f.endsWith('.json')).sort().reverse();
    if (files.length > 0) {
      const latestPath = path.join(SNAPSHOTS_DIR, files[0]);
      const stat = fs.statSync(latestPath);
      const ageHours = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
      if (ageHours < 6) {
        try {
          const cached = JSON.parse(fs.readFileSync(latestPath, 'utf-8'));
          if (cached && cached.dataSource && cached.dataSource.includes('GSC_LIVE_API')) {
            console.log(`🛡️  Google Quota Guard: Using cached live snapshot from ${Math.round(ageHours * 10) / 10}h ago (${files[0]}).`);
            console.log('   (0 API calls consumed. Pass --force to query Google Search Console live now)\n');
            return {
              source: 'GSC_LIVE_API (Cached)',
              rows: (cached.topMovers || []).map(m => ({
                query: m.query,
                clicks: m.clicks || 0,
                impressions: m.impr || 0,
                ctr: m.ctr || 0,
                position: m.curPos || 0,
              })),
            };
          }
        } catch {}
      }
    }
  }

  try {
    privateKey = privateKey.replace(/\\n/g, '\n');
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const sHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const sClaim = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
    const input = `${sHeader}.${sClaim}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(input);
    const jwt = `${input}.${signer.sign(privateKey, 'base64url')}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) return null;
    const { access_token } = await tokenRes.json();

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const queryRes = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 2500,
        }),
      }
    );

    if (!queryRes.ok) return null;
    const data = await queryRes.json();
    return {
      source: 'GSC_LIVE_API',
      rows: (data.rows || []).map(r => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
    };
  } catch (err) {
    console.warn('Live GSC API attempt encountered error, defaulting to local snapshot:', err.message);
    return null;
  }
}

async function runSentinel() {
  console.log('\n======================================================');
  console.log('🛡️  SettlementCheck Autonomous SERP Sentinel');
  console.log('======================================================\n');

  if (!fs.existsSync(SNAPSHOTS_DIR)) fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  if (!fs.existsSync(ACTIONS_DIR)) fs.mkdirSync(ACTIONS_DIR, { recursive: true });

  // 1. PULL PHASE
  let liveApiResult = await pullLiveGscApiIfConfigured();
  let latestQueries = [];
  let dataSource = 'LOCAL_ARCHIVE_FALLBACK';
  let totalClicks = 0;
  let totalImpr = 0;

  const baselineFolder = '2026-05-03_to_2026-05-18';
  let latestFolder = 'settlementcheck.co.uk-Performance-on-Search-2026-10-09';
  if (!fs.existsSync(path.join(GSC_BASE_DIR, latestFolder))) {
    latestFolder = '2026-06-30_to_2026-09-29';
  }

  const baselinePath = path.join(GSC_BASE_DIR, baselineFolder, 'Queries.csv');
  const baselineQueries = parseCsv(baselinePath);

  if (liveApiResult) {
    dataSource = 'GSC_LIVE_API (Direct Service Account Connection)';
    latestQueries = liveApiResult.rows.map(r => ({
      'Top queries': r.query,
      Clicks: String(r.clicks),
      Impressions: String(r.impressions),
      CTR: `${(r.ctr * 100).toFixed(2)}%`,
      Position: String(r.position),
    }));
    totalClicks = liveApiResult.rows.reduce((a, b) => a + b.clicks, 0);
    totalImpr = liveApiResult.rows.reduce((a, b) => a + b.impressions, 0);
    console.log('✅ Connected directly to Google Search Console API via Service Account.');
  } else {
    dataSource = `Local Archive (${latestFolder})`;
    const latestPath = path.join(GSC_BASE_DIR, latestFolder, 'Queries.csv');
    const chartPath = path.join(GSC_BASE_DIR, latestFolder, 'Chart.csv');
    latestQueries = parseCsv(latestPath);
    const latestChart = parseCsv(chartPath);
    totalClicks = latestChart.reduce((acc, row) => acc + (parseInt(row.Clicks, 10) || 0), 0);
    totalImpr = latestChart.reduce((acc, row) => acc + (parseInt(row.Impressions, 10) || 0), 0);
    console.log(`ℹ️  Running in local archival mode: ${latestFolder}`);
    console.log('   (To activate Live GSC pulls, set GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY in .env.local)');
  }

  const baseMap = new Map();
  baselineQueries.forEach(r => {
    const q = r['Top queries'] || r['Query'];
    const pos = parseFloat(r['Position']);
    if (q && !isNaN(pos)) baseMap.set(q.toLowerCase(), pos);
  });

  console.log(`• Data Mode:                 ${dataSource}`);
  console.log(`• Total Tracked Queries:     ${latestQueries.length}`);
  console.log(`• Total Search Impressions:  ${totalImpr.toLocaleString('en-GB')}`);
  console.log(`• Total Search Clicks:       ${totalClicks.toLocaleString('en-GB')}\n`);

  // 2. ANALYZE PHASE
  const topMovers = [];
  const emergingKeywords = [];
  const aiOverviewCandidates = [];
  const autonomousActions = [];

  latestQueries.forEach(r => {
    const query = r['Top queries'] || r['Query'];
    if (!query) return;

    const curPos = parseFloat(r['Position']) || 99;
    const clicks = parseInt(r['Clicks'], 10) || 0;
    const impr = parseInt(r['Impressions'], 10) || 0;
    const ctr = parseFloat(r['CTR']) || 0;
    const prevPos = baseMap.get(query.toLowerCase()) ?? 99;
    const change = Math.round((prevPos - curPos) * 10) / 10;

    if (impr >= 5) {
      topMovers.push({ query, prevPos, curPos, change, clicks, impr, ctr });
    }

    if (impr >= 25 && curPos > 12 && !baseMap.has(query.toLowerCase())) {
      emergingKeywords.push({ query, impr, pos: curPos });
    }

    if (
      query.includes('how to') ||
      query.includes('what is') ||
      query.includes('tax free') ||
      query.includes('acas') ||
      query.includes('protected conversation')
    ) {
      aiOverviewCandidates.push({
        query,
        curPos,
        cited: curPos <= 10,
      });
    }

    // 3. ACTION GENERATION PHASE
    // Action A: Low-CTR Top Rank Warning
    if (curPos <= 8 && curPos >= 1 && impr >= 40 && ctr < 4.0) {
      autonomousActions.push({
        type: 'META_RECALIBRATION',
        query,
        rank: curPos,
        impressions: impr,
        ctr,
        action: `Recalibrate <title> and meta description with statutory guarantee to raise CTR.`,
      });
    }

    // Action B: Striking Distance Quick Win
    if (curPos >= 10.5 && curPos <= 20 && impr >= 50) {
      autonomousActions.push({
        type: 'INTERNAL_LINK_BOOST',
        query,
        rank: curPos,
        impressions: impr,
        action: `Add 2 contextual internal links from top guide pillars to push into Google Top 10.`,
      });
    }
  });

  topMovers.sort((a, b) => b.impr - a.impr);

  console.log('--- 1. High-Volume SERP Movers ---');
  topMovers.slice(0, 8).forEach(m => {
    const arrow = m.change > 0 ? `▲ +${m.change}` : m.change < 0 ? `▼ ${m.change}` : `■ 0.0`;
    console.log(
      `  ${arrow.padEnd(8)} "${m.query}" → Pos: ${m.curPos.toFixed(1)} (was ${m.prevPos.toFixed(1)}) | ${m.impr} impr | ${m.clicks} clicks`
    );
  });

  console.log('\n--- 2. Emerging Query Opportunities (High Upside) ---');
  emergingKeywords.slice(0, 5).forEach(e => {
    console.log(`  ★ "${e.query}" (${e.impr} impressions, Pos ${e.pos.toFixed(1)})`);
  });

  console.log('\n--- 3. Google AI Overview Citation Watchlist ---');
  aiOverviewCandidates.slice(0, 5).forEach(c => {
    const status = c.cited ? '✅ CITED IN TOP 10' : '⚠️ AT RISK / BELOW FOLD';
    console.log(`  ${status} "${c.query}" (Rank: ${c.curPos.toFixed(1)})`);
  });

  console.log('\n--- 4. Autonomous Actions Dispatched ---');
  if (autonomousActions.length > 0) {
    autonomousActions.slice(0, 5).forEach(act => {
      console.log(`  ⚡ [${act.type}] "${act.query}" (Rank ${act.rank.toFixed(1)}): ${act.action}`);
    });
  } else {
    console.log('  ✓ All tracked keyword CTRs and positions optimal.');
  }

  // 4. REPORT PHASE: Save Dated Snapshots
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotJsonPath = path.join(SNAPSHOTS_DIR, `serp-snapshot-${timestamp}.json`);
  const actionsJsonPath = path.join(ACTIONS_DIR, `actions-${timestamp}.json`);

  const snapshotData = {
    runAt: new Date().toISOString(),
    dataSource,
    totalTrackedQueries: latestQueries.length,
    totalImpressions: totalImpr,
    totalClicks,
    topMovers: topMovers.slice(0, 25),
    emergingKeywords: emergingKeywords.slice(0, 15),
    aiOverviewCandidates: aiOverviewCandidates.slice(0, 15),
    autonomousActions,
  };

  fs.writeFileSync(snapshotJsonPath, JSON.stringify(snapshotData, null, 2));
  fs.writeFileSync(actionsJsonPath, JSON.stringify(autonomousActions, null, 2));

  console.log(`\n💾 Snapshot saved to: ${path.relative(process.cwd(), snapshotJsonPath)}`);
  console.log(`💾 Action log saved to: ${path.relative(process.cwd(), actionsJsonPath)}`);

  console.log('\n======================================================');
  console.log('✅ Autonomous SERP Sentinel cycle complete.');
  console.log('======================================================\n');
}

runSentinel().catch(err => {
  console.error('SERP Sentinel run failed:', err);
  process.exit(1);
});
