'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LegalFeeAnnouncementBar } from '@/components/LegalFeeShieldBadge'

const CALCULATOR_LINKS = [
  {
    href: '/calculator/',
    label: 'Settlement Agreement Calculator',
    sub: 'Full evaluation of employer settlement offers',
  },
  {
    href: '/redundancy-calculator/',
    label: 'Redundancy Pay Calculator',
    sub: 'April 2026 statutory rates, age multipliers & cap',
  },
  {
    href: '/unfair-dismissal-calculator/',
    label: 'Unfair Dismissal Calculator',
    sub: 'Basic award & compensatory award up to £123,543',
  },
  {
    href: '/constructive-dismissal-calculator/',
    label: 'Constructive Dismissal Calculator',
    sub: 'Forced to resign? Calculate your exit baseline',
  },
  {
    href: '/settlement-agreement-tax-calculator/',
    label: 'Settlement Agreement Tax Calculator',
    sub: 'Work out the £30k exemption, PILON & net pay',
  },
  {
    href: '/settlement-agreement-review/',
    label: 'Settlement Agreement Review',
    sub: 'Check draft contract clauses, £30k tax & legal fees',
  },
  {
    href: '/protective-award-calculator/',
    label: 'Protective Award Calculator',
    sub: 'Up to 90 days gross pay for failure to consult',
  },
]

