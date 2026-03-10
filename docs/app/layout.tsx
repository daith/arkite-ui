import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider'
import type { ReactNode } from 'react'
import 'fumadocs-ui/style.css'

export const metadata = {
  title: 'Arkite UI',
  description: 'Production-ready components for SaaS admin panels',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
