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
