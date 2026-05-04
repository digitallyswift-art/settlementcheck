import type { Metadata } from 'next'
import ResultsClient from './ResultsClient'

export const metadata: Metadata = {
  title: 'Your Settlement Estimate | SettlementCheck',
  description: 'Your personalised settlement agreement estimate. Get matched with a vetted employment solicitor — free, your employer pays.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/results/',
  },
  robots: { index: false, follow: false },
}

export default function ResultsPage() {
  return <ResultsClient />
}
