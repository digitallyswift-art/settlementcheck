'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { lookupPostcode, isPlausibleUkPostcode, normalisePostcode, PostcodeLookup } from '@/lib/postcodes'

// Brand tokens (duplicated locally to keep this component self-contained)
const ACCENT       = '#D9603B'
const NAVY         = '#0B1F3A'
const MUTED        = '#5B6577'
const BG_FIELD     = '#F7F4EE'
const BORDER_FIELD = '#C9C0AC'
const ERROR        = '#DC2626'
const SANS         = "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"

type ValidationState = 'idle' | 'checking' | 'valid' | 'fallback' | 'invalid'

interface Props {
  id?: string
  value: string
  onChange: (raw: string) => void
  onValidated: (lookup: PostcodeLookup | null) => void
  onFallbackValid?: (postcode: string) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  debounceMs?: number
  variant?: 'typeform' | 'boxed'
  initialValidLabel?: string
}

export default function PostcodeInput({
  id,
  value,
  onChange,
  onValidated,
  onFallbackValid,
  inputRef,
  onKeyDown,
  placeholder = 'e.g. SW1A 1AA',
  debounceMs = 400,
  variant = 'typeform',
  initialValidLabel,
}: Props) {
  const [state, setState] = useState<ValidationState>(
    initialValidLabel && value.trim() ? 'valid' : 'idle'
  )
  const [locationLabel, setLocationLabel] = useState(
    initialValidLabel && value.trim() ? initialValidLabel : ''
  )
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestValue = useRef(value)
  const onValidatedRef = useRef(onValidated)
  const onFallbackValidRef = useRef(onFallbackValid)
  const lastValidatedNormed = useRef<string>(
    initialValidLabel && value.trim() ? normalisePostcode(value) : ''
  )

  useEffect(() => {
    onValidatedRef.current = onValidated
  }, [onValidated])

  useEffect(() => {
    onFallbackValidRef.current = onFallbackValid
  }, [onFallbackValid])

  const runLookup = useCallback(async (raw: string) => {
    const normed = normalisePostcode(raw)
    if (!isPlausibleUkPostcode(normed)) {
      lastValidatedNormed.current = ''
      setState('invalid')
      setLocationLabel('')
      onValidatedRef.current(null)
      return
    }
    setState('checking')
    const result = await lookupPostcode(normed)
    // Ignore stale responses if input changed while we were fetching
    if (normalisePostcode(latestValue.current) !== normed) return
    if (result) {
      lastValidatedNormed.current = normalisePostcode(result.postcode)
      setState('valid')
      const parts = [result.admin_district, result.region].filter(Boolean)
      setLocationLabel(parts.join(', '))
      onValidatedRef.current(result)
    } else if (onFallbackValidRef.current) {
      // Allow plausible UK postcode format fallback if postcodes.io is unreachable/times out
      lastValidatedNormed.current = normed
      setState('fallback')
      setLocationLabel('Postcode format accepted (address lookup unavailable)')
      onFallbackValidRef.current(normed)
    } else {
      lastValidatedNormed.current = ''
      setState('invalid')
      setLocationLabel('')
      onValidatedRef.current(null)
    }
  }, [])

  // Debounce lookup on value change only
  useEffect(() => {
    latestValue.current = value
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!value.trim()) {
      lastValidatedNormed.current = ''
      setState('idle')
      setLocationLabel('')
      return
    }
    const normed = normalisePostcode(value)
    if (lastValidatedNormed.current && lastValidatedNormed.current === normed) {
      return
    }
    timerRef.current = setTimeout(() => runLookup(value), debounceMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [value, debounceMs, runLookup])

  // Format on change: uppercase, allow letters/digits/single space
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ')
    lastValidatedNormed.current = ''
    setState('idle')
    setLocationLabel('')
    onValidatedRef.current(null)
    onChange(raw)
  }

  // On blur: normalise and trigger lookup immediately if not already validated
  function handleBlur() {
    if (!value.trim()) return
    const normed = normalisePostcode(value)
    latestValue.current = normed
    if (lastValidatedNormed.current === normed) {
      if (normed !== value) onChange(normed)
      return
    }
    if (normed !== value) onChange(normed)
    if (timerRef.current) clearTimeout(timerRef.current)
    runLookup(normed)
  }

  const borderColor =
    state === 'valid'    ? ACCENT :
    state === 'fallback' ? ACCENT :
    state === 'invalid'  ? ERROR  :
    state === 'checking' ? ACCENT :
    BORDER_FIELD

  const isBoxed = variant === 'boxed'

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          ref={inputRef}
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="postal-code"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          maxLength={8}
          style={
            isBoxed
              ? {
                  display: 'block',
                  width: '100%',
                  minHeight: 48,
                  padding: '11px 38px 11px 14px',
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: 8,
                  fontSize: 16,
                  color: NAVY,
                  background: BG_FIELD,
                  outline: 'none',
                  caretColor: ACCENT,
                  fontFamily: SANS,
                  boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
                  transition: 'border-color 0.15s ease',
                }
              : {
                  display: 'block',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2.5px solid ${borderColor}`,
                  padding: '10px 32px 14px 0',
                  fontSize: 'clamp(22px, 3.5vw, 30px)',
                  color: NAVY,
                  outline: 'none',
                  caretColor: ACCENT,
                  letterSpacing: '0.06em',
                  fontFamily: SANS,
                  boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
                  transition: 'border-color 0.2s ease',
                }
          }
        />
        {/* Status icon: right-aligned inside input row */}
        {state === 'checking' && (
          <span style={{ position: 'absolute', right: isBoxed ? 12 : 4, top: '50%', transform: 'translateY(-50%)', color: ACCENT, fontSize: 13, fontFamily: SANS }}>
            …
          </span>
        )}
        {state === 'valid' && (
          <span style={{ position: 'absolute', right: isBoxed ? 12 : 4, top: '50%', transform: 'translateY(-50%)', color: ACCENT }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </div>

      {/* Feedback line below input */}
      <div style={{ minHeight: 20, marginTop: 6, fontSize: 13, fontFamily: SANS, lineHeight: 1.4 }}>
        {state === 'valid' && locationLabel && (
          <span style={{ color: ACCENT, fontWeight: 500 }}>{locationLabel}</span>
        )}
        {state === 'fallback' && locationLabel && (
          <span style={{ color: MUTED }}>{locationLabel}</span>
        )}
        {state === 'invalid' && (
          <span role="alert" style={{ color: ERROR }}>Please enter a valid UK postcode</span>
        )}
        {state === 'checking' && (
          <span style={{ color: MUTED }}>Checking postcode…</span>
        )}
      </div>
    </div>
  )
}
