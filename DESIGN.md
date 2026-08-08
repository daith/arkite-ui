# DESIGN.md — Arkite UI Design System

> Machine-readable design spec for `@arkite-ui/core`. Feed this file to AI coding agents (and humans) building admin UIs with this library, so generated pages follow one consistent visual language instead of inventing their own.
>
> Source of truth: `src/styles/index.css` (tokens), `@arkite-ui/core/tokens` (JS values), Storybook (live docs). This file summarizes the rules; when in doubt, the code wins.

## Identity

**Arkite UI** is a component library for **multi-tenant SaaS admin panels**: data-dense, utilitarian, calm. React 18/19 + Tailwind CSS v4 + Radix UI. Light and dark mode are equal citizens — dark mode is automatic via tokens, never hand-tuned per page.

Design philosophy:

- **Clarity over decoration** — restrained color, generous whitespace inside a dense information layout
- **Semantic, not literal** — every color/radius/shadow flows through named tokens; nothing is hardcoded
- **Composable** — compound components (Card + CardHeader…), slots and render-props over configuration flags

## Hard rules (for AI agents)

1. **Import UI from `@arkite-ui/core`** (styles: `@arkite-ui/core/styles.css`). Never rebuild primitives that exist — check the component inventory below first.
2. **Never use raw Tailwind palette classes** (`bg-red-50`, `text-blue-800`, `text-gray-500`…). Use semantic utilities only: `bg-destructive-soft`, `text-muted-foreground`, `border-border`.
3. **Never write `dark:` color overrides.** Tokens already resolve dark mode. `dark:` is acceptable only for non-color adjustments in rare cases.
4. **Never use arbitrary values** (`text-[13px]`, `shadow-[…]`, `rounded-[…]`). Use the token scale; if a size seems missing, use the nearest step.
5. **Domain logic stays out of shared components.** API calls, routes, auth, and business models belong to the app layer; UI components receive data via props and emit events via callbacks.

## Color system

Colors are HSL triplets in CSS variables (`:root` light, `.dark` dark), exposed as Tailwind utilities via `@theme`. Always pair a background token with its `-foreground`.

### Core

| Token | Utility example | Use |
|---|---|---|
| `background` / `foreground` | `bg-background text-foreground` | Page base |
| `card` / `card-foreground` | `bg-card` | Elevated surfaces |
| `muted` / `muted-foreground` | `text-muted-foreground` | Secondary text, subtle fills |
| `primary` / `primary-foreground` | `bg-primary text-primary-foreground` | Brand actions (violet) |
| `secondary` / `secondary-foreground` | `bg-secondary` | Low-emphasis actions |
| `accent` / `accent-foreground` | `bg-accent` | Highlights (teal) |
| `border`, `input`, `ring` | `border-border`, `ring-ring` | Hairlines, form borders, focus |

### Status (solid + soft layer)

Four statuses: `success` (green), `warning` (amber), `destructive` (red), `info` (blue). Each has:

- **Solid**: `bg-{status} text-{status}-foreground` — buttons, badges, dots
- **Soft layer**: `bg-{status}-soft text-{status}-soft-foreground border-{status}-border` — alerts, toasts, tinted panels

Naming rule: the "dangerous/negative" semantic is always **`destructive`** (never `error`) in variant props and tokens.

### Contrast (WCAG AA)

- Every built-in fg/bg pair — tokens, all four presets, light and dark, solid and soft — meets **WCAG AA (4.5:1)**, enforced by regression tests (`tokens.test.ts`, `presets.test.ts`). This is why rule 2 exists: paired tokens are guaranteed readable; hand-picked palette classes are not.
- Foreground follows **background luminance, not semantics**: light backgrounds get dark text, dark backgrounds get light text (e.g. dark-mode `info` is black-on-blue, not white). Never re-pair a `-foreground` onto a different background.
- `createTheme()` picks black/white foregrounds by real contrast ratio — any brand color yields AA-passing pairs automatically.
- Custom palettes (raw CSS variable overrides): validate with the Storybook **Foundation / Design Tokens → Contrast Audit** page.

### Charts & presence

`chart-1`…`chart-5` for data series (use in order). `status-online/offline/busy/away` for presence dots (use `StatusDot`).

## Typography

