import React from 'react'
import Link from 'next/link'

/**
 * SettlementCheck Employer-Funded Legal Fee Protection Component
 * Addresses SC-E-COM-001 / SC-B-012 (Legal Fee Reassurance)
 * 
 * Under Section 203(3) Employment Rights Act 1996, independent legal advice is a statutory
 * condition for a valid waiver. Employers customarily contribute £350 to £750 + VAT
 * directly to the employee's chosen solicitor.
 */

export function LegalFeeAnnouncementBar() {
  return (
    <div className="bg-[#0B1F3A] text-[#F7F4EE] border-b border-[#0B1F3A] py-2 px-4 text-xs font-sans">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#D9603B]/20 text-[#D9603B] flex-shrink-0" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </span>
          <span>
            <strong className="text-white font-semibold">Legal Fee Coverage:</strong>{' '}
            <span className="text-[#F7F4EE]/85">
              To make your settlement legally valid, employers usually contribute £350 to £750 + VAT to your solicitor.
            </span>
          </span>
        </div>
        <Link
          href="/guides/employer-recommended-solicitor/"
          className="text-[#D9603B] hover:text-[#D9603B]/80 font-medium underline underline-offset-2 transition-colors flex-shrink-0 hidden sm:inline-block"
        >
          How fee coverage works →
        </Link>
      </div>
    </div>
  )
}

export function LegalFeeShieldBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] text-xs font-medium ${className}`}>
      <span className="text-[#D9603B] flex-shrink-0" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </span>
      <span>
        <strong>Employer-Covered Legal Fee:</strong> Standard review covered under Section 203(3) ERA 1996
      </span>
    </div>
  )
}

export function LegalFeeInlineCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border border-[#E2DCCE] rounded-xl p-5 shadow-sm ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-[#D9603B]/10 text-[#D9603B] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0B1F3A] m-0 mb-1">
            Section 203 Independent Legal Fee Protection
          </h3>
          <p className="text-xs text-[#0B1F3A]/70 leading-relaxed m-0 mb-3">
            For a settlement agreement to legally waive employment tribunal claims, Section 203(3) requires you to receive independent legal advice. Employers standardly contribute £350 to £750 + VAT directly to your solicitor to cover this review.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5B6577]">
            <span className="flex items-center gap-1.5 font-medium text-[#0B1F3A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9603B]" />
              100% Free matching
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#0B1F3A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9603B]" />
              Zero employee fee for standard sign-off
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#0B1F3A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9603B]" />
              SRA-regulated solicitors only
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
