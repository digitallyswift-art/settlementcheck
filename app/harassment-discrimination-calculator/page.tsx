import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { VentoCalculator } from '@/components/VentoCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Harassment & Discrimination Calculator | SettlementCheck',
  },
  description:
    'Calculate workplace harassment and discrimination settlement baselines with April 2026 Vento bands (£1,300 to £62,900+) and £30k tax rules. Free check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/harassment-discrimination-calculator/',
  },
  openGraph: {
    title: 'Harassment & Discrimination Calculator | SettlementCheck',
    description:
      'Calculate workplace harassment and discrimination settlement baselines with April 2026 Vento bands (£1,300 to £62,900+) and £30k tax rules. Free check.',
    url: 'https://settlementcheck.co.uk/harassment-discrimination-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harassment & Discrimination Calculator | SettlementCheck',
    description:
      'Calculate workplace harassment and discrimination settlement baselines with April 2026 Vento bands (£1,300 to £62,900+) and £30k tax rules. Free check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/harassment-discrimination-calculator/', STATIC_METADATA)
}

const ventoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK Workplace Harassment & Discrimination Calculator 2026',
      url: 'https://settlementcheck.co.uk/harassment-discrimination-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (EqA 2010 & Vento Ninth Addendum)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK workplace harassment and discrimination compensation calculator using April 2026 Vento injury-to-feelings bands (£1,300 to £62,900+) and Equality Act 2010 s.124 rules.',
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
          name: 'What are the April 2026 Vento bands for harassment and discrimination?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For claims presented on or after 6 April 2026, the Presidential Guidance Ninth Addendum sets the Lower Band at £1,300 to £12,600, Middle Band at £12,600 to £37,700, and Upper Band at £37,700 to £62,900 (exceeding £62,900 in the most exceptional cases).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is workplace harassment or discrimination compensation capped in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Under Section 124 of the Equality Act 2010, compensation for unlawful discrimination and harassment is uncapped and combines financial loss with injury to feelings, unlike ordinary unfair dismissal (capped at £123,543 or 52 weeks pay).',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Section 111A protected conversation confidentiality cover harassment or discrimination?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Section 111A of the Employment Rights Act 1996 applies strictly to ordinary unfair dismissal and provides zero protection where there is unlawful discrimination, harassment, whistleblowing, or improper behaviour.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who pays for a solicitor to review a harassment or discrimination settlement?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under Section 203(3) ERA 1996, a settlement waiver requires independent legal advice. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion, while excess or abortive work remains subject to your solicitor engagement terms.',
          },
        },
      ],
    },
  ],
}

export default function HarassmentDiscriminationCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(ventoSchema) }}
      />
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            Equality Act 2010 s.124 • April 2026 Vento Bands
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            Harassment &amp; Discrimination Calculator 2026
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Estimate illustrative Equality Act 2010 settlement ranges using April 2026 Vento injury-to-feelings bands (£1,300 to £62,900+), financial loss, and £30,000 tax rules.
          </p>
        </div>

        <div className="mb-10">
          <VentoCalculator />
        </div>

        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-5 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            Comparing a Settlement Offer Against Tribunal Wait Times
          </h2>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            Because Equality Act 2010 claims are uncapped and Section 111A confidentiality does not shield discrimination or harassment, employers often negotiate an ex-gratia settlement to avoid a public hearing. Check official Ministry of Justice averages and current HMCTS tribunal wait times before speaking with an independent solicitor.
          </p>
          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Compare tribunal averages and wait times:
            </span>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/guides/employment-tribunal-average-awards-uk/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                MoJ Tribunal Average Awards →
              </Link>
              <Link
                href="/tribunal-backlog-tracker/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Tribunal Backlog Tracker →
              </Link>
              <Link
                href="/guides/discrimination-settlement-agreements/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Discrimination Settlements Guide →
              </Link>
            </div>
          </div>
        </div>

        <DynamicFaqSection pathname="/harassment-discrimination-calculator/" />
      </main>
      <Footer />
    </div>
  )
}
