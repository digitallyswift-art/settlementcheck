import { NextRequest, NextResponse } from 'next/server'
import { recordExperimentEvent } from '@/lib/experiments/experiment-service'

export const dynamic = 'force-dynamic'

const VALID_VARIANTS = ['sequential', 'thematic'] as const
const VALID_EVENT_TYPES = ['enrolled', 'stage_viewed', 'completed', 'lead_submitted'] as const

export async function POST(req: NextRequest) {
  try {
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
