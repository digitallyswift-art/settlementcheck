import { NextRequest, NextResponse } from 'next/server';
import { auditSettlementAgreement } from '@/lib/ai/agents/settlement-auditor';

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

    const report = await auditSettlementAgreement(agreementText, context);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Settlement agreement review failed:', error);
    return NextResponse.json(
      { error: 'Failed to complete agreement review. Please try again or speak with a solicitor directly.' },
      { status: 500 },
    );
  }
}
