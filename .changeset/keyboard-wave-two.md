---
"@arkite-ui/core": patch
---

Keyboard accessibility wave 2 — the remaining 22 APG audit gaps are closed:

- **Calendar / DatePicker**: full grid keyboard navigation (arrows move by day/week, Home/End to week edges, PageUp/PageDown by month with end-of-month clamping, month boundaries cross seamlessly), proper `grid`/`row`/`gridcell` semantics, and DatePicker now moves focus into the calendar on open, closes on Escape without selecting, and returns focus to its input.
- **Combobox**: real combobox semantics (`role="combobox"` trigger, `listbox`/`option` structure, `aria-activedescendant`) with the full keyboard selection model — ArrowDown opens, arrows move the highlight while focus stays in the search input, Enter selects, Tab closes.

Note for consumer tests: the Combobox trigger now carries `role="combobox"`, so testing-library queries must use `getByRole('combobox')` instead of `getByRole('button')` to find it.
