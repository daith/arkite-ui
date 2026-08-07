import './globals.css'
import { Providers } from './providers'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'arkite-ui Next.js smoke',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
