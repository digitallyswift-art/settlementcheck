import type { Metadata } from 'next'
import ForEmployersClient from './ForEmployersClient'

export const metadata: Metadata = {
  title: 'SettlementCheck for Employers | Redundancy & s.203 Portal',
  description:
    'Streamline workplace exits and collective redundancies. Calculate statutory severance, generate s.111A packs, and dispatch to SRA solicitors.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/for-employers/',
  },
  openGraph: {
    title: 'SettlementCheck for Employers | Redundancy & s.203 Portal',
    description:
      'Streamline workplace exits and collective redundancies. Calculate statutory severance, generate s.111A packs, and dispatch to SRA solicitors.',
    url: 'https://settlementcheck.co.uk/for-employers/',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function ForEmployersPage() {
  return <ForEmployersClient />
}
