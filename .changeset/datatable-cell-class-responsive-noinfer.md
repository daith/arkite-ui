---
"@arkite-ui/core": minor
---

DataTable column-level styling and responsive gaps (ark-finance migration feedback, round 4):

- **`Column.cellClassName`** (string or `(row, index) => string`) and **`Column.headerClassName`** — per-column cell styling without negative-margin hacks (matrix cell backgrounds, selected-column highlights).
- **`Column.hidden: 'mobile' | 'desktop'`** — responsive column hiding in pure CSS (`max-md:hidden`/`md:hidden`), aligned with AdminLayout's `hideSidebar="mobile"` convention. SSR-safe: no JS breakpoint math, replaces `useMediaQuery`-into-`hidden` workarounds. `hidden: true` still removes the column entirely.
- **Inline `columns` now infer `T` from `data`** via `NoInfer`, so `cell`/`cellClassName` callbacks are fully typed without `<DataTable<Row>>` annotations. Note: with an empty-literal `data={[]}` and no annotation, `T` is no longer inferred from `columns` — annotate explicitly in that corner. Emitted types use `NoInfer` (TypeScript ≥ 5.4, or `skipLibCheck`).
