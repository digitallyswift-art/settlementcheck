import { NextRequest, NextResponse } from 'next/server'
import { promoteExperimentWinner, getExperimentStats } from '@/lib/experiments/experiment-service'

export const dynamic = 'force-dynamic'

const EXPECTED_TOKEN = process.env.EXPERIMENT_ADMIN_TOKEN || 'secure_sc_experiment_admin_token_2026'

/**
 * GET Handler: Renders the confirmation preview gate.
 * Protects against accidental clicks and automated email link prefetchers/crawlers.
 * Does NOT mutate database state.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const experimentId = searchParams.get('id') || 'calc_ux_v2'
  const winner = searchParams.get('winner')
  const token = searchParams.get('token')

  if (!token || token !== EXPECTED_TOKEN) {
    return new NextResponse('Unauthorized access token', { status: 401 })
  }

  if (winner !== 'thematic' && winner !== 'sequential' && winner !== 'split') {
    return new NextResponse('Invalid winner parameter. Expected "thematic", "sequential", or "split".', { status: 400 })
  }

  const stats = await getExperimentStats(experimentId)

  const isReset = winner === 'split'
  const targetName = isReset
    ? 'Reset to 50/50 Split Mode'
    : winner === 'thematic'
    ? '4-Stage Thematic Calculator (100% Traffic)'
    : '8-Step Sequential Calculator (100% Traffic)'

  const isSignificant = stats.isStatisticallySignificant

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Confirm Production Route Change | SettlementCheck</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #F7F4EE;
            color: #0B1F3A;
            margin: 0;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .card {
            background: #ffffff;
            border: 1px solid #E2DCCE;
            border-radius: 16px;
            max-width: 520px;
            width: 100%;
            padding: 36px 32px;
            box-shadow: 0 10px 30px rgba(11, 31, 58, 0.08);
          }
          .badge {
            background: rgba(217, 96, 59, 0.12);
            color: #D9603B;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 5px 12px;
            border-radius: 999px;
            display: inline-block;
            margin-bottom: 16px;
          }
          h1 {
            font-size: 22px;
            color: #0B1F3A;
            margin: 0 0 12px;
            line-height: 1.3;
          }
          p {
            font-size: 14px;
            color: #5B6577;
            line-height: 1.6;
            margin: 0 0 18px;
          }
          .stat-box {
            background: #F7F4EE;
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 13px;
          }
          .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
          }
          .warning-box {
            background: rgba(217, 96, 59, 0.08);
            border: 1px solid rgba(217, 96, 59, 0.25);
            border-radius: 8px;
            padding: 12px 14px;
            margin-bottom: 24px;
            font-size: 13px;
            color: #B54A2A;
            line-height: 1.5;
          }
          .btn-confirm {
            width: 100%;
            background: ${isReset ? '#0B1F3A' : '#D9603B'};
            color: #ffffff;
            border: none;
            padding: 14px 20px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 12px;
          }
          .btn-cancel {
            display: block;
            width: 100%;
            text-align: center;
            color: #8A93A3;
            text-decoration: none;
            font-size: 13px;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Confirmation Gate</span>
          <h1>Confirm Traffic Allocation</h1>
          <p>
            You have initiated a request to route live traffic to:
            <br />
            <strong style="color: #0B1F3A; font-size: 16px;">${targetName}</strong>
          </p>

          ${
            !isReset && !isSignificant
              ? `
              <div class="warning-box">
                <strong>Statutory Notice: Significance Unconfirmed</strong>
                <br />
                The current sample size (${stats.totalSessions}/${stats.targetSessions} target sessions) has not yet satisfied the 95% statistical confidence floor.
              </div>
            `
              : ''
          }

          <div class="stat-box">
            <div class="stat-row">
              <span>Sequential (8-Step) CR:</span>
              <strong>${stats.sequential.completionRate}%</strong>
            </div>
            <div class="stat-row">
              <span>Thematic (4-Stage) CR:</span>
              <strong>${stats.thematic.completionRate}%</strong>
            </div>
            <div class="stat-row">
              <span>Observed Relative Lift:</span>
              <strong>${stats.relativeLiftPct > 0 ? '+' : ''}${stats.relativeLiftPct}%</strong>
            </div>
            <div class="stat-row" style="margin-bottom: 0;">
              <span>Sample Progress:</span>
              <strong>${stats.totalSessions} / ${stats.targetSessions} (${stats.sampleProgressPct}%)</strong>
            </div>
          </div>

          <form method="POST" action="/api/experiments/promote/">
            <input type="hidden" name="id" value="${experimentId}" />
            <input type="hidden" name="winner" value="${winner}" />
            <input type="hidden" name="token" value="${token}" />
            <button type="submit" class="btn-confirm">
              ${isReset ? 'Confirm: Reset to 50/50 Split Mode' : 'Confirm: Activate 100% Traffic Allocation'}
            </button>
          </form>

          <a href="/calculator/" class="btn-cancel">&larr; Cancel and return to live site</a>
        </div>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

/**
 * POST Handler: Executes the actual state mutation upon deliberate confirmation.
 */
