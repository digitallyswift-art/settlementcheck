import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import InteractiveToolHook from '@/components/InteractiveToolHook'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
  description:
    'Understand agreed reference rights in a UK settlement agreement, standard factual wording, oral inquiry clauses, and how independent solicitors review terms.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
  },
  openGraph: {
    title: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
    description:
      'Understand agreed reference rights in a UK settlement agreement, standard factual wording, oral inquiry clauses, and how independent solicitors review terms.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
    description:
      'Agreed reference rights in UK settlement agreements, oral inquiry clauses, and Section 203 solicitor reviews.',
  },
}

const FAQS = [
  {
    q: 'Is an employer legally required to give a reference in the UK?',
    a: 'No. Under UK common law, an employer has no general statutory duty to provide a job reference. However, once a settlement agreement is signed, the agreed reference schedule becomes a binding contract term.',
  },
  {
    q: 'Will a basic factual reference look suspicious to future employers?',
    a: 'No. Most large UK employers maintain policies of providing only factual references confirming your job title, start date, and end date. Recruiters and HR teams treat factual references as standard corporate compliance.',
  },
  {
    q: 'Can my employer give a bad oral reference after signing a settlement agreement?',
    a: 'An oral inquiry clause can restrict verbal commentary. Your solicitor can check that the draft directs all reference requests to HR and requires any oral response to match the agreed written schedule.',
  },
  {
    q: 'What happens if my employer breaches the agreed reference clause?',
    a: 'If your employer refuses to provide the agreed text or gives a contradictory reference, they may commit a breach of contract. Remedies can include damages for proven financial loss if a job offer is withdrawn.',
  },
  {
    q: 'What reason for leaving is usually stated in an agreed reference?',
    a: 'Common neutral options include "resignation by mutual agreement" or "redundancy". Where a standard factual reference is used, the reason for leaving is often omitted altogether.',
  },
  {
    q: 'Who pays the legal fees to review my agreed reference clause?',
    a: 'Employers standardly contribute £350 to £500+ plus VAT directly to your SRA-regulated solicitor upon completion of the agreement. Any excess or abortive work is subject to your solicitor engagement terms.',
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
  headline: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-23',
  dateModified: '2026-11-22',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://settlementcheck.co.uk/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Guides',
      item: 'https://settlementcheck.co.uk/guides/',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Settlement Agreement Reference',
      item: 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
    },
  ],
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SettlementAgreementReferenceGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Agreed references</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Settlement Agreement Reference: UK Rules &amp; Clauses
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against Common Law &amp; ERA 1996 s.203
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement with a brief factual reference attached? Once signed under Section 203, that schedule becomes a binding contract term. Check your calculated statutory baseline in 60 seconds with no email required, see how oral inquiry and non-disparagement clauses work, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* ARTICLE BODY */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Calculator (Immediately after Hero) */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Check your calculated statutory baseline (£751/wk cap), notice pay, and tax-free allowances alongside your reference terms."
                disputeType="reference"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Tax-Free Exemption', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={45000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* STATUTORY QUICK ANSWER */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-3">
                Can an employer refuse to give a reference in a settlement agreement?
              </h2>
              <p className="text-[15px] text-ink leading-relaxed mb-5">
                Under UK common law, employers have no general duty to provide a job reference. However, in a Section 203 settlement agreement, the agreed reference schedule is a binding contractual term requiring the employer to issue the agreed text upon request.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Legal Right to a Reference</span>
                  <span className="font-bold text-ink text-sm block mb-1">Contractual Only</span>
                  <span className="text-muted text-[12px]">No general statutory duty under common law</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Standard Format</span>
                  <span className="font-bold text-ink text-sm block mb-1">Factual Only</span>
                  <span className="text-muted text-[12px]">Dates, job title, and salary if requested</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Oral Reference Protection</span>
                  <span className="font-bold text-ink text-sm block mb-1">Strict Wording Clause</span>
                  <span className="text-muted text-[12px]">HR must not deviate from written schedule</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Legal Fee Contribution</span>
                  <span className="font-bold text-ink text-sm block mb-1">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[12px]">Standard employer contribution on completion</span>
                </div>
              </div>
            </div>

            {/* CORE FACTS CALLOUT */}
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-[15px] font-semibold text-ink mb-3">Six key facts about settlement agreement references</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Under UK law, employers have no general duty to provide a reference unless contractually agreed.',
                  'An agreed reference in a settlement agreement creates a legally binding contractual duty.',
                  'A standard factual reference is normal practice across most UK corporate employers.',
                  'An oral inquiry clause helps ensure telephone enquiries follow the written schedule.',
                  'Reciprocal non-disparagement clauses restrict both sides from making derogatory remarks.',
                  'Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-[15px] text-ink leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SECTION 1 */}
            <section className="space-y-4">
              <h2 className="guide-h2">1. Are UK employers legally required to give a job reference?</h2>
              <p className="guide-body">
                Under UK common law, an employer has no general obligation to provide a reference for a current or former employee, as confirmed in <em>Spring v Guardian Assurance plc [1995]</em>.
              </p>
              <p className="guide-body">
                An employer can refuse to provide a reference unless that refusal amounts to unlawful discrimination or victimisation under the Equality Act 2010. That is why an agreed reference schedule in a Section 203 settlement agreement turns a discretionary favour into an enforceable contract term.
              </p>
            </section>

            {/* INTERACTIVE TOOL HOOK */}
            <InteractiveToolHook
              badge="Draft Agreement Review"
              title="Check your reference and non-disparagement clauses"
              description="Draft agreements often omit oral reference protections or reciprocal non-disparagement terms. Have an SRA-regulated solicitor review your draft before signing."
              ctaText="Check my draft clauses →"
              ctaHref="/settlement-agreement-review/"
              statutoryPills={[
                { label: 'ERA 1996', value: 'Section 203(3)', citation: 'Mandatory independent legal advice' },
                { label: 'Legal Fees', value: '£350 to £500+ VAT', citation: 'Standard contribution on completion' },
                { label: 'Contract Law', value: 'Binding Schedule', citation: 'Remedies for breach of contract' },
              ]}
            />

            {/* SECTION 2 */}
            <section className="space-y-4">
              <h2 className="guide-h2">2. What is the difference between a factual and character reference?</h2>
              <p className="guide-body">
                Under <em>Bartholomew v London Borough of Hackney [1999]</em>, an employer providing a reference owes a duty of care to ensure it is true, accurate, and fair. Because detailed commentary creates legal risk, most large UK employers enforce a factual-only reference policy.
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full text-left text-xs border border-rule rounded-lg overflow-hidden">
                  <thead className="bg-paper-2 text-ink uppercase tracking-wider font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Reference Type</th>
                      <th className="p-3">What It Contains</th>
                      <th className="p-3">Industry Perception</th>
                      <th className="p-3">Employer Practice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule bg-white">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Standard Factual</td>
                      <td className="p-3 text-muted">Job title, start date, end date, and salary confirmation if requested.</td>
                      <td className="p-3 text-muted">Standard corporate practice. Neutral and widely accepted.</td>
                      <td className="p-3 text-ink font-medium">Standard policy for most UK corporate firms.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Detailed / Character</td>
                      <td className="p-3 text-muted">Commentary on achievements, work ethic, and interpersonal skills.</td>
                      <td className="p-3 text-muted">Positive, though increasingly rare outside smaller businesses.</td>
                      <td className="p-3 text-muted">Often declined by corporate HR due to liability risk.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Regulated Sector</td>
                      <td className="p-3 text-muted">Mandatory conduct disclosures under FCA/PRA rules (SM&amp;CR SYSC 22).</td>
                      <td className="p-3 text-muted">Statutory requirement in financial services.</td>
                      <td className="p-3 text-ink font-medium">Compulsory by law; cannot be waived by agreement.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-paper border-l-4 border-coral p-4 rounded-r-lg">
                <p className="text-[14px] text-ink font-medium leading-relaxed m-0">
                  <strong>Reassurance on factual references:</strong> Recruitment teams see factual references every day. They recognise them as standard corporate compliance rather than a signal of performance issues.
                </p>
              </div>
            </section>

            {/* SECTION 3 */}
            <section className="space-y-4">
              <h2 className="guide-h2">3. What does a standard agreed reference clause look like?</h2>
              <p className="guide-body">
                In a settlement agreement, the agreed wording usually sits in an attached schedule titled &quot;Schedule 1: Agreed Reference&quot;. Below is a typical UK corporate format:
              </p>

              <div className="bg-paper-2 border border-rule rounded-xl p-5 md:p-6 font-mono text-xs text-ink leading-relaxed space-y-3">
                <div className="flex items-center justify-between border-b border-rule pb-2">
                  <span className="font-bold text-coral text-[11px] uppercase tracking-wider font-sans">
                    Schedule 1 - Agreed Reference Template
                  </span>
                  <span className="text-[10px] text-muted font-sans">Standard UK Corporate Format</span>
                </div>
                <p className="font-sans text-[14px] text-muted mb-2">
                  [Company Letterhead]
                </p>
                <p className="font-sans text-[14px] text-muted mb-2">
                  To Whom It May Concern,
                </p>
                <p className="font-sans text-[14px] text-ink font-medium">
                  Re: Reference for [Employee Full Name]
                </p>
                <p>
                  This letter confirms that [Employee Full Name] was employed by [Employer Name] from [Start Date] until [Termination Date].
                </p>
                <p>
                  During their employment, [Employee Name] held the position of [Job Title] within the [Department / Division] team.
                </p>
                <p>
                  [Optional Reason for Leaving: [Employee Name] left their employment by mutual agreement.]
                </p>
                <p>
                  It is company policy to provide only factual references confirming employment dates and position held.
                </p>
                <p className="font-sans text-[14px] text-muted mt-3">
                  Yours faithfully,<br />
                  Human Resources Department<br />
                  [Employer Name]
                </p>
              </div>
            </section>

            {/* SECTION 4 */}
            <section className="space-y-4">
              <h2 className="guide-h2">4. How do oral references and telephone calls affect your agreement?</h2>
              <p className="guide-body">
                An agreed written schedule does not automatically cover informal telephone calls. Prospective employers sometimes ring former managers for a quick verbal confirmation.
              </p>
              <p className="guide-body">
                To address this, solicitors commonly check for an <strong>oral inquiry clause</strong> in the main body of the agreement stating that:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[15px] text-ink leading-relaxed">
                <li>All reference requests must be directed exclusively to a named contact or central HR.</li>
                <li>Any oral response must remain strictly consistent with the written reference in Schedule 1.</li>
                <li>Neither HR nor managers may provide additional informal commentary or opinions.</li>
              </ul>
            </section>

            {/* SECTION 5 */}
            <section className="space-y-4">
              <h2 className="guide-h2">5. How do reciprocal non-disparagement clauses protect you?</h2>
              <p className="guide-body">
                Initial employer drafts often restrict the employee from making derogatory comments about the company, without placing a matching duty on the employer.
              </p>
              <p className="guide-body">
                During a review, solicitors commonly request a <strong>reciprocal non-disparagement clause</strong>. This requires the employer to use reasonable endeavours to ensure its directors and key managers do not make derogatory remarks about you to third parties.
              </p>
            </section>

            {/* REVIEW CALLOUT */}
            <ReviewCallout
              title="Have you received a draft settlement agreement?"
              description="Have an independent solicitor review your reference schedule, non-disparagement terms, and financial breakdown before signing. Employers standardly contribute £350 to £500+ plus VAT upon completion."
              ctaText="Check my draft clauses →"
              badge="Confidential Clause Review"
            />

            {/* SECTION 6 */}
            <section className="space-y-4">
              <h2 className="guide-h2">6. What should your agreed reference say about why you left?</h2>
              <p className="guide-body">
                The reason for leaving is often adjusted during solicitor review. Three common neutral options are used in UK practice:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-rule bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Mutual Agreement</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-0">
                    Stating that employment ended &quot;by mutual agreement&quot; is neutral and reflects an agreed departure under a settlement agreement.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Redundancy or Reorganisation</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-0">
                    Where departure followed restructuring, stating &quot;redundancy&quot; gives clear context to future recruiters.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Omission (Silent Reason)</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-0">
                    Where an exit followed a workplace dispute, omitting the reason entirely and confirming only dates and job title is often preferred.
                  </p>
                </div>
              </div>
              <p className="guide-body mt-2">
                Employees and their solicitors typically avoid wording that mentions performance management, disciplinary proceedings, or capability reviews.
              </p>
            </section>

            {/* SECTION 7 */}
            <section className="space-y-4">
              <h2 className="guide-h2">7. How do FCA, PRA, and SM&amp;CR rules affect regulated roles?</h2>
              <p className="guide-body">
                In financial services regulated by the Financial Conduct Authority (FCA) or Prudential Regulation Authority (PRA), statutory regulatory reference rules apply under SYSC 22.
              </p>
              <p className="guide-body">
                Regulated firms have a mandatory duty to disclose conduct rule breaches and fitness and propriety findings over the past 6 years. A settlement agreement cannot contract out of those statutory duties. However, a solicitor can review the wording to ensure unproven allegations or discontinued grievances are not presented as established misconduct.
              </p>
            </section>

            {/* SECTION 8 */}
            <section className="space-y-4">
              <h2 className="guide-h2">8. What happens if a former employer breaches the agreed reference?</h2>
              <p className="guide-body">
                Once signed, a settlement agreement is a binding contract. If your employer deviates from Schedule 1 or gives a damaging oral reference, potential legal remedies include:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-rule bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Damages for Lost Earnings</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-0">
                    If a prospective employer withdraws a job offer because of a non-compliant reference, you can seek breach of contract damages for proven financial loss.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Negligent Misstatement</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-0">
                    Under <em>Hedley Byrne &amp; Co Ltd v Heller &amp; Partners Ltd [1964]</em>, an employer providing a misleading reference may owe a duty of care for resulting financial loss.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Injunction</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-0">
                    In urgent cases, a solicitor can advise on applying to court to restrain further non-compliant references.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 9 */}
            <section className="space-y-4">
              <h2 className="guide-h2">9. How do statutory negotiation rules and solicitor fees apply?</h2>
              <p className="guide-body">
                Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is valid only after you receive advice from an independent, qualified legal adviser such as an SRA-regulated solicitor. Employers standardly contribute £350 to £500+ plus VAT toward these legal fees upon completion, with any excess or abortive work subject to your solicitor engagement terms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Talks &amp; Eligibility</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li><strong>Section 111A ERA 1996</strong> covers pre-termination talks for ordinary unfair dismissal only, not discrimination or whistleblowing.</li>
                    <li><strong>Without Prejudice</strong> applies only where a genuine existing dispute exists.</li>
                    <li><strong>Statutory redundancy</strong> requires 2 years&apos; service (s.155 ERA 1996; excluded categories apply under s.141).</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Timelines &amp; Privilege</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li><strong>ACAS Code 4</strong> recommends 10 calendar days to consider a written offer as guidance rather than a binding right.</li>
                    <li><strong>Offer withdrawal:</strong> Under <em>Hyde v Wrench</em> and <em>Routledge v Grant</em>, a counter-offer rejects the original offer and an employer can withdraw before signing.</li>
                    <li><strong>Legal privilege:</strong> Advice from an SRA-regulated solicitor is protected by legal professional privilege.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 10: FAQS */}
            <section className="space-y-6 pt-4 border-t border-rule">
              <h2 className="guide-h2">Frequently asked questions</h2>
              <FaqAccordion faqs={FAQS} />
            </section>

            {/* RELATED GUIDES */}
            <RelatedArticles
              title="Related Guides &amp; Tools"
              items={[
                {
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Review',
                  description: 'Check your written clauses for restrictive covenants, non-disparagement, and reference terms.',
                  tag: 'Review Tool',
                },
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your offer against 2026 statutory redundancy and notice caps.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/settlement-agreement-restrictive-covenants/',
                  title: 'Restrictive Covenants & Non-Competes',
                  description: 'Post-termination restrictions, non-compete enforceability, and Section 225 tax rules.',
                  tag: 'Legal Guide',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw a Settlement Offer?',
                  description: 'Contract rules, counter-offer risks under Hyde v Wrench, and ACAS 10-day guidance.',
                  tag: 'Legal Rights',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens If You Do Not Sign?',
                  description: 'Understand workplace alternatives, notice pay rights, and tribunal options.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/settlement-agreement-tax-calculator/',
                  title: 'Settlement Agreement Tax Calculator',
                  description: 'Calculate tax-free vs taxable breakdown, £30,000 exemption, and legal fee rules.',
                  tag: 'Tax Tool',
                },
              ]}
            />

          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="relative overflow-hidden py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Check where your settlement agreement clauses stand
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mx-auto mb-6">
              See your calculated statutory baseline, check your agreed reference terms, and prepare for an independent solicitor review.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/" className="btn-accent w-full sm:w-auto">
                Check my offer now →
              </Link>
              <Link href="/redundancy-calculator/" className="btn-secondary w-full sm:w-auto">
                Calculate my redundancy →
              </Link>
            </div>
            <p className="text-white/60 text-[12px] mt-4">
              Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
