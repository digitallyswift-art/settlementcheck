import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { PipExitCalculator } from '@/components/PipExitCalculator'
import { LegalFeeInlineCard } from '@/components/LegalFeeShieldBadge'

export const metadata: Metadata = {
  title: {
    absolute: 'PIP Settlement Calculator UK: Value Your Performance Exit',
  },
  description:
    'Calculate fair settlement payouts when facing a PIP in the UK. Compare employer process costs, statutory notice, and £30,000 tax-free exit terms.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/pip-settlement-calculator/',
  },
}

export default function PipSettlementCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans">
      <Nav />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DCCE] text-xs font-mono text-[#0B1F3A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
            ERA 1996 s.111A Protected Discussions • 100% Free
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#0B1F3A] font-bold mb-3">
            PIP Settlement Agreement Calculator
          </h1>
          <p className="text-base sm:text-lg text-[#0B1F3A]/80 max-w-2xl mx-auto leading-relaxed">
            Placed on a Performance Improvement Plan or offered a protected conversation? Value your exit package based on employer process cost avoidance, statutory notice, and tribunal caps.
          </p>
        </div>

        {/* Interactive Engine */}
        <div className="mb-10">
          <PipExitCalculator />
        </div>

        {/* Legal Fee Shield Reassurance */}
        <div className="mb-10">
          <LegalFeeInlineCard />
        </div>

        {/* Informational Guidance Content */}
        <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 space-y-6 text-[#0B1F3A]">
          <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
            Why UK Employers Offer Settlement Agreements During a PIP
          </h2>
          <p className="text-sm leading-relaxed text-[#0B1F3A]/85">
            A Performance Improvement Plan (PIP) is frequently used by HR departments not to rehabilitate performance, but to build a documentary trail to justify a capability dismissal. However, executing a legally robust capability process under the <strong>Acas Code of Practice 1 on Disciplinary and Grievance Procedures</strong> takes 60 to 90 days, demands substantial senior management hours, and exposes the employer to costly Employment Tribunal litigation under Section 98 of the Employment Rights Act 1996.
          </p>
          <p className="text-sm leading-relaxed text-[#0B1F3A]/85">
            Under <strong>Section 111A of the Employment Rights Act 1996</strong>, employers can initiate confidential pre-termination negotiations (a &quot;protected conversation&quot;) to propose an agreed settlement exit. By calculating what the company saves in salary, management overhead, and tribunal risk, employees gain strong standing to negotiate fair ex-gratia compensation and full legal fee coverage.
          </p>

          <h3 className="text-xl font-serif font-bold text-[#0B1F3A] pt-4 border-t border-[#E2DCCE]">
            Key Negotiation Components for a PIP Settlement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">1. Full Notice Pay (PILON)</strong>
              <span>
                You must receive your contractual or statutory notice pay in full. Under Section 402D ITEPA 2003, Post-Employment Notice Pay is subject to PAYE tax and National Insurance deductions.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">2. Tax-Free Ex-Gratia Uplift</strong>
              <span>
                Under Section 403 ITEPA 2003, up to £30,000 of compensation for loss of office is completely free of income tax and employee Class 1 NICs. Typical commercial PIP uplifts range from 1 to 3.5 months&apos; pay.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">3. Employer-Funded Legal Advice</strong>
              <span>
                Under Section 203(3) ERA 1996, statutory claim waivers are unenforceable without advice from an independent solicitor. Employers standardly contribute £500 to £1,000 + VAT directly to your chosen solicitor.
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
              <strong className="text-sm text-[#0B1F3A] block mb-1">4. Agreed Reference &amp; Clean Exit</strong>
              <span>
                Ensure your agreement specifies an agreed standard factual reference and mutual non-derogatory undertakings, protecting your professional reputation for future roles.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#0B1F3A]/70">
              Need your draft agreement reviewed? Run our confidential clause check.
            </span>
            <div className="flex gap-3">
              <Link
                href="/settlement-agreement-review/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Review Settlement Agreement Clauses →
              </Link>
              <Link
                href="/calculator/"
                className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2"
              >
                Main Settlement Calculator →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
