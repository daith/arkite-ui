---
"@arkite-ui/core": patch
---

Keyboard accessibility fixes (wave 1 of the APG audit): Modal restores focus to its opener on close; CommandDialog focuses the search input on open; TagInput remove buttons are Tab-reachable (dropped `tabIndex={-1}`); DataTable exposes `aria-sort` on sorted headers, its filter and column-toggle dropdowns close on Escape, and rows with `onRowClick` are now focusable and activate with Enter/Space.
