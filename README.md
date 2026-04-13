# Arkite UI

Production-ready React components for SaaS admin panels. Built with Tailwind CSS v4.

[![Storybook](https://img.shields.io/badge/Storybook-Live%20Demo-ff4785?logo=storybook)](https://daith.github.io/arkite-ui/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Arkite UI is not another generic component library. It focuses on the components you actually need to build multi-tenant SaaS admin panels — tenant switchers, data tables, stat dashboards, filter bars, and more.

> **Design Principle:** Pure UI only. No business logic, no auth, no stores. Domain-specific logic belongs in your project (e.g. `@ark-crm/auth`).

**Links:**

- [Storybook (Component Docs)](https://daith.github.io/arkite-ui/) — Live component preview
- [GitHub Repository](https://github.com/daith/arkite-ui) — Source code
- [Issue Tracker](https://github.com/daith/arkite-ui/issues) — Bug reports & feature requests
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Development guide
- [CHANGELOG.md](./CHANGELOG.md) — Release history

## Features

- **SaaS-First** — AdminLayout, TenantSwitcher, FilterBar, BulkActionBar
- **Tailwind CSS v4** — CSS-first configuration with `@theme`, `@custom-variant`, `@utility`
- **TypeScript** — Full type safety with exported types and JSDoc on all components
- **Accessible** — Focus traps, ARIA attributes, keyboard navigation, a11y-tested
- **Framer Motion** — Optional animation system for Modal, Drawer, Toast
- **Theme System** — 4 built-in presets + `createTheme()` utility with CSS Variables
- **Density System** — Consistent `sm/md/lg` sizing across all interactive components
- **Tested** — 412 unit tests with Vitest + Testing Library
- **Bundle Monitoring** — size-limit budget (< 300 KB)

## Installation

```bash
pnpm add @arkite/ui
```

### Peer Dependencies

```bash
pnpm add react react-dom tailwindcss zustand lucide-react
```

### Optional

```bash
pnpm add framer-motion    # For AnimatedModal, AnimatedDrawer, AnimatedToast
```

## Quick Start

### 1. Import Styles

```tsx
// main.tsx or app.tsx
import '@arkite/ui/styles.css'
```

### 2. Tailwind Configuration (v4)

With Tailwind CSS v4, import the preset in your CSS:

```css
/* app.css */
@import "tailwindcss";
@import "@arkite/ui/styles.css";
```

Or use the JS preset for Tailwind v4 config:

```ts
import arkitePreset from '@arkite/ui/tailwind'
```

### 3. Use Components

```tsx
import { AdminLayout, DataTable, Button, Badge } from '@arkite/ui'
```

## Components (55+)

### UI Primitives

| Component | Description |
|-----------|-------------|
| `Button` | 6 variants (primary, secondary, outline, ghost, destructive, gradient), sm/md/lg |
| `Input` | Text input with addons, error state, sm/md/lg |
| `Textarea` | Multi-line input with autoResize, sm/md/lg |
| `Badge` | Status badges with sm/md sizes (default, success, warning, destructive, info) |
| `Select` | Native select dropdown with icon and error state |
| `Checkbox` / `Radio` / `Toggle` / `Switch` | Selection controls |
| `Label` | Form labels with required/optional indicators |
| `Avatar` | Profile images with StatusDot integration and AvatarGroup |
| `StatusDot` | Presence indicator (online/offline/busy/away) with pulse animation |
| `Spinner` | Loading indicator (sm/md/lg) |
| `Kbd` | Keyboard shortcut display (sm/md) |
| `ViewToggle` | Table/card view mode switcher (sm/md) |

### Layout

| Component | Description |
|-----------|-------------|
| `AdminLayout` | Full admin layout with sidebar, navbar, and content area |
| `Card` | Card with header, content, footer sub-components |
| `Container` | Max-width content wrapper (sm/md/lg/xl/2xl/full) |
| `Stack` / `HStack` / `VStack` | Flexbox layout utilities |
| `Divider` | Visual separator with optional label |

### Navigation

| Component | Description |
|-----------|-------------|
| `Sidebar` | Collapsible sidebar with grouped navigation items |
| `TenantSwitcher` | Dropdown for switching between tenants with search |
| `Navbar` | Top navigation bar with brand and content areas |
| `Breadcrumb` | Path breadcrumbs with truncation |
| `Tabs` | Tab navigation |

### Data Display

| Component | Description |
|-----------|-------------|
| `DataTable` | Table with sorting, pagination, loading states, custom cells |
| `Table` | Composable table with `stickyHeader` and `stickyAction` columns |
| `FilterBar` | Responsive slot-based toolbar (search + filters + actions) |
| `BulkActionBar` | Floating overlay bar for bulk selection actions |
| `VirtualList` | Virtualized scrolling for 10,000+ items (@tanstack/react-virtual) |
| `InfiniteScroll` | Cursor-based pagination with scroll detection |
| `StatCard` / `StatGroup` | Metrics display with trend indicators |
| `EmptyState` | Pre-configured empty states (no data, no results, error, 404/403/500) |
| `Calendar` | Month view with date selection and constraints |
| `Timeline` | Vertical timeline for audit logs and activity feeds |
| `Steps` | Step indicator for wizard flows |

### Form

| Component | Description |
|-----------|-------------|
| `Form` | Context-based form with FormField, FormLabel, FormControl, FormMessage |
| `SearchInput` | Search field with debounce and clear button |
| `FileUpload` | Drag-and-drop file upload with validation |
| `DatePicker` | Date selection with calendar popover (sm/md/lg) |
| `Combobox` | Searchable select with single/multi-select, tags, async (sm/md/lg) |

### Feedback

| Component | Description |
|-----------|-------------|
| `Modal` | Dialog with focus trap, portal rendering, escape to close |
| `Drawer` | Slide-out panel (left, right, top, bottom) |
| `Toast` | Notification system with Zustand store (`useToast`) |
| `ConfirmDialog` | Confirmation modal (destructive/warning variants) |
| `DeleteConfirmDialog` | Pre-configured destructive confirm with `itemName` |
| `Alert` | Inline alert messages (info, success, warning, destructive) |
| `Progress` / `CircularProgress` | Progress bars (determinate, indeterminate, striped) |
| `Skeleton` | Loading placeholders (text, avatar, card, table patterns) |

### Overlay

| Component | Description |
|-----------|-------------|
| `Popover` | Radix-based popover with arrow support |
| `Tooltip` / `SimpleTooltip` | Radix-based tooltip with convenience wrapper |
| `DropdownMenu` | Full Radix dropdown with checkbox, radio, sub-menu |
| `CommandPalette` | Cmd+K command palette (cmdk-based) |

### Actions

| Component | Description |
|-----------|-------------|
| `ActionButtons` | Grouped action buttons for page headers |
| `Pagination` | Page navigation with size selector |
| `PageHeader` | Page header with title, breadcrumb, and actions |
| `ErrorBoundary` | React error boundary with fallback UI |

### Motion (Optional)

Requires `framer-motion` peer dependency.

| Component | Description |
|-----------|-------------|
| `AnimatedModal` | Modal with scale and fade animations |
| `AnimatedDrawer` | Slide-in drawer with spring transitions |
| `AnimatedToastContainer` | Animated toast notifications |

## Usage Examples

### Admin Layout

```tsx
import { AdminLayout, type AdminNavGroup } from '@arkite/ui'

const navigation: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [{ path: '/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Data',
    items: [
      { path: '/sources', label: 'Sources' },
      { path: '/runs', label: 'Runs' },
    ],
  },
]

function App() {
  return (
    <AdminLayout
      currentPath={location.pathname}
      onNavigate={(path) => navigate(path)}
      navigation={navigation}
      brand={{ name: 'My App', shortName: 'M' }}
      user={{ name: 'John', email: 'john@example.com', roleLabel: 'Admin' }}
      onLogout={() => logout()}
    >
      <h1>Dashboard</h1>
    </AdminLayout>
  )
}
```

### Data Table

```tsx
import { DataTable, Badge } from '@arkite/ui'

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
  { key: 'createdAt', header: 'Created', sortable: true },
]

<DataTable columns={columns} data={items} getRowKey={(row) => row.id} />
```

### Filter Bar + Bulk Actions

```tsx
import { FilterBar, FilterBarSearch, FilterBarFilters, FilterBarActions, BulkActionBar, Button } from '@arkite/ui'

<FilterBar>
  <FilterBarSearch value={search} onChange={setSearch} placeholder="Search users..." />
  <FilterBarFilters>
    <Select options={roles} value={role} onChange={setRole} />
  </FilterBarFilters>
  <FilterBarActions>
    <Button>Add User</Button>
  </FilterBarActions>
</FilterBar>

<BulkActionBar
  selectedCount={selected.length}
  onClear={() => setSelected([])}
>
  <Button variant="destructive" size="sm">Delete</Button>
</BulkActionBar>
```

### Toast Notifications

```tsx
import { useToast, ToastContainer } from '@arkite/ui'

function App() {
  const toast = useToast()

  return (
    <>
      <Button onClick={() => toast.success('Saved successfully')}>Save</Button>
      <ToastContainer position="top-right" />
    </>
  )
}
```

### Stats Dashboard

```tsx
import { StatGroup, StatCard } from '@arkite/ui'
import { Database, Activity } from 'lucide-react'

<StatGroup columns={4}>
  <StatCard label="Total Sources" value="128" change="+12%" trend="up" icon={<Database />} />
  <StatCard label="Active Runs" value="24" trend="neutral" icon={<Activity />} />
</StatGroup>
```

## Theming

### Built-in Presets

4 theme presets: **Default** (Stripe-inspired), **Neutral** (Zinc), **Ocean** (Blue), **Forest** (Green).

```tsx
import { applyTheme, themePresets } from '@arkite/ui'
applyTheme(themePresets.ocean)
```

### Custom Theme

```tsx
import { createTheme, applyTheme } from '@arkite/ui'

const myTheme = createTheme({
  primary: '#FF6B00',
  accent: '#00B4D8',
  radius: '0.75rem',
})

applyTheme(myTheme)
```

### CSS Variables Override

```css
:root {
  --primary: 250 100% 65%;
  --accent: 168 80% 45%;
  --radius: 0.5rem;
  --status-online: 145 65% 42%;
  --status-offline: 220 9% 46%;
  --status-busy: 0 72% 51%;
  --status-away: 38 92% 50%;
}
```

## Project Structure

```
src/
├── components/       # All components (flat directory, 55+ components)
│   ├── button/       # Button.tsx, Button.test.tsx, index.ts
│   ├── sidebar/
│   └── ...
├── theme/            # Theme presets, createTheme, applyTheme, chart colors
├── styles/           # CSS variables, Tailwind layers, status/chart tokens
├── utils/            # cn() utility, breadcrumb helpers
├── stories/          # Storybook stories (by category) + MDX docs
├── tailwind-preset.ts
└── index.ts          # Public API barrel export
```

## Development

```bash
pnpm install             # Install dependencies
pnpm build               # Build the package (tsup)
pnpm dev                 # Watch mode
pnpm storybook           # Launch Storybook (http://localhost:6006)
pnpm test                # Run unit tests (412 tests)
pnpm test:watch          # Tests in watch mode
pnpm test:coverage       # Tests with coverage report
pnpm lint                # Lint source code
pnpm typecheck           # Type check
pnpm size                # Check bundle size budget
pnpm chromatic           # Visual regression testing
pnpm clean               # Clean dist/
```

## CI/CD Pipeline

Every push triggers **lint**, **typecheck**, **test**, and **size** checks. On merge requests, **changeset:check** verifies a changeset is present and **chromatic** runs visual regression tests.

On git tags:

1. **Builds Storybook** and deploys to GitLab Pages
2. **Publishes** to GitLab Package Registry (automatic)
3. **Publishes** to npm public registry (manual trigger)

### Release Process (Changesets)

```bash
# 1. Add a changeset for your changes
pnpm changeset

# 2. When ready to release, version and update CHANGELOG
pnpm version-packages

# 3. Verify + build + publish (一鍵完成)
pnpm publish-package
```

### 本機發布前置需求

發布到 GitLab Package Registry 需要設定環境變數 `NPM_TOKEN`。

```bash
export NPM_TOKEN=your_gitlab_personal_access_token
```

**Token 來源：**

1. 前往 GitLab → 右上角頭像 → Edit profile → Access Tokens
   或直接開啟：`https://foson.co/-/user_settings/personal_access_tokens`
2. 建立新 token，設定：
   - Name：`arkite-ui-publish`（任意命名）
   - Scopes：勾選 **`api`**
3. 複製產生的 token，設定為環境變數

建議將 `export NPM_TOKEN=...` 加到你的 shell 設定檔（`~/.zshrc` 或 `~/.bashrc`）以永久生效：

```bash
echo 'export NPM_TOKEN=your_token_here' >> ~/.zshrc
source ~/.zshrc
```

> CI/CD 環境不需要此步驟，pipeline 會自動使用 `$CI_JOB_TOKEN`。

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, code style, and PR process.

## License

[MIT](./LICENSE)
