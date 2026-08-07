---
"@arkite-ui/core": minor
---

Code-review hardening for the v1.0 groundwork:

- **DataTable server mode**: new `onPageSizeChange` prop — in server mode (`totalRows`) the rows-per-page selector now only renders when it is provided; column filters only render when `filters`/`onFilterChange` are controlled and the column provides `filterOptions`; the pagination footer no longer renders while `data` is empty; a dev-only warning fires when `totalRows` is used without a controlled `page`.
- **FilterSelect**: no longer sets `aria-label` when the consumer provides their own accessible name (`id` for a native `<label htmlFor>`, or `aria-labelledby`).
- **v1.0 codemod**: `expandable` identifiers are classified via the type checker (boolean identifiers stay, only callable values migrate to `renderExpandedRow`, unresolvable ones get a TODO); toast rewrites match by symbol binding instead of identifier text, so same-named non-arkite objects are never touched; the glob fallback scans the whole project instead of only `src/`.
- **Build/CI**: `dist` is cleaned before tsup runs instead of via a racing per-config `clean`; playwright CI jobs use a separate node_modules cache key from the alpine jobs.
