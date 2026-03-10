import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/motion.ts', 'src/tailwind-preset.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
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
  banner: {
    js: '"use client";',
  },
})
