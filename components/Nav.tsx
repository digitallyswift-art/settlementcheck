'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

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

        {/* Desktop centre links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {[
            { href: '/#how', label: 'How it works' },
            { href: '/for-solicitors', label: 'For solicitors' },
            { href: '/how-it-works#about', label: 'About' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[14px] text-muted hover:text-coral-ink transition-colors duration-[160ms]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/#calculator" className="btn-ghost text-[14px] px-4 py-2">
            Check my offer
          </Link>
          <Link href="/for-solicitors" className="btn-primary text-[14px] px-4 py-2">
            Find a solicitor →
          </Link>
        </div>

        {/* Burger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span className={`block h-[1.5px] w-full bg-ink transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block h-[1.5px] w-full bg-ink transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-[1.5px] w-full bg-ink transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-rule bg-paper/95 backdrop-blur-md px-5 py-4 flex flex-col gap-3">
          {[
            { href: '/#how', label: 'How it works' },
            { href: '/for-solicitors', label: 'For solicitors' },
            { href: '/how-it-works#about', label: 'About' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[15px] text-muted py-1"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/for-solicitors"
            className="btn-primary text-center mt-1"
            onClick={() => setOpen(false)}
          >
            Find a solicitor →
          </Link>
        </div>
      )}
    </header>
  )
}
