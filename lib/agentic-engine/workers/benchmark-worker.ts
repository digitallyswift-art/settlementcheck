/**
 * Worker 4: Settlement Telemetry & Market Benchmark Worker
 * Cross-references case dimensions against empirical settlement outcomes.
 */

import { AgenticWorker, EmployeeMatterContext, MarketBenchmarkReport } from '../types';
import { querySettlementBenchmarksTool } from '../tools/telemetry-tools';

export const benchmarkWorker: AgenticWorker<EmployeeMatterContext, MarketBenchmarkReport> = {
  name: 'Settlement Telemetry & Market Benchmark Worker',
  description: 'Queries empirical multipliers and calculates tactical negotiation counter-offers.',
  permittedTools: [querySettlementBenchmarksTool],
  execute: async (context: EmployeeMatterContext): Promise<MarketBenchmarkReport> => {
    const result = await querySettlementBenchmarksTool.execute({
      salary: context.salary,
      yearsOfService: context.yearsOfService,
      employerOffer: context.employerOffer,
      disputeReason: context.disputeReason,
      isDiscrimination: context.isDiscrimination,
    }) as unknown as MarketBenchmarkReport;

    return result;
  },
};
