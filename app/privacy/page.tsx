import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieSettingsButton from '@/components/CookieSettingsButton'

export const metadata: Metadata = {
  title: 'Privacy Policy & UK GDPR Compliance | SettlementCheck',
  description:
    'Learn how SettlementCheck protects your confidential case data and privacy in accordance with UK GDPR and the Data Protection Act 2018. Updated 2026.',
  alternates: { canonical: 'https://settlementcheck.co.uk/privacy/' },
  robots: { index: true, follow: true },
}

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 prose prose-sm prose-gray">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: November 2026</p>

          <Section title="1. Who we are">
            SettlementCheck.co.uk (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by{' '}
            <a
              href="https://digitallyswift.com"
              target="_blank"
              rel="noopener"
              className="text-coral underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Digitally Swift Ltd
            </a>
            , an independent UK digital technology company. SettlementCheck is an introduction service that connects individuals with
            SRA-regulated employment law solicitors. We are not a law firm and do not provide legal services.
          </Section>

          <Section title="2. What personal data we collect">
            <p>We collect the following data when you use our calculator or solicitor matching form:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Name and contact details (email, phone number, postcode area)</li>
              <li>Employment details (salary, years of service, age)</li>
              <li>Settlement details (offer amount, reason for leaving)</li>
              <li>Your preferred contact time</li>
              <li>IP address and browser information (via analytics, only with your consent)</li>
            </ul>
          </Section>

          <Section title="3. Special Category Data (UK GDPR Article 9) &amp; Client-Side Checklists">
            <p className="mb-2">
              Where you voluntarily indicate circumstances involving maternity, pregnancy, sickness absence, disability, or discrimination when requesting a solicitor introduction, this may include Special Category Data under Article 9(1) of the UK GDPR and the Data Protection Act 2018.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li><strong>Article 9(2)(a) Explicit Consent:</strong> We process any Special Category Data strictly on the basis of your explicit consent when you request a solicitor introduction.</li>
              <li><strong>Zero-Upload Clause Checklist:</strong> Our settlement agreement clause readiness checklist at <code>/settlement-agreement-review/</code> runs entirely client-side in your browser. It does not accept free-text document uploads and does not transmit draft contract text to our servers or third-party AI APIs.</li>
              <li><strong>Data Minimisation:</strong> We only collect the structured details required to introduce you to an independent SRA-regulated employment solicitor.</li>
            </ul>
          </Section>

          <Section title="4. How we use your data">
            We use your personal data to match you with an independent SRA-regulated employment law solicitor at your request and to send you
            relevant information about your enquiry. We never sell your data to third parties or share it with your employer.
          </Section>

          <Section title="5. Legal basis for processing">
            We process your personal data on the basis of your explicit consent (UK GDPR Article 6(1)(a) and, where applicable, Article 9(2)(a)), given when you submit our solicitor matching form or clause check.
            You may withdraw consent at any time by contacting us at privacy@settlementcheck.co.uk.
          </Section>

          <Section title="6. Data retention">
            We retain your enquiry data for up to 24 months from the date of your enquiry, unless you request earlier
            deletion. Anonymous cookie consent audit logs (containing no personal identifiers) are retained for up to 24 months to demonstrate compliance under UK GDPR Article 7(1).
          </Section>

          <Section title="7. Your rights">
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing</li>
              <li>Data portability</li>
              <li>Lodge a complaint with the ICO (ico.org.uk)</li>
            </ul>
          </Section>

          <Section title="8. Cookies, browser storage &amp; consent" id="cookies">
            <p className="mb-3">
              We comply with the UK Privacy and Electronic Communications Regulations (PECR) and UK GDPR. Non-essential analytics and experience-testing cookies are disabled by default until you give explicit opt-in consent via our cookie banner.
            </p>
            <div className="mb-4">
              <CookieSettingsButton
                label="Manage cookie preferences"
                className="inline-flex items-center px-4 py-2 rounded-sm border border-ink bg-paper text-ink text-xs font-semibold hover:bg-paper-2 transition-colors"
              />
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-900">
                    <th className="py-2 pr-3 font-semibold">Name</th>
                    <th className="py-2 pr-3 font-semibold">Provider</th>
                    <th className="py-2 pr-3 font-semibold">Category</th>
                    <th className="py-2 pr-3 font-semibold">Purpose</th>
                    <th className="py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="py-2 pr-3 font-mono">sc_cookie_consent</td>
                    <td className="py-2 pr-3">SettlementCheck</td>
                    <td className="py-2 pr-3">Strictly necessary</td>
                    <td className="py-2 pr-3">Stores your cookie choices and anonymous consent receipt ID.</td>
                    <td className="py-2">180 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-mono">sc_saved_calc_*</td>
                    <td className="py-2 pr-3">SettlementCheck (sessionStorage)</td>
                    <td className="py-2 pr-3">Strictly necessary</td>
                    <td className="py-2 pr-3">Preserves your calculator inputs during your active browser session.</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-mono">_ga, _ga_*</td>
                    <td className="py-2 pr-3">Google Analytics 4</td>
                    <td className="py-2 pr-3">Analytics (opt-in)</td>
                    <td className="py-2 pr-3">Measures anonymised page traffic and tool usage via Google Consent Mode v2. Sensitive salary and dispute parameters are stripped before transmission.</td>
                    <td className="py-2">Up to 13 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-mono">sc_calc_assigned_variant</td>
                    <td className="py-2 pr-3">SettlementCheck (sessionStorage)</td>
                    <td className="py-2 pr-3">Analytics (opt-in)</td>
                    <td className="py-2 pr-3">Assigns a consistent calculator layout during anonymised usability testing.</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              <strong>Consent audit log (UK GDPR Article 7(1)):</strong> When you accept, reject, or update your cookie settings, we record an anonymous consent receipt (random receipt ID, granted categories, policy version, timestamp, and a one-way salted hash of your IP address) in our secure database. We never store raw IP addresses or personal identifiers in this log.
            </p>
          </Section>

          <Section title="9. Sub-processors &amp; international data transfers">
            <p className="mb-2">
              To operate the platform securely, we use vetted infrastructure sub-processors including Vercel (hosting), Supabase (database), Resend (transactional OTP and enquiry emails), Postcodes.io (UK postcode lookup), Google Analytics 4 (only where you opt in), and enterprise AI APIs under zero-data-retention terms for voluntary clause reviews.
            </p>
            <p>
              Where any sub-processor processes data outside the UK, transfers are safeguarded under the UK Extension to the EU-US Data Privacy Framework (UK-US Data Bridge) or the UK International Data Transfer Agreement (IDTA).
            </p>
          </Section>

          <Section title="10. Contact">
            For data protection enquiries: privacy@settlementcheck.co.uk
          </Section>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  )
}
