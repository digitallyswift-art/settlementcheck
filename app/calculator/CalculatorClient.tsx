'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import SteppedCalculator, { CalcPayload, InitialCalcValues } from '@/components/SteppedCalculator'
import { hasAnalyticsConsent } from '@/lib/consent'

const ThematicCalculator = dynamic(() => import('@/components/ThematicCalculator'), {
  loading: () => (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center">
      <p className="text-[#5B6577] text-[15px]">Loading calculator…</p>
    </div>
  ),
})

function CalculatorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [variant, setVariant] = useState<'sequential' | 'thematic'>(() => {
    const override = searchParams.get('v')
    if (override === 'thematic' || override === 'sequential') return override
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('sc_calc_assigned_variant')
        if (stored === 'thematic' || stored === 'sequential') return stored
      } catch {}
    }
    return 'sequential'
  })
  const userInteractedRef = useMemo(() => ({ current: false }), [])

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
      jurisdiction: (searchParams.get('jurisdiction') === 'NI' ? 'NI' : 'GB') as 'GB' | 'NI',
    }
  }, [searchParams])

  useEffect(() => {
    const markInteracted = () => {
      userInteractedRef.current = true
    }
    window.addEventListener('pointerdown', markInteracted, { once: true, passive: true })
    window.addEventListener('keydown', markInteracted, { once: true, passive: true })
    return () => {
      window.removeEventListener('pointerdown', markInteracted)
      window.removeEventListener('keydown', markInteracted)
    }
  }, [userInteractedRef])

  useEffect(() => {
    let cancelled = false

    async function reconcileVariantNonBlocking() {
      // 1. Explicit URL parameter override for debugging/inspection (?v=thematic or ?v=sequential)
      const override = searchParams.get('v')
      if (override === 'thematic' || override === 'sequential') {
        setVariant(override)
        return
      }

      // 2. Client session persistence — gated by UK PECR analytics consent
      let localAssigned: 'sequential' | 'thematic' = 'sequential'
      if (hasAnalyticsConsent()) {
        try {
          const stored = sessionStorage.getItem('sc_calc_assigned_variant')
          if (stored === 'thematic' || stored === 'sequential') {
            localAssigned = stored
            if (!userInteractedRef.current) setVariant(stored)
          } else {
            localAssigned = 'sequential'
            sessionStorage.setItem('sc_calc_assigned_variant', localAssigned)
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
        } catch {
          localAssigned = 'sequential'
        }
      }

      // 3. Reconcile remote experiment configuration non-blockingly if user hasn't interacted yet
      try {
        const res = await fetch('/api/experiments/config/?id=calc_ux_v2')
        if (!cancelled && res.ok) {
          const data = await res.json()
          if (
            data?.config?.mode === 'winner_selected' &&
            (data?.config?.winner === 'sequential' || data?.config?.winner === 'thematic') &&
            !userInteractedRef.current
          ) {
            setVariant(data.config.winner)
          }
        }
      } catch {
        // Keep immediate default variant
      }
    }

    reconcileVariantNonBlocking()
    return () => {
      cancelled = true
    }
  }, [searchParams, userInteractedRef])

  function handleCalculate(payload: CalcPayload) {
    // Record completion event for sequential variant (only when analytics consent is granted)
    if (variant === 'sequential' && hasAnalyticsConsent()) {
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
      jurisdiction:      payload.inputs.jurisdiction || searchParams.get('jurisdiction') || 'GB',
      variant:           variant,
    })
    router.push(`/results/?${p.toString()}`)
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
