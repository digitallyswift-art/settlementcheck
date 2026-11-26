import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'
import { getGeneralStatutoryRows } from '@/lib/statutory-rates'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Ill-Health Dismissal Calculator UK 2026 | SettlementCheck',
  },
  description:
    'Calculate ill-health dismissal notice pay, settlement baselines, and £30,000 tax-free exits under 2026 UK rates. Check disability & Vento rights. Free check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/ill-health-dismissal-calculator/',
  },
  openGraph: {
    title: 'Ill-Health Dismissal Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate ill-health dismissal notice pay, settlement baselines, and £30,000 tax-free exits under 2026 UK rates. Check disability & Vento rights. Free check.',
    url: 'https://settlementcheck.co.uk/ill-health-dismissal-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ill-Health Dismissal Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate ill-health dismissal notice pay, settlement baselines, and £30,000 tax-free exits under 2026 UK rates. Check disability & Vento rights. Free check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/ill-health-dismissal-calculator/', STATIC_METADATA)
}

const ILL_HEALTH_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Check your full statutory notice pay entitlement',
    d: 'Even if you have exhausted contractual sick pay, Section 87 of the Employment Rights Act 1996 can entitle you to full normal pay during your statutory notice period (up to 12 weeks) depending on how much longer your contractual notice is than statutory notice.',
  },
  {
    n: '02',
    t: 'Factor in Equality Act 2010 & Vento band exposure',
    d: 'If your health condition qualifies as a disability under Equality Act 2010 s.6, dismissal without reasonable adjustments (s.20) or objective justification (s.15) carries uncapped compensation plus April 2026 Vento injury-to-feelings bands (£1,300 to £62,900+).',
  },
  {
    n: '03',
    t: 'Separate taxable notice pay from £30,000 tax-free compensation',
    d: 'Notice pay (PILON/PENP) is taxed as earnings under ITEPA 2003 s.402D, while genuine ex-gratia settlement compensation up to £30,000 is normally tax-free under s.403.',
  },
]

const ILL_HEALTH_FAQS: FaqItem[] = [
  {
    q: 'What pay am I entitled to on an ill-health capability dismissal?',
    a: 'On an ill-health capability dismissal you are entitled to accrued untaken holiday pay and statutory or contractual notice pay. Under Section 87 of the Employment Rights Act 1996, if your contractual notice is less than 1 week longer than your statutory notice, you are generally entitled to full normal pay during statutory notice even if your sick pay has run out. Statutory redundancy pay is not automatically triggered by capability dismissal unless the role is redundant.',
  },
  {
    q: 'How does disability discrimination affect an ill-health settlement agreement?',
    a: 'If your condition has a substantial, long-term adverse effect under Section 6 of the Equality Act 2010, your employer must consider reasonable adjustments (s.20) and justify any dismissal under Section 15. Because disability discrimination awards are uncapped and include April 2026 Vento injury-to-feelings bands (£1,300 to £62,900+), employers frequently offer an enhanced settlement agreement.',
  },
  {
    q: 'Is an ill-health or disability settlement payout tax-free?',
    a: 'Under Section 403 of ITEPA 2003, up to £30,000 of genuine ex-gratia termination compensation is free of income tax and employee National Insurance. In rare cases involving a medically certified injury or disability that prevents you from performing your job under ITEPA 2003 s.406, payments can be wholly exempt, though HMRC scrutinizes this strictly and notice pay (PENP) remains taxable.',
  },
  {
    q: 'Should I check permanent health insurance (PHI) before signing an ill-health settlement?',
    a: 'Yes. Signing a settlement agreement terminates your employment and can end valuable income protection (PHI) or ill-health early retirement pension rights. An independent SRA-regulated solicitor should review how your draft agreement affects any active or prospective PHI or pension claim before you sign.',
  },
  {
    q: 'Who pays for my solicitor on an ill-health settlement agreement?',
    a: 'Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is only binding once certified by an independent adviser. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion, while excess or abortive work remains subject to your solicitor engagement terms.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK Ill-Health Dismissal & Settlement Calculator 2026',
      url: 'https://settlementcheck.co.uk/ill-health-dismissal-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (ERA 1996 & EqA 2010)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK ill-health dismissal and settlement calculator. Estimates statutory notice pay, unfair dismissal baselines (£123,543 cap), Vento bands, and £30,000 tax exemptions for 2026.',
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
      mainEntity: ILL_HEALTH_FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export default function IllHealthDismissalCalculatorPage() {
  const statutoryRows = getGeneralStatutoryRows()

  return (
    <>
      <Script
        id="ill-health-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(JSON_LD) }}
      />
      <HomeClient
        title={
          <>
            Ill-Health Dismissal{' '}
            <br />
            <span className="text-coral">Calculator UK 2026.</span>
          </>
        }
        lead="Facing capability dismissal on long-term sick leave or offered a settlement agreement? Check your statutory notice rights (ERA 1996 s.87), disability & Vento band baselines, and £30,000 tax-free take-home pay in 60 seconds."
        leadBullets={[
          {
            label: 'Full notice pay even on reduced sick pay',
            detail: 'Under ERA 1996 s.87, employees whose contractual notice does not exceed statutory notice by at least 1 week are generally entitled to full normal pay during statutory notice.',
          },
          {
            label: 'Equality Act 2010 & April 2026 Vento bands',
            detail: 'Where a health condition amounts to a disability, tribunals can award uncapped financial loss plus Vento injury-to-feelings (£1,300 to £62,900+ from April 2026).',
          },
          {
            label: 'Protect PHI & ill-health pension rights',
            detail: 'Ending employment can forfeit income protection (PHI) or ill-health pension benefits, so terms should always be checked with an independent solicitor before signing.',
          },
          {
            label: 'Independent legal advice under s.203(3)',
            detail: 'Employers standardly provide a capped fee contribution (£350 to £500+ plus VAT) directly to your SRA-regulated solicitor upon completion; excess or abortive work remains subject to solicitor terms.',
          },
        ]}
        steps={ILL_HEALTH_STEPS}
        faqItems={ILL_HEALTH_FAQS}
        ctaLabel="Check my ill-health settlement →"
        ctaHref="/calculator/?reason=ill_health"
        howItWorksTitle="Three steps to evaluate an ill-health exit offer."
        howItWorksLead="From statutory notice and disability baselines to net take-home pay. Free, no email required."
        taxSectionTitle="April 2026 statutory rates for ill-health & capability exits"
        statutoryRows={statutoryRows}
        pageLinks={[
          { href: '/guides/settlement-agreement-sick-leave/', label: 'Settlement Agreement on Sick Leave Guide' },
          { href: '/unfair-dismissal-calculator/', label: 'Unfair Dismissal Calculator' },
          { href: '/penp-calculator/', label: 'PILON & PENP Notice Pay Calculator' },
          { href: '/settlement-agreement-tax-calculator/', label: 'Settlement Tax Calculator' },
          { href: '/calculator/', label: 'Full Settlement Agreement Calculator' },
        ]}
      />
      <DynamicFaqSection pathname="/ill-health-dismissal-calculator/" />
    </>
  )
}
