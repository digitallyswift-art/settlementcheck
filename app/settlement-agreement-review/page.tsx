import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ReviewClient from './ReviewClient'

export const metadata: Metadata = {
  title: 'Employment Settlement Agreement Checker | Check Your Offer & Clauses | SettlementCheck',
  description: 'Check your UK employment settlement agreement clauses and offer amount. Instant confidential check of statutory redundancy caps (£751/week), £30,000 tax rules, and employer legal fees.',
  alternates: { canonical: 'https://settlementcheck.co.uk/settlement-agreement-review/' },
  openGraph: {
    title: 'Employment Settlement Agreement Checker UK | SettlementCheck',
    description: 'Instant confidential check of UK employment settlement agreements. Statutory cap checks, £30k tax rules, and tactical negotiation points.',
    url: 'https://settlementcheck.co.uk/settlement-agreement-review/',
    type: 'website',
  },
}

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Employment Settlement Agreement Checker',
  url: 'https://settlementcheck.co.uk/settlement-agreement-review/',
  applicationCategory: 'LegalApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  description: 'Confidential review tool for UK employment settlement agreements. Verifies statutory compliance, tax exemptions (s.403), and negotiation leverage.',
  about: {
    '@type': 'Thing',
    name: 'Employment Settlement Agreement UK',
    description: 'Statutory compromise and settlement agreements under Section 203 of the UK Employment Rights Act 1996',
  },
}

export default function SettlementAgreementReviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <Nav />
      <main className="bg-paper min-h-screen py-10">
        <ReviewClient />
      </main>
      <Footer />
    </>
  )
}
