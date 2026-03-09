/**
 * Built-in theme presets for Arkite UI.
 *
 * Each preset defines CSS variable values (HSL format without the hsl() wrapper).
 * Apply by calling `applyTheme(preset)` or import the CSS directly.
 */

export interface ThemeTokens {
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  accent: string
  'accent-foreground': string
  success: string
  'success-foreground': string
  warning: string
  'warning-foreground': string
  destructive: string
  'destructive-foreground': string
  background: string
  foreground: string
  muted: string
  'muted-foreground': string
  card: string
  'card-foreground': string
  border: string
  input: string
  ring: string
  radius: string
}

export interface ThemePreset {
  name: string
  light: ThemeTokens
  dark: ThemeTokens
}

// --- Default (Stripe-inspired purple) ---
export const defaultTheme: ThemePreset = {
  name: 'default',
  light: {
    primary: '250 100% 65%',
    'primary-foreground': '0 0% 100%',
    secondary: '220 14% 96%',
    'secondary-foreground': '220 15% 20%',
    accent: '168 80% 45%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 42%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 50%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 51%',
    'destructive-foreground': '0 0% 100%',
    background: '0 0% 100%',
    foreground: '220 15% 20%',
    muted: '220 14% 96%',
    'muted-foreground': '220 9% 46%',
    card: '0 0% 100%',
    'card-foreground': '220 15% 20%',
    border: '220 13% 91%',
    input: '220 13% 91%',
    ring: '250 100% 65%',
    radius: '0.5rem',
  },
  dark: {
    primary: '250 100% 70%',
    'primary-foreground': '0 0% 100%',
    secondary: '220 15% 18%',
    'secondary-foreground': '0 0% 95%',
    accent: '168 80% 50%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 50%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 55%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 55%',
    'destructive-foreground': '0 0% 100%',
    background: '220 20% 10%',
    foreground: '0 0% 95%',
    muted: '220 15% 18%',
    'muted-foreground': '220 9% 60%',
    card: '220 18% 13%',
    'card-foreground': '0 0% 95%',
    border: '220 15% 22%',
    input: '220 15% 22%',
    ring: '250 100% 70%',
    radius: '0.5rem',
  },
}

// --- Neutral (Zinc/Slate monochrome) ---
export const neutralTheme: ThemePreset = {
  name: 'neutral',
  light: {
    primary: '220 9% 20%',
    'primary-foreground': '0 0% 100%',
    secondary: '220 14% 96%',
    'secondary-foreground': '220 15% 20%',
    accent: '220 9% 46%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 42%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 50%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 51%',
    'destructive-foreground': '0 0% 100%',
    background: '0 0% 100%',
    foreground: '220 15% 15%',
    muted: '220 14% 96%',
    'muted-foreground': '220 9% 46%',
    card: '0 0% 100%',
    'card-foreground': '220 15% 15%',
    border: '220 13% 91%',
    input: '220 13% 91%',
    ring: '220 9% 20%',
    radius: '0.375rem',
  },
  dark: {
    primary: '0 0% 98%',
    'primary-foreground': '220 15% 10%',
    secondary: '220 15% 18%',
    'secondary-foreground': '0 0% 95%',
    accent: '220 9% 60%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 50%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 55%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 55%',
    'destructive-foreground': '0 0% 100%',
    background: '220 15% 8%',
    foreground: '0 0% 95%',
    muted: '220 15% 15%',
    'muted-foreground': '220 9% 55%',
    card: '220 15% 11%',
    'card-foreground': '0 0% 95%',
    border: '220 15% 20%',
    input: '220 15% 20%',
    ring: '0 0% 98%',
    radius: '0.375rem',
  },
}

// --- Ocean (Blue tones) ---
export const oceanTheme: ThemePreset = {
  name: 'ocean',
  light: {
    primary: '210 100% 50%',
    'primary-foreground': '0 0% 100%',
    secondary: '210 20% 96%',
    'secondary-foreground': '210 20% 20%',
    accent: '190 90% 45%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 42%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 50%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 51%',
    'destructive-foreground': '0 0% 100%',
    background: '210 20% 99%',
    foreground: '210 20% 15%',
    muted: '210 20% 96%',
    'muted-foreground': '210 12% 46%',
    card: '0 0% 100%',
    'card-foreground': '210 20% 15%',
    border: '210 18% 90%',
    input: '210 18% 90%',
    ring: '210 100% 50%',
    radius: '0.5rem',
  },
  dark: {
    primary: '210 100% 60%',
    'primary-foreground': '0 0% 100%',
    secondary: '210 20% 18%',
    'secondary-foreground': '0 0% 95%',
    accent: '190 90% 55%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 50%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 55%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 55%',
    'destructive-foreground': '0 0% 100%',
    background: '210 25% 8%',
    foreground: '0 0% 95%',
    muted: '210 20% 15%',
    'muted-foreground': '210 12% 55%',
    card: '210 22% 11%',
    'card-foreground': '0 0% 95%',
    border: '210 18% 20%',
    input: '210 18% 20%',
    ring: '210 100% 60%',
    radius: '0.5rem',
  },
}

// --- Forest (Green tones) ---
export const forestTheme: ThemePreset = {
  name: 'forest',
  light: {
    primary: '152 60% 38%',
    'primary-foreground': '0 0% 100%',
    secondary: '150 15% 96%',
    'secondary-foreground': '150 20% 20%',
    accent: '30 80% 55%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 42%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 50%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 51%',
    'destructive-foreground': '0 0% 100%',
    background: '150 10% 99%',
    foreground: '150 15% 15%',
    muted: '150 12% 95%',
    'muted-foreground': '150 8% 46%',
    card: '0 0% 100%',
    'card-foreground': '150 15% 15%',
    border: '150 12% 90%',
    input: '150 12% 90%',
    ring: '152 60% 38%',
    radius: '0.5rem',
  },
  dark: {
    primary: '152 60% 48%',
    'primary-foreground': '0 0% 100%',
    secondary: '150 15% 18%',
    'secondary-foreground': '0 0% 95%',
    accent: '30 80% 60%',
    'accent-foreground': '0 0% 100%',
    success: '145 65% 50%',
    'success-foreground': '0 0% 100%',
    warning: '38 92% 55%',
    'warning-foreground': '0 0% 0%',
    destructive: '0 72% 55%',
    'destructive-foreground': '0 0% 100%',
    background: '150 20% 8%',
    foreground: '0 0% 95%',
    muted: '150 15% 15%',
    'muted-foreground': '150 8% 55%',
    card: '150 18% 11%',
    'card-foreground': '0 0% 95%',
    border: '150 15% 20%',
    input: '150 15% 20%',
    ring: '152 60% 48%',
    radius: '0.5rem',
  },
}

/** All built-in theme presets */
export const themePresets = {
  default: defaultTheme,
  neutral: neutralTheme,
  ocean: oceanTheme,
  forest: forestTheme,
} as const

export type ThemePresetName = keyof typeof themePresets
