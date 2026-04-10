/**
 * Spacing scale — for margins, padding, gaps.
 *
 * Values are in pixels (number) so they work directly in React Native
 * StyleSheet and CSS-in-JS. On web, multiply by your base unit if needed.
 *
 * Scale follows Tailwind's default spacing where `1 = 0.25rem = 4px`.
 *
 * @example
 * ```ts
 * import { spacing } from '@arkite/ui/tokens'
 *
 * StyleSheet.create({
 *   card: { padding: spacing[4], gap: spacing[2] },
 * })
 * ```
 */
export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const

export type SpacingKey = keyof typeof spacing
