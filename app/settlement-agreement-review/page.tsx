import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ReviewClient from './ReviewClient'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'

const STATIC_METADATA: Metadata = {
  title: 'Settlement Agreement Checklist UK (2026) | SettlementCheck',
  description:
    'Check your UK settlement agreement clauses before speaking to a solicitor. Zero-upload checklist covering April 2026 caps (£751/wk), £30,000 tax rules, and employer fee contributions.',
  alternates: { canonical: 'https://settlementcheck.co.uk/settlement-agreement-review/' },
  openGraph: {
    title: 'Settlement Agreement Checklist UK (2026) | SettlementCheck',
    description:
      'Check your UK settlement agreement clauses before speaking to a solicitor. Zero-upload checklist covering April 2026 caps (£751/wk), £30,000 tax rules, and employer fee contributions.',
    url: 'https://settlementcheck.co.uk/settlement-agreement-review/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/settlement-agreement-review/', STATIC_METADATA)
}

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Settlement Agreement Clause & Readiness Checklist',
  url: 'https://settlementcheck.co.uk/settlement-agreement-review/',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  description:
    'Client-side UK settlement agreement readiness checklist covering April 2026 statutory caps (£751/wk GB, £783/wk NI), ITEPA 2003 s.403 tax exemptions, PENP s.402D rules, and ACAS Code 4 timelines.',
  publisher: SETTLEMENT_CHECK_PUBLISHER,
  about: {
    '@type': 'Thing',
    name: 'Employment Settlement Agreement UK',
    description: 'Statutory settlement agreements under Section 203 of the UK Employment Rights Act 1996',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Prepare a UK Settlement Agreement for Solicitor Review',
  description:
    'Step-by-step zero-upload checklist of UK settlement agreement clauses, statutory redundancy baselines, ITEPA 2003 tax rules, and ACAS Code 4 timelines.',
  publisher: SETTLEMENT_CHECK_PUBLISHER,
  step: [
    {
      '@type': 'HowToStep',
      name: 'Select your clause status and jurisdiction',
      text: 'Answer six structured checklist questions covering legal fee contributions, notice pay separation, tax thresholds, restrictive covenants, waivers, and references.',
    },
    {
      '@type': 'HowToStep',
      name: 'Check statutory caps and tax rules',
      text: 'Compare optional salary and service figures against April 2026 statutory weekly pay caps (£751 GB / £783 NI) and ITEPA 2003 s.402D and s.403 tax rules.',
    },
    {
      '@type': 'HowToStep',
      name: 'Prepare your solicitor discussion agenda',
      text: 'Generate a structured Intake Agenda to share with an independent SRA-regulated employment solicitor during your Section 203(3) ERA 1996 consultation.',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  publisher: SETTLEMENT_CHECK_PUBLISHER,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I check my settlement agreement before speaking to a solicitor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Using a structured pre-solicitor checklist helps you verify April 2026 statutory redundancy baselines (£751/week GB, £783/week NI), check whether your employer has included a commercial legal fee contribution (typically £350 to £500+ plus VAT upon completion), and review ITEPA 2003 s.402D and s.403 tax rules before consulting an independent SRA-regulated solicitor.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do employers typically contribute towards settlement agreement legal fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While Section 203(3) of the Employment Rights Act 1996 requires independent legal advice for a waiver to be valid, employer fee payment is a commercial convention rather than a legal obligation. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. Any fees above the cap or abortive costs if the agreement does not complete are subject to your solicitor’s engagement terms.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are settlement agreement payments tax-free in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under Section 403 of ITEPA 2003, genuine ex-gratia termination compensation and statutory redundancy payments up to £30,000 are exempt from income tax and National Insurance. Amounts over £30,000 are subject to income tax and employer Class 1A NIC (15.0% in 2026/27), while employee NIC remains 0%. Payment in lieu of notice (PILON / PENP under s.402D), accrued holiday pay, and separate consideration for restrictive covenants (s.225) are always taxable as normal earnings.',
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
        {/* Server-rendered Intro Header for immediate SSR H1 and crawlability */}
        <div className="max-w-4xl mx-auto px-4 pt-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-2 border border-rule text-xs font-mono text-ink mb-4">
            <span className="w-2 h-2 rounded-full bg-coral inline-block" />
            Zero-Upload Browser Checklist • April 2026 UK Statutory Rates
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-ink font-bold mb-3">
            Settlement agreement clause readiness checklist
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
            Prepare for your independent solicitor consultation with a structured, client-side check of key clauses, ACAS Code 4 timelines, April 2026 statutory caps, and ITEPA 2003 tax rules, without uploading confidential documents.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">
              Loading settlement agreement readiness checklist...
            </div>
          }
        >
          <ReviewClient />
        </Suspense>
        <DynamicFaqSection pathname="/settlement-agreement-review/" />
      </main>
      <Footer />
    </>
  )
}
