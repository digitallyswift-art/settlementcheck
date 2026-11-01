import { NextRequest, NextResponse } from 'next/server'
import { getExperimentConfig } from '@/lib/experiments/experiment-service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const experimentId = searchParams.get('id') || 'calc_ux_v2'

    const config = await getExperimentConfig(experimentId)

    return NextResponse.json(
      { success: true, config },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        config: {
          experiment_id: 'calc_ux_v2',
          mode: 'split_50_50',
          winner: null,
          updated_at: new Date().toISOString(),
        },
        error: err?.message,
      },
      { status: 500 }
    )
  }
}
