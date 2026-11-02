import type { Metadata } from 'next'
import { Suspense } from 'react'
import GetMatchedClient from './GetMatchedClient'

export const metadata: Metadata = {
  title: 'Find an SRA Settlement Solicitor | SettlementCheck',
  description:
    'Connect with an SRA-regulated employment solicitor specialising in settlement agreements. Free matching service. No obligation. Standard employer fee contribution applies upon completion.',
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
