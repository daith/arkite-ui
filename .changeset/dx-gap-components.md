---
"@arkite-ui/core": minor
---

DX-audit gap fillers — the components behind 30+ consumer lint bypasses and hand-rolled inputs:

- **`Button variant="link"`** — inline text-link appearance with button semantics (keeps the size's text scale, drops box dimensions). For real navigation keep using `<a>`.
- **`Card interactive`** — whole-card clickable with proper button semantics (`role`, `tabIndex`, Enter/Space activation only when the card itself is focused). Stays a `<div>` so inner interactive children keep working.
- **`FileTrigger`** — headless file-pick trigger: makes any element (thumbnail, icon, menu item) open the native picker; no wrapper element, no chrome. Completes the trio: `FileUpload` (dropzone) / `FileUploadButton` (styled button) / `FileTrigger` (headless).
- **`PinInput`** — OTP/verification-code input: per-character cells, auto-advance, Backspace/arrow navigation, paste distribution with filtering, `onComplete`, numeric/alphanumeric modes, `inputMode` + `one-time-code` autofill, localized cell labels.
- **`AdminLayout bottomNav`** — mobile bottom-navigation slot: fixed below `md` with safe-area padding built in; main content gets matching bottom padding. Pair with `hideSidebar="mobile"`.
