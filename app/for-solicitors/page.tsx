import type { Metadata } from 'next'
import ForSolicitorsClient from './ForSolicitorsClient'

export const metadata: Metadata = {
  title: 'Settlement Agreement Instructions for Employment Solicitors | SettlementCheck',
  description: 'Receive exclusive, pre-calculated settlement agreement instructions from UK employees. Complete statutory redundancy dossiers, PILON splits, and direct employer legal fees. SRA firms only.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/for-solicitors/',
  },
  openGraph: {
    title: 'Settlement Agreement Instructions for Employment Solicitors',
    description: 'Pre-calculated settlement instructions with statutory redundancy pay and PILON breakdowns attached. Exclusive territorial routing for SRA-regulated firms.',
    url: 'https://settlementcheck.co.uk/for-solicitors/',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function ForSolicitorsPage() {
  return <ForSolicitorsClient />
}
