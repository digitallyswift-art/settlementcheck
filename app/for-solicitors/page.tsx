import type { Metadata } from 'next'
import ForSolicitorsClient from './ForSolicitorsClient'

export const metadata: Metadata = {
  title: 'Partner Solicitor Portal & Enquiries | SettlementCheck',
  description:
    'Receive exclusive, pre-calculated settlement agreement instructions from UK employees. Vetted pre-flight dossiers and employer legal fees. SRA firms only.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/for-solicitors/',
  },
  openGraph: {
    title: 'Partner Solicitor Portal & Enquiries | SettlementCheck',
    description:
      'Receive exclusive, pre-calculated settlement agreement instructions from UK employees. Vetted pre-flight dossiers and employer legal fees. SRA firms only.',
    url: 'https://settlementcheck.co.uk/for-solicitors/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function ForSolicitorsPage() {
  return <ForSolicitorsClient />
}
