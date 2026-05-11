'use client'

import { useRouter } from 'next/navigation'
import SteppedCalculator, { CalcPayload } from '@/components/SteppedCalculator'

export default function CalculatorPage() {
  const router = useRouter()

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

  return <SteppedCalculator onCalculate={handleCalculate} />
}
