'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AuditReport } from '@/lib/ai/agents/settlement-auditor'
import { getOfficialBenchmark, OfficialBenchmarkData } from '@/lib/statutory-rates'
import { trackOutboundCitation, trackSolicitorMatchClick } from '@/lib/telemetry'

const SAMPLE_AGREEMENT = `1. The Employment will terminate on 30 April 2026 by mutual agreement.
2. Subject to the Employee complying with this Agreement, the Employer shall pay an Ex-Gratia termination payment of £38,000.
3. The Employer shall pay 1 month's contractual salary in lieu of notice (PILON) subject to statutory deductions.
4. The Employer shall contribute the sum of £350 plus VAT towards the Employee's legal fees incurred in taking advice from a relevant independent adviser.
5. The Employee hereby agrees to waive all claims against the Company, including accrued pension entitlements, personal injury claims, and statutory rights under the Employment Rights Act 1996.
6. The Employee agrees not to make any disparaging statements regarding the Employer.`

function formatGBP(val: number): string {
  return `£${val.toLocaleString('en-GB')}`
}

/* ── Benchmark Precedents Card Component for Agreement Review ───── */
function ReviewBenchmarkCard({
  benchmark,
  extractedOffer,
  salary,
}: {
  benchmark: OfficialBenchmarkData
  extractedOffer?: number
  salary?: number
}) {
  const annualSalary = salary && salary > 0 ? salary : 0
  const monthlySalary = annualSalary > 0 ? annualSalary / 12 : 0
  const acasLow = monthlySalary > 0 ? Math.round(monthlySalary * benchmark.typicalAcasExGratiaMonths.min) : 0
  const acasHigh = monthlySalary > 0 ? Math.round(monthlySalary * benchmark.typicalAcasExGratiaMonths.max) : 0

  const offer = extractedOffer ?? 0
  const isBelowMedian = offer > 0 && offer < benchmark.medianTribunalAward
  const isAboveMedian = offer > 0 && offer >= benchmark.medianTribunalAward

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-xl p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DCCE] pb-3 mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-coral font-semibold block mb-0.5">
            Official Statutory &amp; Tribunal Benchmarks
          </span>
          <h3 className="text-lg font-serif font-bold text-ink m-0">
            {benchmark.jurisdictionCategory}: Official Compensation Precedents
          </h3>
        </div>
        <a
          href={benchmark.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackOutboundCitation(benchmark.sourceUrl, benchmark.sourceName, {
              component: 'review_client_benchmark_card',
            })
          }
          className="text-xs text-ink hover:text-coral underline underline-offset-2 font-mono flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>Source: {benchmark.sourceName}</span>
          <span aria-hidden="true">&nearr;</span>
        </a>
      </div>

      {/* Benchmark Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Metric 1: MoJ Median Tribunal Award */}
        <div className="bg-paper p-3.5 rounded-lg border border-[#E2DCCE] flex flex-col justify-between">
          <div>
            <span className="text-xs text-muted font-medium block mb-1">1. MoJ Tribunal Median Award</span>
            <span className="text-xl font-bold text-ink font-serif block">
              {formatGBP(benchmark.medianTribunalAward)}
            </span>
          </div>
          <span className="text-[11px] text-muted-2 mt-2 block font-mono">
            Mean average: {formatGBP(benchmark.meanTribunalAward)} (MoJ Tables)
          </span>
        </div>

        {/* Metric 2: Acas Typical Ex-Gratia Range */}
        <div className="bg-paper p-3.5 rounded-lg border border-[#E2DCCE] flex flex-col justify-between">
          <div>
            <span className="text-xs text-muted font-medium block mb-1">2. Acas Typical Ex-Gratia</span>
            <span className="text-xl font-bold text-ink font-serif block">
              {monthlySalary > 0
                ? `${formatGBP(acasLow)} – ${formatGBP(acasHigh)}`
                : `${benchmark.typicalAcasExGratiaMonths.min}–${benchmark.typicalAcasExGratiaMonths.max} Months' Pay`}
            </span>
          </div>
          <span className="text-[11px] text-muted-2 mt-2 block">
            {annualSalary > 0
              ? `Based on ${formatGBP(annualSalary)} salary (${benchmark.typicalAcasExGratiaMonths.min}–${benchmark.typicalAcasExGratiaMonths.max} mos)`
              : 'Typical conciliated ex-gratia months'}
          </span>
        </div>

        {/* Metric 3: Statutory Compensatory Cap */}
        <div className="bg-paper p-3.5 rounded-lg border border-[#E2DCCE] flex flex-col justify-between">
          <div>
            <span className="text-xs text-muted font-medium block mb-1">3. Statutory Cap Limit</span>
            <span className="text-xl font-bold text-ink font-serif block">
              {benchmark.maximumCompensatoryCap > 0
                ? formatGBP(benchmark.maximumCompensatoryCap)
                : 'Uncapped'}
            </span>
          </div>
          <span className="text-[11px] text-muted-2 mt-2 block">
            {benchmark.maximumCompensatoryCap > 0
              ? 'ERA 1996 s.124 (April 2026 cap)'
              : 'Equality Act 2010 s.124 (Uncapped)'}
          </span>
        </div>
      </div>

      {/* Dynamic Comparative Analysis */}
      {offer > 0 && (
        <div
          className={`rounded-lg p-3.5 text-xs sm:text-sm leading-relaxed mb-4 border ${
            isBelowMedian
              ? 'bg-[#FEFBF0] border-[#E0CB94] text-[#7A5B15]'
              : isAboveMedian
              ? 'bg-[#F0F5FA] border-[#C4D8EC] text-ink'
              : 'bg-paper border-rule text-ink'
          }`}
        >
          {isBelowMedian && (
            <p className="m-0">
              <strong>⚖️ Below Official MoJ Median:</strong> Your employer&apos;s draft ex-gratia offer of{' '}
              <strong>{formatGBP(offer)}</strong> is{' '}
              <strong>{formatGBP(benchmark.medianTribunalAward - offer)} below the Ministry of Justice median award</strong>{' '}
              ({formatGBP(benchmark.medianTribunalAward)}) for this complaint type. This provides strong factual leverage to negotiate an uplift before signing.
            </p>
          )}
          {isAboveMedian && (
            <p className="m-0">
              <strong>✓ Above Official MoJ Median:</strong> Your employer&apos;s draft ex-gratia offer of{' '}
              <strong>{formatGBP(offer)}</strong> exceeds the MoJ median tribunal award ({formatGBP(benchmark.medianTribunalAward)}) for this dispute category. Your primary negotiation leverage should focus on raising employer legal fee contributions to £750–£1,000+ VAT and securing a positive, agreed reference.
            </p>
          )}
        </div>
      )}

      {/* Section 203(3) ERA 1996 Fee Notice */}
      <div className="bg-paper-2 border border-[#E2DCCE] rounded-lg p-3 text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-ink font-bold text-sm leading-none mt-0.5">§</span>
          <span className="leading-snug">
            <strong className="text-ink">Mandatory Legal Review:</strong> Under Section 203(3) Employment Rights Act 1996, this settlement is legally void without independent solicitor certification. Standard UK employer contribution is <strong>£500 to £1,000+ VAT</strong> paid directly to your solicitor.
          </span>
        </div>
        <a
          href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackOutboundCitation(
              'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
              'ERA 1996 s.203(3)',
              { component: 'review_client_benchmark_card' }
            )
          }
          className="text-ink hover:text-coral underline underline-offset-2 font-mono whitespace-nowrap text-xs transition-colors"
        >
          ERA 1996 s.203(3) &nearr;
        </a>
      </div>
    </div>
  )
}

