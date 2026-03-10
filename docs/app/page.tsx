import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Arkite UI</h1>
      <p className="max-w-lg text-lg text-muted-foreground">
        Production-ready React components for SaaS admin panels.
        Built with Tailwind CSS v4, Radix UI, and TypeScript.
      </p>
      <div className="flex gap-3">
        <Link
          href="/docs/getting-started"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Get Started
        </Link>
        <Link
          href="/docs/components/button"
          className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-accent"
        >
          Components
        </Link>
      </div>
    </main>
  )
}
