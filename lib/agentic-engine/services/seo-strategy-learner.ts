/**
 * SEO Strategy Learner & Bayesian Weight Optimiser
 * SettlementCheck Autonomous Agentic Engine
 *
 * Analyzes the longitudinal SEO outcomes ledger to compute statistical win rates,
 * rank improvement distributions, and click deltas per strategy type
 * (CONTENT_DEPTH_UPGRADE, STATUTORY_COMPARISON_TABLE, DIGITAL_PR_PITCH, etc.).
 * Returns a structured learning profile and actionable directives for the master orchestrator.
 */

import path from 'path';
import { SafeFs } from './safe-fs';
import {
  LearnedStrategyProfile,
  StrategyPerformanceStats,
  OutcomesLedgerEntry,
  SeoActionType,
} from '../types';
import { SeoOutcomesLedger } from './seo-outcomes-ledger';

export class SeoStrategyLearner {
  private static readonly WEIGHTS_PATH = path.resolve('data/serp-actions/learned-strategy-weights.json');
  private static inMemoryProfile: LearnedStrategyProfile | null = null;

  // Base fallback strategies recognized by the system
  public static readonly KNOWN_STRATEGIES: SeoActionType[] = [
    'CONTENT_DEPTH_UPGRADE',
    'STATUTORY_COMPARISON_TABLE',
    'DIGITAL_PR_PITCH',
    'INTERNAL_LINK_BOOST',
    'META_RECALIBRATION',
    'STATUTORY_CASE_STUDY',
    'IN_PROSE_INTERNAL_LINK',
    'CONTENT_GAP_BRIEF',
  ];

  /**
   * Retrieves current learned strategy profile, computing from outcomes ledger if not yet cached on disk.
   */
  public static async getLearnedProfile(): Promise<LearnedStrategyProfile> {
    if (this.inMemoryProfile) {
      return this.inMemoryProfile;
    }

    const raw = SafeFs.readFileSyncSafe(this.WEIGHTS_PATH, 'utf-8');
    if (raw) {
      try {
        const parsed: LearnedStrategyProfile = JSON.parse(raw);
        if (parsed && parsed.strategyWeights && Object.keys(parsed.strategyWeights).length > 0) {
          this.inMemoryProfile = parsed;
          return parsed;
        }
      } catch (err) {
        console.warn('[SeoStrategyLearner] Parsing error for learned weights:', err);
      }
    }

    // Compute fresh profile from ledger
    const ledger = await SeoOutcomesLedger.getLedger();
    const computed = this.computeStrategyWeights(ledger);
    this.saveLearnedProfileSafe(computed);
    return computed;
  }

