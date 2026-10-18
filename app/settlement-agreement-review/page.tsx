import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ReviewClient from './ReviewClient'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/settlement-agreement-review/', STATIC_METADATA)
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
  description: 'Confidential review tool for UK employment settlement agreements. Verifies statutory compliance, tax exemptions (s.403), and negotiation standing.',
  about: {
    '@type': 'Thing',
    name: 'Employment Settlement Agreement UK',
    description: 'Statutory compromise and settlement agreements under Section 203 of the UK Employment Rights Act 1996',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Check and Review a UK Settlement Agreement',
  description: 'Step-by-step confidential check of draft employment settlement agreement clauses, statutory redundancy caps, and employer legal fee contributions.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Paste draft agreement terms',
      text: 'Copy and paste clause snippets or your settlement offer letter into the confidential review tool.',
    },
    {
      '@type': 'HowToStep',
      name: 'Verify statutory compliance and tax rules',
      text: 'The tool checks the £751/week redundancy cap, £30,000 tax exemption under ITEPA 2003 s.403, and £500 to £1,500+VAT legal fee contributions.',
    },
    {
      '@type': 'HowToStep',
      name: 'Review tactical counter-offer points',
      text: 'Compare your compensation against Ministry of Justice tribunal tables and get actionable amendments for restrictive covenants.',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I check my settlement agreement before speaking to a solicitor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Checking your draft clauses beforehand allows you to verify statutory redundancy baselines (£751/week), check whether your employer is paying standard solicitor fees (£500 to £1,500 + VAT), and understand your tax exemption before speaking with an independent SRA-regulated solicitor.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should an employer pay towards settlement agreement legal fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In the UK, employers typically pay between £500 and £1,500 plus VAT towards your independent solicitor fees, as independent legal advice is a mandatory statutory requirement under Section 203 of the Employment Rights Act 1996.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are settlement agreement payments tax-free in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under Section 403 of ITEPA 2003, genuine ex-gratia compensation and statutory redundancy payments up to £30,000 are exempt from income tax and National Insurance. However, payment in lieu of notice (PILON) and accrued holiday pay are always taxed as normal earnings.',
      },
    },
  ],
}

export default function SettlementAgreementReviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav />
      <main className="bg-paper min-h-screen py-10">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">
            Loading settlement agreement review tool...
          </div>
        }>
          <ReviewClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
