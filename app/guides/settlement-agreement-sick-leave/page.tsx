import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement on Sick Leave: UK Rights & Pay (2026)',
  description:
    'Off sick and offered a settlement agreement? Learn your 2026 UK pay rights, full notice pay rules, £30,000 tax relief, and why your employer covers your fees.',
  alternates: {
    canonical: '/guides/settlement-agreement-sick-leave/',
  },
  openGraph: {
    title: 'Settlement Agreement on Sick Leave: UK Rights & Pay (2026)',
    description:
      'Off sick and offered a settlement agreement? Learn your 2026 UK pay rights, full notice pay rules, £30,000 tax relief, and why your employer covers your fees.',
    url: '/guides/settlement-agreement-sick-leave/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement on Sick Leave: UK Rights & Pay (2026)',
    description:
      'Off sick and offered a settlement agreement? Learn your 2026 UK pay rights, full notice pay rules, £30,000 tax relief, and why your employer covers your fees.',
  },
}

const FAQS = [
  {
    q: 'Can my employer force me to attend a settlement meeting while I am off sick?',
    a: 'No. Your employer cannot force you to attend meetings while signed off sick by your GP. If you are medically unfit, inform your employer in writing. You can ask for communications to remain in writing or instruct an independent solicitor to speak for you.',
  },
  {
    q: 'What happens if I reject a settlement agreement while on sick leave?',
    a: 'If you reject the offer, your employment contract continues as normal. Your employer must continue paying any sick pay you are entitled to. They must follow formal capability procedures if they wish to manage your absence, and cannot dismiss you simply for declining an offer.',
  },
  {
    q: 'Am I entitled to full pay during my notice period if I am on Statutory Sick Pay?',
    a: 'Under Sections 87 to 91 of the Employment Rights Act 1996, you are entitled to full normal pay during notice if your contractual notice is not at least one week longer than statutory notice. If your contract provides greater notice, pay depends on contractual terms, but your solicitor can negotiate full pay in the agreement.',
  },
  {
    q: 'Does my employer pay for my solicitor while I am on sick leave?',
    a: 'Yes. For any settlement agreement to be legally binding under Section 203(3) of the Employment Rights Act 1996, you must receive independent legal advice. Your employer covers this fee, typically contributing between £350 and £750 plus VAT directly to your solicitor.',
  },
  {
    q: 'How does sickness affect the calculation of my accrued holiday pay?',
    a: 'You continue to accrue statutory annual leave (5.6 weeks per year) throughout your sick leave under the Working Time Regulations 1998. If illness prevented you from taking your leave, your entitlement carries over. When your employment ends, all accrued, untaken holiday must be paid out in full at your normal pay rate.',
  },
  {
    q: 'Can my employer dismiss me for capability while we are negotiating?',
    a: 'An employer must follow a fair, documented procedure before any capability dismissal. This includes medical evidence, consultations, and exploring reasonable adjustments. Threatening immediate dismissal to force you to sign an agreement is improper behaviour under Section 111A(4) of the Employment Rights Act 1996 and removes confidentiality.',
  },
  {
    q: 'How much compensation should I expect in a sick leave settlement?',
    a: 'A typical settlement package includes full notice pay, accrued untaken holiday pay, and an ex-gratia compensation sum representing one to six months of gross salary. If your illness qualifies as a disability under the Equality Act 2010, the settlement should also reflect potential tribunal awards under the Vento bands, which range from £1,300 to over £62,900.',
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
              <span className="text-xs text-ink truncate">Sick Leave Settlement</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Sick Leave &amp; Health Guide
            </p>
            <h1 className="sc-h1 mb-5">
              Settlement Agreement on Sick Leave: UK Employee Rights and Pay (2026 Guide)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; ERA 1996)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              Under UK employment law, your employer can legally offer you a settlement agreement while you are on sick leave. You are under no obligation to accept the offer or leave your job. In 2026, a fair settlement should include full normal pay for your notice period under Sections 87 to 91 of the Employment Rights Act 1996. This applies even if you currently receive Statutory Sick Pay or nil pay. Genuine termination compensation is tax-free up to £30,000 under Section 403 of ITEPA 2003. Your employer covers the cost of your independent legal advice. You can check what your exit package should look like using our <Link href="/calculator/" className="underline hover:text-ink">free settlement calculator</Link>.
            </p>
          </div>
        </section>

        {/* Core facts callout box */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key sick leave settlement facts for 2026</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Your employer can propose a settlement agreement during sick leave, but you do not have to accept.',
                  'Under the statutory one-week rule in Sections 87 to 91 of the Employment Rights Act 1996, you are entitled to full normal notice pay, even on Statutory Sick Pay.',
                  'Section 111A confidentiality does not apply to discrimination claims. If your illness qualifies as a disability, pre-termination talks are not secret.',
                  'Ex-gratia termination payments are tax-free up to £30,000 under Section 403 of ITEPA 2003.',
                  'Notice pay (PILON) is fully taxable as earnings under Section 402D of ITEPA 2003.',
                  'You continue to accrue statutory holiday entitlement while on sick leave, which must be paid out in full upon exit.',
                  'Your employer covers the legal fees for your independent solicitor, typically contributing £350 to £750 plus VAT.',
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

        {/* Section: Can an employer offer a settlement agreement while on sick leave? */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Can an employer offer a settlement agreement while on sick leave?</h2>
            <p className="sc-body mb-4">
              Yes, an employer can legally propose a settlement agreement while you are on sick leave. They can contact you in writing or hold a meeting. However, you do not have to accept the offer, sign the document, or agree to leave. Sickness does not remove your statutory employment rights.
            </p>
            <p className="sc-body mb-4">
              Receiving an exit proposal while dealing with a health condition can feel overwhelming. Many employees are signed off work with stress, depression, anxiety, physical injury, or a long-term condition.
            </p>
            <p className="sc-body">
              Your employer cannot penalise you for refusing the proposal. You remain an employee with all contractual rights intact.
            </p>
          </div>
        </section>

        {/* Section: Why employers propose settlement agreements during sick leave */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Why employers propose settlement agreements during sick leave</h2>
            <p className="sc-body mb-4">
              Employers often prefer a settlement agreement because managing long-term sickness absence is legally complex and time-consuming.
            </p>
            <p className="sc-body mb-4">
              To dismiss an employee fairly on grounds of ill health, an employer must follow a rigorous capability procedure under Section 98 of the Employment Rights Act 1996 <sup>1</sup>. This process typically takes between three and nine months.
            </p>
            <p className="sc-body mb-6">
              During a capability procedure, your employer must:
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
              If an employer rushes this process, they face significant employment tribunal risks. Ordinary unfair dismissal compensatory awards are capped at £123,543 or 52 weeks of gross pay under SI 2026/310 <sup>2</sup>. You can explore how tribunals assess these claims in our guide to <Link href="/guides/unfair-dismissal-settlement-agreements/" className="underline hover:text-ink">unfair dismissal settlement agreements</Link> or estimate potential awards with the <Link href="/unfair-dismissal-calculator/" className="underline hover:text-ink">unfair dismissal calculator</Link>.
            </p>
            <p className="sc-body">
              Disability discrimination claims are completely uncapped under Section 124 of the Equality Act 2010 <sup>3</sup>. By offering a settlement agreement, your employer seeks to avoid procedural delays, legal uncertainty, and tribunal risk. You can compare both pathways in our detailed comparison of <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-ink">settlement agreements versus employment tribunal claims</Link>.
            </p>
          </div>
        </section>

        {/* Section: Notice pay on sick leave - The one-week rule */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Notice pay on sick leave: the statutory one-week rule</h2>
            <p className="sc-body mb-4">
              Notice pay is one of the most contentious elements of a sick leave settlement. Employers often calculate notice pay using your current sick pay rate, such as Statutory Sick Pay (SSP) or nil pay. In many cases, this calculation is legally incorrect.
            </p>
            <p className="sc-body mb-4">
              Sections 87 to 91 of the Employment Rights Act 1996 establish statutory pay protections during notice periods <sup>4</sup>.
            </p>
            <p className="sc-body mb-6">
              The crucial legal test is the statutory &quot;one-week rule&quot; set out in Section 87(4) of the Employment Rights Act 1996:
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6">
              <h3 className="text-base font-semibold text-ink mb-2">How Section 87(4) protects your notice pay</h3>
              <p className="sc-body text-sm mb-3">
                Section 86 sets statutory minimum notice: one week for service between one month and two years, plus one additional week for each complete year of service up to twelve weeks <sup>5</sup>.
              </p>
              <p className="sc-body text-sm mb-3">
                Under Section 87(4), statutory pay protections apply if your contractual notice is <strong>not at least one week longer</strong> than your statutory notice entitlement.
              </p>
              <p className="sc-body text-sm">
                When this condition is met, Section 88(1)(b) states that an employee incapable of work due to sickness is entitled to <strong>full normal contractual pay</strong> for their notice period. This applies even if you have exhausted contractual sick pay and receive only SSP or zero pay.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-rule bg-paper p-5">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sage-tint text-sage block w-fit mb-2">Full Pay Guaranteed</span>
                <h4 className="text-sm font-semibold text-ink mb-2">Scenario A: Contractual notice matches statutory notice</h4>
                <p className="sc-body text-xs text-muted mb-2">
                  You have five years of service (five weeks statutory notice). Your contract requires five weeks or one month of notice.
                </p>
                <p className="sc-body text-xs text-ink font-medium">
                  Your contractual notice is not at least one week longer than statutory notice. You are legally entitled to 100% full pay for all five weeks of notice.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-tint text-amber block w-fit mb-2">Negotiation Required</span>
                <h4 className="text-sm font-semibold text-ink mb-2">Scenario B: Contractual notice exceeds statutory by 1+ weeks</h4>
                <p className="sc-body text-xs text-muted mb-2">
                  You have two years of service (two weeks statutory notice). Your contract requires three months of notice.
                </p>
                <p className="sc-body text-xs text-ink font-medium">
                  Section 87(4) excludes you from statutory full pay. Notice follows your contract, but your solicitor will negotiate full pay in the settlement agreement.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                If your employer calculates your Pay in Lieu of Notice (PILON) using SSP or nil pay, point out Sections 87 and 88 of the Employment Rights Act 1996. Your independent solicitor will ensure your notice pay reflects your true legal entitlement. Read our guide to <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax treatment in 2026</Link> to understand how notice pay is taxed.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Disability discrimination protections */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Disability discrimination protections under the Equality Act 2010</h2>
            <p className="sc-body mb-4">
              Many health conditions that cause long-term sick leave meet the legal definition of a disability under UK law.
            </p>
            <p className="sc-body mb-4">
              Under Section 6 of the Equality Act 2010, a disability is defined as a physical or mental impairment that has a substantial and long-term adverse effect on your ability to carry out normal day-to-day activities <sup>6</sup>.
            </p>
            <p className="sc-body mb-6">
              An effect is considered &quot;long-term&quot; if it has lasted for at least 12 months, is likely to last for at least 12 months, or is recurring. Conditions that frequently qualify include:
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
              Under Section 15 of the Equality Act 2010, your employer cannot treat you unfavourably because of something arising in consequence of your disability <sup>7</sup>. Sickness absence is a direct consequence of your illness.
            </p>
            <p className="sc-body mb-6">
              If your employer initiates dismissal proceedings or pressures you to resign because of your absence, this can constitute unlawful discrimination. The employer can only defend this if they demonstrate that their action is an objective, proportionate means of achieving a legitimate aim.
            </p>

            <h3 className="text-base font-semibold text-ink mt-6 mb-2">Section 20: Duty to make reasonable adjustments</h3>
            <p className="sc-body mb-4">
              Under Section 20 of the Equality Act 2010, employers have an active legal duty to make reasonable adjustments <sup>8</sup>. This duty arises before considering an employee for capability dismissal.
            </p>
            <p className="sc-body mb-6">
              Adjustments may include a phased return to work, reduced hours, adjusted duties, working from home, or transferring to an open role. If your employer proposes a settlement without exploring adjustments, their legal exposure increases significantly.
            </p>

            <h3 className="text-base font-semibold text-ink mt-6 mb-2">Uncapped compensation and Vento bands</h3>
            <p className="sc-body mb-4">
              Unlike ordinary unfair dismissal, compensation for disability discrimination under Section 124 of the Equality Act 2010 is uncapped.
            </p>
            <p className="sc-body mb-4">
              Tribunals also award compensation for injury to feelings based on the Ninth Addendum Vento bands (applicable from 6 April 2026): Lower Band (£1,300 to £12,600), Middle Band (£12,600 to £37,700), Upper Band (£37,700 to £62,900), and Exceptional Cases (exceeding £62,900) <sup>9</sup>.
            </p>
            <p className="sc-body">
              This potential uncapped exposure provides strong justification for an enhanced financial settlement. Read our comprehensive guide on <Link href="/guides/discrimination-settlement-agreements/" className="underline hover:text-ink">discrimination settlement agreements</Link> for further detail.
            </p>
          </div>
        </section>

        {/* Section: Why Section 111A protected conversations do not protect employers */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Why Section 111A protected conversations do not protect employers during sick leave</h2>
            <p className="sc-body mb-4">
              When proposing an exit, employers often label discussions as a &quot;protected conversation&quot; under Section 111A of the Employment Rights Act 1996 <sup>10</sup>.
            </p>
            <p className="sc-body mb-4">
              Many employers believe this label guarantees total confidentiality. Under UK law, Section 111A confidentiality has strict limits.
            </p>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">1. Section 111A does not apply to discrimination claims</h3>
            <p className="sc-body mb-4">
              Section 111A confidentiality applies solely to ordinary unfair dismissal claims. Under Section 111A(4), it does not apply to claims brought under the Equality Act 2010, whistleblowing disclosures, or breach of contract.
            </p>
            <p className="sc-body mb-6">
              If your health condition is a qualifying disability, the settlement meeting is not protected. You can refer to everything your employer said or proposed in an employment tribunal claim.
            </p>

            <h3 className="text-sm font-semibold text-ink mt-6 mb-2">2. Improper behaviour removes all confidentiality</h3>
            <p className="sc-body mb-4">
              Under Section 111A(4), confidentiality is void if an employer engages in &quot;improper behaviour&quot;.
            </p>
            <p className="sc-body mb-4">
              Examples of improper behaviour during sick leave include:
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              {[
                'Pressuring you to sign while you are medically unfit or heavily medicated.',
                'Giving you an unreasonably short deadline, such as 24 or 48 hours. The ACAS Code of Practice recommends a minimum of 10 calendar days.',
                'Threatening to stop your sick pay or fire you immediately if you decline the offer.',
                'Contacting you repeatedly despite medical notes stating you are unfit for work-related contact.',
              ].map((behaviour) => (
                <li key={behaviour} className="flex items-start gap-2 text-sm text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0"></span>
                  <span>{behaviour}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body">
              If your employer acts improperly or pressures you to accept without adequate time, their confidentiality disappears. You can learn more in our guides to <Link href="/guides/pressured-to-sign/" className="underline hover:text-ink">employer pressure and the ACAS 10-day rule</Link> and <Link href="/guides/protected-conversations-without-prejudice/" className="underline hover:text-ink">protected conversations and without prejudice rules</Link>.
            </p>
          </div>
        </section>

        {/* Section: Medical reports and AMRA 1988 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Medical reports and the Access to Medical Reports Act 1988</h2>
            <p className="sc-body mb-4">
              During sickness absence, employers frequently ask to contact your GP or send you to an occupational health doctor.
            </p>
            <p className="sc-body mb-6">
              You have clear statutory rights regarding your private medical information under the Access to Medical Reports Act 1988 (AMRA) <sup>11</sup>:
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-base font-semibold text-ink mb-3">Your legal rights under AMRA 1988</h3>
              <ul className="flex flex-col gap-3">
                {[
                  'Your employer cannot contact your GP or medical specialist without your explicit written consent.',
                  'You have the legal right to inspect the medical report before it is sent to your employer.',
                  'You can request that your doctor amend or delete any information you consider incorrect or misleading.',
                  'You have the right to withdraw your consent at any time before the report is supplied to your employer.',
                ].map((right) => (
                  <li key={right} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{right}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="sc-body mb-4">
              An employer can ask you to attend an occupational health assessment. While they can request this, they cannot force you to attend if your doctor advises that doing so would harm your health.
            </p>
            <p className="sc-body">
              One advantage of negotiating a settlement agreement is that it removes the need for stressful medical examinations. Once financial terms are agreed, further medical investigations cease.
            </p>
          </div>
        </section>

        {/* Comparison table: Settlement vs Capability Dismissal */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Settlement Agreement vs Capability Dismissal on Sick Leave</h2>
            <p className="sc-body mb-6">
              Compare the two primary routes an employer can take when an employee is on prolonged sick leave:
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
                    ['Financial package', 'Enhanced ex-gratia compensation + full notice pay', 'Contractual or statutory notice pay only'],
                    ['Tax advantages', 'Up to £30,000 tax-free under ITEPA s.403', 'No tax-free compensation package'],
                    ['Future reference', 'Agreed, binding written reference clause', 'Standard factual reference noting dismissal'],
                    ['Legal fees', 'Your employer covers the legal fees (£350 to £750+ VAT)', 'You pay own legal costs if appealing'],
                    ['Stress level', 'Immediate closure, focus on health recovery', 'Prolonged meetings, warnings, and uncertainty'],
                    ['Tribunal claims', 'All legal claims waived upon signing', 'You can lodge tribunal claims within 3 months less 1 day'],
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
              <p className="sc-body text-sm mb-3">
                Declining a settlement offer does not mean immediate termination. Your employer must continue your contractual sick pay and follow a fair capability investigation.
              </p>
              <p className="sc-body text-sm">
                Explore your strategic choices in our guides on <Link href="/guides/what-happens-if-you-do-not-sign/" className="underline hover:text-ink">what happens if you do not sign a settlement agreement</Link> and <Link href="/guides/is-my-settlement-offer-fair/" className="underline hover:text-ink">how to tell if your settlement offer is fair</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Tax treatment of sick leave settlements */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax treatment of sick leave settlement payments</h2>
            <p className="sc-body mb-4">
              Settlement payments consist of different financial components. Each component is treated differently for tax and National Insurance purposes.
            </p>
            <p className="sc-body mb-6">
              A well-drafted settlement agreement clearly separates these elements:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-rule bg-paper p-5">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sage-tint text-sage block w-fit mb-2">Tax-Free up to £30,000</span>
                <h3 className="text-sm font-semibold text-ink mb-2">Ex-Gratia Termination Payment</h3>
                <p className="sc-body text-xs text-muted mb-2">
                  Under Section 403 of ITEPA 2003, genuine compensation for loss of employment is exempt from income tax and National Insurance up to £30,000 <sup>12</sup>.
                </p>
                <p className="sc-body text-xs text-muted">
                  Any excess above £30,000 is subject to income tax and employer National Insurance.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-tint text-amber block w-fit mb-2">Fully Taxable</span>
                <h3 className="text-sm font-semibold text-ink mb-2">Notice Pay (PILON)</h3>
                <p className="sc-body text-xs text-muted mb-2">
                  Under Section 402D of ITEPA 2003, Pay in Lieu of Notice is classified as Post-Employment Notice Pay (PENP) <sup>13</sup>.
                </p>
                <p className="sc-body text-xs text-muted">
                  Your employer must deduct standard income tax and Class 1 National Insurance from all notice pay.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink mb-2">Accrued Holiday Pay and Sick Pay Arrears</h3>
              <p className="sc-body text-sm mb-2">
                Under Regulation 13 and 13A of the Working Time Regulations 1998, workers are entitled to 5.6 weeks of paid annual leave per year <sup>14</sup>.
              </p>
              <p className="sc-body text-sm mb-2">
                You continue to accrue statutory holiday while off sick. If your illness prevented you from taking holiday, it carries forward under retained case law (such as <em>Stringer v HM Revenue and Customs</em>) <sup>15</sup>.
              </p>
              <p className="sc-body text-sm">
                All outstanding holiday pay and sick pay arrears must be paid in full upon departure. These sums are treated as normal earnings and taxed under PAYE.
              </p>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                If your settlement includes compensation for pre-termination disability discrimination, that portion is 100% tax-free under Section 406 of ITEPA 2003, outside the £30,000 limit. Learn more in our complete guide to the <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">£30,000 settlement tax exemption</Link> and read our benchmark analysis of <Link href="/guides/average-settlement-agreement-payout-uk/" className="underline hover:text-ink">average UK settlement agreement payouts</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Process snippet (Numbered list) */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What to do if you are offered a settlement agreement while off sick</h2>
            <p className="sc-body mb-6">
              Follow this step-by-step process to protect your rights, verify your pay, and achieve fair exit terms:
            </p>

            <ol className="relative border-l-2 border-rule ml-4 pl-6 flex flex-col gap-6">
              {[
                {
                  step: '1',
                  title: 'Request the proposal in writing',
                  desc: 'Do not accept or reject anything verbally during an unexpected phone call or meeting. Ask your employer to email the draft agreement and financial breakdown.',
                },
                {
                  step: '2',
                  title: 'Confirm your sick pay and accrued holiday',
                  desc: 'Check your payslips. Calculate your outstanding statutory holiday balance and any unpaid sick pay owed to your termination date.',
                },
                {
                  step: '3',
                  title: 'Check your statutory notice rights under the one-week rule',
                  desc: 'Review your continuous service and contract length. Determine whether Sections 87 to 91 of the Employment Rights Act 1996 entitle you to full normal pay for your notice period.',
                },
                {
                  step: '4',
                  title: 'Assess whether your condition qualifies as a disability',
                  desc: 'Review whether your condition meets the Section 6 Equality Act 2010 definition. A potential disability discrimination claim gives you substantial negotiating strength.',
                },
                {
                  step: '5',
                  title: 'Appoint an independent employment solicitor',
                  desc: (
                    <>
                      Under Section 203(3) of the Employment Rights Act 1996, independent legal advice is mandatory. Your employer covers the legal fees, paying your solicitor directly. Remember that you <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-ink">do not have to use your employer's recommended solicitor</Link>. You can <Link href="/get-matched/" className="underline hover:text-ink">get matched with a specialist employment solicitor</Link> through our panel.
                    </>
                  ),
                },
                {
                  step: '6',
                  title: 'Negotiate enhanced compensation and an agreed reference',
                  desc: (
                    <>
                      Your solicitor will negotiate improved ex-gratia compensation, full notice pay, an agreed reference, and appropriate non-derogatory clauses. Follow our proven strategies in <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="underline hover:text-ink">how to negotiate a settlement agreement</Link>.
                    </>
                  ),
                },
                {
                  step: '7',
                  title: 'Sign only when satisfied and medically ready',
                  desc: 'Take the necessary time to review the final document. Sign only once your solicitor confirms that all tax terms and payment dates are fully protected.',
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

        {/* Section: Official independent resources */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Official independent resources</h2>
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
                    <p className="sc-body text-xs text-muted mb-3">{desc}</p>
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
            <h2 className="sc-section-h2 text-white mb-4">Check your settlement offer now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Evaluate your offer against 2026 statutory caps (£751 weekly cap), calculate your notice pay, and verify your tax-free allowance.
            </p>
            <Link href="/calculator/" className="btn-accent">
              Calculate my settlement now &rarr;
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
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
                  tag: 'Strategy',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Proven negotiation strategies, counter-offer tactics, and non-financial clauses.',
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
        <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent information service and calculator platform, not a law firm. The content on this page is for general information only and does not constitute formal legal counsel. Use our free calculator to evaluate your settlement offer.
        </p>
      </main>
      <Footer />
    </>
  )
}
