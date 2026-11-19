import { NextResponse } from 'next/server';

/**
 * Legacy AI free-text agreement review endpoint — retired.
 * /settlement-agreement-review/ now operates as a zero-PII, client-side deterministic
 * clause readiness checklist to eliminate UK GDPR Article 9 free-text transmission.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        'Automated free-text agreement processing has been retired. Please use the client-side Clause Readiness Checklist at /settlement-agreement-review/ or speak directly with an SRA-regulated solicitor.',
    },
    { status: 410 },
  );
}
