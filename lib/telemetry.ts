/**
 * SettlementCheck Client Telemetry Helper
 * Privacy-first: strictly zero PII collected.
 */

export interface SettlementBenchmark {
  dispute_category: string;
  sample_size: number;
  avg_settlement_multiplier: number;
  avg_legal_fee_contribution: number;
  avg_duration_weeks: number;
}

export async function fetchSettlementBenchmarks(): Promise<SettlementBenchmark[]> {
  try {
    const res = await fetch('/api/telemetry/settlement-outcome', {
      method: 'GET',
      next: { revalidate: 3600 }, // cached for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.benchmarks || [];
  } catch {
    return [];
  }
}

/**
 * Client-Side Telemetry & Event Tracking
 * Integrates seamlessly with GA4 (gtag) and Google Tag Manager (dataLayer).
 */
export function trackClientEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params);
  }
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...params });
  }
}

/**
 * Tracks when a user clicks an outbound trust citation (e.g. gov.uk, legislation.gov.uk, judiciary.uk).
 * Used to measure whether official badges and statutory citations increase user engagement.
 */
export function trackOutboundCitation(
  destinationUrl: string,
  citationLabel: string,
  context?: Record<string, unknown>,
): void {
  trackClientEvent('outbound_citation_click', {
    destination_url: destinationUrl,
    citation_label: citationLabel,
    event_category: 'trust_citation',
    timestamp: new Date().toISOString(),
    ...context,
  });
}

/**
 * Tracks when a user clicks the primary CTA to enter the solicitor matching funnel (/get-matched/).
 */
export function trackSolicitorMatchClick(
  source: string,
  context?: Record<string, unknown>,
): void {
  trackClientEvent('primary_match_cta_click', {
    cta_target: '/get-matched/',
    source_component: source,
    event_category: 'conversion_funnel',
    timestamp: new Date().toISOString(),
    ...context,
  });
}

