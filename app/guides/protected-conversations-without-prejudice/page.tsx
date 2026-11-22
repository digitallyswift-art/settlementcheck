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
  title: 'Protected Conversations: Section 111A | SettlementCheck',
  description:
    'Section 111A protected conversations and Without Prejudice guide. Learn improper behaviour rules, negotiation protections, and April 2026 statutory caps.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/protected-conversations-without-prejudice/',
  },
  openGraph: {
    title: 'Protected Conversations: Section 111A | SettlementCheck',
    description:
      'Section 111A protected conversations and Without Prejudice guide. Learn improper behaviour rules, negotiation protections, and April 2026 statutory caps.',
    url: 'https://settlementcheck.co.uk/guides/protected-conversations-without-prejudice/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protected Conversations: Section 111A | SettlementCheck',
    description:
      'Section 111A protected conversations and Without Prejudice guide. Learn improper behaviour rules, negotiation protections, and April 2026 statutory caps.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/protected-conversations-without-prejudice/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Can my employer hold a protected conversation out of the blue?',
    a: 'Yes. Under Section 111A of the Employment Rights Act 1996, an employer can start confidential exit talks without any prior dispute, disciplinary issue, or performance process.',
  },
  {
    q: 'What is the difference between Section 111A and Without Prejudice?',
    a: 'Without Prejudice is a common law rule that requires an existing dispute and covers most claims, including discrimination. Section 111A is statutory, requires no dispute, and protects talks only against ordinary unfair dismissal.',
  },
  {
    q: 'Can a protected conversation be used as evidence in an employment tribunal?',
    a: 'Not in an ordinary unfair dismissal claim, provided both parties behave properly. However, discussions can be admitted if the employer acts improperly or if the claim involves discrimination, whistleblowing, or breach of contract.',
  },
  {
    q: 'How long do I have to consider a settlement agreement offer?',
    a: 'Paragraph 12 of ACAS Code of Practice 4 recommends a minimum of 10 calendar days to review written terms and take independent legal advice. This is general guidance rather than a strict legal right.',
  },
  {
    q: 'What counts as improper behaviour by an employer under Section 111A(4)?',
    a: 'Improper behaviour includes bullying, harassment, aggressive ultimatums, or stating you will be dismissed if you do not sign before any formal disciplinary process has taken place. If proven, the tribunal can admit the discussion.',
  },
  {
    q: 'Who pays for the independent legal advice on a settlement agreement?',
    a: 'Under Section 203(3) of the Employment Rights Act 1996, independent advice is mandatory to make the agreement binding. Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion, with excess or abortive work subject to solicitor engagement terms.',
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
  headline: 'Protected Conversations and Without Prejudice: The UK Employee Guide (Section 111A)',
  url: 'https://settlementcheck.co.uk/guides/protected-conversations-without-prejudice/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-09-20',
  dateModified: '2026-09-20',
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
    '@id': 'https://settlementcheck.co.uk/guides/protected-conversations-without-prejudice/',
  },
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
      <path d="M10 3L2 17H18L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function ProtectedConversationsGuide() {
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
              <span className="text-xs text-ink truncate">Protected Conversations</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Section 111A ERA 1996 &amp; Employee Rights</p>
            <h1 className="sc-h1 mb-4">
              Protected Conversations and Without Prejudice: The UK Employee Guide
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead">
              Asked into an unexpected HR meeting or handed an off-the-record exit offer? Under Section 111A of the Employment Rights Act 1996, employers can propose confidential terms before any dispute exists. Check your statutory baseline in 60 seconds with no email required, see what stays off the record, and prepare questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Check */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's opening figure against your calculated statutory baseline and typical 1 to 3 months gross commercial ranges."
              disputeType="protected_conversation"
              statutoryPills={[
                { label: 'Protected Talks', value: 's.111A ERA 1996', statute: 'Ordinary Unfair Dismissal' },
                { label: 'ACAS Guidance', value: '10 Calendar Days', statute: 'ACAS Code 4' },
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
              ]}
              initialSalary={52000}
              initialYears={4}
              initialAge={41}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Core Facts Callout */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="font-serif text-[19px] font-[460] text-ink mb-3">What to know before you respond</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Section 111A allows employers to start exit talks without any prior disciplinary or capability process.',
                  'Confidentiality only covers ordinary unfair dismissal claims, which generally require two years of qualifying service under s.108 ERA 1996.',
                  'It offers no protection for discrimination, whistleblowing, automatically unfair dismissal, or breach of contract.',
                  'ACAS Code of Practice 4 recommends at least 10 calendar days to consider written terms as general guidance, not a strict legal right.',
                  'Employers lose Section 111A protection if they engage in improper behaviour, such as ultimatums or threats of dismissal.',
                  'Employers standardly contribute £350 to £500+ plus VAT toward your independent legal advice upon completion. Excess or abortive work is subject to solicitor engagement terms.',
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

        {/* Section 1: What is a protected conversation */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What is a protected conversation under Section 111A?</h2>
            <p className="sc-body mb-4">
              A protected conversation is a statutory procedure under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 111A of the Employment Rights Act 1996
              </a>
              . The legislation calls these discussions &quot;pre-termination negotiations&quot;.
            </p>
            <p className="sc-body mb-4">
              The rule lets an employer raise an agreed financial exit at any time. They do not need to run a formal capability or disciplinary process first.
            </p>
            <p className="sc-body mb-4">
              Before Section 111A, off-the-record exit talks required an existing legal dispute. Section 111A removed that requirement for ordinary unfair dismissal claims under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/94"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 94 of the Employment Rights Act 1996
              </a>
              .
            </p>

            <ReviewCallout
              title="Handed an offer letter after a protected conversation?"
              description="Check your settlement terms confidentially before responding. Verify your calculated statutory baseline, customary legal fee contribution, and £30,000 tax-free exemption."
              ctaText="Check my offer now →"
              badge="April 2026 Statutory Check"
            />
          </div>
        </section>

        {/* Section 2: Comparison */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does Section 111A differ from Without Prejudice?</h2>
            <p className="sc-body mb-6">
              Managers and HR teams often confuse Section 111A talks with common law Without Prejudice. The two rules work differently if talks break down.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Section 111A Protected Talks</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Statutory rule under ERA 1996.</li>
                  <li>No prior dispute required.</li>
                  <li>Covers ordinary unfair dismissal only.</li>
                  <li>Protection lost if improper behaviour occurs.</li>
                </ul>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Common Law Without Prejudice</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Based on common law court decisions.</li>
                  <li>Requires a genuine existing dispute.</li>
                  <li>Covers broader claims like discrimination.</li>
                  <li>Protection lost only for unambiguous impropriety.</li>
                </ul>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Key Feature</th>
                    <th className="p-3 font-semibold">Section 111A Protected Conversation</th>
                    <th className="p-3 font-semibold">Common Law Without Prejudice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Legal source</td>
                    <td className="p-3">Statute (Section 111A ERA 1996)</td>
                    <td className="p-3">Common law court decisions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Prior dispute required?</td>
                    <td className="p-3">No. Can be initiated at any point.</td>
                    <td className="p-3">Yes. Requires an active legal dispute.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Claims covered</td>
                    <td className="p-3">Ordinary unfair dismissal only</td>
                    <td className="p-3">Broad claims (discrimination, contract)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Unprotected claims</td>
                    <td className="p-3">Discrimination, whistleblowing, breach of contract</td>
                    <td className="p-3">Unambiguous impropriety (perjury, fraud)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Loss of secrecy</td>
                    <td className="p-3">Improper behaviour (Section 111A(4))</td>
                    <td className="p-3">Fraud, blackmail, extreme bad faith</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-rule bg-white p-4">
              <p className="sc-body leading-relaxed text-muted">
                <strong className="text-ink">Why this distinction matters:</strong> Labelling an unexpected meeting &quot;Without Prejudice&quot; without an existing dispute does not make it so. The talk falls under Section 111A instead, leaving discrimination or whistleblowing claims outside its shield.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Where Section 111A offers no protection */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">When can a protected conversation be used in a tribunal?</h2>
            <p className="sc-body mb-6">
              Section 111A offers narrow protection. If your situation involves any of the claims below, the discussion can be shown to an employment tribunal.
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">1. Unlawful Discrimination (Equality Act 2010)</h3>
                <p className="sc-body mb-2">
                  Section 111A does not cover claims under the{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2010/15/contents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Equality Act 2010
                  </a>
                  . Discussions linked to age, sex, disability, race, religion, sexual orientation, pregnancy, or maternity can be used as evidence.
                </p>
                <p className="sc-body text-muted">
                  Unlike unfair dismissal awards, discrimination compensation under Section 124 of the Equality Act 2010 is uncapped. Tribunals can also award injury to feelings under the Vento guidelines.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">2. Whistleblowing (Protected Disclosures)</h3>
                <p className="sc-body mb-2">
                  Sections 43A to 43L of the Employment Rights Act 1996 protect workers who report regulatory breaches, safety risks, or unlawful acts.
                </p>
                <p className="sc-body text-muted">
                  Section 111A does not shield exit talks that follow a protected disclosure. Whistleblowing dismissals are automatically unfair from day one and compensation is uncapped. Read our guide on{' '}
                  <Link href="/guides/whistleblowing-settlement-agreements/" className="text-coral underline hover:text-ink">
                    whistleblowing settlement agreements
                  </Link>
                  .
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">3. Automatically Unfair Dismissals</h3>
                <p className="sc-body mb-2">
                  The statute does not protect talks linked to trade union duties, family leave, health and safety, or asserting statutory pay rights.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">4. Breach of Contract &amp; Wrongful Dismissal</h3>
                <p className="sc-body">
                  Section 111A does not cover disputes over unpaid notice pay, outstanding bonuses, or contractual terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Improper behaviour & ACAS 10-day rule */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What counts as improper behaviour or unfair pressure?</h2>
            <p className="sc-body mb-4">
              Even in ordinary unfair dismissal talks, an employer loses confidentiality if they behave improperly. Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 111A(4) of the Employment Rights Act 1996
              </a>
              , a tribunal can admit the conversation if improper behaviour occurred.
            </p>
            <p className="sc-body mb-4">
              The{' '}
              <a
                href="https://www.acas.org.uk/code-of-practice-settlement-agreements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                ACAS Code of Practice 4 on Settlement Agreements
              </a>{' '}
              lists clear examples of improper behaviour:
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6 space-y-3">
              {[
                'Bullying, intimidation, or aggressive pressure during meetings.',
                'Presenting ultimatums with unreasonably short deadlines.',
                'Threatening dismissal before any formal performance or disciplinary process has taken place.',
                'Refusing reasonable time to take independent legal advice.',
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <AlertIcon />
                  <span className="sc-body text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* ACAS 10-Day Callout */}
            <div className="rounded-xl border border-coral/30 bg-coral/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-coral">ACAS Statutory Guidance</span>
              </div>
              <h3 className="font-serif text-[18px] font-[460] text-ink mb-2">The 10 Calendar Day Consideration Period</h3>
              <p className="sc-body mb-3">
                Paragraph 12 of ACAS Code of Practice 4 recommends a minimum of <strong>10 calendar days</strong> to review formal written terms and take independent legal advice. This is general guidance rather than a strict binding legal right.
              </p>
              <p className="sc-body text-muted">
                Very short deadlines, such as 24 or 48 hours, may be viewed as improper pressure if talks fail. Read more in our guide on{' '}
                <Link href="/guides/pressured-to-sign/" className="text-coral underline hover:text-ink">
                  being pressured to sign a settlement agreement
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: 2026 Statutory Limits Table */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What are the April 2026 statutory rates and caps?</h2>
            <p className="sc-body mb-4">
              To assess an exit offer, compare it against your calculated statutory baseline and employment tribunal award limits.
            </p>
            <p className="sc-body mb-6">
              Under the{' '}
              <a
                href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
              </a>
              , these statutory limits apply from 6 April 2026:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-paper mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper-2 border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Statutory Award</th>
                    <th className="p-3 font-semibold">Great Britain (2026 Cap)</th>
                    <th className="p-3 font-semibold">Northern Ireland (2026 Cap)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Weekly pay cap</td>
                    <td className="p-3 font-semibold text-ink">£751</td>
                    <td className="p-3 font-semibold text-ink">£783</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Max statutory redundancy pay</td>
                    <td className="p-3">£22,530 (20 yrs × 1.5 × £751)</td>
                    <td className="p-3">£23,490 (20 yrs × 1.5 × £783)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Max unfair dismissal compensation</td>
                    <td className="p-3">£123,543 (or 52 weeks gross pay)</td>
                    <td className="p-3">£123,543 (or 52 weeks gross pay)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Discrimination claims</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Whistleblowing claims</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-xl border border-coral/30 bg-paper-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-serif text-[17px] font-[460] text-ink">Check your settlement offer now</p>
                <p className="text-[14px] text-muted">Free, confidential estimate in 60 seconds. No email required.</p>
              </div>
              <Link href="/calculator/" className="btn-accent text-xs whitespace-nowrap">
                Check my offer now →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Tax Rules & Legal Fees */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How are settlement payouts and legal fees taxed?</h2>
            <p className="sc-body mb-4">
              Different parts of an exit package follow different HMRC tax rules. Separating them clearly shows what you keep after tax.
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">The £30,000 Tax-Free Limit (ITEPA 2003 s.403)</h3>
                <p className="sc-body">
                  Under{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Section 403 of ITEPA 2003
                  </a>
                  , the first £30,000 of genuine compensation for loss of employment is tax-free. Sums above £30,000 are subject to Income Tax. Read our guide to the{' '}
                  <Link href="/guides/tax-free-settlement-30000/" className="text-coral underline hover:text-ink">
                    £30,000 tax-free settlement rule
                  </Link>
                  .
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">Notice Pay and Garden Leave Are Taxed as Wages</h3>
                <p className="sc-body">
                  Under{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Section 402D of ITEPA 2003
                  </a>
                  , Post-Employment Notice Pay (PILON), holiday pay, and garden leave are taxed as wages. Your employer deducts Income Tax and Class 1 National Insurance from those sums.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">Employer Legal Fee Contribution</h3>
                <p className="sc-body mb-2">
                  Under{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Section 203(3) of the Employment Rights Act 1996
                  </a>
                  , you need independent legal advice for a settlement agreement to be legally binding.
                </p>
                <p className="sc-body">
                  Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion. Under HMRC{' '}
                  <a
                    href="https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim13750"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    EIM13750
                  </a>
                  , this contribution is tax-free and separate from your £30,000 allowance. Any excess or abortive work is subject to your solicitor&apos;s engagement terms. See{' '}
                  <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline hover:text-ink">
                    whether you must use the solicitor your employer recommends
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Written terms and solicitor review */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What happens when you ask for written terms and time to review?</h2>
            <p className="sc-body mb-6">
              After an unexpected pre-termination talk, employees typically clarify three practical points in writing so an independent solicitor can advise them.
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">1. Written Draft</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-1.5">Receiving the full proposal in writing</p>
                <p className="sc-body text-muted">
                  A verbal outline is not a binding agreement. Having the full draft lets a solicitor check the payout breakdown, tax wording, and any non-compete clauses.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">2. Consideration Window</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-1.5">Time to take independent legal advice</p>
                <p className="sc-body text-muted">
                  ACAS Code of Practice 4 recommends a minimum of 10 calendar days as general guidance to review written terms and consult an independent solicitor.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">3. Working Status</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-1.5">Normal duties or garden leave</p>
                <p className="sc-body text-muted">
                  Employers usually confirm in writing whether you continue normal duties or stay on paid garden leave while reviewing the draft.
                </p>
              </div>
            </div>

            <p className="sc-body text-muted">
              Keeping dated notes of who attended, what was said, and when any deadline expires helps your solicitor assess whether Section 111A confidentiality applies.
            </p>
          </div>
        </section>

        {/* Section 8: Three Paths Forward */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What are your options after the meeting?</h2>
            <p className="sc-body mb-6">
              Once you have the written draft settlement agreement, there are three main paths you can discuss with an independent solicitor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-rule bg-paper p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral block mb-1">Option 1</span>
                  <h3 className="font-serif text-[16px] font-[460] text-ink mb-2">Accept the Offer</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    If the payout, notice pay, and reference terms meet your needs, your solicitor signs the adviser&apos;s certificate to complete the exit. Employers standardly contribute £350 to £500+ plus VAT upon completion.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral block mb-1">Option 2</span>
                  <h3 className="font-serif text-[16px] font-[460] text-ink mb-2">Propose Changes</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Under UK contract law, making a counter-proposal rejects the original offer, so an employer can legally withdraw it before signature. Read{' '}
                    <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline hover:text-ink">
                      how settlement negotiations work
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral block mb-1">Option 3</span>
                  <h3 className="font-serif text-[16px] font-[460] text-ink mb-2">Decline to Sign</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Your employment continues, and your employer must follow a fair formal procedure if they wish to dismiss you. Read{' '}
                    <Link href="/guides/what-happens-if-you-do-not-sign/" className="text-coral underline hover:text-ink">
                      what happens if you do not sign
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: FAQs */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-6">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
            <DynamicFaqSection pathname="/guides/protected-conversations-without-prejudice/" />
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-10 bg-white border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides &amp; Tools"
              items={[
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your offer against April 2026 statutory redundancy and notice caps.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'Understand short deadlines and Section 111A improper behaviour rules.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How settlement talks work, what moves the figure, and without prejudice rules.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax on Settlement Agreements: £30,000 Rule',
                  description: 'Learn which elements of your settlement qualify for tax-free status.',
                  tag: 'Tax Rules',
                },
                {
                  href: '/guides/settlement-agreement-instead-of-pip/',
                  title: 'Settlement Agreement Instead of a PIP UK',
                  description: 'Offered an exit during a Performance Improvement Plan? Check statutory baselines and tax rules.',
                  tag: 'PIP Exit',
                },
                {
                  href: '/pip-settlement-calculator/',
                  title: 'PIP Settlement Agreement Calculator',
                  description: 'Estimate your statutory baseline and typical commercial exit range.',
                  tag: 'Calculator',
                },
              ]}
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative overflow-hidden py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Check where your settlement offer stands
            </h2>
            <p className="text-white/75 max-w-xl mx-auto mb-6 text-[15px] leading-relaxed">
              See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
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
        </section>
      </main>
      <Footer />
    </>
  )
}
