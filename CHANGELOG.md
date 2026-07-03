# Changelog

## 0.7.0
### Minor Changes

- 968fb76: Prop-naming consistency cleanup (see docs/API_CONSISTENCY.md). All old names keep working as deprecated aliases with a dev-mode console warning — they will be removed in v1.0, so this release is **non-breaking**; migrate at your own pace.
  
  Renames (old → new):
  
  - `Alert` / `Progress` / `CircularProgress` / `Toast`: `variant="error"` → `variant="destructive"` (the `toast.error()` convenience method stays and now produces the destructive variant)
  - `Alert`: `onDismiss` → `onClose`
  - `Tabs`: `onValueChange` → `onChange`
  - `LoadingOverlay`: `visible` → `open`
  - `CommandDialog`: `onOpenChange` → `onClose`
  - `CircularProgress`: `size` (number) → `diameter`
  - `FormField` / `FormMessage`: `error` (string) → `errorMessage`
  - `ImageUpload`: `error` (string) → `errorMessage` (+ `error` now also accepts a boolean state flag)
  - `Toggle` component name → prefer `Switch` (Toggle export is deprecated)
  
  Additions (non-breaking):
  
  - `errorMessage?: string` on Checkbox, Radio/RadioGroup, Combobox, DatePicker, DateRangePicker, ColorPicker, TagInput, Toggle/Switch — aligned with the Input family's `error` + `errorMessage` convention
  - `Toggle`/`Switch`: `error?: boolean` state flag
  - `Tree`: `defaultCheckedKeys` (uncontrolled checked state)
  - `className` on ConfirmDialog and CommandDialog

## 0.6.1
### Patch Changes

- a47db7a: Republish of 0.6.0 (its publish pipeline failed before reaching the registries — no library changes). CI now pins pnpm via `packageManager` and runs on Node 22 images.

## 0.6.0

### Minor Changes

- 019aa01: Remove app-specific business logic from the shared library:

  - **BREAKING**: `getBreadcrumbItems`, `getSimpleBreadcrumbItems`, and `BreadcrumbConfigItem` are no longer exported. They hardcoded app-specific routes (`/sources`, `/companies`, `/webhooks`, ...). Copy the old `src/utils/breadcrumb.ts` into your app if needed — the `Breadcrumb` component itself is unchanged.
  - Remove unexported dead code: `stores/authStore` (mock users), `stores/tenantStore`, `hooks/usePermission` (placeholder checks that always returned `true`), `hooks/useDataFetch` (use TanStack Query / SWR instead).

## 0.5.0

### Minor Changes

- cd9da8e: AdminLayout: add `sidebarVariant: 'classic' | 'rail'`, `subNav` slot, `AdminNavGroup.icon`/`path`, and `AdminNavItem.activeMatch` for nested-route highlighting. Badge: add `max` prop (numeric children greater than max render as `{max}+`). Package renamed to `@arkite-ui/core`.

## 0.4.0

### Minor Changes

- 1554b4b: Add `@arkite-ui/core/tokens` entry point — framework-agnostic design tokens for cross-platform use.

  The new entry exports plain JavaScript values (colors, spacing, radius, typography) with zero runtime dependencies, so it can be consumed from React Native, Node scripts, and design tooling — not just web.

  **Layered structure:**

  - `primitives` — 7 raw color scales (`gray`, `green`, `blue`, `red`, `amber`, `purple`, `teal` × shades 50–950) matching Tailwind's defaults
  - `colors.{light,dark}` — 21 semantic tokens (`success`, `danger`, `info`, `warning`, `primary`, `accent`, surfaces, form) with paired `*Foreground` for contrast
  - `spacing` / `radius` / `fontSize` / `lineHeight` / `fontWeight` — numeric scales sized for direct React Native StyleSheet use

  ```ts
  import { colors, spacing, radius } from '@arkite-ui/core/tokens'

  // React Native
  StyleSheet.create({
    card: {
      backgroundColor: colors.light.card,
      padding: spacing[4],
      borderRadius: radius.lg,
    },
  })
  ```

  The existing CSS-variable theme system (`createTheme`, `themePresets`, Tailwind preset) is unchanged — this is purely additive. See `docs/content/tokens.mdx` for the full guide.

  A Storybook preview at `Foundation/Design Tokens` includes a WCAG 2.1 contrast audit for all semantic foreground/background pairs.

## 0.3.6

### Patch Changes

- b4cede4: - Add Storybook stories for SegmentedControl and InlineCode (100% story coverage)
  - Add Status Badge pattern example to Badge stories
  - Add Dynamic Form pattern guide to FormPatterns docs
  - Add adoption report (docs/ADOPTION_REPORT.md)
  - Update ROADMAP with current adoption data
  - Fix package.json description

## 0.3.5

### Patch Changes

- relax lucide-react peer dependency to >=0.400.0

