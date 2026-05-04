import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Settlement Agreement Calculator UK | Is Your Offer Fair? | SettlementCheck',
  description: 'Free settlement agreement calculator. Find out if your offer is fair in 60 seconds. Get matched with a vetted employment solicitor — your employer pays the fees.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/',
  },
  openGraph: {
    title: 'Settlement Agreement Calculator UK | Is Your Offer Fair?',
    description: 'Find out if your settlement offer is fair in 60 seconds. Independent calculator, not owned by a law firm. Your employer pays the legal fees.',
    url: 'https://settlementcheck.co.uk/',
    type: 'website',
  },
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Settlement Agreement Calculator',
  url: 'https://settlementcheck.co.uk/',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  description: 'Free UK settlement agreement calculator. Find out if your offer is fair in 60 seconds.',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <HomeClient />
    </>
  )
}
