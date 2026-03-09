import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/tailwind-preset.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'zustand', 'lucide-react', 'framer-motion'],
  banner: {
    js: '"use client";',
  },
})
