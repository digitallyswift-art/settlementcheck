import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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
          <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

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
            <p>We collect the following data when you use our calculator, clause review tool, or solicitor matching form:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Name and contact details (email, phone number, postcode area)</li>
              <li>Employment details (salary, years of service, age)</li>
              <li>Settlement details (offer amount, reason for leaving, draft clause text if voluntarily pasted)</li>
              <li>Your preferred contact time</li>
              <li>IP address and browser information (via analytics)</li>
            </ul>
          </Section>

          <Section title="3. Special Category Data (UK GDPR Article 9) & Automated Document Triage">
            <p className="mb-2">
              Where you voluntarily indicate circumstances involving maternity, pregnancy, sickness absence, disability, or discrimination, or paste draft settlement agreement clauses into our review tool, this may include Special Category Data under Article 9(1) of the UK GDPR and the Data Protection Act 2018.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li><strong>Article 9(2)(a) Explicit Consent:</strong> We process any Special Category Data strictly on the basis of your explicit consent when you request a calculation breakdown, clause check, or solicitor introduction.</li>
              <li><strong>Automated Clause Scanning &amp; Sub-Processors:</strong> Text submitted to the `/settlement-agreement-review/` tool is processed transiently via enterprise AI APIs under strict zero-data-retention and zero-model-training agreements solely to generate your Solicitor Discussion Agenda.</li>
              <li><strong>Data Minimisation:</strong> You are encouraged to redact personal names and medical details before pasting draft clause text.</li>
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

          <Section title="5. Data retention">
            We retain your data for up to 24 months from the date of your enquiry, unless you request earlier
            deletion.
          </Section>

          <Section title="6. Your rights">
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

          <Section title="7. Cookies" id="cookies">
            We use essential cookies to operate the site and analytics cookies (Google Analytics) to understand
            how visitors use the site. You can disable analytics cookies in your browser settings.
          </Section>

          <Section title="8. Contact">
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
