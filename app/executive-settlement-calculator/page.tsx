import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { ExecutiveSettlementCalculator } from '@/components/ExecutiveSettlementCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Executive Settlement Calculator UK 2026 | SettlementCheck',
  },
  description:
    'Calculate senior executive settlement tax above £30,000 in London & the UK. Model PILON, s.408 pension savings, Class 1A NIC, and City exit terms. Free check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/executive-settlement-calculator/',
  },
  openGraph: {
    title: 'Executive Settlement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate senior executive settlement tax above £30,000 in London & the UK. Model PILON, s.408 pension savings, Class 1A NIC, and City exit terms. Free check.',
    url: 'https://settlementcheck.co.uk/executive-settlement-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Settlement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate senior executive settlement tax above £30,000 in London & the UK. Model PILON, s.408 pension savings, Class 1A NIC, and City exit terms. Free check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/executive-settlement-calculator/', STATIC_METADATA)
}

const execSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK Executive & Financial Services Settlement Calculator 2026',
      url: 'https://settlementcheck.co.uk/executive-settlement-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (ITEPA 2003 s.403 & s.408)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK executive settlement calculator for packages over £30,000. Models 40% and 45% marginal tax, PENP/PILON notice pay, s.408 pension contributions, and City/Canary Wharf financial exit terms.',
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
          name: 'How are executive settlement agreements taxed above £30,000 in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under ITEPA 2003 s.403, the first £30,000 of genuine termination compensation is free of income tax and employee National Insurance. Any excess over £30,000 is taxed at your marginal income tax rate (typically 40% or 45% for senior executives) with 0% employee NIC, while your employer pays 15.0% Class 1A NIC.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I pay part of a London or Canary Wharf settlement into my pension to save 45% tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under Section 408 of ITEPA 2003, an employer contribution made directly into a registered pension scheme as part of termination arrangements can avoid income tax on amounts above £30,000, subject to your £60,000 annual allowance, tapering rules, and carry-forward capacity.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should financial services executives check regarding FCA references and bonuses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Regulated staff in London and Docklands financial institutions cannot contract out of FCA/PRA regulatory reference rules or statutory whistleblowing under ERA 1996 s.43J. Solicitors also review Good Leaver status for deferred bonuses, RSUs, LTIPs, garden leave, and post-termination restrictive covenants.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much do employers contribute to legal fees for executive settlement agreements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'While employers standardly contribute £350 to £500+ plus VAT for straightforward agreements upon completion, senior executive exits involving equity, tax indemnities, and restrictive covenants often carry contributions of £750 to £2,500+ plus VAT. Excess or abortive work remains subject to your solicitor engagement terms.',
          },
        },
      ],
    },
  ],
}

export default function ExecutiveSettlementCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(execSchema) }}
      />
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            London, Canary Wharf &amp; Senior Exits • 2026/27 Tax Rules
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            Executive Settlement Calculator UK 2026
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Built for packages exceeding the £30,000 tax-free exemption. Model 40%/45% marginal tax, PILON/PENP, s.408 pension savings, and City/Docklands exit clauses.
          </p>
        </div>

        <div className="mb-10">
          <ExecutiveSettlementCalculator />
        </div>

        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-5 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            Structuring High-Value City &amp; Executive Exits
          </h2>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            In London and Canary Wharf financial services restructurings, headline offers frequently exceed £30,000. Because the £30,000 limit under ITEPA 2003 s.403 applies once per employment, separating taxable PILON/PENP from ex-gratia compensation and reviewing employer pension contributions (s.408) can materially change net take-home pay.
          </p>
          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Explore detailed executive legal guidance:
            </span>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/guides/executive-settlement-agreements/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Executive Settlement Guide →
              </Link>
              <Link
                href="/settlement-agreement-tax-calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Settlement Tax Calculator →
              </Link>
              <Link
                href="/penp-calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                PILON &amp; PENP Calculator →
              </Link>
            </div>
          </div>
        </div>

        <DynamicFaqSection pathname="/executive-settlement-calculator/" />
      </main>
      <Footer />
    </div>
  )
}
