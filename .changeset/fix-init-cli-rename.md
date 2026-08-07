---
"@arkite-ui/core": patch
---

`npx @arkite-ui/core init` works again — the CLI's install list still referenced the pre-rename `@arkite/ui` package, so it has been broken since the rename. All docs now use the correct package name, and install guides lead with the one-shot `init` (installs peer deps + writes the Tailwind v4 theme CSS) instead of implying the package is a zero-dependency drop-in.
