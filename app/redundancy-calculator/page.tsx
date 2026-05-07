import type { Metadata } from 'next'
import HomeClient from '../HomeClient'

export const metadata: Metadata = {
  title: 'Redundancy Settlement Agreement Calculator | SettlementCheck',
  description: 'Calculate your statutory redundancy pay and typical settlement range. Get an instant, independent estimate before speaking to your employer.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/redundancy-calculator',
  },
  openGraph: {
    title: 'Redundancy Settlement Agreement Calculator | SettlementCheck',
    description: 'Calculate your statutory redundancy pay and typical settlement range. Get an instant, independent estimate before speaking to your employer.',
    url: 'https://settlementcheck.co.uk/redundancy-calculator',
    type: 'website',
  },
}

export default function RedundancyCalculatorPage() {
  return (
    <HomeClient
      title={<>Calculate your <em style={{ fontStyle: 'italic', color: '#D9603B' }}>redundancy</em> settlement</>}
      lead="Facing redundancy? Find out your statutory minimums and typical settlement range in 60 seconds. Our calculator is independent and honest. Then, if you need it, speak to a vetted solicitor to confirm your position."
    />
  )
}
