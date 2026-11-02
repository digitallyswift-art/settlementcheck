import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Regulatory & Fee Disclaimer | SettlementCheck',
  description:
    'SettlementCheck provides independent statutory estimates and solicitor introductions. We do not provide legal or tax advice. Read our full regulatory, fee contribution, and liability notice.',
  alternates: { canonical: 'https://settlementcheck.co.uk/disclaimer/' },
  robots: { index: true, follow: true },
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
              <h2 className="font-bold text-amber-900 mb-1">Important: No Legal or Tax Advice</h2>
              <p className="text-sm text-amber-800 leading-relaxed">
                SettlementCheck is an independent calculation platform and introducer, not a law firm. The calculations
                and guidance on this website provide indicative estimates only and do not constitute legal, tax, or
                financial advice. Under Section 203(3) of the Employment Rights Act 1996, you must obtain advice from an
                independent qualified solicitor before signing a settlement agreement.
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
            Regulatory, Fee &amp; Liability Notice
          </h1>

          {[
            {
              title: '1. Regulatory Status & Non-Solicitor Platform Boundaries',
              body: 'SettlementCheck.co.uk is an independent commercial technology platform and introducer; it is not a law firm, claims management company, or tax advisory practice. SettlementCheck is not authorised or regulated by the Solicitors Regulation Authority (SRA), the Law Society of Scotland, the Law Society of Northern Ireland, or the Financial Conduct Authority (FCA). Nothing on this platform, including statutory redundancy calculators, verdict indicators, compensation benchmarks, tax breakdowns, or automated checklists,constitutes legal, financial, or tax advice, nor does it create a solicitor-client, fiduciary, or advisory relationship.',
            },
            {
              title: '2. Legal Fee Contributions, Caps & Personal Liability Warning',
              body: 'References across this website to employer legal fee contributions describe standard UK commercial practice and do not represent a statutory entitlement under Section 203(3) of the Employment Rights Act 1996 or any other legislation. While Section 203(3) requires that you receive independent legal advice for a statutory waiver to be binding, the payment of legal fees is negotiated between the parties and capped at the employer’s discretion (typically £350 to £500+ plus VAT for standard review and sign-off).\n\nIMPORTANT PERSONAL LIABILITY WARNING: Employer legal fee contributions are strictly conditional upon the formal execution and completion of the settlement agreement. If you instruct a solicitor and subsequently withdraw, reject the settlement offer, or if the agreement is otherwise not completed, your employer will not pay the fee contribution, and you may remain personally liable for your solicitor’s accrued time under their engagement terms. Furthermore, if you instruct your solicitor to undertake protracted negotiations, dispute restrictive covenants, or handle complex claims exceeding the employer’s agreed fee cap, you remain personally responsible for any fee shortfall.',
            },
            {
              title: '3. Independent SRA-Regulated Solicitors & Disclaimer of Agency',
              body: 'Solicitors introduced through SettlementCheck are independent legal practitioners authorised and regulated by the SRA (or respective regional Law Societies). They are independent contractors and are not agents, partners, representatives, or employees of SettlementCheck. SettlementCheck does not direct, supervise, review, or accept liability for the legal services, advice, opinions, acts, or omissions of introduced solicitors. Instructed solicitors establish their own independent terms of engagement and fee structures via a formal client care letter before commencing chargeable work. SettlementCheck may receive commercial marketing or introducer fees from participating firms in compliance with SRA Code of Conduct Rule 5.1.',
            },
            {
              title: '4. Statutory Calculations & Tax Disclaimers',
              body: 'Calculations on this website apply the UK statutory redundancy formula (including the April 2026 weekly pay cap of £751 under SI 2026/310), Section 162 Employment Rights Act 1996, the £30,000 tax exemption under Section 403 ITEPA 2003, and statutory Post-Employment Notice Pay (PENP) rules under Section 402D ITEPA 2003. Calculations are indicative estimates based solely on user inputs and cannot account for bespoke employment contracts, complex share incentive schemes, enhanced contractual redundancy policies, or ongoing pension loss. Calculations do not constitute tax or accountancy advice; you must verify your net tax position with a qualified solicitor or chartered tax accountant.',
            },
            {
              title: '5. Independence from ACAS and Official Bodies',
              body: 'SettlementCheck is an independent educational and estimation platform. It is not affiliated with, endorsed by, or operated by ACAS (the Advisory, Conciliation and Arbitration Service) or any UK government department. Our tools provide calculations derived from public UK legislation and statutory guidance (such as the ACAS Code of Practice on Settlement Agreements). For official, state-funded conciliation services, visit acas.org.uk directly.',
            },
            {
              title: '6. Discrimination & Whistleblowing Claims',
              body: 'Compensation for unlawful discrimination under the Equality Act 2010 and whistleblowing under the Public Interest Disclosure Act 1998 is not subject to the statutory unfair dismissal compensatory cap (£123,543 for 2026/27). Automated tools cannot assess the legal merits, evidence, or financial value of uncapped tribunal claims. Only an instructed employment law solicitor can evaluate these matters.',
            },
            {
              title: '7. Limitation of Liability & No Duty of Care',
              body: 'To the maximum extent permitted by applicable law, SettlementCheck excludes all representations, warranties, conditions, and terms (whether express or implied by statute, common law, or otherwise) and accepts no liability in tort, contract, or otherwise for any loss, damage, or expense arising from reliance on information, calculations, benchmarks, or introductions provided on or through this website.',
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
