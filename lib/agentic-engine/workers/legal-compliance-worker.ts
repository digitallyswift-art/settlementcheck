/**
 * Legal & Compliance Auditor Worker
 * Specialist worker verifying that all staged copy strictly complies with
 * UK employment law, Section 203 ERA 1996, SRA regulatory boundaries, and ACAS codes.
 */

import { AgenticWorker, ConversionCopyPackage, SeoTechnicalBrief, StatutoryAuditVerdict } from '../types';
import { LegalComplianceAuditorAgent } from '../agents/legal-compliance-auditor-agent';
import { verifyStatutoryInvariantsTool } from '../tools/statutory-tools';

export interface LegalComplianceAuditInput {
  copy: ConversionCopyPackage;
  brief: SeoTechnicalBrief;
}

export const legalComplianceWorker: AgenticWorker<LegalComplianceAuditInput, StatutoryAuditVerdict> = {
  name: 'Legal & Compliance Auditor Worker',
  description: 'Audits generated copy against UK employment law, Section 203 ERA 1996, SRA regulatory boundaries, and ACAS codes.',
  permittedTools: [verifyStatutoryInvariantsTool],
  execute: async (input: LegalComplianceAuditInput): Promise<StatutoryAuditVerdict> => {
    return LegalComplianceAuditorAgent.auditCopy(input.copy, input.brief);
  },
};
