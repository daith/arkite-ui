---
"@arkite-ui/core": patch
---

All built-in color pairs now meet WCAG AA (4.5:1), enforced by regression tests. Visible changes to note: dark-mode `info` (all presets) and ocean/forest dark-mode `primary` switch from white to black text; ocean/forest light-mode `primary` darkens one step (50%→45% / 38%→33%); light `info` and dark `destructive` get imperceptible lightness nudges. Cross-platform JS tokens (`/tokens`): light `mutedForeground` gray-500→gray-600, dark on-color foregrounds unified to gray-950.
