import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use | SettlementCheck',
  description: 'Terms of use for SettlementCheck.co.uk, an independent introduction service connecting employees with SRA-regulated employment solicitors.',
  alternates: { canonical: 'https://settlementcheck.co.uk/terms/' },
  robots: { index: true, follow: false },
}

export default function Terms() {
  return (
    <>
      <Nav />
      <main className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Terms of Use</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: 1 January 2025</p>

          {[
            {
              title: '1. About SettlementCheck',
              body: 'SettlementCheck.co.uk is an introduction service. We connect individuals who have received a settlement agreement with SRA-regulated employment law solicitors. We are not a law firm and do not provide legal advice or legal services.',
            },
            {
              title: '2. Use of the calculator',
              body: 'The calculator on this site provides estimates only. Estimates are based on published statutory rates and general market data. They do not constitute legal advice and do not account for your specific contract, negotiation history, or personal circumstances. You must obtain independent legal advice from a qualified solicitor before signing any settlement agreement.',
            },
            {
              title: '3. No legal advice',
              body: 'Nothing on this website constitutes legal advice. No solicitor-client relationship is created by using this website. SettlementCheck is not regulated by the Solicitors Regulation Authority (SRA).',
            },
            {
              title: '4. Solicitor introductions',
              body: 'When you request a solicitor match, we share your details with relevant SRA-regulated firms on our panel. We do not guarantee any particular outcome or the quality of advice provided by third-party solicitors.',
            },
            {
              title: '5. Intellectual property',
              body: 'All content on this website is owned by or licensed to SettlementCheck.co.uk. You may not reproduce or distribute content without our written permission.',
            },
            {
              title: '6. Limitation of liability',
              body: 'To the maximum extent permitted by law, SettlementCheck accepts no liability for any loss or damage arising from reliance on calculator estimates or from introductions to third-party solicitors.',
            },
            {
              title: '7. Governing law',
              body: 'These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
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
