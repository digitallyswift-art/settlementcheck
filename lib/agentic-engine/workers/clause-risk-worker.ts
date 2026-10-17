/**
 * Worker 3: Clause Risk & S.203 Forensic Worker
 * Audits contract clauses against Section 203(3) ERA 1996 and common legal pitfalls.
 */

import { AgenticWorker, EmployeeMatterContext, ContractClauseAuditReport } from '../types';
import { generateS203AdviserPackTool } from '../tools/legal-pack-tools';

export const clauseRiskWorker: AgenticWorker<EmployeeMatterContext, ContractClauseAuditReport> = {
  name: 'Clause Risk & S.203 Forensic Worker',
  description: 'Audits agreement clauses against statutory conditions and prepares draft Section 203 schedule.',
  permittedTools: [generateS203AdviserPackTool],
  execute: async (context: EmployeeMatterContext): Promise<ContractClauseAuditReport> => {
    const agreementText = context.rawAgreementText || 'No draft text provided. Audit based on standard UK statutory clauses.';
    const fullName = `${context.firstName || ''} ${context.lastName || ''}`.trim() || 'Employee';

    const result = generateS203AdviserPackTool.execute({
      agreementText,
      employeeName: fullName,
      employerName: 'the Employer',
      employerFeeContribution: context.employerOfferedLegalFee ?? 500,
    }) as unknown as ContractClauseAuditReport;

    return result;
  },
};
