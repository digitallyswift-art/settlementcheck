import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | SettlementCheck',
  description: 'How SettlementCheck collects, uses, and protects your personal data in accordance with UK GDPR.',
  alternates: { canonical: 'https://settlementcheck.co.uk/privacy/' },
  robots: { index: true, follow: false },
}

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 prose prose-sm prose-gray">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: 1 January 2025</p>

          <Section title="1. Who we are">
            SettlementCheck.co.uk (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an introduction service that connects individuals with
            SRA-regulated employment law solicitors. We are not a law firm and do not provide legal services.
          </Section>

          <Section title="2. What personal data we collect">
            <p>We collect the following data when you use our calculator or contact form:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Name and contact details (email, phone number)</li>
              <li>Employment details (salary, years of service, age)</li>
              <li>Settlement details (offer amount, reason for leaving)</li>
              <li>Your preferred contact time</li>
              <li>IP address and browser information (via analytics)</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            We use your personal data to match you with appropriate employment law solicitors and to send you
            relevant information about your enquiry. We do not sell your data to third parties.
          </Section>

          <Section title="4. Legal basis for processing">
            We process your data on the basis of your explicit consent, given when you submit our contact form.
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
