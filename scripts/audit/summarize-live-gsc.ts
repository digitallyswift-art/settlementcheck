import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data/audit/live-gsc-performance.json', 'utf8'));

console.log('=== TOP PAGES BY CLICKS ===');
data.topPagesByClicks.slice(0, 10).forEach((p: any) => {
  console.log(`  ${p.clicks} clicks | ${p.impressions} impr | Pos: ${p.position.toFixed(1)} | ${p.keys[0]}`);
});

console.log('\n=== TOP PAGES BY IMPRESSIONS ===');
data.topPagesByImpressions.slice(0, 10).forEach((p: any) => {
  console.log(`  ${p.impressions} impr | ${p.clicks} clicks | Pos: ${p.position.toFixed(1)} | ${p.keys[0]}`);
});

console.log('\n=== TOP STRIKING DISTANCE QUERIES (Pos 4-20) ===');
data.strikingDistanceQueries.slice(0, 15).forEach((q: any) => {
  console.log(`  ${q.impressions} impr | ${q.clicks} clicks | CTR: ${(q.ctr * 100).toFixed(1)}% | Pos: ${q.position.toFixed(1)} | "${q.keys[0]}"`);
});

console.log('\n=== CANNIBALIZATION CANDIDATES (Queries hitting >1 page) ===');
const queryToPages: Record<string, string[]> = {};
data.rawPairs.forEach((pair: any) => {
  const query = pair.keys[0];
  const page = pair.keys[1];
  if (!queryToPages[query]) queryToPages[query] = [];
  if (!queryToPages[query].includes(page)) queryToPages[query].push(page);
});

const multiPageQueries = Object.entries(queryToPages).filter(([q, pages]) => pages.length > 1);
console.log(`Total queries served across multiple URLs: ${multiPageQueries.length}`);
multiPageQueries.slice(0, 10).forEach(([q, pages]) => {
  console.log(`  Query: "${q}"`);
  pages.forEach(p => console.log(`    - ${p}`));
});
