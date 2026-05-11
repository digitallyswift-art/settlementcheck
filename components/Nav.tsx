'use client'

import Link from 'next/link'
import { useState } from 'react'

const GUIDES_LINKS = [
  {
    href: '/guides/how-to-negotiate-a-settlement-agreement',
    label: 'How to Negotiate a Settlement Agreement',
    sub: 'Leverage, counter-offers, and the full process',
  },
  {
    href: '/guides/employer-recommended-solicitor',
    label: 'Do You Have to Use Your Employer\'s Solicitor?',
    sub: 'Your right to choose independent legal advice',
  },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [guidesOpen, setGuidesOpen] = useState(false)
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-rule"
      style={{ height: 68, background: 'rgba(247,244,238,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="sc-container h-full flex items-center justify-between gap-8">

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
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          <Link href="/#how" className="text-[14px] text-muted hover:text-ink transition-colors duration-[160ms]">
            How it works
          </Link>

          {/* Guides dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setGuidesOpen(true)}
            onMouseLeave={() => setGuidesOpen(false)}
          >
            <Link
              href="/guides"
              className="flex items-center gap-1 text-[14px] text-muted hover:text-ink transition-colors duration-[160ms]"
            >
              Guides
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                className={`transition-transform duration-150 ${guidesOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {guidesOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card border border-rule rounded-xl shadow-lg overflow-hidden"
                style={{ width: 320, boxShadow: '0 12px 40px -8px rgba(11,31,58,0.18)' }}
              >
                {/* Arrow */}
                <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l border-t border-rule rotate-45" />

                <div className="p-2">
                  {GUIDES_LINKS.map((g) => (
                    <Link
                      key={g.href}
                      href={g.href}
                      className="flex flex-col gap-0.5 px-4 py-3 rounded-lg hover:bg-paper transition-colors duration-[120ms] group"
                      onClick={() => setGuidesOpen(false)}
                    >
                      <span className="text-[14px] font-medium text-ink leading-snug group-hover:text-coral transition-colors duration-[120ms]">
                        {g.label}
                      </span>
                      <span className="text-[13px] text-muted leading-snug">{g.sub}</span>
                    </Link>
                  ))}
                  <div className="border-t border-rule mt-1 pt-1">
                    <Link
                      href="/guides"
                      className="flex items-center gap-1 px-4 py-2.5 text-[13px] text-coral font-medium hover:underline underline-offset-2"
                      onClick={() => setGuidesOpen(false)}
                    >
                      View all guides →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/how-it-works#about" className="text-[14px] text-muted hover:text-ink transition-colors duration-[160ms]">
            About
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/for-solicitors" className="text-[13px] text-muted hover:text-ink transition-colors duration-[160ms] px-1">
            For solicitors
          </Link>
          <Link href="/calculator" className="btn-accent text-[14px] px-5 py-2.5">
            Check my offer →
          </Link>
        </div>

        {/* Burger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`block h-[1.5px] w-full bg-ink transition-all duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block h-[1.5px] w-full bg-ink transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[1.5px] w-full bg-ink transition-all duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-rule bg-paper/95 backdrop-blur-md px-5 py-4 flex flex-col gap-1">
          <Link href="/#how" className="text-[15px] text-muted py-2" onClick={() => setMobileOpen(false)}>
            How it works
          </Link>

          {/* Guides expandable */}
          <div>
            <button
              className="w-full flex items-center justify-between text-[15px] text-muted py-2 bg-transparent border-0 p-0 cursor-pointer"
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
              <div className="flex flex-col gap-0 pl-3 border-l border-rule ml-1 mb-1">
                {GUIDES_LINKS.map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="text-[14px] text-muted py-2 leading-snug hover:text-ink"
                    onClick={() => { setMobileOpen(false); setMobileGuidesOpen(false) }}
                  >
                    {g.label}
                  </Link>
                ))}
                <Link
                  href="/guides"
                  className="text-[13px] text-coral font-medium py-2"
                  onClick={() => { setMobileOpen(false); setMobileGuidesOpen(false) }}
                >
                  View all guides →
                </Link>
              </div>
            )}
          </div>

          <Link href="/how-it-works#about" className="text-[15px] text-muted py-2" onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link href="/for-solicitors" className="text-[15px] text-muted py-2" onClick={() => setMobileOpen(false)}>
            For solicitors
          </Link>
          <Link
            href="/calculator"
            className="btn-accent text-center mt-2"
            onClick={() => setMobileOpen(false)}
          >
            Check my offer →
          </Link>
        </div>
      )}
    </header>
  )
}
