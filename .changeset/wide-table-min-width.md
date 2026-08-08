---
'@arkite-ui/core': minor
---

Wide tables, sticky headers, and header-less cards — fixes for three layout traps found in an ark-finance audit (49 DataTable call sites).

**`Table` / `DataTable` gain `minWidth`.** A table is `width: 100%` with auto layout, so when columns don't fit the browser squeezes each to its *min-content* width before it overflows. For CJK headers min-content is one glyph, so dense Chinese tables collapsed to ~30px columns with 4-line headers (measured in Chromium: header row 119px vs 34px) instead of scrolling — and `Column.pinned` never engaged, because the table technically "fit". `minWidth` is the floor that makes wide tables scroll; `Column.width` was only ever a hint to the layout algorithm.

**`stickyHeader` now actually sticks.** `DataTable` wrapped `Table`'s own scroll container in a second `overflow-auto` box carrying `maxHeight`. Nested scrollports make the header stick to the inner box — which never scrolls vertically — so it scrolled away with the rows (verified: header offset 0 → -300px after a 300px scroll). The height limit and `overflow` now live on the same element. `Table` takes `maxHeight` directly, plus `wrapperClassName` / `wrapperProps` so the scroll region can carry its own a11y attributes instead of needing a hand-rolled wrapper.

**New `ScrollFade`.** Horizontal scroll container with edge fades driven by real scroll state, shown only on the side where content is hidden. Retires the hand-written four-layer-gradient CSS consumers were copying for pill rows and tab strips; it paints with `foreground` at low alpha, so it needs no surface color and works unchanged on `background` / `card` / `muted`. `Table` turns it on automatically when `minWidth` is set (`scrollFade={false}` opts out).

**`CardContent` / `CardFooter` keep their top padding when they are the Card's first child.** `pt-0` was unconditional — correct under a `CardHeader`, but a header-less Card (a DataTable or list as the whole body) put the content flush against the top border while the other three sides stayed inset. Now scoped to `:not(:first-child)`; Cards with a header are unchanged.

`DESIGN.md` gains the wide-table rule, "don't wrap `DataTable` in a `Card`" (it already draws its own bordered surface), and where `stickyHeader` needs its height limit.
