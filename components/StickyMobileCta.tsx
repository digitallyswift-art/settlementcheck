'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StickyMobileCta() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 280px
      if (window.scrollY > 280) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="Settlement offer calculator prompt"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-t border-rule px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(11,31,58,0.08)] transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink leading-tight truncate">
            Received a settlement offer?
          </p>
          <p className="text-[11px] text-muted leading-tight mt-0.5">
            Check what is fair in 60 seconds
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/calculator/"
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-medium text-white bg-coral hover:bg-coral-ink rounded-lg shadow-sm transition-colors duration-150 active:scale-[0.98]"
          >
            Check my offer &rarr;
          </Link>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1.5 text-muted hover:text-ink transition-colors rounded"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
