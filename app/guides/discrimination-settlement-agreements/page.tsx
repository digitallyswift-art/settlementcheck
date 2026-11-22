import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RelatedArticles from '@/components/RelatedArticles'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Discrimination Settlement Calculator UK | SettlementCheck',
  description:
    'UK discrimination settlement guide 2026. Uncapped compensation, Ninth Addendum Vento bands (£1,300 to £62,900+), injury to feelings, and tax exemptions.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/discrimination-settlement-agreements/',
  },
  openGraph: {
    title: 'Discrimination Settlement Calculator UK | SettlementCheck',
    description:
      'UK discrimination settlement guide 2026. Uncapped compensation, Ninth Addendum Vento bands (£1,300 to £62,900+), injury to feelings, and tax exemptions.',
    url: 'https://settlementcheck.co.uk/guides/discrimination-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discrimination Settlement Calculator UK | SettlementCheck',
    description:
      'UK discrimination settlement guide 2026. Uncapped compensation, Ninth Addendum Vento bands (£1,300 to £62,900+), injury to feelings, and tax exemptions.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/discrimination-settlement-agreements/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'How much compensation can I receive for a discrimination settlement in the UK?',
    a: 'Compensation for discrimination under Section 124 of the Equality Act 2010 is completely uncapped. Your settlement usually includes financial loss (lost salary and pension) plus an injury to feelings award based on the 2026 Vento bands (£1,300 to over £62,900).',
  },
  {
    q: 'What are the current Vento bands for injury to feelings in 2026?',
    a: 'Under the Ninth Addendum to Presidential Guidance (in effect from 6 April 2026), the Vento bands are: Lower Band (£1,300 to £12,600), Middle Band (£12,600 to £37,700), Upper Band (£37,700 to £62,900), and Exceptional Cases (over £62,900).',
  },
  {
    q: 'Is injury to feelings compensation taxable in a settlement agreement?',
    a: 'Under ITEPA 2003 s.406, compensation for injury to feelings related to discrimination occurring before termination is entirely tax-free with no £30,000 cap. If the injury to feelings relates directly to the dismissal itself, it falls under s.403 and counts towards the standard £30,000 exemption.',
  },
  {
    q: 'Can my employer keep settlement discussions secret if discrimination occurred?',
    a: 'No. Section 111A of the Employment Rights Act 1996 covers protected conversations only for standard unfair dismissal. It does not apply to discrimination or whistleblowing. Employers cannot hide behind protected conversation rules if discriminatory conduct took place.',
  },
  {
    q: 'Does my employer pay for my independent legal advice?',
    a: 'Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. That covers reviewing and advising on the draft; excess negotiation or abortive work is subject to your solicitor engagement terms. Under Section 203 of the Employment Rights Act 1996 and Section 144 of the Equality Act 2010, independent legal advice is required for a valid waiver.',
  },
  {
    q: 'Can a settlement agreement waive unknown future discrimination claims?',
    a: 'Under the leading case of Bathgate v Technip, an agreement cannot use broad generic wording to waive unknown future claims that the parties could not have contemplated. Any waiver must identify the specific statutory claims being settled with absolute clarity.',
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
  headline: 'Discrimination Settlement Agreements UK: Compensation, Vento Bands & Tax Rules (2026)',
  url: 'https://settlementcheck.co.uk/guides/discrimination-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-09-18',
  dateModified: '2026-09-18',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
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
    '@id': 'https://settlementcheck.co.uk/guides/discrimination-settlement-agreements/',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function DiscriminationSettlementAgreementsGuide() {
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
              <span className="text-xs text-ink truncate">Discrimination Settlements</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Equality Act 2010 &amp; Employment Law Guide</p>
            <h1 className="sc-h1 mb-4">
              Discrimination Settlement Agreements UK: Compensation, Vento Bands &amp; Tax Rules (2026)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against Equality Act 2010 &amp; Ninth Addendum Vento Bands
            </p>
            <p className="sc-lead leading-relaxed">
              Received a settlement agreement after facing discrimination at work? Unlike ordinary unfair dismissal, Equality Act 2010 compensation is uncapped and includes Ninth Addendum Vento injury to feelings awards. Check your statutory baseline in 60 seconds with no email required, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Embedded Calculator Card (Immediately below Hero) */}
        <section className="pt-8 pb-4 bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's opening figure against your calculated statutory baseline and typical commercial settlement ranges."
              disputeType="discrimination"
              statutoryPills={[
                { label: 'Equality Act Cap', value: 'Uncapped', statute: 'EqA 2010 s.124' },
                { label: '2026 Vento Bands', value: '£1,300 to £62,900+', statute: 'Ninth Addendum' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={45000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Core facts callout box */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-[15px] font-semibold text-ink mb-3">Key discrimination settlement facts for 2026</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Discrimination compensation is completely uncapped under Section 124 of the Equality Act 2010.',
                  'You do not need two years of continuous service. Protection applies from day one of your employment or recruitment.',
                  'Injury to feelings compensation follows the Ninth Addendum Vento bands, ranging from £1,300 to more than £62,900.',
                  'Section 111A protected conversation rules do not apply to discrimination. Employers cannot keep discriminatory discussions confidential.',
                  'Pre-termination injury to feelings awards are 100% tax-free under ITEPA 2003 s.406, outside the standard £30,000 limit.',
                  'Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) towards independent legal advice upon completion.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Uncapped compensation under the Equality Act 2010 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Why is discrimination compensation uncapped under the Equality Act 2010?</h2>
            <p className="sc-body mb-4">
              In UK employment law, discrimination claims carry significant financial exposure for employers. Under Section 124 of the Equality Act 2010, an employment tribunal can award financial compensation without any statutory ceiling <sup>1</sup>.
            </p>
            <p className="sc-body mb-4">
              This contrasts with standard unfair dismissal. For ordinary unfair dismissal, compensatory awards are capped at the lower of £123,543 or 52 weeks of gross pay under SI 2026/310 <sup>2</sup>.
            </p>
            <p className="sc-body mb-6">
              You also enjoy day-one protection. You do not need two years of continuous service to bring a discrimination claim. Protection extends across all nine protected characteristics:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                'Age',
                'Disability (including mental health conditions)',
                'Gender reassignment',
                'Marriage and civil partnership',
                'Pregnancy and maternity',
                'Race (including colour, nationality, ethnic origin)',
                'Religion or belief',
                'Sex',
                'Sexual orientation',
              ].map((characteristic) => (
                <div key={characteristic} className="flex items-center gap-2 p-3 rounded-lg bg-paper border border-rule text-sm text-ink font-medium">
                  <span className="w-2 h-2 rounded-full bg-coral flex-shrink-0"></span>
                  <span>{characteristic}</span>
                </div>
              ))}
            </div>

            <p className="sc-body mb-6">
              Because tribunal compensation is uncapped, opening offers that only match your calculated statutory baseline (subject to Section 141 ERA 1996 eligibility) or basic notice pay often sit below typical discrimination ranges. Employers settle to avoid public tribunal findings, reputational damage, and uncapped financial liability.
            </p>

            <div className="rounded-xl border border-rule overflow-hidden mt-6">
              <table className="w-full text-sm">
                <caption className="sr-only">Comparison of ordinary unfair dismissal versus discrimination claim compensation caps for 2026.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Feature</th>
                    <th className="text-left px-4 py-3 font-medium">Ordinary Unfair Dismissal</th>
                    <th className="text-left px-4 py-3 font-medium">Discrimination Claim</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Compensatory Cap', '£123,543 or 52 weeks\' pay (SI 2026/310)', 'Completely uncapped (Equality Act s.124)'],
                    ['Qualifying Service', '2 continuous years required', '0 days (Day-one statutory protection)'],
                    ['Injury to Feelings', 'Not available', 'Available under Vento bands (£1,300 to £62,900+)'],
                    ['Protected Discussions', 'Covered by Section 111A ERA 1996', 'Excluded (Section 111A does not apply)'],
                    ['Weekly Pay Cap', '£751 per week (ERA 1996 s.227)', 'Does not restrict financial loss calculations'],
                  ].map(([feature, unfair, discrimination], i) => (
                    <tr key={feature} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{feature}</td>
                      <td className="px-4 py-3 text-muted">{unfair}</td>
                      <td className="px-4 py-3 text-ink font-semibold">{discrimination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section: Vento Bands 2026 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How do the 2026 Vento bands value injury to feelings?</h2>
            <p className="sc-body mb-4">
              When an employer discriminates against you, compensation is not limited to lost salary. You can also seek an award for injury to feelings.
            </p>
            <p className="sc-body mb-4">
              Employment tribunals calculate injury to feelings using brackets known as Vento bands. These bands originate from <em>Vento v Chief Constable of West Yorkshire Police [2002]</em> and are updated annually.
            </p>
            <p className="sc-body mb-6">
              For claims and settlements presented on or after 6 April 2026, the Ninth Addendum to the Presidential Guidance sets the following rates <sup>3</sup>:
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {[
                {
                  band: 'Lower Band',
                  range: '£1,300 to £12,600',
                  description:
                    'Applies to less serious cases, such as an isolated comment, a one-off act of low-level harassment, or an accidental discriminatory oversight that was quickly corrected.',
                  color: 'border-l-4 border-sage',
                },
                {
                  band: 'Middle Band',
                  range: '£12,600 to £37,700',
                  description:
                    'Applies to serious incidents that do not warrant an upper band award. Examples include discriminatory dismissal, sustained bullying, discriminatory demotion, or persistent refusal to implement reasonable adjustments.',
                  color: 'border-l-4 border-amber',
                },
                {
                  band: 'Upper Band',
                  range: '£37,700 to £62,900',
                  description:
                    'Reserved for the most serious cases. Typical scenarios involve extended campaigns of discriminatory harassment, severe victimisation after reporting discrimination, or systemic exclusion resulting in significant psychological distress.',
                  color: 'border-l-4 border-coral',
                },
                {
                  band: 'Exceptional Cases',
                  range: 'Exceeding £62,900',
                  description:
                    'Awarded in rare and extreme circumstances where prolonged, malicious discrimination causes catastrophic psychiatric harm, lifelong loss of career prospects, or severe personal distress.',
                  color: 'border-l-4 border-crimson',
                },
              ].map(({ band, range, description, color }) => (
                <div key={band} className={`rounded-xl border border-rule bg-paper p-5 ${color}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-ink">{band}</h3>
                    <span className="text-sm font-bold text-coral-ink font-mono">{range}</span>
                  </div>
                  <p className="sc-body">{description}</p>
                </div>
              ))}
            </div>

            <p className="sc-body mb-4">
              When reviewing a settlement agreement, your solicitor uses these bands to benchmark the injury to feelings element of your payment.
            </p>
            <p className="sc-body">
              A medical report, witness statements, or a written grievance trail helps support placement in the middle or upper Vento band.
            </p>
          </div>
        </section>

        {/* Section: Tax rules for discrimination settlements */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How are discrimination settlements taxed under Section 403 and Section 406?</h2>
            <p className="sc-body mb-4">
              Tax treatment is one of the most important elements of any discrimination settlement agreement. Structuring the payment clearly can save thousands of pounds in tax.
            </p>
            <p className="sc-body mb-6">
              UK tax law draws a sharp distinction between termination payments and compensation for pre-termination discrimination:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sage-tint text-sage">Exempt from Tax</span>
                  <h3 className="text-sm font-semibold text-ink">Pre-Termination Injury to Feelings</h3>
                </div>
                <p className="sc-body mb-3">
                  Under Section 406 of ITEPA 2003, compensation for injury to feelings related to discrimination occurring <em>before</em> and distinct from dismissal is 100% tax-free <sup>4</sup>.
                </p>
                <p className="sc-body text-muted">
                  There is no £30,000 threshold. It is exempt from income tax and National Insurance contributions.
                </p>
              </div>

              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-tint text-amber">£30,000 Cap Applies</span>
                  <h3 className="text-sm font-semibold text-ink">Termination Compensation</h3>
                </div>
                <p className="sc-body mb-3">
                  Under Section 403 of ITEPA 2003, compensation paid directly for the loss of your employment is tax-free up to £30,000 <sup>5</sup>.
                </p>
                <p className="sc-body text-muted">
                  Any excess above £30,000 is subject to income tax. Injury to feelings directly connected with the dismissal itself also falls under this £30,000 cap.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Notice Pay (PILON) Is Always Taxed as Wages</h3>
              <p className="sc-body mb-2">
                Under Section 402D of ITEPA 2003, Payment in Lieu of Notice (PILON) or garden leave is classified as Post-Employment Notice Pay (PENP) <sup>6</sup>.
              </p>
              <p className="sc-body">
                It is taxed as wages through PAYE and Class 1 National Insurance, and cannot be disguised as tax-free compensation. See our guide on <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax treatment</Link>.
              </p>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 flex gap-3">
              <InfoIcon />
              <p className="sc-body">
                Your settlement agreement must explicitly apportion the settlement into distinct sums: notice pay, ex-gratia termination compensation, and pre-termination injury to feelings. Clear wording prevents HMRC from challenging the tax-free status. Read our complete guide to the <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">£30,000 settlement exemption</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Section 111A and Without Prejudice exceptions */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Are discrimination settlement talks confidential under Section 111A?</h2>
            <p className="sc-body mb-4">
              Employers sometimes label settlement discussions as a &quot;protected conversation&quot; under Section 111A of the Employment Rights Act 1996, or as &quot;without prejudice&quot;.
            </p>
            <p className="sc-body mb-4">
              Under UK law, these confidentiality rules have strict statutory boundaries.
            </p>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">1. Section 111A Does Not Apply to Discrimination</h3>
            <p className="sc-body mb-4">
              Section 111A ERA 1996 protects pre-termination negotiations exclusively in standard unfair dismissal cases <sup>7</sup>.
            </p>
            <p className="sc-body mb-4">
              Under Section 111A(4), the confidentiality shield does not apply to claims under the Equality Act 2010 or whistleblowing claims.
            </p>
            <p className="sc-body mb-6">
              If an employer uses a settlement meeting to make discriminatory comments, or if the conversation itself forms part of an act of discrimination, you can disclose everything said in that meeting before an employment tribunal. If your situation involves long-term sickness absence or health capability issues, see our dedicated guide to <Link href="/guides/settlement-agreement-sick-leave/" className="underline hover:text-ink">settlement agreements on sick leave</Link>.
            </p>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">2. Without Prejudice Rules and Unambiguous Impropriety</h3>
            <p className="sc-body mb-4">
              Common law without prejudice privilege only applies if there is already an existing, genuine dispute between you and your employer.
            </p>
            <p className="sc-body mb-4">
              The privilege does not protect unlawful acts or &quot;unambiguous impropriety&quot;. An employer cannot use without prejudice discussions to deliver discriminatory ultimatums.
            </p>
            <p className="sc-body">
              Because discussions outside these rules may be disclosable in an employment tribunal, employers often prefer to reach an agreed settlement out of tribunal.
            </p>
          </div>
        </section>

        {/* Section: Legal validity and Bathgate v Technip */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What makes a discrimination settlement legally valid?</h2>
            <p className="sc-body mb-4">
              Under Section 203(3) of the Employment Rights Act 1996 and Section 144 of the Equality Act 2010, you cannot waive your statutory rights in a private document unless strict formal requirements are met <sup>8</sup>.
            </p>
            <p className="sc-body mb-6">
              To be legally binding, the settlement agreement must:
            </p>

            <ul className="flex flex-col gap-3 mb-6">
              {[
                'Be made in writing and relate to the particular proceedings or complaints raised.',
                'Confirm you received independent legal advice from a qualified, insured solicitor or certified trade union adviser.',
                'Identify the adviser by name and confirm their professional indemnity insurance policy is in place.',
                'State explicitly that the statutory conditions regulating settlement agreements are satisfied.',
              ].map((requirement) => (
                <li key={requirement} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">{requirement}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">Waiving Unknown Future Claims: Bathgate v Technip</h3>
            <p className="sc-body mb-4">
              Employers often include broad waivers stating that you give up &quot;all claims of any nature, whether known or unknown, arising in the past, present, or future&quot;.
            </p>
            <p className="sc-body mb-4">
              The appellate decision in <em>Bathgate v Technip Singapore PTE Ltd [2023] CSIH 48</em> clarified this practice <sup>9</sup>. A settlement agreement can settle future claims only if the wording is clear and refers to the specific category of claim contemplated by the parties.
            </p>
            <p className="sc-body mb-6">
              Blanket boilerplate clauses cannot extinguish rights that the parties could not reasonably have contemplated. Your solicitor reviews the waiver wording, confidentiality clauses, and any post-termination non-compete restrictions before you sign.
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-[15px] font-semibold text-ink mb-2">Employer Legal Fee Contribution</p>
              <p className="sc-body mb-2">
                Under Section 203(3) ERA 1996, independent legal advice is a statutory validity condition. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion.
              </p>
              <p className="sc-body">
                That contribution covers reviewing and advising on the draft. Any extra negotiation or abortive work is subject to your solicitor&apos;s engagement terms unless the employer raises the cap.
              </p>
            </div>
          </div>
        </section>

        {/* Section: 4-step negotiation timeline */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does the discrimination settlement process work?</h2>
            <p className="sc-body mb-6">
              Here is how employees and their solicitors typically approach a discrimination settlement:
            </p>

            <div className="relative border-l-2 border-rule ml-4 pl-6 flex flex-col gap-8">
              {[
                {
                  step: '01',
                  title: 'Keep a contemporaneous record',
                  desc: 'Note dates, meetings, emails, and performance reviews. If discrimination affected your health, GP records can also be relevant.',
                },
                {
                  step: '02',
                  title: 'Check your statutory baseline and Vento range',
                  desc: 'Calculate your notice pay, holiday pay, and statutory redundancy baseline alongside lost earnings and the 2026 Ninth Addendum Vento bands.',
                },
                {
                  step: '03',
                  title: 'Understand offer revocation and the ACAS 10-day guideline',
                  desc: 'ACAS Code of Practice 4 recommends 10 calendar days as general guidance to consider an offer, though it is not a binding legal right. Under English contract law, a counter-offer rejects the original offer (Hyde v Wrench) and an unaccepted offer can be withdrawn before signing (Routledge v Grant).',
                },
                {
                  step: '04',
                  title: 'Review the draft with an independent solicitor',
                  desc: 'Your solicitor checks the waiver wording, tax split (s.403 vs s.406), agreed reference, and any non-compete clauses. Employers standardly contribute £350 to £500+ plus VAT upon completion.',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative">
                  <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-ink text-white text-xs font-mono flex items-center justify-center font-bold">
                    {step}
                  </span>
                  <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
                  <p className="sc-body">{desc}</p>
                </div>
              ))}
            </div>

            <p className="sc-body mt-8">
              To learn more about how talks work, read our guide on <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="underline hover:text-ink">how to negotiate a settlement agreement</Link> or compare <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-ink">settlement agreements versus employment tribunals</Link>.
            </p>
          </div>
        </section>

        {/* Section: Official independent resources */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Where can I get free official guidance?</h2>
            <p className="sc-body mb-6">
              If you are facing discrimination at work, you can access free, confidential guidance from official UK statutory bodies:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'ACAS (Advisory, Conciliation and Arbitration Service)',
                  desc: 'Free, impartial guidance on UK employment law and early conciliation support.',
                  url: 'https://www.acas.org.uk',
                },
                {
                  name: 'Equality Advisory and Support Service (EASS)',
                  desc: 'Official government helpline advising on discrimination under the Equality Act 2010.',
                  url: 'https://www.equalityadvisoryservice.com',
                },
                {
                  name: 'GOV.UK Employment Tribunals',
                  desc: 'Official government guidance on lodging claims, tribunal fees, and hearing procedures.',
                  url: 'https://www.gov.uk/employment-tribunals',
                },
                {
                  name: 'Legislation.gov.uk',
                  desc: 'Access original UK statutes including the Equality Act 2010 and SI 2026/310.',
                  url: 'https://www.legislation.gov.uk',
                },
              ].map(({ name, desc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-rule bg-white p-5 hover:border-ink transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-1">{name}</h3>
                    <p className="sc-body text-muted mb-3">{desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-coral-ink">Visit official site &rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section: CTA Banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculator/?discrimination=yes" className="btn-accent">
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

        {/* Section: FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
            <DynamicFaqSection pathname="/guides/discrimination-settlement-agreements/" />
          </div>
        </section>

        {/* Section: Related Articles */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Tribunal Data & Guides"
              items={[
                {
                  href: '/guides/employment-tribunal-average-awards-uk/',
                  title: 'Average Employment Tribunal Awards UK (MoJ Tables)',
                  description: 'Official Ministry of Justice median and mean discrimination, sex, race, and disability tribunal awards alongside 2026 Vento bands.',
                  tag: 'MoJ Statistics',
                },
                {
                  href: '/tribunal-backlog-tracker/',
                  title: 'UK Employment Tribunal Backlog Tracker',
                  description: 'Compare regional hearing delays (up to 540 days in London) and employer defence cost exposure when reviewing a discrimination exit.',
                  tag: 'Data Tracker',
                },
                {
                  href: '/reports/uk-settlement-index-2026/',
                  title: 'UK Employment Settlement Index 2026',
                  description: 'Sector-by-sector UK settlement multiples and statutory cap benchmarks for 2026.',
                  tag: '2026 Report',
                },
              ]}
            />
          </div>
        </section>

        {/* References and Legislation */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Equality Act 2010, Section 124 (tribunal remedies and uncapped compensation)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <span className="text-muted">
                  Presidential Guidance: Employment Tribunal awards for injury to feelings and psychiatric injury (Ninth Addendum, applicable from 6 April 2026)
                </span>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/406" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 406 (exception for injury)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 threshold)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (post-employment notice pay)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (pre-termination negotiations and exceptions)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 &amp; Equality Act 2010, Section 144 (statutory settlement validity)
                </a>
              </li>
              <li>
                <span className="text-muted">
                  <em>Bathgate v Technip Singapore PTE Ltd</em> [2023] CSIH 48 (settlement of future claims under Equality Act 2010)
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-[13px] text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent information service and calculator platform, not a law firm. The content on this page is for general information only and does not constitute formal legal counsel. Use our free calculator to evaluate your settlement offer.
        </p>
      </main>
      <Footer />
    </>
  )
}
