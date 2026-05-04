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
    a: 'Your employer covers the solicitor\'s fees for reviewing a settlement agreement. The standard contribution is £350 to £750. You should not have to pay anything out of your own pocket for the initial advice.',
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
        <section className="bg-paper pt-16 pb-12">
          <div className="max-w-3xl mx-auto px-4">
            <span className="inline-block bg-paper-2 text-muted text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide mb-5">
              Settlement agreement guide
            </span>
            <h1 className="sc-h1 mb-4">
              Do I Have to Use the Solicitor My Employer Recommends?
            </h1>
            <p className="sc-lead">
              No. You are not required to use the solicitor your employer suggests. You have the right to choose any solicitor you want for independent legal advice on your settlement agreement. This is not just a courtesy. It is built into the legal process.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-paper pb-16">
          <div className="max-w-3xl mx-auto px-4 space-y-10">

            <div className="space-y-4">
              <h2 className="sc-h2">What the law actually requires</h2>
              <p className="text-muted text-sm leading-relaxed">
                Before a settlement agreement is legally binding, you must receive independent legal advice from a qualified solicitor or other relevant adviser. This is set out in Section 203 of the Employment Rights Act 1996.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                The key word is independent. The advice must come from someone who is not connected to your employer or acting in your employer&apos;s interests. It must be advice given on your behalf, about your situation.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                Your employer cannot tell you which solicitor to use. They can suggest one. They cannot insist.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">Why employers recommend a specific solicitor</h2>
              <p className="text-muted text-sm leading-relaxed">
                Most employers suggest a solicitor as a practical convenience. In straightforward situations, the recommended solicitor may be perfectly competent and entirely fair.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                However, the recommended solicitor has typically handled settlement agreements for that employer before. They know the employer&apos;s HR team. They may have a commercial relationship with the business.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                That does not mean they will give you bad advice. But it does mean their existing relationship is with your employer, not with you. That is worth knowing before you decide.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">What &ldquo;independent&rdquo; actually means</h2>
              <p className="text-muted text-sm leading-relaxed">
                Independent legal advice means the solicitor is acting solely in your interests. They have no connection to your employer. They are not looking to maintain a relationship with your employer&apos;s HR department for future work.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                A genuinely independent solicitor will tell you honestly whether your offer is fair, whether there is room to negotiate, and whether any aspect of the agreement raises concerns. Their only obligation is to you.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">Your employer still pays the fees</h2>
              <p className="text-muted text-sm leading-relaxed">
                Whichever solicitor you choose, your employer is typically required to cover the cost of your legal advice. The standard contribution is £350 to £750 for a straightforward case. This is part of the settlement arrangement and applies regardless of which solicitor you select.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                You are not penalised financially for choosing your own solicitor. The contribution stays the same.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">When the recommended solicitor is fine</h2>
              <p className="text-muted text-sm leading-relaxed">
                Choosing your own solicitor is a right, not an obligation. If you have already spoken to the solicitor your employer suggested and feel comfortable, that can be a perfectly reasonable route.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                The question to ask yourself is this: does this solicitor&apos;s advice feel honest and complete, or does it feel like they are steering you towards signing quickly?
              </p>
              <p className="text-muted text-sm leading-relaxed">
                If the advice feels rushed, if they seem reluctant to discuss whether you could negotiate more, or if they are dismissing your questions, those are signs it may be worth getting a second opinion.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">When to choose your own solicitor</h2>
              <p className="text-muted text-sm leading-relaxed">Consider finding your own solicitor if:</p>
              <ul className="space-y-2 pl-4">
                {[
                  'Your employer has a long-term relationship with the recommended firm',
                  'You feel the recommended solicitor is not giving you enough time',
                  'You want to understand whether your offer could be higher before signing',
                  'You have concerns about discrimination, unfair treatment, or other circumstances your employer may not want examined closely',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted text-sm leading-relaxed">
                In any of these situations, your interests are better served by someone who has no prior relationship with your employer.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">How to find an independent settlement agreement solicitor</h2>
              <p className="text-muted text-sm leading-relaxed">
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
              <p className="text-muted text-sm leading-relaxed">
                When you contact a solicitor, ask whether they specialise in settlement agreements and whether they have any existing relationship with your employer or their legal team. A good solicitor will answer both questions directly.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                Alternatively, you can use SettlementCheck to get matched with a vetted settlement agreement specialist within 24 hours. Every solicitor on our panel is SRA-regulated and handles settlement agreements regularly. None of them have a commercial relationship with your employer.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="sc-h2">What to say to your employer</h2>
              <p className="text-muted text-sm leading-relaxed">
                You do not need to explain or justify your choice of solicitor to your employer. A simple response along the lines of &ldquo;I will be arranging my own independent legal advice&rdquo; is sufficient. Your employer cannot delay or withhold the settlement process because you chose a different solicitor.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                If your employer objects or tries to pressure you into using their recommended solicitor, note that down. An independent solicitor can advise you on whether that constitutes undue pressure.
              </p>
            </div>

            {/* CTA box */}
            <div className="bg-paper-2 border border-rule rounded-2xl p-8 text-center">
              <h2 className="sc-h2 mb-2">Find out where your offer stands</h2>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Use our free calculator. It takes 60 seconds and your employer pays the fees.
              </p>
              <Link href="/" className="btn-accent">
                Check my offer →
              </Link>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-4">
              <h2 className="sc-h2">Frequently asked questions</h2>
              <div className="divide-y divide-rule border-t border-rule">
                {FAQS.map(({ q, a }) => (
                  <div key={q} className="py-5">
                    <h3 className="font-serif text-[17px] font-460 text-ink tracking-[-0.008em] mb-2">{q}</h3>
                    <p className="text-sm text-muted leading-relaxed">{a}</p>
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
