/**
 * Worker 5: CRM Integration & Pre-Flight Dossier Builder
 * Compiles all worker intelligence into an instruction-ready Clio/LEAP package.
 */

import { AgenticWorker, EmployeeMatterContext, SolicitorPreFlightDossier } from '../types';
import { syncPmsIntakeTool } from '../tools/pms-sync-tools';
import { matchAndLockTerritoryTool } from '../tools/territorial-tools';
import { SRA_COMPLIANCE_DISCLAIMER } from '../guardrails/sra-boundary-guard';

export interface CrmDispatchInput {
  dossierId: string;
  statutory: any;
  threat: any;
  clauseRisk: any;
  benchmark: any;
}

export const crmDispatchWorker: AgenticWorker<CrmDispatchInput, SolicitorPreFlightDossier> = {
  name: 'CRM Integration & Pre-Flight Dossier Builder',
  description: 'Assembles full pre-flight legal dossier and formats Clio/LEAP intake payload.',
  permittedTools: [syncPmsIntakeTool, matchAndLockTerritoryTool],
  execute: async (input: CrmDispatchInput, context: EmployeeMatterContext): Promise<SolicitorPreFlightDossier> => {
    const fullName = `${context.firstName || ''} ${context.lastName || ''}`.trim() || 'Client';
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || 'Matter';

    // 1. Resolve territorial routing & 15-minute SLA exclusivity lock
    let territorialRouting: any = undefined;
    if (context.postcode) {
      territorialRouting = await matchAndLockTerritoryTool.execute({
        postcode: context.postcode,
        partnerId: context.partnerId,
        dossierId: input.dossierId,
      });
    }

    // 2. Calibrate Strategic Verdict
    const isDeficit = input.statutory.isOfferBelowStatutoryMinimum;
    const strategicVerdict = isDeficit
      ? 'CRITICAL_STATUTORY_DEFICIT'
      : context.employerOffer < input.benchmark.typicalSettlementRange.low
      ? 'BELOW_MARKET_BENCHMARK'
      : context.employerOffer <= input.benchmark.typicalSettlementRange.high
      ? 'FAIR_MARKET_RANGE'
      : 'ABOVE_MARKET_STANDARD';

    // 3. Build CRM Schema with calibrated verdict
    const crmResult: any = syncPmsIntakeTool.execute({
      firstName,
      lastName,
      email: context.email || '',
      phone: context.phone || '',
      postcode: context.postcode || '',
      salary: context.salary,
      monthsService: Math.floor(context.yearsOfService * 12),
      employerOffer: context.employerOffer,
      statutoryMinimum: input.statutory.statutoryMinimumTotal,
      verdict: strategicVerdict,
      disputeReason: context.disputeReason,
      partnerId: territorialRouting?.matchedFirmId || context.partnerId,
      preFlightDossierId: input.dossierId,
    });

    const dossier: SolicitorPreFlightDossier = {
      dossierId: input.dossierId,
      compiledAt: new Date().toISOString(),
      matterSummary: {
        clientName: fullName,
        clientContact: {
          email: context.email || 'Unprovided',
          phone: context.phone || 'Unprovided',
          postcode: context.postcode || 'Unprovided',
        },
        keyFigures: {
          salary: context.salary,
          tenureYears: context.yearsOfService,
          age: context.age,
          employerOffer: context.employerOffer,
          statutoryMinimum: input.statutory.statutoryMinimumTotal,
          targetSettlement: input.benchmark.recommendedCounterOffer.targetTotalPayout,
          employerLegalFeeOffered: context.employerOfferedLegalFee ?? 500,
          recommendedLegalFeeDemand: input.benchmark.recommendedCounterOffer.recommendedLegalFeeContribution,
        },
        strategicVerdict,
      },
      statutoryAnalysis: input.statutory,
      threatAssessment: input.threat,
      contractAudit: input.clauseRisk,
      marketNegotiationBrief: input.benchmark,
      territorialRouting,
      crmPayload: {
        leadSource: 'SettlementCheck AI Engine',
        matterTitle: crmResult.matterTitle,
        clioMatterPayload: crmResult.clioMatterPayload,
      },
      sraComplianceStatement: SRA_COMPLIANCE_DISCLAIMER,
    };

    return dossier;
  },
};
