import type { Metadata } from 'next'
import { Suspense } from 'react'
import GetMatchedClient from './GetMatchedClient'

export const metadata: Metadata = {
  title: 'Get Your Free Specialist Match | SettlementCheck',
  description: 'Connect with an SRA-regulated employment solicitor who specialises in settlement agreements. Free. No obligation. Your employer covers the legal advice fee.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/get-matched/',
  },
  robots: { index: false, follow: false },
}

export default function GetMatchedPage() {
  return (
    <Suspense>
      <GetMatchedClient />
    </Suspense>
  )
}
