/**
 * Sync Outcomes Ledger & Compute Learned Strategy Weights
 */

import { SeoOutcomesLedger } from '../../lib/agentic-engine/services/seo-outcomes-ledger';
import { SeoStrategyLearner } from '../../lib/agentic-engine/services/seo-strategy-learner';

async function main() {
  console.log('--- Initialising Outcomes Ledger ---');
  const ledger = await SeoOutcomesLedger.getLedger();
  console.log(`Loaded ${ledger.length} longitudinal outcome records.`);

  const summary = await SeoOutcomesLedger.getLedgerSummary();
  console.log('Ledger Summary:', summary);

  console.log('\n--- Computing Learned Strategy Weights ---');
  const profile = await SeoStrategyLearner.getLearnedProfile();
  console.log('Top Performing Strategy:', profile.topPerformingStrategy);
  console.log('Strategy Weights:', profile.strategyWeights);
  console.log('Preferred Strategies:', profile.orchestratorDirectives.preferredStrategies);
  console.log('Directives:', profile.orchestratorDirectives.guidance);
  console.log('\n✓ Synchronization complete.');
}

main().catch(err => {
  console.error('Error during ledger synchronization:', err);
  process.exit(1);
});
