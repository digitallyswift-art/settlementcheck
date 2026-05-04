import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Calculator Disclaimer | SettlementCheck',
  description: 'The SettlementCheck calculator provides estimates only and does not constitute legal advice. You must obtain independent legal advice before signing a settlement agreement.',
  alternates: { canonical: 'https://settlementcheck.co.uk/disclaimer/' },
  robots: { index: true, follow: false },
}

export default function Disclaimer() {
  return (
    <>
      <Nav />
      <main className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h2 className="font-bold text-amber-900 mb-1">Important: This is not legal advice</h2>
              <p className="text-sm text-amber-800 leading-relaxed">
                The calculator on SettlementCheck.co.uk provides estimates only. You must obtain independent legal
                advice from a qualified solicitor before signing a settlement agreement.
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Calculator Disclaimer</h1>

          {[
            {
              title: 'What the calculator does',
              body: 'The SettlementCheck calculator applies the UK statutory redundancy formula (using 2024/25 rates, including a weekly pay cap of £643) and general market data to produce an estimate of the minimum statutory entitlement and typical settlement range for your situation.',
            },
            {
              title: 'What the calculator does not do',
              body: 'The calculator does not account for your specific employment contract, any enhanced redundancy terms, your negotiation history, PILON (payment in lieu of notice) clauses, gardening leave arrangements, bonus or share entitlements, restrictive covenants, or the strength of any potential discrimination or unfair dismissal claim.',
            },
            {
              title: 'Discrimination claims',
              body: 'If you have indicated potential discrimination in your situation, be aware that compensation for discrimination is uncapped in Employment Tribunals. The calculator cannot quantify discrimination claims — only a qualified solicitor can assess these.',
            },
            {
              title: 'Statutory rates',
              body: 'Statutory rates change annually. The calculator uses rates effective from April 2024. If you are reading this after April 2025, rates may have changed. Always confirm current rates with a solicitor.',
            },
            {
              title: 'No solicitor-client relationship',
              body: 'Using this calculator does not create a solicitor-client relationship. SettlementCheck is not regulated by the Solicitors Regulation Authority. We are an introduction service only.',
            },
            {
              title: 'Legal requirement for advice',
              body: 'Under Section 203 of the Employment Rights Act 1996, a settlement agreement (formerly a compromise agreement) is only legally binding if you have received independent legal advice from a qualified solicitor on the terms and effect of the agreement. A calculator estimate does not satisfy this requirement.',
            },
          ].map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
