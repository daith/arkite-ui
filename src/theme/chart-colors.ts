/**
 * Chart color palette — CSS variable references for use with
 * Recharts, Nivo, Chart.js, or any charting library.
 *
 * Colors follow the theme system and adapt to light/dark mode.
 *
 * @example
 * ```tsx
 * import { chartColors } from '@arkite/ui'
 *
 * <BarChart data={data}>
 *   <Bar dataKey="revenue" fill={chartColors[1]} />
 *   <Bar dataKey="cost" fill={chartColors[2]} />
 * </BarChart>
 * ```
 */
export const chartColors = {
  1: 'hsl(var(--chart-1))',
  2: 'hsl(var(--chart-2))',
  3: 'hsl(var(--chart-3))',
  4: 'hsl(var(--chart-4))',
  5: 'hsl(var(--chart-5))',
} as const

/** Array form for iterating (e.g. mapping over datasets) */
export const chartColorList = [
  chartColors[1],
  chartColors[2],
  chartColors[3],
  chartColors[4],
  chartColors[5],
] as const

export type ChartColorKey = keyof typeof chartColors