export async function POST(req: NextRequest) {
  let experimentId = 'calc_ux_v2'
  let winner: string | null = null
  let token: string | null = null

  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData()
    experimentId = (formData.get('id') as string) || 'calc_ux_v2'
    winner = formData.get('winner') as string
    token = formData.get('token') as string
  } else {
    try {
      const body = await req.json()
      experimentId = body.id || 'calc_ux_v2'
      winner = body.winner
      token = body.token
    } catch {
      // Fallback
    }
  }

  if (!token || token !== EXPECTED_TOKEN) {
    return new NextResponse('Unauthorized access token', { status: 401 })
  }

  if (winner !== 'thematic' && winner !== 'sequential' && winner !== 'split') {
    return new NextResponse('Invalid winner specified', { status: 400 })
  }

  const success = await promoteExperimentWinner(experimentId, winner as any)

  if (!success) {
    return new NextResponse('Failed to update experiment configuration', { status: 500 })
  }

  const isReset = winner === 'split'
  const title = isReset ? 'Experiment Reset to 50/50 Split' : 'Production Route Activated'
  const message = isReset
    ? 'Traffic to <strong>/calculator/</strong> is now evenly divided 50/50 between the 8-Step and 4-Stage models.'
    : `100% of live traffic is now permanently routed to the <strong>${winner === 'thematic' ? '4-Stage Thematic' : '8-Step Sequential'}</strong> model.`

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title} | SettlementCheck</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #F7F4EE;
            color: #0B1F3A;
            margin: 0;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .card {
            background: #ffffff;
            border: 1px solid #E2DCCE;
            border-radius: 16px;
            max-width: 480px;
            width: 100%;
            padding: 36px 32px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(11, 31, 58, 0.08);
          }
          .badge {
            background: rgba(217, 96, 59, 0.12);
            color: #D9603B;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 5px 12px;
            border-radius: 999px;
            display: inline-block;
            margin-bottom: 16px;
          }
          h1 {
            font-size: 24px;
            color: #0B1F3A;
            margin: 0 0 12px;
          }
          p {
            font-size: 14px;
            color: #5B6577;
            line-height: 1.6;
            margin: 0 0 24px;
          }
          .btn-primary {
            display: inline-block;
            background: #D9603B;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .btn-revert {
            display: inline-block;
            color: #5B6577;
            text-decoration: underline;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">State Updated</span>
          <h1>${title}</h1>
          <p>${message}</p>
          <a href="/calculator/" class="btn-primary">Inspect Live Calculator &rarr;</a>
          <br />
          ${
            !isReset
              ? `
              <a href="/api/experiments/promote/?id=${experimentId}&winner=split&token=${token}" class="btn-revert">
                Undo: Revert back to 50/50 Split Mode
              </a>
            `
              : ''
          }
        </div>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
