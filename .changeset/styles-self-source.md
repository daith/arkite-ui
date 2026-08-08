---
"@arkite-ui/core": patch
---

`styles.css` now declares `@source "../../dist"` itself, so Tailwind v4 consumers no longer need the manual `@source "../node_modules/@arkite-ui/core/dist"` line (which every project had to discover the hard way — without it, all component utilities silently fail to generate and pages render unstyled). Existing manual `@source` lines keep working and can be removed.
