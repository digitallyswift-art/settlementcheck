import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSandboxDossierFixture } from '@/lib/portal-sandbox';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dossierId, claimToken, solicitorEmail, firmId } = body;

    if (!dossierId || typeof dossierId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing required dossierId' },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const headerToken = req.headers.get('x-claim-token')?.trim() || '';
    const token = bearerToken || headerToken || (typeof claimToken === 'string' ? claimToken.trim() : '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: A valid claim token is required.' },
        { status: 401 }
      );
    }

    // 0. Isolated Sandbox Mode: short-circuit before any database read or write
    const sandboxFixture = getSandboxDossierFixture(dossierId, token);
    if (sandboxFixture) {
      return NextResponse.json({
        success: true,
        isDemo: true,
        dossierId,
        status: 'claimed',
        claimedAt: new Date().toISOString(),
        message: 'Sandbox preview: instruction claimed locally (no live matter modified).',
      });
    }

    // 1. Verify claim from database (fail closed on DB errors)
    const { data: existingClaim, error: lookupError } = await supabase
      .from('lead_claims')
      .select('*')
      .eq('dossier_id', dossierId)
      .eq('claim_token', token)
      .limit(1)
      .maybeSingle();

    if (lookupError) {
      console.error('Database lead_claims query failed:', lookupError);
      return NextResponse.json(
        { success: false, error: 'Failed to verify matter claim.' },
        { status: 500 }
      );
    }

    // Reject unauthorized requests where no matching claim exists
    if (!existingClaim) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Invalid or expired claim token. This matter cannot be claimed.',
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();

    // Reject non-locked claims (already claimed, expired, released, etc.)
    if (existingClaim.status !== 'locked') {
      if (existingClaim.status === 'expired') {
        return NextResponse.json(
          {
            success: false,
            error: 'EXPIRED',
            message: 'The 15-minute exclusive territorial reservation for this matter has expired.',
          },
          { status: 410 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: 'CONFLICT',
          message: `This matter is already ${existingClaim.status} and cannot be claimed.`,
        },
        { status: 409 }
      );
    }

    // Check if reservation has expired
    const expiresAtMs = existingClaim.expires_at ? new Date(existingClaim.expires_at).getTime() : NaN;
    if (!Number.isFinite(expiresAtMs) || expiresAtMs <= now.getTime()) {
      const { error: expireError } = await supabase
        .from('lead_claims')
        .update({ status: 'expired' })
        .eq('id', existingClaim.id)
        .eq('status', 'locked');

      if (expireError) {
        console.error('Failed to mark expired claim:', expireError);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'EXPIRED',
          message: 'The 15-minute exclusive territorial reservation for this matter has expired.',
        },
        { status: 410 }
      );
    }

    // 2. Atomically mark as claimed only if still locked and unexpired
    const sanitizedNotes =
      typeof solicitorEmail === 'string' && solicitorEmail.trim()
        ? `Claimed by ${solicitorEmail.trim().slice(0, 200)}`
        : undefined;

    const { data: updatedRows, error: updateError } = await supabase
      .from('lead_claims')
      .update({
        status: 'claimed',
        claimed_at: nowIso,
        notes: sanitizedNotes,
      })
      .eq('id', existingClaim.id)
      .eq('status', 'locked')
      .gt('expires_at', nowIso)
      .select('id, status, claimed_at');

    if (updateError) {
      console.error('Claim update DB error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to process matter claim.' },
        { status: 500 }
      );
    }

    if (!updatedRows || updatedRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'EXPIRED_OR_CLAIMED',
          message: 'This matter reservation has expired or was already claimed.',
        },
        { status: 409 }
      );
    }

    if (existingClaim.panel_firm_id) {
      // Increment firm claimed count safely (RPC if present, otherwise read-and-update fallback)
      const { error: rpcError } = await supabase.rpc('increment_panel_claimed_count', {
        firm_id: existingClaim.panel_firm_id,
      });
      if (rpcError) {
        const { data: panelRow, error: panelFetchError } = await supabase
          .from('solicitor_panel')
          .select('leads_claimed_count')
          .eq('id', existingClaim.panel_firm_id)
          .maybeSingle();
        if (!panelFetchError && panelRow) {
          const { error: panelUpdateError } = await supabase
            .from('solicitor_panel')
            .update({ leads_claimed_count: (panelRow.leads_claimed_count ?? 0) + 1 })
            .eq('id', existingClaim.panel_firm_id);
          if (panelUpdateError) {
            console.warn('Panel claimed count fallback update failed:', panelUpdateError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      dossierId,
      status: 'claimed',
      claimedAt: nowIso,
      message: 'Instruction successfully claimed and locked to your firm.',
    });
  } catch (error: any) {
    console.error('Portal claim endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process matter claim' },
      { status: 500 }
    );
  }
}
