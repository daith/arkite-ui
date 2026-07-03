import { describe, expect, it } from 'vitest'
import {
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  primitives,
  radius,
  spacing,
} from './index'

describe('primitives', () => {
  it('exposes white and black', () => {
    expect(primitives.white).toBe('#ffffff')
    expect(primitives.black).toBe('#000000')
  })

  it('has the seven palettes we committed to', () => {
    const palettes = Object.keys(primitives).filter(
      (k) => k !== 'white' && k !== 'black',
    )
    expect(palettes.sort()).toEqual(
      ['amber', 'blue', 'gray', 'green', 'purple', 'red', 'teal'].sort(),
    )
  })

  it('every palette has all 11 shades (50..950)', () => {
    const expectedShades = [
      '50', '100', '200', '300', '400', '500',
      '600', '700', '800', '900', '950',
    ]
    for (const [name, palette] of Object.entries(primitives)) {
      if (name === 'white' || name === 'black') continue
      expect(Object.keys(palette).sort()).toEqual(expectedShades.sort())
    }
  })

  it('every shade is a valid hex color', () => {
    const hexRegex = /^#[0-9a-f]{6}$/
    for (const [name, palette] of Object.entries(primitives)) {
      if (name === 'white' || name === 'black') continue
      for (const [shade, value] of Object.entries(palette)) {
        expect(value, `${name}.${shade}`).toMatch(hexRegex)
      }
    }
  })
})

describe('semantic colors', () => {
  it('exposes light and dark variants', () => {
    expect(Object.keys(colors).sort()).toEqual(['dark', 'light'])
  })

  it('light and dark have identical key sets', () => {
    expect(Object.keys(colors.light).sort()).toEqual(
      Object.keys(colors.dark).sort(),
    )
  })

  it('all values resolve to hex colors', () => {
    const hexRegex = /^#[0-9a-f]{6}$/
    for (const scheme of ['light', 'dark'] as const) {
      for (const [key, value] of Object.entries(colors[scheme])) {
        expect(value, `${scheme}.${key}`).toMatch(hexRegex)
      }
    }
  })

  it('semantic tokens derive from primitives (no orphan hex)', () => {
    // Build a flat set of every primitive value
    const allPrimitives = new Set<string>([primitives.white, primitives.black])
    for (const [name, palette] of Object.entries(primitives)) {
      if (name === 'white' || name === 'black') continue
      for (const value of Object.values(palette)) {
        allPrimitives.add(value)
      }
    }

    for (const scheme of ['light', 'dark'] as const) {
      for (const [key, value] of Object.entries(colors[scheme])) {
        expect(
          allPrimitives.has(value),
          `colors.${scheme}.${key} = ${value} is not in the primitive scale`,
        ).toBe(true)
      }
    }
  })

  it('success maps to green, danger to red, info to blue, warning to amber', () => {
    expect(colors.light.success).toBe(primitives.green[600])
    expect(colors.light.danger).toBe(primitives.red[600])
    expect(colors.light.info).toBe(primitives.blue[600])
    expect(colors.light.warning).toBe(primitives.amber[500])
  })

  it('soft layers use pale shades in light and deep shades in dark', () => {
    // Light: 50 bg / 800 text / 200 border
    expect(colors.light.successSoft).toBe(primitives.green[50])
    expect(colors.light.successSoftForeground).toBe(primitives.green[800])
    expect(colors.light.successBorder).toBe(primitives.green[200])
    expect(colors.light.warningSoft).toBe(primitives.amber[50])
    expect(colors.light.dangerSoft).toBe(primitives.red[50])
    expect(colors.light.infoSoft).toBe(primitives.blue[50])

    // Dark: 950 bg / 200 text / 900 border
    expect(colors.dark.successSoft).toBe(primitives.green[950])
    expect(colors.dark.successSoftForeground).toBe(primitives.green[200])
    expect(colors.dark.successBorder).toBe(primitives.green[900])
    expect(colors.dark.warningSoft).toBe(primitives.amber[950])
    expect(colors.dark.dangerSoft).toBe(primitives.red[950])
    expect(colors.dark.infoSoft).toBe(primitives.blue[950])
  })
})

describe('spacing', () => {
  it('uses Tailwind 4px base unit', () => {
    expect(spacing[1]).toBe(4)
    expect(spacing[2]).toBe(8)
    expect(spacing[4]).toBe(16)
    expect(spacing[8]).toBe(32)
  })

  it('zero is zero, px is one', () => {
    expect(spacing[0]).toBe(0)
    expect(spacing.px).toBe(1)
  })
})

describe('radius', () => {
  it('full is large enough for pills', () => {
    expect(radius.full).toBeGreaterThanOrEqual(9999)
  })

  it('none is zero', () => {
    expect(radius.none).toBe(0)
  })
})

describe('typography', () => {
  it('base font size is 16', () => {
    expect(fontSize.base).toBe(16)
  })

  it('weights are string literals (RN-compatible)', () => {
    expect(fontWeight.normal).toBe('400')
    expect(fontWeight.bold).toBe('700')
  })

  it('line heights are unitless multipliers', () => {
    expect(lineHeight.normal).toBe(1.5)
    expect(lineHeight.tight).toBeLessThan(lineHeight.normal)
  })
})
