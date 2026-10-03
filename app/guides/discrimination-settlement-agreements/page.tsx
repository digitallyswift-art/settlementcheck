import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Discrimination Settlement Agreements UK 2026 | Vento Bands & Tax Rules',
  description:
    'UK guide to discrimination settlement agreements in 2026. Learn about uncapped compensation, the Ninth Addendum Vento bands (£1,300 to £62,900+), and tax rules.',
  alternates: {
    canonical: '/guides/discrimination-settlement-agreements/',
  },
  openGraph: {
    title: 'Discrimination Settlement Agreements UK 2026 | Vento Bands & Tax Rules',
    description:
      'UK guide to discrimination settlement agreements in 2026. Learn about uncapped compensation, the Ninth Addendum Vento bands (£1,300 to £62,900+), and tax rules.',
    url: '/guides/discrimination-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discrimination Settlement Agreements UK 2026 | Vento Bands & Tax Rules',
    description:
      'UK guide to discrimination settlement agreements in 2026. Learn about uncapped compensation, the Ninth Addendum Vento bands (£1,300 to £62,900+), and tax rules.',
  },
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
    a: 'Yes. For a settlement agreement to be legally valid under Section 203 of the Employment Rights Act 1996 and Section 144 of the Equality Act 2010, you must receive independent legal advice. Your employer covers this fee, which typically ranges from £350 to £750 plus VAT.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
            <h1 className="sc-h1 mb-5">
              Discrimination Settlement Agreements UK: Compensation, Vento Bands &amp; Tax Rules (2026)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; Ninth Addendum)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: September 2026</span>
            </div>
            <p className="sc-lead">
              Unlike ordinary unfair dismissal awards, which are strictly capped at £123,543, compensation for unlawful discrimination under Section 124 of the Equality Act 2010 is completely uncapped. In 2026, discrimination settlements combine past and future financial loss with injury to feelings awards assessed under the Ninth Addendum Vento bands, which range from £1,300 to over £62,900. Furthermore, under Section 406 of the Income Tax (Earnings and Pensions) Act 2003, payments for injury to feelings arising before dismissal are 100% tax-free with no £30,000 ceiling.
            </p>
          </div>
        </section>

        {/* Core facts callout box */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key discrimination settlement facts for 2026</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Discrimination compensation is completely uncapped under Section 124 of the Equality Act 2010.',
                  'You do not need two years of continuous service. Protection applies from day one of your employment or recruitment.',
                  'Injury to feelings compensation follows the Ninth Addendum Vento bands, ranging from £1,300 to more than £62,900.',
                  'Section 111A protected conversation rules do not apply to discrimination. Employers cannot keep discriminatory discussions confidential.',
                  'Pre-termination injury to feelings awards are 100% tax-free under ITEPA 2003 s.406, outside the standard £30,000 limit.',
                  'Your employer covers the cost of your independent legal advice, typically contributing £350 to £750 plus VAT.',
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
            <h2 className="sc-section-h2 mb-4">Uncapped compensation under the Equality Act 2010</h2>
            <p className="sc-body mb-4">
              In UK employment law, discrimination claims carry significant financial exposure for employers. Under Section 124 of the Equality Act 2010, an employment tribunal can award financial compensation without any statutory ceiling <sup>1</sup>.
            </p>
            <p className="sc-body mb-4">
              This stands in direct contrast to standard unfair dismissal. For ordinary unfair dismissal, compensatory awards are capped at the lower of £123,543 or 52 weeks of gross pay under SI 2026/310 <sup>2</sup>.
            </p>
            <p className="sc-body mb-6">
              You also enjoy day-one protection. You do not need two years of continuous service to bring a discrimination claim or negotiate a departure package based on discriminatory treatment. Protection extends across all nine protected characteristics:
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
              Because tribunal compensation is uncapped, initial settlement offers that only match statutory redundancy or basic notice pay are well below the typical range for discrimination cases. Employers settle to avoid public tribunal findings, substantial reputational damage, and uncapped financial liability.
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
            <h2 className="sc-section-h2 mb-4">Vento Bands 2026: Injury to feelings calculations</h2>
            <p className="sc-body mb-4">
              When an employer discriminates against you, compensation is not limited to lost salary. You are entitled to an award for injury to feelings.
            </p>
            <p className="sc-body mb-4">
              Employment tribunals calculate injury to feelings using brackets known as Vento bands. These bands originate from the landmark case <em>Vento v Chief Constable of West Yorkshire Police [2002]</em> and are updated annually.
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
                  <p className="sc-body text-sm">{description}</p>
                </div>
              ))}
            </div>

            <p className="sc-body mb-4">
              When negotiating a settlement agreement, your solicitor uses these bands to benchmark the injury to feelings element of your payment.
            </p>
            <p className="sc-body">
              A solid medical report, witness statements, or a written grievance trail will support placement in the middle or upper Vento band.
            </p>
          </div>
        </section>

        {/* Section: Tax rules for discrimination settlements */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax rules for discrimination settlements: Section 403 vs Section 406</h2>
            <p className="sc-body mb-4">
              Tax treatment is one of the most critical elements of any discrimination settlement agreement. Structuring the payment correctly can save thousands of pounds in tax.
            </p>
            <p className="sc-body mb-6">
              UK tax law draws a sharp legal distinction between termination payments and compensation for pre-termination discrimination:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-rule bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sage-tint text-sage">Exempt from Tax</span>
                  <h3 className="text-sm font-semibold text-ink">Pre-Termination Injury to Feelings</h3>
                </div>
                <p className="sc-body text-sm mb-3">
                  Under Section 406 of the Income Tax (Earnings and Pensions) Act 2003, compensation for injury to feelings related to discrimination occurring <em>before</em> and distinct from dismissal is 100% tax-free <sup>4</sup>.
                </p>
                <p className="sc-body text-sm text-muted">
                  There is no £30,000 threshold. It is completely exempt from income tax and National Insurance contributions.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-tint text-amber">£30,000 Cap Applies</span>
                  <h3 className="text-sm font-semibold text-ink">Termination Compensation</h3>
                </div>
                <p className="sc-body text-sm mb-3">
                  Under Section 403 of ITEPA 2003, compensation paid directly for the loss of your employment is tax-free up to £30,000 <sup>5</sup>.
                </p>
                <p className="sc-body text-sm text-muted">
                  Any excess above £30,000 is subject to income tax. Injury to feelings directly connected with the dismissal itself also falls under this £30,000 cap.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Notice Pay (PILON) Is Always Taxable</h3>
              <p className="sc-body text-sm mb-2">
                Under Section 402D of ITEPA 2003, Payment in Lieu of Notice (PILON) is classified as Post-Employment Notice Pay (PENP) <sup>6</sup>.
              </p>
              <p className="sc-body text-sm">
                Your employer must deduct income tax and Class 1 National Insurance from all notice pay. It cannot be disguised as tax-free compensation. For a detailed calculation breakdown, consult our guide on <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax treatment</Link>.
              </p>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                Your settlement agreement must explicitly apportion the settlement into distinct sums: notice pay, ex-gratia termination compensation, and pre-termination injury to feelings. Clear wording prevents HMRC from challenging the tax-free status. Read our complete guide to the <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">£30,000 settlement exemption</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Section 111A and Without Prejudice exceptions */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Section 111A and Without Prejudice exceptions: Employers cannot hide</h2>
            <p className="sc-body mb-4">
              When an employer opens settlement discussions, they often label communications as a &quot;protected conversation&quot; under Section 111A of the Employment Rights Act 1996, or as &quot;without prejudice&quot;.
            </p>
            <p className="sc-body mb-4">
              Many employers wrongly believe this shields them from liability. Under UK law, these protections have strict legal boundaries.
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
              Furthermore, the privilege does not protect unlawful acts or &quot;unambiguous impropriety&quot;. An employer cannot use without prejudice discussions to deliver discriminatory ultimatums.
            </p>
            <p className="sc-body">
              This gives you substantial leverage. Because the employer cannot hide their conduct behind statutory confidentiality, they are far more motivated to reach an agreed settlement outside of public court proceedings.
            </p>
          </div>
        </section>

        {/* Section: Legal validity and Bathgate v Technip */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Legal validity and the Bathgate v Technip rule</h2>
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
              Employers often attempt to include broad waivers stating that you give up &quot;all claims of any nature, whether known or unknown, arising in the past, present, or future&quot;.
            </p>
            <p className="sc-body mb-4">
              The landmark appellate decision in <em>Bathgate v Technip Singapore PTE Ltd [2023] CSIH 48</em> clarified this practice <sup>9</sup>. The court held that a settlement agreement can settle future claims, but only if the wording is clear and refers to the specific category of claim contemplated by the parties.
            </p>
            <p className="sc-body mb-6">
              Blanket boilerplate clauses cannot extinguish rights that the parties could not reasonably have foreseen. Your solicitor will review the waiver terms carefully to protect you from unintended forfeitures.
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-2">Employer Covers Your Legal Fees</p>
              <p className="sc-body text-sm mb-2">
                Your employer covers the cost of your independent legal advice. The typical employer contribution is between £350 and £750 plus VAT.
              </p>
              <p className="sc-body text-sm">
                Your solicitor invoices your employer directly. You do not pay this out of your own pocket. If negotiations require extended redrafting, your solicitor can request an increased contribution from your employer.
              </p>
            </div>
          </div>
        </section>

        {/* Section: 4-step negotiation timeline */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">4-step negotiation process for discrimination settlements</h2>
            <p className="sc-body mb-6">
              Negotiating a fair settlement requires a structured approach. Follow these four practical steps to protect your position:
            </p>

            <div className="relative border-l-2 border-rule ml-4 pl-6 flex flex-col gap-8">
              {[
                {
                  step: '01',
                  title: 'Document all discriminatory conduct',
                  desc: 'Keep a private, contemporaneous timeline of incidents. Save relevant emails, chat logs, performance appraisals, and records of meetings. If you experienced stress or health effects, obtain medical notes from your GP.',
                },
                {
                  step: '02',
                  title: 'Quantify your true financial and emotional loss',
                  desc: 'Calculate your actual financial losses, including lost salary, pension, and benefits while seeking comparable employment. Benchmark your injury to feelings under the 2026 Ninth Addendum Vento bands.',
                },
                {
                  step: '03',
                  title: 'Submit a detailed grievance or without-prejudice response',
                  desc: 'Respond to the employer\'s initial proposal with a clear counteroffer. Outline the uncapped nature of the tribunal risk they face and the inapplicability of Section 111A confidentiality.',
                },
                {
                  step: '04',
                  title: 'Finalise terms with your independent solicitor',
                  desc: 'Your solicitor checks the agreement, negotiates an agreed job reference, confidentiality wording, and tax indemnities. Your employer pays the solicitor\'s invoice directly.',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative">
                  <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-ink text-white text-xs font-mono flex items-center justify-center font-bold">
                    {step}
                  </span>
                  <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
                  <p className="sc-body text-sm">{desc}</p>
                </div>
              ))}
            </div>

            <p className="sc-body mt-8">
              To learn more about negotiation tactics, read our detailed guide on <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="underline hover:text-ink">how to negotiate a settlement agreement</Link> or evaluate <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-ink">settlement agreements versus employment tribunals</Link>.
            </p>
          </div>
        </section>

        {/* Section: Official independent resources */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Official independent resources</h2>
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
                    <p className="sc-body text-xs text-muted mb-3">{desc}</p>
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
            <h2 className="sc-section-h2 text-white mb-4">Check your settlement offer now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Evaluate your compensation against 2026 statutory caps, calculate your tax-free allowance, and check if your offer is fair.
            </p>
            <Link href="/calculator/" className="btn-accent">
              Calculate my settlement now &rarr;
            </Link>
          </div>
        </section>

        {/* Section: FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
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
        <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent information service and calculator platform, not a law firm. The content on this page is for general information only and does not constitute formal legal counsel. Use our free calculator to evaluate your settlement offer.
        </p>
      </main>
      <Footer />
    </>
  )
}
