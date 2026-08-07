---
"@arkite-ui/core": patch
---

`@arkite-ui/core/tokens` and `@arkite-ui/core/tailwind` are now server-safe: the build no longer stamps `"use client"` on these pure-data entries, so Server Components can `import { colors } from '@arkite-ui/core/tokens'` and get real values instead of client references. Caught by the new Next.js App Router smoke test, which now runs in CI: `next build` + Chromium checks for hydration mismatches and post-hydration interactivity on every merge request.
