#!/usr/bin/env node
/**
 * SettlementCheck Autonomous SEO Degradation Watchdog CLI
 * Scans applied and canary SEO packages for rank/impression regressions (>15% alert, >25% auto-rollback)
 * and promotes 14-day stable canaries to PERMANENT status.
 *
 * Usage:
 *   npm run watchdog:seo
 */

import { seoDegradationWatchdogWorker } from '../../lib/agentic-engine/workers/seo-degradation-watchdog-worker';

async function main() {
  console.log('======================================================');
  console.log('🛡️  SettlementCheck Autonomous SEO Degradation Watchdog');
  console.log('======================================================');

  const report = await seoDegradationWatchdogWorker.execute({
    autoRollbackEnabled: true,
  });

  console.log(`\n• Run ID:                    ${report.runId}`);
  console.log(`• Timestamp:                 ${report.timestamp}`);
  console.log(`• Active Packages Evaluated: ${report.activePackagesEvaluated}`);
  console.log(`• Healthy Packages:          ${report.healthyCount}`);
  console.log(`• Graduated to PERMANENT:    ${report.graduatedToPermanentCount}`);
  console.log(`• Regression Alerts (>15%):  ${report.alertsTriggered}`);
  console.log(`• Auto-Rollbacks (>25%):     ${report.autoRollbacksTriggered}`);

  for (const audit of report.audits) {
    console.log(
      `  [${audit.actionTaken}] "${audit.query}" (${audit.targetCanonicalUrl}) | Baseline Pos: ${audit.baselinePosition.toFixed(1)} -> Current: ${audit.currentPosition.toFixed(1)} (${audit.positionDropPercent >= 0 ? '+' : ''}${audit.positionDropPercent}% shift)`
    );
    if (audit.alertMessage) {
      console.log(`    ${audit.alertMessage}`);
    }
  }

  console.log('\n✅ SEO Degradation Watchdog scan complete.\n');
}

main().catch(err => {
  console.error('SEO Watchdog error:', err);
  process.exit(1);
});
