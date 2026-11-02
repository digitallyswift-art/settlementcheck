import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ReviewClient from './ReviewClient'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  title: 'Settlement Agreement Checker UK (2026) | SettlementCheck',
  description:
    'Check your UK settlement agreement clauses and offer value. Confidential audit of statutory caps (£751/wk), tax exemptions, and employer legal fee contributions.',
  alternates: { canonical: 'https://settlementcheck.co.uk/settlement-agreement-review/' },
  openGraph: {
    title: 'Settlement Agreement Checker UK (2026) | SettlementCheck',
    description:
      'Check your UK settlement agreement clauses and offer value. Confidential audit of statutory caps (£751/wk), tax exemptions, and employer legal fee contributions.',
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
      name: 'Input draft agreement terms',
      text: 'Submitting clause text or settlement offer proposals initiates statutory compliance evaluation.',
    },
    {
      '@type': 'HowToStep',
      name: 'Verify statutory compliance and tax rules',
      text: 'The audit evaluates the April 2026 £751/week statutory cap, £30,000 tax exemption under ITEPA 2003 s.403, and Section 203(3) legal fee contributions.',
    },
    {
      '@type': 'HowToStep',
      name: 'Assess tactical negotiation benchmarks',
      text: 'Comparing proposed compensation against Ministry of Justice tribunal tables and evaluating restrictive covenants.',
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
        text: "Yes. Checking draft clauses beforehand allows verification of statutory redundancy baselines (£751/week), confirmation of the employer's offered legal fee contribution (£350 to £500+ plus VAT), and review of tax exemptions under ITEPA 2003 s.403 before consulting an independent SRA-regulated solicitor.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much should an employer pay towards settlement agreement legal fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In the UK, employers standardly provide a capped contribution (typically between £350 and £500+ plus VAT) directly to your solicitor upon completion, as certification by an independent SRA-regulated solicitor is a mandatory statutory requirement under Section 203(3) of the Employment Rights Act 1996.',
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
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
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
        <DynamicFaqSection pathname="/settlement-agreement-review/" />
      </main>
      <Footer />
    </>
  )
}
