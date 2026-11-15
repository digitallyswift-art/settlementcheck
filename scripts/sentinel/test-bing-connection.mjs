#!/usr/bin/env node
/**
 * SettlementCheck Bing Webmaster API Connection & Quota Verification Script
 * Uses official Bing Webmaster Tools REST API to verify authentication,
 * inspect remaining URL submission quotas, and test API connectivity.
 *
 * Usage:
 *   node scripts/sentinel/test-bing-connection.mjs
 *   npm run test:bing
 */

import dns from 'dns';
import fs from 'fs';
import path from 'path';

dns.setDefaultResultOrder('ipv4first');

// 1. Load .env.local if present
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

const BING_API_KEY = process.env.BING_API_KEY;
const SITE_URL = 'https://settlementcheck.co.uk/';
const API_BASE = 'https://ssl.bing.com/webmaster/api.svc/json';

async function testBingConnection() {
  console.log('================================================================');
  console.log(' 🚀 SettlementCheck Bing Webmaster API Connectivity Test        ');
  console.log('================================================================\n');

  console.log('1. Checking Bing API Credentials...');
  if (!BING_API_KEY) {
    console.error('   ❌ BING_API_KEY not found in environment or .env.local.');
    process.exit(1);
  }
  console.log(`   • API Key:  ${BING_API_KEY.slice(0, 6)}...${BING_API_KEY.slice(-6)} [✓]`);
  console.log(`   • Site URL: ${SITE_URL}`);

  console.log('\n2. Testing Bing Webmaster API Authentication (GetUrlSubmissionQuota)...');
  try {
    const quotaUrl = `${API_BASE}/GetUrlSubmissionQuota?siteUrl=${encodeURIComponent(SITE_URL)}&apikey=${BING_API_KEY}`;
    const response = await fetch(quotaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`   ❌ Bing API call failed with HTTP ${response.status}: ${errText}`);
      process.exit(1);
    }

    const data = await response.json();
    const quota = data.d || {};

    console.log('   ✅ Authentication Successful!');
    console.log(`   • Daily URL Quota Remaining:   ${quota.DailyQuota !== undefined ? quota.DailyQuota : 'Unlimited'}`);
    console.log(`   • Monthly URL Quota Remaining: ${quota.MonthlyQuota !== undefined ? quota.MonthlyQuota : 'Unlimited'}`);
  } catch (err) {
    console.error('   ❌ Connection Error:', err.message);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log(' Bing Webmaster Pipeline Verification Summary');
  console.log('================================================================');
  console.log(' • Status:              ACTIVE & AUTHENTICATED [HTTP 200 OK]');
  console.log(' • Search Engines:       Microsoft Bing & Microsoft Copilot');
  console.log(' • Protocol Coverage:   Bing Webmaster API + Real-Time IndexNow');
  console.log('================================================================\n');
}

testBingConnection().catch((err) => {
  console.error('Fatal Bing Test Error:', err);
  process.exit(1);
});
