import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Whistleblowing Settlement Agreements UK | 2026 Guide',
  description:
    'Offered a whistleblowing settlement? Learn your 2026 rights: uncapped tribunal compensation, void gagging clauses, day-one rights, and negotiation steps.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/whistleblowing-settlement-agreements/',
  },
  openGraph: {
    title: 'Whistleblowing Settlement Agreements UK | 2026 Guide',
    description:
      'Offered a whistleblowing settlement? Learn your 2026 rights: uncapped tribunal compensation, void gagging clauses, day-one rights, and negotiation steps.',
    url: 'https://settlementcheck.co.uk/guides/whistleblowing-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whistleblowing Settlement Agreements UK | 2026 Guide',
    description:
      'Offered a whistleblowing settlement? Learn your 2026 rights: uncapped tribunal compensation, void gagging clauses, day-one rights, and negotiation steps.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/whistleblowing-settlement-agreements/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'How is a whistleblowing settlement valued in the UK?',
    a: 'Unlike ordinary unfair dismissal, which is capped at £123,543 or 52 weeks of pay, whistleblowing compensation is uncapped under Section 124(1A) ERA 1996. Settlements reflect past and projected future financial loss, plus an award for injury to feelings under the 2026/27 Vento bands (£1,300 to over £62,900) for pre-dismissal detriment.',
  },
  {
    q: 'Can my employer use a non-disclosure agreement (NDA) to gag me from whistleblowing?',
    a: 'No. Under Section 43J of the Employment Rights Act 1996, any confidentiality clause or NDA that attempts to stop a worker making a protected disclosure is void and unenforceable. SRA Warning Notices also prohibit solicitors from drafting clauses that suppress disclosures to regulators or the police.',
  },
  {
    q: 'Can my employer have a protected conversation to negotiate my exit after I blew the whistle?',
    a: 'No. Section 111A of the Employment Rights Act 1996 only shields pre-termination negotiations in ordinary unfair dismissal claims. Under Section 111A(4), statutory confidentiality does not apply to whistleblowing or discrimination, so those talks are admissible in an employment tribunal.',
  },
  {
    q: 'Do I need two years of service to claim whistleblowing dismissal or negotiate a settlement?',
    a: 'No. Dismissal for making a protected disclosure is automatically unfair under Section 103A of the Employment Rights Act 1996. Under Section 108(3)(ff), you have full statutory protection from your first day of employment.',
  },
  {
    q: 'How are whistleblowing settlement payments taxed in 2026?',
    a: 'Under Section 403 of ITEPA 2003, the first £30,000 of genuine ex-gratia compensation for loss of employment is tax-free. Pre-dismissal injury to feelings under Section 47B can also be paid tax-free under Section 406, while notice pay, garden leave, and PILON are taxed as wages under Section 402D.',
  },
  {
    q: 'Does my employer pay for my independent legal advice?',
    a: 'Under Section 203(3) ERA 1996, a settlement agreement is only binding if you receive independent legal advice. Employers standardly contribute £350 to £500+ plus VAT (often higher for complex whistleblowing matters) directly to your solicitor upon completion, with any excess or abortive work subject to your solicitor engagement terms.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can withdraw it before signature. ACAS Code 4 recommends 10 calendar days to consider an initial written offer, though this is guidance rather than a strict legal right.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Whistleblowing Settlement Agreements UK 2026: Rights & Payouts',
  url: 'https://settlementcheck.co.uk/guides/whistleblowing-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-24',
  dateModified: '2026-10-24',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
  },
  reviewedBy: {
    '@type': 'Organization',
    name: 'SettlementCheck Legal Research Desk',
    url: 'https://settlementcheck.co.uk/how-it-works/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
    logo: {
      '@type': 'ImageObject',
      url: 'https://settlementcheck.co.uk/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/whistleblowing-settlement-agreements/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 43B',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/43B',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 43J',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/43J',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 47B',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/47B',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 103A',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/103A',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 124(1A)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/124',
    },
  ],
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 6V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

export default function WhistleblowingSettlementAgreementsGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Whistleblowing Settlements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Whistleblowing Settlement Agreements UK 2026: Rights &amp; Payouts
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 Part IVA &amp; SI 2026/310
            </p>
            <p className="sc-lead leading-relaxed">
              Offered a settlement agreement after raising workplace concerns? Whistleblowing dismissal is automatically unfair from day one, compensation is uncapped, and gagging clauses are void. Check your statutory baseline in 60 seconds with no email required, see what is taxed as wages, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Check your notice pay, £30,000 tax-free exemption, and statutory baseline before discussing uncapped whistleblowing losses with a solicitor."
              disputeType="whistleblowing"
              statutoryPills={[
                { label: 'Compensatory Cap', value: 'Uncapped', statute: 'ERA 1996 s.124(1A)' },
                { label: 'Qualifying Service', value: 'Day-One Right', statute: 'ERA 1996 s.108(3)(ff)' },
                { label: 'Tax-Free Shield', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
              ]}
              initialSalary={55000}
              initialYears={3}
              initialAge={39}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Core facts callout box */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5 sm:p-6 mb-6">
              <p className="text-sm font-semibold text-ink uppercase tracking-wider mb-3">
                Statutory Quick Answer: Whistleblowing Settlement Rights 2026
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Whistleblowing dismissal compensation is uncapped under Section 124(1A) ERA 1996. The standard £123,543 cap does not apply.',
                  'Zero continuous service is required. You have day-one protection against automatically unfair dismissal under Section 103A and Section 108(3)(ff).',
                  'Gagging clauses are void under Section 43J ERA 1996. No settlement agreement or NDA can stop you reporting wrongdoing to regulators or police.',
                  'Pre-dismissal detriment entitles you to injury to feelings awards under the Ninth Addendum Vento bands (£1,300 to over £62,900).',
                  'Section 111A protected conversation secrecy does not apply to whistleblowing exit discussions.',
                  'Employers standardly contribute £350 to £500+ plus VAT (and often more for complex whistleblowing matters) directly to your solicitor upon completion under Section 203(3). Any excess or abortive work is subject to your solicitor engagement terms.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Compensatory Cap</span>
                <span className="text-lg font-bold text-coral font-mono">Uncapped</span>
                <span className="text-[11px] text-muted block mt-1">s.124(1A) ERA 1996</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Qualifying Service</span>
                <span className="text-lg font-bold text-coral font-mono">0 Days</span>
                <span className="text-[11px] text-muted block mt-1">Day-one right</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Vento Bands</span>
                <span className="text-lg font-bold text-coral font-mono">£1.3k - £62.9k+</span>
                <span className="text-[11px] text-muted block mt-1">Ninth Addendum</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Gagging Clauses</span>
                <span className="text-lg font-bold text-coral font-mono">Void</span>
                <span className="text-[11px] text-muted block mt-1">s.43J ERA 1996</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: What counts as a protected disclosure */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. What counts as a protected disclosure under UK law?</h2>
            <p className="sc-body mb-4">
              Whistleblowing protections come from the Public Interest Disclosure Act 1998 (PIDA), incorporated into Part IVA (Sections 43A to 43L) of the Employment Rights Act 1996.
            </p>
            <p className="sc-body mb-4">
              To gain legal protection, you must make a &quot;qualifying disclosure&quot;. Under Section 43B(1), you must reasonably believe the information shows one or more of six statutory categories:
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  label: 'Criminal Offences',
                  desc: 'A criminal offence has been, is being, or is likely to be committed (such as fraud, bribery, or theft).',
                },
                {
                  label: 'Breach of Legal Obligations',
                  desc: 'A person or organisation has failed, is failing, or is likely to fail to comply with a legal duty.',
                },
                {
                  label: 'Miscarriages of Justice',
                  desc: 'A miscarriage of justice has occurred, is occurring, or is likely to occur.',
                },
                {
                  label: 'Health & Safety Dangers',
                  desc: 'The health or safety of any individual has been, is being, or is likely to be endangered.',
                },
                {
                  label: 'Environmental Damage',
                  desc: 'The environment has been, is being, or is likely to be damaged.',
                },
                {
                  label: 'Deliberate Concealment',
                  desc: 'Information showing any of the five categories above has been, is being, or is likely to be deliberately concealed.',
                },
              ].map((item, idx) => (
                <div key={item.label} className="p-4 rounded-xl border border-rule bg-paper">
                  <span className="text-xs font-mono font-semibold text-coral block mb-1">
                    Category {idx + 1}: {item.label}
                  </span>
                  <p className="sc-body">{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-base font-semibold text-ink mb-3">The Public Interest Test (Chesterton Rules)</h3>
            <p className="sc-body mb-4">
              Under <em>Chesterton Global Ltd v Nurmohamed [2017] EWCA Civ 979</em>, you must reasonably believe the disclosure is in the public interest. Purely personal contract complaints do not qualify unless they affect a wider group.
            </p>
            <p className="sc-body mb-6">
              Tribunals consider how many people are affected, the nature of the impact, whether the wrongdoing was deliberate, and the size and identity of the employer.
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5">
              <div className="flex items-start gap-3">
                <AlertIcon />
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Disclosures to Prescribed Regulators</p>
                  <p className="sc-body text-muted leading-relaxed">
                    Under Section 43F, you can make protected disclosures directly to prescribed watchdogs such as the FCA, HSE, CQC, Charity Commission, ICO, or Environment Agency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Comparison Table */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. How do whistleblowing claims differ from ordinary unfair dismissal?</h2>
            <p className="sc-body mb-6">
              Employers sometimes open settlement talks using standard redundancy or ordinary dismissal benchmarks. The statutory differences are significant:
            </p>

            <div className="rounded-xl border border-rule overflow-hidden bg-white shadow-sm mb-6">
              <table className="w-full text-xs">
                <caption className="sr-only">Comparison of ordinary unfair dismissal versus whistleblowing claims for 2026.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Feature</th>
                    <th className="text-left px-4 py-3 font-medium">Ordinary Unfair Dismissal</th>
                    <th className="text-left px-4 py-3 font-medium">Whistleblowing Claim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  {[
                    [
                      'Compensatory Cap',
                      'Lower of £123,543 or 52 weeks\' gross pay (SI 2026/310)',
                      'Completely uncapped (ERA 1996 s.124(1A))',
                    ],
                    [
                      'Qualifying Service',
                      '2 continuous years required (ERA 1996 s.108(1))',
                      '0 days (Day-one right under s.108(3)(ff))',
                    ],
                    [
                      'Detriment & Injury to Feelings',
                      'Not available (Addis v Gramophone rule)',
                      'Available under Ninth Addendum Vento bands (£1,300 to £62,900+)',
                    ],
                    [
                      'Pre-Termination Discussions',
                      'Shielded under Section 111A ERA 1996',
                      'Unprotected (Section 111A does not apply; admissible)',
                    ],
                    [
                      'Personal Liability for Managers',
                      'Employer entity only',
                      'Named managers and co-workers personally liable (s.47B(1A))',
                    ],
                    [
                      'Non-Disclosure Agreements (NDAs)',
                      'Permitted within commercial limits',
                      'Gagging clauses void by statute (s.43J ERA 1996 & SRA warnings)',
                    ],
                    [
                      'Basic Award Calculation',
                      'Capped at £751/week, max £22,530',
                      'Statutory basic award plus uncapped future financial loss',
                    ],
                  ].map(([feature, ordinary, whistleblowing], idx) => (
                    <tr key={feature} className={idx % 2 === 0 ? 'bg-white' : 'bg-paper'}>
                      <td className="px-4 py-3 font-medium text-ink">{feature}</td>
                      <td className="px-4 py-3 text-muted">{ordinary}</td>
                      <td className="px-4 py-3 font-semibold text-coral-ink">{whistleblowing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="sc-body text-muted">
              Under <em>Royal Mail Group Ltd v Jhuti [2019] UKSC 55</em>, an employment tribunal can award full future loss of earnings and career stigma, which increases the employer&apos;s financial exposure.
            </p>
          </div>
        </section>

        {/* Section 3: Whistleblower Detriment & Vento Bands */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. What are the 2026 Vento bands for whistleblower detriment?</h2>
            <p className="sc-body mb-4">
              Under Section 47B of the Employment Rights Act 1996, workers have the right not to be subjected to any detriment for making a protected disclosure.
            </p>
            <p className="sc-body mb-6">
              Detriment includes exclusion from meetings, demotion, sudden poor ratings, unfounded Performance Improvement Plans (PIPs), suspension, or disciplinary action.
            </p>

            <h3 className="text-base font-semibold text-ink mb-3">Injury to Feelings: Ninth Addendum Vento Rates (April 2026)</h3>
            <p className="sc-body mb-4">
              In detriment claims under Section 47B, tribunals award injury to feelings using the Vento bands, updated for claims presented on or after 6 April 2026:
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {[
                {
                  band: 'Lower Band',
                  range: '£1,300 to £12,600',
                  description:
                    'Applies to isolated incidents or less serious detriment, such as a one-off retaliatory remark or temporary exclusion.',
                  color: 'border-l-4 border-sage',
                },
                {
                  band: 'Middle Band',
                  range: '£12,600 to £37,700',
                  description:
                    'Covers serious cases not meriting the upper band, such as unjustified suspension, targeted performance reviews, or persistent exclusion.',
                  color: 'border-l-4 border-amber',
                },
                {
                  band: 'Upper Band',
                  range: '£37,700 to £62,900',
                  description:
                    'Applies to prolonged harassment, acute victimisation harming professional standing, or conduct causing psychiatric injury.',
                  color: 'border-l-4 border-coral',
                },
                {
                  band: 'Exceptional Cases',
                  range: 'Exceeding £62,900',
                  description:
                    'Reserved for rare cases where prolonged victimisation permanently ends a specialist career or causes severe long-term illness.',
                  color: 'border-l-4 border-crimson',
                },
              ].map(({ band, range, description, color }) => (
                <div key={band} className={`rounded-xl border border-rule bg-paper p-5 ${color}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h4 className="text-base font-semibold text-ink">{band}</h4>
                    <span className="text-sm font-bold text-coral-ink font-mono">{range}</span>
                  </div>
                  <p className="sc-body">{description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-rule bg-paper p-5">
              <h4 className="text-sm font-semibold text-ink mb-1">Personal Liability of Managers (Section 47B(1A))</h4>
              <p className="sc-body text-muted leading-relaxed">
                Under Section 47B(1A) ERA 1996, individual managers and directors who subject a worker to detriment can be named personally in tribunal claims, while the employer is vicariously liable under Section 47B(1B).
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Void Gagging Clauses & SRA Notices */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">4. Can an NDA or gagging clause stop me whistleblowing?</h2>
            <p className="sc-body mb-4">
              Employers often include strict confidentiality clauses and non-disclosure agreements (NDAs) in settlement drafts. However, Section 43J of the Employment Rights Act 1996 sets an absolute statutory limit:
            </p>

            <blockquote className="rounded-xl border border-rule bg-white p-5 my-6 italic text-sm text-ink/90 border-l-4 border-l-coral leading-relaxed">
              &quot;Any provision in an agreement to which this section applies is void in so far as it purports to preclude the worker from making a protected disclosure.&quot;
            </blockquote>

            <p className="sc-body mb-4">
              Any clause or warranty that tries to stop you making a protected disclosure is legally void and unenforceable.
            </p>

            <h3 className="text-base font-semibold text-ink mb-3">SRA Warning Notices on Non-Disclosure Agreements</h3>
            <p className="sc-body mb-4">
              The Solicitors Regulation Authority (SRA) issues formal Warning Notices governing NDAs. Solicitors face disciplinary action if they draft agreements that:
            </p>

            <ul className="flex flex-col gap-2.5 mb-6">
              {[
                'Attempt to prevent or discourage reporting wrongdoing to regulators or law enforcement.',
                'Require workers to notify their employer before reporting matters to the police or statutory bodies.',
                'Fail to make clear that reporting protected concerns to prescribed bodies remains permitted.',
                'Include warranties stating the worker has not reported misconduct to regulatory bodies.',
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-2"></span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl border border-rule bg-white">
              <p className="sc-body text-muted leading-relaxed">
                <strong className="text-ink">What your settlement agreement can legitimately restrict:</strong> Parties can agree mutual non-disparagement, commercial confidentiality over intellectual property, non-compete terms, and keeping the financial sum private, provided Part IVA ERA 1996 carve-outs are explicit.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Why Section 111A does not apply */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">5. Are whistleblowing exit talks protected under Section 111A?</h2>
            <p className="sc-body mb-4">
              In standard exits, employers rely on Section 111A of the Employment Rights Act 1996 to hold confidential pre-termination discussions. Under Section 111A(4), that protection applies only to ordinary unfair dismissal claims.
            </p>
            <p className="sc-body mb-6">
              Section 111A does not apply to:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Whistleblowing Dismissal', law: 's.103A ERA 1996' },
                { title: 'Whistleblowing Detriment', law: 's.47B ERA 1996' },
                { title: 'Unlawful Discrimination', law: 'Equality Act 2010' },
                { title: 'Breach of Contract', law: 'Wrongful dismissal claims' },
              ].map((item) => (
                <div key={item.title} className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-sm font-semibold text-ink block mb-1">{item.title}</span>
                  <span className="text-xs font-mono text-muted">{item.law} (Not protected)</span>
                </div>
              ))}
            </div>

            <p className="sc-body mb-4">
              If your manager labels an exit meeting a &quot;protected conversation&quot; after you raised protected concerns, Section 111A does not shield it.
            </p>
            <p className="sc-body mb-6">
              Notes and emails from that meeting can be admitted in tribunal evidence, and improper behaviour such as ultimatums removes any common-law without prejudice protection.
            </p>

            <ReviewCallout
              title="Handed an unexpected settlement agreement after speaking out?"
              description="Check your draft clauses confidentially before responding. Verify your uncapped compensation entitlement, void gagging provisions, and legal fee funding."
              ctaText="Check my offer now →"
              badge="Whistleblower Protection Review"
            />
          </div>
        </section>

        {/* Section 6: Worked Calculation Example */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">6. How is a whistleblowing settlement taxed and structured?</h2>
            <p className="sc-body mb-4">
              Consider a Senior Compliance Specialist earning £65,000 gross per year (£5,416.67 per month) with 18 months of service.
            </p>
            <p className="sc-body mb-6">
              After reporting regulatory failures, they were removed from client accounts and placed on a formal performance plan before receiving an exit offer:
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 sm:p-6 mb-6 shadow-sm">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-4 border-b border-rule pb-2">
                Settlement Package Financial Breakdown
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-start pb-3 border-b border-rule">
                  <div>
                    <span className="font-semibold text-ink block">1. Contractual Notice Pay (PILON)</span>
                    <span className="text-xs text-muted">3 months contractual notice under s.402D ITEPA 2003</span>
                  </div>
                  <span className="font-mono font-bold text-ink">£16,250</span>
                </div>

                <div className="flex justify-between items-start pb-3 border-b border-rule">
                  <div>
                    <span className="font-semibold text-ink block">2. Injury to Feelings (Detriment Claim)</span>
                    <span className="text-xs text-muted">Middle Vento band for pre-dismissal victimisation (s.406 ITEPA)</span>
                  </div>
                  <span className="font-mono font-bold text-ink">£18,000</span>
                </div>

                <div className="flex justify-between items-start pb-3 border-b border-rule">
                  <div>
                    <span className="font-semibold text-ink block">3. Ex-Gratia Termination Compensation</span>
                    <span className="text-xs text-muted">Reflecting future financial loss and career stigma (s.403 ITEPA)</span>
                  </div>
                  <span className="font-mono font-bold text-ink">£40,000</span>
                </div>

                <div className="flex justify-between items-start pb-3 border-b border-rule">
                  <div>
                    <span className="font-semibold text-ink block">4. Employer Legal Fee Contribution</span>
                    <span className="text-xs text-muted">Paid directly to employee&apos;s independent solicitor (s.203(3) ERA)</span>
                  </div>
                  <span className="font-mono font-bold text-ink">£1,200 + VAT</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-ink text-base">Total Package Sum</span>
                  <span className="font-mono font-bold text-coral text-lg">£75,450 + VAT</span>
                </div>
              </div>
            </div>

            <h3 className="text-base font-semibold text-ink mb-3">Tax Treatment &amp; April 2026 Rules</h3>
            <p className="sc-body mb-4">
              HMRC splits termination payments into taxable earnings and tax-free compensation:
            </p>

            <ul className="flex flex-col gap-2.5 mb-6 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-2"></span>
                <span>
                  <strong>Notice Pay &amp; Garden Leave (£16,250):</strong> Taxed as wages under Post-Employment Notice Pay (PENP) rules (Section 402D ITEPA 2003), with income tax and National Insurance deducted.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-2"></span>
                <span>
                  <strong>Pre-Dismissal Injury to Feelings (£18,000):</strong> Under Section 406 ITEPA 2003, compensation genuinely allocated to pre-termination detriment is tax-free outside the £30,000 cap.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-2"></span>
                <span>
                  <strong>Ex-Gratia Loss of Office (£40,000):</strong> The first £30,000 is tax-free under Section 403 ITEPA 2003. The remaining £10,000 incurs income tax at your marginal rate and 0% employee National Insurance (employer pays 15.0% Class 1A NIC).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-2"></span>
                <span>
                  <strong>Legal Contribution (£1,200 + VAT):</strong> Paid tax-free directly to your solicitor upon completion and does not reduce your £30,000 allowance.
                </span>
              </li>
            </ul>

            <div className="rounded-xl border border-rule bg-white p-4">
              <p className="sc-body text-muted">
                <strong>Why service duration mattered:</strong> With 18 months of service, ordinary unfair dismissal would not apply. Because whistleblowing is a day-one statutory right with uncapped compensation, the two-year bar did not limit the outcome.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Practical Steps */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">7. How does the whistleblowing settlement process work?</h2>
            <p className="sc-body mb-6">
              When reviewing a settlement draft after making a protected disclosure, six practical stages apply:
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  step: 'Step 1: Organise a Chronological Evidence Trail',
                  text: 'Keep a clear timeline of dates, meetings, and emails showing when you raised your concerns and what happened afterwards, complying with workplace data rules.',
                },
                {
                  step: 'Step 2: Check Section 43B and Public Interest Criteria',
                  text: 'Check that your disclosure falls within one of the six Section 43B categories and satisfies the Chesterton public interest test.',
                },
                {
                  step: 'Step 3: Document Detriment Under Section 47B',
                  text: 'Note any negative changes following your disclosure, such as exclusion from meetings, unfair performance critiques, or cancelled projects, which relate to Vento injury to feelings.',
                },
                {
                  step: 'Step 4: Model Your Financial Exposure',
                  text: 'Factor in lost earnings, pension contributions, bonus rights, and expected job-search time, including career stigma under Jhuti where relevant.',
                },
                {
                  step: 'Step 5: Review Non-Financial Terms and Timelines',
                  text: 'Check agreed reference wording, non-compete restrictions, and explicit Part IVA regulatory carve-outs. ACAS Code 4 recommends 10 calendar days to consider an offer as guidance, and under contract law a counter-proposal rejects the original offer.',
                },
                {
                  step: 'Step 6: Take Independent Legal Advice',
                  text: 'Under Section 203(3) ERA 1996, a settlement agreement is not binding without independent legal advice. Employers standardly contribute £350 to £500+ plus VAT (often higher for complex whistleblowing matters) upon completion, with any excess or abortive work subject to your solicitor engagement terms.',
                },
              ].map(({ step, text }) => (
                <div key={step} className="p-5 rounded-xl border border-rule bg-paper">
                  <h3 className="text-sm font-semibold text-ink mb-1">{step}</h3>
                  <p className="sc-body text-muted leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Independent Resources */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Where can I get official independent guidance?</h2>
            <p className="sc-body mb-6">
              If you raised concerns at work and need free, confidential guidance, contact these statutory bodies and independent organisations:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'Protect (Whistleblowing Charity)',
                  desc: 'Free, confidential advice helpline on 020 3117 2520 from UK whistleblowing legal experts.',
                  url: 'https://protect-advice.org.uk',
                },
                {
                  name: 'ACAS (Advisory, Conciliation and Arbitration Service)',
                  desc: 'Free statutory guidance on employment rights and early conciliation support.',
                  url: 'https://www.acas.org.uk',
                },
                {
                  name: 'Solicitors Regulation Authority (SRA)',
                  desc: 'Official guidance and Warning Notices on non-disclosure agreements and ethical standards.',
                  url: 'https://www.sra.org.uk',
                },
                {
                  name: 'GOV.UK Employment Tribunals',
                  desc: 'Official government guidance on lodging tribunal claims, procedural rules, and hearings.',
                  url: 'https://www.gov.uk/employment-tribunals',
                },
              ].map(({ name, desc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-rule rounded-lg p-5 bg-paper-2/40 hover:border-ink transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-1">{name}</h3>
                    <p className="sc-body text-muted mb-3">{desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-coral-ink">Visit official resource &rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              See your statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculator/?whistleblowing=yes" className="btn-accent">
                Check my offer now →
              </Link>
              <Link href="/redundancy-calculator/" className="btn-secondary">
                Calculate my redundancy →
              </Link>
            </div>
            <p className="text-white/60 text-[12px] mt-4">
              Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
            <DynamicFaqSection pathname="/guides/whistleblowing-settlement-agreements/" />
          </div>
        </section>

        {/* Related Guides & Calculators */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Review Service',
                  description: 'Have your draft clauses and compensation reviewed confidentially before signing.',
                  tag: 'Review Tool',
                },
                {
                  href: '/guides/protected-conversations-without-prejudice/',
                  title: 'Protected Conversations and Without Prejudice',
                  description: 'Understand Section 111A rules and why whistleblowing claims are excluded from secrecy.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/discrimination-settlement-agreements/',
                  title: 'Discrimination Settlement Agreements UK 2026',
                  description: 'Learn how uncapped compensation, injury to feelings, and the 2026 Vento bands work.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/unfair-dismissal-settlement-agreements/',
                  title: 'Unfair Dismissal Settlement Agreements UK 2026',
                  description: 'Understand statutory caps, Polkey deductions, and settlement principles.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'The £30,000 Tax-Free Settlement Exemption',
                  description: 'Learn how HMRC treats termination payments, notice pay, and injury awards.',
                  tag: 'Tax Rules',
                },
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Calculate your statutory baseline and benchmark commercial settlement ranges.',
                  tag: 'Calculator',
                },
              ]}
            />
          </div>
        </section>

        {/* References and Legislation */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities &amp; Case Law</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/part/IVA" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Part IVA (Sections 43A to 43L: Protected disclosures)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/43B" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 43B (Disclosures qualifying for protection)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/43J" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 43J (Contractual terms of confidentiality void for protected disclosures)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/47B" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 47B (Protected disclosures: right not to suffer detriment)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/103A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 103A (Protected disclosure dismissal automatically unfair)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/108" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 108(3)(ff) (Zero qualifying service for whistleblowing dismissals)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (Pre-termination negotiations and statutory exclusions)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124(1A) (Uncapped compensatory awards for whistleblowing dismissals)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 (Restrictions on contracting out and legal advice requirements)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 termination payment threshold)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/406" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 406 (Exception for injury and disability payments)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (Post-employment notice pay taxation)
                </a>
              </li>
              <li>
                <span className="text-muted">
                  <em>Chesterton Global Ltd v Nurmohamed</em> [2017] EWCA Civ 979 (Public interest test criteria in disclosures)
                </span>
              </li>
              <li>
                <span className="text-muted">
                  <em>Royal Mail Group Ltd v Jhuti</em> [2019] UKSC 55 (Automatic unfair dismissal where real reason hidden by employer)
                </span>
              </li>
              <li>
                <span className="text-muted">
                  Presidential Guidance: Employment Tribunal awards for injury to feelings (Ninth Addendum, applicable from 6 April 2026)
                </span>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent information service and calculator platform, not a law firm. The content on this page is for general guidance only and does not constitute formal legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
