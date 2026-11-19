'use client'

import React, { useState } from 'react'

export const CMA_DMCC_FEE_CONTRIBUTION_DISCLOSURE =
  "Under Section 203(3) of the Employment Rights Act 1996, independent legal advice is required to validate an employment waiver. While employers standardly provide a capped commercial contribution (typically £350 to £500+ plus VAT) paid directly to the solicitor upon successful completion, this is a commercial convention rather than a statutory obligation. Instructed solicitors set their own terms regarding work exceeding the employer's contribution cap or abortive fees if you choose not to complete the agreement."

export const COMMON_LAW_PRIVILEGE_REVOCATION_WARNING =
  "Under English contract law (Hyde v Wrench), putting forward an unreviewed counter-offer can extinguish your employer's existing settlement offer. Furthermore, marking communications 'Without Prejudice' does not automatically confer legal privilege if a genuine dispute has not yet arisen. Do not send unreviewed financial proposals directly to your employer before consulting your instructed SRA-regulated solicitor."

interface MandatoryLegalDisclaimersProps {
  className?: string
  showFeeDisclosure?: boolean
  showPrivilegeWarning?: boolean
}

export function FeeContributionDisclosure({ className = '' }: { className?: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      role="region"
      aria-label="Employer Legal Fee Contribution Notice"
      className={`bg-paper-2 border border-[#E2DCCE] rounded-xl px-4 py-3 text-xs leading-relaxed text-[#4A5568] ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-ink font-medium">
          Employers typically contribute £350–£500+ +VAT toward your legal advice upon completion.
        </span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-semibold text-[#0B1F3A] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer flex-shrink-0"
        >
          {expanded ? 'Hide terms' : 'Full fee terms'}
        </button>
      </div>
      {expanded && (
        <div className="mt-2.5 pt-2.5 border-t border-[#E2DCCE] space-y-1.5">
          <p className="m-0 text-muted text-[11px] leading-relaxed">
            {CMA_DMCC_FEE_CONTRIBUTION_DISCLOSURE}
          </p>
          <a
            href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2 font-mono text-[10px] inline-flex items-center gap-1 transition-colors"
          >
            ERA 1996 s.203(3) Statutory Waiver Conditions ↗
          </a>
        </div>
      )}
    </div>
  )
}

export function ContractPrivilegeNotice({ className = '' }: { className?: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      role="region"
      aria-label="Important Contract and Privilege Notice"
      className={`bg-[#FFF8E6] border border-[#F0D597] rounded-xl px-4 py-3 text-xs leading-relaxed text-[#7A5B15] ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-[#5A410D] font-medium">
          Tip: Speak with a solicitor before sending a counter-offer to HR so your current offer is not put at risk.
        </span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-semibold text-[#5A410D] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer flex-shrink-0"
        >
          {expanded ? 'Hide details' : 'Why?'}
        </button>
      </div>
      {expanded && (
        <p className="m-0 mt-2.5 pt-2.5 border-t border-[#F0D597] text-[#6D5316] text-[11px] leading-relaxed">
          {COMMON_LAW_PRIVILEGE_REVOCATION_WARNING}
        </p>
      )}
    </div>
  )
}

export default function MandatoryLegalDisclaimers({
  className = '',
  showFeeDisclosure = true,
  showPrivilegeWarning = true,
}: MandatoryLegalDisclaimersProps) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {showPrivilegeWarning && <ContractPrivilegeNotice />}
      {showFeeDisclosure && <FeeContributionDisclosure />}
    </div>
  )
}
