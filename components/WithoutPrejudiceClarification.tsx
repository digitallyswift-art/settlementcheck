'use client'

import React, { useState, useId } from 'react'

export interface WithoutPrejudiceClarificationProps {
  initialOfferDate?: string
  initialOfferAmount?: number
  className?: string
}

type ClarificationTopic = 'legal_fee' | 'ex_gratia_benchmark' | 'reference_confidentiality' | 'tax_pilon_structure'

export function WithoutPrejudiceClarification({
  initialOfferDate,
  initialOfferAmount,
  className = '',
}: WithoutPrejudiceClarificationProps) {
  const offerDateId = useId()
  const recipientId = useId()
  const amountId = useId()

  const todayStr = new Date().toISOString().split('T')[0]
  const [offerDate, setOfferDate] = useState<string>(initialOfferDate || todayStr)
  const [recipient, setRecipient] = useState<string>('HR Director / Legal Counsel')
  const [offerAmount, setOfferAmount] = useState<string>(initialOfferAmount ? String(initialOfferAmount) : '15000')
  const [topic, setTopic] = useState<ClarificationTopic>('legal_fee')
  const [copied, setCopied] = useState<boolean>(false)
  const [showLegalExplanation, setShowLegalExplanation] = useState<boolean>(false)

  const formattedAmount = Number(offerAmount) > 0 ? `£${Number(offerAmount).toLocaleString('en-GB')}` : 'the proposed sum'

  // Topic-specific text blocks
  const getTopicBody = (t: ClarificationTopic): string => {
    switch (t) {
      case 'legal_fee':
        return `1. Legal Fee Contribution Clause: The draft records an employer contribution of [£350/£500] + VAT toward independent legal advice. Instructed solicitors routinely review whether the employer will agree to increase this commercial contribution to £500 - £750 + VAT to conclude the s.203(3) ERA 1996 review.`

      case 'ex_gratia_benchmark':
        return `2. Ex-Gratia Termination Payment Review: The recorded figure of ${formattedAmount} is being reviewed alongside statutory notice and redundancy baselines. Consultation with an independent solicitor allows exploratory inquiries (Stevenson, Jacques & Co v McLean [1880]) to proceed without inadvertently triggering counter-offer rejection rules (Hyde v Wrench [1840]).`

      case 'reference_confidentiality':
        return `3. Agreed Reference & Mutual Confidentiality: Solicitors standardly verify that draft agreements attach an agreed factual reference schedule and establish reciprocal non-derogatory obligations.`

      case 'tax_pilon_structure':
        return `4. Tax & Notice Allocation (ITEPA 2003 s.402D & s.403): Solicitors examine whether ${formattedAmount} constitutes genuine ex-gratia compensation under s.403 ITEPA 2003 or contains taxable Post-Employment Notice Pay (PENP) under s.402D.`
    }
  }

  const generatedLetter = `INTAKE AGENDA FOR YOUR INSTRUCTED SOLICITOR: KEY FIGURES & CLAUSE BRIEFING

Date Prepared: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Employer Contact Recorded: ${recipient.trim() || 'HR Director / Legal Counsel'}
Date of Employer Draft Offer: ${offerDate}
Recorded Offer Figure: ${formattedAmount}

AGENDA ITEM FOR SOLICITOR REVIEW (SECTION 203(3) ERA 1996):
${getTopicBody(topic)}

COMMON LAW CONTRACT & PRIVILEGE CONTEXT FOR SOLICITOR DISCUSSION:
- Under Hyde v Wrench [1840] 3 Beav 334, making an unreviewed counter-offer can extinguish the employer's original offer at common law, whereas a solicitor-led exploratory inquiry under Stevenson, Jacques & Co v McLean [1880] preserves the open offer.
- Under Rush & Tompkins [1989] and Framlington Group v Barnetson [2007], common law Without Prejudice privilege applies only where a genuine dispute exists, and Section 111A ERA 1996 applies solely to ordinary unfair dismissal claims.
- Solicitor discussions determine how to finalise commercial inquiries before employer consideration deadlines expire.

Important Privilege Notice: Transmitting unreviewed financial proposals directly to HR risks inadvertently waiving legal privilege or compromising legal standing.`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter)
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
            Solicitor Discussion Agenda: Key Figures Briefing
          </span>
          <h3 className="text-xl font-serif font-bold text-[#0B1F3A] m-0">
            Intake Agenda for Your Instructed Solicitor
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowLegalExplanation(!showLegalExplanation)}
          className="text-xs text-[#0B1F3A] hover:text-[#D9603B] font-medium underline underline-offset-2 flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <span>Contract law context (Hyde v Wrench rule)</span>
          <span>{showLegalExplanation ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Hyde v Wrench vs Stevenson v McLean Legal Explainer */}
      {showLegalExplanation && (
        <div className="bg-[#F0F5FA] border border-[#C4D8EC] rounded-lg p-4 mb-5 text-xs text-[#0B1F3A] leading-relaxed">
          <p className="font-bold text-sm mb-1.5 text-[#0B1F3A]">
            ⚖️ The Legal Rule: Counter-Offer vs Exploratory Inquiry
          </p>
          <p className="mb-2">
            Under English contract law (<strong>Hyde v Wrench [1840] 3 Beav 334</strong>), making a firm counter-proposal
            legally extinguishes and revokes the original offer. If the employer refuses a counter-proposal, you cannot
            legally force them to honour the original deal.
          </p>
          <p className="m-0">
            Under <strong>Stevenson, Jacques &amp; Co v McLean [1880] 5 QBD 346</strong>, a mere request for
            information or exploratory clarification does <em>not</em> terminate the original offer. This agenda prepares structured points for your instructed solicitor to review.
          </p>
        </div>
      )}

      {/* Mode / Topic Selector Tabs */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-2">
          Select Clarification Goal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTopic('legal_fee')}
            className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              topic === 'legal_fee'
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
            }`}
          >
            <div className="font-bold mb-0.5">1. Solicitor Legal Fee Uplift</div>
            <div className={`text-[11px] ${topic === 'legal_fee' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
              Request £750 - £1,000 + VAT fee coverage without risking the payout.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTopic('ex_gratia_benchmark')}
            className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              topic === 'ex_gratia_benchmark'
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
            }`}
          >
            <div className="font-bold mb-0.5">2. Compensation Benchmarking</div>
            <div className={`text-[11px] ${topic === 'ex_gratia_benchmark' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
              Inquire about MoJ tribunal comparisons without rejecting the sum.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTopic('reference_confidentiality')}
            className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              topic === 'reference_confidentiality'
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
            }`}
          >
            <div className="font-bold mb-0.5">3. Agreed Reference &amp; Non-Disparagement</div>
            <div className={`text-[11px] ${topic === 'reference_confidentiality' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
              Request standard reference schedule and mutual company gagging clause.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTopic('tax_pilon_structure')}
            className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              topic === 'tax_pilon_structure'
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
            }`}
          >
            <div className="font-bold mb-0.5">4. Tax &amp; PILON Notice Split</div>
            <div className={`text-[11px] ${topic === 'tax_pilon_structure' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
              Clarify HMRC s.402D post-employment notice pay vs s.403 tax-free floor.
            </div>
          </button>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 bg-[#F7F4EE] p-3.5 rounded-lg border border-[#E2DCCE]">
        <div>
          <label htmlFor={recipientId} className="block text-xs font-medium text-[#0B1F3A] mb-1">
            Recipient Name / Title
          </label>
          <input
            id={recipientId}
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border border-[#E2DCCE] rounded text-xs bg-white text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
          />
        </div>
        <div>
          <label htmlFor={offerDateId} className="block text-xs font-medium text-[#0B1F3A] mb-1">
            Offer Date
          </label>
          <input
            id={offerDateId}
            type="date"
            value={offerDate}
            onChange={(e) => setOfferDate(e.target.value)}
            className="w-full p-2 border border-[#E2DCCE] rounded text-xs font-mono bg-white text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
          />
        </div>
        <div>
          <label htmlFor={amountId} className="block text-xs font-medium text-[#0B1F3A] mb-1">
            Current Offer Amount (£)
          </label>
          <input
            id={amountId}
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            className="w-full p-2 border border-[#E2DCCE] rounded text-xs font-mono bg-white text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
          />
        </div>
      </div>

      {/* Agenda Output Box */}
      <div className="bg-[#F7F4EE] border border-[#E2DCCE] rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A] m-0">
              Intake Agenda for Your Instructed Solicitor
            </h4>
            <p className="text-xs text-[#0B1F3A]/70 m-0">
              Important Privilege Notice: Transmitting unreviewed financial proposals directly to HR risks inadvertently waiving legal privilege or compromising legal standing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            {copied ? (
              <>
                <span>✓</span> Copied to Clipboard!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Solicitor Agenda
              </>
            )}
          </button>
        </div>

        <pre className="p-3.5 bg-white border border-[#E2DCCE] rounded-lg text-xs font-mono text-[#0B1F3A] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-64">
          {generatedLetter}
        </pre>
      </div>
    </div>
  )
}
