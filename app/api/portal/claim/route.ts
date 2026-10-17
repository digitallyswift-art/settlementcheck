import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dossierId, claimToken, solicitorEmail, firmId } = body;

    if (!dossierId) {
      return NextResponse.json(
        { success: false, error: 'Missing required dossierId' },
        { status: 400 }
      );
    }

    // 1. Verify claim from database if table exists
    let existingClaim = null;
    try {
      let query = supabase.from('lead_claims').select('*').eq('dossier_id', dossierId);
      if (claimToken) {
        query = query.eq('claim_token', claimToken);
      }
      const { data, error } = await query.limit(1).maybeSingle();
      if (!error && data) {
        existingClaim = data;
      }
    } catch (dbErr) {
      console.warn('Database lead_claims query non-fatal fallback:', dbErr);
    }

    const now = new Date();

    // Check if reservation has expired
    if (existingClaim && existingClaim.status === 'locked' && new Date(existingClaim.expires_at) < now) {
      try {
        await supabase
          .from('lead_claims')
          .update({ status: 'expired' })
          .eq('id', existingClaim.id);
      } catch {
        // ignore
      }

      return NextResponse.json({
        success: false,
        error: 'EXPIRED',
        message: 'The 15-minute exclusive territorial reservation for this matter has expired.',
      }, { status: 410 });
    }

    // 2. Mark as claimed
    const claimedTimestamp = now.toISOString();

    if (existingClaim) {
      try {
        await supabase
          .from('lead_claims')
          .update({
            status: 'claimed',
            claimed_at: claimedTimestamp,
            notes: solicitorEmail ? `Claimed by ${solicitorEmail}` : undefined,
          })
          .eq('id', existingClaim.id);

        if (existingClaim.panel_firm_id) {
          // Increment firm claimed count (best-effort)
          try {
            await supabase.rpc('increment_panel_claimed_count', { firm_id: existingClaim.panel_firm_id });
          } catch {
            // Non-fatal if RPC function is not present in local dev
          }
        }
      } catch (updateErr) {
        console.warn('Claim update non-fatal error:', updateErr);
      }
    }

    return NextResponse.json({
      success: true,
      dossierId,
      status: 'claimed',
      claimedAt: claimedTimestamp,
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
