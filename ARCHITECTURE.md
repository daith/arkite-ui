# Architecture

This document describes the architecture and design decisions behind Arkite UI.

## Core Principle

**Arkite UI is a pure UI component library.** It contains no business logic, no auth, no data fetching, and no domain knowledge. Every component must be reusable across multiple projects.

```
┌─────────────────────────────────────────────────┐
│  Project App (e.g. @ark-crm/web)                │
│  ├── Routes, pages, business logic              │
│  ├── @ark-crm/auth  (auth store, RBAC)          │
│  ├── @ark-crm/api   (API clients, hooks)        │
│  └── @arkite/ui     (pure UI components) ◀──────│── This library
└─────────────────────────────────────────────────┘
```

## Package Exports

```json
{
  ".":           "Components + theme (ESM/CJS + types)",
  "./styles.css": "CSS variables + Tailwind layers",
  "./tailwind":  "Tailwind preset (ESM/CJS + types)"
}
```

## Directory Structure

```
src/
├── components/           # All 55+ components
│   └── <name>/
│       ├── <Name>.tsx    # Component implementation
│       ├── <Name>.test.tsx  # Unit tests
│       └── index.ts      # Barrel export
├── theme/
│   ├── presets.ts        # 4 built-in theme presets
│   ├── create-theme.ts   # createTheme() from brand colors
│   ├── apply-theme.ts    # applyTheme(), themeToCSS()
│   ├── chart-colors.ts   # Chart color tokens + JS exports
│   └── index.ts
├── styles/
│   └── index.css         # CSS variables, @theme, @custom-variant, @utility
├── utils/
│   ├── cn.ts             # clsx + tailwind-merge helper
│   └── breadcrumb.ts     # Breadcrumb path utilities
├── stories/              # Storybook stories + MDX docs
│   ├── docs/             # MDX documentation pages
│   ├── primitives/
│   ├── layout/
│   ├── navigation/
│   ├── data-display/
│   ├── form/
│   ├── feedback/
│   └── overlay/
├── tailwind-preset.ts    # Tailwind v4 preset with CSS variables
└── index.ts              # Public API barrel export
```

## Component Categories

### Primitives (13)
Button, Input, Textarea, Badge, Select, Checkbox, Radio, Toggle, Switch, Avatar, StatusDot, Spinner, Kbd, Label

### Layout (5)
AdminLayout, Card, Container, Stack (HStack/VStack), Divider

### Navigation (5)
Sidebar, TenantSwitcher, Navbar, Breadcrumb, Tabs

### Data Display (11)
DataTable, Table, FilterBar, BulkActionBar, VirtualList, InfiniteScroll, StatCard/StatGroup, EmptyState, Calendar, Timeline, Steps

### Form (5)
Form (context-based), SearchInput, FileUpload, DatePicker, Combobox

### Feedback (8)
Modal, Drawer, Toast, ConfirmDialog, DeleteConfirmDialog, Alert, Progress/CircularProgress, Skeleton

### Overlay (4)
Popover, Tooltip, DropdownMenu, CommandPalette

### Motion (3, optional)
AnimatedModal, AnimatedDrawer, AnimatedToastContainer

## Design Decisions

### Tailwind CSS v4 (CSS-First)

We migrated from Tailwind v3 config-file approach to v4's CSS-first configuration using `@theme`, `@custom-variant`, and `@utility` directives. All design tokens are defined as CSS variables in `src/styles/index.css`.

### Density System

All interactive components share a consistent sizing scale:

| Size | Height | Font | Padding |
|------|--------|------|---------|
| `sm` | 32px (h-8) | text-sm | px-3 |
| `md` | 40px (h-10) | text-sm | px-4 |
| `lg` | 48px (h-12) | text-base | px-5 |

### Status Color Tokens

Semantic status colors are defined as CSS variables for consistent usage:

```css
:root {
  --status-online: 145 65% 42%;   /* Green */
  --status-offline: 220 9% 46%;   /* Gray */
  --status-busy: 0 72% 51%;       /* Red */
  --status-away: 38 92% 50%;      /* Amber */
}
```

Used by `StatusDot`, `Avatar`, and available as `bg-status-*` Tailwind utilities.

### Theme System

Themes are collections of HSL CSS variable values. The library provides:

- **4 presets:** Default (Stripe-inspired), Neutral (Zinc), Ocean (Blue), Forest (Green)
- **`createTheme()`:** Generate a full theme from primary + accent hex colors
- **`applyTheme()`:** Apply theme at runtime by setting CSS variables
- **`themeToCSS()`:** Serialize theme to CSS string for SSR/static

### forwardRef + Props Spreading

All primitive components use `React.forwardRef` and spread `...props` to allow full HTML attribute passthrough. This ensures consumers can add `data-*` attributes, event handlers, and ARIA attributes without workarounds.

### No Internal State Management

Components are controlled or uncontrolled — they never manage global state. The only exception is `Toast`, which uses a Zustand store for cross-component notification dispatching.

### Optional Peer Dependencies

`framer-motion` is an optional peer dependency. Motion components (`AnimatedModal`, `AnimatedDrawer`, `AnimatedToastContainer`) are only used when the consumer installs framer-motion. Non-animated equivalents exist for all motion components.

## Build & Bundle

- **Bundler:** tsup (ESM + CJS + DTS)
- **Bundle Budget:** < 300 KB for `index.js`, < 10 KB for `tailwind-preset.js`
- **Tree-shakeable:** Each component is independently importable via barrel exports
- **Side effects:** Only CSS files are marked as side effects

## Testing Strategy

- **Unit tests:** Vitest + @testing-library/react (412 tests, 39 files)
- **Visual regression:** Chromatic (CI-integrated)
- **Accessibility:** Storybook addon-a11y (error-based mode)
- **Bundle size:** size-limit checks on every push

## CI/CD Pipeline

```
Push/MR → lint → typecheck → test → size → changeset:check → chromatic
Tag     → build → build-storybook → pages (deploy) → publish:gitlab → publish:npm (manual)
```

## Dependencies

### Runtime (bundled)
- `@radix-ui/react-dropdown-menu`, `@radix-ui/react-popover`, `@radix-ui/react-tooltip`
- `@tanstack/react-virtual`
- `clsx`, `tailwind-merge`
- `cmdk`

### Peer (not bundled)
- `react`, `react-dom` (^18 || ^19)
- `tailwindcss` (^4)
- `zustand` (^5)
- `lucide-react` (^0.400)
- `framer-motion` (^10 || ^11 || ^12, optional)
