import { NextRequest, NextResponse } from 'next/server';
import { auditSettlementAgreement } from '@/lib/ai/agents/settlement-auditor';
import { AgenticOrchestrator } from '@/lib/agentic-engine';
import { sanitizePiiAndSpecialCategoryData } from '@/lib/ai/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agreementText, context } = body;

    if (!agreementText || typeof agreementText !== 'string' || agreementText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide the text or key clauses of your settlement agreement (minimum 20 characters).' },
        { status: 400 },
      );
    }

    // SC-B-003 / SC-E-PRIV-002: Pre-gateway PII and Special Category Data redaction
    const sanitization = sanitizePiiAndSpecialCategoryData(agreementText);
    const sanitizedAgreementText = sanitization.sanitizedText;

    const report = await auditSettlementAgreement(sanitizedAgreementText, context);

    // Generate instruction-ready solicitor pre-flight dossier via Agentic Engine
    let dossier = null;
    try {
      dossier = await AgenticOrchestrator.executeCaseDossier({
        salary: report.extractedTerms.salary ?? context?.salary ?? 45000,
        yearsOfService: report.extractedTerms.yearsOfService ?? context?.yearsOfService ?? 3,
        age: report.extractedTerms.age ?? context?.age ?? 38,
        employerOffer: report.extractedTerms.exGratiaAmount ?? context?.offer ?? 5000,
        rawAgreementText: sanitizedAgreementText,
        disputeReason: (report.extractedTerms.disputeReason as any) || 'redundancy',
        isDiscrimination: report.extractedTerms.isDiscrimination,
        jurisdiction: report.extractedTerms.jurisdiction,
        employerOfferedLegalFee: report.extractedTerms.legalFeeContribution,
      });
    } catch (dossierErr) {
      console.warn('Agentic dossier generation non-fatal error:', dossierErr);
    }

    return NextResponse.json({
      success: true,
      report,
      dossier,
    });
  } catch (error: any) {
    console.error('Settlement agreement review failed:', error);
    return NextResponse.json(
      { error: 'Failed to complete agreement review. Please try again or speak with a solicitor directly.' },
      { status: 500 },
    );
  }
}
