---
"@arkite-ui/core": minor
---

1.0 Phase 2 — navigation group API unification. **BREAKING** (type-level and `Breadcrumb.renderLink`); runtime-renamed props keep deprecated aliases that warn in dev and are removed in v1.0.

- **BREAKING — `Breadcrumb.renderLink` signature.** Now the same object shape as `AdminLayout`: `renderLink({ href, children, className, active })`. It is only called for items with an `href` (`active` is true for the last item); items without one keep the default non-interactive rendering. No runtime alias is possible for a function signature — migrate directly:

  ```tsx
  // before
  <Breadcrumb items={items} renderLink={(item, isLast) => (
    <Link to={item.href ?? '#'}>{item.label}</Link>
  )} />

  // after
  <Breadcrumb items={items} renderLink={({ href, children, className, active }) => (
    <Link to={href} className={className} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  )} />
  ```

- **BREAKING — Breadcrumb type/component rename.** The `BreadcrumbItem` name now refers to the compound `<li>` component (formerly `BreadcrumbItemComponent`); the item data shape is `BreadcrumbItemData` (formerly the `BreadcrumbItem` interface). `BreadcrumbItemComponent` remains as a deprecated alias component that warns in dev. Migration: `import type { BreadcrumbItem }` (data) → `BreadcrumbItemData`; `<BreadcrumbItemComponent>` → `<BreadcrumbItem>`.

- **TenantSwitcher — bare-value contract.** `currentTenant` → `value`, `onSelect` → `onChange`. Old names still work as deprecated aliases (dev warning; new name wins when both are provided). `tenants` is unchanged.

- **NavbarBrand / NavbarLink — new `renderLink` prop** with the same `{ href, children, className, active }` shape, for router links (React Router, Next.js). Only used when `href` is set; without it the native `<a>` rendering is unchanged.

- **AdminLayout rail variant — `renderLink` support.** Groups with a `path` now render through `renderLink` (real links for the icon rail); groups without a `path`, or layouts without `renderLink`, keep the button + `onNavigate` behavior. The classic variant is unchanged.
