---
'@arkite-ui/core': minor
---

Remove app-specific business logic from the shared library:

- **BREAKING**: `getBreadcrumbItems`, `getSimpleBreadcrumbItems`, and `BreadcrumbConfigItem` are no longer exported. They hardcoded app-specific routes (`/sources`, `/companies`, `/webhooks`, ...). Copy the old `src/utils/breadcrumb.ts` into your app if needed — the `Breadcrumb` component itself is unchanged.
- Remove unexported dead code: `stores/authStore` (mock users), `stores/tenantStore`, `hooks/usePermission` (placeholder checks that always returned `true`), `hooks/useDataFetch` (use TanStack Query / SWR instead).
