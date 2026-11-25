import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter';

const ALLOWED_DEADLINES = new Set([
  'within_48h',
  'this_week',
  'ten_plus_days',
  'no_deadline',
]);

async function handleEnrich(req: NextRequest) {
  try {
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'lead-enrich',
      limit: 15,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(15, rateCheck.remaining, rateCheck.resetMs),
        }
      );
    }

    const body = await req.json();
    const leadId = typeof body.leadId === 'string' ? body.leadId.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const employerName =
      typeof body.employerName === 'string' ? body.employerName.trim().slice(0, 140) : '';
    const signingDeadline =
      typeof body.signingDeadline === 'string' && ALLOWED_DEADLINES.has(body.signingDeadline)
        ? body.signingDeadline
        : undefined;
    const hasDraftAgreement =
      typeof body.hasDraftAgreement === 'boolean' ? body.hasDraftAgreement : undefined;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required to match your enquiry.' },
        { status: 400 }
      );
    }

    if (!employerName && !signingDeadline && hasDraftAgreement === undefined) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least one optional detail to save.' },
        { status: 400 }
      );
    }

    const conflictPayload = {
      ...(employerName ? { employer_name: employerName } : {}),
      ...(signingDeadline ? { signing_deadline: signingDeadline } : {}),
      ...(hasDraftAgreement !== undefined ? { has_draft_agreement: hasDraftAgreement } : {}),
      purpose: 'sra_code_6_2_conflict_check',
      provided_at: new Date().toISOString(),
    };

    // Offline / dev fallback IDs succeed gracefully without DB mutation
    if (!leadId || leadId.startsWith('lead_offline_')) {
      return NextResponse.json({
        success: true,
        enriched: true,
        conflictCheck: conflictPayload,
      });
    }

    // Require BOTH leadId AND matching email to prevent BOLA/ID enumeration
    const { data: existing, error: fetchErr } = await supabase
      .from('leads')
      .select('id, email, benchmark_data')
      .eq('id', leadId)
      .eq('email', email)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json(
        { success: false, error: 'Matching enquiry not found.' },
        { status: 404 }
      );
    }

    const currentBenchmark =
      existing.benchmark_data && typeof existing.benchmark_data === 'object'
        ? existing.benchmark_data
        : {};

    const updatedBenchmark = {
      ...currentBenchmark,
      conflict_check: {
        ...(currentBenchmark.conflict_check && typeof currentBenchmark.conflict_check === 'object'
          ? currentBenchmark.conflict_check
          : {}),
        ...conflictPayload,
      },
      ...(signingDeadline ? { signing_urgency: signingDeadline } : {}),
    };

    const { error: updateErr } = await supabase
      .from('leads')
      .update({ benchmark_data: updatedBenchmark })
      .eq('id', leadId)
      .eq('email', email);

    if (updateErr) {
      console.warn('Lead enrich update warning:', updateErr);
    }

    return NextResponse.json({
      success: true,
      enriched: true,
      conflictCheck: conflictPayload,
    });
  } catch (err) {
    console.error('Lead enrich error:', err);
    return NextResponse.json(
      { success: false, error: 'Could not save optional details right now.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return handleEnrich(req);
}

export async function PATCH(req: NextRequest) {
  return handleEnrich(req);
}
