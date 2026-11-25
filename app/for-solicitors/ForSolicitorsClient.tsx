'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import PostcodeInput from '@/components/PostcodeInput'
import { isPlausibleUkPostcode, PostcodeLookup } from '@/lib/postcodes'
import { trackClientEvent } from '@/lib/telemetry'

// ── Brand tokens (matches SettlementCheck design system) ─────────────────────
const C = {
  bg: '#F7F4EE',
  bgCard: '#FFFFFF',
  bgTint: '#EFEAE0',
  navy: '#0B1F3A',
  navyLight: '#162C4E',
  muted: '#5B6577',
  mutedLight: '#8A93A3',
  border: '#E2DCCE',
  borderStrong: '#C9C0AC',
  accent: '#D9603B',
  accentHover: '#B14A28',
  accentLight: '#FDF0EB',
  error: '#DC2626',
  success: '#0B1F3A',
  successLight: '#F0F5FA',
  amber: '#B5802A',
  amberLight: '#FDF8EC',
}

const SANS = "var(--font-sans, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"
const SERIF = "var(--font-serif, 'Source Serif 4', Georgia, serif)"
const MONO = "var(--font-mono, 'JetBrains Mono', monospace)"

// ── GA4 / GTM funnel tracking ─────────────────────────────────────────────────
function trackFormStep(stepId: string, stepNumber: number) {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    if (stepId === 'welcome' || stepId === 'success') {
      url.searchParams.delete('step')
    } else {
      url.searchParams.set('step', stepId)
    }
    window.history.replaceState(null, '', url.toString())
  } catch {}
  trackClientEvent('solicitor_form_step', {
    event_category: 'solicitor_application',
    step_id: stepId,
    step_number: stepNumber,
  })
}

function trackEvent(name: string, params?: Record<string, unknown>) {
  trackClientEvent(name, params)
}

// ── Slide Types ───────────────────────────────────────────────────────────────
type SlideId = 'welcome' | 'step1' | 'step2' | 'success'

interface FormData {
  firmName:              string
  contactName:           string
  email:                 string
  phone:                 string
  office_postcode:       string
  office_lat:            number | null
  office_lng:            number | null
  office_region:         string
  coverage_radius_miles: number | null | undefined
  sra_number:            string
  fee_shield_agreed:     boolean
}

interface SlideConfig {
  id: SlideId
  stepNumber?: number
}

const SLIDES: SlideConfig[] = [
  { id: 'welcome' },
  { id: 'step1', stepNumber: 1 },
  { id: 'step2', stepNumber: 2 },
  { id: 'success' },
]

const TOTAL_STEPS = 2

// ── Slide Animation Variants ──────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? -32 : 32, opacity: 0 }),
}

