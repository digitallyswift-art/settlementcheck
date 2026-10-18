import fs from 'fs';
import path from 'path';
import { RouteInventoryItem } from './generate-route-inventory';

const inventory: RouteInventoryItem[] = JSON.parse(
  fs.readFileSync(path.resolve('data/audit/website-inventory.json'), 'utf8')
);

console.log('=== ROUTE INVENTORY SUMMARY ===');
console.log(`Total Routes: ${inventory.length}`);

const pages = inventory.filter(i => i.type === 'page');
const apis = inventory.filter(i => i.type === 'api');
const seo = inventory.filter(i => i.type === 'sitemap' || i.type === 'robots');

console.log(`Pages: ${pages.length}`);
console.log(`APIs: ${apis.length}`);
console.log(`SEO Endpoints: ${seo.length}`);

console.log('\n--- TIER BREAKDOWN ---');
const tierCounts: Record<string, number> = {};
inventory.forEach(i => {
  tierCounts[i.tier] = (tierCounts[i.tier] || 0) + 1;
});
for (const [tier, count] of Object.entries(tierCounts)) {
  console.log(`  ${tier}: ${count}`);
}

console.log('\n--- INTENT BREAKDOWN ---');
const intentCounts: Record<string, number> = {};
pages.forEach(p => {
  intentCounts[p.intent] = (intentCounts[p.intent] || 0) + 1;
});
for (const [intent, count] of Object.entries(intentCounts)) {
  console.log(`  ${intent}: ${count}`);
}

console.log('\n--- SCHEMA COVERAGE ---');
const schemaMap: Record<string, number> = {};
pages.forEach(p => {
  p.schemas.forEach(s => {
    schemaMap[s] = (schemaMap[s] || 0) + 1;
  });
});
for (const [s, count] of Object.entries(schemaMap)) {
  console.log(`  ${s}: ${count} pages`);
}
const noSchemaPages = pages.filter(p => p.schemas.length === 0);
console.log(`  Pages with 0 schemas: ${noSchemaPages.length}`);

console.log('\n--- SRA & LEGAL DISCLAIMERS ---');
const legalDisclaimerPages = pages.filter(p => p.disclaimers.legalAdvice);
const sraBoundaryPages = pages.filter(p => p.disclaimers.sraBoundary);
const feeDisclaimerPages = pages.filter(p => p.disclaimers.employerPaysFees);
const taxDisclaimerPages = pages.filter(p => p.disclaimers.taxAdvice);

console.log(`  Pages with 'Not Legal Advice': ${legalDisclaimerPages.length} / ${pages.length}`);
console.log(`  Pages with SRA Boundary: ${sraBoundaryPages.length} / ${pages.length}`);
console.log(`  Pages with 'Employer Pays Fees': ${feeDisclaimerPages.length} / ${pages.length}`);
console.log(`  Pages with Tax Disclaimer: ${taxDisclaimerPages.length} / ${pages.length}`);

console.log('\n--- CANONICAL ALIGNMENT ---');
const relativeCanonicals = pages.filter(p => p.canonicalFormat === 'relative');
const absoluteCanonicals = pages.filter(p => p.canonicalFormat === 'absolute');
const missingCanonicals = pages.filter(p => p.canonicalFormat === 'missing');
console.log(`  Absolute URLs (https://...): ${absoluteCanonicals.length}`);
console.log(`  Relative URLs (/...): ${relativeCanonicals.length}`);
console.log(`  Missing Canonicals: ${missingCanonicals.length}`);
if (missingCanonicals.length > 0) {
  missingCanonicals.forEach(p => console.log(`    Missing in: ${p.route} (${p.file})`));
}

console.log('\n--- INBOUND INTERNAL LINKS STATS ---');
const sortedByLinks = [...pages].sort((a, b) => b.inboundLinksCount - a.inboundLinksCount);
console.log('Top 5 most linked pages:');
sortedByLinks.slice(0, 5).forEach(p => console.log(`  ${p.route}: ${p.inboundLinksCount} links`));
console.log('Pages with 0 inbound links (Orphans):');
const orphans = pages.filter(p => p.inboundLinksCount === 0 && p.isIndexable);
console.log(`  Count: ${orphans.length}`);
orphans.forEach(p => console.log(`    ${p.route}`));

console.log('\n--- SITEMAP VS ROBOTS DIRECTIVES ---');
const sitemapAnomalies = pages.filter(p => (p.isInSitemap && !p.isIndexable) || (!p.isInSitemap && p.isIndexable));
console.log(`  Sitemap & Indexability Inconsistencies: ${sitemapAnomalies.length}`);
sitemapAnomalies.forEach(p => {
  console.log(`    ${p.route} -> In Sitemap: ${p.isInSitemap}, Robots: ${p.robotsDirective}`);
});
