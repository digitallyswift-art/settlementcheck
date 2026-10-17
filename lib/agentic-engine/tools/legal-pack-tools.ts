/**
 * Tool 3: Section 203 ERA 1996 Adviser Pack & Contract Risk Auditor
 * Generates the statutory compliance schedule and SRA advice certificate draft.
 */

import { AIToolDefinition } from '@/lib/ai/types';
import { ContractClauseAuditReport } from '../types';

export const generateS203AdviserPackTool: AIToolDefinition = {
  name: 'generate_s203_adviser_pack',
  description: 'Audits agreement clauses against Section 203(3) Employment Rights Act 1996 invariants and generates the SRA Adviser Certificate schedule.',
  parameters: {
    type: 'object',
    properties: {
      agreementText: { type: 'string', description: 'Raw settlement agreement text' },
      employeeName: { type: 'string', description: 'Full name of employee' },
      employerName: { type: 'string', description: 'Employer company name' },
      employerFeeContribution: { type: 'number', description: 'Legal fee contribution in GBP offered by employer' },
    },
    required: ['agreementText'],
  },
  execute: (args) => {
    const text = String(args.agreementText || '');
    const lower = text.toLowerCase();
    const employeeName = args.employeeName ? String(args.employeeName) : 'the Employee';
    const employerName = args.employerName ? String(args.employerName) : 'the Employer';
    const fee = Number(args.employerFeeContribution ?? 500);

    const redFlags: ContractClauseAuditReport['redFlags'] = [];

    // 1. Accrued Pension Waiver Check
    if (lower.includes('pension') && (lower.includes('all claims') || lower.includes('waives any') || lower.includes('accrued rights'))) {
      redFlags.push({
        category: 'pension_waiver',
        severity: 'high',
        issueDescription: 'Agreement appears to waive accrued statutory or contractual pension rights.',
        recommendedAmendment: 'Insert explicit carve-out: "Nothing in this Agreement shall affect the Employee’s accrued rights under any occupational or statutory pension scheme."',
      });
    }

    // 2. Personal Injury Carve-Out Check
    if (lower.includes('personal injury') && !lower.includes('save for') && !lower.includes('except')) {
      redFlags.push({
        category: 'pi_carveout',
        severity: 'high',
        issueDescription: 'Agreement contains broad personal injury waiver without latent condition carve-out.',
        recommendedAmendment: 'Insert standard SRA carve-out: "Save for any personal injury claim of which the Employee is not aware and could not reasonably be expected to be aware at the date of this Agreement."',
      });
    }

    // 3. Whistleblowing / Public Interest Disclosure (ERA 1996 s.43J)
    if (lower.includes('confidential') && !lower.includes('public interest disclosure') && !lower.includes('protected disclosure')) {
      redFlags.push({
        category: 'confidentiality',
        severity: 'medium',
        issueDescription: 'Confidentiality clause lacks statutory whistleblower protection (ERA 1996 s.43J).',
        recommendedAmendment: 'Insert statutory saving clause: "Nothing in this Agreement shall prevent the Employee from making a protected disclosure under Part IVA of the Employment Rights Act 1996 or reporting matters to a regulatory body."',
      });
    }

    // 4. Restrictive Covenants Non-Compete
    if (lower.includes('compete') || lower.includes('solicit') || lower.includes('restrictive covenant')) {
      redFlags.push({
        category: 'restrictive_covenant',
        severity: 'medium',
        issueDescription: 'Agreement reaffirms or introduces post-termination restrictive covenants without fresh consideration.',
        recommendedAmendment: 'Ensure post-termination restrictions are either waived, reduced to 3-6 months maximum, or expressly compensated with separate taxable consideration (£100-£500).',
      });
    }

    // 5. Legal Fee Benchmark Check
    if (fee < 500) {
      redFlags.push({
        category: 'tax_gross_up',
        severity: 'high',
        issueDescription: `Employer legal fee contribution (£${fee}) is below UK market standard (£500–£1,000 + VAT).`,
        recommendedAmendment: `Request employer increase legal fee contribution to minimum £500 + VAT (or £750 + VAT for senior/complex exits) to cover full independent advice.`,
      });
    }

    const report: ContractClauseAuditReport = {
      clausesAuditedCount: Math.max(1, Math.floor(text.split(/\n\s*\n/).length)),
      s203ChecklistStatus: {
        inWriting: true,
        relatesToParticularProceedings: lower.includes('particular proceedings') || lower.includes('claims') || lower.includes('employment tribunal'),
        relevantIndependentAdviserIdentified: lower.includes('adviser') || lower.includes('solicitor'),
        adviserInsuranceInForce: lower.includes('insurance') || lower.includes('indemnity'),
        adviserConditionsStated: lower.includes('section 203') || lower.includes('conditions regulating'),
      },
      redFlags,
      draftS203CertificateReady: true,
    };

    return report as unknown as Record<string, unknown>;
  },
};