- Sans: Inter (system fallback). Mono: JetBrains Mono — code, IDs, `InlineCode`, `Kbd`.
- Scale: `text-2xs` (10px, micro labels) → `text-xs` (12px, captions/badges) → `text-sm` (14px, **default body in admin UIs**) → `text-base` (16px) → `text-xl`/`text-2xl`/`text-3xl` (headings via `PageHeader size`).
- Numbers in tables/counters: `tabular-nums` (Badge `count` variant has it built in).

## Spacing, radius, elevation

- **Spacing**: 4px grid (Tailwind scale). Cards: compound children pad `p-4`; the root's `padding` prop defaults to `none` (`padding="lg"` = `p-6`). `density="compact"` for dashboard widgets. Forms stack on `gap-4`; sections on `gap-6`.
- **Radius**: everything derives from one `--radius` (0.5rem): `rounded-lg` = var, `md` = −2px, `sm` = −4px. Pills/avatars use `rounded-full`. Changing `--radius` rethemes the whole library.
- **Elevation**: soft low-alpha shadow scale `shadow-xs` → `shadow-2xl`. Cards sit at `xs/sm`; popovers `md/lg`; modals `xl`. Special: `shadow-sticky-left`, `shadow-sticky-right`, `shadow-sticky-header` for sticky table edges.
- **Motion**: durations `fast` 100ms / `normal` 150ms / `slow` 300ms; easing tokens incl. `bounce`. Optional framer-motion components live in `@arkite-ui/core/motion`.

## Component inventory — what to reach for

| Need | Use | Not |
|---|---|---|
| Page title + actions | `PageHeader` (`size`, `badge`, `onBack`) | Hand-rolled flex headers |
| Section on a page | `Card` (+`CardHeader actions`, `density="compact"` for widgets) | Bare bordered divs |
| **Any tabular data — including plain read-only lists** | `Table` family (`Table`/`TableHeader`/`TableRow`/`TableHead`/`TableBody`/`TableCell`) — styled `<table>` with tokens, dark mode, `stickyHeader`, `stickyLead`/`stickyAction` frozen columns built in | Raw `<table><td className="px-3 py-2 text-slate-600">` (hardcodes palette + dark mode by hand) |
| Data list w/ sorting/filters/selection/pagination | `DataTable` (column-config driven; server-side via `totalRows` + `useServerTable`) | Rebuilding sort/pagination around a raw table |
| Huge lists (1000+ rows) | `VirtualList` | Rendering everything |
| KPI numbers | `Stat` / `StatCard` / `StatGroup` + `Sparkline` | Custom stat blocks |
| Filters above a table | `FilterBar` (+`FilterBarSearch/Filters/Actions`, `FilterSelect`) | Ad-hoc toolbars |
| Forms | `Form` family (`FormField label errorMessage`) + `Input`/`Select`/`Textarea`/`NumberInput`/`DatePicker`/`Combobox`/`TagInput`/`ColorPicker`/`FileUpload`/`ImageUpload` | Uncontrolled raw inputs |
| OTP / verification code | `PinInput` (`length`, `type`, `onComplete`; SMS autofill built in) | Hand-styled single inputs with tracking CSS |
| File pick from a custom trigger (thumbnail, icon, menu item) | `FileTrigger` (headless — makes any element open the picker) | Hand-rolled hidden `<input type="file">` |
| Action styled as a text link (e.g. in a table cell) | `Button variant="link"` | `eslint-disable` + raw `<button>` with underline classes |
| Whole card/row clickable | `Card interactive onClick` (button semantics, keyboard included); table rows: `DataTable onRowClick` | Wrapping cards in raw `<button>` or clickable `<div>`s |
| Mobile select | `SheetSelect` (bottom sheet) | Desktop `Select` on touch UIs |
| Binary toggle | `Switch` (canonical; `Toggle` is deprecated) | Checkbox-as-toggle |
| Confirmation | `ConfirmDialog` / `DeleteConfirmDialog` | window.confirm, custom modals |
| Overlay panels | `Modal` (centered) / `Drawer` (side/bottom) / `Popover` (anchored) | Fixed-position divs |
| Notifications | `toast.success/error/…` + `ImperativeToastContainer` (or `useToast` + `ToastContainer`) | Custom snackbars |
| Error in a `catch` block | `toast.fromError(err, { prefix: '儲存失敗' })` — wire the app's parser ONCE at startup: `toast.configure({ formatError: getErrorMessage })` | ``toast.error(`失敗：${getErrorMessage(err)}`)`` boilerplate at every call site |
| Inline callout | `Alert` (`variant`, `dismissible onClose`) | Colored divs |
| Empty / error / loading | `EmptyState` / `ErrorState` / `Skeleton` family / `Spinner` / `LoadingOverlay` (`fullscreen`) | Blank screens |
| Status chips | `Badge` (7 variants + `count`, `max`) / `StatusDot` | Colored spans |
| App frame | `AdminLayout` (`sidebarVariant="classic|rail"`, `subNav`, `classNames`, mobile: `hideSidebar="mobile"` + `bottomNav`) + `Sidebar`/`Navbar`/`Breadcrumb`/`TenantSwitcher` | Custom shells; global CSS targeting AdminLayout internals |
| Steps / history | `Steps`, `Timeline`, `Calendar`, `Tree`, `Pagination` | Custom widgets |

