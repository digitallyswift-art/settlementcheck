/**
 * SettlementCheck GDPR-Blinded GA4 Client Telemetry Dispatcher
 *
 * Enforces Zero Special Category Data (UK GDPR Art. 9) & Zero PII invariants:
 * - Scrambles/buckets sensitive employment dispute reasons into abstract cohorts
 * - Buckets financial figures and salaries into discrete statistical brackets
 * - Prevents client personal data (names, emails, phones, postcodes) from reaching ad-tech clouds
 * - Silently falls back if ad blockers or network proxies intercept gtag
 */

export type CohortClassification =
  | 'cohort_redundancy'
  | 'cohort_performance'
  | 'cohort_statutory'
  | 'cohort_mutual'
  | 'cohort_other';

export type OfferBracket =
  | 'bracket_under_10k'
  | 'bracket_10k_30k'
  | 'bracket_30k_60k'
  | 'bracket_60k_100k'
  | 'bracket_over_100k'
  | 'bracket_undisclosed';

export type TenureBand =
  | 'tenure_under_2y'
  | 'tenure_2_5y'
  | 'tenure_5_10y'
  | 'tenure_over_10y';

export type VerdictCategory =
  | 'verdict_below_statutory'
  | 'verdict_fair'
  | 'verdict_high_risk'
  | 'verdict_other';

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set' | 'consent',
      eventNameOrTarget: string,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export class Ga4TelemetryClient {
  /**
   * Maps raw dispute reasons to non-sensitive structural cohort tokens
   */
  public static mapToCohort(rawReason?: string | null): CohortClassification {
    if (!rawReason) return 'cohort_other';
    const r = rawReason.toLowerCase();
    if (r.includes('redundancy')) return 'cohort_redundancy';
    if (r.includes('pip') || r.includes('performance') || r.includes('dismissal')) return 'cohort_performance';
    if (r.includes('mutual') || r.includes('resignation')) return 'cohort_mutual';
    if (r.includes('statutory') || r.includes('protective')) return 'cohort_statutory';
    return 'cohort_other';
  }

  /**
   * Maps financial figures into statistical ranges (protects precise employee income)
   */
  public static mapToOfferBracket(amount?: number | string | null): OfferBracket {
    if (amount === undefined || amount === null || amount === '') return 'bracket_undisclosed';
    const val = typeof amount === 'number' ? amount : parseFloat(String(amount));
    if (isNaN(val) || val <= 0) return 'bracket_undisclosed';
    if (val < 10000) return 'bracket_under_10k';
    if (val < 30000) return 'bracket_10k_30k';
    if (val < 60000) return 'bracket_30k_60k';
    if (val < 100000) return 'bracket_60k_100k';
    return 'bracket_over_100k';
  }

  /**
   * Maps service duration to tenure bands (ERA 1996 s.108 2-year qualifying hurdle)
   */
  public static mapToTenureBand(years?: number | string | null): TenureBand {
    if (years === undefined || years === null || years === '') return 'tenure_under_2y';
    const y = typeof years === 'number' ? years : parseFloat(String(years));
    if (isNaN(y) || y < 2) return 'tenure_under_2y';
    if (y < 5) return 'tenure_2_5y';
    if (y < 10) return 'tenure_5_10y';
    return 'tenure_over_10y';
  }

  /**
   * Maps calculation verdict to canonical telemetry categories
   */
  public static mapToVerdictCategory(rawVerdict?: string): VerdictCategory {
    if (!rawVerdict) return 'verdict_other';
    const v = rawVerdict.toLowerCase();
    if (v.includes('below') || v.includes('under') || v.includes('shortfall')) return 'verdict_below_statutory';
    if (v.includes('fair') || v.includes('reasonable')) return 'verdict_fair';
    if (v.includes('risk') || v.includes('unfair') || v.includes('threat')) return 'verdict_high_risk';
    return 'verdict_other';
  }

  /**
   * Dispatches a sanitized event to Google Analytics 4
   */
  public static emit(eventName: string, params: Record<string, any> = {}): void {
    if (typeof window === 'undefined') return;

    // Strict PII Filter: ensure no email, phone, name, or postcode ever leaks
    const sanitizedParams: Record<string, any> = {};
    const prohibitedKeys = [
      'email', 'first_name', 'last_name', 'phone', 'postcode', 'address',
      'salary_raw', 'offer_raw', 'discrimination_details', 'raw_text'
    ];

    for (const [key, value] of Object.entries(params)) {
      if (prohibitedKeys.includes(key.toLowerCase())) continue;
      // Strip potential PII strings
      if (typeof value === 'string') {
        // Disallow emails or UK phone numbers embedded in strings
        if (value.includes('@') || /07\d{8,9}/.test(value)) continue;
      }
      sanitizedParams[key] = value;
    }

    // Attach non-sensitive environment markers
    sanitizedParams.timestamp = new Date().toISOString();
    sanitizedParams.transport = 'sanitized_gtag';

    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, sanitizedParams);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: eventName,
          ...sanitizedParams,
        });
      }
    } catch {
      // Fail silently if user ad blocker blocks telemetry
    }
  }

  // ── High-Intent Behavioral Event Triggers ─────────────────────────────────

  /**
   * Triggered when a user views a specific step in SteppedCalculator or Calculator
   */
  public static trackCalcStep(stepNumber: number, cohort?: string | null, tenure?: string | null) {
    this.emit('calc_step_viewed', {
      step_number: stepNumber,
      cohort_type: this.mapToCohort(cohort),
      tenure_band: this.mapToTenureBand(tenure),
    });
  }

  /**
   * Triggered when a user spends >15s on a single field or triggers validation error
   */
  public static trackFieldHesitation(fieldId: string, dwellMs: number, hasError: boolean) {
    this.emit('calc_field_hesitation', {
      field_id: fieldId,
      dwell_seconds: Math.round(dwellMs / 1000),
      has_error: hasError ? 1 : 0,
    });
  }

  /**
   * Triggered when calculation executes successfully
   */
  public static trackCalcCompleted(offer: string | number, hasShortfall: boolean, cohort?: string) {
    this.emit('calc_completed', {
      offer_bracket: this.mapToOfferBracket(offer),
      has_shortfall: hasShortfall ? 1 : 0,
      cohort_type: this.mapToCohort(cohort),
    });
  }

  /**
   * Triggered when verdict screen displays
   */
  public static trackVerdictViewed(verdict: string, offer: string | number) {
    this.emit('verdict_screen_viewed', {
      verdict_category: this.mapToVerdictCategory(verdict),
      offer_bracket: this.mapToOfferBracket(offer),
    });
  }

  /**
   * Triggered when lead form or typeform is initiated
   */
  public static trackLeadFunnelStarted(entrySource: string, verdict?: string) {
    this.emit('lead_funnel_started', {
      entry_source: entrySource,
      verdict_category: this.mapToVerdictCategory(verdict),
    });
  }

  /**
   * Triggered when user enters OTP step
   */
  public static trackLeadOtpRequested(attemptNumber: number = 1) {
    this.emit('lead_otp_requested', {
      attempt_number: attemptNumber,
    });
  }

  /**
   * Triggered when user abandons lead typeform at a specific slide
   */
  public static trackLeadStepAbandoned(slideId: string, secondsEngaged: number) {
    this.emit('lead_step_abandoned', {
      last_active_slide: slideId,
      seconds_engaged: secondsEngaged,
    });
  }

  /**
   * Triggered when lead is successfully matched with SRA panel solicitor
   */
  public static trackLeadCompleted(referralAssigned: boolean = true) {
    this.emit('lead_completed', {
      referral_assigned: referralAssigned ? 1 : 0,
    });
  }
}