export default function ReviewClient() {
  const [agreementText, setAgreementText] = useState('')
  const [salary, setSalary] = useState('')
  const [yearsOfService, setYearsOfService] = useState('')
  const [age, setAge] = useState('')
  const [disputeReason, setDisputeReason] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    'Parsing contractual clauses, financial compensation, and dispute context...',
    'Verifying statutory caps (£751/wk), £30k tax exemption (ITEPA 2003 s.403), and MoJ tribunal tables...',
    'Synthesizing tactical negotiation points, counter-offer strategy, and solicitor fee coverage...',
  ]

  const handleUseSample = () => {
    setAgreementText(SAMPLE_AGREEMENT)
    setSalary('65000')
    setYearsOfService('5')
    setAge('43')
    setDisputeReason('unfair_dismissal')
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
            disputeReason: disputeReason !== 'auto' ? disputeReason : undefined,
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

  // Determine active benchmark data
  const activeBenchmark: OfficialBenchmarkData =
    report?.officialBenchmark ||
    getOfficialBenchmark(
      report?.extractedTerms.disputeReason || (disputeReason !== 'auto' ? disputeReason : 'unfair_dismissal'),
      Boolean(report?.extractedTerms.isDiscrimination)
    )

  const effectiveSalary =
    report?.extractedTerms.salary || (salary ? Number(salary) : undefined)

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
          Paste your draft clauses or protected conversation offer. In seconds, see if your employment termination payout meets UK statutory rates, compare against Ministry of Justice tribunal tables, and check £30k tax rules.
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
              Optional Context (Enables Statutory Minimum Floor &amp; Benchmark Calibration)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
              <div>
                <label htmlFor="dispute-reason-select" className="block text-xs font-medium text-ink mb-1">
                  Dispute Reason
                </label>
                <select
                  id="dispute-reason-select"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                >
                  <option value="auto">Auto-detect from text</option>
                  <option value="unfair_dismissal">Unfair Dismissal / Capability</option>
                  <option value="redundancy">Redundancy</option>
                  <option value="pip">PIP / Performance Plan</option>
                  <option value="constructive_dismissal">Constructive Dismissal</option>
                  <option value="discrimination">Discrimination / Detriment</option>
                </select>
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
            className="w-full sm:w-auto px-6 py-3.5 bg-coral hover:bg-coral-ink text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Auditing agreement terms against UK statutory rates...' : 'Check my agreement now →'}
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
                    ? formatGBP(report.extractedTerms.exGratiaAmount)
                    : 'Not Specified'}
                </span>
              </div>
              <div className="bg-paper p-3.5 rounded-lg border border-rule">
                <span className="text-xs text-muted block mb-1">Notice / PILON</span>
                <span className="text-lg font-bold text-ink">
                  {report.extractedTerms.noticePayPilon !== undefined
                    ? formatGBP(report.extractedTerms.noticePayPilon)
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

            {/* Official MoJ & Statutory Benchmark Card */}
            <ReviewBenchmarkCard
              benchmark={activeBenchmark}
              extractedOffer={report.extractedTerms.exGratiaAmount}
              salary={effectiveSalary}
            />

            {/* Statutory Check Badges */}
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-3">
              Statutory Rule &amp; Compliance Checks
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
                      {formatGBP(report.recommendedCounterOffer.suggestedExGratiaLow)} – {formatGBP(report.recommendedCounterOffer.suggestedExGratiaHigh)}
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
            <div className="bg-ink text-paper p-6 sm:p-8 rounded-xl space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-coral font-semibold block">
                  Mandatory Legal Step • 100% Employer Funded
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Have an SRA-Regulated Employment Solicitor Sign Your Agreement
                </h4>
                <p className="text-xs sm:text-sm text-paper opacity-90 max-w-2xl leading-relaxed">
                  By UK law (Employment Rights Act 1996 s.203), your settlement agreement is only legally valid once signed off by an independent qualified solicitor. Your employer pays the solicitor fees directly under HMRC rules.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Link
                  href={`/get-matched/?offer=${report.extractedTerms.exGratiaAmount || 0}&salary=${effectiveSalary || 0}`}
                  onClick={() =>
                    trackSolicitorMatchClick('review_client_report_cta', {
                      offer: report.extractedTerms.exGratiaAmount,
                      salary: effectiveSalary,
                    })
                  }
                  className="inline-flex justify-center items-center px-6 py-3.5 bg-coral hover:bg-coral-ink text-white font-semibold rounded-lg text-sm transition-colors text-center shadow-md cursor-pointer"
                >
                  Get Matched with an SRA Solicitor Now →
                </Link>
                <Link
                  href="/calculator/"
                  className="inline-flex justify-center items-center px-5 py-3.5 bg-transparent border border-paper text-white hover:bg-white hover:text-ink font-medium rounded-lg text-sm transition-colors text-center"
                >
                  Calculate Statutory Entitlement Baseline
                </Link>
                <Link
                  href="/how-it-works/"
                  className="inline-flex justify-center items-center px-5 py-3.5 bg-transparent border border-rule text-paper opacity-80 hover:opacity-100 hover:text-white font-medium rounded-lg text-sm transition-colors text-center"
                >
                  How Solicitor Matching Works
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

