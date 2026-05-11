import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Does it cost me anything?', acceptedAnswer: { '@type': 'Answer', text: 'No. Your employer is required by UK law to cover your legal fees for this process, typically £350 to £750. You pay nothing.' } },
    { '@type': 'Question', name: 'Do I legally need a solicitor?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Under Section 203 of the Employment Rights Act 1996, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured solicitor.' } },
    { '@type': 'Question', name: 'How quickly will a solicitor contact me?', acceptedAnswer: { '@type': 'Answer', text: 'All panel solicitors commit to responding within 24 hours of an introduction. Most reach out the same business day.' } },
    { '@type': 'Question', name: 'What if I want to negotiate a higher amount?', acceptedAnswer: { '@type': 'Answer', text: 'Many employees do successfully negotiate more once a solicitor reviews their circumstances. A specialist will assess whether factors like length of service, discrimination, whistleblowing, or contract breaches justify a higher offer.' } },
    { '@type': 'Question', name: 'Is my information shared?', acceptedAnswer: { '@type': 'Answer', text: 'Only with the small panel of solicitors you choose to be introduced to. Never with employers, recruiters, or third parties.' } },
    { '@type': 'Question', name: 'Why is your calculator independent when others are not?', acceptedAnswer: { '@type': 'Answer', text: 'Most settlement calculators are built by law firms. Our calculator is run by an independent platform with no firm to promote. The estimate you get reflects your actual situation.' } },
  ],
}

export const metadata: Metadata = {
  title: 'How SettlementCheck Works | Settlement Agreement Advice UK | SettlementCheck',
  description: 'Three steps: check your offer with our free calculator, get matched with a vetted SRA-regulated employment solicitor within 24 hours, and get honest advice. Your employer pays the fees.',
  alternates: { canonical: 'https://settlementcheck.co.uk/how-it-works/' },
  openGraph: {
    title: 'How SettlementCheck Works',
    description: 'Free settlement agreement calculator, vetted solicitor match within 24 hours, employer pays the legal fees.',
    url: 'https://settlementcheck.co.uk/how-it-works/',
    type: 'website',
  },
}

export default function HowItWorks() {
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
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="sc-h1 mb-4">
              How SettlementCheck works
            </h1>
            <p className="sc-lead max-w-2xl mx-auto">
              From receiving a settlement offer to having specialist legal advice. Most people complete the whole
              process in under an hour.
            </p>
          </div>
        </section>

        {/* Steps detailed */}
        <section className="bg-paper-2 border-y border-rule py-16">
          <div className="max-w-3xl mx-auto px-4 space-y-12">
            {[
              {
                step: '01',
                title: 'Check your offer',
                icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2"/>
                      <line x1="8" y1="7" x2="16" y2="7"/>
                      <line x1="8" y1="11" x2="10" y2="11"/>
                      <line x1="13" y1="11" x2="16" y2="11"/>
                      <line x1="8" y1="15" x2="10" y2="15"/>
                      <line x1="13" y1="15" x2="16" y2="15"/>
                    </svg>
                  ),
                body: [
                  "Enter your salary, years of service, age, and the settlement amount your employer has offered. Our calculator uses the UK's statutory redundancy formula (2024/25 rates) to give you an instant estimate.",
                  'The calculator shows you whether your offer is below the legal minimum, below the typical range, within range, or above the typical range, in plain English, in seconds.',
                  'If you indicate potential discrimination, we flag this separately. Discrimination claims are uncapped and can significantly increase your settlement value.',
                ],
              },
              {
                step: '02',
                title: 'Match with a solicitor',
                icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                body: [
                  'After seeing your estimate, you can choose to be matched with 2–3 vetted employment law solicitors in your area. Every solicitor on our panel is SRA-regulated with specific experience in settlement agreements.',
                  "We share your situation details (offer amount, salary, years of service, and verdict) so solicitors arrive informed. You don't need to explain everything from scratch.",
                  'We guarantee a response within 24 hours. Most solicitors respond the same day.',
                ],
              },
              {
                step: '03',
                title: 'Get advice, free',
                icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  ),
                body: [
                  'Under UK employment law, your employer is legally required to contribute to your legal fees for independent advice on a settlement agreement. The typical employer contribution is £350 to £750.',
                  'This means you pay nothing. Not for using SettlementCheck, and not for the solicitor\'s advice.',
                  'The solicitor will review your agreement, advise you on your rights, and (if you choose) help you negotiate a better offer.',
                ],
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-8">
                <div
                  className="hidden md:block font-serif leading-none pt-1 select-none"
                  style={{ fontSize: 88, fontWeight: 420, color: '#E2DCCE' }}
                  aria-hidden="true"
                >
                  {step.step}
                </div>
                <div className="flex-1 bg-card rounded-2xl border border-rule p-8">
                  <div className="mb-4">{step.icon}</div>
                  <h2 className="sc-section-h2 mb-4">{step.title}</h2>
                  <div className="space-y-3">
                    {step.body.map((para, i) => (
                      <p key={i} className="sc-body">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-paper py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="sc-section-h2 mb-6">About SettlementCheck</h2>
            <div className="space-y-4 sc-body">
              <p>
                SettlementCheck was created to help employees navigate settlement agreements without the confusion,
                delay, and uncertainty that typically surrounds them.
              </p>
              <p>
                We are an introduction service. We connect employees with SRA-regulated employment law solicitors.
                We are not a law firm and we do not provide legal advice. Every solicitor on our panel has been vetted
                for their experience in settlement agreements.
              </p>
              <p>
                Our calculator uses published statutory rates for 2024/25 and general market data to provide
                estimates. It is not legal advice and does not replace a solicitor&apos;s review of your specific
                agreement.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-paper-2 border-y border-rule py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="sc-section-h2 mb-10">Common questions</h2>
            <FaqAccordion />
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0B1F3A', padding: '64px 32px' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="sc-section-h2 text-white mb-3">Ready to check your offer?</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.8)' }}>Free, confidential, and takes 60 seconds.</p>
            <Link href="/calculator" className="btn-accent">
              Check my offer now →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
