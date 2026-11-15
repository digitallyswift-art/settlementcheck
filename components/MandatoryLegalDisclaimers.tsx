import React from 'react'

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
  return (
    <div
      role="region"
      aria-label="Employer Legal Fee Contribution Notice"
      className={`bg-paper-2 border border-[#E2DCCE] rounded-xl p-4 text-xs leading-relaxed text-[#4A5568] ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-[#0B1F3A] font-bold text-sm leading-none mt-0.5 select-none" aria-hidden="true">
          §
        </span>
        <div className="space-y-1">
          <p className="font-semibold text-ink text-[12px] tracking-tight">
            Employer Legal Fee Contribution Notice (CMA &amp; DMCC Act 2024 Transparency)
          </p>
          <p className="m-0 text-muted text-[11px] leading-relaxed">
            {CMA_DMCC_FEE_CONTRIBUTION_DISCLOSURE}
          </p>
          <div className="pt-1">
            <a
              href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2 font-mono text-[10px] inline-flex items-center gap-1 transition-colors"
            >
              ERA 1996 s.203(3) Statutory Waiver Conditions ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContractPrivilegeNotice({ className = '' }: { className?: string }) {
  return (
    <div
      role="region"
      aria-label="Important Contract and Privilege Notice"
      className={`bg-[#FFF8E6] border border-[#F0D597] rounded-xl p-4 text-xs leading-relaxed text-[#7A5B15] ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-[#B5802A] text-base leading-none select-none" aria-hidden="true">
          ⚠️
        </span>
        <div className="space-y-1">
          <p className="font-semibold text-[#5A410D] text-[12px] tracking-tight">
            Important Contract &amp; Privilege Notice (Hyde v Wrench / Routledge v Grant)
          </p>
          <p className="m-0 text-[#6D5316] text-[11px] leading-relaxed">
            {COMMON_LAW_PRIVILEGE_REVOCATION_WARNING}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MandatoryLegalDisclaimers({
  className = '',
  showFeeDisclosure = true,
  showPrivilegeWarning = true,
}: MandatoryLegalDisclaimersProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {showPrivilegeWarning && <ContractPrivilegeNotice />}
      {showFeeDisclosure && <FeeContributionDisclosure />}
    </div>
  )
}
