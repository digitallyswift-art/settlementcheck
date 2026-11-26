import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { NegotiationComparisonCalculator } from '@/components/NegotiationComparisonCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Settlement Negotiation Calculator UK 2026 | SettlementCheck',
  },
  description:
    'Compare your UK settlement offer against April 2026 statutory baselines (£751/wk cap), tribunal wait times, and ACAS 10-day guidance. Free instant check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/negotiate-settlement-calculator/',
  },
  openGraph: {
    title: 'Settlement Negotiation Calculator UK 2026 | SettlementCheck',
    description:
      'Compare your UK settlement offer against April 2026 statutory baselines (£751/wk cap), tribunal wait times, and ACAS 10-day guidance. Free instant check.',
    url: 'https://settlementcheck.co.uk/negotiate-settlement-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Negotiation Calculator UK 2026 | SettlementCheck',
    description:
      'Compare your UK settlement offer against April 2026 statutory baselines (£751/wk cap), tribunal wait times, and ACAS 10-day guidance. Free instant check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/negotiate-settlement-calculator/', STATIC_METADATA)
}

const negSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK Settlement Offer & Negotiation Comparison Calculator 2026',
      url: 'https://settlementcheck.co.uk/negotiate-settlement-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (SI 2026/310 & ACAS Code 4)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK settlement comparison tool. Compares employer settlement offers against April 2026 statutory baselines (£751/wk cap), MoJ tribunal medians, and ACAS Code 4 guidance.',
      publisher: SETTLEMENT_CHECK_PUBLISHER,
      creator: {
        '@type': 'Organization',
        name: 'SettlementCheck',
        url: 'https://settlementcheck.co.uk',
      },
    },
    {
      '@type': 'FAQPage',
      publisher: SETTLEMENT_CHECK_PUBLISHER,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can an employer withdraw a settlement offer if I make a counter-offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Under English contract law (Hyde v Wrench and Routledge v Grant), a counter-offer legally extinguishes the original offer, and an employer can withdraw an unaccepted offer at any time before execution. Speak with an independent SRA-regulated solicitor before responding to HR.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the ACAS 10-day settlement consideration period a strict legal right?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Paragraph 12 of ACAS Code of Practice 4 recommends a minimum of 10 calendar days as statutory guidance rather than a binding legal right. An employer can set a shorter deadline, so do not let a stated deadline pass without consulting an independent solicitor.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does home insurance legal expenses cover pay for settlement negotiation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In almost all cases, home insurance Legal Expenses Insurance excludes voluntary settlement reviews. Instead, employers standardly provide a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion, while excess or abortive work remains subject to solicitor engagement terms.',
          },
        },
      ],
    },
  ],
}

export default function NegotiateSettlementCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(negSchema) }}
      />
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            ACAS Code 4 Guidance • April 2026 Statutory Baselines
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            Settlement Negotiation Calculator UK 2026
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Compare your employer&apos;s settlement offer against your calculated statutory baseline, MoJ tribunal averages, and ~10–18 month tribunal wait times before speaking with a solicitor.
          </p>
        </div>

        <div className="mb-10">
          <NegotiationComparisonCalculator />
        </div>

        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-5 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            Preparing an Intake Agenda Before Replying to HR
          </h2>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            Labelling an email &quot;Without Prejudice&quot; when no genuine legal dispute exists does not automatically create legal privilege, and Section 111A confidentiality applies strictly to ordinary unfair dismissal. Prepare your numbers here, then review them with an SRA-regulated solicitor before replying.
          </p>
          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Related guides &amp; tools:
            </span>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/guides/how-to-negotiate-a-settlement-agreement/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                How to Negotiate Guide →
              </Link>
              <Link
                href="/guides/home-insurance-legal-cover-settlement-agreement/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Home Insurance Legal Cover →
              </Link>
              <Link
                href="/tribunal-backlog-tracker/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Tribunal Backlog Tracker →
              </Link>
            </div>
          </div>
        </div>

        <DynamicFaqSection pathname="/negotiate-settlement-calculator/" />
      </main>
      <Footer />
    </div>
  )
}
