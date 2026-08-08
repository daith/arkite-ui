---
"@arkite-ui/core": minor
---

ark-finance round-2 migration feedback — the remaining API gaps:

- **`FormField label` / `required`** — the prop DESIGN.md always documented now exists (renders a wired `FormLabel`); `FormLabelProps` extends `LabelHTMLAttributes` so `htmlFor` type-checks.
- **DataTable `onRowSelect(row, selected)`** — incremental companion to `onSelectionChange` for `toggle(id)`-style consumer code (fires once per actually-changed row, including select-all).
- **DataTable `isRowSelectable(row, index)`** — per-row disable: disabled checkbox, excluded from select-all and the header state.
- **DataTable `hoverable`** — passthrough to the underlying Table (default `true`).
- **`SkeletonTable columnWidths`** — match the real table's column widths so layout doesn't jump on swap-in.
- **`TableCell`/`TableHead` `align`** tolerates HTML's deprecated `justify`/`char` values (applies nothing) so markdown/third-party `td` mappings type-check.
- **`codemod:from-error` removes orphaned `getErrorMessage` imports** — previously left 32 files failing type-check.
- DESIGN.md: field-tested three-tier Table/DataTable/matrix selection rules, runtime-dynamic-columns and cross-row `cell(row, index)` notes.
