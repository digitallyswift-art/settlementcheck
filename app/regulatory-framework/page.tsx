import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Regulatory Framework & SRA Rules | SettlementCheck',
  description:
    'SettlementCheck regulatory framework: SRA Rule 5.1 compliance, FSMA 2000 non-claims-management status, LASPO 2012 insulation, and CMA fee transparency.',
  alternates: { canonical: 'https://settlementcheck.co.uk/regulatory-framework/' },
  robots: { index: true, follow: true },
}

export default function RegulatoryFrameworkPage() {
  return (
    <>
      <Nav />
      <main className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-xs text-muted">
            <Link href="/" className="hover:text-ink transition-colors uppercase font-medium tracking-wide">
              Home
            </Link>
            <span className="text-rule-strong">/</span>
            <span className="uppercase font-medium tracking-wide text-ink">Regulatory Framework</span>
          </div>

          {/* Header */}
          <div className="border-b border-rule pb-8 mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.12em] text-coral font-bold block mb-2">
              Public Compliance &amp; Transparency Shield
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-4 tracking-tight">
              Regulatory Framework &amp; Professional Standards
            </h1>
            <p className="text-base text-muted max-w-3xl leading-relaxed">
              This statutory architecture sets out the legal status, regulatory boundaries, and commercial independence of SettlementCheck (settlementcheck.co.uk) under the Solicitors Regulation Authority (SRA) Standards and Regulations, the Financial Services and Markets Act 2000, LASPO 2012, and UK consumer protection legislation.
            </p>
          </div>

          {/* Quick Summary Shield Banner */}
          <div className="bg-[#FAF7F2] border-l-4 border-coral rounded-r-xl p-6 mb-10 shadow-sm">
            <h2 className="font-serif text-[18px] font-bold text-ink mb-2">
              Core Regulatory Declarations
            </h2>
            <ul className="text-sm text-ink/80 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-coral font-bold">1.</span>
                <span><strong>Technology &amp; Triage Provider:</strong> SettlementCheck is an independent digital intake and calculation platform operated by Digitally Swift Ltd. We are not an authorised law firm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral font-bold">2.</span>
                <span><strong>SRA Rule 5.1 Compliant Introducer:</strong> We introduce users to independent, authorised SRA-regulated solicitors who exercise complete professional independence and owe their duty of care exclusively to the client.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral font-bold">3.</span>
                <span><strong>Non-Claims-Management Declaration:</strong> We do not conduct regulated claims management under FSMA 2000 RAO arts. 89G–89M, nor do we provide reserved legal activities under the Legal Services Act 2007.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral font-bold">4.</span>
                <span><strong>Zero-Commission LASPO 2012 s.56 Compliance:</strong> SettlementCheck never takes a percentage of settlement compensation, nor receives success-contingent referral payments.</span>
              </li>
            </ul>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-ink">
                1. Legal Entity Status &amp; Reserved Legal Activities Boundary
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                SettlementCheck (settlementcheck.co.uk) is operated by <strong>Digitally Swift Ltd</strong> (Registered in England and Wales). SettlementCheck is a digital software and statutory triage platform.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                SettlementCheck is <strong>not</strong> a law firm, a licensed Alternative Business Structure (ABS), or a regulated financial or tax advisory practice. It is not authorised or regulated by the Solicitors Regulation Authority (SRA), the Bar Standards Board (BSB), the Law Society of Scotland, the Law Society of Northern Ireland, or the Financial Conduct Authority (FCA).
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Under Section 12 and Schedule 2 of the Legal Services Act 2007, SettlementCheck does not carry out any reserved legal activities (such as the exercise of a right of audience, the conduct of litigation, reserved instrument activities, probate activities, notarial activities, or the administration of oaths). All calculations, benchmarks, guides, and pre-flight briefing agendas generated on this platform are provided strictly for educational, informational, and triage purposes.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-ink">
                2. SRA Standards &amp; Regulations Rule 5.1 Introducer Disclosure
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                SettlementCheck operates in rigorous accordance with the <strong>SRA Code of Conduct for Solicitors, RELs and RFLs Rule 5.1</strong> (Referrals, introductions and separate businesses) and Rule 8.9 (Anti-touting).
              </p>
              <div className="bg-paper-2 border border-rule rounded-xl p-5 text-xs text-ink/80 space-y-3 leading-relaxed">
                <p>
                  <strong>Unfettered Professional Independence:</strong> Any independent solicitor introduced through SettlementCheck is authorised and regulated by the SRA (or regional Law Society in Scotland / Northern Ireland). The solicitor exercises complete, unfettered professional independence when advising the client. SettlementCheck does not direct, influence, supervise, or review the legal advice provided by panel solicitors.
                </p>
                <p>
                  <strong>Exclusive Duty of Care:</strong> The instructed solicitor owes their regulatory and fiduciary duty of care solely to you, the client. No conflict of interest exists between the panel solicitor and SettlementCheck.
                </p>
                <p>
                  <strong>Professional Indemnity Insurance (PII):</strong> All panel law firms are required by SRA regulations to maintain compulsory Professional Indemnity Insurance with minimum qualifying cover of at least £3,000,000 per claim.
                </p>
                <p>
                  <strong>Commercial Introducer Terms:</strong> Participating law firms pay a fixed software licensing or administrative directory listing fee to access our digital triage platform and formatted pre-flight intake dossiers. This fee is independent of the legal advice given and does not increase the costs payable by the employee or employer.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-ink">
                3. Non-Claims-Management Declaration (FSMA 2000 RAO Arts. 89G–89M)
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Under the Financial Services and Markets Act 2000 (Regulated Activities) Order 2001 (as amended), regulated claims management services in Great Britain require authorisation by the Financial Conduct Authority (FCA).
              </p>
              <p className="text-sm text-muted leading-relaxed">
                SettlementCheck is <strong>not</strong> a Claims Management Company (CMC) and does not provide claims management services under FSMA 2000 RAO arts. 89G–89M:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted space-y-1.5 leading-relaxed">
                <li>We do not seek out, evaluate the legal merits of, or investigate individual employment tribunal or court claims.</li>
                <li>We do not provide advice or representation in connection with the institution or conduct of legal proceedings.</li>
                <li>We do not act as an advocate, representative, or negotiator in disputes between employers and employees.</li>
                <li>We do not handle, hold, or disburse client monies or settlement funds.</li>
              </ul>
              <p className="text-sm text-muted leading-relaxed">
                Our tools provide pure mathematical calculations applying primary legislation (such as statutory redundancy pay under Section 162 ERA 1996 and tax baselines under Part 6 Chapter 3 ITEPA 2003) to user-entered figures.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-ink">
                4. LASPO 2012 Section 56 Regulatory Insulation
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Under Section 56 of the Legal Aid, Sentencing and Punishment of Offenders Act 2012 (LASPO 2012), referral fees in personal injury claims are prohibited in England and Wales. High-value settlement agreements often settle all potential claims, including compromises of personal injury or psychiatric injury arising in the course of employment.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                To guarantee absolute compliance with LASPO 2012 s.56:
              </p>
              <div className="bg-paper-2 border border-rule rounded-xl p-5 text-xs text-ink/80 space-y-2 leading-relaxed">
                <p>
                  <strong>No Commission or Success Cuts:</strong> SettlementCheck never receives a percentage cut of settlement proceeds, nor any contingent success payment.
                </p>
                <p>
                  <strong>Fixed Software Licensing:</strong> Any commercial fee paid by panel firms is a fixed subscription or software licensing fee for technology infrastructure.
                </p>
                <p>
                  <strong>No Settlement Data Feedback:</strong> SettlementCheck receives zero financial telemetry regarding whether personal injury elements were compromised or what final ex-gratia sums were agreed upon.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-ink">
                5. CMA, DMCC Act 2024 &amp; CAP Code Fee Contribution Transparency
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                In strict accordance with the Digital Markets, Competition and Consumers Act 2024 (DMCC Act 2024), the Consumer Protection from Unfair Trading Regulations 2008 (CPUTR 2008), and ASA CAP Code 3.1:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted space-y-1.5 leading-relaxed">
                <li>
                  <strong>Statutory Condition vs Commercial Convention:</strong> Under Section 203(3) of the Employment Rights Act 1996, taking advice from an independent qualified adviser is a statutory condition for an employee to validly waive employment tribunal claims.
                </li>
                <li>
                  <strong>No Statutory Obligation to Pay:</strong> Employers are not legally required by statute to fund the employee’s legal fees. However, by universal UK commercial convention, employers almost always agree to provide a capped commercial contribution (typically £350 to £500+ plus VAT, or £1,000+ for senior executives) paid directly to the solicitor upon successful execution of the agreement.
                </li>
                <li>
                  <strong>Personal Liability Warning:</strong> If negotiations abort, if you decide not to sign, or if legal work exceeds the employer’s agreed fee contribution cap, you may remain personally liable for any fee shortfall under your instructed solicitor’s client care agreement.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-ink">
                6. Common Law Contract &amp; Privilege Safeguards
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                To prevent users from inadvertently prejudicing their legal standing or extinguishing open settlement proposals under English contract law:
              </p>
              <div className="bg-paper-2 border border-rule rounded-xl p-5 text-xs text-ink/80 space-y-2 leading-relaxed">
                <p>
                  <strong>The Rule in <em>Hyde v Wrench (1840)</em>:</strong> Submitting a formal, unreviewed counter-offer operates as a matter of law as a rejection of the employer’s existing offer, extinguishing it. An employer is under no obligation to keep the original offer open once a counter-proposal is made.
                </p>
                <p>
                  <strong>The Rule in <em>Routledge v Grant (1828)</em>:</strong> An unaccepted contractual offer can technically be revoked by the offeror at any time prior to acceptance. Although paragraph 12 of the ACAS Code of Practice 4 recommends a minimum of 10 calendar days as general guidance, this is not an irrevocable statutory freeze.
                </p>
                <p>
                  <strong>Without Prejudice Privilege (<em>Rush &amp; Tompkins v GLC</em>):</strong> Marking correspondence &quot;Without Prejudice&quot; does not automatically confer legal privilege unless a genuine dispute has already arisen.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-4 pt-4 border-t border-rule">
              <h2 className="text-xl font-serif font-bold text-ink">
                Mandatory Alert Disclaimers
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                The following two statutory alerts are embedded directly into all SettlementCheck calculation outputs and dossier reviews:
              </p>
              <MandatoryLegalDisclaimers />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
