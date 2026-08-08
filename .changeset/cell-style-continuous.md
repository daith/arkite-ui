---
"@arkite-ui/core": minor
---

`Column.cellStyle` / `Column.headerStyle` — inline styles for what class strings can't express. `cellClassName` covers discrete/binary cell grading, but continuous values (heatmap alpha computed from the row at runtime) need real inline styles: class strings have a fixed vocabulary and Tailwind can't compile runtime-generated arbitrary values. `cellStyle` takes `CSSProperties` or `(row, index) => CSSProperties`; `headerStyle` merges with the column `width` (e.g. `writingMode: 'vertical-rl'` for rotated matrix headers). Unblocks the four continuous-scale heatmap tables from ark-finance's migration.
