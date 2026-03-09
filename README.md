# Arkite UI

Production-ready React components for SaaS admin panels. Built with Tailwind CSS.

[![pipeline](https://gitlab.com/foson.co/arkite-ui/badges/main/pipeline.svg)](https://gitlab.com/foson.co/arkite-ui/-/pipelines)
[![coverage](https://gitlab.com/foson.co/arkite-ui/badges/main/coverage.svg)](https://gitlab.com/foson.co/arkite-ui/-/pipelines)

Arkite UI is not another generic component library. It focuses on the components you actually need to build multi-tenant SaaS admin panels — tenant switchers, permission-aware layouts, data tables, stat dashboards, and more.

**Links:**

- [Storybook (Component Docs)](https://foson.co.gitlab.io/arkite-ui/) — Live component preview
- [GitLab Repository](https://gitlab.com/foson.co/arkite-ui) — Source code
- [Issue Tracker](https://gitlab.com/foson.co/arkite-ui/-/issues) — Bug reports & feature requests
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Development guide
- [CHANGELOG.md](./CHANGELOG.md) — Release history

## Features

- **SaaS-First** — AdminLayout, TenantSwitcher, permission system built-in
- **Multi-Tenant Ready** — Tenant store, tenant switching, role-based rendering
- **Tailwind CSS** — CSS Variables theming with dark mode support
- **TypeScript** — Full type safety with exported types
- **Accessible** — Focus traps, ARIA attributes, keyboard navigation
- **Framer Motion** — Optional animation system for Modal, Drawer, Toast
- **Theme System** — 4 built-in presets + `createTheme()` utility
- **Tested** — Unit tests with Vitest + Testing Library

## Installation

```bash
npm install @arkite/ui
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss zustand lucide-react
```

### Optional Peer Dependencies

```bash
npm install framer-motion    # For AnimatedModal, AnimatedDrawer, AnimatedToast
```

## Quick Start

### 1. Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import arkitePreset from '@arkite/ui/tailwind'

export default {
  presets: [arkitePreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@arkite/ui/dist/**/*.{js,cjs}',
  ],
} satisfies Config
```

### 2. Import Styles

```tsx
// main.tsx
import '@arkite/ui/styles.css'
```

### 3. Use Components

```tsx
import { AdminLayout, DataTable, Button, usePermission } from '@arkite/ui'
```

## Components

### SaaS Components

These are what make Arkite UI different from generic UI libraries.

| Component | Description |
|-----------|-------------|
| `AdminLayout` | Full admin page layout with sidebar, navbar, and content area |
| `Sidebar` | Collapsible sidebar with grouped navigation items |
| `TenantSwitcher` | Dropdown for switching between tenants with search and status badges |
| `DataTable` | Table with sorting, pagination, loading states, and custom cell renderers |
| `VirtualList` | Virtualized scrolling for 10,000+ items (via @tanstack/react-virtual) |
| `InfiniteScroll` | Cursor-based pagination with scroll threshold detection |
| `StatCard` / `StatGroup` | Metrics display with trend indicators |
| `EmptyState` | Pre-configured empty states (no data, no results, error) |
| `SearchInput` | Search field with debounce and clear button |
| `FileUpload` | Drag-and-drop file upload with validation |

### Overlay / Composite

| Component | Description |
|-----------|-------------|
| `Popover` | Radix-based popover with arrow support |
| `Tooltip` / `SimpleTooltip` | Radix-based tooltip with convenience wrapper |
| `DropdownMenu` | Full Radix dropdown with checkbox, radio, sub-menu |
| `Combobox` | Searchable select with single/multi-select, tags, async search |
| `CommandPalette` | Cmd+K command palette (cmdk-based) |

### Process / Timeline

| Component | Description |
|-----------|-------------|
| `Calendar` | Month view with date selection, constraints, highlighted dates |
| `Timeline` | Vertical timeline for audit logs and activity feeds |
| `Steps` | Step indicator for onboarding and wizard flows |

### Hooks

| Hook | Description |
|------|-------------|
| `usePermission` | Role-based permission checks (`can`, `canAny`, `canAll`) |
| `useDataFetch` | Data fetching with loading/error states and refresh |
| `useReducedMotion` | Detect `prefers-reduced-motion` system setting |

### Stores

| Store | Description |
|-------|-------------|
| `useAuthStore` | Authentication state, login/logout, user management |
| `useTenantStore` | Current tenant, tenant list, tenant switching |

### UI Primitives

| Component | Description |
|-----------|-------------|
| `Button` | 6 variants (primary, secondary, outline, ghost, destructive, gradient) |
| `Input` | Text input with addons, error state |
| `Badge` | Status badges (default, success, warning, destructive, info) |
| `Select` | Dropdown select |
| `Checkbox` / `Radio` / `Toggle` | Selection controls |
| `Label` | Form labels |
| `Avatar` | User profile images |
| `Spinner` | Loading indicator |

### Layout

| Component | Description |
|-----------|-------------|
| `Card` | Card with header, content, footer sub-components |
| `Container` | Max-width content wrapper |
| `Stack` / `HStack` / `VStack` | Flexbox layout utilities |
| `Divider` | Visual separator |

### Navigation

| Component | Description |
|-----------|-------------|
| `Navbar` | Top navigation bar with brand and content areas |
| `Breadcrumb` | Path breadcrumbs with truncation |
| `Tabs` | Tab navigation |

### Feedback

| Component | Description |
|-----------|-------------|
| `Modal` | Dialog with focus trap, portal rendering, escape to close |
| `Drawer` | Slide-out panel (left, right, top, bottom) |
| `Toast` | Notification system with Zustand store (`useToast`) |
| `AnimatedModal` / `AnimatedDrawer` / `AnimatedToastContainer` | Framer Motion versions |
| `Alert` | Inline alert messages |
| `Progress` | Progress bar with indeterminate mode |
| `Skeleton` | Loading placeholder |

### Form

| Component | Description |
|-----------|-------------|
| `Form` | Context-based form with field, label, control, message, section |
| `DatePicker` | Date selection |

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
      { path: '/sources', label: 'Sources', permissions: ['sources:view'] },
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
      hasPermission={(perms) => checkPermissions(perms)}
      onLogout={() => logout()}
    >
      <h1>Dashboard</h1>
    </AdminLayout>
  )
}
```

#### React Router Integration

```tsx
import { Link, useLocation, useNavigate } from 'react-router-dom'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AdminLayout
      currentPath={location.pathname}
      onNavigate={navigate}
      renderLink={({ href, children, className }) => (
        <Link to={href} className={className}>{children}</Link>
      )}
      {/* ...other props */}
    />
  )
}
```

#### Next.js Integration

```tsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

function Layout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <AdminLayout
      currentPath={pathname}
      onNavigate={router.push}
      basePath="/admin"
      renderLink={({ href, children, className }) => (
        <Link href={href} className={className}>{children}</Link>
      )}
      {/* ...other props */}
    >
      {children}
    </AdminLayout>
  )
}
```

### Data Table

```tsx
import { DataTable } from '@arkite/ui'

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
  { key: 'createdAt', header: 'Created', sortable: true },
]

<DataTable columns={columns} data={items} getRowKey={(row) => row.id} />
```

### Virtual List (10,000+ items)

```tsx
import { VirtualList } from '@arkite/ui'

<VirtualList
  items={largeDataset}
  getItemKey={(item) => item.id}
  estimateSize={48}
  height={400}
  renderItem={(item) => <div className="px-4 py-3">{item.name}</div>}
/>
```

### Infinite Scroll

```tsx
import { InfiniteScroll } from '@arkite/ui'

<InfiniteScroll
  items={items}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
  loadingMore={isFetchingNextPage}
  renderItem={(item) => <div>{item.name}</div>}
/>
```

### Permission-Based Rendering

```tsx
import { usePermission, Can } from '@arkite/ui'

function Page() {
  const { can } = usePermission()

  return (
    <div>
      <Can permission="manage_users">
        <Button>Add User</Button>
      </Can>

      {can('view_audit_logs') && <AuditLogTable />}
    </div>
  )
}
```

### Stats Dashboard

```tsx
import { StatGroup, StatCard } from '@arkite/ui'
import { Database, Activity } from 'lucide-react'

<StatGroup columns={4}>
  <StatCard
    label="Total Sources"
    value="128"
    change="+12%"
    trend="up"
    icon={<Database />}
  />
  <StatCard
    label="Active Runs"
    value="24"
    trend="neutral"
    icon={<Activity />}
  />
</StatGroup>
```

### Toast Notifications

```tsx
import { useToast, ToastContainer } from '@arkite/ui'

function App() {
  const toast = useToast()

  return (
    <>
      <Button onClick={() => toast.success('Saved successfully')}>
        Save
      </Button>
      <ToastContainer position="top-right" />
    </>
  )
}
```

## Theming

### Built-in Presets

Arkite UI ships with 4 theme presets: **Default** (Stripe-inspired), **Neutral** (Zinc), **Ocean** (Blue), **Forest** (Green).

```tsx
import { applyTheme, themePresets } from '@arkite/ui'

applyTheme(themePresets.ocean)
```

### Custom Theme from Brand Colors

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
  --background: 0 0% 100%;
  --foreground: 220 15% 20%;
  --radius: 0.5rem;
}

.dark {
  --primary: 250 100% 70%;
  --background: 220 20% 10%;
  --foreground: 0 0% 95%;
}
```

### SSR / Static Theme

```tsx
import { themeToCSS, createTheme } from '@arkite/ui'

const css = themeToCSS(createTheme({ primary: '#FF6B00' }))
// Inject into <style> tag or write to file
```

## Project Structure

```
src/
├── components/       # All components (flat directory)
├── hooks/            # useDataFetch, usePermission
├── stores/           # Zustand stores (auth, tenant)
├── theme/            # Theme presets, createTheme, applyTheme
├── styles/           # CSS Variables and Tailwind layers
├── utils/            # cn() utility
├── tailwind-preset.ts
└── index.ts
```

## Development

```bash
npm install              # Install dependencies
npm run build            # Build the package
npm run dev              # Watch mode
npm run storybook        # Launch Storybook (http://localhost:6006)
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run lint             # Lint source code
npm run typecheck        # Type check
npm run clean            # Clean dist/
npm run build-storybook  # Build static Storybook site
```

### Storybook

Run `npm run storybook` to browse all components interactively at `http://localhost:6006`. Stories are organized by category: Primitives, Layout, Data Display, Form, Navigation, Feedback, Overlay, and Theme.

## CI/CD Pipeline

Every push triggers **lint**, **typecheck**, and **test** stages. On git tags, the pipeline also:

1. **Builds Storybook** and deploys to GitLab Pages
2. **Publishes** to GitLab Package Registry (automatic)
3. **Publishes** to npm public registry (manual trigger)

### Release Process

```bash
# 1. Bump version
npm version patch    # or minor / major

# 2. Push with tags
git push --follow-tags

# 3. CI automatically:
#    - Runs lint + typecheck + tests
#    - Builds dist/ and Storybook
#    - Deploys Storybook to GitLab Pages
#    - Publishes to GitLab Package Registry
#    - (Manual) Publishes to npm
```

### npm Public Publish Setup

To enable publishing to npm:

1. Create the `@arkite` org on [npmjs.com](https://www.npmjs.com/)
2. Generate an npm access token (Automation type)
3. Add `NPM_TOKEN` to GitLab CI/CD Settings > Variables (masked, protected)
4. After tagging a release, manually trigger the `publish:npm` job in the pipeline

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, code style, and PR process.

## License

[MIT](./LICENSE)
