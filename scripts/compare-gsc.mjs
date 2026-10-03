import fs from 'fs';
import path from 'path';

const OLD_DIR = path.resolve('data/gsc-history/2026-05-03_to_2026-05-18');
const NEW_DIR = path.resolve('data/gsc-history/2026-06-30_to_2026-09-29');

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(l => {
    const vals = l.split(',');
    let obj = {};
    headers.forEach((h, i) => obj[h] = vals[i]?.trim());
    return obj;
  });
}

const oldQueries = parseCsv(path.join(OLD_DIR, 'Queries.csv'));
const newQueries = parseCsv(path.join(NEW_DIR, 'Queries.csv'));

const oldPages = parseCsv(path.join(OLD_DIR, 'Pages.csv'));
const newPages = parseCsv(path.join(NEW_DIR, 'Pages.csv'));

const oldChart = parseCsv(path.join(OLD_DIR, 'Chart.csv'));
const newChart = parseCsv(path.join(NEW_DIR, 'Chart.csv'));

// Aggregates
let oldTotalClicks = oldChart.reduce((acc, row) => acc + (parseInt(row.Clicks) || 0), 0);
let oldTotalImpr = oldChart.reduce((acc, row) => acc + (parseInt(row.Impressions) || 0), 0);

let newTotalClicks = newChart.reduce((acc, row) => acc + (parseInt(row.Clicks) || 0), 0);
let newTotalImpr = newChart.reduce((acc, row) => acc + (parseInt(row.Impressions) || 0), 0);

console.log('=== OVERALL SUMMARY ===');
console.log(`Baseline (May 2026 - 2 weeks): ${oldTotalClicks} Clicks, ${oldTotalImpr} Impressions`);
console.log(`New Period (Jul-Sep 2026 - 3 months): ${newTotalClicks} Clicks, ${newTotalImpr} Impressions`);
console.log(`Total Queries tracked: ${newQueries.length} (up from ${oldQueries.length})`);
console.log(`Total Pages tracked: ${newPages.length} (up from ${oldPages.length})`);

// Top Pages
console.log('\n=== TOP PAGES (NEW PERIOD) ===');
newPages.slice(0, 8).forEach(p => {
  console.log(`- ${p['Top pages']}: ${p.Clicks} clicks, ${p.Impressions} impr, ${p.CTR} CTR, pos ${p.Position}`);
});

// Compare query positions
const oldMap = new Map();
oldQueries.forEach(q => oldMap.set(q['Top queries'], parseFloat(q.Position)));

let climbers = [];
let dropped = [];
let newTerms = [];

newQueries.forEach(q => {
  const query = q['Top queries'];
  const newPos = parseFloat(q.Position);
  const impr = parseInt(q.Impressions) || 0;
  const clicks = parseInt(q.Clicks) || 0;

  if (oldMap.has(query)) {
    const oldPos = oldMap.get(query);
    const diff = oldPos - newPos; // positive means moved up (e.g. 70 -> 50 = +20)
    if (diff > 0) {
      climbers.push({ query, oldPos, newPos, diff, impr, clicks });
    } else if (diff < 0) {
      dropped.push({ query, oldPos, newPos, diff, impr, clicks });
    }
  } else {
    newTerms.push({ query, newPos, impr, clicks });
  }
});

climbers.sort((a, b) => b.diff - a.diff);
dropped.sort((a, b) => a.diff - b.diff);
newTerms.sort((a, b) => b.impr - a.impr);

console.log('\n=== TOP CLIMBERS (RANK IMPROVEMENT) ===');
climbers.slice(0, 10).forEach(c => {
  console.log(`↑ "${c.query}": ${c.oldPos.toFixed(1)} -> ${c.newPos.toFixed(1)} (+${c.diff.toFixed(1)} spots) | ${c.impr} impr, ${c.clicks} clicks`);
});

console.log('\n=== TOP DROPPED ===');
dropped.slice(0, 5).forEach(d => {
  console.log(`↓ "${d.query}": ${d.oldPos.toFixed(1)} -> ${d.newPos.toFixed(1)} (${d.diff.toFixed(1)} spots) | ${d.impr} impr`);
});

console.log('\n=== TOP NEW DISCOVERED QUERIES (BY IMPRESSIONS) ===');
newTerms.slice(0, 15).forEach(t => {
  console.log(`✨ "${t.query}": ${t.impr} impr, pos ${t.newPos.toFixed(1)}, ${t.clicks} clicks`);
});
