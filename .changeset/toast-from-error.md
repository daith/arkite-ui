---
"@arkite-ui/core": minor
---

`toast.fromError(err, { prefix })` — one-line error toasts for `catch` blocks.

Renders a destructive toast with `prefix` as the title and the parsed error message as the description. Error parsing stays in the app layer: register it once at startup with `toast.configure({ formatError: getErrorMessage })` (module-level by design, so the imperative `toast` keeps working outside React). Unconfigured, only zero-knowledge fallbacks apply (`Error#message`, plain strings); when no message can be derived the prefix alone is shown — this API never invents copy, keeping it out of the locale system. A throwing formatter falls back instead of crashing. Also available on `useToast()`. Deliberately out of scope: error reporting/logging hooks and burst dedupe.
