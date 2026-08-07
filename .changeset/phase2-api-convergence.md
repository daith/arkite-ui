---
"@arkite-ui/core": minor
---

1.0 audit phase 2 — API convergence. Renamed APIs keep the old name as a deprecated alias (dev-only warning, removed in v1.0) unless noted:

- **Toast unified**: one store, one container, one shape. `useToast()` and the imperative `toast.*` are now identical — `success(title, options?)`, `dismiss(id)`, `dismissAll()`, default position `top-right` everywhere, `MAX_TOASTS` applies to every path, and `toast.loading()` actually shows a spinner and persists until dismissed. Old forms (`success(title, description)`, `clear()`, `ImperativeToastContainer`) still work with warnings.
- **DataTable**: `renderExpandedRow(row, i)` replaces function-valued `expandable` (deprecated); fully controllable now — `sortState`/`onSortChange`, `filters`, `page` (1-based)/`onPageChange`, `defaultSelectedRows` — enabling server-side sorting, filtering, and pagination.
- **Tree**: `onSelectionChange` replaces `onCheckChange` (deprecated alias); `defaultSelectedKey` added.
- **Pagination**: `variant` replaces `mode` (deprecated alias). **Timeline**: gray `default` renamed `muted` (alias kept), new `info` variant.
- **TenantSwitcher**: `value`/`onChange` replace `currentTenant`/`onSelect` (deprecated aliases).
- **Pickers**: `DatePicker.clearable` finally works (clear button, was a dead prop); DatePicker/DateRangePicker/Combobox/SheetSelect gain controlled `open`/`defaultOpen`/`onOpenChange`; `defaultValue` added across ColorPicker, Combobox, DatePicker, DateRangePicker, SegmentedControl, SheetSelect, ViewToggle, Calendar (+`defaultMonth`); DateRangePicker gains the standard `value`/`onChange(range)` contract alongside the per-field callbacks.
- **DESIGN.md**: conventions updated to match reality — Radix passthrough and trigger-anchored `open/onOpenChange` exceptions, size baseline wording, collection-prop rules (`data` vs `items`), `path`/`href` layering, def-object short names.

**Breaking without alias** (see the nav changeset for migration): `Breadcrumb.renderLink` now takes `({ href, children, className, active })` and only runs for items with `href`; the `BreadcrumbItem` name moved from the data type (now `BreadcrumbItemData`) to the component.
