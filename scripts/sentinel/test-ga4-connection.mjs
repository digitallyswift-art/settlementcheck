#!/usr/bin/env node
/**
 * SettlementCheck GA4 Connection Test Script (Pure Node.js ESM)
 * Verifies that Google Cloud Service Account credentials are valid,
 * authentication succeeds for Google Analytics Data API,
 * and live Realtime active user data can be queried.
 *
 * Usage:
 *   node scripts/sentinel/test-ga4-connection.mjs
 *   npm run test:ga4
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
let credentialsSource = '.env.local';
if (!process.env.GSC_CLIENT_EMAIL || !process.env.GSC_PRIVATE_KEY) {
  const candidateFiles = ['gsc-credentials.json', 'service-account.json', 'gsc-key.json', 'google-credentials.json'];
  for (const cand of candidateFiles) {
    const candPath = path.resolve(cand);
    if (fs.existsSync(candPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(candPath, 'utf-8'));
        if (parsed.client_email && parsed.private_key) {
          process.env.GSC_CLIENT_EMAIL = parsed.client_email;
          process.env.GSC_PRIVATE_KEY = parsed.private_key;
          process.env.GSC_PROJECT_ID = parsed.project_id;
          credentialsSource = cand;
          break;
        }
      } catch {}
    }
  }
}

const clientEmail = process.env.GA4_CLIENT_EMAIL || process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
let privateKey = process.env.GA4_PRIVATE_KEY || process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
const rawPropertyId = process.env.GA4_PROPERTY_ID || process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;
const propertyId = rawPropertyId ? rawPropertyId.replace(/^properties\//, '').trim() : null;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID || 'G-24BBF7DRPG';
const projectId = process.env.GSC_PROJECT_ID || 'settlementcheck';

async function testGa4Connection() {
  console.log('\n======================================================');
  console.log('🔍 Testing Google Analytics 4 (GA4) API Connection');
  console.log('======================================================\n');

  const hasCredentials = Boolean(clientEmail && privateKey);
  console.log(`• Credentials Detected: ${hasCredentials ? '✅ YES' : '❌ NO'}`);
  console.log(`• Source:               ${credentialsSource}`);
  console.log(`• Service Account:      ${clientEmail || 'None'}`);
  console.log(`• Measurement ID:       ${measurementId}`);
  console.log(`• GA4 Property ID:      ${propertyId ? `✅ ${propertyId}` : '❌ NOT SET'}`);

  if (!hasCredentials) {
    console.log('\n❌ Missing Google Cloud Service Account credentials.');
    console.log('   Expected GSC_CLIENT_EMAIL / GSC_PRIVATE_KEY or gsc-credentials.json in root.');
    process.exit(1);
  }

  if (!propertyId) {
    console.log('\n⚠️  GA4_PROPERTY_ID is not configured in .env.local!');
    console.log('   How to find your GA4 Property ID:');
    console.log('   1. Open Google Analytics (https://analytics.google.com/)');
    console.log('   2. Click "Admin" (gear icon bottom left)');
    console.log('   3. Under Property column, click "Property Settings"');
    console.log('   4. Copy the numeric "PROPERTY ID" at top right (e.g. 423859201)');
    console.log('   5. Add to .env.local:');
    console.log('      GA4_PROPERTY_ID=423859201\n');
    console.log('   Also ensure the service account is added:');
    console.log(`   - Add: ${clientEmail} as Viewer under Property Access Management\n`);
    process.exit(1);
  }

  console.log('\n• Generating OAuth2 JWT assertion (Scope: analytics.readonly)...');

  try {
    privateKey = privateKey.replace(/\\n/g, '\n');
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
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

    console.log(`• Querying GA4 Realtime API for Property: properties/${propertyId}...`);
    const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`;

    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
        dimensions: [
          { name: 'unifiedScreenName' }
        ],
        limit: 10,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      let errJson;
      try { errJson = JSON.parse(errText); } catch {}

      const errMsg = errJson?.error?.message || errText;
      const status = errJson?.error?.status || apiRes.status;

      console.log(`\n❌ GA4 API Request Failed (${status}):\n`);
      console.log(`   Message: ${errMsg}\n`);

      if (errMsg.includes('Google Analytics Data API has not been used') || errMsg.includes('SERVICE_DISABLED')) {
        const activationUrl = errJson?.error?.details?.[0]?.metadata?.activationUrl ||
          `https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview?project=${projectId}`;
        console.log('👉 ACTION REQUIRED: Enable Google Analytics Data API:');
        console.log(`   1. Open: ${activationUrl}`);
        console.log('   2. Click "Enable"');
        console.log('   3. Re-run: npm run test:ga4\n');
      } else if (apiRes.status === 403 || errMsg.includes('permission')) {
        console.log('👉 ACTION REQUIRED: Grant GA4 Property Access:');
        console.log('   1. Open Google Analytics (https://analytics.google.com/)');
        console.log('   2. Go to: Admin > Property Access Management');
        console.log('   3. Click "+" > Add users');
        console.log(`   4. Email: ${clientEmail}`);
        console.log('   5. Role: Viewer');
        console.log('   6. Click "Add" and re-run: npm run test:ga4\n');
      }
      process.exit(1);
    }

    const data = await apiRes.json();
    console.log('• GA4 API Response:              ✅ SUCCESS');
    console.log('======================================================');
    console.log('📊 LIVE GA4 REALTIME TELEMETRY (Last 30 Minutes)');
    console.log('======================================================');

    let totalActive = 0;
    const rows = data.rows || [];
    for (const r of rows) {
      totalActive += parseInt(r.metricValues?.[0]?.value || '0', 10);
    }

    console.log(`\n🔴 Active Users Right Now: ${totalActive}`);
    console.log(`📄 Active Pages (${rows.length} reporting):`);

    if (rows.length === 0) {
      console.log('   (No active users currently browsing on the site)');
    } else {
      for (const r of rows) {
        const path = r.dimensionValues?.[0]?.value || '/';
        const users = r.metricValues?.[0]?.value || '0';
        const views = r.metricValues?.[1]?.value || '0';
        console.log(`   • ${path.padEnd(35)} -> ${users.padStart(3)} active user(s) | ${views} page views`);
      }
    }

    console.log('\n✅ GA4 API is fully operational and streaming live data to SettlementCheck!\n');
  } catch (err) {
    console.error('\n❌ Fatal error during GA4 test:', err.message);
    process.exit(1);
  }
}

testGa4Connection();
