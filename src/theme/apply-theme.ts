import type { ThemePreset, ThemeTokens } from './presets'

/**
 * Apply a theme preset's CSS variables to a DOM element.
 * Applies light tokens to the element and dark tokens to `.dark` selector.
 *
 * @param theme - Theme preset to apply
 * @param element - Target element (defaults to document.documentElement)
 */
export function applyTheme(theme: ThemePreset, element?: HTMLElement): void {
  const target = element ?? document.documentElement
  applyTokens(target, theme.light)
}

/**
 * Apply dark mode tokens to an element.
 *
 * @param theme - Theme preset to apply
 * @param element - Target element (defaults to document.documentElement)
 */
export function applyDarkTheme(theme: ThemePreset, element?: HTMLElement): void {
  const target = element ?? document.documentElement
  applyTokens(target, theme.dark)
}

function applyTokens(element: HTMLElement, tokens: ThemeTokens): void {
  for (const [key, value] of Object.entries(tokens)) {
    element.style.setProperty(`--${key}`, value)
  }
}

/**
 * Generate a CSS string from a theme preset.
 * Useful for SSR or injecting into a <style> tag.
 *
 * @example
 * ```ts
 * const css = themeToCSS(myTheme)
 * // Returns:
 * // :root { --primary: 250 100% 65%; ... }
 * // .dark { --primary: 250 100% 70%; ... }
 * ```
 */
export function themeToCSS(theme: ThemePreset, selector = ':root'): string {
  const lightVars = Object.entries(theme.light)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')

  const darkVars = Object.entries(theme.dark)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')

  return `${selector} {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}`
}
