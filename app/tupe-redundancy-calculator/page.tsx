import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'
import { getRedundancyStatutoryRows } from '@/lib/statutory-rates'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'TUPE Redundancy Calculator UK 2026 | SettlementCheck',
  },
  description:
    'Calculate TUPE redundancy pay and settlement baselines under April 2026 UK rates (£751/wk cap). Check continuous service protection and ETO rules. Free check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/tupe-redundancy-calculator/',
  },
  openGraph: {
    title: 'TUPE Redundancy Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate TUPE redundancy pay and settlement baselines under April 2026 UK rates (£751/wk cap). Check continuous service protection and ETO rules. Free check.',
    url: 'https://settlementcheck.co.uk/tupe-redundancy-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TUPE Redundancy Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate TUPE redundancy pay and settlement baselines under April 2026 UK rates (£751/wk cap). Check continuous service protection and ETO rules. Free check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/tupe-redundancy-calculator/', STATIC_METADATA)
}

const TUPE_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Combine your pre-transfer and post-transfer service',
    d: 'Under Regulation 4 of TUPE 2006, your continuous service with your original employer transfers intact to the new employer. Enter your combined years of service to calculate your statutory baseline under April 2026 rates (£751/wk GB cap).',
  },
  {
    n: '02',
    t: 'Check whether an ETO redundancy reason applies',
    d: 'Dismissals solely or principally because of a TUPE transfer are automatically unfair under Regulation 7 unless the employer proves an Economic, Technical, or Organisational (ETO) reason entailing changes in the workforce.',
  },
  {
    n: '03',
    t: 'Compare statutory redundancy, notice, and settlement terms',
    d: 'Where a transfer triggers relocation, role changes, or consultation failures (up to 13 weeks gross pay under Regulation 15), a settlement agreement often includes enhanced compensation above the statutory baseline.',
  },
]

const TUPE_FAQS: FaqItem[] = [
  {
    q: 'Does my continuous service count toward redundancy pay after a TUPE transfer?',
    a: 'Yes. Under Regulation 4 of the Transfer of Undertakings (Protection of Employment) Regulations 2006, your employment transfers with your original start date preserved. Both pre-transfer and post-transfer years count toward the 2-year qualifying period and up to 20 years of statutory redundancy pay (capped at £751/week in Great Britain from 6 April 2026).',
  },
  {
    q: 'Can I be made redundant immediately after a TUPE transfer?',
    a: 'A dismissal whose sole or principal reason is the TUPE transfer itself is automatically unfair under Regulation 7 of TUPE 2006 unless the employer can prove an Economic, Technical, or Organisational (ETO) reason entailing changes in the workforce, such as a genuine reduction in headcount or workplace relocation.',
  },
  {
    q: 'What happens if my employer fails to consult under TUPE?',
    a: 'Under Regulations 13 and 15 of TUPE 2006, both outgoing and incoming employers must inform and consult appropriate employee representatives before the transfer. Failure to consult can result in a protective award of up to 13 weeks gross actual pay per affected employee, uncapped by the £751 weekly limit.',
  },
  {
    q: 'Is TUPE redundancy or settlement compensation tax-free?',
    a: 'Statutory redundancy pay and genuine ex-gratia settlement compensation are normally free of income tax and employee National Insurance up to £30,000 under ITEPA 2003 s.403. Contractual notice pay (PILON/PENP) and accrued holiday pay remain taxable as normal earnings.',
  },
  {
    q: 'Who pays for a solicitor if I am offered a TUPE settlement agreement?',
    a: 'Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is only binding once you receive independent legal advice. Employers standardly provide a capped fee contribution (typically £350 to £500+ plus VAT) directly to your SRA-regulated solicitor upon completion, while excess or abortive work remains subject to your solicitor engagement terms.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK TUPE Redundancy & Settlement Calculator 2026',
      url: 'https://settlementcheck.co.uk/tupe-redundancy-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (TUPE 2006 & SI 2026/310)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK TUPE redundancy calculator. Calculates statutory redundancy baselines using combined pre- and post-transfer continuous service under April 2026 rates (£751/wk GB cap).',
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
      mainEntity: TUPE_FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export default function TupeRedundancyCalculatorPage() {
  const statutoryRows = getRedundancyStatutoryRows()

  return (
    <>
      <Script
        id="tupe-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(JSON_LD) }}
      />
      <HomeClient
        title={
          <>
            TUPE Redundancy{' '}
            <br />
            <span className="text-coral">Calculator UK 2026.</span>
          </>
        }
        lead="Facing redundancy after a business transfer or TUPE consultation? Calculate your statutory redundancy baseline (subject to eligibility) using your combined service under April 2026 rates (£751/wk GB cap), check £30,000 tax exemptions, and review your settlement offer."
        leadBullets={[
          {
            label: 'Combined service preserved under TUPE',
            detail: 'Under TUPE 2006 Regulation 4, your original start date transfers intact, so all pre- and post-transfer years count toward your statutory redundancy baseline (subject to eligibility).',
          },
          {
            label: 'Automatic unfair dismissal & ETO rules',
            detail: 'Transfer-related dismissals are automatically unfair under Regulation 7 unless your employer proves a genuine Economic, Technical, or Organisational (ETO) reason.',
          },
          {
            label: 'TUPE failure-to-consult compensation',
            detail: 'Failure to inform and consult under Regulation 15 can expose employers to awards of up to 13 weeks gross actual pay per affected employee.',
          },
          {
            label: 'Independent legal advice under s.203(3)',
            detail: 'Employers standardly provide a capped contribution (£350 to £500+ plus VAT) directly to your SRA-regulated solicitor upon completion; excess or abortive work remains subject to solicitor terms.',
          },
        ]}
        steps={TUPE_STEPS}
        faqItems={TUPE_FAQS}
        ctaLabel="Calculate my TUPE redundancy →"
        ctaHref="/calculator/?reason=redundancy"
        howItWorksTitle="Three steps to check your TUPE redundancy position."
        howItWorksLead="From combined continuous service to tax-free net pay. Free, no email required."
        taxSectionTitle="April 2026 statutory redundancy caps for TUPE exits"
        statutoryRows={statutoryRows}
        pageLinks={[
          { href: '/redundancy-calculator/', label: 'Statutory Redundancy Calculator' },
          { href: '/protective-award-calculator/', label: 'Protective Award Calculator' },
          { href: '/unfair-dismissal-calculator/', label: 'Unfair Dismissal Calculator' },
          { href: '/settlement-agreement-tax-calculator/', label: 'Settlement Tax Calculator' },
          { href: '/calculator/', label: 'Full Settlement Agreement Calculator' },
        ]}
      />
      <DynamicFaqSection pathname="/tupe-redundancy-calculator/" />
    </>
  )
}
