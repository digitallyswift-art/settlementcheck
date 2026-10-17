/**
 * Worker 1: Triage & Statutory Floor Worker
 * Validates continuous employment tenure and deterministically verifies the statutory floor.
 */

import { AgenticWorker, EmployeeMatterContext, StatutoryFloorReport } from '../types';
import { verifyStatutoryInvariantsTool } from '../tools/statutory-tools';

export const triageWorker: AgenticWorker<EmployeeMatterContext, StatutoryFloorReport> = {
  name: 'Triage & Statutory Floor Worker',
  description: 'Calculates non-negotiable statutory redundancy and notice floor under ERA 1996.',
  permittedTools: [verifyStatutoryInvariantsTool],
  execute: async (context: EmployeeMatterContext): Promise<StatutoryFloorReport> => {
    const result = verifyStatutoryInvariantsTool.execute({
      salary: context.salary,
      yearsOfService: context.yearsOfService,
      age: context.age,
      employerOffer: context.employerOffer,
      noticeWeeks: context.noticeWeeks,
      disputeReason: context.disputeReason,
      isDiscrimination: context.isDiscrimination,
      jurisdiction: context.jurisdiction,
    }) as unknown as StatutoryFloorReport;

    return result;
  },
};
