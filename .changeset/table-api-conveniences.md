---
"@arkite-ui/core": minor
---

Table API conveniences from the ark-finance feedback (feedback 1):

- **`TableCell`/`TableHead` `align`** (`'left' | 'center' | 'right'`) — replaces per-cell `text-right` repetition; rendered as classes, never the deprecated HTML `align` attribute.
- **`TableCell` `numeric`** — right-aligned `tabular-nums` for digit columns that must line up (financial tables).
- **`TableEmpty` / `TableLoading`** — full-width empty/loading rows for the Table family with automatic `colSpan` (measured from the header row; pass `colSpan` explicitly when columns change at runtime). Localized default copy.
- **`DataTable` `Column.pinned: 'left' | 'right'`** — frozen columns during horizontal scroll, wired to the Table family's `stickyLead`/`stickyAction`. Note: `'left'` pins at the table edge, so combine with `selectable`/expandable only when the leading utility columns may scroll under it.
