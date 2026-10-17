#!/usr/bin/env node
/**
 * SettlementCheck GSC Connection Test Script (Pure Node.js ESM)
 * Verifies that Google Cloud Service Account credentials are valid,
 * authentication succeeds, and live Search Analytics data can be fetched.
 *
 * Usage:
 *   node scripts/sentinel/test-gsc-connection.mjs
 *   npm run test:gsc
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load .env.local if present
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

// Fallback: Check for service account JSON key files in root if env vars not set
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
          process.env.GSC_CREDENTIALS_FILE = cand;
          break;
        }
      } catch {}
    }
  }
}

const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
let privateKey = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
const siteUrl = process.env.GSC_SITE_URL || 'https://settlementcheck.co.uk/';

async function testConnection() {
  console.log('\n======================================================');
  console.log('🔍 Testing Google Search Console API Connection');
  console.log('======================================================\n');

  const isConfigured = Boolean(clientEmail && privateKey);
  console.log(`• Credentials Detected: ${isConfigured ? '✅ YES' : '❌ NO'}`);
  if (process.env.GSC_CREDENTIALS_FILE) {
    console.log(`• Source:                Key file (${process.env.GSC_CREDENTIALS_FILE})`);
  }

  if (!isConfigured) {
    console.log('\n⚠️  Missing credentials in .env.local!');
    console.log('   Required variables:');
    console.log('   - GSC_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"');
    console.log('   - GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
    console.log('   - GSC_SITE_URL="https://settlementcheck.co.uk/"\n');
    console.log('Cost: $0.00 (100% Free - GSC API has zero charge).');
    console.log('Follow the setup guide in: docs/GSC_AUTOMATION_SETUP_GUIDE.md\n');
    process.exit(1);
  }

  console.log(`• Service Account Email: ${clientEmail}`);
  console.log(`• Target Site URL:       ${siteUrl}`);
  console.log('• Performing OAuth2 JWT handshake with Google APIs...');

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

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      throw new Error(`Google OAuth2 Token Exchange Failed (${tokenRes.status}): ${errBody}`);
    }

    const { access_token } = await tokenRes.json();
    console.log('• OAuth2 Access Token Received: ✅ SUCCESS');

    console.log('• Querying Google Search Console Search Analytics API...');
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const apiRes = await fetch(
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
          rowLimit: 10,
        }),
      }
    );

    if (!apiRes.ok) {
      const apiErr = await apiRes.text();
      throw new Error(`Search Console API query failed (${apiRes.status}): ${apiErr}`);
    }

    const data = await apiRes.json();
    const rows = data.rows || [];
    console.log(`• Search Console API Query:     ✅ SUCCESS`);
    console.log(`• Live Rows Returned:           ${rows.length}`);

    if (rows.length > 0) {
      console.log('\n--- Live Query Sample ---');
      rows.slice(0, 3).forEach(r => {
        console.log(`  "${r.keys[0]}": ${r.impressions} impr, ${r.clicks} clicks (Pos: ${r.position.toFixed(1)})`);
      });
    }

    console.log('\n======================================================');
    console.log('🎉 Handshake verified! GSC is ready for autonomous fleet pulls.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ Connection error:', err.message);
    console.log('\nTroubleshooting Checklist:');
    console.log('1. Did you enable "Google Search Console API" in Google Cloud Console?');
    console.log('2. Did you add the service account email as a User in Search Console Settings?');
    console.log('3. Is GSC_SITE_URL formatted exactly as shown in Search Console (e.g. "https://settlementcheck.co.uk/")?');
    process.exit(1);
  }
}

testConnection();
