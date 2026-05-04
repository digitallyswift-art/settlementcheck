import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'How It Works | SettlementCheck',
  description: 'Learn how SettlementCheck helps you get a fair settlement agreement, matched with a vetted solicitor at no cost to you.',
}

export default function HowItWorks() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-white pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              How SettlementCheck works
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              From receiving a settlement offer to having specialist legal advice — most people complete the whole
              process in under an hour.
            </p>
          </div>
        </section>

        {/* Steps detailed */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto px-4 space-y-12">
            {[
              {
                step: '01',
                title: 'Check your offer',
                icon: '🧮',
                body: [
                  "Enter your salary, years of service, age, and the settlement amount your employer has offered. Our calculator uses the UK's statutory redundancy formula (2024/25 rates) to give you an instant estimate.",
                  'The calculator shows you whether your offer is below the legal minimum, below the typical range, within range, or above the typical range — in plain English, in seconds.',
                  'If you indicate potential discrimination, we flag this separately — because discrimination claims are uncapped and can significantly increase your settlement value.',
                ],
              },
              {
                step: '02',
                title: 'Match with a solicitor',
                icon: '🤝',
                body: [
                  'After seeing your estimate, you can choose to be matched with 2–3 vetted employment law solicitors in your area. Every solicitor on our panel is SRA-regulated with specific experience in settlement agreements.',
                  "We share your situation details (offer amount, salary, years of service, and verdict) so solicitors arrive informed. You don't need to explain everything from scratch.",
                  'We guarantee a response within 24 hours. Most solicitors respond the same day.',
                ],
              },
              {
                step: '03',
                title: 'Get advice — free',
                icon: '✅',
                body: [
                  'Under UK employment law, your employer is legally required to contribute to your legal fees for independent advice on a settlement agreement. The typical employer contribution is £350–750.',
                  'This means you pay nothing — not for using SettlementCheck, and not for the solicitor\'s advice.',
                  'The solicitor will review your agreement, advise you on your rights, and (if you choose) help you negotiate a better offer.',
                ],
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-8">
                <div className="hidden md:block text-7xl font-black text-green-100 leading-none pt-1 select-none">
                  {step.step}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h2>
                  <div className="space-y-3">
                    {step.body.map((para, i) => (
                      <p key={i} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">About SettlementCheck</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                SettlementCheck was created to help employees navigate settlement agreements without the confusion,
                delay, and uncertainty that typically surrounds them.
              </p>
              <p>
                We are an introduction service — we connect employees with SRA-regulated employment law solicitors.
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
        <section id="faq" className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Common questions</h2>
            <FaqAccordion />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-800 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to check your offer?</h2>
            <p className="text-white/80 mb-6">Free, confidential, and takes 60 seconds.</p>
            <Link
              href="/#calculator"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Check my offer now →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
