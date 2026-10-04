'use client'

import { Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SteppedCalculator, { CalcPayload, InitialCalcValues } from '@/components/SteppedCalculator'

function CalculatorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialValues: InitialCalcValues = useMemo(() => {
    return {
      salary:            searchParams.get('salary') || '',
      yearsNum:          searchParams.get('yearsNum') || searchParams.get('years') || '',
      monthsNum:         searchParams.get('monthsNum') || searchParams.get('months') || '',
      age:               searchParams.get('age') || '',
      offer:             searchParams.get('offer') || '',
      reason:            searchParams.get('reason') || '',
      discrimination:    searchParams.get('discrimination') || '',
      contractualNotice: searchParams.get('contractualNotice') || searchParams.get('notice') || '',
    }
  }, [searchParams])

  function handleCalculate(payload: CalcPayload) {
    const p = new URLSearchParams({
      salary:            payload.inputs.salary,
      yearsNum:          payload.inputs.yearsNum,
      monthsNum:         payload.inputs.monthsNum,
      age:               payload.inputs.age,
      offer:             payload.inputs.offer,
      reason:            payload.inputs.reason,
      discrimination:    payload.inputs.discrimination,
      contractualNotice: payload.inputs.contractualNotice,
    })
    router.push(`/results?${p.toString()}`)
  }

  return <SteppedCalculator onCalculate={handleCalculate} initialValues={initialValues} />
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

