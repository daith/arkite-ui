import { defineConfig, type Options } from 'tsup'

const shared: Partial<Options> = {
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    'zustand',
    'lucide-react',
    'framer-motion',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-tooltip',
    '@tanstack/react-virtual',
    'cmdk',
  ],
}

export default defineConfig([
  // Component entries — RSC client modules, so they carry the banner.
  {
    ...shared,
    entry: {
      index: 'src/index.ts',
      motion: 'src/motion.ts',
    },
    clean: true,
    banner: { js: '"use client";' },
  },
  // Pure-data entries — server-safe by design. A "use client" banner here
  // would turn token values into client references and break Server
  // Component imports (`import { colors } from '@arkite-ui/core/tokens'`).
  {
    ...shared,
    entry: {
      'tailwind-preset': 'src/tailwind-preset.ts',
      tokens: 'src/tokens/index.ts',
    },
    clean: false,
  },
])