  /**
   * Computes statistical win rates, rank improvement %, and learned weights from ledger entries.
   */
  public static computeStrategyWeights(ledger: OutcomesLedgerEntry[]): LearnedStrategyProfile {
    const strategyBuckets = new Map<string, OutcomesLedgerEntry[]>();

    // Initialise buckets for all known strategies
    for (const strat of this.KNOWN_STRATEGIES) {
      strategyBuckets.set(strat, []);
    }

    // Group ledger entries by strategy
    for (const entry of ledger) {
      const s = entry.strategy || 'CONTENT_DEPTH_UPGRADE';
      const list = strategyBuckets.get(s) || [];
      list.push(entry);
      strategyBuckets.set(s, list);
    }

    const strategyStatsRecord: Record<string, StrategyPerformanceStats> = {};
    const strategyWeightsRecord: Record<string, number> = {};

    let bestStrategy: SeoActionType | string = 'CONTENT_DEPTH_UPGRADE';
    let highestWinRate = -1;
    let worstStrategy: SeoActionType | string = 'IN_PROSE_INTERNAL_LINK';
    let lowestWinRate = 999;

    strategyBuckets.forEach((entries, stratKey) => {
      const sampleCount = entries.length;
      let wins = 0;
      let steady = 0;
      let neutrals = 0;
      let regressions = 0;
      let rollbacks = 0;
      let totalRankImprovement = 0;
      let totalClickDelta = 0;

      for (const e of entries) {
        totalRankImprovement += e.rankImprovementPct || 0;
        totalClickDelta += e.clickDelta || 0;

        switch (e.overallOutcome) {
          case 'CONFIRMED_UPLIFT':
            wins++;
            break;
          case 'STEADY_TRACKING':
            steady++;
            break;
          case 'REGRESSION_ALERT':
            regressions++;
            break;
          case 'ROLLED_BACK':
            rollbacks++;
            break;
          case 'NEUTRAL':
          default:
            neutrals++;
            break;
        }
      }

      const completed = wins + steady + neutrals + regressions + rollbacks;
      // Effective win rate rewards full uplifts at 100% and steady tracking at 50%
      const rawWinRate = completed > 0 ? ((wins + 0.5 * steady) / completed) * 100 : 50.0;
      const winRatePct = Number(rawWinRate.toFixed(1));

      const avgRankImprovementPct = sampleCount > 0 ? Number((totalRankImprovement / sampleCount).toFixed(2)) : 0;
      const avgClickDelta = sampleCount > 0 ? Number((totalClickDelta / sampleCount).toFixed(1)) : 0;

      // Statistical confidence level based on longitudinal sample volume
      let confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'EMERGING' = 'EMERGING';
      if (sampleCount >= 5) confidence = 'HIGH';
      else if (sampleCount >= 3) confidence = 'MEDIUM';
      else if (sampleCount >= 1) confidence = 'LOW';

      // Weight multiplier formula: Base 1.0, adjusted by win rate and average rank uplift
      // Scales between 0.40 (deprioritised) and 2.40 (strongly favoured)
      let calculatedWeight = 1.0;
      if (sampleCount > 0) {
        const winComponent = ((winRatePct - 50) / 50) * 0.7; // -0.7 to +0.7
        const rankComponent = Math.min(0.7, Math.max(-0.5, (avgRankImprovementPct / 100) * 0.8));
        calculatedWeight = Math.max(0.4, Math.min(2.4, Number((1.0 + winComponent + rankComponent).toFixed(2))));
      } else {
        // Emerging strategy default baseline weights
        if (stratKey === 'CONTENT_DEPTH_UPGRADE') calculatedWeight = 1.3;
        else if (stratKey === 'STATUTORY_COMPARISON_TABLE') calculatedWeight = 1.25;
        else if (stratKey === 'DIGITAL_PR_PITCH') calculatedWeight = 1.1;
        else if (stratKey === 'META_RECALIBRATION') calculatedWeight = 1.0;
        else calculatedWeight = 0.9;
      }

      // Generate actionable UK English recommendation
      let recommendation = '';
      if (sampleCount === 0) {
        recommendation = 'Emerging strategy with zero longitudinal samples. Maintain baseline canary observation.';
      } else if (winRatePct >= 80 && avgRankImprovementPct > 15) {
        recommendation = `High statistical win rate (${winRatePct}%) with +${avgRankImprovementPct}% average rank improvement. Prioritise as primary intervention for striking-distance commercial queries.`;
      } else if (winRatePct >= 60) {
        recommendation = `Consistent solid performer (${winRatePct}% win rate, +${avgRankImprovementPct}% rank improvement). Reliable secondary strategy.`;
      } else if (regressions > 0 || winRatePct < 40) {
        recommendation = `Underperforming or regression risk (${regressions} regression alerts, ${winRatePct}% win rate). Deprioritise in favour of deeper content upgrades.`;
      } else {
        recommendation = `Neutral tracking (${winRatePct}% win rate). Requires pairing with interactive tools or statutory comparison data to achieve breakout uplift.`;
      }

      strategyStatsRecord[stratKey] = {
        strategy: stratKey,
        sampleCount,
        wins,
        steady,
        neutrals,
        regressions,
        rollbacks,
        winRatePct,
        avgRankImprovementPct,
        avgClickDelta,
        weight: calculatedWeight,
        confidence,
        recommendation,
      };

      strategyWeightsRecord[stratKey] = calculatedWeight;

      if (sampleCount > 0 && winRatePct > highestWinRate) {
        highestWinRate = winRatePct;
        bestStrategy = stratKey;
      }
      if (sampleCount > 0 && winRatePct < lowestWinRate) {
        lowestWinRate = winRatePct;
        worstStrategy = stratKey;
      }
    });

    // Identify preferred and deprioritised strategies
    const sortedByWeight = Object.entries(strategyWeightsRecord).sort(([, a], [, b]) => b - a);
    const preferredStrategies = sortedByWeight.filter(([, w]) => w >= 1.15).map(([s]) => s);
    const deprioritizedStrategies = sortedByWeight.filter(([, w]) => w <= 0.85).map(([s]) => s);

    const guidance: string[] = [
      `Prioritise ${bestStrategy} (weight: ${strategyWeightsRecord[bestStrategy] || 1.3}x): Delivers highest confirmed rank uplift across live clusters.`,
      `Use STATUTORY_COMPARISON_TABLE for all tax and PILON queries (Section 403 ITEPA 2003 vs Section 402D PENP clarity).`,
      `Deprioritise isolated IN_PROSE_INTERNAL_LINK changes unless accompanied by interactive calculator cards or worked statutory examples.`,
    ];

    const profile: LearnedStrategyProfile = {
      generatedAt: new Date().toISOString(),
      totalOutcomesAnalysed: ledger.length,
      topPerformingStrategy: bestStrategy,
      lowestPerformingStrategy: worstStrategy,
      strategyWeights: strategyWeightsRecord,
      strategies: strategyStatsRecord,
      orchestratorDirectives: {
        preferredStrategies,
        deprioritizedStrategies,
        guidance,
      },
    };

    return profile;
  }

