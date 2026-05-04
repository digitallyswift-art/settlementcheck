import type { Metadata } from 'next'
import ForSolicitorsClient from './ForSolicitorsClient'

export const metadata: Metadata = {
  title: 'Settlement Agreement Leads for Employment Solicitors | SettlementCheck',
  description: 'Join the SettlementCheck panel. Receive pre-qualified settlement agreement leads from employees who have already used our independent calculator. SRA-regulated firms only.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/for-solicitors/',
  },
  openGraph: {
    title: 'Settlement Agreement Leads for Employment Solicitors',
    description: 'Pre-qualified leads from employees who already know their offer position. No cold enquiries. SRA-regulated firms only.',
    url: 'https://settlementcheck.co.uk/for-solicitors/',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function ForSolicitorsPage() {
  return <ForSolicitorsClient />
}
