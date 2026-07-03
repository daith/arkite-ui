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

### Charts & presence

`chart-1`…`chart-5` for data series (use in order). `status-online/offline/busy/away` for presence dots (use `StatusDot`).

## Typography

- Sans: Inter (system fallback). Mono: JetBrains Mono — code, IDs, `InlineCode`, `Kbd`.
- Scale: `text-2xs` (10px, micro labels) → `text-xs` (12px, captions/badges) → `text-sm` (14px, **default body in admin UIs**) → `text-base` (16px) → `text-xl`/`text-2xl`/`text-3xl` (headings via `PageHeader size`).
- Numbers in tables/counters: `tabular-nums` (Badge `count` variant has it built in).

## Spacing, radius, elevation

- **Spacing**: 4px grid (Tailwind scale). Cards: `p-6` default, `density="compact"` for dashboard widgets. Forms stack on `gap-4`; sections on `gap-6`.
- **Radius**: everything derives from one `--radius` (0.5rem): `rounded-lg` = var, `md` = −2px, `sm` = −4px. Pills/avatars use `rounded-full`. Changing `--radius` rethemes the whole library.
- **Elevation**: soft low-alpha shadow scale `shadow-xs` → `shadow-2xl`. Cards sit at `xs/sm`; popovers `md/lg`; modals `xl`. Special: `shadow-sticky-left`, `shadow-sticky-header` for sticky table edges.
- **Motion**: durations `fast` 100ms / `normal` 150ms / `slow` 300ms; easing tokens incl. `bounce`. Optional framer-motion components live in `@arkite-ui/core/motion`.

## Component inventory — what to reach for

| Need | Use | Not |
|---|---|---|
| Page title + actions | `PageHeader` (`size`, `badge`, `onBack`) | Hand-rolled flex headers |
| Section on a page | `Card` (+`CardHeader actions`, `density="compact"` for widgets) | Bare bordered divs |
| Data list w/ sorting/selection | `DataTable` (or `Table` family for full control; `VirtualList` for huge lists) | Custom tables |
| KPI numbers | `Stat` / `StatCard` / `StatGroup` + `Sparkline` | Custom stat blocks |
| Filters above a table | `FilterBar` (+`FilterBarSearch/Filters/Actions`, `FilterSelect`) | Ad-hoc toolbars |
| Forms | `Form` family (`FormField label errorMessage`) + `Input`/`Select`/`Textarea`/`NumberInput`/`DatePicker`/`Combobox`/`TagInput`/`ColorPicker`/`FileUpload`/`ImageUpload` | Uncontrolled raw inputs |
| Mobile select | `SheetSelect` (bottom sheet) | Desktop `Select` on touch UIs |
| Binary toggle | `Switch` (canonical; `Toggle` is deprecated) | Checkbox-as-toggle |
| Confirmation | `ConfirmDialog` / `DeleteConfirmDialog` | window.confirm, custom modals |
| Overlay panels | `Modal` (centered) / `Drawer` (side/bottom) / `Popover` (anchored) | Fixed-position divs |
| Notifications | `toast.success/error/…` + `ImperativeToastContainer` (or `useToast` + `ToastContainer`) | Custom snackbars |
| Inline callout | `Alert` (`variant`, `dismissible onClose`) | Colored divs |
| Empty / error / loading | `EmptyState` / `ErrorState` / `Skeleton` family / `Spinner` / `LoadingOverlay` (`fullscreen`) | Blank screens |
| Status chips | `Badge` (7 variants + `count`, `max`) / `StatusDot` | Colored spans |
| App frame | `AdminLayout` (`sidebarVariant="classic|rail"`, `subNav`) + `Sidebar`/`Navbar`/`Breadcrumb`/`TenantSwitcher` | Custom shells |
| Steps / history | `Steps`, `Timeline`, `Calendar`, `Tree`, `Pagination` | Custom widgets |

## API conventions (follow when composing or wrapping)

- Change handlers on value components: **`onChange(value)`** (raw value, not event) — native-input wrappers keep React's event `onChange`
- Error display on form controls: **`error?: boolean` + `errorMessage?: string`**
- Open/close: **`open` + `onClose`** for dialogs/drawers/overlays; `defaultX` for uncontrolled counterparts
- Sizes: **`sm | md | lg`** (`md` default); variants: `primary | secondary | outline | ghost | destructive`
- Booleans are bare (`disabled`, `loading`, `open`) — never `isDisabled`
- Escape hatches: `className` everywhere (merged via `cn`), `renderX` props for custom item rendering

## Theming

Brand retheme = override CSS variables (or `createTheme()` from a hex, `applyTheme()` at runtime). Four built-in presets: Default, Neutral, Ocean, Forest. Because components consume only tokens, a future `[data-style="…"]` preset can restyle the entire library (radius, shadows, palette, density) with zero component changes.
