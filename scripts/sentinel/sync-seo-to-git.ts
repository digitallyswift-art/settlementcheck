#!/usr/bin/env node
/**
 * SettlementCheck Autonomous SEO -> Git Repository Synchronizer
 * Pulls active Cockpit-approved SEO optimizations (`CANARY`, `APPLIED`, `PERMANENT`)
 * from Supabase (`seo_autonomous_actions`) and writes a deterministic snapshot to
 * `data/serp-actions/applied-actions.json` for Git version control.
 *
 * Usage:
 *   npm run seo:sync-git
 *   npm run seo:sync-git -- --permanent-only
 */

import fs from 'fs';
import path from 'path';

// Load .env.local before importing Supabase / SeoActuatorService
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  const regex = /^\s*([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^#\r\n]+))/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const val =
      match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4].trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  const onlyPermanent = process.argv.includes('--permanent-only');
  const { SeoActuatorService } = await import(
    '../../lib/agentic-engine/services/seo-actuator-service'
  );

  console.log('======================================================');
  console.log('🔄 SettlementCheck SEO Cloud-to-Git Snapshot Sync');
  console.log('======================================================');
  console.log(
    `• Filter Mode:    ${
      onlyPermanent ? 'PERMANENT winners only' : 'All active (CANARY, APPLIED, PERMANENT)'
    }`
  );
  console.log(
    `• Cloud Source:   ${
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? 'Supabase (seo_autonomous_actions)'
        : 'Local snapshot fallback (Supabase env not set)'
    }`
  );

  const result = await SeoActuatorService.syncCloudActionsToRepoSnapshot({
    onlyPermanent,
  });

  console.log(`• Synced Records: ${result.syncedCount}`);
  console.log(`• Output File:    ${path.relative(process.cwd(), result.outputPath)}\n`);

  for (const rec of result.records) {
    const scopeLabel = rec.actuationScope || 'FULL_META_AND_FAQ';
    console.log(
      `  [${rec.status}] ${rec.targetCanonicalUrl} (${scopeLabel}) -> "${rec.query}"`
    );
  }

  console.log('\n✅ Git snapshot synchronized. Commit `data/serp-actions/applied-actions.json` when ready.\n');
}

main().catch(err => {
  console.error('SEO Git sync failed:', err);
  process.exit(1);
});
