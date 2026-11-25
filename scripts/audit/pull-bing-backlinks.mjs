import dns from 'dns';
import fs from 'fs';
import path from 'path';

dns.setDefaultResultOrder('ipv4first');

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

const BING_API_KEY = process.env.BING_API_KEY;
const SITE_URL = 'https://settlementcheck.co.uk/';
const API_BASE = 'https://ssl.bing.com/webmaster/api.svc/json';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function run() {
  if (!BING_API_KEY) {
    console.error('Missing BING_API_KEY');
    process.exit(1);
  }

  console.log('Checking registered sites in Bing Webmaster Tools...');
  const sitesData = await fetchJson(`${API_BASE}/GetUserSites?apikey=${BING_API_KEY}`);
  const sites = sitesData.d || [];
  console.log('Registered sites:', sites.map(s => s.Url));

  const targetSite = sites[0]?.Url || SITE_URL;
  console.log(`Querying Bing Webmaster API GetLinkCounts for ${targetSite}...`);
  let page = 0;
  let allLinkCounts = [];
  while (true) {
    const url = `${API_BASE}/GetLinkCounts?siteUrl=${encodeURIComponent(targetSite)}&page=${page}&apikey=${BING_API_KEY}`;
    const data = await fetchJson(url);
    const d = data.d;
    if (!d || !d.Links || d.Links.length === 0) break;
    allLinkCounts.push(...d.Links);
    if (page + 1 >= (d.TotalPages || 1)) break;
    page++;
  }

  console.log(`Total pages with inbound links reported by Bing: ${allLinkCounts.length}`);
  if (allLinkCounts.length > 0) {
    console.table(
      allLinkCounts.slice(0, 20).map(l => ({
        targetUrl: l.Url,
        inboundLinks: l.Count,
      }))
    );

    // Pull specific referring links for the top 5 target URLs
    const topTargets = [...allLinkCounts].sort((a, b) => b.Count - a.Count).slice(0, 5);
    for (const target of topTargets) {
      const linksUrl = `${API_BASE}/GetUrlLinks?siteUrl=${encodeURIComponent(SITE_URL)}&url=${encodeURIComponent(target.Url)}&page=0&apikey=${BING_API_KEY}`;
      const linkDetails = await fetchJson(linksUrl);
      const links = linkDetails.d?.Links || [];
      console.log(`\n--- Inbound links to ${target.Url} (${links.length} returned on page 0) ---`);
      for (const item of links.slice(0, 15)) {
        console.log(`  • Source: ${item.Url} | Anchor: "${item.AnchorText || '(empty)'}"`);
      }
    }
  } else {
    console.log('Bing GetLinkCounts returned 0 inbound link rows for https://settlementcheck.co.uk/.');
  }
}

run().catch(console.error);
