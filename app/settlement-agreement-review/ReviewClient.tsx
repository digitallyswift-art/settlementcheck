'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AuditReport } from '@/lib/ai/agents/settlement-auditor'

const SAMPLE_AGREEMENT = `1. The Employment will terminate on 30 April 2026 by mutual agreement.
2. Subject to the Employee complying with this Agreement, the Employer shall pay an Ex-Gratia termination payment of £38,000.
3. The Employer shall pay 1 month's contractual salary in lieu of notice (PILON) subject to statutory deductions.
4. The Employer shall contribute the sum of £350 plus VAT towards the Employee's legal fees incurred in taking advice from a relevant independent adviser.
5. The Employee hereby agrees to waive all claims against the Company, including accrued pension entitlements, personal injury claims, and statutory rights under the Employment Rights Act 1996.
6. The Employee agrees not to make any disparaging statements regarding the Employer.`

export default function ReviewClient() {
  const [agreementText, setAgreementText] = useState('')
  const [salary, setSalary] = useState('')
  const [yearsOfService, setYearsOfService] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    'Parsing contractual clauses and compensation breakdown...',
    'Verifying statutory caps (£751/wk) and tax thresholds (ITEPA 2003 s.403)...',
    'Synthesizing tactical negotiation points and counter-offer strategy...',
  ]

  const handleUseSample = () => {
    setAgreementText(SAMPLE_AGREEMENT)
    setSalary('65000')
    setYearsOfService('5')
    setAge('43')
    setError(null)
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreementText || agreementText.trim().length < 20) {
      setError('Please paste at least 20 characters of your draft agreement or offer letter.')
      return
    }

    setLoading(true)
    setError(null)
    setReport(null)
    setStepIndex(0)

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < 2 ? prev + 1 : prev))
    }, 1100)

    try {
      const res = await fetch('/api/review-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementText,
          context: {
            salary: salary ? Number(salary) : undefined,
            yearsOfService: yearsOfService ? Number(yearsOfService) : undefined,
            age: age ? Number(age) : undefined,
          },
        }),
      })

      clearInterval(stepInterval)

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete review')
      }

      setReport(data.report)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while reviewing the agreement.')
    } finally {
      setLoading(false)
      clearInterval(stepInterval)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-2 border border-rule text-xs font-mono text-ink mb-4">
          <span className="w-2 h-2 rounded-full bg-coral inline-block animate-pulse" />
          Confidential UK Employment Settlement Check • 100% Free
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-ink font-bold mb-3">
          Check your employment settlement agreement
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
          Paste your draft clauses or protected conversation offer. In seconds, see if your employment termination payout meets UK statutory rates, check £30k tax rules, and find out what to ask for.
        </p>
      </div>

      {/* Input Form Box */}
      <div className="bg-card border border-rule rounded-xl p-6 sm:p-8 shadow-sm mb-8">
        <form onSubmit={handleReview} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="agreement-text" className="block text-sm font-semibold text-ink">
                Draft Employment Agreement Clauses or Offer Terms
              </label>
              <button
                type="button"
                onClick={handleUseSample}
                className="text-xs text-coral hover:text-coral-ink font-medium underline"
              >
                Load Sample Agreement
              </button>
            </div>
            <textarea
              id="agreement-text"
              rows={8}
              value={agreementText}
              onChange={(e) => setAgreementText(e.target.value)}
              placeholder="Paste clause snippets, compensation amounts, legal fee contributions, or termination terms here..."
              className="w-full p-3.5 border border-rule rounded-lg font-mono text-xs sm:text-sm text-ink bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <p className="text-xs text-muted-2 mt-1.5">
              Strictly confidential. No names or personal data are stored. Your employer covers your solicitor fees.
            </p>
          </div>

          {/* Optional Context Inputs */}
          <div className="pt-4 border-t border-rule">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Optional Context (Enables Statutory Minimum Floor Check)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="salary-input" className="block text-xs font-medium text-ink mb-1">
                  Gross Annual Salary (£)
                </label>
                <input
                  id="salary-input"
                  type="number"
                  placeholder="e.g. 55000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
              <div>
                <label htmlFor="service-input" className="block text-xs font-medium text-ink mb-1">
                  Years of Service
                </label>
                <input
                  id="service-input"
                  type="number"
                  placeholder="e.g. 4"
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(e.target.value)}
                  className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
              <div>
                <label htmlFor="age-input" className="block text-xs font-medium text-ink mb-1">
                  Age
                </label>
                <input
                  id="age-input"
                  type="number"
                  placeholder="e.g. 38"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-crimson-tint border border-crimson rounded-lg text-xs text-crimson font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 bg-coral hover:bg-coral-ink text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Checking agreement terms...' : 'Check my agreement now →'}
          </button>
        </form>

        {/* Loading Progress State */}
        {loading && (
          <div className="mt-6 pt-6 border-t border-rule space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-coral border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-ink">{steps[stepIndex]}</span>
            </div>
            <div className="w-full bg-paper-2 h-2 rounded-full overflow-hidden">
              <div
                className="bg-coral h-full transition-all duration-700 ease-out"
                style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Generated Review Report Card */}
      {report && (
        <div className="space-y-6">
          {/* Executive Overview */}
          <div className="bg-card border border-rule rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-ink mb-4">
              Your Settlement Agreement Breakdown
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-paper p-3.5 rounded-lg border border-rule">
                <span className="text-xs text-muted block mb-1">Ex-Gratia Offer</span>
                <span className="text-lg font-bold text-ink">
                  {report.extractedTerms.exGratiaAmount !== undefined
                    ? `£${report.extractedTerms.exGratiaAmount.toLocaleString('en-GB')}`
                    : 'Not Specified'}
                </span>
              </div>
              <div className="bg-paper p-3.5 rounded-lg border border-rule">
                <span className="text-xs text-muted block mb-1">Notice / PILON</span>
                <span className="text-lg font-bold text-ink">
                  {report.extractedTerms.noticePayPilon !== undefined
                    ? `£${report.extractedTerms.noticePayPilon.toLocaleString('en-GB')}`
                    : 'Included / Unstated'}
                </span>
              </div>
              <div className="bg-paper p-3.5 rounded-lg border border-rule">
                <span className="text-xs text-muted block mb-1">Employer Legal Fee</span>
                <span className="text-lg font-bold text-ink">
                  {report.extractedTerms.legalFeeContribution !== undefined
                    ? `£${report.extractedTerms.legalFeeContribution}`
                    : '£0 (Missing)'}
                </span>
              </div>
              <div className="bg-paper p-3.5 rounded-lg border border-rule">
                <span className="text-xs text-muted block mb-1">Tax-Free Floor</span>
                <span className="text-lg font-bold text-ink">£30,000 (s.403)</span>
              </div>
            </div>

            {/* Statutory Check Badges */}
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-3">
              Statutory Rule & Compliance Checks
            </h3>
            <div className="space-y-3 mb-6">
              {report.statutoryChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border text-sm flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    check.status === 'critical'
                      ? 'bg-crimson-tint border-crimson text-crimson'
                      : check.status === 'warning'
                      ? 'bg-amber-tint border-amber text-ink'
                      : 'bg-paper border-rule text-ink'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                          check.status === 'critical'
                            ? 'bg-crimson text-white'
                            : check.status === 'warning'
                            ? 'bg-amber text-white'
                            : 'bg-ink text-white'
                        }`}
                      >
                        {check.status}
                      </span>
                      <span className="font-semibold">{check.item}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink opacity-90">{check.detail}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap self-end sm:self-auto font-mono">
                    {check.governingLegislation}
                  </span>
                </div>
              ))}
            </div>

            {/* Tactical Counter-Offer & Negotiation Points */}
            <div className="bg-paper-2 border border-rule rounded-xl p-5 sm:p-6 mb-6">
              <h3 className="text-base font-serif font-bold text-ink mb-3">
                Tactical Negotiation Leverage Points
              </h3>
              <ul className="space-y-2 mb-4">
                {report.tacticalNegotiationPoints.map((point, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-ink flex items-start gap-2">
                    <span className="text-coral font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {report.recommendedCounterOffer && (
                <div className="mt-4 pt-4 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted uppercase tracking-wider block">
                      Target Settlement Range
                    </span>
                    <span className="text-xl font-bold text-ink font-serif">
                      £{report.recommendedCounterOffer.suggestedExGratiaLow.toLocaleString('en-GB')} – £{report.recommendedCounterOffer.suggestedExGratiaHigh.toLocaleString('en-GB')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted uppercase tracking-wider block">
                      Recommended Legal Fee Target
                    </span>
                    <span className="text-lg font-bold text-ink">
                      £{report.recommendedCounterOffer.recommendedLegalFeeContribution} + VAT
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* High-Intent Next Step Box */}
            <div className="bg-ink text-paper p-6 rounded-xl space-y-4">
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-bold text-white">
                  Have an SRA-Regulated Employment Solicitor Sign Your Agreement
                </h4>
                <p className="text-xs sm:text-sm text-paper opacity-90">
                  By UK law (Employment Rights Act 1996 s.203), your settlement agreement is only valid once signed off by an independent qualified solicitor. Your employer covers these legal fees.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/calculator/"
                  className="inline-flex justify-center items-center px-5 py-3 bg-coral hover:bg-coral-ink text-white font-medium rounded-lg text-sm transition-colors text-center"
                >
                  Calculate Employment Settlement Baseline →
                </Link>
                <Link
                  href="/how-it-works/"
                  className="inline-flex justify-center items-center px-5 py-3 bg-transparent border border-paper text-white hover:bg-white hover:text-ink font-medium rounded-lg text-sm transition-colors text-center"
                >
                  How Employment Solicitor Matching Works
                </Link>
              </div>
            </div>

            <p className="text-xs text-muted-2 mt-4 text-center">
              {report.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