## 0.3.4

### Patch Changes

- add MIGRATION.md, fix package.json metadata, add GitLab Registry config

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-03-09

### Breaking Changes

- **Removed business logic exports** — `authStore`, `tenantStore`, `usePermission`, `useDataFetch` are no longer part of the public API. These belong in project-level packages (e.g. `@ark-crm/auth`). (#13)

### Added

- **FilterBar** — Responsive slot-based layout for data page toolbars (`FilterBarSearch`, `FilterBarFilters`, `FilterBarActions`)
- **DeleteConfirmDialog** — Pre-configured destructive preset with `itemName` prop
- **ConfirmDialog `warning` variant** — Amber icon/background for non-destructive confirmations
- **Textarea** — Multi-line input with `sm/md/lg` sizes, `error` state, `autoResize`
- **Switch** — Semantic re-export of Toggle for form use cases
- **BulkActionBar** — Floating overlay bar for bulk actions with left/center/right slots
- **StatusDot** — Reusable primitive for presence/status indicators (`online/offline/busy/away`)
- **Table `stickyHeader`** — Sticky header with scroll-triggered shadow
- **Table `stickyAction`** — Sticky action column (TableHead + TableCell) pinned to right edge
- **Status color tokens** — `--status-online`, `--status-offline`, `--status-busy`, `--status-away` with light/dark mode
- **Chart color tokens** — `--chart-1` through `--chart-5` with JS exports (`chartColors`, `chartColorList`)
- **Badge `size` prop** — `sm` / `md` size variants
- **Combobox `size` prop** — `sm` / `md` / `lg` (was fixed at md)
- **DatePicker `size` prop** — `sm` / `md` / `lg` (was fixed at md)
- **EmptyState error page recipes** — 404, 403, 500 contextual stories

### Changed

- **Avatar** — Refactored to use `StatusDot` internally with semantic status color tokens
- **package.json version** — Synced to 0.3.0 (#14)

### Docs

- **TanStack Table integration guide** — Copy-paste recipes for sorting, selection, pagination, sticky columns
- **Chart Integration guide** — Usage with Recharts, Tailwind classes, custom tooltips
- **Storybook sidebar reorganization** — Logical grouping with Foundation section

## [0.2.0] - 2026-03-08

### Added

- **Tailwind CSS v4 migration** — CSS-first configuration with `@theme`, `@custom-variant`, `@utility`
- **Design tokens** — Shadow elevation system (`xs` → `2xl`), transition timing/duration tokens
- **Kbd** — Keyboard shortcut display component (`sm`/`md` sizes)
- **CommandShortcut upgrade** — Auto-splits shortcut strings into individual `<kbd>` elements
- **Contextual stories** — Loading/empty/error states for DataTable, TenantSwitcher, Combobox, FileUpload, Tooltip
- **Form contextual stories** — Disabled, Submitting, WithValidation, MultiSection
- **Developer guide docs** — Introduction, Getting Started, Theme System, Form Patterns, Component Guidelines (MDX)

### Changed

- **Tailwind CSS** — Upgraded from v3 to v4 (`@tailwindcss/postcss`, `@tailwindcss/vite`, `tw-animate-css`)
- **Removed** `tailwind.config.ts` (replaced by CSS-first config)
- **Removed** `tailwindcss-animate` (replaced by `tw-animate-css`)

## [0.1.0] - 2026-03-07

### Added

- **Issue #12 components** — ActionButtons, ConfirmDialog, Pagination, PageHeader (with `onBack`), ErrorBoundary
- **Core Components** — Button, Input, Badge, Select, Checkbox, Radio, Toggle, Avatar, Label, Spinner
- **Layout** — AdminLayout, Card, Container, Stack, Divider
- **Navigation** — Sidebar, TenantSwitcher, Navbar, Breadcrumb, Tabs
- **Data Display** — DataTable, StatCard/StatGroup, EmptyState, Table, VirtualList, Calendar, Timeline, Steps
- **Form** — Form (context-based), SearchInput, FileUpload, DatePicker
- **Feedback** — Modal, Drawer, Toast (Zustand store), Alert, Progress, Skeleton
- **Overlay** — Popover, Tooltip, DropdownMenu (Radix UI), Combobox, CommandPalette (cmdk)
- **Motion** — AnimatedModal, AnimatedDrawer, AnimatedToastContainer (Framer Motion, optional)
- **Theme System** — 4 presets (Default, Neutral, Ocean, Forest), `createTheme()`, `applyTheme()`, `themeToCSS()`
- **Infrastructure** — Storybook 10, ESLint 9, Vitest + Testing Library, CI/CD pipeline (lint, typecheck, test, deploy)
- **Tailwind Preset** — CSS Variables theming, dark mode
- **GitLab Pages** — Tag-triggered Storybook deploy