**Table vs DataTable — the decision rule:** reach for `DataTable` only when you want its built-in behavior (sorting, column filters, row selection, expansion, pagination). For a read-only list — most admin tables — the `Table` family is *less* code than a `Column<T>[]` config and still inherits tokens, dark mode, `stickyHeader`, and frozen columns. Never hand-roll a raw `<table>`: hardcoded `text-slate-*`/manual `dark:` styling always follows.

## API conventions (follow when composing or wrapping)

- Change handlers on value components: **`onChange(value)`** (raw value, not event) — native-input wrappers keep React's event `onChange`
- Error display on form controls: **`error?: boolean` + `errorMessage?: string`**
- Open/close: **`open` + `onClose`** for dialogs/drawers/overlays; `defaultX` for uncontrolled counterparts. Exceptions: Radix passthrough components (Popover/Tooltip/DropdownMenu) and trigger-anchored pickers (Combobox/DatePicker/SheetSelect) expose Radix-style **`open` + `onOpenChange` + `defaultOpen`** — intentional, do not "fix"
- Non-overlay expand/collapse state uses the **`x` / `onXChange` / `defaultX`** triple (CollapsibleSection `open`, Sidebar `collapsed`)
- Sizes: **`sm | md | lg` as the baseline** (`md` default) — components may extend both ends (`xs`, `xl`, `icon`, `full`) when the domain calls for it; variants: `primary | secondary | outline | ghost | destructive` (Button additionally ships `gradient`)
- Semantic status values are `success | warning | destructive | info` — never `error`/`danger` in props. `EmptyState`'s `error` variant is a *scenario* (error page), not a color, and `StatusDot`'s `online/offline/busy/away` is a presence axis — both are separate value domains
- Booleans are bare (`disabled`, `loading`, `open`) — never `isDisabled`
- Collection props: tabular/hierarchical data is **`data`** (DataTable/Tree/Sparkline), flat renderable lists are **`items`** (Timeline/VirtualList/Breadcrumb); `Steps.steps` is grandfathered. Key extraction is **`get{Noun}Key(x, index)`** (`getRowKey`, `getItemKey`)
- Selection callbacks: **`onSelect(value, object?)`** — first arg is the selected value/key, optional second is the full object. Multi-select checkbox trees/tables use **`onSelectionChange`**
- Navigation: data-layer props are **`path`** (router semantics), render-layer receives **`href`** (DOM semantics); custom link rendering is **`renderLink({ href, children, className, active })`** across all nav components
- Definition objects (table columns, nav items) may use short render-prop names (`cell`, `icon`) — the `renderX` rule applies to component props, not def-object fields
- Escape hatches: `className` everywhere (merged via `cn`), `renderX` props for custom item rendering

## Theming

Brand retheme = override CSS variables (or `createTheme()` from a hex, `applyTheme()` at runtime). Four built-in presets: Default, Neutral, Ocean, Forest. Because components consume only tokens, a future `[data-style="…"]` preset can restyle the entire library (radius, shadows, palette, density) with zero component changes.

## Localization

Every built-in string (placeholders, empty states, pagination, calendar month/weekday names, and all aria-labels) resolves through `LocaleProvider`. Rules:

1. **Chinese apps must mount `<LocaleProvider locale={zhTW}>` at the root** — without it, screen readers announce English aria-labels inside a Chinese UI.
2. Per-instance text still goes through props (`placeholder`, `emptyMessage`, …) — props always win over the locale.
3. Never hardcode UI strings that a component already provides via locale; partial locales (`{ spinner: { loading: '…' } }`) fall back to English per key.
