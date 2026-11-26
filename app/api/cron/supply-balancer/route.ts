import { NextRequest, NextResponse } from 'next/server';
import { TerritorialSupplyBalancerWorker } from '@/lib/agentic-engine/workers/territorial-supply-balancer-worker';
import { constantTimeEqual } from '@/lib/security/otp-tokens';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleSupplyBalancer(req);
}

export async function POST(req: NextRequest) {
  return handleSupplyBalancer(req);
}

async function handleSupplyBalancer(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || !authHeader || !constantTimeEqual(authHeader, `Bearer ${cronSecret}`)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid cron authorization required.' },
        { status: 401 }
      );
    }

    const applyWeightAdjustments =
      req.nextUrl.searchParams.get('applyWeights') === 'true';
    const dispatchOutreach =
      req.nextUrl.searchParams.get('dispatchOutreach') === 'true';

    const report = await TerritorialSupplyBalancerWorker.execute({
      applyWeightAdjustments,
      dispatchOutreach,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Territorial Supply Balancer cron execution failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Territorial Supply Balancer execution failed' },
      { status: 500 }
    );
  }
}
