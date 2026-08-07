---
"@arkite-ui/core": minor
---

Six end-to-end **Recipes** land in Storybook (CRUD List Page, Form Page, Server-Side Table, Dashboard, Tenant Admin Shell, Detail + Drawer Edit) — each a complete, copyable page whose live demo and code sample share one source file. Building them surfaced and fixed four component gaps:

- **DataTable `totalRows`**: controlled `page` alone still sliced client-side, so true server-side pagination was impossible — a server returning one page of rows rendered an empty table past page 1. With `totalRows` set, `data` is treated as the already-processed current page and pagination math comes from the total.
- **CardHeader `headingLevel`**: the title was hardcoded `<h3>`, tripping axe heading-order under a `PageHeader` `<h1>`; now configurable (default unchanged).
- **FilterSelect**: the `label` prop now doubles as the select's accessible name (axe flagged the unnamed `<select>`).
- **Form**: props now extend `FormHTMLAttributes`, so `noValidate`/`autoComplete`/`action` type-check.
