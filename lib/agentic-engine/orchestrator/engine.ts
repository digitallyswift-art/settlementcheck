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

    // 1. Triage & Statutory Floor Worker (ERA 1996 s.162)
    const statutoryReport = await triageWorker.execute(context, context);

    // 2. Captive Threat Worker (SRA Independence & Fee Parity)
    const threatReport = await captiveThreatWorker.execute(context, context);

    // 3. Clause Risk & S.203 Forensic Worker
    const clauseReport = await clauseRiskWorker.execute(context, context);

    // 4. Benchmark & Telemetry Worker
    const benchmarkReport = await benchmarkWorker.execute(context, context);

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