const GUIDES_LINKS = [
  {
    href: '/guides/how-to-negotiate-a-settlement-agreement/',
    label: 'How to Negotiate a Settlement Agreement',
    sub: 'Strategy, counter-offers, and the full process',
  },
  {
    href: '/guides/average-settlement-agreement-payout-uk/',
    label: 'Average Settlement Agreement Payouts',
    sub: 'Typical ranges (£5,000 to £25,000) and statutory rules',
  },
  {
    href: '/guides/employer-recommended-solicitor/',
    label: 'Do You Have to Use Your Employer\'s Solicitor?',
    sub: 'Your right to choose independent legal advice',
  },
  {
    href: '/guides/protective-award/',
    label: 'Protective Award Redundancy Claims',
    sub: 'Up to 90 days gross pay for failure to consult',
  },
  {
    href: '/guides/compromise-agreement-calculator-uk/',
    label: 'Compromise Agreement Calculator',
    sub: 'Legacy ERRA 2013 rules & statutory formulas',
  },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [calculatorsOpen, setCalculatorsOpen] = useState(false)
  const [guidesOpen, setGuidesOpen] = useState(false)
  const [mobileCalculatorsOpen, setMobileCalculatorsOpen] = useState(false)
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-rule"
      style={{ background: 'rgba(247,244,238,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <LegalFeeAnnouncementBar />
      <div className="sc-container px-4 sm:px-6 xl:px-8 flex items-center justify-between gap-4 xl:gap-8 h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="SettlementCheck home">
          <span className="text-coral" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 11.5L9.5 15L16 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="font-serif text-[20px] font-420 tracking-[-0.01em]">
            <span className="text-coral">Settlement</span><span className="text-ink">Check</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-nowrap" aria-label="Primary">
          {/* Calculators dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCalculatorsOpen(true)}
            onMouseLeave={() => setCalculatorsOpen(false)}
          >
            <Link
              href="/calculators/"
              className="flex items-center gap-1 text-[13px] xl:text-[14px] font-medium text-muted hover:text-ink transition-colors duration-[160ms] whitespace-nowrap py-1"
            >
              Calculators
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                className={`transition-transform duration-150 text-muted/70 ${calculatorsOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {calculatorsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50" style={{ width: 340 }}>
                <div
                  className="bg-card border border-rule rounded-xl overflow-hidden"
                  style={{ boxShadow: '0 12px 40px -8px rgba(11,31,58,0.18)' }}
                >
                  <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l border-t border-rule rotate-45" />
                  <div className="p-2 relative z-10 bg-card">
                    {CALCULATOR_LINKS.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="flex flex-col gap-0.5 px-4 py-2.5 rounded-lg hover:bg-paper transition-colors duration-[120ms] group"
                        onClick={() => setCalculatorsOpen(false)}
                      >
                        <span className="text-[14px] font-medium text-ink leading-snug group-hover:text-coral transition-colors duration-[120ms]">
                          {c.label}
                        </span>
                        <span className="text-[12px] text-muted leading-snug">{c.sub}</span>
                      </Link>
                    ))}
                    <div className="border-t border-rule mt-1 pt-1">
                      <Link
                        href="/calculators/"
                        className="flex items-center gap-1 px-4 py-2 text-[13px] text-coral font-medium hover:underline underline-offset-2"
                        onClick={() => setCalculatorsOpen(false)}
                      >
                        View all calculators hub →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settlement Agreement & Contract Review Tool */}
          <Link
            href="/settlement-agreement-review/"
            className="text-[13px] xl:text-[14px] font-medium text-muted hover:text-ink transition-colors duration-[160ms] whitespace-nowrap py-1"
          >
            Review Agreement
          </Link>

          {/* Guides dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setGuidesOpen(true)}
            onMouseLeave={() => setGuidesOpen(false)}
          >
            <Link
              href="/guides/"
              className="flex items-center gap-1 text-[13px] xl:text-[14px] font-medium text-muted hover:text-ink transition-colors duration-[160ms] whitespace-nowrap py-1"
            >
              Guides
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                className={`transition-transform duration-150 text-muted/70 ${guidesOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {guidesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50" style={{ width: 340 }}>
                <div
                  className="bg-card border border-rule rounded-xl overflow-hidden"
                  style={{ boxShadow: '0 12px 40px -8px rgba(11,31,58,0.18)' }}
                >
                  <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l border-t border-rule rotate-45" />
                  <div className="p-2 relative z-10 bg-card">
                    {GUIDES_LINKS.map((g) => (
                      <Link
                        key={g.href}
                        href={g.href}
                        className="flex flex-col gap-0.5 px-4 py-2.5 rounded-lg hover:bg-paper transition-colors duration-[120ms] group"
                        onClick={() => setGuidesOpen(false)}
                      >
                        <span className="text-[14px] font-medium text-ink leading-snug group-hover:text-coral transition-colors duration-[120ms]">
                          {g.label}
                        </span>
                        <span className="text-[12px] text-muted leading-snug">{g.sub}</span>
                      </Link>
                    ))}
                    <div className="border-t border-rule mt-1 pt-1">
                      <Link
                        href="/guides/"
                        className="flex items-center gap-1 px-4 py-2 text-[13px] text-coral font-medium hover:underline underline-offset-2"
                        onClick={() => setGuidesOpen(false)}
                      >
                        View all guides →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/how-it-works/"
            className="text-[13px] xl:text-[14px] font-medium text-muted hover:text-ink transition-colors duration-[160ms] whitespace-nowrap py-1"
          >
            How it works
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-nowrap shrink-0">
          <Link
            href="/get-matched/"
            className="text-[12.5px] xl:text-[13.5px] font-medium text-coral hover:text-coral-ink transition-colors duration-[160ms] px-1 whitespace-nowrap"
          >
            Find a solicitor
          </Link>
          <span className="hidden xl:inline-block w-[1px] h-3.5 bg-rule shrink-0" aria-hidden="true" />
          <Link
            href="/for-solicitors/"
            className="text-[12px] xl:text-[13px] text-muted hover:text-ink transition-colors duration-[160ms] px-1 whitespace-nowrap"
          >
            For solicitors
          </Link>
          <Link
            href="/for-employers/"
            className="text-[12px] xl:text-[13px] text-muted hover:text-ink transition-colors duration-[160ms] px-1 whitespace-nowrap"
          >
            For employers
          </Link>
          <Link
            href="/calculator/"
            className="btn-accent text-[13px] xl:text-[14px] px-3.5 py-2 xl:px-4.5 xl:py-2.5 whitespace-nowrap shrink-0"
          >
            Check my offer →
          </Link>
        </div>

        {/* Mobile / Tablet Header Controls */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <Link
            href="/calculator/"
            className="btn-accent text-[12px] sm:text-[13px] px-3 py-1.5 whitespace-nowrap font-medium"
          >
            Check my offer →
          </Link>
          <button
            className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 p-1 rounded-md hover:bg-black/5 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-rule bg-paper/95 backdrop-blur-md px-5 py-4 flex flex-col gap-1 max-h-[85vh] overflow-y-auto">
          {/* Calculators expandable */}
          <div>
            <button
              className="w-full flex items-center justify-between text-[15px] font-medium text-ink py-2 bg-transparent border-0 p-0 cursor-pointer"
              onClick={() => setMobileCalculatorsOpen(!mobileCalculatorsOpen)}
            >
              <span>Calculators</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                className={`transition-transform duration-150 ${mobileCalculatorsOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileCalculatorsOpen && (
              <div className="flex flex-col gap-0 pl-3 border-l border-rule ml-1 mb-2">
                {CALCULATOR_LINKS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="text-[14px] text-muted py-1.5 leading-snug hover:text-ink"
                    onClick={() => { setMobileOpen(false); setMobileCalculatorsOpen(false) }}
                  >
                    {c.label}
                  </Link>
                ))}
                <Link
                  href="/calculators/"
                  className="text-[13px] text-coral font-medium py-1.5"
                  onClick={() => { setMobileOpen(false); setMobileCalculatorsOpen(false) }}
                >
                  View all calculators hub →
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/settlement-agreement-review/"
            className="text-[15px] font-medium text-ink py-2 flex items-center justify-between hover:text-coral transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <span>Review Agreement</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-semibold bg-coral/10 px-2 py-0.5 rounded">
              Contract Checker
            </span>
          </Link>

          {/* Guides expandable */}
          <div>
            <button
              className="w-full flex items-center justify-between text-[15px] font-medium text-ink py-2 bg-transparent border-0 p-0 cursor-pointer"
              onClick={() => setMobileGuidesOpen(!mobileGuidesOpen)}
            >
              <span>Guides</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                className={`transition-transform duration-150 ${mobileGuidesOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileGuidesOpen && (
              <div className="flex flex-col gap-0 pl-3 border-l border-rule ml-1 mb-2">
                {GUIDES_LINKS.map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="text-[14px] text-muted py-1.5 leading-snug hover:text-ink"
                    onClick={() => { setMobileOpen(false); setMobileGuidesOpen(false) }}
                  >
                    {g.label}
                  </Link>
                ))}
                <Link
                  href="/guides/"
                  className="text-[13px] text-coral font-medium py-1.5"
                  onClick={() => { setMobileOpen(false); setMobileGuidesOpen(false) }}
                >
                  View all guides →
                </Link>
              </div>
            )}
          </div>

          <Link href="/how-it-works/" className="text-[15px] text-muted py-2" onClick={() => setMobileOpen(false)}>
            How it works
          </Link>
          <Link href="/get-matched/" className="text-[15px] font-medium text-coral py-2" onClick={() => setMobileOpen(false)}>
            Find a solicitor
          </Link>
          <Link href="/for-solicitors/" className="text-[15px] text-muted py-2" onClick={() => setMobileOpen(false)}>
            For solicitors
          </Link>
          <Link href="/for-employers/" className="text-[15px] text-muted py-2" onClick={() => setMobileOpen(false)}>
            For employers
          </Link>
          <Link
            href="/calculator/"
            className="btn-accent text-center mt-3"
            onClick={() => setMobileOpen(false)}
          >
            Check my offer →
          </Link>
        </div>
      )}
    </header>
  )
}
