import type { ReactNode } from 'react'
import StickyMobileCta from '@/components/StickyMobileCta'

export default function GuidesLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      {children}
      <StickyMobileCta />
    </>
  )
}
