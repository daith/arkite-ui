---
'@arkite-ui/core': minor
---

Sparkline: accept `data: number[] | null | undefined` and add `placeholder?: boolean | ReactNode` — with fewer than 2 points, `true` draws a dashed neutral line (`text-border`, dark-mode aware) and a ReactNode replaces the output entirely. Without `placeholder`, behavior is unchanged (empty renders nothing, single point renders a dot). Closes the gap that kept ark-finance on a local wrapper.
