'use client'

import React from 'react'
import { openCookieSettings } from '@/lib/consent'

interface CookieSettingsButtonProps {
  className?: string
  label?: string
}

export default function CookieSettingsButton({
  className = 'hover:text-white transition-colors duration-[160ms] text-left',
  label = 'Cookie settings',
}: CookieSettingsButtonProps) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label}
    </button>
  )
}
