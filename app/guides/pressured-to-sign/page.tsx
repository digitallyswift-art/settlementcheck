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
  title: 'Pressured to Sign? The 10-Day ACAS Rule | SettlementCheck',
  description:
    'Rights when pressured to sign a settlement agreement. ACAS Code 4 minimum 10-day guidance, improper behaviour under ERA 1996 s.111A, and fee protection.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/pressured-to-sign/',
  },
  openGraph: {
    title: 'Pressured to Sign? The 10-Day ACAS Rule | SettlementCheck',
    description:
      'Rights when pressured to sign a settlement agreement. ACAS Code 4 minimum 10-day guidance, improper behaviour under ERA 1996 s.111A, and fee protection.',
    url: 'https://settlementcheck.co.uk/guides/pressured-to-sign/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pressured to Sign? The 10-Day ACAS Rule | SettlementCheck',
    description:
      'The ACAS 10-day guidance, what counts as improper pressure, and your options if your employer is rushing you. Free guide.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/pressured-to-sign/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Can my employer give me 24 hours to sign a settlement agreement?',
    a: 'ACAS Code of Practice 4 recommends a minimum of 10 calendar days as general guidance, though it is not a binding legal right. Under English contract law (Routledge v Grant), an employer can set deadlines on an unaccepted offer. However, an unreasonable 24-hour ultimatum may count as improper behaviour under Section 111A ERA 1996 for ordinary unfair dismissal claims.',
  },
  {
    q: 'What happens if I do not sign within their deadline?',
    a: 'If you do not sign, your employer can withdraw the offer and return to standard workplace procedures. That may mean a redundancy consultation or capability process. Refusing a settlement offer is not a fair reason for dismissal on its own.',
  },
  {
    q: 'Can they threaten to dismiss me if I do not sign?',
    a: 'Threatening immediate dismissal if you reject a settlement offer is classed as improper behaviour under Section 111A of the Employment Rights Act 1996. That removes Section 111A confidentiality in an ordinary unfair dismissal claim. Section 111A does not shield discrimination, whistleblowing, or automatic unfair dismissal claims.',
  },
  {
    q: 'Should I tell the independent solicitor about the pressure?',
    a: 'Yes. Sharing the timeline and any written deadlines helps your independent solicitor assess whether improper behaviour occurred. They can then advise on your options and whether there is room to request better terms.',
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
      <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

export default function PressuredToSignGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Pressured to Sign a Settlement Agreement Quickly?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Facing a short deadline on a draft settlement agreement? ACAS Code 4 recommends 10 calendar days to consider terms and take legal advice. Check your calculated statutory baseline in 60 seconds with no email required, then review the figures with an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Calculator Card */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Compare your employer's deadline offer against your calculated statutory baseline before taking independent legal advice."
                disputeType="negotiation"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'ACAS Review Window', value: '10 Calendar Days', statute: 'Code 4 Guidance' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={50000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Key Takeaways Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">Core Facts</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    ACAS Code of Practice 4 (para 12) recommends 10 calendar days as general guidance. Under English contract law (<em>Routledge v Grant</em>), an employer can still set deadlines or withdraw an unaccepted offer.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    Threatening immediate dismissal if you do not sign is classed as improper behaviour under Section 111A ERA 1996 for ordinary unfair dismissal claims.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    Short deadlines make it harder to check notice pay, garden leave, non-compete clauses, and what is taxed as wages. Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion, with excess or abortive work subject to solicitor engagement terms.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Does the 10-day ACAS rule give you a legal right to more time?</h2>
              <p className="guide-body">
                ACAS Code of Practice 4 recommends a minimum of 10 calendar days to consider written terms and take independent legal advice. That window exists so you can check the figures properly.
              </p>
              <p className="guide-body">
                The 10-day rule is guidance rather than a strict legal right. Under contract law (<em>Routledge v Grant</em>), an employer can set a shorter deadline or withdraw an unaccepted offer. However, an employment tribunal will weigh a 24-hour or 48-hour ultimatum when deciding if an employer acted unreasonably.
              </p>
            </div>

            <ReviewCallout
              title="Facing a deadline from your employer?"
              description="ACAS Code of Practice 4 recommends a 10-calendar-day window as general guidance. Check your calculated statutory baseline in 60 seconds and share your draft terms with an independent solicitor before any deadline expires."
              ctaText="Check my offer now →"
              badge="Urgent Deadline Support"
            />

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. What counts as improper behaviour under Section 111A?</h2>
              <p className="guide-body">
                Pre-termination settlement talks are normally confidential for ordinary unfair dismissal claims under Section 111A of the Employment Rights Act 1996. Common law Without Prejudice privilege also protects discussions, but only where a genuine dispute already exists (<em>Framlington Group v Barnetson</em>).
              </p>
              <p className="guide-body">
                Section 111A does not protect discrimination, whistleblowing, or automatic unfair dismissal claims. Even for ordinary unfair dismissal, Section 111A protection falls away if an employer uses improper behaviour.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-4 flex items-start gap-3">
                <AlertIcon />
                <div>
                  <strong className="text-ink block text-[15px] mb-1">Examples of improper behaviour include:</strong>
                  <ul className="list-disc pl-4 text-[14px] text-ink leading-relaxed space-y-1">
                    <li>Putting undue pressure on you to accept the offer.</li>
                    <li>Refusing a reasonable time to consider the agreement, such as imposing a 24-hour deadline.</li>
                    <li>Threatening to dismiss you immediately if the agreement is rejected.</li>
                    <li>Intimidation or harassment during the settlement meeting.</li>
                  </ul>
                </div>
              </div>
              <p className="guide-body mt-4">
                If improper behaviour occurs, those talks are no longer off the record for an unfair dismissal claim. You can present the written deadlines or threats as evidence at an employment tribunal.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. Why do employers set short deadlines?</h2>
              <p className="guide-body">
                Employers often set tight timelines to close out an exit before a formal HR process begins. Knowing the commercial driver helps you and your solicitor assess the offer.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Collective Redundancy Timelines</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Where 20 or more redundancies are proposed, statutory collective consultation lasts 30 or 45 days³. Employers sometimes offer settlements to conclude individual exits sooner.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Performance Management Processes</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    A formal Performance Improvement Plan (PIP) can take several months of management time. A settlement offer is often used as a commercial alternative to a lengthy process.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 md:col-span-2">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Long-Term Sickness Absence</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Managing capability during sickness absence involves medical evidence and reasonable adjustments. Employers may propose an agreed exit instead. Read our guide on{' '}
                    <Link href="/guides/settlement-agreement-sick-leave/" className="text-coral underline underline-offset-2 hover:text-ink">
                      settlement agreements on sick leave
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-6">
              <h2 className="guide-h2">4. How can you respond to a short deadline?</h2>

              <div className="relative border-l border-rule ml-3 space-y-8 pb-4 mt-4">
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Arrange independent legal advice promptly</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Under Section 203(3) ERA 1996, a settlement agreement is only binding once an independent solicitor advises you on its terms. Employers standardly contribute £350 to £500+ plus VAT toward this advice upon completion, with excess or abortive work subject to your solicitor&apos;s engagement terms. You can choose your own solicitor (see{' '}
                    <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink">
                      using your employer&apos;s recommended solicitor
                    </Link>).
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Keep a written paper trail</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Acknowledging the draft in writing and noting the ACAS 10-calendar-day window creates a clear record. Sending unreviewed financial counter-offers directly to HR can extinguish the original offer under <em>Hyde v Wrench</em> or waive legal privilege.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Check the offer against your statutory baseline</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Check your notice pay, garden leave, non-compete clauses, and which sums are taxed as wages versus tax-free compensation. Compare the package using our{' '}
                    <Link href="/calculator/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      Check my offer now →
                    </Link>{' '}
                    tool or review{' '}
                    <Link href="/guides/settlement-agreement-acas-calculations/" className="text-coral underline underline-offset-2 hover:text-ink">
                      ACAS-based calculations
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Compare your offer against your calculated statutory baseline using April 2026 UK rates. No email required.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/calculator/" className="btn-accent">
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

            {/* FAQ */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/pressured-to-sign/" />
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Rights"
              items={[
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens If You Do Not Sign?',
                  description: 'Understand the consequences of rejecting an offer and how formal procedures resume.',
                  tag: 'Your Options',
                },
                {
                  href: '/guides/employer-recommended-solicitor/',
                  title: 'Using Your Employer’s Recommended Solicitor',
                  description: 'Why you can choose independent legal advice paid by your employer upon completion.',
                  tag: 'Legal Advice',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Structure a commercial response once you have reviewed your statutory baseline.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Compare your package against statutory notice, redundancy, and UK benchmarks.',
                  tag: 'Fairness Benchmarks',
                },
                {
                  href: '/guides/settlement-agreement-instead-of-pip/',
                  title: 'Settlement Agreement Instead of a PIP UK',
                  description: 'Options when offered an agreed exit instead of completing a capability process.',
                  tag: 'PIP Exit',
                },
                {
                  href: '/guides/acas-statutory-timeline/',
                  title: 'ACAS 10-Day Consideration Rule & Timeline Tool',
                  description: 'Check how an employer deadline compares against the ACAS Code 4 10-calendar-day guidance.',
                  tag: 'ACAS Code 4',
                },
              ]}
            />

            {/* Footnotes and Citations */}
            <div className="space-y-4 pt-8 border-t border-rule">
              <h2 className="text-[16px] font-semibold text-ink">Statutory Citations</h2>
              <ul className="space-y-2">
                <li className="text-[13px] text-muted-2">
                  ¹ <a href="https://www.acas.org.uk/acas-code-of-practice-on-settlement-agreements" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">ACAS Code of Practice on Settlement Agreements (2013)</a>, paragraph 12.
                </li>
                <li className="text-[13px] text-muted-2">
                  ² <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.111A</a>.
                </li>
                <li className="text-[13px] text-muted-2">
                  ³ <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/188" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Trade Union and Labour Relations (Consolidation) Act 1992, s.188</a>.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁴ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.227</a>, reflecting April 2026 statutory limits (£751/week GB cap).
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="text-[14px] text-muted border-t border-rule pt-6 leading-relaxed">
              Figures on this page reflect the 2026/27 statutory limits, in force from 6 April 2026. Last reviewed: April 2026. SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement process and does not constitute legal advice.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
