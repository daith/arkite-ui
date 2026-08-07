'use client'

import { LocaleProvider, ToastContainer, zhTW } from '@arkite-ui/core'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale={zhTW}>
      {children}
      <ToastContainer />
    </LocaleProvider>
  )
}
