/**
 * SettlementCheck Master Agentic Orchestrator Engine
 * Coordinates dedicated workers through the state machine to generate
 * instruction-ready Pre-Flight Dossiers for UK employment solicitors.
 */

import { EmployeeMatterContext, SolicitorPreFlightDossier } from '../types';
import { triageWorker } from '../workers/triage-worker';
import { captiveThreatWorker } from '../workers/captive-threat-worker';
import { clauseRiskWorker } from '../workers/clause-risk-worker';
import { benchmarkWorker } from '../workers/benchmark-worker';
import { crmDispatchWorker } from '../workers/crm-dispatch-worker';
import { enforceSraRegulatoryBoundary, sanitizeAdvicePhrasing } from '../guardrails/sra-boundary-guard';

export class AgenticOrchestrator {
  /**
   * Executes the full Phase 1 multi-worker pipeline
   */
  public static async executeCaseDossier(
    context: EmployeeMatterContext
  ): Promise<SolicitorPreFlightDossier> {
    const dossierId = context.matterId || `dossier_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Execute Workers 1-4 concurrently via Promise.all (eliminate sequential waterfall)
    const [statutoryReport, threatReport, clauseReport, benchmarkReport] = await Promise.all([
      triageWorker.execute(context, context),
      captiveThreatWorker.execute(context, context),
      clauseRiskWorker.execute(context, context),
      benchmarkWorker.execute(context, context),
    ]);

    // 5. CRM Dispatch & Dossier Compiler
    const rawDossier = await crmDispatchWorker.execute(
      {
        dossierId,
        statutory: statutoryReport,
        threat: threatReport,
        clauseRisk: clauseReport,
        benchmark: benchmarkReport,
      },
      context
    );

    // 6. Regulatory Guardrail Sanitization
    if (rawDossier.threatAssessment.counterNoticeDraft) {
      const sanitizedNotice = enforceSraRegulatoryBoundary(rawDossier.threatAssessment.counterNoticeDraft);
      rawDossier.threatAssessment.counterNoticeDraft = sanitizedNotice.sanitizedText;
    }

    if (rawDossier.marketNegotiationBrief.tacticalNegotiationPoints) {
      rawDossier.marketNegotiationBrief.tacticalNegotiationPoints = rawDossier.marketNegotiationBrief.tacticalNegotiationPoints.map(
        pt => sanitizeAdvicePhrasing(pt)
      );
    }

    return rawDossier;
  }
}
