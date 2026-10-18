import type { Metadata } from 'next'
import ResultsClient from './ResultsClient'

export const metadata: Metadata = {
  title: 'Your Settlement Agreement Estimate | SettlementCheck',
  description:
    'Your personalised settlement agreement estimate and breakdown. Get matched with a vetted SRA employment solicitor. Free service, your employer pays.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/results/',
  },
  robots: { index: false, follow: false },
}

export default function ResultsPage() {
  return <ResultsClient />
}
