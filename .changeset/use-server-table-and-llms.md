---
"@arkite-ui/core": minor
---

DX: server-table state hook and AI-readable docs.

- **`useServerTable()`** — pure state helper for `<DataTable>` server-side mode. Owns the six controlled props (`page`/`onPageChange`, `onPageSizeChange`, `sortState`/`onSortChange`, `filters`/`onFilterChange`) and exposes them pre-wired via `props`; the consumer supplies `data` + `totalRows` and fetches on `queryKey`. Sort/filter/page-size changes reset to page 1.
- **`llms.txt` / `llms-full.txt`** — generated from DESIGN.md and the public API snapshot (`pnpm run generate:llms`, part of `build`) and shipped in the npm package, so AI coding agents get the setup, design rules, core patterns, and full typed API without reading source.
