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
 * import { colors } from '@arkite-ui/core/tokens'
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

  // Status soft layer — pale background / readable text / pale border
  successSoft: string
  successSoftForeground: string
  successBorder: string
  warningSoft: string
  warningSoftForeground: string
  warningBorder: string
  dangerSoft: string
  dangerSoftForeground: string
  dangerBorder: string
  infoSoft: string
  infoSoftForeground: string
  infoBorder: string

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

  // Status soft layer
  successSoft: primitives.green[50],
  successSoftForeground: primitives.green[800],
  successBorder: primitives.green[200],
  warningSoft: primitives.amber[50],
  warningSoftForeground: primitives.amber[800],
  warningBorder: primitives.amber[200],
  dangerSoft: primitives.red[50],
  dangerSoftForeground: primitives.red[800],
  dangerBorder: primitives.red[200],
  infoSoft: primitives.blue[50],
  infoSoftForeground: primitives.blue[800],
  infoBorder: primitives.blue[200],

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

  // Status soft layer
  successSoft: primitives.green[950],
  successSoftForeground: primitives.green[200],
  successBorder: primitives.green[900],
  warningSoft: primitives.amber[950],
  warningSoftForeground: primitives.amber[200],
  warningBorder: primitives.amber[900],
  dangerSoft: primitives.red[950],
  dangerSoftForeground: primitives.red[200],
  dangerBorder: primitives.red[900],
  infoSoft: primitives.blue[950],
  infoSoftForeground: primitives.blue[200],
  infoBorder: primitives.blue[900],

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
