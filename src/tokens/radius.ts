/**
 * Border radius scale.
 *
 * Pixel values for cross-platform use. Web consumers can pair these with
 * the existing CSS variable system; React Native consumers use the numbers
 * directly in StyleSheet.
 */
export const radius = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const

export type RadiusKey = keyof typeof radius
