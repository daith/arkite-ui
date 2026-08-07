import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

/**
 * Smoke test for the init CLI. The install list once silently referenced
 * the pre-rename package name for a month — this pins the CLI's actual
 * behavior: right packages, right files, right contents. `--dry-run`
 * skips the network install; everything else runs for real in a temp dir.
 */

const CLI = resolve(__dirname, '../../cli/init.mjs')

describe('init CLI (smoke)', () => {
  let dir: string
  let output: string

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'arkite-init-'))
    output = execFileSync('node', [CLI, 'init', '--dry-run', '--pm', 'pnpm'], {
      cwd: dir,
      encoding: 'utf-8',
    })
  })

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('installs the current package name and required peers', () => {
    expect(output).toContain('pnpm add')
    expect(output).toContain('@arkite-ui/core')
    expect(output).toContain('zustand')
    expect(output).toContain('lucide-react')
    expect(output).toContain('tailwindcss@^4')
    expect(output).not.toContain('@arkite/ui')
  })

  it('writes the theme CSS importing the current package', () => {
    const css = readFileSync(join(dir, 'src/styles/arkite.css'), 'utf-8')
    expect(css).toContain('@import "tailwindcss"')
    expect(css).toContain('@import "@arkite-ui/core/styles.css"')
    expect(css).not.toContain('@arkite/ui')
  })

  it('writes the theme setup helper importing the current package', () => {
    const theme = readFileSync(join(dir, 'src/lib/theme.ts'), 'utf-8')
    expect(theme).toContain("from '@arkite-ui/core'")
    expect(theme).toContain('createTheme')
    expect(theme).not.toContain('@arkite/ui')
  })

  it('is idempotent — a second run skips existing files and still exits 0', () => {
    const second = execFileSync('node', [CLI, 'init', '--dry-run', '--pm', 'pnpm'], {
      cwd: dir,
      encoding: 'utf-8',
    })
    expect(second).toContain('already exists, skipping')
    expect(existsSync(join(dir, 'src/styles/arkite.css'))).toBe(true)
  })

  it('prints help and exits 0 for unknown commands', () => {
    const help = execFileSync('node', [CLI], { cwd: dir, encoding: 'utf-8' })
    expect(help).toContain('@arkite-ui/core CLI')
    expect(help).toContain('init')
  })
})