const slideTrans = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, stepNumber }: { pct: number; stepNumber?: number }) {
  return (
    <div style={{ padding: '12px 24px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.navy, letterSpacing: '0.02em' }}>
          {stepNumber ? `Step ${stepNumber} of ${TOTAL_STEPS}` : ''}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.accent }}>{pct}% complete</span>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
          style={{ height: '100%', background: C.accent, borderRadius: 999 }}
        />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ForSolicitorsClient() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormData>({
    firmName:              '',
    contactName:           '',
    email:                 '',
    phone:                 '',
    office_postcode:       '',
    office_lat:            null,
    office_lng:            null,
    office_region:         '',
    coverage_radius_miles: undefined,
    sra_number:            '',
    fee_shield_agreed:     false,
  })
  const [officePostcodeValid, setOfficePostcodeValid] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [entrySource, setEntrySource] = useState<'direct' | 'portal_demo'>('direct')

  const advancingRef = useRef(false)

  // Fast-path partners arriving from /portal/?demo=true straight into Step 1
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const from = new URLSearchParams(window.location.search).get('from')
      if (from === 'portal-demo') {
        setEntrySource('portal_demo')
        setSlideIndex(1)
      }
    } catch {}
  }, [])

  const currentSlide = SLIDES[slideIndex]

  const progressPct =
    currentSlide.id === 'welcome'
      ? 0
      : currentSlide.id === 'success'
      ? 100
      : currentSlide.stepNumber === 1
      ? 50
      : 90

  const showProgress = !['welcome', 'success'].includes(currentSlide.id)
  const showBack = slideIndex > 0 && currentSlide.id !== 'success'

  // GA tracking on slide change
  useEffect(() => {
    trackFormStep(currentSlide.id, currentSlide.stepNumber ?? 0)
  }, [slideIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation ─────────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setDir(1)
    setFieldError('')
    setSlideIndex((i) => i + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { advancingRef.current = false }, 350)
  }, [])

  const goBack = useCallback(() => {
    if (slideIndex === 0) return
    advancingRef.current = false
    setDir(-1)
    setFieldError('')
    setSlideIndex((i) => i - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slideIndex])

  const startApplicationFromHero = useCallback((initialPostcode?: string, lookup?: PostcodeLookup | null) => {
    advancingRef.current = false
    setFieldError('')
    if (initialPostcode && lookup) {
      setForm((f) => ({
        ...f,
        office_postcode: lookup.postcode,
        office_lat: lookup.latitude,
        office_lng: lookup.longitude,
        office_region: lookup.admin_district,
      }))
      setOfficePostcodeValid(true)
    }
    setDir(1)
    setSlideIndex(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Step 1 Validation & Advancement ────────────────────────────────────────
  const handleStep1Next = useCallback(() => {
    if (advancingRef.current) return
    advancingRef.current = true
    setFieldError('')

    if (!officePostcodeValid || !form.office_postcode.trim()) {
      advancingRef.current = false
      setFieldError('Please enter a valid UK office postcode to continue.')
      return
    }
    if (form.coverage_radius_miles === undefined) {
      advancingRef.current = false
      setFieldError('Please select your preferred coverage radius.')
      return
    }
    if (!form.firmName.trim()) {
      advancingRef.current = false
      setFieldError('Please enter your firm name.')
      return
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      advancingRef.current = false
      setFieldError('Please enter a valid work email address.')
      return
    }

    advance()
  }, [form, officePostcodeValid, advance])

  // ── Step 2 Submission ──────────────────────────────────────────────────────
  const submitApplication = useCallback(async () => {
    setFieldError('')
    if (!form.contactName.trim()) {
      setFieldError('Please enter the partner or designated fee earner name.')
      return
    }
    if (!/^\d{5,7}$/.test(form.sra_number.trim())) {
      setFieldError('Please enter a valid 5 to 7 digit SRA firm number.')
      return
    }
    if (!form.fee_shield_agreed) {
      setFieldError('Please confirm the SC-B-024 Fee Shield and SRA Rule 5.1 partner terms.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/solicitor-application/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_name:             form.firmName.trim(),
          contact_name:          form.contactName.trim(),
          email:                 form.email.trim(),
          phone:                 form.phone.trim() || null,
          office_postcode:       form.office_postcode,
          office_lat:            form.office_lat,
          office_lng:            form.office_lng,
          office_region:         form.office_region,
          coverage_radius_miles: form.coverage_radius_miles ?? null,
          sra_number:            form.sra_number.trim(),
          sra_confirmed:         true,
          fee_shield_agreed:     form.fee_shield_agreed,
        }),
      })
      if (!res.ok) {
        let detail = ''
        try { const d = await res.json(); detail = d.detail || d.error || '' } catch {}
        throw new Error(detail)
      }
      trackEvent('solicitor_application_submitted', {
        coverage_radius: form.coverage_radius_miles ?? 'national',
        has_district: Boolean(form.office_region),
        source: entrySource,
      })
      advance()
    } catch (err: unknown) {
      const detail = err instanceof Error && err.message ? ` (${err.message})` : ''
      setFieldError(
        `Something went wrong${detail}. Please try again or email us directly at team@settlementcheck.co.uk`
      )
    } finally {
      setSubmitting(false)
    }
  }, [form, entrySource, advance])

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFieldError('')
    setForm((f) => ({ ...f, [field]: value }))
  }, [])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: C.bg,
        minHeight: '100vh',
        fontFamily: SANS,
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
        position: 'relative',
        color: C.navy,
      }}
    >
      {/* ── Top Header Navigation ────────────────────────────────────────── */}
      <header
        className="px-4 sm:px-6"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: 68,
          background: 'rgba(247, 244, 238, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          zIndex: 200,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.6" />
              <path
                d="M6 11.5L9.5 15L16 7.5"
                stroke="#D9603B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1 }}>
              <span style={{ color: '#D9603B' }}>Settlement</span>
              <span style={{ color: '#0B1F3A' }}>Check</span>
            </span>
          </Link>

          <span
            className="hidden sm:inline-block"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.muted,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: C.bgTint,
              padding: '3px 9px',
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              whiteSpace: 'nowrap',
            }}
          >
            Solicitor Panel Portal
          </span>
        </div>

        {/* Header Right Action */}
        {slideIndex === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <button
              onClick={() => startApplicationFromHero()}
              className="px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-[13px] whitespace-nowrap"
              style={{
                background: C.navy,
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                minHeight: 44,
                fontWeight: 600,
                fontFamily: SANS,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 2px 6px rgba(11,31,58,0.15)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.navyLight }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.navy }}
            >
              Apply for Exclusivity →
            </button>
          </div>
        ) : showBack ? (
          <button
            onClick={goBack}
            aria-label="Go back"
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '8px 14px',
              minHeight: 44,
              color: C.navy,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: SANS,
              transition: 'border-color 0.15s ease',
              flexShrink: 0,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}
      </header>

      {/* ── Fixed Progress Bar in Multi-Step Mode ────────────────────────── */}
      {showProgress && (
        <div
          style={{
            position: 'sticky',
            top: 68,
            left: 0,
            right: 0,
            background: C.bgCard,
            borderBottom: `1px solid ${C.border}`,
            zIndex: 100,
          }}
        >
          <ProgressBar pct={progressPct} stepNumber={currentSlide.stepNumber} />
        </div>
      )}

      {/* ── Main Canvas View ─────────────────────────────────────────────── */}
      {slideIndex === 0 ? (
        /* Full-Width Attention Economy Sales Page */
        <SolicitorSalesPage onStartApplication={startApplicationFromHero} />
      ) : (
        /* 2-Step Progressive Application Wizard */
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)',
            padding: '32px 16px 72px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 600, position: 'relative' }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={currentSlide.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTrans}
                style={{ width: '100%' }}
              >
                {currentSlide.id === 'step1' && (
                  <Step1TerritorySlide
                    form={form}
                    officePostcodeValid={officePostcodeValid}
                    error={fieldError}
                    onPostcodeChange={(v) => {
                      setFieldError('')
                      setOfficePostcodeValid(false)
                      setForm((f) => ({ ...f, office_postcode: v, office_lat: null, office_lng: null, office_region: '' }))
                    }}
                    onPostcodeValidated={(lookup: PostcodeLookup | null) => {
                      if (lookup) {
                        setForm((f) => ({
                          ...f,
                          office_postcode: lookup.postcode,
                          office_lat:      lookup.latitude,
                          office_lng:      lookup.longitude,
                          office_region:   lookup.admin_district,
                        }))
                        setOfficePostcodeValid(true)
                      } else {
                        setOfficePostcodeValid(false)
                      }
                      setFieldError('')
                    }}
                    onSelectRadius={(radius) => updateField('coverage_radius_miles', radius)}
                    onUpdateField={(field, val) => updateField(field, val)}
                    onNext={handleStep1Next}
                  />
                )}

                {currentSlide.id === 'step2' && (
                  <Step2ComplianceSlide
                    form={form}
                    submitting={submitting}
                    error={fieldError}
                    onUpdateField={(field, val) => updateField(field, val)}
                    onSubmit={submitApplication}
                  />
                )}

                {currentSlide.id === 'success' && (
                  <SuccessSlide name={form.contactName} email={form.email} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

// ── B2B Sales Page (Attention Economy Framework) ──────────────────────────────
interface SalesPageProps {
  onStartApplication: (postcode?: string, lookup?: PostcodeLookup | null) => void
}

interface SolicitorDemandResult {
  postcode: string
  admin_district: string
  region: string | null
  latitude: number
  longitude: number
  radiusMiles: number
  territoryAvailable: boolean
  statusMessage: string
  activeDemandCount?: number
}

function SolicitorSalesPage({ onStartApplication }: SalesPageProps) {
  const [postcodeCheck, setPostcodeCheck] = useState('')
  const [demandResult, setDemandResult] = useState<SolicitorDemandResult | null>(null)
  const [checkingPostcode, setCheckingPostcode] = useState(false)
  const [postcodeStatus, setPostcodeStatus] = useState<'idle' | 'available' | 'invalid'>('idle')
  const [postcodeError, setPostcodeError] = useState('')

  // Lead Dossier interactive inspector state
  const [activeDossierTab, setActiveDossierTab] = useState<'director' | 'manager' | 'redundancy'>('director')

  // Unit Economics slider state
  const [monthlyIntros, setMonthlyIntros] = useState<number>(10)

  const handleQuickPostcodeCheck = async () => {
    if (!isPlausibleUkPostcode(postcodeCheck)) {
      setPostcodeError('Please enter a valid UK postcode format (e.g. SW1A 1AA or M1 1AE).')
      setPostcodeStatus('invalid')
      return
    }
    setCheckingPostcode(true)
    setPostcodeError('')
    try {
      const res = await fetch(
        `/api/solicitor-demand/?postcode=${encodeURIComponent(postcodeCheck.trim())}`
      )
      const data = await res.json().catch(() => null)
      if (res.ok && data) {
        setDemandResult(data as SolicitorDemandResult)
        setPostcodeStatus('available')
        trackEvent('solicitor_postcode_checked', {
          district: data.admin_district || 'unknown',
          territory_available: Boolean(data.territoryAvailable),
          has_k_anon_demand: typeof data.activeDemandCount === 'number',
        })
      } else {
        setDemandResult(null)
        setPostcodeError(
          data?.error || 'Please enter a valid UK postcode format (e.g. SW1A 1AA or M1 1AE).'
        )
        setPostcodeStatus('invalid')
      }
    } catch {
      setDemandResult(null)
      setPostcodeError('Unable to check postcode availability right now. Please try again.')
      setPostcodeStatus('invalid')
    } finally {
      setCheckingPostcode(false)
    }
  }

  // Pre-calculated dossier mock records
  const dossiers = {
    director: {
      title: 'Commercial Director Reorganisation',
      tenure: '7 years 4 months',
      age: 44,
      salary: '£78,000 / year (£1,500/week)',
      statutoryRedundancy: '£5,257',
      statutoryRedundancyCapNote: 'Calculated under April 2026 statutory cap of £751/week (ERA 1996 s.162)',
      pilon: '£19,500 (3 months gross contractual notice)',
      employerExGratia: '£29,000',
      totalOffer: '£48,500',
      taxFreeAmount: '£30,000 (ITEPA 2003 s.403 exempt threshold)',
      taxableAmount: '£18,500 (subject to PAYE/NICs)',
      employerLegalFeeContribution: '£750 + VAT',
      urgency: 'Employer signing deadline: 10 business days',
      readiness: 'High · Has draft settlement agreement PDF ready',
    },
    manager: {
      title: 'Protected Conversation Exit',
      tenure: '3 years 8 months',
      age: 38,
      salary: '£46,000 / year (£884/week)',
      statutoryRedundancy: '£2,253',
      statutoryRedundancyCapNote: 'Calculated at £751/week cap (3 years × 1.0 multiplier)',
      pilon: '£3,833 (1 month gross contractual notice)',
      employerExGratia: '£16,000',
      totalOffer: '£19,833',
      taxFreeAmount: '£16,000 (within £30,000 tax-free boundary)',
      taxableAmount: '£3,833 (PILON taxed as earnings)',
      employerLegalFeeContribution: '£600 + VAT',
      urgency: 'Formal offer letter issued yesterday',
      readiness: 'Awaiting independent legal advice certificate',
    },
    redundancy: {
      title: 'Compulsory Redundancy Restructure',
      tenure: '11 years 2 months',
      age: 52,
      salary: '£54,000 / year (£1,038/week)',
      statutoryRedundancy: '£11,265',
      statutoryRedundancyCapNote: 'Calculated using 1.5x factor for service over age 41 (ERA 1996 s.162)',
      pilon: '£9,000 (2 months contractual notice)',
      employerExGratia: '£22,000',
      totalOffer: '£31,000',
      taxFreeAmount: '£30,000 (maximum statutory termination exemption)',
      taxableAmount: '£1,000',
      employerLegalFeeContribution: '£650 + VAT',
      urgency: 'Consultation ended; agreement issued for sign-off',
      readiness: 'Employee checked offer against statutory entitlement',
    },
  }

  const currentDossier = dossiers[activeDossierTab]

  // Economics calculations (based on standard £500 statutory benchmark employer contribution)
  const baselineEmployerFee = monthlyIntros * 500

  return (
    <div className="px-4 sm:px-6" style={{ maxWidth: 1160, margin: '0 auto', paddingTop: 40, paddingBottom: 100 }}>

      {/* ── 1. ATTENTION HOOK HERO SECTION ───────────────────────────────── */}
      <section id="contact" style={{ textAlign: 'center', padding: '36px 0 56px', borderBottom: `1px solid ${C.border}` }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: C.bgTint,
            border: `1px solid ${C.borderStrong}`,
            borderRadius: 30,
            padding: '6px 14px',
            marginBottom: 24,
            maxWidth: '100%',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: C.accent,
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(217,96,59,0.8)',
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.navy,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            SRA-Regulated Employment Solicitors · England &amp; Wales
          </span>
        </div>

        {/* Master Headline */}
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: C.navy,
            maxWidth: 920,
            margin: '0 auto 22px',
          }}
        >
          Stop losing billable hours to unqualified redundancy enquiries.
        </h1>

        {/* Lead Subheading */}
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 2.2vw, 19px)',
            lineHeight: 1.6,
            color: C.muted,
            maxWidth: 760,
            margin: '0 auto 36px',
          }}
        >
          Receive exclusive, mathematically pre-calculated settlement agreement instructions from UK employees. Every lead includes verified statutory redundancy figures, PILON breakdowns, and confirmed employer legal fee contributions before you dial.
        </p>

        {/* Interactive Postcode Availability Checker (Attention Anchor) */}
        <div
          style={{
            maxWidth: 580,
            margin: '0 auto 28px',
            background: C.bgCard,
            border: `1.5px solid ${postcodeStatus === 'available' ? C.success : C.borderStrong}`,
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 8px 24px rgba(11,31,58,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <input
              type="text"
              value={postcodeCheck}
              onChange={(e) => {
                setPostcodeCheck(e.target.value.toUpperCase())
                setPostcodeStatus('idle')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleQuickPostcodeCheck()
                }
              }}
              placeholder="Office postcode (e.g. M2 5PF)"
              style={{
                flex: '1 1 200px',
                minWidth: 0,
                border: 'none',
                outline: 'none',
                padding: '12px 14px',
                fontSize: 15,
                fontFamily: SANS,
                color: C.navy,
                fontWeight: 500,
                background: 'transparent',
              }}
            />
            <button
              onClick={handleQuickPostcodeCheck}
              disabled={checkingPostcode || !postcodeCheck.trim()}
              style={{
                flex: '1 1 auto',
                minHeight: 44,
                background: C.navy,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 22px',
                fontSize: 14,
                fontWeight: 600,
                cursor: checkingPostcode || !postcodeCheck.trim() ? 'not-allowed' : 'pointer',
                fontFamily: SANS,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.navyLight }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.navy }}
            >
              {checkingPostcode ? 'Checking...' : 'Check Postcode →'}
            </button>
          </div>

          {postcodeStatus === 'available' && demandResult && (() => {
            const districtLabel = demandResult.admin_district || demandResult.postcode
            const hasKAnonDemand =
              typeof demandResult.activeDemandCount === 'number' &&
              demandResult.activeDemandCount >= 3
            return (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: C.successLight,
                  border: `1px solid ${C.success}30`,
                  borderRadius: 8,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ textAlign: 'left', flex: '1 1 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ color: C.navy, fontSize: 14, fontWeight: 700, fontFamily: SANS }}>
                      ✓ {demandResult.territoryAvailable ? `Territory Open for ${districtLabel}` : `Panel Active in ${districtLabel}`}
                    </span>
                    {demandResult.region && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: C.navy,
                          background: '#fff',
                          border: `1px solid ${C.border}`,
                          borderRadius: 999,
                          padding: '2px 8px',
                          fontFamily: SANS,
                        }}
                      >
                        {demandResult.region}
                      </span>
                    )}
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, fontFamily: SANS, lineHeight: 1.5 }}>
                    {hasKAnonDemand ? (
                      <>
                        <strong style={{ color: C.navy }}>{demandResult.activeDemandCount} verified employee enquiries</strong>{' '}
                        within {demandResult.radiusMiles} miles (last 30 days) · {demandResult.statusMessage}.
                      </>
                    ) : (
                      <>
                        {demandResult.statusMessage} · SRA-regulated employment firms.
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    onStartApplication(demandResult.postcode, {
                      postcode: demandResult.postcode,
                      latitude: demandResult.latitude,
                      longitude: demandResult.longitude,
                      region: demandResult.region,
                      admin_district: demandResult.admin_district,
                      country: 'United Kingdom',
                    })
                  }
                  style={{
                    minHeight: 44,
                    background: C.accent,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: SANS,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Claim {districtLabel} Territory →
                </button>
              </motion.div>
            )
          })()}

          {postcodeStatus === 'invalid' && (
            <div style={{ color: C.error, fontSize: 12, textAlign: 'left', padding: '4px 16px' }}>
              {postcodeError || 'Please enter a valid UK postcode format (e.g. SW1A 1AA or M1 1AE).'}
            </div>
          )}
        </div>

        {/* Hero CTAs — hide generic Coral CTA once postcode result shows its own primary Coral CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
          {postcodeStatus !== 'available' && (
            <button
              onClick={() => onStartApplication()}
              style={{
                minHeight: 48,
                background: C.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                fontFamily: SANS,
                boxShadow: '0 4px 18px rgba(217,96,59,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
            >
              Apply for Panel Exclusivity
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <a
            href="#lead-dossier"
            style={{
              minHeight: 44,
              background: C.bgCard,
              color: C.navy,
              border: `1.5px solid ${C.borderStrong}`,
              borderRadius: 8,
              padding: '14px 24px',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: SANS,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.15s ease',
            }}
          >
            Inspect Sample Lead Payload ↓
          </a>
        </div>

        {/* 4 Trust Pillars Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 14,
            maxWidth: 1020,
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          {[
            {
              title: '100% Exclusive Routing',
              desc: 'Never auctioned or sold to competing law firms. One instruction belongs to one firm.',
            },
            {
              title: 'Employer Fee Contributions',
              desc: 'Capped employer commercial contributions (typically £350 to £750+ + VAT, higher for senior exits) paid direct to you upon completion.',
            },
            {
              title: 'Complete Statutory Dossier',
              desc: 'Calculated statutory redundancy floor, PILON, and tax split before you pick up the phone.',
            },
            {
              title: '£0 Monthly Retainer',
              desc: 'Zero software subscriptions or upfront fees. Dedicated territorial allocation with bespoke terms agreed on onboarding.',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: SANS }}>
                  {pillar.title}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.45, fontFamily: SANS }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. PAIN POINT MATRIX: NON-BILLABLE FRICTION ─────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            The Intake Problem
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.navy,
              margin: '8px 0 16px',
            }}
          >
            Why standard legal marketing wastes your fee earners’ billable hours
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            Acquiring employment clients through digital advertising or generic lead brokers creates substantial non-billable overhead. SettlementCheck solves each bottleneck deterministically.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {[
            {
              num: '01',
              painTitle: 'Unqualified Initial Enquiries',
              painText: '30 to 45-minute unbillable calls with callers who do not have an active settlement offer, lack qualifying employment service, or have no funding for private fees.',
              solTitle: 'Pre-Filtered Statutory Floor',
              solText: 'Every SettlementCheck instruction holds an active settlement offer with continuous service and statutory floor verified under the Employment Rights Act 1996.',
            },
            {
              num: '02',
              painTitle: 'The Time-Consuming Intake Interview',
              painText: 'Fee earners spending valuable billable time extracting baseline figures: gross salary, notice pay, accrued holiday, and statutory redundancy caps.',
              solTitle: 'Full Data Payload on Arrival',
              solText: 'Your team receives a completed statutory dossier, separating contractual PILON from tax-exempt termination compensation before picking up the phone.',
            },
            {
              num: '03',
              painTitle: 'High Client Acquisition Costs (CAC)',
              painText: 'Between digital advertising spend, agency retainers, and low conversion rates on cold web traffic, acquiring a signed settlement agreement matter often costs hundreds of pounds in marketing overhead.',
              solTitle: 'Zero-Retainer Partner Model',
              solText: 'No marketing agency retainers, ad budget volatility, or wasted clicks. Join an accredited SRA panel with zero upfront subscription fees and terms tailored on onboarding.',
            },
            {
              num: '04',
              painTitle: 'Shared Lead Brokers & Fast Sprints',
              painText: 'Lead brokers selling the identical enquiry to multiple local law firms simultaneously, creating an undignified race to contact the client first.',
              solTitle: '100% Territorial Exclusivity',
              solText: 'Strict 1:1 matching. Once an employee in your agreed coverage area requests independent advice, the mandate belongs solely to your firm.',
            },
          ].map((item) => (
            <div
              key={item.num}
              style={{
                background: C.bgCard,
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.accent,
                    background: C.accentLight,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  PROBLEM {item.num}
                </span>

                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 19,
                    fontWeight: 700,
                    color: C.navy,
                    margin: '14px 0 8px',
                  }}
                >
                  {item.painTitle}
                </h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, margin: '0 0 20px', fontFamily: SANS }}>
                  {item.painText}
                </p>
              </div>

              <div
                style={{
                  background: C.bgTint,
                  border: `1px solid ${C.borderStrong}`,
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: SANS }}>
                    {item.solTitle}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: C.navy, lineHeight: 1.45, fontFamily: SANS }}>
                  {item.solText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. INTERACTIVE LEAD DOSSIER INSPECTOR ───────────────────────── */}
      <section id="lead-dossier" style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 36px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            The Data Advantage
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.navy,
              margin: '8px 0 16px',
            }}
          >
            Inspect the exact payload your fee earners receive
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            Your effort to extract numbers is reduced to zero. Every instruction arrives with calculated statutory minimums under the Employment Rights Act 1996 and tax treatment under ITEPA 2003.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'director', label: 'Senior Director (£48.5k Offer)' },
            { id: 'manager', label: 'Mid-Management Exit (£19.8k Offer)' },
            { id: 'redundancy', label: 'Long-Service Restructure (£31k Offer)' },
          ].map((tab) => {
            const isActive = activeDossierTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                style={{
                  minHeight: 44,
                  background: isActive ? C.navy : C.bgCard,
                  color: isActive ? '#fff' : C.navy,
                  border: `1.5px solid ${isActive ? C.navy : C.borderStrong}`,
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: SANS,
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* The Live Mock Lead Dossier Card */}
        <div
          style={{
            background: C.bgCard,
            border: `2px solid ${C.navy}`,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(11,31,58,0.08)',
            maxWidth: 880,
            margin: '0 auto',
          }}
        >
          {/* Dossier Header */}
          <div
            style={{
              background: C.navy,
              color: '#fff',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    background: C.accent,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    fontFamily: SANS,
                  }}
                >
                  CONFIRMED MANDATE
                </span>
                <span style={{ fontSize: 13, color: '#A5B4FC', fontFamily: MONO }}>
                  REF: SC-2026-{activeDossierTab.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: SERIF }}>
                {currentDossier.title}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontFamily: SANS,
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                ✓ OTP Verified Phone &amp; Email
              </span>
            </div>
          </div>

          {/* Dossier Body Payload Grid */}
          <div style={{ padding: '24px 28px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 18,
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: SANS }}>
                  Employee Tenure
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: SANS, marginTop: 2 }}>
                  {currentDossier.tenure} (Age: {currentDossier.age})
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: SANS }}>
                  Salary Base
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: SANS, marginTop: 2 }}>
                  {currentDossier.salary}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: SANS }}>
                  Employer Legal Fee Contribution
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.success, fontFamily: SANS, marginTop: 2 }}>
                  {currentDossier.employerLegalFeeContribution} (ERA s.203)
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ background: C.bgTint, borderRadius: 10, padding: '18px 20px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12, fontFamily: SANS }}>
                STATUTORY REDUNDANCY &amp; TAX BREAKDOWN
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Statutory Redundancy Entitlement</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 2 }}>
                    {currentDossier.statutoryRedundancy}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{currentDossier.statutoryRedundancyCapNote}</div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Contractual Notice Pay (PILON)</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 2 }}>
                    {currentDossier.pilon}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Taxed as employment earnings (ITEPA s.402D)</div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Total Employer Settlement Offer</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: MONO, marginTop: 2 }}>
                    {currentDossier.totalOffer}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Tax-free: {currentDossier.taxFreeAmount}</div>
                </div>
              </div>
            </div>

            {/* Solicitor Action Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14,
                padding: '12px 16px',
                background: C.bg,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
              }}
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Matter Status: </span>
                <span style={{ fontSize: 12, color: C.muted }}>{currentDossier.urgency} · {currentDossier.readiness}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Link
                  href="/portal/?demo=true"
                  style={{
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: C.bgCard,
                    color: C.navy,
                    border: `1.5px solid ${C.borderStrong}`,
                    borderRadius: 6,
                    padding: '10px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: SANS,
                  }}
                >
                  Preview Live Partner Portal →
                </Link>
                <button
                  onClick={() => onStartApplication()}
                  style={{
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: C.navy,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: SANS,
                  }}
                >
                  Receive Mandates Like This →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. UNIT ECONOMICS & ROI CALCULATOR ───────────────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            Partner Economics
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.navy,
              margin: '8px 0 16px',
            }}
          >
            Partner Capacity &amp; Revenue Modelling
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: '0 0 20px', fontFamily: SANS }}>
            While Section 203(3) ERA 1996 requires independent legal advice for a valid waiver, UK employers standardly provide a capped commercial contribution (typically £350 to £750+ + VAT, and higher for senior exits) paid directly to your firm upon completion of the agreement. Model your firm&apos;s monthly instruction capacity with zero software fees or upfront retainers.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F0F5FA', border: '1px solid #C4D8EC', padding: '6px 14px', borderRadius: 999, fontSize: 12, color: C.navy, fontWeight: 600, fontFamily: SANS }}>
            <span style={{ color: C.accent }}>✓</span> Zero Employee Fee Standard: Applies to completed standard Section 203(3) statutory reviews where the employer contribution is £500 + VAT or higher.
          </div>
        </div>

        <div
          className="px-5 py-7 sm:p-9"
          style={{
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            maxWidth: 880,
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(11,31,58,0.04)',
          }}
        >
          {/* Slider input */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <label style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: SANS }}>
                Desired Monthly Instructions:
              </label>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.accent,
                  fontFamily: SERIF,
                }}
              >
                {monthlyIntros} instructions / month
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={monthlyIntros}
              onChange={(e) => setMonthlyIntros(Number(e.target.value))}
              style={{
                width: '100%',
                height: 8,
                accentColor: C.accent,
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginTop: 6 }}>
              <span>3 / month (Solo practitioner)</span>
              <span>15 / month (Boutique firm)</span>
              <span>30 / month (Departmental capacity)</span>
            </div>
          </div>

          {/* Economics Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ background: C.bg, padding: '18px 20px', borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Employer Legal Contributions (Baseline)</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 4 }}>
                £{baselineEmployerFee.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on £500 standard benchmark contribution</div>
            </div>

            <div style={{ background: C.bg, padding: '18px 20px', borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Platform &amp; Software Fees</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 4 }}>
                £0
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Zero monthly retainers or subscription fees</div>
            </div>

            <div style={{ background: C.successLight, padding: '18px 20px', borderRadius: 8, border: `1px solid ${C.success}40` }}>
              <div style={{ fontSize: 11, color: C.success, textTransform: 'uppercase', fontWeight: 700 }}>Territorial Allocation</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.success, fontFamily: MONO, marginTop: 4 }}>
                {monthlyIntros} matters / mo
              </div>
              <div style={{ fontSize: 12, color: C.success, marginTop: 3 }}>100% exclusive 1:1 territorial routing</div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, margin: '0 0 28px', textAlign: 'center', fontFamily: SANS }}>
            * Models a completed standard Section 203(3) review and adviser certificate execution at a £500 + VAT employer contribution floor. Any fee uplift negotiated with the employer, abortive work if an agreement does not complete, or extended representation agreed with the client remains governed by your firm&apos;s engagement terms. Bespoke commercial arrangements and volume allocations are confirmed during onboarding based on practice capacity.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onStartApplication()}
              style={{
                background: C.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: SANS,
                boxShadow: '0 4px 14px rgba(217,96,59,0.25)',
              }}
            >
              Apply to join our panel →
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. SPEED-TO-LEAD SLA & EXCLUSIVITY PROTOCOL ─────────────────── */}
      <section id="how-it-works" style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                color: C.accent,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: SANS,
              }}
            >
              Response Protocol
            </span>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 3.8vw, 38px)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: C.navy,
                margin: '8px 0 16px',
              }}
            >
              Prompt response standards that protect client momentum
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: '0 0 18px', fontFamily: SANS }}>
              When an employee receives a settlement agreement, they often face a strict 7 to 14 day deadline to obtain independent legal advice under Section 203.
            </p>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: '0 0 24px', fontFamily: SANS }}>
              We route instructions to one partner firm at a time. Partner firms commit to initiating contact on the same business day (or within 24 hours), ensuring employees receive timely advice while their agreement window is open.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Strict 1:1 Routing', desc: 'No shared leads. You are not competing against multiple other law firms for the same matter.' },
                { title: 'Pre-Informed Clients', desc: 'Clients arrive having calculated their statutory entitlement and reviewed standard employer fee contribution practices.' },
                { title: 'Direct CRM / Webhook Push', desc: 'Introductions delivered instantly via encrypted email or straight into your practice management CRM.' },
              ].map((point) => (
                <div key={point.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: C.accent, fontWeight: 700, fontSize: 14, marginTop: 2 }}>✓</span>
                  <div>
                    <strong style={{ fontSize: 14, color: C.navy, fontFamily: SANS }}>{point.title}: </strong>
                    <span style={{ fontSize: 13, color: C.muted, fontFamily: SANS }}>{point.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: C.navy,
              borderRadius: 14,
              padding: '36px 30px',
              color: '#fff',
            }}
          >
            <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, margin: '0 0 14px' }}>
              Territory Allocation Protocol
            </h3>
            <p style={{ fontSize: 14, color: '#A5B4FC', lineHeight: 1.6, margin: '0 0 24px' }}>
              To ensure partner firms receive healthy matter volume and to prevent panel dilution, SettlementCheck manages regional capacity deliberately.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Managed Panel Density per Region</div>
                <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 3 }}>
                  Partner capacity is calibrated to regional employee instruction volume so each partner firm receives a consistent flow of matters.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>SRA Roll Verification</div>
                <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 3 }}>
                  All applicant firms undergo active status verification against the Solicitors Regulation Authority register.
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartApplication()}
              style={{
                width: '100%',
                background: C.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: SANS,
                boxShadow: '0 4px 12px rgba(217,96,59,0.3)',
              }}
            >
              Verify Your Firm &amp; Apply Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── 5B. SRA COMPLIANCE & CONFLICT GUARANTEE ─────────────────────── */}
      <section id="sra-compliance" style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 40px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            COLP &amp; Regulatory Assurance
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: C.navy,
              margin: '8px 0 14px',
            }}
          >
            SRA Compliance &amp; Conflict Guarantee
          </h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            Built for Compliance Officers for Legal Practice (COLPs) and employment partners requiring strict SRA Standards and Regulations alignment.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 20,
            maxWidth: 1020,
            margin: '0 auto 24px',
          }}
        >
          {[
            {
              tag: 'SRA Rule 5.1 & LASPO 2012',
              title: 'Transparent Introducer Model',
              desc: 'SettlementCheck operates strictly as an independent statutory calculator and transparent introducer platform. There is zero prohibited fee-sharing on client damages, and your instructed solicitor retains full professional independence under Section 203(3) ERA 1996.',
            },
            {
              tag: 'Conflict Protection',
              title: 'Zero-Penalty Conflict Re-Routing',
              desc: 'If your firm\u2019s conflict check identifies an existing relationship with the employer, you can decline the instruction immediately with zero penalty. The matter is re-routed cleanly without affecting your territorial allocation.',
            },
            {
              tag: 'Matter Filtering',
              title: 'Configurable Minimum Fee & Tier Preferences',
              desc: 'During onboarding, your practice can set preferred matter tiers, including minimum employer legal fee contributions (such as £500+ + VAT) and senior or director-level exit instructions.',
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '24px 22px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.accent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                  fontFamily: SANS,
                }}
              >
                {card.tag}
              </span>
              <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 10px' }}>
                {card.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted, lineHeight: 1.6, fontFamily: SANS }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: C.muted, margin: 0, fontFamily: SANS }}>
          UK GDPR Notice: Applicant firm and contact details are processed solely for SRA Digital Register verification, panel onboarding, and territorial routing.
        </p>
      </section>

      {/* ── 6. SOLICITOR FAQS (ACCORDION) ────────────────────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            Clear Answers
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: C.navy,
              margin: '8px 0 14px',
            }}
          >
            Frequently Asked Questions by Partner Firms
          </h2>
          <p style={{ fontSize: 15, color: C.muted, margin: 0, fontFamily: SANS }}>
            Objective commercial and regulatory details for fee earners and managing partners.
          </p>
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {[
            {
              q: 'How do employer legal fee contributions work under Section 203(3)?',
              a: 'While Section 203(3) ERA 1996 requires independent legal advice for a valid waiver, UK employers standardly provide a capped commercial contribution (typically £350 to £750+ + VAT, and higher for senior exits) paid directly to your firm upon completion of the agreement. For completed standard Section 203(3) statutory reviews where the employer contribution is £500 + VAT or higher, partner firms covenant not to bill the employee for any shortfall; abortive costs (if an employee declines to sign) or extended negotiation work remain governed by your firm\u2019s engagement terms.',
            },
            {
              q: 'Are introductions strictly exclusive to our firm?',
              a: 'Yes. We do not operate a shared lead broker model. When an employee in your agreed coverage area requests independent legal advice, their complete statutory file is dispatched exclusively to your firm. It is never sent to competing practices.',
            },
            {
              q: 'How are employee contact details and offers verified?',
              a: 'Every employee must pass two-factor OTP verification on their email and phone before requesting a solicitor match. Furthermore, they must enter their salary, tenure, reason for exit, and existing settlement offer into our calculator, ensuring you receive qualified matters rather than speculative enquiries.',
            },
            {
              q: 'What happens if a contact is unreachable?',
              a: 'Every employee contact is verified via two-factor OTP (email and phone). If an introduced employee has invalid contact details or does not respond within 48 hours of initial outreach, we credit that introduction back to your account immediately with zero dispute.',
            },
            {
              q: 'Are there monthly subscription fees or long-term commitments?',
              a: 'No. There are zero software fees, no monthly retainers, and no minimum term contracts. Bespoke commercial terms and territorial allocation are agreed during onboarding, and you can pause or adjust your territory radius at any time.',
            },
            {
              q: 'What are the regulatory requirements to join the panel?',
              a: 'You must be an active law firm regulated by the Solicitors Regulation Authority (SRA) in England & Wales with specialist employment law practitioners and valid professional indemnity insurance.',
            },
          ].map((item, idx) => (
            <details
              key={idx}
              style={{
                borderBottom: `1px solid ${C.border}`,
                padding: '18px 0',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.navy,
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.q}</span>
                <span style={{ color: C.accent, fontSize: 20, fontWeight: 400 }}>+</span>
              </summary>
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: C.muted,
                  fontFamily: SANS,
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 7. FINAL CONVERSION BANNER ───────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '64px 0 20px' }}>
        <div
          className="px-5 py-9 sm:px-8 sm:py-12"
          style={{
            background: C.bgCard,
            border: `2px solid ${C.borderStrong}`,
            borderRadius: 16,
            maxWidth: 780,
            margin: '0 auto',
            boxShadow: '0 12px 36px rgba(11,31,58,0.06)',
          }}
        >
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 700,
              color: C.navy,
              margin: '0 0 14px',
            }}
          >
            Ready to secure your practice area?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: C.muted,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 28px',
              fontFamily: SANS,
            }}
          >
            Register your practice in under 60 seconds. Zero setup fees, zero monthly retainers, and full SRA compliance verification.
          </p>

          <button
            onClick={() => onStartApplication()}
            style={{
              background: C.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              fontFamily: SANS,
              boxShadow: '0 4px 18px rgba(217,96,59,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
          >
            Apply to Join Panel Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div style={{ marginTop: 16, fontSize: 12, color: C.mutedLight, fontFamily: SANS }}>
            Strictly reserved for SRA-regulated employment solicitors in England &amp; Wales.
          </div>
        </div>
      </section>

    </div>
  )
}

// ── Application Form Sub-Components ───────────────────────────────────────────
const COVERAGE_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Within 25 miles (Local city / county)', value: 25 },
  { label: 'Within 50 miles (Regional hub)', value: 50 },
  { label: 'Within 100 miles (Multi-county practice)', value: 100 },
  { label: 'National (England & Wales remote sign-off capability)', value: null },
]

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  minHeight: 48,
  padding: '11px 14px',
  border: `1.5px solid ${C.borderStrong}`,
  borderRadius: 8,
  fontSize: 16,
  color: C.navy,
  background: C.bg,
  outline: 'none',
  fontFamily: SANS,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: C.navy,
  marginBottom: 6,
  fontFamily: SANS,
}

interface Step1Props {
  form: FormData
  officePostcodeValid: boolean
  error: string
  onPostcodeChange: (v: string) => void
  onPostcodeValidated: (lookup: PostcodeLookup | null) => void
  onSelectRadius: (radius: number | null) => void
  onUpdateField: <K extends keyof FormData>(field: K, val: FormData[K]) => void
  onNext: () => void
}

function Step1TerritorySlide({
  form,
  officePostcodeValid,
  error,
  onPostcodeChange,
  onPostcodeValidated,
  onSelectRadius,
  onUpdateField,
  onNext,
}: Step1Props) {
  return (
    <div
      style={{
        background: C.bgCard,
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        padding: '28px 24px',
        boxShadow: '0 8px 24px rgba(11,31,58,0.05)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: C.bgTint,
          border: `1px solid ${C.borderStrong}`,
          borderRadius: 20,
          padding: '4px 12px',
          color: C.navy,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 14,
          fontFamily: SANS,
        }}
      >
        Step 1 · Territory &amp; Firm
      </div>

      <h2
        style={{
          color: C.navy,
          fontSize: 'clamp(24px, 4.5vw, 32px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 8px',
          fontFamily: SERIF,
        }}
      >
        Claim your exclusive practice area
      </h2>
      <p style={{ color: C.muted, fontSize: 14, margin: '0 0 24px', lineHeight: 1.55, fontFamily: SANS }}>
        Select your office location and coverage radius so we can route local employee instructions exclusively to your firm.
      </p>

      {officePostcodeValid && form.office_region && (
        <div
          style={{
            background: C.successLight,
            border: '1px solid #C4D8EC',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 600,
            color: C.navy,
            fontFamily: SANS,
          }}
        >
          ✓ Territory pre-selected: {form.office_region} ({form.office_postcode})
        </div>
      )}

      {/* 1. Office Postcode */}
      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Office Postcode</label>
        <PostcodeInput
          value={form.office_postcode}
          onChange={onPostcodeChange}
          onValidated={onPostcodeValidated}
          placeholder="e.g. M2 5PF"
        />
      </div>

      {/* 2. Coverage Radius */}
      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Coverage Radius</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COVERAGE_OPTIONS.map((opt) => {
            const selected = form.coverage_radius_miles === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onSelectRadius(opt.value)}
                style={{
                  width: '100%',
                  minHeight: 48,
                  padding: '12px 16px',
                  textAlign: 'left',
                  border: `1.5px solid ${selected ? C.navy : C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: SANS,
                  fontWeight: selected ? 600 : 400,
                  cursor: 'pointer',
                  background: selected ? C.navy : C.bg,
                  color: selected ? '#fff' : C.navy,
                  transition: 'all 120ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <span>{opt.label}</span>
                <span style={{ fontSize: 14, color: selected ? '#fff' : C.muted, flexShrink: 0 }}>
                  {selected ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Firm Name */}
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="sc-firm-name" style={labelStyle}>
          Firm Name
        </label>
        <input
          id="sc-firm-name"
          type="text"
          value={form.firmName}
          onChange={(e) => onUpdateField('firmName', e.target.value)}
          placeholder="e.g. Apex Employment Law LLP"
          autoComplete="organization"
          style={inputStyle}
        />
      </div>

      {/* 4. Work Email */}
      <div style={{ marginBottom: 22 }}>
        <label htmlFor="sc-work-email" style={labelStyle}>
          Work Email
        </label>
        <input
          id="sc-work-email"
          type="email"
          value={form.email}
          onChange={(e) => onUpdateField('email', e.target.value)}
          placeholder="e.g. eleanor@apexlaw.co.uk"
          autoComplete="email"
          style={inputStyle}
        />
        <p style={{ margin: '6px 0 0', fontSize: 12, color: C.muted, fontFamily: SANS }}>
          We will send a one-click confirmation link after you submit, with no OTP code needed now.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 18,
          }}
        >
          <p style={{ color: C.error, fontSize: 13, margin: 0, fontFamily: SANS }}>{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        style={{
          width: '100%',
          minHeight: 48,
          background: C.accent,
          border: 'none',
          borderRadius: 8,
          padding: '14px 24px',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: SANS,
          boxShadow: '0 4px 14px rgba(217,96,59,0.25)',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
      >
        Continue to Contact &amp; SRA Details →
      </button>
    </div>
  )
}

interface Step2Props {
  form: FormData
  submitting: boolean
  error: string
  onUpdateField: <K extends keyof FormData>(field: K, val: FormData[K]) => void
  onSubmit: () => void
}

function Step2ComplianceSlide({ form, submitting, error, onUpdateField, onSubmit }: Step2Props) {
  const isSraFormatValid = /^\d{5,7}$/.test(form.sra_number.trim())

  return (
    <div
      style={{
        background: C.bgCard,
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        padding: '28px 24px',
        boxShadow: '0 8px 24px rgba(11,31,58,0.05)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: C.successLight,
          border: '1px solid #C4D8EC',
          borderRadius: 20,
          padding: '4px 12px',
          color: C.navy,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 14,
          fontFamily: SANS,
        }}
      >
        Step 2 · Contact &amp; SRA Compliance
      </div>

      <h2
        style={{
          color: C.navy,
          fontSize: 'clamp(24px, 4.5vw, 32px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 8px',
          fontFamily: SERIF,
        }}
      >
        Designated contact &amp; SRA registration
      </h2>
      <p style={{ color: C.muted, fontSize: 14, margin: '0 0 24px', lineHeight: 1.55, fontFamily: SANS }}>
        Final step for <strong>{form.firmName}</strong>. Confirm your SRA firm number and partner terms.
      </p>

      {/* 1. Contact Name */}
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="sc-contact-name" style={labelStyle}>
          Contact Name (Partner / Designated Fee Earner)
        </label>
        <input
          id="sc-contact-name"
          type="text"
          value={form.contactName}
          onChange={(e) => onUpdateField('contactName', e.target.value)}
          placeholder="e.g. Eleanor Vance"
          autoComplete="name"
          style={inputStyle}
        />
      </div>

      {/* 2. Direct Phone (optional) */}
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="sc-direct-phone" style={labelStyle}>
          Direct Telephone <span style={{ fontWeight: 400, color: C.muted }}>(optional)</span>
        </label>
        <input
          id="sc-direct-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => onUpdateField('phone', e.target.value)}
          placeholder="e.g. 020 7946 0192"
          autoComplete="tel"
          style={inputStyle}
        />
      </div>

      {/* 3. SRA Firm Number */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="sc-sra-number" style={labelStyle}>
          SRA Firm Number
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input
            id="sc-sra-number"
            type="text"
            inputMode="numeric"
            maxLength={7}
            value={form.sra_number}
            onChange={(e) => onUpdateField('sra_number', e.target.value.replace(/\D/g, '').slice(0, 7))}
            placeholder="e.g. 568912"
            style={{
              ...inputStyle,
              flex: '1 1 160px',
              minWidth: 0,
              fontFamily: MONO,
              borderColor: isSraFormatValid ? C.navy : C.borderStrong,
            }}
          />
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: isSraFormatValid ? C.successLight : C.accentLight,
              border: `1px solid ${isSraFormatValid ? '#C4D8EC' : '#F3C4B8'}`,
              fontSize: 12,
              fontWeight: 600,
              color: isSraFormatValid ? C.navy : C.accentHover,
              whiteSpace: 'nowrap',
              fontFamily: SANS,
            }}
          >
            {isSraFormatValid ? '✓ Valid 5–7 digit SRA format' : 'Enter 5–7 digit SRA number'}
          </div>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: C.muted, fontFamily: SANS }}>
          Checked manually against the SRA Digital Register within 1 business day.
        </p>
      </div>

      {/* 4. Explicit Unchecked SC-B-024 Fee Shield + SRA 5.1 Consent */}
      <div
        style={{
          background: C.successLight,
          border: '1.5px solid #C4D8EC',
          borderRadius: 10,
          padding: '16px',
          marginBottom: 22,
          fontFamily: SANS,
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          <input
            type="checkbox"
            checked={form.fee_shield_agreed}
            onChange={(e) => onUpdateField('fee_shield_agreed', e.target.checked)}
            style={{ marginTop: 3, accentColor: C.accent, width: 18, height: 18, flexShrink: 0 }}
          />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 4 }}>
              Binding Covenant: Zero Employee Fee Standard (SC-B-024) &amp; SRA Rule 5.1 Partner Terms
            </span>
            <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.55 }}>
              We confirm our practice is SRA-regulated in England &amp; Wales, accepts SRA Rule 5.1 / LASPO 2012 transparency terms, and covenants that for completed standard Section 203(3) ERA 1996 statutory reviews where the employer contribution is £500 + VAT or higher, our firm will not bill the employee for any fee shortfall. Abortive fees (if an employee aborts or declines to sign) or extended negotiation work remain governed by our firm&apos;s engagement terms.
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 18,
          }}
        >
          <p style={{ color: C.error, fontSize: 13, margin: 0, fontFamily: SANS }}>{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        style={{
          width: '100%',
          minHeight: 48,
          background: C.accent,
          border: 'none',
          borderRadius: 8,
          padding: '14px 24px',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.7 : 1,
          fontFamily: SANS,
          boxShadow: submitting ? 'none' : '0 4px 16px rgba(217,96,59,0.3)',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = C.accentHover }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
      >
        {submitting ? 'Submitting Application...' : 'Complete SRA Partner Registration →'}
      </button>
    </div>
  )
}

function SuccessSlide({ name, email }: { name: string; email: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 18 }}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: C.successLight,
          border: '2px solid #C4D8EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.success}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <h1
        style={{
          color: C.navy,
          fontSize: 'clamp(26px, 4.5vw, 38px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          margin: '0 0 12px',
          fontFamily: SERIF,
        }}
      >
        {name ? `Thank you, ${name.split(' ')[0]}!` : 'Application Received'}
      </h1>
      <p
        style={{
          color: C.muted,
          fontSize: 15,
          lineHeight: 1.6,
          maxWidth: 480,
          margin: '0 auto 28px',
          fontFamily: SANS,
        }}
      >
        Your firm&apos;s panel application has been received. Complete the steps below to activate your territorial routing:
      </p>

      {/* 3-Step Next-Action Checklist */}
      <div
        style={{
          background: C.bgCard,
          border: `1.5px solid ${C.border}`,
          borderRadius: 12,
          padding: '20px 22px',
          textAlign: 'left',
          marginBottom: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          fontFamily: SANS,
        }}
      >
        {[
          {
            num: '1',
            title: 'Confirm your work email',
            desc: `Click the verification link we just sent to ${email || 'your work inbox'} (valid for 48 hours).`,
          },
          {
            num: '2',
            title: 'SRA Register check within 1 business day',
            desc: 'Our onboarding team verifies your SRA firm number and confirms your exclusive territory.',
          },
          {
            num: '3',
            title: 'Explore the Partner Portal demo now',
            desc: 'Inspect a live sample statutory dossier and matter workflow while your application is reviewed.',
          },
        ].map((step) => (
          <div key={step.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: C.accentLight,
                border: `1px solid ${C.accent}`,
                color: C.accentHover,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {step.num}
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{step.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginTop: 2 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link
          href="/portal/?demo=true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            background: C.accent,
            color: '#fff',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: SANS,
            letterSpacing: '-0.01em',
          }}
        >
          Preview Your Partner Portal Demo →
        </Link>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            background: C.navy,
            color: '#fff',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: SANS,
            letterSpacing: '-0.01em',
          }}
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}
