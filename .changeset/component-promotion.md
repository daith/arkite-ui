---
'@arkite-ui/core': minor
---

Promote consumer-proven components into the library and close the gaps that caused local rebuilds (see docs/COMPONENT_COVERAGE.md). All additive — no breaking changes.

New components:

- **Sparkline** — dependency-free SVG mini trend chart (`data`, `trend: 'auto' | 'up' | 'down' | 'neutral'`, `color` override, safe with empty/single/flat data). Generalized from ark-finance.
- **SheetSelect** — mobile-friendly bottom-sheet select built on Drawer (`options` with description/disabled, `error`/`errorMessage`, `renderOption`, 44px+ touch targets, grab handle). Generalized from ark-museum.

Enhancements:

- **Badge**: new `count` variant — neutral gray pill with `tabular-nums`, composes with `max`
- **PageHeader**: new `size: 'sm' | 'md' | 'lg'` (default `md` unchanged)
- **Card**: new `density: 'default' | 'compact'` on Card (context-provided to CardHeader/CardContent/CardFooter, per-component override supported) and `CardHeader.actions` slot for icon-button rows — dashboard-widget ergonomics
- **LoadingOverlay**: new `fullscreen` mode (fixed, backdrop-blur, centered panel)
