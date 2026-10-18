import type { Metadata } from 'next'
import { Suspense } from 'react'
import GetMatchedClient from './GetMatchedClient'

export const metadata: Metadata = {
  title: 'Find an SRA Settlement Solicitor Free | SettlementCheck',
  description:
    'Connect with an SRA-regulated employment solicitor specialising in settlement agreements. Free service. No obligation. Your employer covers the advice fee.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/get-matched/',
  },
  robots: { index: false, follow: true },
}

export default function GetMatchedPage() {
  return (
    <Suspense>
      <GetMatchedClient />
    </Suspense>
  )
}
