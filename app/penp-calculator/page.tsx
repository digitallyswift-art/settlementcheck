import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { PenpCalculator } from '@/components/PenpCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  title: {
    absolute: 'PENP Calculator UK: Post-Employment Notice Pay (2026)',
  },
  description:
    'Calculate Post-Employment Notice Pay under ITEPA 2003 s.402D. Partition taxable notice pay from £30,000 tax-free termination compensation.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/penp-calculator/',
  },
  openGraph: {
    title: 'PENP Calculator UK: Post-Employment Notice Pay (2026)',
    description:
      'Calculate Post-Employment Notice Pay under ITEPA 2003 s.402D. Partition taxable notice pay from £30,000 tax-free termination compensation.',
    url: 'https://settlementcheck.co.uk/penp-calculator/',
    type: 'website',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/penp-calculator/', STATIC_METADATA)
}

const penpSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK Post-Employment Notice Pay (PENP) Calculator 2026',
      url: 'https://settlementcheck.co.uk/penp-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (ITEPA 2003 s.402D)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK Post-Employment Notice Pay calculator. Executes the statutory formula ((BP x D) / P) - T under ITEPA 2003 s.402D to partition taxable notice earnings from the £30,000 termination exemption.',
      creator: {
        '@type': 'Organization',
        name: 'SettlementCheck',
        url: 'https://settlementcheck.co.uk',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Post-Employment Notice Pay (PENP)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Post-Employment Notice Pay (PENP) is a statutory calculation under Section 402D of the Income Tax (Earnings and Pensions) Act 2003. It treats the portion of a termination payment representing unworked notice as taxable general earnings, preventing employers and employees from re-characterizing contractual notice pay as tax-free compensation.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the statutory PENP formula?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The statutory formula under ITEPA 2003 s.402D is ((BP x D) / P) - T, where BP is basic pay in the pre-termination pay period, D is the number of unworked days in the post-employment notice period, P is the number of days in the pay period (30.42 days for monthly salaried staff), and T is any contractual payment in lieu of notice already paid and taxed.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are settlement agreement payments above PENP tax-free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Once PENP is carved out and taxed as normal earnings under PAYE and Class 1 NICs, the remaining ex-gratia compensation and statutory redundancy pay qualify for the £30,000 exemption under Section 403 ITEPA 2003. Any balance exceeding £30,000 attracts income tax and employer Class 1A NICs, but is exempt from employee Class 1 NICs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does my employer pay for my solicitor to check the PENP clause?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Under Section 203(3) of the Employment Rights Act 1996, settlement agreements are only legally binding once certified by an independent SRA-regulated solicitor. Employers standardly contribute between £350 and £750 plus VAT directly to your solicitor to cover this advice.',
          },
        },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to calculate Post-Employment Notice Pay (PENP) under ITEPA 2003 s.402D',
      description: 'Step-by-step statutory calculation of Post-Employment Notice Pay for UK employment settlement agreements.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Determine Basic Pay (BP)',
          text: 'Basic pay in the pay period ending immediately before the trigger date, excluding bonuses, overtime, and benefits in kind under HMRC EIM12830.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Count unworked notice days (D)',
          text: 'Calculate the number of calendar days in the post-employment notice period running from the termination date to the contractual notice expiry date.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Establish pay period days (P)',
          text: 'Use 30.42 days for monthly salaried staff, or 7 days for weekly paid staff under HMRC EIM12840.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Deduct taxable termination payments (T)',
          text: 'Subtract contractual PILON or other termination payments already taxed through PAYE.',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Apply the £30,000 exemption to the ex-gratia balance',
          text: 'Allocate remaining termination compensation up to £30,000 tax-free under Section 403 ITEPA 2003.',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
        { '@type': 'ListItem', position: 2, name: 'PENP Calculator', item: 'https://settlementcheck.co.uk/penp-calculator/' },
      ],
    },
  ],
}

export default function PenpCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(penpSchema) }}
      />
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            HMRC Statutory Tax Rules • ITEPA 2003 s.402D
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            Post-Employment Notice Pay (PENP) Calculator
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Statutory partitioning of UK settlement payments into 100% taxable notice pay and genuine £30,000 tax-free ex-gratia compensation under HMRC rules.
          </p>
        </div>

        {/* Interactive Engine */}
        <div className="mb-10">
          <PenpCalculator />
        </div>

        {/* Legal Fee Reassurance Card */}
        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        {/* In-Depth Guidance Content */}
        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-6 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            How Post-Employment Notice Pay (PENP) Works in the UK
          </h2>
          <p className="text-sm leading-relaxed text-[#0B1F3A]/85">
            Prior to April 2018, employers and employees could occasionally negotiate settlement agreements where payment in lieu of notice (PILON) was classified as non-taxable compensation if the employment contract lacked a formal PILON clause. Under <strong>Finance Act 2017</strong> and <strong>Section 402D of the Income Tax (Earnings and Pensions) Act 2003</strong>, this practice was eliminated.
          </p>
          <p className="text-sm leading-relaxed text-[#0B1F3A]/85">
            The statutory rules treat all unworked notice pay as <strong>Post-Employment Notice Pay (PENP)</strong>. Regardless of how the settlement agreement terms are worded or whether PILON is expressly referenced, HMRC requires the PENP formula to be executed. The resulting PENP figure must be subjected to standard PAYE income tax and employee Class 1 National Insurance before any residual compensation qualifies for the <strong>£30,000 tax exemption under Section 403</strong>.
          </p>

          <h3 className="text-xl font-serif font-bold text-[#0B1F3A] pt-4 border-t border-[#E2DCCE]">
            Understanding the Statutory PENP Components
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">1. Basic Pay (BP)</strong>
              <span>
                Under HMRC Employment Income Manual (EIM12830), BP represents contractual basic salary in the last pay period before notice was given. Discretionary bonuses, performance commissions, overtime, and benefits in kind are strictly excluded.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">2. Unworked Notice Days (D)</strong>
              <span>
                The number of calendar days in the post-employment notice period. For employees leaving immediately with zero notice served, D equals the full notice entitlement. For employees serving partial notice, D is the unworked remainder.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">3. Pay Period Days (P)</strong>
              <span>
                Under Section 402D(5), P is 30.42 days for employees paid by monthly calendar instalments (365 / 12), or 7 days for employees paid weekly, establishing the exact daily rate of pay.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">4. Taxable Deductions (T)</strong>
              <span>
                Under Section 402D(3), T represents any termination payment already subjected to PAYE tax and Class 1 NICs (such as contractual PILON paid through payroll), preventing double taxation.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Need statutory redundancy or total compensation calculated alongside PENP?
            </span>
            <div className="flex gap-3">
              <Link
                href="/calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Main Settlement Calculator →
              </Link>
              <Link
                href="/settlement-agreement-tax-calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Tax Calculator →
              </Link>
            </div>
          </div>
        </div>

        <DynamicFaqSection pathname="/penp-calculator/" />
      </main>
      <Footer />
    </div>
  )
}
