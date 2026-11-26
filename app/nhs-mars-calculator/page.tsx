import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NhsMarsCalculator from '@/app/guides/nhs-settlement-agreements/NhsMarsCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'NHS MARS & Redundancy Calculator 2026 | SettlementCheck',
  },
  description:
    'Calculate NHS MARS voluntary exit and Agenda for Change Section 16 redundancy payouts for 2026. Check £30,000 tax exemptions and pension rules. Free check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/nhs-mars-calculator/',
  },
  openGraph: {
    title: 'NHS MARS & Redundancy Calculator 2026 | SettlementCheck',
    description:
      'Calculate NHS MARS voluntary exit and Agenda for Change Section 16 redundancy payouts for 2026. Check £30,000 tax exemptions and pension rules. Free check.',
    url: 'https://settlementcheck.co.uk/nhs-mars-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHS MARS & Redundancy Calculator 2026 | SettlementCheck',
    description:
      'Calculate NHS MARS voluntary exit and Agenda for Change Section 16 redundancy payouts for 2026. Check £30,000 tax exemptions and pension rules. Free check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/nhs-mars-calculator/', STATIC_METADATA)
}

const nhsMarsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'NHS MARS & Agenda for Change Redundancy Calculator 2026',
      url: 'https://settlementcheck.co.uk/nhs-mars-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (AfC s.16 & s.17)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free NHS MARS and Agenda for Change Section 16 redundancy calculator for 2026. Calculates voluntary exit payouts, 21-month and 24-month service caps, and the £30,000 tax exemption under ITEPA 2003 s.403.',
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
          name: 'How is an NHS MARS 2026 payout calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under NHS Agenda for Change Section 17, the Mutually Agreed Resignation Scheme (MARS) typically pays 1 month of basic pay per complete year of reckonable NHS service, subject to local trust caps (commonly 21 months or a £100,000 threshold). Under ITEPA 2003 s.403, the first £30,000 of genuine severance compensation is usually tax-free.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does NHS MARS differ from Agenda for Change Section 16 redundancy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Section 16 contractual redundancy is involuntary and pays 1 month per year of reckonable service up to 24 months, with no £751 statutory weekly cap and an option to use the lump sum for early-retirement pension buyout if eligible. MARS is a voluntary departure scheme capped lower (typically 21 months) and does not provide automatic early-retirement buyout.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is NHS MARS pay taxable?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Genuine MARS severance compensation up to £30,000 is normally free of income tax and employee National Insurance under Section 403 of ITEPA 2003. Any excess over £30,000 is taxed at your marginal income tax rate, and any contractual notice pay (PILON/PENP) is taxed in full as earnings.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who pays for an independent solicitor to review my NHS settlement or MARS agreement?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under Section 203(3) of the Employment Rights Act 1996, a settlement waiver is only valid after independent legal advice. NHS trusts standardly provide a capped fee contribution (typically £350 to £500+ plus VAT) directly to your SRA-regulated solicitor upon completion, while excess or abortive work remains subject to your solicitor engagement terms.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://settlementcheck.co.uk/calculators/' },
        { '@type': 'ListItem', position: 3, name: 'NHS MARS Calculator', item: 'https://settlementcheck.co.uk/nhs-mars-calculator/' },
      ],
    },
  ],
}

export default function NhsMarsCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(nhsMarsSchema) }}
      />
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            Agenda for Change s.16 &amp; s.17 • 2026 Rates
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            NHS MARS &amp; Redundancy Calculator 2026
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Estimate your NHS Mutually Agreed Resignation Scheme (MARS) payout or Agenda for Change Section 16 redundancy entitlement, plus your £30,000 tax-free threshold.
          </p>
        </div>

        <div className="mb-10">
          <NhsMarsCalculator />
        </div>

        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-5 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            Key Rules for NHS MARS &amp; Settlement Offers in 2026
          </h2>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            NHS trusts use MARS (Agenda for Change Section 17) for voluntary exits and Section 16 for contractual redundancies. Neither scheme uses the statutory £751/week cap, so high-service NHS staff frequently cross the £30,000 tax-free threshold under ITEPA 2003 s.403.
          </p>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            Any discretionary sum above contractual or statutory terms is a Special Severance Payment requiring HM Treasury approval, and returning to the NHS within 6 months of a MARS exit normally triggers a clawback.
          </p>

          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Need the full NHS pension, clawback, and whistleblowing breakdown?
            </span>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/guides/nhs-settlement-agreements/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                NHS Settlement &amp; MARS Guide →
              </Link>
              <Link
                href="/redundancy-calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Statutory Redundancy Calculator →
              </Link>
              <Link
                href="/calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Full Settlement Check →
              </Link>
            </div>
          </div>
        </div>

        <DynamicFaqSection pathname="/nhs-mars-calculator/" />
      </main>
      <Footer />
    </div>
  )
}
