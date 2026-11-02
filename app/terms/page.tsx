import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'SettlementCheck Terms of Use & Service | SettlementCheck',
  description:
    'Terms of use for SettlementCheck.co.uk, the independent platform connecting UK employees with SRA-regulated employment solicitors. Updated for 2026.',
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
          <p className="text-sm text-gray-400 mb-8">Last updated: 1 January 2026</p>

          {[
            {
              title: '1. About SettlementCheck',
              body: (
                <>
                  SettlementCheck.co.uk is operated by{' '}
                  <a
                    href="https://digitallyswift.com"
                    target="_blank"
                    rel="noopener"
                    className="text-coral underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    Digitally Swift Ltd
                  </a>
                  . We are an independent introduction and technology platform connecting individuals who have received an exit or settlement offer with independent SRA-regulated employment law solicitors. We are not a law firm, claims management company, or tax advisory practice, and do not provide legal, financial, or tax advice.
                </>
              ),
            },
            {
              title: '2. Use of the calculator & no legal/tax advice',
              body: 'The calculators and tools on this website provide indicative estimates only. Estimates are derived from public UK legislation (including the Employment Rights Act 1996 and SI 2026/310) and standard commercial negotiation benchmarks. They do not constitute formal legal, tax, or financial advice and do not account for bespoke employment contracts, negotiation dynamics, or personal tax circumstances. You must obtain independent advice from a qualified solicitor before signing any settlement agreement.',
            },
            {
              title: '3. No solicitor-client relationship & no duty of care',
              body: 'Using this website, generating calculation summaries, or requesting a solicitor introduction does not create a solicitor-client, fiduciary, or advisory relationship between you and SettlementCheck. SettlementCheck is not authorised or regulated by the Solicitors Regulation Authority (SRA), the Law Society of Scotland, or the Financial Conduct Authority (FCA).',
            },
            {
              title: '4. Solicitor introductions, fee contributions & personal liability',
              body: 'When you submit a request for an independent solicitor match, we introduce your details to independent SRA-regulated law firms on our panel. \n\nLegal Fee Contributions: References on this site to employer fee contributions reflect UK commercial convention, not a statutory entitlement. Under Section 203(3) ERA 1996, independent advice is a legal condition for a valid waiver, but the employer’s financial contribution is negotiated and conditional upon the agreement being completed and signed. \n\nPersonal Liability Warning: If you instruct a solicitor and subsequently reject the offer, abort negotiations, or if the agreement is otherwise not executed, the employer is not obligated to pay the contribution, and you may remain personally liable for your solicitor’s fees under their client care terms. Any legal work exceeding the employer’s agreed fee cap remains your sole financial responsibility. Introduced solicitors are independent contractors, not agents or partners of SettlementCheck, and confirm their own terms of engagement before undertaking chargeable work. SettlementCheck may receive commercial marketing or referral fees from participating panel firms.',
            },
            {
              title: '5. Intellectual property',
              body: 'All content, tools, algorithms, and design elements on this website are owned by or licensed to SettlementCheck.co.uk. You may not reproduce, reverse-engineer, scrape, or distribute content without prior written permission.',
            },
            {
              title: '6. Limitation of liability',
              body: 'To the maximum extent permitted by applicable law, SettlementCheck excludes all liability for any direct, indirect, or consequential loss, cost, or damage arising from reliance on calculator estimates, content on this website, or services provided by introduced third-party solicitors.',
            },
            {
              title: '7. Governing law & jurisdiction',
              body: 'These terms are governed by the laws of England and Wales. Any disputes arising in connection with this platform shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
            },
          ].map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
