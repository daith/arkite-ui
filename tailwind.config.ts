import type { Config } from 'tailwindcss'
import arkitePreset from './src/tailwind-preset'

export default {
  presets: [arkitePreset],
  content: [
    './src/**/*.{ts,tsx}',
  ],
} satisfies Config
