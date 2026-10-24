import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import InteractiveToolHook from '@/components/InteractiveToolHook'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
  description:
    'Offered a settlement agreement? Learn your agreed reference rights, standard clause wording, bad reference remedies, and how solicitors protect your career.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
  },
  openGraph: {
    title: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
    description:
      'Offered a settlement agreement? Learn your agreed reference rights, standard clause wording, bad reference remedies, and how solicitors protect your career.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-reference/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Reference: UK 2026 Rules & Clauses',
    description:
      'Offered a settlement agreement? Learn your agreed reference rights, standard clause wording, bad reference remedies, and how solicitors protect your career.',
  },
}

const FAQS = [
  {
    q: 'Is an employer legally required to give a reference in the UK?',
    a: 'No. Under UK common law, an employer has no statutory duty to provide a job reference for any employee. However, when you sign a settlement agreement, the agreed reference clause becomes a legally binding contract. Once signed, your employer is legally bound to provide the exact reference attached in the schedule upon request.',
  },
  {
    q: 'Will a basic factual reference look suspicious to future employers?',
    a: 'No. The vast majority of UK employers now maintain strict policies of providing only factual references. These confirm your job title, start date, and end date. Prospective employers and recruitment agencies are entirely accustomed to this practice. They treat a factual reference as standard corporate compliance, not as an indicator of poor performance or misconduct.',
  },
  {
    q: 'Can my employer give a bad oral reference after signing a settlement agreement?',
    a: 'Not if your settlement agreement is drafted properly by an independent solicitor. Your agreement should include a specific clause requiring your employer to direct all reference inquiries exclusively to HR. It must also stipulate that any oral responses must conform strictly to the agreed written text, with no negative comments.',
  },
  {
    q: 'What happens if my employer breaches the agreed reference clause?',
    a: 'If your employer gives a negative reference or refuses to provide the agreed text, they commit a breach of contract. Under English law, you can claim damages in court for financial losses. If a job offer is rescinded because of their breach, your former employer can be held liable for your lost earnings.',
  },
  {
    q: 'What reason for leaving should be stated in my agreed reference?',
    a: 'Your solicitor can negotiate an agreed reason for leaving. Common neutral options include "resignation by mutual agreement", "redundancy", or "resignation to pursue other opportunities". If your employer insists on a standard factual reference, the reason for leaving is simply omitted, which avoids any negative inference.',
  },
  {
    q: 'Who pays the legal fees to negotiate my agreed reference clause?',
    a: 'Your employer covers the legal fees for your independent solicitor advice under Section 203 of the Employment Rights Act 1996. Standard employer legal fee contributions typically range between £500 and £1,500 plus VAT. Your solicitor will review and negotiate your reference terms and non-disparagement covenants directly with your employer.',
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
  dateModified: '2026-10-23',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Agreed References</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Job References, Future Employment &amp; Section 203 Protection
            </p>
            <h1 className="sc-h1 mb-5">
              Settlement Agreement Reference: UK 2026 Rules &amp; Clauses
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Updated for 2026/27 UK Employment Law</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              When leaving your job under a settlement agreement, securing your financial payout is only half the battle. Protecting your future career is just as critical. Understanding how agreed references work under UK employment law ensures you leave with your reputation intact and no unpleasant surprises during your next job hunt.
            </p>
          </div>
        </section>

        {/* STATUTORY QUICK ANSWER (AEO / FEATURED SNIPPET OPTIMISED) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Common Law &amp; ERA 1996 s.203
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Can an employer refuse to give a reference in a UK settlement agreement?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Under UK common law, employers have no general legal duty to provide a job reference. However, in a settlement agreement under Section 203 of the Employment Rights Act 1996, the agreed reference schedule is a binding contractual term. Once executed, your employer is legally required to provide the agreed text upon request and cannot give a contradictory oral reference.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Right to a Reference</span>
                  <span className="font-bold text-ink text-sm">Contractual Only</span>
                  <span className="text-muted text-[11px]">No general statutory duty under common law</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Standard Format</span>
                  <span className="font-bold text-ink text-sm">Factual Only</span>
                  <span className="text-muted text-[11px]">Dates, role, and salary upon request</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Oral Reference Protection</span>
                  <span className="font-bold text-ink text-sm">Strict Wording Clause</span>
                  <span className="text-muted text-[11px]">HR must not deviate from written schedule</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Independent Legal Advice</span>
                  <span className="font-bold text-ink text-sm">Employer Covers Fees</span>
                  <span className="text-muted text-[11px]">Typically £500 to £1,500 + VAT under s.203</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.203(3)</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check my draft clauses →
                  </Link>
                  <Link href="/calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my settlement baseline →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FACTS CALLOUT */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Six critical facts about settlement agreement references</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Under UK law, employers have no general duty to provide a reference unless contractually agreed.',
                  'An agreed reference in a settlement agreement creates a legally binding contractual duty.',
                  'A standard factual reference is normal practice across 90% of UK employers and carries zero stigma.',
                  'Your agreement must explicitly ban negative oral or telephone comments to prospective employers.',
                  'Reciprocal non-disparagement clauses stop former managers from making derogatory remarks behind your back.',
                  'Your employer covers the legal fees for your independent solicitor advice under Section 203.',
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

        {/* ARTICLE BODY */}
        <div className="bg-card py-12">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* SECTION 1: THE LEGAL REALITY OF JOB REFERENCES */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">1. The legal reality of job references in the UK</h2>
              <p className="sc-body">
                Many employees believe they have a statutory right to a job reference. Under UK employment law, this is a misconception. Under common law, an employer is under no obligation to provide a reference for a current or former employee, as confirmed by the landmark House of Lords case <em>Spring v Guardian Assurance plc [1995]</em>.
              </p>
              <p className="sc-body">
                An employer can legally refuse to provide any reference at all. That refusal cannot be challenged unless you can prove it constitutes unlawful discrimination or victimisation under the Equality Act 2010.
              </p>
              <p className="sc-body">
                This legal reality is why an agreed reference schedule is essential. When you sign a settlement agreement under Section 203 of the Employment Rights Act 1996, the reference clause turns a discretionary favour into a legally binding contractual duty. If your employer fails to provide the agreed reference, they are in direct breach of contract.
              </p>
            </section>

            {/* INTERACTIVE TOOL HOOK */}
            <InteractiveToolHook
              badge="Draft Agreement Auditor"
              title="Is your reference clause legally watertight?"
              description="Most employer-drafted agreements contain weak reference clauses that permit negative oral remarks. Check your written terms with an SRA-regulated solicitor before signing. Your employer covers the legal fees."
              ctaText="Check my draft clauses →"
              ctaHref="/settlement-agreement-review/"
              statutoryPills={[
                { label: 'ERA 1996', value: 'Section 203(3)', citation: 'Mandatory independent legal advice' },
                { label: 'Legal Fees', value: '£500 to £1,500', citation: 'Employer covers advice costs' },
                { label: 'Contract Law', value: 'Binding Schedule', citation: 'Remedies for breach of contract' },
              ]}
            />

            {/* SECTION 2: FACTUAL VS DETAILED REFERENCES */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">2. Standard factual reference vs detailed character reference</h2>
              <p className="sc-body">
                When discussing references, employees often hope for a glowing letter of recommendation. In modern UK business practice, this is exceptionally rare.
              </p>
              <p className="sc-body">
                Under <em>Bartholomew v London Borough of Hackney [1999]</em>, any employer providing a reference owes a duty of care to both the employee and the recipient. The reference must be true, accurate, and fair. Because detailed commentary introduces legal risk of defamation or negligent misstatement, almost all large UK employers enforce a strict factual-only reference policy.
              </p>
              <p className="sc-body">
                The table below contrasts the three primary reference types in UK employment practice:
              </p>

              {/* Comparison Table */}
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left text-xs border border-rule rounded-lg overflow-hidden">
                  <thead className="bg-paper-2 text-ink uppercase tracking-wider font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Reference Type</th>
                      <th className="p-3">What It Contains</th>
                      <th className="p-3">Industry Perception</th>
                      <th className="p-3">Employer Willingness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule bg-white">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Standard Factual</td>
                      <td className="p-3 text-muted">Job title, start date, end date, and salary confirmation if requested.</td>
                      <td className="p-3 text-muted">Standard corporate practice. Completely neutral. Zero stigma.</td>
                      <td className="p-3 text-ink font-medium">Standard policy for over 90% of UK firms.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Detailed / Character</td>
                      <td className="p-3 text-muted">Praise of achievements, work ethic, interpersonal skills, and contributions.</td>
                      <td className="p-3 text-muted">Positive, but increasingly rare outside small businesses or creative sectors.</td>
                      <td className="p-3 text-muted">Generally refused by corporate HR due to legal liability risks.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Regulated Sector</td>
                      <td className="p-3 text-muted">Mandatory conduct disclosures under FCA/PRA rules (SM&amp;CR SYSC 22).</td>
                      <td className="p-3 text-muted">Statutory requirement in financial services. Scrutinised by compliance teams.</td>
                      <td className="p-3 text-ink font-medium">Compulsory by law. Cannot be waived by a settlement agreement.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-paper border-l-4 border-coral p-4 rounded-r-lg">
                <p className="text-xs text-ink font-medium leading-relaxed m-0">
                  <strong>Important reassurance:</strong> A standard factual reference will not harm your job prospects. Recruitment consultants and HR directors see hundreds of factual references every month. They recognise it as standard corporate policy, not a hidden signal of performance concerns.
                </p>
              </div>
            </section>

            {/* SECTION 3: MODEL AGREED REFERENCE CLAUSE WORDING */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">3. Model agreed reference wording (Schedule 1)</h2>
              <p className="sc-body">
                In a well-drafted settlement agreement, the reference text appears in an attached schedule, usually titled &quot;Schedule 1: Agreed Reference&quot;.
              </p>
              <p className="sc-body">
                Below is the standard, battle-tested wording that UK employment solicitors routinely negotiate for corporate exits:
              </p>

              {/* Template Box */}
              <div className="bg-paper-2 border border-rule rounded-xl p-5 md:p-6 font-mono text-xs text-ink leading-relaxed space-y-3">
                <div className="flex items-center justify-between border-b border-rule pb-2">
                  <span className="font-bold text-coral text-[11px] uppercase tracking-wider font-sans">
                    Schedule 1 - Agreed Reference Template
                  </span>
                  <span className="text-[10px] text-muted font-sans">Standard UK Corporate Format</span>
                </div>
                <p className="font-sans text-xs text-muted mb-2">
                  [Company Letterhead]
                </p>
                <p className="font-sans text-xs text-muted mb-2">
                  To Whom It May Concern,
                </p>
                <p className="font-sans text-xs text-ink font-medium">
                  Re: Reference for [Employee Full Name]
                </p>
                <p>
                  This letter confirms that [Employee Full Name] was employed by [Employer Name] from [Start Date] until [Termination Date].
                </p>
                <p>
                  During their employment, [Employee Name] held the position of [Job Title] within the [Department / Division] team.
                </p>
                <p>
                  [Optional Reason for Leaving Sentence: [Employee Name] left their employment by mutual agreement following an internal company reorganisation.]
                </p>
                <p>
                  It is company policy to provide only factual references confirming employment dates and position held.
                </p>
                <p className="font-sans text-xs text-muted mt-3">
                  Yours faithfully,<br />
                  Human Resources Department<br />
                  [Employer Name]
                </p>
              </div>
            </section>

            {/* SECTION 4: THE ORAL REFERENCE TRAP */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">4. The oral reference trap and telephone inquiries</h2>
              <p className="sc-body">
                Having an agreed written reference is not enough on its own. Prospective employers frequently call former managers or HR departments for an &quot;informal chat&quot; or quick verbal confirmation.
              </p>
              <p className="sc-body">
                If your settlement agreement does not regulate oral communications, a former manager might say something damaging on the telephone, such as: &quot;I can only give the agreed reference, if you know what I mean.&quot; A comment like that immediately destroys a job offer.
              </p>
              <p className="sc-body">
                To prevent this, an experienced employment solicitor will insert an <strong>oral inquiry covenant</strong> into the main body of your agreement. This clause must state:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-ink leading-relaxed">
                <li>All requests for references must be directed exclusively to a named individual or central HR.</li>
                <li>The employer covenants that any oral response will be strictly consistent with the written reference in Schedule 1.</li>
                <li>The employer covenants that neither HR nor any manager will provide additional commentary, nuance, or informal opinions.</li>
              </ul>
            </section>

            {/* SECTION 5: RECIPROCAL NON-DISPARAGEMENT */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">5. Reciprocal non-disparagement covenants</h2>
              <p className="sc-body">
                Standard draft agreements provided by employers are one-sided. They contain strict clauses forbidding the employee from making derogatory comments about the employer, its brand, or its staff.
              </p>
              <p className="sc-body">
                However, they routinely omit any obligation on the employer. Without a reciprocal clause, your former employer and colleagues remain legally free to criticise you to industry peers or recruiters.
              </p>
              <p className="sc-body">
                Your solicitor should always negotiate a <strong>reciprocal non-disparagement clause</strong>. This legally binds the employer, its board of directors, and your immediate managers from making any disparaging or derogatory remarks about you to any third party.
              </p>
            </section>

            {/* REVIEW CALLOUT */}
            <ReviewCallout
              title="Have you received a draft settlement agreement?"
              description="Do not sign until an independent solicitor reviews your reference schedule, non-disparagement terms, and financial settlement. Your employer covers the legal fees."
              ctaText="Check draft agreement clauses →"
              badge="Confidential Clause Checker"
            />

            {/* SECTION 6: REASON FOR LEAVING */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">6. What should your agreed reference say about why you left?</h2>
              <p className="sc-body">
                The reason for leaving is often an area of negotiation between solicitors. Depending on the background to your departure, several approaches can be taken:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Mutual Agreement</h3>
                  <p className="sc-body text-xs text-muted mb-0">
                    Stating that employment ended &quot;by mutual agreement&quot; is common and neutral. It accurately reflects that both parties agreed to part ways amicably under a settlement agreement.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Redundancy or Reorganisation</h3>
                  <p className="sc-body text-xs text-muted mb-0">
                    If your exit was initiated due to restructuring, stating &quot;reason for leaving: redundancy&quot; provides total clarity to future recruiters. It carries zero performance stigma.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Omission (Silent Reason)</h3>
                  <p className="sc-body text-xs text-muted mb-0">
                    If your exit involved a workplace dispute, the safest option is to omit the reason for leaving entirely. The reference simply states that standard company policy is to confirm employment dates and role only.
                  </p>
                </div>
              </div>
              <p className="sc-body mt-2">
                Under no circumstances should you agree to wording that mentions performance management, disciplinary proceedings, or capability reviews.
              </p>
            </section>

            {/* SECTION 7: REGULATED SECTORS (FCA, PRA & SM&CR) */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">7. Regulated sectors: FCA, PRA, and SM&amp;CR rules</h2>
              <p className="sc-body">
                If you work in financial services, insurance, or asset management regulated by the Financial Conduct Authority (FCA) or Prudential Regulation Authority (PRA), distinct statutory rules apply.
              </p>
              <p className="sc-body">
                Under Chapter 22 of the Senior Management Arrangements, Systems and Controls sourcebook (SYSC 22), regulated firms have a mandatory duty to provide comprehensive regulatory references covering the past 6 years of employment. This includes disclosing findings of conduct rule breaches, internal disciplinary determinations, and fitness and propriety concerns.
              </p>
              <p className="sc-body">
                A private settlement agreement <strong>cannot</strong> contract out of these statutory regulatory obligations. If an employer promised in a settlement agreement to conceal a proven conduct breach from the FCA, that clause would be legally void.
              </p>
              <p className="sc-body">
                However, a specialist employment solicitor can negotiate the exact narrative descriptions within the regulatory reference template. They will ensure that unproven allegations, discontinued grievances, or disputed complaints are not recorded as established misconduct.
              </p>
            </section>

            {/* SECTION 8: BREACH OF AN AGREED REFERENCE */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">8. What happens if your former employer breaches the agreed reference?</h2>
              <p className="sc-body">
                Once signed, a settlement agreement is an enforceable contract under English law. If your employer provides a reference that deviates from Schedule 1, or gives a negative oral reference, they commit a breach of contract.
              </p>
              <p className="sc-body">
                In such circumstances, you have several legal remedies:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Damages for Lost Earnings</h3>
                  <p className="sc-body text-xs text-muted mb-0">
                    If a prospective employer rescinds a formal job offer as a direct result of the derogatory reference, you can sue your former employer for substantial breach of contract damages, including your lost salary.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Negligent Misstatement</h3>
                  <p className="sc-body text-xs text-muted mb-0">
                    Under the doctrine in <em>Hedley Byrne &amp; Co Ltd v Heller &amp; Partners Ltd [1964]</em>, an employer who provides a misleading or inaccurate reference owes a tortious duty of care. You can bring a claim for financial detriment caused by their negligence.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Injunction</h3>
                  <p className="sc-body text-xs text-muted mb-0">
                    In urgent cases, a solicitor can apply to the County Court or High Court for an interim injunction restraining your former employer from issuing further non-compliant references.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 9: HOW AN INDEPENDENT SOLICITOR PROTECTS YOU */}
            <section className="space-y-4">
              <h2 className="sc-section-h2">9. How an independent solicitor protects your reference</h2>
              <p className="sc-body">
                Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is legally invalid unless you receive advice from an independent, qualified legal adviser. That adviser must be an SRA-regulated solicitor, a qualified barrister, or an authorised trade union representative.
              </p>
              <p className="sc-body">
                The most reassuring aspect for employees is the financial arrangement: <strong>your employer covers the legal fees</strong>. Employers typically contribute between £500 and £1,500 plus VAT towards your legal costs. For a standard review and sign-off, this contribution covers the full expense, meaning you pay zero out of pocket.
              </p>
              <p className="sc-body">
                Your solicitor will not just verify your severance calculation and tax-free allowances under Section 403 of ITEPA 2003. They will also inspect the reference schedule, tighten oral inquiry covenants, and ensure robust non-disparagement protections are in place before you sign.
              </p>
            </section>

            {/* SECTION 10: FAQS */}
            <section className="space-y-6 pt-4 border-t border-rule">
              <h2 className="sc-section-h2">Frequently asked questions</h2>
              <FaqAccordion faqs={FAQS} />
            </section>

            {/* RELATED GUIDES */}
            <RelatedArticles
              title="Related Guides &amp; Tools"
              items={[
                {
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Review',
                  description: 'Check your written clauses for improper terms, restrictive covenants, and reference traps.',
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
                  description: 'Post-termination restrictions, non-compete enforceability, and Section 225 tax traps.',
                  tag: 'Legal Guide',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw a Settlement Offer?',
                  description: 'Contract rules, counter-offer risks under Hyde v Wrench, and ACAS 10-day limits.',
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
        </div>

        {/* BOTTOM CTA */}
        <section className="relative overflow-hidden py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Check where your settlement agreement clauses stand
            </h2>
            <p className="sc-lead text-white/80 max-w-xl mx-auto mb-6 text-sm">
              Calculate your statutory baseline, check your agreed reference terms, and get matched with an SRA-regulated solicitor. Your employer covers the cost of independent legal advice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/" className="btn-accent text-sm inline-block">
                Calculate my estimate →
              </Link>
              <Link href="/settlement-agreement-review/" className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition-colors">
                Check my draft clauses →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
