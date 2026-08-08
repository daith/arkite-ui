---
"@arkite-ui/core": minor
---

Table/DataTable fixes from ark-finance migration testing (previously `compact`/`hoverable`/`striped` were dead props and dense tables were unusable):

- **`compact`, `hoverable`, `variant="striped"` now actually work** — the data-attributes are wired to CSS. `compact` tightens cells to `px-3 py-2` (header `h-8`), `striped` zebra-stripes body rows, and row hover is now **opt-in via `hoverable`** instead of always-on (DataTable passes `hoverable` itself, so its visuals are unchanged; bare `Table` users add `hoverable` to keep the old hover).
- **Row separators render again** — the table is `border-separate` (required for cross-browser sticky headers), where `<tr>` borders never paint. Separators moved to the cells (`TableCell`/`TableHead` `border-b`, footer `[&_td]:border-t`), last body row exempt.
- **`DataTable compact`** — density passthrough, and **`rowClassName`** (string or `(row, index) => string`) for conditional row styling such as dimming disabled rows.
- `pagination` and other boolean props now document their defaults (`pagination` defaults to **true** — hide it when paginating outside).
