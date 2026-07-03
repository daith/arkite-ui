---
'@arkite-ui/core': minor
---

Every visual property now flows through design tokens — groundwork for future style presets (`[data-style]` theming). No API changes.

New tokens (also in `/tokens` entry, all theme presets, and the Tailwind preset):

- `--info` / `--info-foreground` — the previously missing info status color
- Soft layer per status (`success`/`warning`/`destructive`/`info`): `--{status}-soft`, `--{status}-soft-foreground`, `--{status}-border` → utilities like `bg-success-soft`
- `--text-2xs` (10px) micro text size
- `--shadow-sticky-left` / `--shadow-sticky-header` for Table sticky columns/header

Component migration: Alert, Toast, Badge, Stat, CopyButton, ImageUpload, Kbd, TenantSwitcher, CommandPalette, TagInput, AdminLayout, Table no longer use raw Tailwind palette classes or arbitrary values — semantic tokens handle light/dark automatically. Visual parity preserved (known minor deltas: Badge `info` is one shade paler to share the soft layer; Badge md text 13px→14px; AdminLayout rail labels 11px→12px).
