'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_POLICY_VERSION,
  OPEN_COOKIE_SETTINGS_EVENT,
  ConsentAction,
  ConsentRecord,
  applyGoogleConsentUpdate,
  clearGoogleAnalyticsCookies,
  generateConsentId,
  readConsentCookie,
  writeConsentCookie,
} from '@/lib/consent'

export default function CookieConsentBanner() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [savedRecord, setSavedRecord] = useState<ConsentRecord | null>(null)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [marketingEnabled, setMarketingEnabled] = useState(false)

  const isInternalAdminRoute = pathname?.startsWith('/cockpit')

  useEffect(() => {
    setMounted(true)
    const existing = readConsentCookie()
    if (existing) {
      setSavedRecord(existing)
      setAnalyticsEnabled(existing.analytics)
      setMarketingEnabled(existing.marketing)
      setShowBanner(false)
    } else if (!isInternalAdminRoute) {
      setShowBanner(true)
    }
  }, [isInternalAdminRoute])

  useEffect(() => {
    function handleOpenSettings() {
      const existing = readConsentCookie()
      if (existing) {
        setSavedRecord(existing)
        setAnalyticsEnabled(existing.analytics)
        setMarketingEnabled(existing.marketing)
      }
      setShowModal(true)
      setShowBanner(false)
    }

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings)
  }, [])

  useEffect(() => {
    if (!showModal) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowModal(false)
        if (!readConsentCookie() && !isInternalAdminRoute) {
          setShowBanner(true)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showModal, isInternalAdminRoute])

  const commitConsent = useCallback(
    (analytics: boolean, marketing: boolean, action: ConsentAction) => {
      const previous = readConsentCookie()
      const consentId = previous?.id || generateConsentId()
      const nowIso = new Date().toISOString()

      const effectiveAction: ConsentAction =
        previous && previous.analytics && !analytics && !marketing && action !== 'accept_all'
          ? 'withdraw'
          : action

      const record: ConsentRecord = {
        v: CONSENT_POLICY_VERSION,
        id: consentId,
        necessary: true,
        analytics,
        marketing,
        updatedAt: nowIso,
      }

      writeConsentCookie(record)
      setSavedRecord(record)
      setAnalyticsEnabled(analytics)
      setMarketingEnabled(marketing)
      setShowBanner(false)
      setShowModal(false)

      applyGoogleConsentUpdate(analytics, marketing)

      if (!analytics) {
        clearGoogleAnalyticsCookies()
        try {
          sessionStorage.removeItem('sc_calc_assigned_variant')
        } catch {
          // Ignore storage errors in restricted browsing modes
        }
      }

      window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: record }))

      // Non-blocking audit log to Supabase (UK GDPR Art. 7(1) proof of consent)
      fetch('/api/consent/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          consent_id: consentId,
          action: effectiveAction,
          policy_version: CONSENT_POLICY_VERSION,
          necessary: true,
          analytics,
          marketing,
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      }).catch(() => {
        // Never block UI if audit telemetry fails
      })
    },
    []
  )

  if (!mounted || isInternalAdminRoute) return null
  if (!showBanner && !showModal) return null

  return (
    <>
      {/* Bottom Consent Banner */}
      {showBanner && !showModal && (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          aria-live="polite"
          className="fixed bottom-0 inset-x-0 z-50 border-t border-rule-strong bg-card shadow-2xl"
        >
          <div className="sc-container py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[11px] font-mono uppercase tracking-eyebrow text-coral font-semibold mb-1">
                  Privacy &amp; Cookies
                </p>
                <p className="text-[14px] text-ink font-semibold leading-snug mb-1">
                  We respect your privacy and never share your personal details with your employer.
                </p>
                <p className="text-[13px] text-muted leading-relaxed">
                  We use strictly necessary storage to run our calculators and save your cookie choice. With your permission, we also use Google Analytics 4 and anonymised page testing to improve the site. No names, salaries, or dispute details are sent to analytics. Read our{' '}
                  <Link
                    href="/privacy/#cookies"
                    className="text-ink underline underline-offset-2 hover:text-coral transition-colors"
                  >
                    Privacy &amp; Cookie Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => commitConsent(false, false, 'reject_non_essential')}
                  className="px-4 py-2.5 rounded-sm border border-ink bg-paper text-ink text-[13px] font-semibold hover:bg-paper-2 transition-colors whitespace-nowrap"
                >
                  Reject non-essential
                </button>
                <button
                  type="button"
                  onClick={() => commitConsent(true, true, 'accept_all')}
                  className="px-4 py-2.5 rounded-sm border border-ink bg-ink text-white text-[13px] font-semibold hover:bg-ink-2 transition-colors whitespace-nowrap"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBanner(false)
                    setShowModal(true)
                  }}
                  className="px-3 py-2.5 text-[13px] font-medium text-muted hover:text-ink underline underline-offset-2 transition-colors whitespace-nowrap"
                >
                  Manage preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Granular Cookie Preferences Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-lg rounded-lg border border-rule-strong bg-card shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-rule bg-paper">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-eyebrow text-coral font-semibold mb-1">
                  Cookie Settings
                </p>
                <h2 id="cookie-modal-title" className="font-serif text-[22px] text-ink font-semibold leading-tight">
                  Manage your cookie preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  if (!savedRecord) setShowBanner(true)
                }}
                aria-label="Close cookie settings"
                className="text-muted hover:text-ink text-[18px] leading-none px-2 py-1 rounded-xs transition-colors"
              >
                ×
              </button>
            </div>

            {/* Categories */}
            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <p className="text-[13px] text-muted leading-relaxed">
                Choose which optional cookies and browser storage you allow. You can update or withdraw your consent at any time via the Cookie Settings link in the footer.
              </p>

              {/* Strictly necessary */}
              <div className="rounded-md border border-rule bg-paper p-4">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[14px] font-semibold text-ink">Strictly necessary</span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink bg-paper-2 border border-rule-strong px-2 py-0.5 rounded-xs">
                    Always active
                  </span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Required to operate the calculators, preserve your progress while you fill in a form, keep the site secure, and remember your cookie preference.
                </p>
              </div>

              {/* Analytics & A/B testing */}
              <div className="rounded-md border border-rule bg-card p-4">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <label htmlFor="toggle-analytics" className="text-[14px] font-semibold text-ink cursor-pointer">
                    Analytics &amp; experience testing
                  </label>
                  <button
                    id="toggle-analytics"
                    type="button"
                    role="switch"
                    aria-checked={analyticsEnabled}
                    onClick={() => setAnalyticsEnabled((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-pill border-2 border-transparent transition-colors ${
                      analyticsEnabled ? 'bg-coral' : 'bg-rule-strong'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-pill bg-white shadow transition-transform ${
                        analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Allows Google Analytics 4 and anonymised calculator layout testing so we can measure which guides and tools are most helpful. Financial inputs and dispute details are scrubbed before any analytics event is sent.
                </p>
              </div>

              {/* Marketing */}
              <div className="rounded-md border border-rule bg-card p-4">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <label htmlFor="toggle-marketing" className="text-[14px] font-semibold text-ink cursor-pointer">
                    Marketing
                  </label>
                  <button
                    id="toggle-marketing"
                    type="button"
                    role="switch"
                    aria-checked={marketingEnabled}
                    onClick={() => setMarketingEnabled((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-pill border-2 border-transparent transition-colors ${
                      marketingEnabled ? 'bg-coral' : 'bg-rule-strong'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-pill bg-white shadow transition-transform ${
                        marketingEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  Controls advertising measurement signals in Google Consent Mode v2. SettlementCheck does not currently run third-party remarketing pixels.
                </p>
              </div>

              {/* Consent receipt audit transparency */}
              {savedRecord && (
                <div className="rounded-md border border-rule bg-paper-2 px-3.5 py-2.5 text-[11px] font-mono text-muted">
                  <div>Consent receipt ID: {savedRecord.id}</div>
                  <div>
                    Last recorded: {new Date(savedRecord.updatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })} (Policy v{savedRecord.v})
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-6 py-4 border-t border-rule bg-paper">
              <button
                type="button"
                onClick={() => commitConsent(false, false, 'reject_non_essential')}
                className="px-4 py-2.5 rounded-sm border border-ink bg-card text-ink text-[13px] font-semibold hover:bg-paper-2 transition-colors"
              >
                Reject non-essential
              </button>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => commitConsent(analyticsEnabled, marketingEnabled, 'custom_save')}
                  className="px-4 py-2.5 rounded-sm border border-coral bg-coral text-white text-[13px] font-semibold hover:bg-coral-ink transition-colors"
                >
                  Save preferences
                </button>
                <button
                  type="button"
                  onClick={() => commitConsent(true, true, 'accept_all')}
                  className="px-4 py-2.5 rounded-sm border border-ink bg-ink text-white text-[13px] font-semibold hover:bg-ink-2 transition-colors"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
