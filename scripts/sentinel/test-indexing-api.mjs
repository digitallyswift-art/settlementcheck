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

async function testIndexing() {
  console.log('================================================================');
  console.log(' 🚀 Testing Google Indexing API Integration                     ');
  console.log('================================================================\n');

  const { GoogleIndexingClient } = await import('../../lib/agentic-engine/services/google-indexing-client.ts');

  console.log('1. Checking Service Account Credentials...');
  const isConfigured = GoogleIndexingClient.isConfigured();
  console.log(`   Configured: ${isConfigured ? 'YES [✓]' : 'NO [✗]'}`);
  console.log(`   Client Email: ${process.env.GSC_CLIENT_EMAIL}`);

  if (!isConfigured) {
    console.error('Credentials missing. Aborting test.');
    process.exit(1);
  }

  console.log('\n2. Testing OAuth2 Token Acquisition (Scope: https://www.googleapis.com/auth/indexing)...');
  try {
    const token = await GoogleIndexingClient.getAccessToken();
    console.log(`   ✅ Access Token acquired successfully! (${token.slice(0, 15)}...${token.slice(-10)})`);
  } catch (err) {
    console.error('   ❌ Token acquisition failed:', err.message);
    process.exit(1);
  }

  console.log('\n3. Testing Google Indexing API Call (URL_UPDATED)...');
  const testUrl = 'https://settlementcheck.co.uk/calculator/';
  const result = await GoogleIndexingClient.notifyUrlUpdated(testUrl);

  console.log('   Response:');
  console.log(`   • Target URL:   ${result.url}`);
  console.log(`   • Success:      ${result.success ? 'YES [✓]' : 'FAILED [✗]'}`);
  console.log(`   • HTTP Status:  ${result.httpStatus}`);
  if (result.notifyTime) {
    console.log(`   • Notify Time:  ${result.notifyTime}`);
  }
  if (result.error) {
    console.log(`   • Error / Note: ${result.error}`);
    if (result.httpStatus === 403) {
      console.log('\n   💡 NOTE: If HTTP 403 "Permission denied" or "Indexing API has not been used", the Google Cloud Project needs the Web Search Indexing API enabled:');
      console.log('      👉 Visit: https://console.cloud.google.com/apis/library/indexing.googleapis.com');
      console.log('      👉 Click "Enable" on the Indexing API for project "settlementcheck".');
    }
  }

  console.log('\n4. Testing Secondary Sitemap Ping Fallback...');
  const pingRes = await GoogleIndexingClient.pingSitemap();
  console.log(`   Sitemap Ping Status: ${pingRes.status} (${pingRes.success ? 'OK [✓]' : 'Network/Blocked'})`);

  console.log('\n================================================================');
  console.log(' ✅ Google Indexing Client Verification Finished');
  console.log('================================================================\n');
}

testIndexing().catch(err => {
  console.error('Fatal error during Indexing test:', err);
  process.exit(1);
});
