---
"@arkite-ui/core": minor
---

DX-audit fixes: AdminLayout injection points, Table frozen lead column, Table/DataTable selection guidance.

- **AdminLayout**: new `classNames` prop (`root`/`sidebar`/`navbar`/`subNav`/`main`) — the supported way to restyle internal regions instead of global CSS targeting internal DOM; `hideSidebar` / `hideNavbar` (`true` removes, `'mobile'` hides below the `md` breakpoint) for mobile layouts.
- **Table**: `stickyLead` on `TableHead`/`TableCell` freezes the lead column during horizontal scroll (symmetric to the existing `stickyAction`); new `shadow-sticky-right` token.
- **DESIGN.md**: the `Table` family gets its own inventory entry (read-only lists included) plus an explicit Table-vs-DataTable decision rule — the audited root cause of consumers hand-rolling raw `<table>` with hardcoded palette classes. Regenerated into `llms.txt`/`llms-full.txt`.
