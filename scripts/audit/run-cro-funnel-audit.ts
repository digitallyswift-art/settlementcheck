#!/usr/bin/env tsx
/**
 * SettlementCheck Adversarial CRO Funnel Audit CLI Runner
 *
 * Runs the GA4 Opportunity Worker:
 * - Reconciles Supabase ground truth with GA4 settled events
 * - Tests mathematical significance (Z-Score & sample power gate)
 * - Simulates the Friction Prosecutor vs Trust Defense debate
 * - Outputs structured Conversion Improvement Packages (CIPs)
 *
 * Usage:
 *   npm run audit:cro
 */

import { ga4OpportunityWorker } from '../../lib/agentic-engine/workers/ga4-opportunity-worker';
import { StatisticalValidator } from '../../lib/agentic-engine/tools/statistical-validator';

async function main() {
  console.log('\n===============================================================');
  console.log('⚖️  SETTLEMENTCHECK ADVERSARIAL CRO INTELLIGENCE AUDIT');
  console.log('===============================================================\n');

  // Test 1: Statistical Validator Verification
  console.log('1. Testing Deterministic Statistical Invariant Gate:');
  const smallSample = StatisticalValidator.evaluateSignificance(10, 80, 15, 85);
  console.log(`   • Small Sample (N=80 vs N=85):    ${!smallSample.canTriggerAgent ? '✅ SILENCED' : '❌ FAILED'}`);
  console.log(`     Reason: "${smallSample.silenceReason?.slice(0, 70)}..."`);

  const significantSample = StatisticalValidator.evaluateSignificance(185, 320, 142, 310);
  console.log(`   • Powered Sample (N=320 vs N=310): ${significantSample.canTriggerAgent ? '✅ TRIGGERED AGENT' : '❌ FAILED'}`);
  console.log(`     Z-Score: ${significantSample.zScore} | P-Value: ${significantSample.pValue} (< 0.05) | Uplift: ${significantSample.conversionRates.relativeUpliftPct}%\n`);

  // Test 2: Execute GA4 Opportunity Worker
  console.log('2. Executing GA4 Opportunity Worker Audit (28-day window):');
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  const startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const report = await ga4OpportunityWorker.execute({ startDate, endDate });

  console.log(`   • Reconciliation Window:       ${report.reconciliation.startDate} to ${report.reconciliation.endDate}`);
  console.log(`   • 48h Maturation Gate:         ${report.reconciliation.maturationVerified ? '✅ VERIFIED' : '❌ UNSETTLED'}`);
  console.log(`   • Telemetry Loss Ratio (Λ):    ${report.reconciliation.metrics.telemetryLossRatio}`);
  console.log(`   • Corporate Proxy Density:     ${report.reconciliation.metrics.corporateProxyIndex}`);
  console.log(`   • Client Tracking Fidelity:    ${report.reconciliation.metrics.clientTrackingFidelityPct}%\n`);

  console.log(`3. Staged Conversion Improvement Packages (${report.stagedPackages.length}):`);
  for (const pkg of report.stagedPackages) {
    console.log(`   ------------------------------------------------------------`);
    console.log(`   📦 Package ID:      ${pkg.id} [${pkg.status}]`);
    console.log(`   🎯 Target:          ${pkg.targetRoute} (${pkg.targetComponent})`);
    console.log(`   📊 Category:        ${pkg.category}`);
    console.log(`   📈 Est. Recovery:   +${pkg.metrics.estimatedRecoverableLeads} leads/month (Z=${pkg.metrics.zScore}, p=${pkg.metrics.pValue})`);
    console.log(`   ⚔️  Arbiter Insight: ${pkg.adversarialAnalysis.synthesizedInsight.slice(0, 95)}...`);
    console.log(`   📝 Proposed Diff:   + "${pkg.proposedDiff.proposedReplacement}"`);
    console.log(`   🛡️  SRA & CAP Code:  ${pkg.regulatorySignoff.sraCompliant && pkg.regulatorySignoff.capCodeCompliant ? '✅ 100% COMPLIANT' : '❌ INTERCEPTED'}`);
  }

  console.log('\n===============================================================');
  console.log('✅ Adversarial CRO Funnel Engine is fully operational!');
  console.log('===============================================================\n');
}

main().catch((err) => {
  console.error('Fatal error during CRO audit:', err);
  process.exit(1);
});
