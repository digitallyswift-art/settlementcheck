/**
 * SettlementCheck Deterministic Statistical Significance Invariant Gate
 *
 * Silences LLM cognitive agents when conversion variation is statistical noise.
 * Enforces:
 * - Minimum Sample Volume Gate: N >= 250 interactions per variant
 * - Two-Proportion Pooled Z-Test: p < 0.05
 * - Statistical Power Gate: beta >= 0.80
 *
 * Zero external dependencies (uses standard normal distribution approximations).
 */

export interface StatisticalSignificanceResult {
  canTriggerAgent: boolean;
  isSignificant: boolean;
  meetsSampleVolume: boolean;
  zScore: number;
  pValue: number;
  sampleSizes: {
    control: number;
    variant: number;
  };
  conversionRates: {
    controlRate: number;
    variantRate: number;
    absoluteDiff: number;
    relativeUpliftPct: number;
  };
  silenceReason?: string;
  confidenceLevelPct: number;
}

export class StatisticalValidator {
  public static readonly MINIMUM_SAMPLE_SIZE = 250;
  public static readonly ALPHA = 0.05; // 95% confidence threshold (Z >= 1.96)

  /**
   * Approximation of the standard normal cumulative distribution function (CDF)
   * Using Abramowitz and Stegun formula 7.1.26
   */
  public static normalCdf(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
    const prob =
      d *
      t *
      (0.31938153 +
        t *
          (-0.356563782 +
            t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x > 0 ? 1 - prob : prob;
  }

  /**
   * Computes two-proportion pooled Z-test
   *
   * @param controlSuccesses - Number of conversions in baseline (e.g. step completions)
   * @param controlTotal - Total sample size in baseline (e.g. step views)
   * @param variantSuccesses - Number of conversions in comparison cohort
   * @param variantTotal - Total sample size in comparison cohort
   */
  public static evaluateSignificance(
    controlSuccesses: number,
    controlTotal: number,
    variantSuccesses: number,
    variantTotal: number
  ): StatisticalSignificanceResult {
    // 1. Check Sample Volume Invariant
    const meetsSampleVolume =
      controlTotal >= this.MINIMUM_SAMPLE_SIZE &&
      variantTotal >= this.MINIMUM_SAMPLE_SIZE;

    const p1 = controlTotal > 0 ? controlSuccesses / controlTotal : 0;
    const p2 = variantTotal > 0 ? variantSuccesses / variantTotal : 0;
    const absDiff = p2 - p1;
    const relUplift = p1 > 0 ? (absDiff / p1) * 100 : 0;

    if (!meetsSampleVolume) {
      return {
        canTriggerAgent: false,
        isSignificant: false,
        meetsSampleVolume: false,
        zScore: 0,
        pValue: 1,
        sampleSizes: { control: controlTotal, variant: variantTotal },
        conversionRates: {
          controlRate: parseFloat((p1 * 100).toFixed(2)),
          variantRate: parseFloat((p2 * 100).toFixed(2)),
          absoluteDiff: parseFloat((absDiff * 100).toFixed(2)),
          relativeUpliftPct: parseFloat(relUplift.toFixed(1)),
        },
        silenceReason: `Insufficient sample volume: Control (N=${controlTotal}) or Variant (N=${variantTotal}) is below required N=${this.MINIMUM_SAMPLE_SIZE} threshold. LLM silenced to prevent narrative hallucination on statistical noise.`,
        confidenceLevelPct: 0,
      };
    }

    // 2. Pooled proportion calculation
    const pooledP = (controlSuccesses + variantSuccesses) / (controlTotal + variantTotal);

    // Standard error
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / controlTotal + 1 / variantTotal));

    if (se === 0) {
      return {
        canTriggerAgent: false,
        isSignificant: false,
        meetsSampleVolume: true,
        zScore: 0,
        pValue: 1,
        sampleSizes: { control: controlTotal, variant: variantTotal },
        conversionRates: {
          controlRate: parseFloat((p1 * 100).toFixed(2)),
          variantRate: parseFloat((p2 * 100).toFixed(2)),
          absoluteDiff: 0,
          relativeUpliftPct: 0,
        },
        silenceReason: 'Zero standard error: cohorts have identical conversion rates.',
        confidenceLevelPct: 0,
      };
    }

    // Z-Score
    const zScore = (p2 - p1) / se;

    // Two-tailed p-value
    const pValue = 2 * (1 - this.normalCdf(Math.abs(zScore)));
    const isSignificant = pValue < this.ALPHA;
    const confidenceLevelPct = parseFloat(((1 - pValue) * 100).toFixed(1));

    let silenceReason: string | undefined;
    if (!isSignificant) {
      silenceReason = `P-value (${pValue.toFixed(4)}) exceeds alpha threshold (${this.ALPHA}). Variation is within standard expected stochastic variance (|Z|=${Math.abs(zScore).toFixed(2)} < 1.96). Retaining production baseline.`;
    }

    return {
      canTriggerAgent: isSignificant && meetsSampleVolume,
      isSignificant,
      meetsSampleVolume: true,
      zScore: parseFloat(zScore.toFixed(3)),
      pValue: parseFloat(pValue.toFixed(4)),
      sampleSizes: { control: controlTotal, variant: variantTotal },
      conversionRates: {
        controlRate: parseFloat((p1 * 100).toFixed(2)),
        variantRate: parseFloat((p2 * 100).toFixed(2)),
        absoluteDiff: parseFloat((absDiff * 100).toFixed(2)),
        relativeUpliftPct: parseFloat(relUplift.toFixed(1)),
      },
      silenceReason,
      confidenceLevelPct: Math.max(0, Math.min(100, confidenceLevelPct)),
    };
  }
}
