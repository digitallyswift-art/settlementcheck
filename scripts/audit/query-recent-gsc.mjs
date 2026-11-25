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

async function main() {
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
  const { access_token } = await tokenRes.json();

  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

  console.log(`Querying GSC API for site: ${siteUrl}`);
  console.log(`Range: ${startDate} to ${endDate}`);

  // 1. By Date
  const dateRes = await fetch(
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
        dimensions: ['date'],
        rowLimit: 100,
      }),
    }
  );
  const dateData = await dateRes.json();
  console.log('\n--- Daily Search Performance (Date Dimension) ---');
  if (dateData.rows && dateData.rows.length > 0) {
    for (const r of dateData.rows) {
      console.log(`${r.keys[0]}: Clicks=${r.clicks}, Impr=${r.impressions}, CTR=${(r.ctr * 100).toFixed(2)}%, Pos=${r.position.toFixed(1)}`);
    }
  } else {
    console.log('No rows returned for dates. Response:', JSON.stringify(dateData));
  }

  // Also test dataState='all' (to see if fresh/hourly/same-day data is available)
  const freshRes = await fetch(
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
        dimensions: ['date'],
        dataState: 'all',
        rowLimit: 100,
      }),
    }
  );
  const freshData = await freshRes.json();
  console.log('\n--- With dataState="all" (including fresh/provisional data) ---');
  if (freshData.rows && freshData.rows.length > 0) {
    for (const r of freshData.rows) {
      console.log(`${r.keys[0]}: Clicks=${r.clicks}, Impr=${r.impressions}, CTR=${(r.ctr * 100).toFixed(2)}%, Pos=${r.position.toFixed(1)}`);
    }
  } else {
    console.log('No fresh rows returned or error:', JSON.stringify(freshData));
  }
}

main().catch(console.error);
