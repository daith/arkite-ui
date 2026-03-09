import { describe, it, expect } from 'vitest'
import { createTheme } from './create-theme'

describe('createTheme', () => {
  it('creates a theme from a primary color', () => {
    const theme = createTheme({ primary: '#FF6B00' })
    expect(theme.name).toBe('custom')
    expect(theme.light.primary).toMatch(/\d+ \d+% \d+%/)
    expect(theme.dark.primary).toMatch(/\d+ \d+% \d+%/)
  })

  it('uses custom name', () => {
    const theme = createTheme({ name: 'brand', primary: '#635BFF' })
    expect(theme.name).toBe('brand')
  })

  it('uses accent color when provided', () => {
    const theme = createTheme({ primary: '#FF6B00', accent: '#00B4D8' })
    expect(theme.light.accent).not.toBe(theme.light.primary)
    // Accent should be derived from the provided hex
    expect(theme.light.accent).toMatch(/\d+ \d+% \d+%/)
  })

  it('sets appropriate foreground for light primary', () => {
    // White-ish primary => dark foreground
    const theme = createTheme({ primary: '#FFFFFF' })
    expect(theme.light['primary-foreground']).toBe('0 0% 0%')
  })

  it('sets appropriate foreground for dark primary', () => {
    // Dark primary => light foreground
    const theme = createTheme({ primary: '#1a1a2e' })
    expect(theme.light['primary-foreground']).toBe('0 0% 100%')
  })

  it('sets custom radius', () => {
    const theme = createTheme({ primary: '#FF6B00', radius: '0.75rem' })
    expect(theme.light.radius).toBe('0.75rem')
    expect(theme.dark.radius).toBe('0.75rem')
  })

  it('dark mode has lighter primary than light mode', () => {
    const theme = createTheme({ primary: '#3B82F6' })
    const lightL = parseInt(theme.light.primary.split(' ')[2])
    const darkL = parseInt(theme.dark.primary.split(' ')[2])
    expect(darkL).toBeGreaterThanOrEqual(lightL)
  })

  it('preserves non-brand tokens from default theme', () => {
    const theme = createTheme({ primary: '#FF6B00' })
    // Success, warning, destructive should come from default
    expect(theme.light.success).toMatch(/145/)
    expect(theme.light.warning).toMatch(/38/)
    expect(theme.light.destructive).toMatch(/0 72%/)
  })
})
