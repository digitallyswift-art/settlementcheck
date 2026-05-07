import type { Metadata } from 'next'
import HomeClient from '../HomeClient'

export const metadata: Metadata = {
  title: 'Constructive Dismissal Settlement Calculator | SettlementCheck',
  description: 'Forced to resign? Calculate your potential settlement for constructive dismissal. Independent estimate based on UK employment law.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/constructive-dismissal-calculator',
  },
  openGraph: {
    title: 'Constructive Dismissal Settlement Calculator | SettlementCheck',
    description: 'Forced to resign? Calculate your potential settlement for constructive dismissal. Independent estimate based on UK employment law.',
    url: 'https://settlementcheck.co.uk/constructive-dismissal-calculator',
    type: 'website',
  },
}

export default function ConstructiveDismissalCalculatorPage() {
  return (
    <HomeClient
      title={<>Calculate your <em style={{ fontStyle: 'italic', color: '#D9603B' }}>constructive dismissal</em> settlement</>}
      lead="Feeling forced to resign? Constructive dismissal claims are complex, but you can still negotiate a settlement. Check what your claim might be worth, then speak to an SRA-regulated solicitor to find out where you stand."
    />
  )
}
