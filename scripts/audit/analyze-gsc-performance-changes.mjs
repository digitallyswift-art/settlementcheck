import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
let privateKey = (process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:settlementcheck.co.uk';

async function getAccessToken() {
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
  const data = await tokenRes.json();
  return data.access_token;
}

async function queryGsc(token, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return await res.json();
}

async function run() {
  const token = await getAccessToken();

  console.log('========================================================================');
  console.log('SETTLEMENTCHECK GSC PERFORMANCE AUDIT: PRE vs POST RECENT DEPLOYMENTS');
  console.log('========================================================================');

  // Daily Breakdown
  const daily = await queryGsc(token, {
    startDate: '2026-11-10',
    endDate: '2026-11-20',
    dimensions: ['date'],
    dataState: 'all',
  });

  console.log('\n--- Daily Trend (Nov 10 to Nov 20) ---');
  console.table(
    (daily.rows || []).map(r => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: (r.ctr * 100).toFixed(2) + '%',
      position: r.position.toFixed(1),
      status: r.keys[0] >= '2026-11-18' ? (r.keys[0] === '2026-11-20' ? 'POST-DEPLOY (IN PROGRESS)' : 'POST-DEPLOY') : 'PRE-DEPLOY',
    }))
  );

  const preTotalDays = 3;
  const postTotalDays = 2;

  const preDailyRows = (daily.rows || []).filter(r => r.keys[0] >= '2026-11-15' && r.keys[0] <= '2026-11-17');
  const postDailyRows = (daily.rows || []).filter(r => r.keys[0] >= '2026-11-18' && r.keys[0] <= '2026-11-19');

  const preTotalClicks = preDailyRows.reduce((a, b) => a + b.clicks, 0);
  const preTotalImpr = preDailyRows.reduce((a, b) => a + b.impressions, 0);
  const postTotalClicks = postDailyRows.reduce((a, b) => a + b.clicks, 0);
  const postTotalImpr = postDailyRows.reduce((a, b) => a + b.impressions, 0);

  const preAvgClicksPerDay = preTotalClicks / preTotalDays;
  const postAvgClicksPerDay = postTotalClicks / postTotalDays;
  const preAvgImprPerDay = preTotalImpr / preTotalDays;
  const postAvgImprPerDay = postTotalImpr / postTotalDays;

  const preAvgCtr = (preTotalClicks / preTotalImpr) * 100;
  const postAvgCtr = (postTotalClicks / postTotalImpr) * 100;

  console.log('\n--- Macro Sitewide Comparison ---');
  console.log(`• Daily Impressions: ${preAvgImprPerDay.toFixed(0)}/day (Pre) -> ${postAvgImprPerDay.toFixed(0)}/day (Post) [${(((postAvgImprPerDay - preAvgImprPerDay) / preAvgImprPerDay) * 100).toFixed(1)}% change]`);
  console.log(`• Daily Clicks:      ${preAvgClicksPerDay.toFixed(1)}/day (Pre) -> ${postAvgClicksPerDay.toFixed(1)}/day (Post) [${(((postAvgClicksPerDay - preAvgClicksPerDay) / preAvgClicksPerDay) * 100).toFixed(1)}% change]`);
  console.log(`• Aggregate CTR:     ${preAvgCtr.toFixed(2)}% (Pre) -> ${postAvgCtr.toFixed(2)}% (Post)`);

  // Query + Page pair analysis for key queries
  const pairData = await queryGsc(token, {
    startDate: '2026-11-18',
    endDate: '2026-11-19',
    dimensions: ['query', 'page'],
    dataState: 'all',
    rowLimit: 250,
  });

  const prePairData = await queryGsc(token, {
    startDate: '2026-11-15',
    endDate: '2026-11-17',
    dimensions: ['query', 'page'],
    rowLimit: 250,
  });

  const prePairMap = new Map();
  for (const r of prePairData.rows || []) {
    prePairMap.set(`${r.keys[0]}|||${r.keys[1]}`, r);
  }

  console.log('\n--- Key Query-to-Page Mapping Movements ---');
  const trackedQueries = [
    'settlement agreement calculator',
    'settlement agreement calculator uk',
    'settlement agreement calculator gov',
    'acas settlement agreement calculator',
    'calculate settlement agreement',
    'employment settlement calculator',
    'compromise agreement calculator',
    'redundancy & settlement agreements',
    'redundancy vs settlement agreement',
  ];

  for (const q of trackedQueries) {
    const postMatches = (pairData.rows || []).filter(r => r.keys[0].toLowerCase().includes(q.toLowerCase()));
    if (postMatches.length > 0) {
      for (const m of postMatches) {
        const pre = prePairMap.get(`${m.keys[0]}|||${m.keys[1]}`);
        const shortPage = m.keys[1].replace('https://settlementcheck.co.uk', '') || '/';
        const prePosStr = pre ? pre.position.toFixed(1) : 'None';
        const postPosStr = m.position.toFixed(1);
        console.log(`Query: "${m.keys[0]}" -> Page: ${shortPage}`);
        console.log(`  Post: ${m.impressions} impr (${(m.impressions/2).toFixed(1)}/d), ${m.clicks} clicks, Pos: ${postPosStr} | Pre Pos: ${prePosStr}`);
      }
    } else {
      console.log(`Query: "${q}" -- No impressions in top 250 post-deploy rows`);
    }
  }

  // Top Pages that grew
  const prePages = await queryGsc(token, {
    startDate: '2026-11-15',
    endDate: '2026-11-17',
    dimensions: ['page'],
    rowLimit: 100,
  });
  const postPages = await queryGsc(token, {
    startDate: '2026-11-18',
    endDate: '2026-11-19',
    dimensions: ['page'],
    dataState: 'all',
    rowLimit: 100,
  });

  const prePageMap = new Map();
  for (const r of prePages.rows || []) {
    prePageMap.set(r.keys[0], r);
  }

  const pageComparison = [];
  for (const r of postPages.rows || []) {
    const pageUrl = r.keys[0];
    const pre = prePageMap.get(pageUrl) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const preImprPerDay = pre.impressions / preTotalDays;
    const postImprPerDay = r.impressions / postTotalDays;
    const preClicksPerDay = pre.clicks / preTotalDays;
    const postClicksPerDay = r.clicks / postTotalDays;
    const shortUrl = pageUrl.replace('https://settlementcheck.co.uk', '') || '/';

    pageComparison.push({
      page: shortUrl,
      postImprPerDay: Math.round(postImprPerDay),
      preImprPerDay: Math.round(preImprPerDay),
      imprDeltaPct: preImprPerDay > 0 ? (((postImprPerDay - preImprPerDay) / preImprPerDay) * 100).toFixed(0) + '%' : 'NEW',
      postClicksPerDay: postClicksPerDay.toFixed(1),
      preClicksPerDay: preClicksPerDay.toFixed(1),
      clicksDeltaPct: preClicksPerDay > 0 ? (((postClicksPerDay - preClicksPerDay) / preClicksPerDay) * 100).toFixed(0) + '%' : 'NEW',
      postPos: r.position.toFixed(1),
      prePos: pre.position ? pre.position.toFixed(1) : '-',
    });
  }

  pageComparison.sort((a, b) => b.postImprPerDay - a.postImprPerDay);
  console.log('\n--- Top 15 Pages Ranked by Post-Deploy Daily Impressions ---');
  console.table(pageComparison.slice(0, 15));
}

run().catch(console.error);
