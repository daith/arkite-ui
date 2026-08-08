---
'@arkite-ui/core': minor
---

Add `FilterBarGroup` — a labelled cluster of filter controls ("Period: 1D 7D 30D").

Consumer evidence: an ark-finance audit found a hand-rolled `FilterGroup` (label span + flex row) plus a hand-styled `Pill` reimplementing `SegmentedControl`. The library left no way to express the shape — `FilterSelect`'s `label` only prefixes its "all" option ("Status: All"), which suits dropdowns but leaves preset toggles with nowhere to put a visible label. The hand-rolled version shipped without `flex-wrap` or `min-w-0`, so a single group's content width put a horizontal scrollbar on the whole page at phone widths, and its pills hardcoded `bg-slate-*` with `dark:` overrides — breaking two of DESIGN.md's hard rules.

`FilterBarGroup` renders the visible label, exposes an accessible `role="group"` name, and wraps at both levels. `FilterBarFilters` also gains `min-w-0` so its children can shrink instead of forcing the bar wider than its container (no visual change on its own).

New stories: `Preset groups` and `Preset groups (narrow viewport)`, showing the wrap behaviour that the hand-rolled shape lacked.
