import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load .env.local
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

// Fallback key files
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

const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
let privateKey = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:settlementcheck.co.uk';

async function pullFullGsc() {
  console.log('Connecting to Live GSC API...');
  if (!clientEmail || !privateKey) {
    console.error('Missing GSC credentials.');
    process.exit(1);
  }

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

  if (!tokenRes.ok) {
    throw new Error(`Token exchange failed: ${await tokenRes.text()}`);
  }
  const { access_token } = await tokenRes.json();
  console.log('✓ Token received.');

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. Pull Queries
  console.log(`Querying GSC API for queries (${startDate} to ${endDate})...`);
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
        rowLimit: 500,
      }),
    }
  );
  const queryData = await queryRes.json();
  const queryRows = queryData.rows || [];
  console.log(`✓ Fetched ${queryRows.length} query rows.`);

  // 2. Pull Pages
  console.log('Querying GSC API for pages...');
  const pageRes = await fetch(
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
        dimensions: ['page'],
        rowLimit: 500,
      }),
    }
  );
  const pageData = await pageRes.json();
  const pageRows = pageData.rows || [];
  console.log(`✓ Fetched ${pageRows.length} page rows.`);

  // 3. Pull Query + Page pairs (to identify exact intent mapping)
  console.log('Querying GSC API for query + page combinations...');
  const pairRes = await fetch(
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
        dimensions: ['query', 'page'],
        rowLimit: 500,
      }),
    }
  );
  const pairData = await pairRes.json();
  const pairRows = pairData.rows || [];
  console.log(`✓ Fetched ${pairRows.length} query+page pairs.`);

  const output = {
    pulledAt: new Date().toISOString(),
    siteUrl,
    dateRange: { startDate, endDate },
    totals: {
      queryCount: queryRows.length,
      pageCount: pageRows.length,
      pairCount: pairRows.length,
      totalClicks: queryRows.reduce((sum: number, r: any) => sum + r.clicks, 0),
      totalImpressions: queryRows.reduce((sum: number, r: any) => sum + r.impressions, 0),
    },
    topQueriesByClicks: [...queryRows].sort((a: any, b: any) => b.clicks - a.clicks).slice(0, 20),
    topQueriesByImpressions: [...queryRows].sort((a: any, b: any) => b.impressions - a.impressions).slice(0, 20),
    topPagesByClicks: [...pageRows].sort((a: any, b: any) => b.clicks - a.clicks).slice(0, 20),
    topPagesByImpressions: [...pageRows].sort((a: any, b: any) => b.impressions - a.impressions).slice(0, 20),
    strikingDistanceQueries: queryRows.filter((r: any) => r.position >= 4.0 && r.position <= 20.0).sort((a: any, b: any) => b.impressions - a.impressions),
    rawQueries: queryRows,
    rawPages: pageRows,
    rawPairs: pairRows,
  };

  fs.writeFileSync('data/audit/live-gsc-performance.json', JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\nSuccessfully saved complete live GSC dataset to data/audit/live-gsc-performance.json`);
  console.log(`• Total Clicks: ${output.totals.totalClicks}`);
  console.log(`• Total Impressions: ${output.totals.totalImpressions}`);
  console.log(`• Striking Distance Queries (Pos 4-20): ${output.strikingDistanceQueries.length}`);
}

pullFullGsc().catch(err => {
  console.error('FATAL GSC Pull error:', err);
  process.exit(1);
});
