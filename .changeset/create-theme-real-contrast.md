---
"@arkite-ui/core": patch
---

`createTheme()` now picks black/white foregrounds by real WCAG contrast instead of an L>55% lightness heuristic, and computes dark-mode foregrounds instead of hardcoding white — every generated pair is guaranteed ≥4.5:1 for any brand color. Behavior change: themes built from mid-luminance brand colors (e.g. `hsl(210 100% 50%)` blues) may flip their button text between white and black.
