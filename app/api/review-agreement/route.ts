import { NextRequest, NextResponse } from 'next/server';
import { auditSettlementAgreement } from '@/lib/ai/agents/settlement-auditor';
import { AgenticOrchestrator } from '@/lib/agentic-engine';
import { sanitizePiiAndSpecialCategoryData } from '@/lib/ai/sanitizer';
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter';

const MAX_AGREEMENT_CHARS = 25000;
const REVIEW_TIMEOUT_MS = 15000; // 15-second execution ceiling

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window IP Rate Limiter (10 reviews / hr / IP) ────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'review-agreement',
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for agreement reviews. Maximum 10 reviews per hour allowed per IP.' },
        {
          status: 429,
          headers: getRateLimitHeaders(10, rateCheck.remaining, rateCheck.resetMs),
        },
      );
    }

    const body = await req.json();

    // ── 2. Honeypot Bot Trap ────────────────────────────────────────────────
    if (body.website_hp || body.hp_field || body.company_url_hp) {
      return NextResponse.json(
        { success: true, message: 'Review completed' },
        { status: 200 },
      );
    }

    const { agreementText, context, consent } = body;

    // ── 3. Character Count and Minimum Validation ───────────────────────────
    if (!agreementText || typeof agreementText !== 'string' || agreementText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide the text or key clauses of your settlement agreement (minimum 20 characters).' },
        { status: 400 },
      );
    }

    // 25,000 character maximum cap to protect AI Gateway wallet and LLM spend balances
    if (agreementText.length > MAX_AGREEMENT_CHARS) {
      return NextResponse.json(
        {
          error: `Agreement text exceeds maximum length of ${MAX_AGREEMENT_CHARS.toLocaleString('en-GB')} characters. Please submit key terms or extract clauses.`,
        },
        { status: 400 },
      );
    }

    if (consent !== true) {
      return NextResponse.json(
        { error: 'Explicit affirmative consent is required under UK GDPR Article 9 to process settlement agreement text.' },
        { status: 400 },
      );
    }

    // SC-B-003 / SC-E-PRIV-002: Pre-gateway PII and Special Category Data redaction
    const sanitization = sanitizePiiAndSpecialCategoryData(agreementText);
    const sanitizedAgreementText = sanitization.sanitizedText;

    // ── 4. Execute AI Audit with 15-Second Execution Timeout ────────────────
    const report = await withTimeout(
      auditSettlementAgreement(sanitizedAgreementText, context),
      REVIEW_TIMEOUT_MS,
      'Agreement review timed out after 15 seconds. Please try again or speak with a solicitor directly.',
    );

    // ── 5. Generate Instruction-Ready Pre-Flight Case Dossier ───────────────
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

    const isTimeout = error?.message?.includes('timed out');
    const statusCode = isTimeout ? 504 : 500;
    const errorMessage = isTimeout
      ? 'Agreement review timed out after 15 seconds. Please try again or speak with a solicitor directly.'
      : 'Failed to complete agreement review. Please try again or speak with a solicitor directly.';

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode },
    );
  }
}
