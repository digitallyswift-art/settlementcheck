import fs from 'fs';
import path from 'path';

const SCRATCH_DIR = path.resolve('scratch');
const HISTORY_DIR = path.resolve('data', 'gsc-history');

function runArchive() {
  if (!fs.existsSync(SCRATCH_DIR)) {
    console.log('No scratch directory found.');
    return;
  }

  const files = fs.readdirSync(SCRATCH_DIR).filter(f => f.endsWith('.csv'));
  if (files.length === 0) {
    console.log('No CSV files found in scratch/ to archive.');
    return;
  }

  // Determine date range from Chart.csv if present
  let archiveName = '';
  const chartPath = path.join(SCRATCH_DIR, 'Chart.csv');
  if (fs.existsSync(chartPath)) {
    const lines = fs.readFileSync(chartPath, 'utf-8').trim().split('\n').filter(Boolean);
    if (lines.length > 2) {
      const firstRow = lines[1].split(',')[0].trim();
      const lastRow = lines[lines.length - 1].split(',')[0].trim();
      if (firstRow && lastRow) {
        archiveName = `${firstRow}_to_${lastRow}`;
      }
    }
  }

  if (!archiveName) {
    const now = new Date().toISOString().split('T')[0];
    archiveName = `snapshot_${now}`;
  }

  const targetDir = path.join(HISTORY_DIR, archiveName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let copied = [];
  for (const f of files) {
    const src = path.join(SCRATCH_DIR, f);
    const dest = path.join(targetDir, f);
    fs.copyFileSync(src, dest);
    copied.push(f);
  }

  // Generate quick summary
  let summary = {
    archiveDate: new Date().toISOString(),
    period: archiveName,
    files: copied,
  };

  const queriesPath = path.join(SCRATCH_DIR, 'Queries.csv');
  if (fs.existsSync(queriesPath)) {
    const qLines = fs.readFileSync(queriesPath, 'utf-8').trim().split('\n').filter(Boolean);
    const topQueries = [];
    for (let i = 1; i < Math.min(qLines.length, 6); i++) {
      const parts = qLines[i].split(',');
      if (parts.length >= 5) {
        topQueries.push({
          query: parts[0],
          clicks: parts[1],
          impressions: parts[2],
          ctr: parts[3],
          position: parts[4],
        });
      }
    }
    summary.topQueries = topQueries;
  }

  fs.writeFileSync(path.join(targetDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`📦 GSC Data Successfully Archived!`);
  console.log(`======================================================`);
  console.log(`• Destination:  data/gsc-history/${archiveName}/`);
  console.log(`• Files saved:  ${copied.join(', ')}`);
  console.log(`• Status:       Ready for future progress comparison.\n`);
}

runArchive();
