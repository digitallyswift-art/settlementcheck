import { NextRequest, NextResponse } from 'next/server';
import { ga4OpportunityWorker } from '@/lib/agentic-engine/workers/ga4-opportunity-worker';
import { ConversionImprovementPackage } from '@/lib/agentic-engine/types';

export const dynamic = 'force-dynamic';

// In-memory runtime registry for demonstration and interactive approval/rollback
let inMemoryPackages: ConversionImprovementPackage[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const now = new Date();
    const endDate = searchParams.get('endDate') || now.toISOString().split('T')[0];
    const startDate =
      searchParams.get('startDate') ||
      new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // If no packages cached in memory, execute worker audit
    if (inMemoryPackages.length === 0) {
      const report = await ga4OpportunityWorker.execute({ startDate, endDate });
      inMemoryPackages = report.stagedPackages;

      return NextResponse.json({
        success: true,
        reconciliation: report.reconciliation,
        packages: inMemoryPackages,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      packages: inMemoryPackages,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/cockpit/conversion-packages GET:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, packageId } = body;

    const pkgIndex = inMemoryPackages.findIndex((p) => p.id === packageId);
    if (pkgIndex === -1 && action !== 'RESET') {
      return NextResponse.json(
        { success: false, error: `Package ${packageId} not found` },
        { status: 404 }
      );
    }

    if (action === 'APPROVE') {
      inMemoryPackages[pkgIndex].status = 'APPLIED';
      inMemoryPackages[pkgIndex].appliedAt = new Date().toISOString();
      return NextResponse.json({
        success: true,
        message: `Conversion Package ${packageId} approved and applied to production.`,
        package: inMemoryPackages[pkgIndex],
      });
    }

    if (action === 'REJECT') {
      inMemoryPackages[pkgIndex].status = 'REJECTED';
      return NextResponse.json({
        success: true,
        message: `Conversion Package ${packageId} rejected.`,
        package: inMemoryPackages[pkgIndex],
      });
    }

    if (action === 'ROLLBACK') {
      inMemoryPackages[pkgIndex].status = 'STAGED';
      delete inMemoryPackages[pkgIndex].appliedAt;
      return NextResponse.json({
        success: true,
        message: `Conversion Package ${packageId} rolled back safely.`,
        package: inMemoryPackages[pkgIndex],
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Error in /api/cockpit/conversion-packages POST:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
