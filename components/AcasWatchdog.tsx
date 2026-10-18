'use client'

import React, { useState, useId } from 'react'

export interface AcasWatchdogProps {
  initialReceivedDate?: string
  initialDeadlineDays?: number
  className?: string
}

export function AcasWatchdog({
  initialReceivedDate,
  initialDeadlineDays = 5,
  className = '',
}: AcasWatchdogProps) {
  // Format today's date as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0]
  const receivedDateId = useId()
  const deadlineDaysId = useId()
  const employerNameId = useId()

  const [receivedDate, setReceivedDate] = useState<string>(initialReceivedDate || todayStr)
  const [deadlineDays, setDeadlineDays] = useState<number>(initialDeadlineDays)
  const [employerName, setEmployerName] = useState<string>('HR Manager')
  const [copied, setCopied] = useState<boolean>(false)

  // Calculations
  const received = new Date(receivedDate)
  const isValidReceived = !isNaN(received.getTime())

  // ACAS Code 4 Paragraph 12 recommends a minimum of 10 calendar days
  const acasMinimumDays = 10
  const isUltimatum = deadlineDays < acasMinimumDays

  // Calculate actual deadline date and ACAS compliant deadline date
  const actualDeadline = new Date(received)
  actualDeadline.setDate(actualDeadline.getDate() + deadlineDays)

  const acasDeadline = new Date(received)
  acasDeadline.setDate(acasDeadline.getDate() + acasMinimumDays)

  // Days elapsed since received
  const now = new Date()
  const daysElapsed = isValidReceived
    ? Math.max(0, Math.floor((now.getTime() - received.getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const daysRemainingActual = Math.max(0, deadlineDays - daysElapsed)
  const daysRemainingAcas = Math.max(0, acasMinimumDays - daysElapsed)

  const formatDateDisplay = (d: Date) => {
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Formal ACAS Code 4 Extension Notice Template
  const extensionNoticeTemplate = `Subject: Without Prejudice - Settlement Agreement Consideration Period (ACAS Code of Practice 4)

Dear ${employerName.trim() || 'HR Manager'},

Thank you for providing the draft settlement agreement documentation on ${isValidReceived ? formatDateDisplay(received) : receivedDate}.

Under the ACAS Code of Practice on Settlement Agreements (Code 4, Paragraph 12), parties should be allowed a reasonable period of time to consider the proposed written terms and receive independent legal advice. As a statutory guideline, ACAS specifies that a minimum period of 10 calendar days should be provided to consider terms, unless the parties mutually agree otherwise.

The current proposed deadline of ${isValidReceived ? formatDateDisplay(actualDeadline) : `within ${deadlineDays} days`} provides only ${deadlineDays} calendar days. Under ACAS Code 4, Paragraph 18, setting an unreasonably short deadline can be regarded as improper behaviour under Section 111A(4) of the Employment Rights Act 1996, which may impact the confidentiality of pre-termination negotiations.

In order to comply with ACAS statutory guidance and ensure sufficient time to obtain mandatory independent advice from an SRA-regulated employment solicitor (as required by Section 203(3) of the Employment Rights Act 1996), I respectfully request that the consideration window be extended to 10 calendar days, ending on ${isValidReceived ? formatDateDisplay(acasDeadline) : 'the standard 10-day date'}.

I am actively arranging independent legal advice and will revert promptly once my solicitor has completed the statutory review.

Yours sincerely,
[Your Name]
[Contact Information]`

  const handleCopyNotice = async () => {
    try {
      await navigator.clipboard.writeText(extensionNoticeTemplate)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  return (
    <div className={`bg-white border border-[#E2DCCE] rounded-xl p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DCCE] pb-4 mb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold block mb-0.5">
            ACAS Code of Practice 4 Chrono-Watchdog
          </span>
          <h3 className="text-xl font-serif font-bold text-[#0B1F3A] m-0">
            10-Day Consideration Period &amp; Ultimatum Shield
          </h3>
        </div>
        <a
          href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#0B1F3A] hover:text-[#D9603B] underline underline-offset-2 font-mono flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>ERA 1996 s.111A &amp; Acas Code 4</span>
          <span aria-hidden="true">&nearr;</span>
        </a>
      </div>

      {/* Interactive Date & Deadline Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 bg-[#F7F4EE] p-4 rounded-lg border border-[#E2DCCE]">
        <div>
          <label htmlFor={receivedDateId} className="block text-xs font-medium text-[#0B1F3A] mb-1">
            Date Draft Received
          </label>
          <input
            id={receivedDateId}
            type="date"
            value={receivedDate}
            onChange={(e) => setReceivedDate(e.target.value)}
            className="w-full p-2 border border-[#E2DCCE] rounded text-xs font-mono bg-white text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
          />
        </div>
        <div>
          <label htmlFor={deadlineDaysId} className="block text-xs font-medium text-[#0B1F3A] mb-1">
            Days Given by Employer
          </label>
          <input
            id={deadlineDaysId}
            type="number"
            min={1}
            max={30}
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-2 border border-[#E2DCCE] rounded text-xs font-mono bg-white text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
          />
        </div>
        <div>
          <label htmlFor={employerNameId} className="block text-xs font-medium text-[#0B1F3A] mb-1">
            Recipient / HR Contact
          </label>
          <input
            id={employerNameId}
            type="text"
            placeholder="e.g. HR Manager / Jane Doe"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            className="w-full p-2 border border-[#E2DCCE] rounded text-xs bg-white text-[#0B1F3A] focus:outline-none focus:ring-1 focus:ring-[#0B1F3A]"
          />
        </div>
      </div>

      {/* Dynamic Status Banner */}
      {isUltimatum ? (
        <div className="bg-[#FEF5F3] border border-[#F3C4B8] rounded-xl p-4 sm:p-5 mb-5 text-[#0B1F3A]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D9603B] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
              !
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-bold text-sm sm:text-base text-[#D9603B]">
                  Artificial Ultimatum Detected ({deadlineDays} Days Given)
                </span>
                <span className="text-xs font-mono bg-[#D9603B]/10 text-[#D9603B] px-2 py-0.5 rounded font-semibold">
                  ACAS Standard: Minimum 10 Days
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#0B1F3A]/90 leading-relaxed mb-3">
                Your employer has given you only <strong>{deadlineDays} days</strong> to accept (deadline:{' '}
                {isValidReceived ? formatDateDisplay(actualDeadline) : `${deadlineDays} days`}). Under{' '}
                <strong>ACAS Code of Practice 4 Paragraph 12</strong>, employers must provide a minimum of{' '}
                <strong>10 calendar days</strong> for written consideration and independent legal advice.
              </p>
              <div className="bg-white/80 border border-[#F3C4B8] rounded-lg p-3 text-xs leading-relaxed text-[#0B1F3A]">
                <strong>Statutory Protection (ERA 1996 s.111A(4)):</strong> Under Paragraph 18 of ACAS Code 4,
                imposing an unreasonably short deadline (such as 24, 48, or 72 hours) constitutes{' '}
                <em>improper behaviour</em>. If an employer behaves improperly, settlement discussions lose their
                Section 111A statutory confidentiality and can be admitted as evidence in an Employment Tribunal.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#F0F5FA] border border-[#C4D8EC] rounded-xl p-4 sm:p-5 mb-5 text-[#0B1F3A]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
              ✓
            </div>
            <div className="flex-1">
              <span className="font-bold text-sm sm:text-base text-[#0B1F3A] block mb-1">
                ACAS Code 4 Compliant Window ({deadlineDays} Days Allowed)
              </span>
              <p className="text-xs sm:text-sm text-[#0B1F3A]/90 leading-relaxed m-0">
                The {deadlineDays}-day window satisfies the ACAS minimum 10-day guideline. You have approximately{' '}
                <strong>{daysRemainingActual} days remaining</strong> before the deadline of{' '}
                {isValidReceived ? formatDateDisplay(actualDeadline) : `${deadlineDays} days`}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chrono Timeline Visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
          <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Days Elapsed</span>
          <span className="text-lg font-bold text-[#0B1F3A] font-mono">{daysElapsed} days</span>
        </div>
        <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
          <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Employer Deadline</span>
          <span className="text-lg font-bold text-[#D9603B] font-mono">
            {isValidReceived ? formatDateDisplay(actualDeadline) : `${deadlineDays} days`}
          </span>
        </div>
        <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
          <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Statutory Acas Deadline</span>
          <span className="text-lg font-bold text-[#0B1F3A] font-mono">
            {isValidReceived ? formatDateDisplay(acasDeadline) : '10 days'}
          </span>
        </div>
        <div className="bg-[#F7F4EE] p-3 rounded-lg border border-[#E2DCCE]">
          <span className="text-[11px] text-[#0B1F3A]/70 block mb-0.5">Days Left in Acas Window</span>
          <span className="text-lg font-bold text-[#0B1F3A] font-mono">{daysRemainingAcas} days</span>
        </div>
      </div>

      {/* 1-Click Extension Request Generator */}
      <div className="bg-[#F7F4EE] border border-[#E2DCCE] rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A] m-0">
              Formal ACAS Code 4 Extension Request Template
            </h4>
            <p className="text-xs text-[#0B1F3A]/70 m-0">
              Assert your statutory consideration rights politely and professionally before signing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyNotice}
            className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            {copied ? (
              <>
                <span className="text-white">✓</span> Copied to Clipboard!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Extension Notice
              </>
            )}
          </button>
        </div>

        <pre className="p-3 bg-white border border-[#E2DCCE] rounded-lg text-xs font-mono text-[#0B1F3A] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-56">
          {extensionNoticeTemplate}
        </pre>
      </div>
    </div>
  )
}
