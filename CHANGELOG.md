# Changelog

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
