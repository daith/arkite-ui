---
"@arkite-ui/core": patch
---

`Table` row hover is back on by default. 0.14.0 made hover opt-in via `hoverable`, which silently removed row hover from every existing bare `Table` usage on upgrade. `hoverable` now defaults to **true** (pass `hoverable={false}` to disable), restoring the pre-0.14 visual behavior while keeping the prop functional. Also fixed: explicit `hoverable={false}` / `compact={false}` used to render `data-*="false"`, which the presence-based CSS selectors still matched.
