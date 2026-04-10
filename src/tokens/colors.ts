/**
 * Semantic color tokens — derived from primitive scales.
 *
 * These are the **public API** for cross-platform consumers (React Native,
 * vanilla JS, design tools). Each token carries meaning, not appearance.
 *
 * Why two variants (light/dark) instead of CSS variables?
 *   React Native and other non-DOM environments cannot resolve CSS variables
 *   at runtime. Consumers must pick a variant explicitly, typically based on
 *   a runtime appearance hook (e.g. `useColorScheme()` in RN).
 *
 * @example
 * ```ts
 * import { colors } from '@arkite/ui/tokens'
 * import { useColorScheme } from 'react-native'
 *
 * const scheme = useColorScheme() ?? 'light'
 * const styles = StyleSheet.create({
 *   button: { backgroundColor: colors[scheme].success },
 * })
 * ```
 */

import { primitives } from './primitives'

export interface SemanticColors {
  // Surfaces
  background: string
  foreground: string
  card: string
  cardForeground: string
  muted: string
  mutedForeground: string

  // Brand
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string

  // Status
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  danger: string
  dangerForeground: string
  info: string
  infoForeground: string

  // Form / interaction
  border: string
  input: string
  ring: string
}

const lightColors: SemanticColors = {
  // Surfaces
  background: primitives.white,
  foreground: primitives.gray[900],
  card: primitives.white,
  cardForeground: primitives.gray[900],
  muted: primitives.gray[100],
  mutedForeground: primitives.gray[500],

  // Brand
  primary: primitives.purple[600],
  primaryForeground: primitives.white,
  secondary: primitives.gray[100],
  secondaryForeground: primitives.gray[700],
  accent: primitives.teal[500],
  accentForeground: primitives.white,

  // Status
  success: primitives.green[600],
  successForeground: primitives.white,
  warning: primitives.amber[500],
  warningForeground: primitives.gray[900],
  danger: primitives.red[600],
  dangerForeground: primitives.white,
  info: primitives.blue[600],
  infoForeground: primitives.white,

  // Form / interaction
  border: primitives.gray[200],
  input: primitives.gray[200],
  ring: primitives.purple[600],
}

const darkColors: SemanticColors = {
  // Surfaces
  background: primitives.gray[950],
  foreground: primitives.gray[50],
  card: primitives.gray[900],
  cardForeground: primitives.gray[50],
  muted: primitives.gray[800],
  mutedForeground: primitives.gray[400],

  // Brand
  primary: primitives.purple[500],
  primaryForeground: primitives.white,
  secondary: primitives.gray[800],
  secondaryForeground: primitives.gray[100],
  accent: primitives.teal[400],
  accentForeground: primitives.gray[900],

  // Status
  success: primitives.green[500],
  successForeground: primitives.gray[900],
  warning: primitives.amber[400],
  warningForeground: primitives.gray[900],
  danger: primitives.red[500],
  dangerForeground: primitives.white,
  info: primitives.blue[500],
  infoForeground: primitives.white,

  // Form / interaction
  border: primitives.gray[800],
  input: primitives.gray[800],
  ring: primitives.purple[500],
}

export const colors = {
  light: lightColors,
  dark: darkColors,
} as const

export type ColorScheme = keyof typeof colors
export type SemanticColorName = keyof SemanticColors
