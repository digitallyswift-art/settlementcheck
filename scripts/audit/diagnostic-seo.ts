import inventory from '../../data/audit/website-inventory.json';
import fs from 'fs';

const pages = inventory.filter((r: any) => r.type === 'page');
const apis = inventory.filter((r: any) => r.type === 'api');

console.log(`Total items in inventory: ${inventory.length} (Pages: ${pages.length}, APIs: ${apis.length})`);

const sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
const sitemapUrls = [...sitemapContent.matchAll(/url:\s*`\$\{base\}([^`]*)`/g)].map(m => m[1]);
console.log('Sitemap.ts URLs count:', sitemapUrls.length);
console.log('Sitemap URLs sample:', sitemapUrls.slice(0, 5));

console.log(`=== SITEMAP COVERAGE AUDIT ===`);
console.log(`Total Pages: ${pages.length}, Sitemap URLs: ${sitemapUrls.length}`);
const pagesNotInSitemap = pages.filter((r: any) => !sitemapUrls.includes(r.route));
console.log(`Pages in inventory but NOT in sitemap.ts (${pagesNotInSitemap.length}):`);
pagesNotInSitemap.forEach((r: any) => console.log(`  - ${r.route} | robots: ${r.robotsDirective} | indexable: ${r.isIndexable}`));

const htmlSitemapContent = fs.readFileSync('app/sitemap/page.tsx', 'utf8');
const htmlSitemapLinks = [...htmlSitemapContent.matchAll(/href:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const pagesNotInHtmlSitemap = pages.filter((r: any) => !htmlSitemapLinks.includes(r.route));
console.log(`\nPages in inventory but NOT in HTML sitemap (${pagesNotInHtmlSitemap.length}):`);
pagesNotInHtmlSitemap.forEach((r: any) => console.log(`  - ${r.route}`));
process.exit(0);

// Title tag length check (50-60 chars target)
console.log('\n--- Title Tag Length Checks (Pages Only) ---');
const tooLongTitles = pages.filter((r: any) => r.title && r.title.length > 60);
const tooShortTitles = pages.filter((r: any) => r.title && r.title.length < 50);
const optimalTitles = pages.filter((r: any) => r.title && r.title.length >= 50 && r.title.length <= 60);
console.log(`Optimal Titles (50-60 chars): ${optimalTitles.length}`);
console.log(`Titles > 60 chars: ${tooLongTitles.length}`);
tooLongTitles.forEach((r: any) => console.log(`  [${r.title.length} chars] ${r.route}: "${r.title}"`));
console.log(`Titles < 50 chars: ${tooShortTitles.length}`);
tooShortTitles.forEach((r: any) => console.log(`  [${r.title.length} chars] ${r.route}: "${r.title}"`));

// Meta Description length check (140-155 chars target)
console.log('\n--- Meta Description Length Checks (Pages Only) ---');
const tooLongDesc = pages.filter((r: any) => r.description && r.description.length > 155);
const tooShortDesc = pages.filter((r: any) => r.description && r.description.length < 140);
const optimalDesc = pages.filter((r: any) => r.description && r.description.length >= 140 && r.description.length <= 155);
const missingDesc = pages.filter((r: any) => !r.description);
console.log(`Optimal Descriptions (140-155 chars): ${optimalDesc.length}`);
console.log(`Descriptions > 155 chars: ${tooLongDesc.length}`);
tooLongDesc.forEach((r: any) => console.log(`  [${r.description.length} chars] ${r.route}: "${r.description}"`));
console.log(`Descriptions < 140 chars: ${tooShortDesc.length}`);
tooShortDesc.forEach((r: any) => console.log(`  [${r.description.length} chars] ${r.route}: "${r.description}"`));
console.log(`Missing description: ${missingDesc.length}`);
missingDesc.forEach((r: any) => console.log(`  - ${r.route}`));

// Canonical consistency
console.log('\n--- Canonical URL Checks (Pages Only) ---');
const relativeCanonicals = pages.filter((r: any) => r.canonicalFormat === 'relative');
const absoluteCanonicals = pages.filter((r: any) => r.canonicalFormat === 'absolute');
const missingCanonicals = pages.filter((r: any) => !r.canonical);
console.log(`Absolute canonicals: ${absoluteCanonicals.length}`);
console.log(`Relative canonicals: ${relativeCanonicals.length}`);
console.log(`Missing canonicals: ${missingCanonicals.length}`);
if (relativeCanonicals.length > 0) {
  console.log('Sample relative canonicals:');
  relativeCanonicals.slice(0, 5).forEach((r: any) => console.log(`  ${r.route} -> canonical: "${r.canonical}"`));
}

// Schema types check
console.log('\n--- Schema Types Distribution across Pages ---');
const schemaCounts: Record<string, number> = {};
pages.forEach((r: any) => {
  const schemas = r.schemas || [];
  schemas.forEach((s: string) => {
    schemaCounts[s] = (schemaCounts[s] || 0) + 1;
  });
});
console.log('Schema distribution:', schemaCounts);

// Pages without schema
const pagesWithoutSchema = pages.filter((r: any) => !r.schemas || r.schemas.length === 0);
console.log(`\nPages without ANY Schema.org JSON-LD: ${pagesWithoutSchema.length}`);
pagesWithoutSchema.forEach((r: any) => console.log(`  - ${r.route} (${r.title})`));
