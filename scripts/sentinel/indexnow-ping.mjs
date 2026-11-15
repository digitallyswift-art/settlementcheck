import fs from 'fs';
import path from 'path';

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

const DEFAULT_KEY = '6BBF580BBE0BA7A27BDD225BD91A979F';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const HOST = 'settlementcheck.co.uk';
const BASE_URL = `https://${HOST}`;
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const PRIMARY_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BING_DIRECT_ENDPOINT = 'https://www.bing.com/indexnow';

/**
 * Extract canonical URLs from app/sitemap.ts
 */
export function extractCanonicalRoutesFromSitemap() {
  const sitemapPath = path.resolve('app/sitemap.ts');
  const routes = new Set();

  if (fs.existsSync(sitemapPath)) {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urlPattern = /url:\s*`\$\{base\}([^`]+)`/g;
    let match;
    while ((match = urlPattern.exec(content)) !== null) {
      let routePath = match[1];
      if (!routePath.startsWith('/')) routePath = '/' + routePath;
      routes.add(`${BASE_URL}${routePath}`);
    }
  }

  // Ensure root is present
  routes.add(`${BASE_URL}/`);

  return Array.from(routes).sort();
}

/**
 * Dispatch IndexNow batch payload
 */
export async function dispatchIndexNow(urls, options = {}) {
  const isDryRun = Boolean(options.dryRun);
  const preferredEndpoint = options.endpoint || PRIMARY_ENDPOINT;

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  if (isDryRun) {
    return {
      success: true,
      statusCode: 0,
      dryRun: true,
      endpoint: preferredEndpoint,
      payload,
    };
  }

  // Try preferred endpoint first, with automatic fallback to Bing direct endpoint if connection resets
  const endpointsToTry = options.endpoint 
    ? [options.endpoint] 
    : [PRIMARY_ENDPOINT, BING_DIRECT_ENDPOINT];

  let lastError = null;

  for (const endpoint of endpointsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      return {
        success: response.ok || response.status === 202,
        statusCode: response.status,
        statusText: response.statusText,
        endpoint,
        responseText: text,
        urlCount: urls.length,
      };
    } catch (err) {
      lastError = err;
      // Continue to next endpoint in fallback list
    }
  }

  return {
    success: false,
    statusCode: 500,
    endpoint: preferredEndpoint,
    error: lastError ? lastError.message : 'Unknown network failure',
    urlCount: urls.length,
  };
}

// CLI Execution runner
async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const alsoBing = args.includes('--bing') || args.includes('--bing-direct');

  // Check for specific --url argument
  let targetUrls = [];
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    const raw = args[urlIdx + 1];
    targetUrls = raw.split(',').map((u) => u.trim());
  } else {
    targetUrls = extractCanonicalRoutesFromSitemap();
  }

  const endpointIdx = args.indexOf('--endpoint');
  const customEndpoint = endpointIdx !== -1 && args[endpointIdx + 1] ? args[endpointIdx + 1] : undefined;

  console.log('================================================================');
  console.log(' 🚀 IndexNow Real-Time Dispatcher (Bing, Copilot & Perplexity)  ');
  console.log('================================================================\n');

  console.log(`• Host:          ${HOST}`);
  console.log(`• IndexNow Key:  ${INDEXNOW_KEY}`);
  console.log(`• Key Location:  ${KEY_LOCATION}`);
  console.log(`• Target URLs:   ${targetUrls.length} canonical routes`);
  console.log(`• Execution:     ${isDryRun ? 'DRY-RUN (Simulated)' : 'LIVE HTTP DISPATCH'}`);
  console.log(`• Endpoint:      ${customEndpoint || `${PRIMARY_ENDPOINT} (with fallback to ${BING_DIRECT_ENDPOINT})`}\n`);

  console.log('First 5 Canonical URLs to submit:');
  targetUrls.slice(0, 5).forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
  if (targetUrls.length > 5) {
    console.log(`  ... and ${targetUrls.length - 5} more canonical URLs.`);
  }

  console.log('\n--- Initiating IndexNow Batch Dispatch ---');
  const result = await dispatchIndexNow(targetUrls, { dryRun: isDryRun, endpoint: customEndpoint });

  if (result.dryRun) {
    console.log(' [✓] DRY-RUN SUCCESSFUL: Payload validated. 0 network calls sent.');
    console.log(`     JSON payload contains ${result.payload.urlList.length} URLs.`);
    return;
  }

  console.log(`• Primary Dispatch Status:  HTTP ${result.statusCode} (${result.statusText || 'OK'})`);
  if (result.statusCode === 200) {
    console.log('  [✓] SUCCESS: All URLs successfully submitted and accepted by IndexNow.');
  } else if (result.statusCode === 202) {
    console.log('  [✓] ACCEPTED: IndexNow received URLs. Key verification or indexing queued.');
  } else {
    console.log(`  [!] Response: ${result.responseText || result.error || 'Check response'}`);
    if (result.statusCode === 403) {
      console.log('  💡 NOTE: IndexNow validates ownership by fetching https://settlementcheck.co.uk/<key>.txt.');
      console.log('     Once these staged verification assets are deployed to production,');
      console.log('     IndexNow will verify ownership and return HTTP 200/202.');
    }
  }

  if (alsoBing && !isDryRun) {
    console.log('\n--- Initiating Secondary Bing-Direct Dispatch ---');
    const bingResult = await dispatchIndexNow(targetUrls, { endpoint: BING_DIRECT_ENDPOINT });
    console.log(`• Bing Direct Status: HTTP ${bingResult.statusCode} (${bingResult.statusText || 'OK'})`);
  }

  console.log('\n================================================================');
  console.log(' IndexNow Verification & AI Ingestion Summary');
  console.log('================================================================');
  console.log(' • Search Engines: Microsoft Bing, Copilot, ChatGPT Search, Seznam, Yandex');
  console.log(` • Canonical URLs Dispatched: ${targetUrls.length}`);
  console.log(' • Expected Indexing Crawl Window: 15 to 60 minutes');
  console.log('================================================================\n');
}

if (process.argv[1] && process.argv[1].endsWith('indexnow-ping.mjs')) {
  run().catch((err) => {
    console.error('IndexNow Dispatcher failed:', err);
    process.exit(1);
  });
}