  /**
   * Retrieves weight multiplier for a specific strategy
   */
  public static async getStrategyWeight(strategy: SeoActionType | string): Promise<number> {
    const profile = await this.getLearnedProfile();
    return profile.strategyWeights[strategy] || 1.0;
  }

  /**
   * Recommends the optimal strategy type for an opportunity, factoring in learned statistical win rates.
   */
  public static async recommendOptimalStrategy(input: {
    query: string;
    position: number;
    targetUrl: string;
    lockTitleByPolicy?: boolean;
  }): Promise<SeoActionType> {
    const profile = await this.getLearnedProfile();
    const qLower = input.query.toLowerCase();
    const pos = input.position;
    const isLockedTitle = Boolean(input.lockTitleByPolicy);

    // Rule 1: Tax, PILON, or statutory exemption queries
    if (qLower.includes('tax') || qLower.includes('30000') || qLower.includes('30,000') || qLower.includes('pilon')) {
      const tableWeight = profile.strategyWeights['STATUTORY_COMPARISON_TABLE'] || 1.0;
      if (tableWeight >= 1.0) {
        return 'STATUTORY_COMPARISON_TABLE';
      }
    }

    // Rule 2: Page 1 queries (Pos <= 8.5)
    if (pos <= 8.5) {
      if (isLockedTitle) {
        // When title is locked to preserve canonical equity, prefer high-weight additive depth
        return (profile.strategyWeights['CONTENT_DEPTH_UPGRADE'] || 1.0) >= 1.0
          ? 'CONTENT_DEPTH_UPGRADE'
          : 'STATUTORY_CASE_STUDY';
      }
      return 'META_RECALIBRATION';
    }

    // Rule 3: Striking distance queries (Pos 8.6 - 20.0)
    // Compare weights of top candidate strategies
    const depthWeight = profile.strategyWeights['CONTENT_DEPTH_UPGRADE'] || 1.3;
    const prWeight = profile.strategyWeights['DIGITAL_PR_PITCH'] || 1.0;

    const isDisputeOrMoJQuery =
      qLower.includes('tribunal') ||
      qLower.includes('backlog') ||
      qLower.includes('delay') ||
      qLower.includes('average payout') ||
      qLower.includes('index');

    if (isDisputeOrMoJQuery && prWeight >= depthWeight * 0.9) {
      return 'DIGITAL_PR_PITCH';
    }

    // Default to top performing strategy (CONTENT_DEPTH_UPGRADE)
    return 'CONTENT_DEPTH_UPGRADE';
  }

  /**
   * Saves learned profile safely to disk
   */
  private static saveLearnedProfileSafe(profile: LearnedStrategyProfile): void {
    this.inMemoryProfile = profile;
    SafeFs.writeFileSyncSafe(this.WEIGHTS_PATH, JSON.stringify(profile, null, 2), 'utf-8');
  }
}
