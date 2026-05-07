import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Do I Have to Use the Solicitor My Employer Recommends? | SettlementCheck',
  description: 'No. You are entitled to choose your own solicitor for independent legal advice on a settlement agreement. Here is what the law says.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/employer-recommended-solicitor',
  },
}

const FAQS = [
  {
    q: 'Can my employer refuse to pay fees if I choose my own solicitor?',
    a: 'No. The legal fees contribution is part of the settlement process. Your employer cannot withhold it because you chose a different solicitor.',
  },
  {
    q: 'Does it take longer if I use a different solicitor?',
    a: 'Not usually. A solicitor who specialises in settlement agreements can typically review the agreement and provide advice within one to two days. Speed depends on the solicitor, not on which one your employer preferred.',
  },
  {
    q: 'What if the recommended solicitor has already started reviewing my agreement?',
    a: 'You can still change solicitor at any point before you sign. Nothing is binding until you have received independent legal advice and signed the agreement. If you want a second opinion, you are entitled to get one.',
  },
  {
    q: 'Is the solicitor my employer recommends likely to be biased?',
    a: 'Not necessarily biased, but their professional relationship is with your employer rather than with you. That does not guarantee poor advice. It does mean your interests and their interests are not perfectly aligned.',
  },
  {
    q: 'How much will a solicitor cost me?',
    a: "Your employer covers the solicitor's fees for reviewing a settlement agreement. The standard contribution is £350 to £750. You should not have to pay anything out of your own pocket for the initial advice.",
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

const sections = [
  {
    title: 'What the law actually requires',
    body: [
      'Before a settlement agreement is legally binding, you must receive independent legal advice from a qualified solicitor or other relevant adviser. This is set out in Section 203 of the Employment Rights Act 1996.',
      'The key word is independent. The advice must come from someone who is not connected to your employer or acting in your employer’s interests. It must be advice given on your behalf, about your situation.',
      'Your employer cannot tell you which solicitor to use. They can suggest one. They cannot insist.',
    ],
  },
  {
    title: 'Why employers recommend a specific solicitor',
    body: [
      'Most employers suggest a solicitor as a practical convenience. In straightforward situations, the recommended solicitor may be perfectly competent and entirely fair.',
      'However, the recommended solicitor has typically handled settlement agreements for that employer before. They know the employer’s HR team. They may have a commercial relationship with the business.',
      'That does not mean they will give you bad advice. But it does mean their existing relationship is with your employer, not with you. That is worth knowing before you decide.',
    ],
  },
  {
    title: 'What “independent” actually means',
    body: [
      'Independent legal advice means the solicitor is acting solely in your interests. They have no connection to your employer. They are not looking to maintain a relationship with your employer’s HR department for future work.',
      'A genuinely independent solicitor will tell you honestly whether your offer is fair, whether there is room to negotiate, and whether any aspect of the agreement raises concerns. Their only obligation is to you.',
    ],
  },
  {
    title: 'Your employer still pays the fees',
    body: [
      'Whichever solicitor you choose, your employer is typically required to cover the cost of your legal advice. The standard contribution is £350 to £750 for a straightforward case. This is part of the settlement arrangement and applies regardless of which solicitor you select.',
      'You are not penalised financially for choosing your own solicitor. The contribution stays the same.',
    ],
  },
  {
    title: 'When the recommended solicitor is fine',
    body: [
      'Choosing your own solicitor is a right, not an obligation. If you have already spoken to the solicitor your employer suggested and feel comfortable, that can be a perfectly reasonable route.',
      'The question to ask yourself is this: does this solicitor’s advice feel honest and complete, or does it feel like they are steering you towards signing quickly?',
      'If the advice feels rushed, if they seem reluctant to discuss whether you could negotiate more, or if they are dismissing your questions, those are signs it may be worth getting a second opinion.',
    ],
  },
  {
    title: 'What to say to your employer',
    body: [
      'You do not need to explain or justify your choice of solicitor to your employer. A simple response along the lines of “I will be arranging my own independent legal advice” is sufficient. Your employer cannot delay or withhold the settlement process because you chose a different solicitor.',
      'If your employer objects or tries to pressure you into using their recommended solicitor, note that down. An independent solicitor can advise you on whether that constitutes undue pressure.',
    ],
  },
]

const whenToChooseItems = [
  'Your employer has a long-term relationship with the recommended firm',
  'You feel the recommended solicitor is not giving you enough time',
  'You want to understand whether your offer could be higher before signing',
  'You have concerns about discrimination, unfair treatment, or other circumstances your employer may not want examined closely',
]

export default function EmployerRecommendedSolicitor() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-5">
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-5">
              Do I have to use the solicitor my employer recommends?
            </h1>
            <p className="sc-lead">
              No. You are not required to use the solicitor your employer suggests. You have the right to choose any solicitor you want for independent legal advice on your settlement agreement. This is not just a courtesy. It is built into the legal process.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-paper py-12">
          <div className="max-w-2xl mx-auto px-5 space-y-10">

            {sections.map((s) => (
              <div key={s.title} className="space-y-3">
                <h2 className="guide-h2">{s.title}</h2>
                {s.body.map((para, i) => (
                  <p key={i} className="guide-body">{para}</p>
                ))}
              </div>
            ))}

            {/* When to choose own solicitor — callout list */}
            <div className="space-y-3">
              <h2 className="guide-h2">When to choose your own solicitor</h2>
              <p className="guide-body">Consider finding your own solicitor if:</p>
              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-5">
                {whenToChooseItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                    <span className="guide-body">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="guide-body">
                In any of these situations, your interests are better served by someone who has no prior relationship with your employer.
              </p>
            </div>

            {/* How to find */}
            <div className="space-y-3">
              <h2 className="guide-h2">How to find an independent settlement agreement solicitor</h2>
              <p className="guide-body">
                You can search for employment solicitors in your area through the{' '}
                <a
                  href="https://www.sra.org.uk/consumers/register/"
                  className="text-ink underline underline-offset-2 hover:text-coral transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitors Regulation Authority&apos;s website
                </a>
                , which lists all SRA-regulated solicitors in England and Wales.
              </p>
              <p className="guide-body">
                When you contact a solicitor, ask whether they specialise in settlement agreements and whether they have any existing relationship with your employer or their legal team. A good solicitor will answer both questions directly.
              </p>
              <p className="guide-body">
                Alternatively, you can use SettlementCheck to get matched with a vetted settlement agreement specialist within 24 hours. Every solicitor on our panel is SRA-regulated and handles settlement agreements regularly. None of them have a commercial relationship with your employer.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Find out where your offer stands
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Free calculator. Vetted solicitor matched within 24 hours. Your employer pays the fees.
              </p>
              <Link href="/" className="btn-accent">
                Check my offer →
              </Link>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-2">
              <h2 className="guide-h2">Frequently asked questions</h2>
              <div className="divide-y divide-rule border-t border-rule">
                {FAQS.map(({ q, a }) => (
                  <div key={q} className="py-5">
                    <h3 className="font-serif text-[17px] font-[460] text-ink tracking-[-0.008em] leading-snug mb-2">{q}</h3>
                    <p className="guide-body">{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed">
              SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
