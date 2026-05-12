'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { lookupPostcode, isPlausibleUkPostcode, normalisePostcode, PostcodeLookup } from '@/lib/postcodes'

// Brand tokens (duplicated locally to keep this component self-contained)
const ACCENT = '#D9603B'
const NAVY   = '#0B1F3A'
const MUTED  = '#5B6577'
const BORDER = '#E2DCCE'
const ERROR  = '#DC2626'
const SANS   = "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"

type ValidationState = 'idle' | 'checking' | 'valid' | 'invalid'

interface Props {
  value: string
  onChange: (raw: string) => void
  onValidated: (lookup: PostcodeLookup | null) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  debounceMs?: number
}

export default function PostcodeInput({
  value,
  onChange,
  onValidated,
  inputRef,
  onKeyDown,
  placeholder = 'SW1A 1AA',
  debounceMs = 400,
}: Props) {
  const [state, setState]       = useState<ValidationState>('idle')
  const [locationLabel, setLocationLabel] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestValue = useRef(value)

  const runLookup = useCallback(async (raw: string) => {
    if (!isPlausibleUkPostcode(raw)) {
      setState('invalid')
      setLocationLabel('')
      onValidated(null)
      return
    }
    setState('checking')
    const result = await lookupPostcode(raw)
    // Ignore stale responses if input changed while we were fetching
    if (raw !== latestValue.current) return
    if (result) {
      setState('valid')
      const parts = [result.admin_district, result.region].filter(Boolean)
      setLocationLabel(parts.join(', '))
      onValidated(result)
    } else {
      setState('invalid')
      setLocationLabel('')
      onValidated(null)
    }
  }, [onValidated])

  // Debounce lookup on value change
  useEffect(() => {
    latestValue.current = value
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!value.trim()) {
      setState('idle')
      setLocationLabel('')
      return
    }
    timerRef.current = setTimeout(() => runLookup(value), debounceMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [value, debounceMs, runLookup])

  // Format on change: uppercase + insert space before last 3 chars when length >= 5
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '')
    // Reset validation state immediately on any edit
    setState('idle')
    setLocationLabel('')
    onValidated(null)
    onChange(raw)
  }

  // On blur: attempt to normalise and trigger lookup immediately if plausible
  function handleBlur() {
    if (!value.trim()) return
    const normed = normalisePostcode(value)
    if (normed !== value) onChange(normed)
    if (timerRef.current) clearTimeout(timerRef.current)
    runLookup(normed)
  }

  const borderColor =
    state === 'valid'    ? ACCENT :
    state === 'invalid'  ? ERROR  :
    state === 'checking' ? ACCENT :
    '#C9C0AC'

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
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
          style={{
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
          }}
        />
        {/* Status icon — right-aligned inside input row */}
        {state === 'checking' && (
          <span style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', color: ACCENT, fontSize: 13, fontFamily: SANS }}>
            …
          </span>
        )}
        {state === 'valid' && (
          <span style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', color: ACCENT }}>
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
        {state === 'invalid' && (
          <span style={{ color: ERROR }}>Please enter a valid UK postcode</span>
        )}
        {state === 'checking' && (
          <span style={{ color: MUTED }}>Checking postcode…</span>
        )}
        {state === 'idle' && (
          <span style={{ color: MUTED, fontSize: 12 }}>e.g. {placeholder}</span>
        )}
      </div>
    </div>
  )
}
