'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SteppedCalculator, { CalcPayload, InitialCalcValues } from '@/components/SteppedCalculator'
import ThematicCalculator from '@/components/ThematicCalculator'

function CalculatorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [variant, setVariant] = useState<'sequential' | 'thematic'>('sequential')
  const [resolved, setResolved] = useState(false)

  const initialValues: InitialCalcValues = useMemo(() => {
    return {
      salary:            searchParams.get('salary') || '',
      yearsNum:          searchParams.get('yearsNum') || searchParams.get('years') || '',
      monthsNum:         searchParams.get('monthsNum') || searchParams.get('months') || '',
      age:               searchParams.get('age') || '',
      offer:             searchParams.get('offer') || '',
      offerIncludesNotice: searchParams.get('offerIncludesNotice') ?? undefined,
      reason:            searchParams.get('reason') || '',
      discrimination:    searchParams.get('discrimination') || '',
      contractualNotice: searchParams.get('contractualNotice') || searchParams.get('notice') || '',
    }
  }, [searchParams])

  useEffect(() => {
    async function resolveVariant() {
      // 1. Explicit URL parameter override for debugging/inspection (?v=thematic or ?v=sequential)
      const override = searchParams.get('v')
      if (override === 'thematic' || override === 'sequential') {
        setVariant(override)
        setResolved(true)
        return
      }

      // 2. Fetch remote experiment configuration
      try {
        const res = await fetch('/api/experiments/config/?id=calc_ux_v2')
        if (res.ok) {
          const data = await res.json()
          if (data?.config?.mode === 'winner_selected' && data?.config?.winner) {
            setVariant(data.config.winner)
            setResolved(true)
            return
          }
        }
      } catch {
        // Fall back to local session logic
      }

      // 3. Client session persistence (50/50 split)
      try {
        const stored = sessionStorage.getItem('sc_calc_assigned_variant')
        if (stored === 'thematic' || stored === 'sequential') {
          setVariant(stored)
        } else {
          const assigned: 'sequential' | 'thematic' = Math.random() < 0.5 ? 'sequential' : 'thematic'
          sessionStorage.setItem('sc_calc_assigned_variant', assigned)
          setVariant(assigned)

          // Emit enrollment telemetry for sequential variant (thematic emits inside its own component)
          if (assigned === 'sequential') {
            fetch('/api/telemetry/experiment-event/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                experiment_id: 'calc_ux_v2',
                variant: 'sequential',
                event_type: 'enrolled',
                stage_number: 1,
              }),
            }).catch(() => {})
          }
        }
      } catch {
        setVariant('sequential')
      }

      setResolved(true)
    }

    resolveVariant()
  }, [searchParams])

  function handleCalculate(payload: CalcPayload) {
    // Record completion event for sequential variant
    if (variant === 'sequential') {
      fetch('/api/telemetry/experiment-event/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiment_id: 'calc_ux_v2',
          variant: 'sequential',
          event_type: 'completed',
          stage_number: 7,
        }),
      }).catch(() => {})
    }

    const p = new URLSearchParams({
      salary:            payload.inputs.salary,
      yearsNum:          payload.inputs.yearsNum,
      monthsNum:         payload.inputs.monthsNum,
      age:               payload.inputs.age,
      offer:             payload.inputs.offer,
      offerIncludesNotice: payload.inputs.offerIncludesNotice || 'true',
      reason:            payload.inputs.reason,
      discrimination:    payload.inputs.discrimination,
      contractualNotice: payload.inputs.contractualNotice,
      jurisdiction:      searchParams.get('jurisdiction') || 'GB',
      variant:           variant,
    })
    router.push(`/results/?${p.toString()}`)
  }

  // Fallback while reading variant
  if (!resolved) {
    return (
      <div className="min-h-screen bg-paper-2 flex items-center justify-center">
        <p className="text-[#5B6577] text-[15px]">Loading calculator…</p>
      </div>
    )
  }

  return variant === 'thematic' ? (
    <ThematicCalculator onCalculate={handleCalculate} initialValues={initialValues} />
  ) : (
    <SteppedCalculator onCalculate={handleCalculate} initialValues={initialValues} />
  )
}

export default function CalculatorClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-2 flex items-center justify-center">
          <p className="text-[#5B6577] text-[15px]">Loading calculator…</p>
        </div>
      }
    >
      <CalculatorInner />
    </Suspense>
  )
}
