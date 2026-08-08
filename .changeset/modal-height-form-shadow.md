---
"@arkite-ui/core": minor
---

Modal fixes from ark-finance's modal audit (4 hand-rolled modals traced to these gaps):

- **Height cap + scrollable body** — the panel now caps at `calc(100vh-2rem)` and the body scrolls. Previously long content grew past the viewport while the body scroll-lock made the page unscrollable, forcing every consumer to hand-roll `max-h-[85vh] overflow-y-auto`. Those workarounds can be removed.
- **`onSubmit`** — wraps header/body/footer in a real `<form>`, so a `type="submit"` button in `footer` submits the fields in `children` (the most common admin dialog) with no `form="<id>"` plumbing. New `FormDialog` and `LongContent` stories document both.
- **Shadowing guard in the shared ESLint config** — a local declaration named `Modal`/`Card`/`Table`/… (24 collision-prone core names) now warns: shadowing makes the library component unimportable in that file and reliably leads to re-implementation.
