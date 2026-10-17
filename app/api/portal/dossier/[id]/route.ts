import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AgenticOrchestrator } from '@/lib/agentic-engine';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dossierId = params.id;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    // 1. Check claim record in database if available
    let claimRecord: any = null;
    try {
      let query = supabase.from('lead_claims').select('*, solicitor_panel(*)').eq('dossier_id', dossierId);
      if (token) {
        query = query.eq('claim_token', token);
      }
      const { data } = await query.limit(1).maybeSingle();
      claimRecord = data;
    } catch (e) {
      // Non-fatal
    }

    // 2. Check if linked to an existing lead in the database
    let leadRecord: any = null;
    if (claimRecord?.lead_id) {
      try {
        const { data } = await supabase.from('leads').select('*').eq('id', claimRecord.lead_id).maybeSingle();
        leadRecord = data;
      } catch (e) {
        // Non-fatal
      }
    }

    // 3. Generate high-fidelity dossier using Agentic Engine
    const salary = leadRecord?.salary ? Number(leadRecord.salary) : 58000;
    const years = leadRecord?.months_service ? Math.floor(leadRecord.months_service / 12) : 5;
    const offer = leadRecord?.offer_amount ? Number(leadRecord.offer_amount) : 6500;
    const postcode = leadRecord?.postcode || 'SW1A 1AA';
    const disputeReason = (leadRecord?.dispute_category as any) || 'redundancy';

    const dossier = await AgenticOrchestrator.executeCaseDossier({
      matterId: dossierId,
      firstName: leadRecord?.first_name || 'Sarah',
      lastName: leadRecord?.last_name || 'Jenkins',
      email: leadRecord?.email || 's.jenkins@example.co.uk',
      phone: leadRecord?.phone || '07700 900342',
      postcode,
      salary,
      yearsOfService: years,
      age: 44,
      employerOffer: offer,
      disputeReason,
      isDiscrimination: false,
      employerOfferedLegalFee: 500,
      rawAgreementText: `SETTLEMENT AGREEMENT (WITHOUT PREJUDICE & SUBJECT TO CONTRACT)
BETWEEN:
(1) Apex Technology UK Limited ("the Employer")
(2) Sarah Jenkins ("the Employee")

1. The Employment will terminate on the Termination Date by reason of redundancy.
2. The Company will pay the Employee a total ex-gratia compensation payment of £${offer.toLocaleString('en-GB')}.
3. The Company will contribute up to £500 plus VAT towards the legal fees incurred by the Employee in obtaining independent advice ONLY IF the Employee instructs our preferred panel solicitor Firm XYZ. If the Employee uses an independent solicitor, the contribution will be capped at £200 plus VAT.
4. The Employee waives all statutory and contractual claims against the Company, including claims relating to accrued pension entitlements and personal injury.`,
    });

    const isLocked = claimRecord ? claimRecord.status === 'locked' : true;
    const isClaimed = claimRecord ? claimRecord.status === 'claimed' : false;
    const expiresAt = claimRecord?.expires_at || new Date(Date.now() + 12 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      dossierId,
      dossier,
      claimStatus: {
        isLocked,
        isClaimed,
        expiresAt,
        token: token || claimRecord?.claim_token,
        panelFirm: claimRecord?.solicitor_panel?.firm_name || dossier.territorialRouting?.matchedFirmName,
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
