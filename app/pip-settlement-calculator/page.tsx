import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { PipExitCalculator } from '@/components/PipExitCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'

const STATIC_METADATA: Metadata = {
  title: {
    absolute: 'PIP Settlement Calculator UK: Value Your Performance Exit',
  },
  description:
    'Estimate fair settlement payouts when facing a PIP in the UK. Compare employer process costs, statutory notice, and £30,000 tax-free exit terms.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/pip-settlement-calculator/',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/pip-settlement-calculator/', STATIC_METADATA)
}

const pipSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK PIP Settlement Agreement Calculator (2026)',
      url: 'https://settlementcheck.co.uk/pip-settlement-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (ERA 1996 s.111A)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK PIP settlement agreement calculator. Valuing exit packages during Performance Improvement Plans and Section 111A protected conversations, comparing employer capability process costs, statutory notice, and £30,000 tax-free exit terms under April 2026 statutory rates.',
      featureList: [
        'Assessment of employer capability process costs under Acas Code of Practice 1',
        'Confidential Section 111A ERA 1996 protected conversation valuation',
        'Statutory notice pay (PILON) taxation calculation under ITEPA 2003 s.402D',
        'Tax-free termination allowance modelling up to £30,000 under ITEPA 2003 s.403',
        'April 2026 statutory weekly pay cap (£751) and £123,543 unfair dismissal limit alignment',
      ],
      screenshot: 'https://settlementcheck.co.uk/og-image.png',
      publisher: SETTLEMENT_CHECK_PUBLISHER,
      creator: {
        '@type': 'Organization',
        name: 'SettlementCheck',
        url: 'https://settlementcheck.co.uk',
      },
    },
    {
      '@type': 'HowTo',
      name: 'How to value and negotiate a PIP settlement agreement exit',
      description: 'Step-by-step statutory valuation of settlement packages when facing a Performance Improvement Plan in the UK.',
      publisher: SETTLEMENT_CHECK_PUBLISHER,
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Calculate employer capability process savings',
          text: 'Assess the salary, management hours, and procedural costs saved by the employer avoiding a 60 to 90-day capability process under Acas Code 1.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Calculate contractual notice pay (PILON)',
          text: 'Notice pay is legally payable in full under ERA 1996 s.86 and subject to PAYE tax and National Insurance under Section 402D ITEPA 2003.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Apply the £30,000 tax-free ex-gratia compensation exemption',
          text: 'Under Section 403 of ITEPA 2003, genuine termination compensation for loss of office up to £30,000 is 100% free of income tax and employee NICs.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Ensure independent legal advice contribution',
          text: 'Under Section 203(3) ERA 1996, the settlement waiver is void without independent solicitor certification. Employers standardly contribute £500 to £1,000+ VAT directly to your solicitor upon completion.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      publisher: SETTLEMENT_CHECK_PUBLISHER,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can an employer offer a settlement agreement while I am on a PIP?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Under Section 111A of the Employment Rights Act 1996, employers can initiate confidential pre-termination negotiations (a protected conversation) during a PIP to discuss an agreed exit with ex-gratia compensation and full notice pay.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is a PIP settlement payout tax-free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ex-gratia compensation for loss of office up to £30,000 is exempt from income tax and employee National Insurance under Section 403 of ITEPA 2003. Contractual notice pay (PILON) and accrued holiday pay are always taxed as ordinary employment earnings.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does my employer pay for my solicitor to advise on a PIP settlement agreement?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Under Section 203(3) of the Employment Rights Act 1996, independent legal advice from an SRA-regulated solicitor is required to make the settlement waiver legally binding. Employers standardly provide a capped fee contribution (typically £500 to £1,000 plus VAT) paid directly to your chosen solicitor upon completion.',
          },
        },
      ],
    },
  ],
}

export default function PipSettlementCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pipSchema) }}
      />
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            ERA 1996 s.111A Protected Discussions • Free Calculator • No Email Gating
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            PIP Settlement Agreement Calculator
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Placed on a Performance Improvement Plan or offered a protected conversation? Valuing exit packages based on employer process cost avoidance, statutory notice, and statutory caps.
          </p>
        </div>

        {/* Interactive Engine */}
        <div className="mb-10">
          <PipExitCalculator />
        </div>

        {/* Legal Fee Shield Reassurance */}
        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        {/* Informational Guidance Content */}
        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-6 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            Why UK Employers Offer Settlement Agreements During a PIP
          </h2>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            A Performance Improvement Plan (PIP) is frequently used by HR departments not to rehabilitate performance, but to build a documentary trail to justify a capability dismissal. However, executing a legally robust capability process under the <strong>Acas Code of Practice 1 on Disciplinary and Grievance Procedures</strong> takes 60 to 90 days, demands substantial senior management hours, and exposes the employer to costly Employment Tribunal litigation under Section 98 of the Employment Rights Act 1996.
          </p>
          <p className="text-body leading-relaxed text-[#0B1F3A]/85">
            Under <strong>Section 111A of the Employment Rights Act 1996</strong>, employers can initiate confidential pre-termination negotiations (a &quot;protected conversation&quot;) to propose an agreed settlement exit. By calculating what the company saves in salary, management overhead, and tribunal risk, employees gain strong standing to negotiate fair ex-gratia compensation and full legal fee coverage.
          </p>

          <h3 className="text-xl font-serif font-bold text-[#0B1F3A] pt-4 border-t border-[#E2DCCE]">
            Key Negotiation Components for a PIP Settlement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">1. Full Notice Pay (PILON)</strong>
              <span>
                Contractual or statutory notice pay is legally payable in full under ERA 1996 s.86. Under Section 402D ITEPA 2003, Post-Employment Notice Pay is subject to PAYE tax and National Insurance deductions.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">2. Tax-Free Ex-Gratia Uplift</strong>
              <span>
                Under Section 403 ITEPA 2003, up to £30,000 of compensation for loss of office is completely free of income tax and employee Class 1 NICs. Typical commercial PIP uplifts range from 1 to 3.5 months&apos; pay.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">3. Employer-Funded Legal Advice</strong>
              <span>
                Under Section 203(3) ERA 1996, statutory claim waivers are unenforceable without advice from an independent solicitor. Employers standardly contribute £500 to £1,000 + VAT directly to your chosen solicitor.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">4. Agreed Reference &amp; Clean Exit</strong>
              <span>
                Settlement agreements standardly incorporate an agreed factual reference and mutual non-derogatory undertakings, protecting professional reputation for future roles.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Reviewing draft settlement agreement terms with an SRA specialist.
            </span>
            <div className="flex gap-3">
              <Link
                href="/settlement-agreement-review/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Review Settlement Agreement Clauses →
              </Link>
              <Link
                href="/calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Main Settlement Calculator →
              </Link>
            </div>
          </div>
        </div>
        <DynamicFaqSection pathname="/pip-settlement-calculator/" />
      </main>
      <Footer />
    </div>
  )
}
