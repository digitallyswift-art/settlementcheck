import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AgenticOrchestrator } from '@/lib/agentic-engine';
import { getSandboxDossierFixture, SANDBOX_DEMO_TOKEN } from '@/lib/portal-sandbox';

const ALLOWED_CLAIM_STATUSES = new Set(['locked', 'claimed', 'dispatched_pms', 'contacted']);

function extractClaimToken(req: NextRequest): string {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }
  const headerToken = req.headers.get('x-claim-token')?.trim();
  if (headerToken) return headerToken;
  return '';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dossierId = params.id;
    const token = extractClaimToken(req);

    // SC-B-002 / SC-E-SEC-004: Enforce mandatory header-based claimToken validation to eliminate BOLA & URL token leakage
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: A valid claim token header is required to view case dossiers under SRA client confidentiality rules.',
        },
        { status: 401 }
      );
    }

    // 0. Isolated Sandbox Mode: strictly allowlisted synthetic IDs only, zero DB access
    const sandboxFixture = getSandboxDossierFixture(dossierId, token);
    if (sandboxFixture) {
      const dossier = await AgenticOrchestrator.executeCaseDossier(sandboxFixture.matterContext);
      return NextResponse.json({
        success: true,
        isDemo: true,
        dossierId,
        dossier,
        conflictCheck: {
          employerName: sandboxFixture.employerName || null,
          employerNameSource: sandboxFixture.employerNameSource || null,
          signingDeadlineLabel: sandboxFixture.signingDeadlineLabel,
          hasDraftAgreement: sandboxFixture.hasDraftAgreement,
          clientGoal: sandboxFixture.clientGoal,
        },
        claimStatus: {
          isLocked: sandboxFixture.status === 'locked',
          isClaimed: sandboxFixture.status === 'claimed',
          expiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
          token: SANDBOX_DEMO_TOKEN,
          panelFirm: dossier.territorialRouting?.matchedFirmName || 'SRA Designated Partner (Sandbox)',
        },
      });
    }

    // 1. Live Production Mode: require a matching active claim record in Supabase
    const { data: claimRecord, error: claimError } = await supabase
      .from('lead_claims')
      .select('*, solicitor_panel(*)')
      .eq('dossier_id', dossierId)
      .eq('claim_token', token)
      .limit(1)
      .maybeSingle();

    if (claimError) {
      console.error('Failed to query lead_claims for dossier:', claimError);
      return NextResponse.json(
        { success: false, error: 'Failed to verify matter claim.' },
        { status: 500 }
      );
    }

    // Reject unauthorized requests where no matching claim exists
    if (!claimRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Invalid or expired claim token. This matter may have been claimed by another firm or the 15-minute reservation has expired.',
        },
        { status: 403 }
      );
    }

    // Enforce active claim lifecycle status
    if (!ALLOWED_CLAIM_STATUSES.has(claimRecord.status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: This matter reservation is no longer active.',
        },
        { status: 403 }
      );
    }

    // Enforce 15-minute SLA expiry when status is still locked
    if (claimRecord.status === 'locked') {
      const expiresAtMs = claimRecord.expires_at ? new Date(claimRecord.expires_at).getTime() : NaN;
      if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
        return NextResponse.json(
          {
            success: false,
            error: 'EXPIRED: The 15-minute exclusive reservation for this matter has expired.',
          },
          { status: 410 }
        );
      }
    }

    // 2. Fail closed if linked lead record is missing or lookup fails
    if (!claimRecord.lead_id) {
      return NextResponse.json(
        { success: false, error: 'Matter lead record not found.' },
        { status: 404 }
      );
    }

    const { data: leadRecord, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', claimRecord.lead_id)
      .maybeSingle();

    if (leadError) {
      console.error('Failed to load lead for dossier:', leadError);
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve matter lead record.' },
        { status: 500 }
      );
    }

    if (!leadRecord) {
      return NextResponse.json(
        { success: false, error: 'Matter lead record not found.' },
        { status: 404 }
      );
    }

    // 3. Generate high-fidelity dossier using Agentic Engine from verified lead fields only
    const salary = Number(leadRecord.salary || 0);
    const years = leadRecord.months_service ? Math.floor(Number(leadRecord.months_service) / 12) : 0;
    const offer = Number(leadRecord.offer_amount || 0);
    const postcode = leadRecord.postcode || undefined;
    const disputeReason = (leadRecord.dispute_category as any) || 'redundancy';

    const dossier = await AgenticOrchestrator.executeCaseDossier({
      matterId: dossierId,
      firstName: leadRecord.first_name || undefined,
      lastName: leadRecord.last_name || undefined,
      email: leadRecord.email || undefined,
      phone: leadRecord.phone || undefined,
      postcode,
      salary,
      yearsOfService: years,
      age: leadRecord.age ? Number(leadRecord.age) : 40,
      employerOffer: offer,
      disputeReason,
      isDiscrimination: Boolean(leadRecord.is_discrimination || leadRecord.dispute_category === 'discrimination'),
      employerOfferedLegalFee: leadRecord.employer_legal_fee ? Number(leadRecord.employer_legal_fee) : undefined,
      rawAgreementText: leadRecord.raw_agreement_text || leadRecord.benchmark_data?.raw_agreement_text || undefined,
    });

    const isLocked = claimRecord.status === 'locked';
    const isClaimed = ['claimed', 'dispatched_pms', 'contacted'].includes(claimRecord.status);
    const expiresAt = claimRecord.expires_at;

    const leadConflict = leadRecord.benchmark_data?.conflict_check;
    return NextResponse.json({
      success: true,
      isDemo: false,
      dossierId,
      dossier,
      conflictCheck: {
        employerName: leadConflict?.employer_name || null,
        employerNameSource: leadConflict?.employer_name ? 'employee_provided' : null,
        signingDeadlineLabel: leadConflict?.signing_deadline || leadRecord.benchmark_data?.signing_urgency || null,
        hasDraftAgreement: Boolean(leadConflict?.has_draft_agreement),
        clientGoal: null,
      },
      claimStatus: {
        isLocked,
        isClaimed,
        expiresAt,
        panelFirm: claimRecord.solicitor_panel?.firm_name || dossier.territorialRouting?.matchedFirmName,
      },
    });
  } catch (error: any) {
    console.error('Failed to load dossier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve dossier' },
      { status: 500 }
    );
  }
}
