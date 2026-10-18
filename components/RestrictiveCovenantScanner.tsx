'use client'

import React, { useState } from 'react'

export interface RestrictiveCovenantScannerProps {
  initialClauseText?: string
  className?: string
}

export interface CovenantScanResult {
  hasNonCompete: boolean
  hasNonSolicit: boolean
  hasNonDeal: boolean
  hasNonPoach: boolean
  detectedDurationMonths: number | null
  hasGardenLeaveOffset: boolean
  hasTaxableConsideration: boolean
  taxableAmount: number | null
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  keyConcerns: string[]
  tillmanAnalysis: string
}

const SAMPLE_COVENANT_TEXT = `7. Post-Termination Restrictions:
7.1 The Employee covenants with the Company that they will not for a period of 12 months following the Termination Date, directly or indirectly, be engaged, concerned or interested in any business within the United Kingdom which is competitive with the business of the Company.
7.2 The Employee shall not for a period of 6 months solicit or entice away any customer or client of the Company.
7.3 In consideration of the covenants in this Clause 7, the Employer shall pay to the Employee the sum of £500 (less statutory deductions).`

export function RestrictiveCovenantScanner({
  initialClauseText = '',
  className = '',
}: RestrictiveCovenantScannerProps) {
  const [text, setText] = useState<string>(initialClauseText)
  const [result, setResult] = useState<CovenantScanResult | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  const handleScan = (rawText: string) => {
    const lower = rawText.toLowerCase()

    const hasNonCompete =
      lower.includes('non-compete') ||
      lower.includes('not compete') ||
      lower.includes('competitive with') ||
      lower.includes('competing business') ||
      lower.includes('interested in any business')

    const hasNonSolicit =
      lower.includes('solicit') ||
      lower.includes('canvass') ||
      lower.includes('entice away any customer') ||
      lower.includes('entice away any client')

    const hasNonDeal =
      lower.includes('deal with') ||
      lower.includes('transact business') ||
      lower.includes('accept business from')

    const hasNonPoach =
      lower.includes('poach') ||
      lower.includes('employ any') ||
      lower.includes('entice away any employee') ||
      lower.includes('entice away any staff')

    // Extract duration
    let detectedDurationMonths: number | null = null
    const monthMatch = lower.match(/(\d+)\s*(?:months|month)/)
    if (monthMatch) {
      detectedDurationMonths = parseInt(monthMatch[1], 10)
    }

    // Check garden leave offset
    const hasGardenLeaveOffset =
      lower.includes('garden leave') &&
      (lower.includes('reduced by') ||
        lower.includes('less any period') ||
        lower.includes('set off') ||
        lower.includes('offset'))

    // Check separate consideration (HMRC taxable trap ITEPA 2003 s.225)
    let hasTaxableConsideration = false
    let taxableAmount: number | null = null
    const considerationMatch = rawText.match(
      /(?:consideration|sum of)\s*(?:of\s*)?£\s*(\d+(?:,\d+)?)/i
    )
    if (considerationMatch && lower.includes('covenant')) {
      hasTaxableConsideration = true
      taxableAmount = parseInt(considerationMatch[1].replace(/,/g, ''), 10)
    }

    // Determine risk tier & concerns
    const concerns: string[] = []
    let riskTier: CovenantScanResult['riskTier'] = 'LOW'

    if (hasNonCompete) {
      if (detectedDurationMonths && detectedDurationMonths >= 12) {
        riskTier = 'CRITICAL'
        concerns.push(
          `Excessive 12-Month Non-Compete: UK courts routinely strike down blanket 12-month non-compete clauses for non-executive staff as an unreasonable restraint of trade.`
        )
      } else if (detectedDurationMonths && detectedDurationMonths > 3) {
        riskTier = 'HIGH'
        concerns.push(
          `${detectedDurationMonths}-Month Non-Compete: Restricting employment for over 3 months requires proof of substantial legitimate proprietary business interests and narrow market definitions.`
        )
      } else {
        concerns.push('Post-termination non-compete restriction detected.')
      }
    }

    if (!hasGardenLeaveOffset && (hasNonCompete || hasNonSolicit)) {
      if (riskTier === 'LOW') riskTier = 'MEDIUM'
      concerns.push(
        'Missing Garden Leave Set-Off: The restriction does not deduct time spent on garden leave, imposing double post-employment downtime.'
      )
    }

    if (hasTaxableConsideration) {
      if (riskTier === 'LOW') riskTier = 'MEDIUM'
      concerns.push(
        `Taxable Consideration Trap (ITEPA 2003 s.225): Specific consideration (£${taxableAmount || 500}) allocated to covenants is 100% taxable under PAYE and Class 1 NICs; it cannot be covered by the £30,000 exemption.`
      )
    }

    if (concerns.length === 0) {
      concerns.push('No overly aggressive post-termination restrictions detected.')
    }

    // Tillman analysis
    const tillmanAnalysis = `Under Tillman v Egon Zehnder Ltd [2019] UKSC 32, a restrictive covenant that exceeds what is reasonably necessary to protect legitimate business interests is void for restraint of trade. Courts will only sever unreasonable words if the restriction can be trimmed without modifying the sense of what remains and without altering the fundamental character of the contract.`

    setResult({
      hasNonCompete,
      hasNonSolicit,
      hasNonDeal,
      hasNonPoach,
      detectedDurationMonths,
      hasGardenLeaveOffset,
      hasTaxableConsideration,
      taxableAmount,
      riskTier,
      keyConcerns: concerns,
      tillmanAnalysis,
    })
  }

  const handleUseSample = () => {
    setText(SAMPLE_COVENANT_TEXT)
    handleScan(SAMPLE_COVENANT_TEXT)
  }

  const waiverRequestTemplate = `Subject: Without Prejudice - Settlement Agreement: Post-Termination Restrictions Review

Dear [HR Director / Legal Representative],

In reviewing the draft settlement agreement dated [Date], my legal adviser has identified Clause [Restrictive Covenants], which introduces post-termination covenants including a ${result?.detectedDurationMonths ? `${result.detectedDurationMonths}-month restriction` : 'restriction on employment'}.

Under English common law and the Supreme Court authority of Tillman v Egon Zehnder Ltd [2019] UKSC 32, post-termination restrictions must be no wider than reasonably necessary to protect legitimate business interests. As drafted, this restriction creates an unreasonable restraint of trade and severely impairs my ability to secure future employment.

Furthermore, under Section 225 of the Income Tax (Earnings and Pensions) Act 2003, any consideration allocated specifically to restrictive covenants is subject to mandatory PAYE deductions and National Insurance, preventing tax-efficient settlement structure.

I respectfully request that the employer agree to:
1. Delete Clause [Restrictive Covenants] in its entirety, or alternatively;
2. Reduce the restriction duration to a maximum of 3 months and insert an express clause deducting any period spent on garden leave;
3. Confirm that the full ex-gratia compensation remains allocated under the Section 403 ITEPA 2003 tax exemption.

I look forward to your confirmation so my SRA solicitor can finalize the statutory certification.

Yours sincerely,
[Your Name]`

  const handleCopyWaiver = async () => {
    try {
      await navigator.clipboard.writeText(waiverRequestTemplate)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`bg-white border border-[#E2DCCE] rounded-xl p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DCCE] pb-4 mb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold block mb-0.5">
            Restraint of Trade &amp; Tillman [2019] Scanner
          </span>
          <h3 className="text-xl font-serif font-bold text-[#0B1F3A] m-0">
            Restrictive Covenant &amp; Non-Compete Risk Scanner
          </h3>
        </div>
        <button
          type="button"
          onClick={handleUseSample}
          className="text-xs text-[#D9603B] hover:text-[#0B1F3A] font-medium underline cursor-pointer"
        >
          Load Sample Covenant Clause
        </button>
      </div>

      <p className="text-xs sm:text-sm text-[#0B1F3A]/80 leading-relaxed mb-4">
        Employers frequently insert fresh 6 to 12-month non-competes into settlement agreements or allocate taxable
        consideration that triggers unexpected HMRC tax deductions under ITEPA 2003 s.225. Paste your draft clause to audit restraint of trade risks.
      </p>

      {/* Input Textarea */}
      <div className="mb-4">
        <textarea
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (e.target.value.length > 20) {
              handleScan(e.target.value)
            }
          }}
          placeholder="Paste restrictive covenant clauses, non-compete terms, or post-termination obligations here..."
          className="w-full p-3 border border-[#E2DCCE] rounded-lg text-xs font-mono bg-[#F7F4EE] text-[#0B1F3A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-[11px] text-[#0B1F3A]/60">
            Scans for non-compete, non-solicit, garden leave set-off, and HMRC s.225 tax traps.
          </span>
          <button
            type="button"
            onClick={() => handleScan(text)}
            className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Audit Covenants Now
          </button>
        </div>
      </div>

      {/* Audit Output */}
      {result && (
        <div className="mt-6 pt-5 border-t border-[#E2DCCE] space-y-4">
          {/* Risk Tier Badge */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              result.riskTier === 'CRITICAL' || result.riskTier === 'HIGH'
                ? 'bg-[#FEF5F3] border-[#F3C4B8] text-[#0B1F3A]'
                : result.riskTier === 'MEDIUM'
                ? 'bg-[#FEFBF0] border-[#E0CB94] text-[#0B1F3A]'
                : 'bg-[#F0F5FA] border-[#C4D8EC] text-[#0B1F3A]'
            }`}
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider block font-bold text-[#D9603B]">
                Covenant Risk Assessment
              </span>
              <span className="text-base font-bold font-serif">
                {result.riskTier === 'CRITICAL' && 'CRITICAL: High Risk of Unenforceable Restraint of Trade'}
                {result.riskTier === 'HIGH' && 'HIGH: Restrictive Covenants Impair Career Mobility'}
                {result.riskTier === 'MEDIUM' && 'MODERATE: Potential Garden Leave or Tax Considerations'}
                {result.riskTier === 'LOW' && 'LOW: Standard or Minimal Restrictions'}
              </span>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded font-mono font-bold uppercase ${
                result.riskTier === 'CRITICAL' || result.riskTier === 'HIGH'
                  ? 'bg-[#D9603B] text-white'
                  : result.riskTier === 'MEDIUM'
                  ? 'bg-[#7A5B15] text-white'
                  : 'bg-[#0B1F3A] text-white'
              }`}
            >
              {result.riskTier} RISK
            </span>
          </div>

          {/* Clauses Detected Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
              <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Non-Compete</span>
              <span className="text-xs font-bold font-mono text-[#0B1F3A]">
                {result.hasNonCompete ? '⚠️ DETECTED' : '✓ None'}
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
              <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Non-Solicit</span>
              <span className="text-xs font-bold font-mono text-[#0B1F3A]">
                {result.hasNonSolicit ? '⚠️ DETECTED' : '✓ None'}
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
              <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Duration</span>
              <span className="text-xs font-bold font-mono text-[#0B1F3A]">
                {result.detectedDurationMonths ? `${result.detectedDurationMonths} Months` : 'Unspecified'}
              </span>
            </div>
            <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
              <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Garden Leave Offset</span>
              <span className="text-xs font-bold font-mono text-[#0B1F3A]">
                {result.hasGardenLeaveOffset ? '✓ Included' : '⚠️ Missing'}
              </span>
            </div>
          </div>

          {/* Key Findings List */}
          <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-2">
              Specific Legal &amp; Tax Findings
            </h4>
            <ul className="space-y-1.5 m-0 p-0 list-none">
              {result.keyConcerns.map((concern, idx) => (
                <li key={idx} className="text-xs text-[#0B1F3A] flex items-start gap-2">
                  <span className="text-[#D9603B] font-bold">•</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tillman Doctrine Explainer */}
          <div className="bg-[#F0F5FA] border border-[#C4D8EC] p-3.5 rounded-lg text-xs leading-relaxed text-[#0B1F3A]">
            <strong>Supreme Court Precedent (Tillman v Egon Zehnder [2019] UKSC 32):</strong>{' '}
            {result.tillmanAnalysis}
          </div>

          {/* Waiver Request Generator */}
          <div className="bg-[#F7F4EE] border border-[#E2DCCE] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-[#0B1F3A]">
                1-Click Restrictive Covenant Carve-Out Request
              </span>
              <button
                type="button"
                onClick={handleCopyWaiver}
                className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                {copied ? '✓ Copied' : 'Copy Carve-Out Notice'}
              </button>
            </div>
            <pre className="p-3 bg-white border border-[#E2DCCE] rounded text-xs font-mono text-[#0B1F3A] whitespace-pre-wrap max-h-48 overflow-y-auto">
              {waiverRequestTemplate}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
