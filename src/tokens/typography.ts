/**
 * Typography scale — font sizes, line heights, font weights.
 *
 * Sizes are in pixels (number) for direct React Native compatibility.
 * Line heights are unitless multipliers (relative to font size).
 *
 * @example
 * ```ts
 * import { fontSize, lineHeight, fontWeight } from '@arkite-ui/core/tokens'
 *
 * StyleSheet.create({
 *   title: {
 *     fontSize: fontSize.xl,
 *     lineHeight: fontSize.xl * lineHeight.tight,
 *     fontWeight: fontWeight.semibold,
 *   },
 * })
 * ```
 */

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const

export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const

/**
 * Font weights as strings — RN accepts these literal values directly,
 * and they're valid in CSS.
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export type FontSizeKey = keyof typeof fontSize
export type LineHeightKey = keyof typeof lineHeight
export type FontWeightKey = keyof typeof fontWeight
