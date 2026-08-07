---
"@arkite-ui/core": patch
---

`init` CLI: the install list now includes `zustand` (a required peer that was missing — store-backed components like toast broke on fresh setups), and a `--dry-run` flag skips the install step while still writing files, used by the new CI smoke test that keeps the CLI from silently breaking again.
