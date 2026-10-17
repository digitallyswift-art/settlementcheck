/**
 * Worker 2: Captive Threat Sentinel Worker
 * Evaluates employer agreements for nominated solicitor steering and auto-generates parity letters.
 */

import { AgenticWorker, EmployeeMatterContext, CaptiveThreatReport } from '../types';
import { detectAndCounterCaptiveSteeringTool } from '../tools/threat-counter-tools';

export const captiveThreatWorker: AgenticWorker<EmployeeMatterContext, CaptiveThreatReport> = {
  name: 'Captive Threat Sentinel Worker',
  description: 'Detects employer captive solicitor steering and creates SRA independence demand notices.',
  permittedTools: [detectAndCounterCaptiveSteeringTool],
  execute: async (context: EmployeeMatterContext): Promise<CaptiveThreatReport> => {
    const agreementText = context.rawAgreementText || '';
    const fullName = `${context.firstName || ''} ${context.lastName || ''}`.trim() || 'Employee';

    const result = detectAndCounterCaptiveSteeringTool.execute({
      agreementText,
      employerOfferedFee: context.employerOfferedLegalFee,
      independentOfferedFee: context.independentOfferedLegalFee,
      nominatedFirm: context.employerNominatedFirm,
      employeeName: fullName,
      employerName: 'the Employer',
    }) as unknown as CaptiveThreatReport;

    return result;
  },
};
