import { NextRequest, NextResponse } from 'next/server'
import { recordExperimentEvent } from '@/lib/experiments/experiment-service'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'

export const dynamic = 'force-dynamic'

const VALID_VARIANTS = ['sequential', 'thematic'] as const
const VALID_EVENT_TYPES = ['enrolled', 'stage_viewed', 'completed', 'lead_submitted'] as const

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window rate limit (60 events / min / IP) ─────────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'experiment-event',
      limit: 60,
      windowMs: 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for telemetry events' },
        {
          status: 429,
          headers: getRateLimitHeaders(60, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body = await req.json()
    const { experiment_id = 'calc_ux_v2', variant, event_type, stage_number, time_elapsed_ms } = body

    if (!variant || !VALID_VARIANTS.includes(variant)) {
      return NextResponse.json({ error: 'Invalid or missing variant identifier' }, { status: 400 })
    }

    if (!event_type || !VALID_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid or missing event_type' }, { status: 400 })
    }

    const success = await recordExperimentEvent({
      experiment_id,
      variant,
      event_type,
      stage_number: typeof stage_number === 'number' ? stage_number : null,
      time_elapsed_ms: typeof time_elapsed_ms === 'number' ? time_elapsed_ms : null,
    })

    return NextResponse.json({ success })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process experiment telemetry event', details: err?.message }, { status: 500 })
  }
}
