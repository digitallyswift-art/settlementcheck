#!/usr/bin/env node
/**
 * SettlementCheck Autonomous SEO Degradation Watchdog CLI
 * 1. Executes Macro Anomaly Sentinel across live GSC timeseries (detects site-wide surges & drops,
 *    conducts 4-vector root cause diagnosis across Git, queries, and Google updates, and sends urgent alert email).
 * 2. Scans applied and canary SEO packages for rank/impression regressions (>15% alert, >25% auto-rollback)
 *    and promotes 14-day stable canaries to PERMANENT status.
 *
 * Usage:
 *   npm run watchdog:seo
 */

import { seoDegradationWatchdogWorker } from '../../lib/agentic-engine/workers/seo-degradation-watchdog-worker';
import { SeoAnomalySentinel } from '../../lib/agentic-engine/services/seo-anomaly-sentinel';

async function main() {
  console.log('======================================================');
  console.log('🛡️  SettlementCheck Autonomous SEO Degradation Watchdog');
  console.log('======================================================\n');

  // STEP 1: Macro Domain Velocity Anomaly Scan
  console.log('--- Step 1: Macro Domain Anomaly Sentinel Scan ---');
  try {
    const anomalyReport = await SeoAnomalySentinel.executeDailySentinel();
    console.log(`• Status:            ${anomalyReport.severity}`);
    console.log(`• Summary:           ${anomalyReport.summary}`);
    console.log(`• Primary Diagnosis: ${anomalyReport.primaryDiagnosis}`);
    console.log(`• Email Alert Sent:  ${anomalyReport.alertEmailSent ? 'YES [✓]' : 'NO'}`);
    if (anomalyReport.incidentDossierPath) {
      console.log(`• Incident Dossier:  ${anomalyReport.incidentDossierPath}`);
    }
    if (anomalyReport.codebaseVector.probableCulpritCommit) {
      console.log(`• Culprit Commit:    ${anomalyReport.codebaseVector.probableCulpritCommit.hash} ("${anomalyReport.codebaseVector.probableCulpritCommit.message}")`);
    }
  } catch (err: any) {
    console.warn('Macro Anomaly Sentinel error (continuing to package scan):', err.message);
  }

  // STEP 2: Individual Package Audit & Auto-Rollback
  console.log('\n--- Step 2: Individual Package Audits ---');
  const report = await seoDegradationWatchdogWorker.execute({
    autoRollbackEnabled: true,
  });

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
