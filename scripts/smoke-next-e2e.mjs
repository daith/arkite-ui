/**
 * Next.js smoke e2e: starts the built smoke app, loads it in Chromium,
 * fails on any console error (hydration mismatches surface there), and
 * exercises real interactivity (modal + toast) to prove hydration
 * actually attached handlers.
 *
 * Run via `pnpm smoke:next` (expects smoke/next to be `next build`-ed).
 */
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 3939
const server = spawn('pnpm', ['--dir', 'smoke/next', 'exec', 'next', 'start', '-p', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
})

const kill = () => {
  try {
    server.kill('SIGTERM')
  } catch {
    /* already gone */
  }
}
process.on('exit', kill)

const waitForReady = new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('next start timed out')), 60_000)
  server.stdout.on('data', (d) => {
    if (String(d).includes('Ready')) {
      clearTimeout(timer)
      resolve()
    }
  })
  server.on('exit', (code) => reject(new Error(`next start exited early (${code})`)))
})

const fail = (msg) => {
  console.error(`✗ ${msg}`)
  kill()
  process.exit(1)
}

try {
  await waitForReady
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const consoleErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })
  page.on('pageerror', (e) => consoleErrors.push(String(e)))

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })

  // 1. Server-rendered token value proves /tokens is RSC-safe.
  const token = await page.getByTestId('server-token').textContent()
  if (token !== '#9333ea') fail(`server token wrong: ${token}`)
  console.log('✓ tokens import is server-safe (rendered in a Server Component)')

  // 2. Interactivity proves hydration attached handlers.
  await page.getByRole('button', { name: 'Open modal' }).click()
  await page.getByTestId('modal-body').waitFor({ timeout: 5_000 })
  await page.keyboard.press('Escape')
  console.log('✓ modal opens and closes after hydration')

  await page.getByRole('button', { name: 'Show toast' }).click()
  await page.getByText('已儲存').waitFor({ timeout: 5_000 })
  console.log('✓ toast fires (zh-TW locale wired)')

  // 3. No console errors — hydration mismatches land here.
  const relevant = consoleErrors.filter((e) => !e.includes('favicon'))
  if (relevant.length > 0) {
    console.error(relevant.join('\n---\n'))
    fail(`${relevant.length} console error(s) — hydration mismatch or runtime failure`)
  }
  console.log('✓ zero console errors (no hydration mismatch)')

  await browser.close()
  kill()
  console.log('\nNext.js smoke: PASS')
  process.exit(0)
} catch (e) {
  fail(e.message)
}
