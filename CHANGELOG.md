# Changelog

## 0.14.0
### Minor Changes

- 40dc092: DX-audit fixes: AdminLayout injection points, Table frozen lead column, Table/DataTable selection guidance.
  
  - **AdminLayout**: new `classNames` prop (`root`/`sidebar`/`navbar`/`subNav`/`main`) — the supported way to restyle internal regions instead of global CSS targeting internal DOM; `hideSidebar` / `hideNavbar` (`true` removes, `'mobile'` hides below the `md` breakpoint) for mobile layouts.
  - **Table**: `stickyLead` on `TableHead`/`TableCell` freezes the lead column during horizontal scroll (symmetric to the existing `stickyAction`); new `shadow-sticky-right` token.
  - **DESIGN.md**: the `Table` family gets its own inventory entry (read-only lists included) plus an explicit Table-vs-DataTable decision rule — the audited root cause of consumers hand-rolling raw `<table>` with hardcoded palette classes. Regenerated into `llms.txt`/`llms-full.txt`.
- b2d6a65: DX-audit gap fillers — the components behind 30+ consumer lint bypasses and hand-rolled inputs:
  
  - **`Button variant="link"`** — inline text-link appearance with button semantics (keeps the size's text scale, drops box dimensions). For real navigation keep using `<a>`.
  - **`Card interactive`** — whole-card clickable with proper button semantics (`role`, `tabIndex`, Enter/Space activation only when the card itself is focused). Stays a `<div>` so inner interactive children keep working.
  - **`FileTrigger`** — headless file-pick trigger: makes any element (thumbnail, icon, menu item) open the native picker; no wrapper element, no chrome. Completes the trio: `FileUpload` (dropzone) / `FileUploadButton` (styled button) / `FileTrigger` (headless).
  - **`PinInput`** — OTP/verification-code input: per-character cells, auto-advance, Backspace/arrow navigation, paste distribution with filtering, `onComplete`, numeric/alphanumeric modes, `inputMode` + `one-time-code` autofill, localized cell labels.
  - **`AdminLayout bottomNav`** — mobile bottom-navigation slot: fixed below `md` with safe-area padding built in; main content gets matching bottom padding. Pair with `hideSidebar="mobile"`.
- 201b69d: Code-review hardening for the v1.0 groundwork:
  
  - **DataTable server mode**: new `onPageSizeChange` prop — in server mode (`totalRows`) the rows-per-page selector now only renders when it is provided; column filters only render when `filters`/`onFilterChange` are controlled and the column provides `filterOptions`; the pagination footer no longer renders while `data` is empty; a dev-only warning fires when `totalRows` is used without a controlled `page`.
  - **FilterSelect**: no longer sets `aria-label` when the consumer provides their own accessible name (`id` for a native `<label htmlFor>`, or `aria-labelledby`).
  - **v1.0 codemod**: `expandable` identifiers are classified via the type checker (boolean identifiers stay, only callable values migrate to `renderExpandedRow`, unresolvable ones get a TODO); toast rewrites match by symbol binding instead of identifier text, so same-named non-arkite objects are never touched; the glob fallback scans the whole project instead of only `src/`.
  - **Build/CI**: `dist` is cleaned before tsup runs instead of via a racing per-config `clean`; playwright CI jobs use a separate node_modules cache key from the alpine jobs.
- 74332c5: Table API conveniences from the ark-finance feedback (feedback 1):
  
  - **`TableCell`/`TableHead` `align`** (`'left' | 'center' | 'right'`) — replaces per-cell `text-right` repetition; rendered as classes, never the deprecated HTML `align` attribute.
  - **`TableCell` `numeric`** — right-aligned `tabular-nums` for digit columns that must line up (financial tables).
  - **`TableEmpty` / `TableLoading`** — full-width empty/loading rows for the Table family with automatic `colSpan` (measured from the header row; pass `colSpan` explicitly when columns change at runtime). Localized default copy.
  - **`DataTable` `Column.pinned: 'left' | 'right'`** — frozen columns during horizontal scroll, wired to the Table family's `stickyLead`/`stickyAction`. Note: `'left'` pins at the table edge, so combine with `selectable`/expandable only when the leading utility columns may scroll under it.
- 9b61041: Table/DataTable fixes from ark-finance migration testing (previously `compact`/`hoverable`/`striped` were dead props and dense tables were unusable):
  
  - **`compact`, `hoverable`, `variant="striped"` now actually work** — the data-attributes are wired to CSS. `compact` tightens cells to `px-3 py-2` (header `h-8`), `striped` zebra-stripes body rows, and row hover is now **opt-in via `hoverable`** instead of always-on (DataTable passes `hoverable` itself, so its visuals are unchanged; bare `Table` users add `hoverable` to keep the old hover).
  - **Row separators render again** — the table is `border-separate` (required for cross-browser sticky headers), where `<tr>` borders never paint. Separators moved to the cells (`TableCell`/`TableHead` `border-b`, footer `[&_td]:border-t`), last body row exempt.
  - **`DataTable compact`** — density passthrough, and **`rowClassName`** (string or `(row, index) => string`) for conditional row styling such as dimming disabled rows.
  - `pagination` and other boolean props now document their defaults (`pagination` defaults to **true** — hide it when paginating outside).
- fc15c9e: `toast.fromError(err, { prefix })` — one-line error toasts for `catch` blocks.
  
  Renders a destructive toast with `prefix` as the title and the parsed error message as the description. Error parsing stays in the app layer: register it once at startup with `toast.configure({ formatError: getErrorMessage })` (module-level by design, so the imperative `toast` keeps working outside React). Unconfigured, only zero-knowledge fallbacks apply (`Error#message`, plain strings); when no message can be derived the prefix alone is shown — this API never invents copy, keeping it out of the locale system. A throwing formatter falls back instead of crashing. Also available on `useToast()`. Deliberately out of scope: error reporting/logging hooks and burst dedupe.
- a34a941: DX: server-table state hook and AI-readable docs.
  
  - **`useServerTable()`** — pure state helper for `<DataTable>` server-side mode. Owns the six controlled props (`page`/`onPageChange`, `onPageSizeChange`, `sortState`/`onSortChange`, `filters`/`onFilterChange`) and exposes them pre-wired via `props`; the consumer supplies `data` + `totalRows` and fetches on `queryKey`. Sort/filter/page-size changes reset to page 1.
  - **`llms.txt` / `llms-full.txt`** — generated from DESIGN.md and the public API snapshot (`pnpm run generate:llms`, part of `build`) and shipped in the npm package, so AI coding agents get the setup, design rules, core patterns, and full typed API without reading source.

## 0.13.0
### Minor Changes

- 9b5afc5: Six end-to-end **Recipes** land in Storybook (CRUD List Page, Form Page, Server-Side Table, Dashboard, Tenant Admin Shell, Detail + Drawer Edit) — each a complete, copyable page whose live demo and code sample share one source file. Building them surfaced and fixed four component gaps:
  
  - **DataTable `totalRows`**: controlled `page` alone still sliced client-side, so true server-side pagination was impossible — a server returning one page of rows rendered an empty table past page 1. With `totalRows` set, `data` is treated as the already-processed current page and pagination math comes from the total.
  - **CardHeader `headingLevel`**: the title was hardcoded `<h3>`, tripping axe heading-order under a `PageHeader` `<h1>`; now configurable (default unchanged).
  - **FilterSelect**: the `label` prop now doubles as the select's accessible name (axe flagged the unnamed `<select>`).
  - **Form**: props now extend `FormHTMLAttributes`, so `noValidate`/`autoComplete`/`action` type-check.

### Patch Changes

- f7e2f0c: `@arkite-ui/core/tokens` and `@arkite-ui/core/tailwind` are now server-safe: the build no longer stamps `"use client"` on these pure-data entries, so Server Components can `import { colors } from '@arkite-ui/core/tokens'` and get real values instead of client references. Caught by the new Next.js App Router smoke test, which now runs in CI: `next build` + Chromium checks for hydration mismatches and post-hydration interactivity on every merge request.

## 0.12.0
### Minor Changes

- fe65fe2: 1.0 Phase 2 — navigation group API unification. **BREAKING** (type-level and `Breadcrumb.renderLink`); runtime-renamed props keep deprecated aliases that warn in dev and are removed in v1.0.
  
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
- fe65fe2: 1.0 audit phase 2 — API convergence. Renamed APIs keep the old name as a deprecated alias (dev-only warning, removed in v1.0) unless noted:
  
  - **Toast unified**: one store, one container, one shape. `useToast()` and the imperative `toast.*` are now identical — `success(title, options?)`, `dismiss(id)`, `dismissAll()`, default position `top-right` everywhere, `MAX_TOASTS` applies to every path, and `toast.loading()` actually shows a spinner and persists until dismissed. Old forms (`success(title, description)`, `clear()`, `ImperativeToastContainer`) still work with warnings.
  - **DataTable**: `renderExpandedRow(row, i)` replaces function-valued `expandable` (deprecated); fully controllable now — `sortState`/`onSortChange`, `filters`, `page` (1-based)/`onPageChange`, `defaultSelectedRows` — enabling server-side sorting, filtering, and pagination.
  - **Tree**: `onSelectionChange` replaces `onCheckChange` (deprecated alias); `defaultSelectedKey` added.
  - **Pagination**: `variant` replaces `mode` (deprecated alias). **Timeline**: gray `default` renamed `muted` (alias kept), new `info` variant.
  - **TenantSwitcher**: `value`/`onChange` replace `currentTenant`/`onSelect` (deprecated aliases).
  - **Pickers**: `DatePicker.clearable` finally works (clear button, was a dead prop); DatePicker/DateRangePicker/Combobox/SheetSelect gain controlled `open`/`defaultOpen`/`onOpenChange`; `defaultValue` added across ColorPicker, Combobox, DatePicker, DateRangePicker, SegmentedControl, SheetSelect, ViewToggle, Calendar (+`defaultMonth`); DateRangePicker gains the standard `value`/`onChange(range)` contract alongside the per-field callbacks.
  - **DESIGN.md**: conventions updated to match reality — Radix passthrough and trigger-anchored `open/onOpenChange` exceptions, size baseline wording, collection-prop rules (`data` vs `items`), `path`/`href` layering, def-object short names.
  
  **Breaking without alias** (see the nav changeset for migration): `Breadcrumb.renderLink` now takes `({ href, children, className, active })` and only runs for items with `href`; the `BreadcrumbItem` name moved from the data type (now `BreadcrumbItemData`) to the component.

### Patch Changes

- b64119e: `init` CLI: the install list now includes `zustand` (a required peer that was missing — store-backed components like toast broke on fresh setups), and a `--dry-run` flag skips the install step while still writing files, used by the new CI smoke test that keeps the CLI from silently breaking again.
- 85e81bf: Keyboard accessibility fixes (wave 1 of the APG audit): Modal restores focus to its opener on close; CommandDialog focuses the search input on open; TagInput remove buttons are Tab-reachable (dropped `tabIndex={-1}`); DataTable exposes `aria-sort` on sorted headers, its filter and column-toggle dropdowns close on Escape, and rows with `onRowClick` are now focusable and activate with Enter/Space.
- 4effec8: Keyboard accessibility wave 2 — the remaining 22 APG audit gaps are closed:
  
  - **Calendar / DatePicker**: full grid keyboard navigation (arrows move by day/week, Home/End to week edges, PageUp/PageDown by month with end-of-month clamping, month boundaries cross seamlessly), proper `grid`/`row`/`gridcell` semantics, and DatePicker now moves focus into the calendar on open, closes on Escape without selecting, and returns focus to its input.
  - **Combobox**: real combobox semantics (`role="combobox"` trigger, `listbox`/`option` structure, `aria-activedescendant`) with the full keyboard selection model — ArrowDown opens, arrows move the highlight while focus stays in the search input, Enter selects, Tab closes.
  
  Note for consumer tests: the Combobox trigger now carries `role="combobox"`, so testing-library queries must use `getByRole('combobox')` instead of `getByRole('button')` to find it.
- 8e623bd: 1.0 audit phase 1 — bug fixes and consistency polish across 25+ components:
  
  - **Fixed: checked indicators never rendered.** Checkbox/CheckboxCard check marks and the Radio dot used `peer-checked` styles on nested children the peer selector can't reach — a checked box changed color but never showed its mark. Dedicated Checkbox/Radio stories now pin the checked states in Chromatic.
  - **i18n completed for real**: 16 new locale keys cover every remaining hardcoded string (Modal/Drawer/motion "Close", Sidebar toggle, PageHeader back, Tree/TagInput/ColorPicker/ImageUpload aria-labels, Label "(optional)", PasswordInput show/hide, ErrorBoundary fallback) — including `FilterSelect`'s reverse case, a hardcoded Chinese `'全部'` that now defaults to English and localizes via `zhTW`.
  - **Overlay hardening**: Drawer and AnimatedDrawer gain the focus trap, dialog semantics, and focus restore Modal already had; AnimatedModal restores focus and accepts HTML attributes; Modal/AnimatedModal use `useId` so multiple dialogs on one page no longer collide; CommandDialog and ConfirmDialog expose `closeOnEscape`/`closeOnBackdropClick`.
  - **Refs & escape hatches**: forwardRef added to RadioGroup, Tree, VirtualList/InfiniteScroll, ViewToggle, AvatarGroup, TenantSwitcher, CommandDialog, ActionButtons; TagInput's broken callback-ref handling fixed; SidebarItem's anchor branch no longer drops ref/props; StatCard's ref now points at the card element; CopyInput and SimpleTooltip accept standard attributes.
  - **Semantics**: CheckboxCard gains `error`/`errorMessage`; CollapsibleSection no longer nests interactive content inside a button; Tabs aria wiring (trigger ids + panel labelling) works with multiple instances per page.

## 0.11.0
### Minor Changes

- fa224f4: Add `LocaleProvider` + built-in `enUS` / `zhTW` locales. Every built-in component string (placeholders, empty states, pagination labels, calendar weekday/month names, and all aria-labels) now resolves through the locale context, so Chinese apps get Chinese screen-reader labels with one provider at the root:
  
  ```tsx
  import { LocaleProvider, zhTW } from '@arkite-ui/core'
  
  <LocaleProvider locale={zhTW}>
    <App />
  </LocaleProvider>
  ```
  
  Partial locales are supported (missing keys fall back to English), and explicit component props always win over locale values. Without a provider nothing changes — defaults are the same English strings as before.

### Patch Changes

- a865209: `createTheme()` now picks black/white foregrounds by real WCAG contrast instead of an L>55% lightness heuristic, and computes dark-mode foregrounds instead of hardcoding white — every generated pair is guaranteed ≥4.5:1 for any brand color. Behavior change: themes built from mid-luminance brand colors (e.g. `hsl(210 100% 50%)` blues) may flip their button text between white and black.
- a865209: `npx @arkite-ui/core init` works again — the CLI's install list still referenced the pre-rename `@arkite/ui` package, so it has been broken since the rename. All docs now use the correct package name, and install guides lead with the one-shot `init` (installs peer deps + writes the Tailwind v4 theme CSS) instead of implying the package is a zero-dependency drop-in.
- a865209: FilterBarSearch / SearchInput: guard against password-manager autofill. Inputs now render `type="search"` + `name="search"` + `autoComplete="off"` (overridable via props on SearchInput), so a `type="password"` field on the same page no longer makes browsers autofill the saved username into the search box and silently filter your list.
- a865209: All built-in color pairs now meet WCAG AA (4.5:1), enforced by regression tests. Visible changes to note: dark-mode `info` (all presets) and ocean/forest dark-mode `primary` switch from white to black text; ocean/forest light-mode `primary` darkens one step (50%→45% / 38%→33%); light `info` and dark `destructive` get imperceptible lightness nudges. Cross-platform JS tokens (`/tokens`): light `mutedForeground` gray-500→gray-600, dark on-color foregrounds unified to gray-950.

## 0.10.0
### Minor Changes

- 529f212: Sparkline: accept `data: number[] | null | undefined` and add `placeholder?: boolean | ReactNode` — with fewer than 2 points, `true` draws a dashed neutral line (`text-border`, dark-mode aware) and a ReactNode replaces the output entirely. Without `placeholder`, behavior is unchanged (empty renders nothing, single point renders a dot). Closes the gap that kept ark-finance on a local wrapper.

## 0.9.0
### Minor Changes

- 90cda9e: Every visual property now flows through design tokens — groundwork for future style presets (`[data-style]` theming). No API changes.
  
  New tokens (also in `/tokens` entry, all theme presets, and the Tailwind preset):
  
  - `--info` / `--info-foreground` — the previously missing info status color
  - Soft layer per status (`success`/`warning`/`destructive`/`info`): `--{status}-soft`, `--{status}-soft-foreground`, `--{status}-border` → utilities like `bg-success-soft`
  - `--text-2xs` (10px) micro text size
  - `--shadow-sticky-left` / `--shadow-sticky-header` for Table sticky columns/header
  
  Component migration: Alert, Toast, Badge, Stat, CopyButton, ImageUpload, Kbd, TenantSwitcher, CommandPalette, TagInput, AdminLayout, Table no longer use raw Tailwind palette classes or arbitrary values — semantic tokens handle light/dark automatically. Visual parity preserved (known minor deltas: Badge `info` is one shade paler to share the soft layer; Badge md text 13px→14px; AdminLayout rail labels 11px→12px).

## 0.8.0
### Minor Changes

- 9e5f37e: Promote consumer-proven components into the library and close the gaps that caused local rebuilds (see docs/COMPONENT_COVERAGE.md). All additive — no breaking changes.
  
  New components:
  
  - **Sparkline** — dependency-free SVG mini trend chart (`data`, `trend: 'auto' | 'up' | 'down' | 'neutral'`, `color` override, safe with empty/single/flat data). Generalized from ark-finance.
  - **SheetSelect** — mobile-friendly bottom-sheet select built on Drawer (`options` with description/disabled, `error`/`errorMessage`, `renderOption`, 44px+ touch targets, grab handle). Generalized from ark-museum.
  
  Enhancements:
  
  - **Badge**: new `count` variant — neutral gray pill with `tabular-nums`, composes with `max`
  - **PageHeader**: new `size: 'sm' | 'md' | 'lg'` (default `md` unchanged)
  - **Card**: new `density: 'default' | 'compact'` on Card (context-provided to CardHeader/CardContent/CardFooter, per-component override supported) and `CardHeader.actions` slot for icon-button rows — dashboard-widget ergonomics
  - **LoadingOverlay**: new `fullscreen` mode (fixed, backdrop-blur, centered panel)

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
