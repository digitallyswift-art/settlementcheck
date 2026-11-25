import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Settlement Agreement & Sick Leave UK 2026 | SettlementCheck',
  },
  description:
    'Off sick and offered a settlement? Check 2026 UK sick pay, notice rules, £30,000 tax-free exemption, and solicitor fee norms in 60 seconds.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-sick-leave/',
  },
  openGraph: {
    title: 'Settlement Agreement on Sick Leave: UK Rights & Pay (2026)',
    description:
      'Off sick and offered a settlement? Check 2026 UK statutory pay rights, notice pay rules, £30,000 tax exemptions, and employer legal fee contributions.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-sick-leave/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement on Sick Leave: UK Rights & Pay (2026)',
    description:
      'Off sick and offered a settlement? Check 2026 UK statutory pay rights, notice pay rules, £30,000 tax exemptions, and employer legal fee contributions.',
  },
}

const FAQS = [
  {
    q: 'Can my employer force me to attend a settlement meeting while I am off sick?',
    a: 'No. Your employer cannot force you to attend meetings while signed off sick by your GP. If you are medically unfit, you can inform your employer in writing, request written communications, or instruct an independent solicitor to speak for you.',
  },
  {
    q: 'What happens if I reject a settlement agreement while on sick leave?',
    a: 'If you decline the offer, your employment contract continues as normal. Your employer must continue paying any sick pay you are entitled to. They must follow formal capability procedures to manage absence and cannot dismiss you simply for declining an offer.',
  },
  {
    q: 'Am I entitled to full pay during my notice period if I am on Statutory Sick Pay?',
    a: 'Under Sections 87 to 91 of the Employment Rights Act 1996, you are entitled to full normal pay during notice if your contractual notice is not at least one week longer than statutory notice. If your contract provides longer notice, pay depends on contractual terms, which your solicitor can review.',
  },
  {
    q: 'Does my employer pay for my solicitor while I am on sick leave?',
    a: 'Employers standardly offer a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion to satisfy Section 203(3) ERA 1996. There is no statutory obligation on an employer to fund it. If the agreement does not complete or work exceeds the cap, additional costs depend on your solicitor\'s engagement terms.',
  },
  {
    q: 'How does sickness affect the calculation of my accrued holiday pay?',
    a: 'You continue to accrue statutory annual leave (5.6 weeks per year) throughout sick leave under the Working Time Regulations 1998. If illness prevented you from taking leave, your entitlement carries over and accrued untaken holiday is paid out on termination.',
  },
  {
    q: 'Can my employer dismiss me for capability while we are negotiating?',
    a: 'An employer must follow a fair, documented procedure before any capability dismissal, including medical evidence and exploring reasonable adjustments. Threatening immediate dismissal to force a signature can amount to improper behaviour under Section 111A(4) ERA 1996 and remove confidentiality.',
  },
  {
    q: 'What does a sick leave settlement package usually include?',
    a: 'An ill-health settlement package typically includes notice pay, accrued untaken holiday pay, and an ex-gratia sum (often one to six months of gross salary depending on circumstances). If your illness qualifies as a disability under the Equality Act 2010, solicitors also assess potential tribunal awards under the Vento bands (£1,300 to £62,900+).',
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
  headline: 'Settlement Agreement on Sick Leave: UK Employee Rights and Pay (2026 Guide)',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-sick-leave/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-03',
  dateModified: '2026-10-03',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-sick-leave/',
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

export default function SettlementAgreementSickLeaveGuide() {
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
              <span className="text-xs text-ink truncate">Sick Leave Settlement</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Sick Leave &amp; Health Guide
            </p>
            <h1 className="sc-h1 mb-4">
              Settlement Agreement on Sick Leave: UK Employee Rights and Pay (2026 Guide)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; Equality Act 2010
            </p>
            <p className="sc-lead leading-relaxed">
              Offered a settlement agreement while signed off on sick leave? You do not have to accept, and statutory notice pay rules still protect your full pay. Check your statutory baseline in 60 seconds with no email required, see how the tax split works, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Calculator Card (Immediately below Hero) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your sick leave offer compare to the statutory baseline?"
              subtitle="Compare your employer's opening figure against your calculated statutory baseline, notice pay, and tax-free ex-gratia ranges."
              disputeType="sick_leave"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Shield', value: '£30,000', statute: 'ITEPA 2003 s.403' },
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
              <p className="text-[14px] font-semibold text-ink mb-3">Key sick leave settlement facts for 2026</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Your employer can propose a settlement agreement during sick leave, but you do not have to accept.',
                  'Under the statutory one-week rule (Sections 87 to 91 ERA 1996), you may be entitled to full normal notice pay even on Statutory Sick Pay.',
                  'Section 111A confidentiality covers ordinary unfair dismissal only. It does not apply to disability discrimination or whistleblowing.',
                  'ACAS Code 4 recommends 10 calendar days as guidance to consider terms, though an employer can withdraw an unaccepted offer before signature.',
                  'Ex-gratia termination payments are tax-free up to £30,000 under Section 403 ITEPA 2003, while notice pay is taxed as wages under Section 402D.',
                  'Statutory holiday continues to accrue during sick leave and must be paid out in full upon termination.',
                  'Employers standardly provide a capped contribution (£350 to £500+ plus VAT) toward independent legal advice upon completion; excess or abortive fees depend on your solicitor\'s terms.',
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

        {/* Section 1 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. Can an employer offer a settlement agreement while you are off sick?</h2>
            <p className="sc-body mb-4">
              Yes, an employer can legally propose a settlement agreement while you are on sick leave. They can contact you in writing or invite you to a meeting. However, you do not have to accept the offer or agree to leave.
            </p>
            <p className="sc-body mb-4">
              Many employees receive an exit proposal while signed off with stress, anxiety, depression, injury, or a long-term condition. Sickness does not remove your statutory employment rights.
            </p>
            <p className="sc-body">
              Your employer cannot penalise you for declining the offer. Your employment contract and sick pay rights remain intact.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. Why do employers propose settlement agreements during sick leave?</h2>
            <p className="sc-body mb-4">
              Managing long-term sickness absence is legally complex and time-consuming for employers. To dismiss fairly for ill-health capability under Section 98 ERA 1996 <sup>1</sup>, an employer must follow a documented process that often takes three to nine months.
            </p>
            <p className="sc-body mb-6">
              During a formal capability procedure, your employer is expected to:
            </p>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {[
                'Consult with you regularly regarding your medical condition and recovery timeline.',
                'Obtain up-to-date medical reports from your GP or an occupational health specialist.',
                'Consider whether your health condition amounts to a disability under the Equality Act 2010.',
                'Investigate and trial reasonable adjustments, such as phased returns or amended duties.',
                'Explore suitable alternative employment within the organisation before considering dismissal.',
              ].map((step) => (
                <div key={step} className="flex items-start gap-3 p-3.5 rounded-lg bg-paper border border-rule text-sm text-ink">
                  <CheckIcon />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <p className="sc-body mb-4">
              Ordinary unfair dismissal compensatory awards are capped at £123,543 or 52 weeks of gross pay under SI 2026/310 <sup>2</sup>. See our guide to <Link href="/guides/unfair-dismissal-settlement-agreements/" className="underline hover:text-ink">unfair dismissal settlement agreements</Link> or check the <Link href="/unfair-dismissal-calculator/" className="underline hover:text-ink">unfair dismissal calculator</Link>.
            </p>
            <p className="sc-body">
              Disability discrimination awards are uncapped under Section 124 Equality Act 2010 <sup>3</sup>. Offering a settlement lets an employer seek closure and avoid tribunal risk. Compare both routes in our guide to <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-ink">settlement agreements versus tribunal claims</Link>.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. How is notice pay calculated during sick leave?</h2>
            <p className="sc-body mb-4">
              Notice pay is often the most contested part of a sick leave settlement. Draft offers sometimes calculate notice using Statutory Sick Pay (SSP) or nil pay, which can conflict with statutory notice rules.
            </p>
            <p className="sc-body mb-6">
              Sections 87 to 91 of the Employment Rights Act 1996 set out the statutory &quot;one-week rule&quot; under Section 87(4) <sup>4</sup>:
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6">
              <h3 className="text-base font-semibold text-ink mb-2">How Section 87(4) protects your notice pay</h3>
              <p className="sc-body mb-3">
                Section 86 sets statutory minimum notice: one week for service between one month and two years, plus one week per complete year of service up to twelve weeks <sup>5</sup>.
              </p>
              <p className="sc-body mb-3">
                Under Section 87(4), statutory pay protection applies if your contractual notice is <strong>not at least one week longer</strong> than your statutory notice entitlement.
              </p>
              <p className="sc-body">
                When this applies, Section 88(1)(b) entitles an employee off sick to <strong>full normal contractual pay</strong> during notice, even if sick pay is exhausted.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FBF0EE] text-[#A8341F] block w-fit mb-2">Full Statutory Protection</span>
                <h4 className="text-sm font-semibold text-ink mb-2">Scenario A: Contractual notice matches statutory</h4>
                <p className="text-[14px] text-muted leading-relaxed mb-2">
                  You have five years of service (five weeks statutory notice). Your contract gives five weeks or one month of notice.
                </p>
                <p className="text-[14px] text-ink font-medium leading-relaxed">
                  Your contractual notice is not at least one week longer than statutory notice. You are entitled to 100% full pay for all five weeks.
                </p>
              </div>

              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-paper border border-rule text-ink block w-fit mb-2">Contractual Terms Apply</span>
                <h4 className="text-sm font-semibold text-ink mb-2">Scenario B: Contractual notice exceeds statutory by 1+ weeks</h4>
                <p className="text-[14px] text-muted leading-relaxed mb-2">
                  You have two years of service (two weeks statutory notice). Your contract gives three months of notice.
                </p>
                <p className="text-[14px] text-ink font-medium leading-relaxed">
                  Section 87(4) does not apply. Notice pay follows your contract unless your solicitor negotiates full notice pay in the agreement.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 flex gap-3">
              <InfoIcon />
              <p className="text-[14px] text-muted leading-relaxed">
                Sections 87 and 88 ERA 1996 set out when full normal pay applies. An independent solicitor can check whether a PILON calculation reflects your statutory entitlement. Read our guide to <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink text-ink">PILON tax treatment in 2026</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">4. When does sick leave trigger Equality Act 2010 protections?</h2>
            <p className="sc-body mb-4">
              Many conditions causing long-term sick leave meet the legal definition of a disability. Under Section 6 Equality Act 2010, a disability is a physical or mental impairment with a substantial, long-term adverse effect on day-to-day activities <sup>6</sup>.
            </p>
            <p className="sc-body mb-6">
              &quot;Long-term&quot; means it has lasted or is likely to last at least 12 months, or is recurring. Qualifying conditions often include:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                'Clinical depression, severe anxiety, and PTSD',
                'Work-related stress leading to prolonged psychiatric illness',
                'Cancer, multiple sclerosis, and HIV (protected from diagnosis)',
                'Long COVID and chronic fatigue syndrome',
                'Musculoskeletal disorders and spinal injuries',
                'Neurodivergence including autism and ADHD',
              ].map((condition) => (
                <div key={condition} className="flex items-center gap-2 p-3 rounded-lg bg-paper border border-rule text-sm text-ink font-medium">
                  <span className="w-2 h-2 rounded-full bg-coral flex-shrink-0"></span>
                  <span>{condition}</span>
                </div>
              ))}
            </div>

            <h3 className="text-base font-semibold text-ink mt-6 mb-2">Section 15: Discrimination arising from disability</h3>
            <p className="sc-body mb-4">
              Under Section 15 Equality Act 2010, an employer cannot treat you unfavourably because of something arising from your disability, such as sickness absence <sup>7</sup>.
            </p>
            <p className="sc-body mb-6">
              Dismissing or pressuring an employee because of disability-related absence can be unlawful unless the employer shows it is a proportionate means of achieving a legitimate aim.
            </p>

            <h3 className="text-base font-semibold text-ink mt-6 mb-2">Section 20: Duty to make reasonable adjustments</h3>
            <p className="sc-body mb-4">
              Under Section 20 Equality Act 2010, employers have a legal duty to consider reasonable adjustments before moving toward capability dismissal <sup>8</sup>.
            </p>
            <p className="sc-body mb-6">
              Adjustments can include a phased return, reduced hours, amended duties, or redeployment. Proposing an exit without exploring adjustments increases an employer&apos;s tribunal risk.
            </p>

            <h3 className="text-base font-semibold text-ink mt-6 mb-2">Uncapped compensation and Vento bands</h3>
            <p className="sc-body mb-4">
              Compensation for disability discrimination under Section 124 Equality Act 2010 is uncapped. Tribunals also award injury to feelings under the Ninth Addendum Vento bands (from 6 April 2026): Lower (£1,300 to £12,600), Middle (£12,600 to £37,700), Upper (£37,700 to £62,900), and Exceptional (over £62,900) <sup>9</sup>.
            </p>
            <p className="sc-body">
              Solicitors factor this exposure when assessing an offer. Read more in our guide to <Link href="/guides/discrimination-settlement-agreements/" className="underline hover:text-ink">discrimination settlement agreements</Link>.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">5. Is a sick leave settlement talk really off the record?</h2>
            <p className="sc-body mb-4">
              Employers often label exit talks as a &quot;protected conversation&quot; under Section 111A ERA 1996 <sup>10</sup>. Under UK law, Section 111A confidentiality has strict boundaries.
            </p>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">1. Section 111A excludes discrimination and whistleblowing</h3>
            <p className="sc-body mb-4">
              Section 111A(1) applies strictly to ordinary unfair dismissal claims. Under Section 111A(3), it does not cover Equality Act 2010 discrimination, whistleblowing (s.43B/s.103A ERA 1996), or breach of contract.
            </p>
            <p className="sc-body mb-6">
              If your condition qualifies as a disability, pre-termination talks may be admissible in a discrimination claim unless common law Without Prejudice privilege applies.
            </p>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">2. Improper behaviour and deadline rules</h3>
            <p className="sc-body mb-4">
              Under Section 111A(4), confidentiality is lost if an employer engages in &quot;improper behaviour&quot;, such as:
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              {[
                'Pressuring you to sign while medically unfit or heavily medicated.',
                'Setting an unreasonable deadline, such as 24 or 48 hours (ACAS Code 4 recommends 10 calendar days as general guidance).',
                'Threatening to stop sick pay or dismiss you immediately if you decline.',
                'Contacting you repeatedly despite fit notes advising against work contact.',
              ].map((behaviour) => (
                <li key={behaviour} className="flex items-start gap-2 text-sm text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0"></span>
                  <span>{behaviour}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              Note that while ACAS Code 4 recommends 10 calendar days as guidance, under English contract law (<em>Routledge v Grant</em>) an employer can withdraw an unaccepted offer before signature, and a counter-offer can extinguish the original offer (<em>Hyde v Wrench</em>). Avoid sending unreviewed financial proposals directly to HR, as unreviewed emails can waive legal privilege.
            </p>
            <p className="sc-body">
              Read more in our guides to <Link href="/guides/pressured-to-sign/" className="underline hover:text-ink">employer pressure and the ACAS 10-day rule</Link> and <Link href="/guides/protected-conversations-without-prejudice/" className="underline hover:text-ink">protected conversations and without prejudice rules</Link>.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">6. What rights do you have over medical reports (AMRA 1988)?</h2>
            <p className="sc-body mb-4">
              During sick leave, employers often ask to contact your GP or arrange an occupational health assessment. You have clear statutory rights under the Access to Medical Reports Act 1988 (AMRA) <sup>11</sup>:
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-base font-semibold text-ink mb-3">Your legal rights under AMRA 1988</h3>
              <ul className="flex flex-col gap-3">
                {[
                  'Your employer cannot contact your GP or specialist without your explicit written consent.',
                  'You have the right to inspect the medical report before it is sent to your employer.',
                  'You can ask your doctor to amend or delete information you consider incorrect.',
                  'You can withdraw consent at any time before the report is supplied.',
                ].map((right) => (
                  <li key={right} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{right}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="sc-body">
              An employer can request an occupational health assessment, though they cannot force attendance if your doctor advises it would harm your health. Agreeing an exit also removes the need for further medical reviews.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">7. How does a settlement compare with capability dismissal?</h2>
            <p className="sc-body mb-6">
              Compare how each route affects your pay, timeline, and tribunal rights:
            </p>

            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Comparison of a settlement agreement versus a formal capability dismissal during sick leave.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Feature</th>
                    <th className="text-left px-4 py-3 font-medium">Settlement Agreement</th>
                    <th className="text-left px-4 py-3 font-medium">Capability Dismissal</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Outcome', 'Mutually agreed exit package', 'Unilateral dismissal by employer'],
                    ['Timeline', 'Typically 1 to 3 weeks', '3 to 9 months of capability hearings'],
                    ['Financial package', 'Ex-gratia compensation + notice pay (or garden leave)', 'Contractual or statutory notice pay only'],
                    ['Tax advantages', 'Up to £30,000 tax-free under ITEPA s.403', 'No tax-free compensation package'],
                    ['Future reference', 'Agreed written reference schedule', 'Standard factual reference'],
                    ['Legal fees', 'Capped employer contribution (£350 to £500+ plus VAT upon completion)', 'You pay own legal costs if appealing'],
                    ['Tribunal claims', 'Legal claims waived upon signing', 'Claims possible within 3 months less 1 day'],
                  ].map(([feature, settlement, capability], i) => (
                    <tr key={feature} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{feature}</td>
                      <td className="px-4 py-3 text-ink font-semibold">{settlement}</td>
                      <td className="px-4 py-3 text-muted">{capability}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 mt-6">
              <h3 className="text-base font-semibold text-ink mb-2">Unsure whether to accept or decline?</h3>
              <p className="sc-body mb-3">
                Declining a settlement offer does not mean immediate dismissal. Your employer must continue your contractual sick pay and follow a fair capability process.
              </p>
              <p className="sc-body">
                Read more in our guides on <Link href="/guides/what-happens-if-you-do-not-sign/" className="underline hover:text-ink">what happens if you do not sign</Link> and <Link href="/guides/is-my-settlement-offer-fair/" className="underline hover:text-ink">how to tell if your offer is fair</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">8. How are sick leave settlement payments taxed?</h2>
            <p className="sc-body mb-6">
              Each part of a settlement package is taxed differently. A clear draft agreement separates tax-free compensation from sums taxed as wages:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FBF0EE] text-[#A8341F] block w-fit mb-2">Tax-Free up to £30,000</span>
                <h3 className="text-sm font-semibold text-ink mb-2">Ex-Gratia Termination Payment</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-2">
                  Under Section 403 ITEPA 2003, genuine compensation for loss of employment (combined with any eligible statutory redundancy pay under s.141 ERA 1996) is tax-free up to £30,000 <sup>12</sup>.
                </p>
                <p className="text-[14px] text-muted leading-relaxed">
                  Amounts above £30,000 are subject to Income Tax and Employer Class 1A NIC.
                </p>
              </div>

              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-paper border border-rule text-ink block w-fit mb-2">Taxed as Wages</span>
                <h3 className="text-sm font-semibold text-ink mb-2">Notice Pay (PILON / Garden Leave)</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-2">
                  Under Section 402D ITEPA 2003, Pay in Lieu of Notice is Post-Employment Notice Pay (PENP) <sup>13</sup>.
                </p>
                <p className="text-[14px] text-muted leading-relaxed">
                  Unworked notice pay is always taxed as wages with Income Tax and Class 1 National Insurance deducted.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Accrued Holiday Pay and Sick Pay Arrears</h3>
              <p className="sc-body mb-2">
                Under Regulations 13 and 13A Working Time Regulations 1998, workers accrue 5.6 weeks of paid annual leave per year, even while off sick (<em>Stringer v HMRC</em>) <sup>14</sup><sup>,</sup><sup>15</sup>.
              </p>
              <p className="sc-body">
                All outstanding holiday pay and sick pay arrears are paid on exit and taxed as wages under PAYE.
              </p>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 flex gap-3">
              <InfoIcon />
              <p className="text-[14px] text-muted leading-relaxed">
                Compensation paid solely for pre-termination disability discrimination (wholly unconnected with the exit) falls outside s.401 ITEPA 2003 and is tax-free outside the £30,000 limit. Termination-related injury to feelings counts toward the £30,000 limit, and s.406(2) excludes non-psychiatric injury. Read our guide to the <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink text-ink">£30,000 settlement tax exemption</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">9. What are the practical steps if you are offered a settlement off sick?</h2>
            <p className="sc-body mb-6">
              This sequence outlines how employees typically prepare for an independent solicitor review:
            </p>

            <ol className="relative border-l-2 border-rule ml-4 pl-6 flex flex-col gap-6">
              {[
                {
                  step: '1',
                  title: 'Request the proposal in writing',
                  desc: 'Avoid committing to terms verbally on a phone call. Ask HR to email the draft agreement and financial breakdown.',
                },
                {
                  step: '2',
                  title: 'Confirm your sick pay and accrued holiday',
                  desc: 'Check recent payslips and calculate any unpaid sick pay and accrued statutory holiday owed up to your exit date.',
                },
                {
                  step: '3',
                  title: 'Check your notice rights under the one-week rule',
                  desc: 'Compare your contractual notice with statutory notice to see if Sections 87 to 91 ERA 1996 entitle you to full normal pay.',
                },
                {
                  step: '4',
                  title: 'Assess whether your condition qualifies as a disability',
                  desc: 'Consider whether your condition meets the Section 6 Equality Act 2010 definition, as this affects tribunal risk.',
                },
                {
                  step: '5',
                  title: 'Instruct an independent employment solicitor',
                  desc: (
                    <>
                      Under Section 203(3) ERA 1996, independent advice is mandatory. Employers standardly contribute £350 to £500+ plus VAT upon completion; excess or abortive costs depend on your solicitor&apos;s engagement terms. You <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-ink">do not have to use your employer&apos;s recommended solicitor</Link>, and you can <Link href="/get-matched/" className="underline hover:text-ink">get matched with an SRA-regulated solicitor</Link> via our panel.
                    </>
                  ),
                },
                {
                  step: '6',
                  title: 'Review ex-gratia pay, non-compete clauses, and reference wording',
                  desc: (
                    <>
                      Your solicitor can review notice pay, ex-gratia compensation, any non-compete restrictions, and an agreed reference schedule. See <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="underline hover:text-ink">how settlement talks work</Link>.
                    </>
                  ),
                },
                {
                  step: '7',
                  title: 'Complete only once your solicitor certifies the agreement',
                  desc: 'Sign only once your solicitor confirms the tax split, payment dates, and adviser certificate under s.203(3) ERA 1996.',
                },
              ].map(({ step, title, desc }) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-ink text-white text-xs font-mono flex items-center justify-center font-bold">
                    {step}
                  </span>
                  <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
                  <div className="sc-body text-sm">{desc}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 10: Official independent resources */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Official independent resources</h2>
            <p className="sc-body mb-6">
              Access free, impartial guidance on sick leave and employment rights from official UK statutory bodies:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'ACAS (Advisory, Conciliation and Arbitration Service)',
                  desc: 'Free, impartial guidance on sickness absence, settlement agreements, and early conciliation.',
                  url: 'https://www.acas.org.uk',
                },
                {
                  name: 'Equality Advisory and Support Service (EASS)',
                  desc: 'Official government helpline advising on disability discrimination under the Equality Act 2010.',
                  url: 'https://www.equalityadvisoryservice.com',
                },
                {
                  name: 'GOV.UK Statutory Sick Pay',
                  desc: 'Official government guidance on SSP eligibility, rates, and employer obligations.',
                  url: 'https://www.gov.uk/statutory-sick-pay',
                },
                {
                  name: 'Legislation.gov.uk',
                  desc: 'Access original UK statutes including the Employment Rights Act 1996 and SI 2026/310.',
                  url: 'https://www.legislation.gov.uk',
                },
              ].map(({ name, desc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-rule bg-paper p-5 hover:border-ink transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-1">{name}</h3>
                    <p className="text-[14px] text-muted mb-3">{desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-coral-ink">Visit official site &rarr;</span>
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
              See your calculated statutory baseline, notice pay entitlement, and tax-free allowance before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculator/?reason=mutual" className="btn-accent">
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
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-10 bg-white border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your settlement offer against 2026 statutory rates and tax exemptions.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/discrimination-settlement-agreements/',
                  title: 'Discrimination Settlement Agreements UK',
                  description: 'Learn how disability discrimination creates uncapped compensation and Vento awards.',
                  tag: 'Equality Act 2010',
                },
                {
                  href: '/guides/protected-conversations-without-prejudice/',
                  title: 'Protected Conversations & Without Prejudice',
                  description: 'Understand Section 111A confidentiality limits and improper behaviour rules.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens If You Do Not Sign?',
                  description: 'Evaluate your options if you decline an offer, including capability procedure rights.',
                  tag: 'Options',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How UK settlement talks work, tax splits, and legal fee contributions.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax on Settlement Agreements: £30,000 Rule',
                  description: 'How the £30,000 exemption works under ITEPA Section 403 and what qualifies as tax-free.',
                  tag: 'Tax Rules',
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
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/98" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 98 (general fairness and capability dismissals)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Equality Act 2010, Section 124 (tribunal remedies and uncapped compensation)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/87" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Sections 87 to 91 (rights of employee in period of notice)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/86" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 86 (statutory minimum notice periods)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/6" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Equality Act 2010, Section 6 (statutory definition of disability)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/15" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Equality Act 2010, Section 15 (discrimination arising from disability)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/20" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Equality Act 2010, Section 20 (duty to make reasonable adjustments)
                </a>
              </li>
              <li>
                <span className="text-muted">
                  Presidential Guidance: Employment Tribunal awards for injury to feelings (Ninth Addendum, applicable from 6 April 2026)
                </span>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (confidentiality of pre-termination negotiations)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1988/28/contents" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Access to Medical Reports Act 1988 (employee consent and rights of inspection)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 threshold for payments on termination)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (post-employment notice pay rules)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/1998/1833/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Working Time Regulations 1998, Regulations 13 and 13A (statutory annual leave entitlements)
                </a>
              </li>
              <li>
                <span className="text-muted">
                  <em>Stringer and others v HM Revenue and Customs</em> (Case C-520/06) (holiday accrual during sickness absence)
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-[14px] text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent information service and calculator platform, not a law firm. The content on this page is for general information only and does not constitute formal legal counsel.
        </p>
      </main>
      <Footer />
    </>
  )
}
