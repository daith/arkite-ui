# Arkite UI

Production-ready React components for SaaS admin panels. Built with Tailwind CSS.

Arkite UI is not another generic component library. It focuses on the components you actually need to build multi-tenant SaaS admin panels — tenant switchers, permission-aware layouts, data tables, stat dashboards, and more.

## Features

- **SaaS-First** — AdminLayout, TenantSwitcher, permission system built-in
- **Multi-Tenant Ready** — Tenant store, tenant switching, role-based rendering
- **Tailwind CSS** — CSS Variables theming with dark mode support
- **TypeScript** — Full type safety with exported types
- **Accessible** — Focus traps, ARIA attributes, keyboard navigation
- **Zustand Stores** — Auth and tenant state management patterns included

## Installation

```bash
npm install @arkite/ui
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss zustand lucide-react
```

## Setup

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
| `StatCard` / `StatGroup` | Metrics display with trend indicators |
| `EmptyState` | Pre-configured empty states (no data, no results, error) |
| `SearchInput` | Search field with debounce and clear button |
| `FileUpload` | Drag-and-drop file upload with validation |

### Hooks

| Hook | Description |
|------|-------------|
| `usePermission` | Role-based permission checks (`can`, `canAny`, `canAll`) |
| `useDataFetch` | Data fetching with loading/error states and refresh |

### Stores

| Store | Description |
|-------|-------------|
| `useAuthStore` | Authentication state, login/logout, user management |
| `useTenantStore` | Current tenant, tenant list, tenant switching |

### UI Primitives

| Component | Description |
|-----------|-------------|
| `Button` | 6 variants (primary, secondary, outline, ghost, destructive, gradient) |
| `Input` | Text input with forwarded ref |
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
| `Alert` | Inline alert messages |
| `Progress` | Progress bar with indeterminate mode |
| `Skeleton` | Loading placeholder |

### Form

| Component | Description |
|-----------|-------------|
| `Form` | Context-based form with field, label, control, message, section |
| `DatePicker` | Date selection |

## Usage Examples

### Admin Layout with Sidebar

```tsx
import { AdminLayout, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem } from '@arkite/ui'
import { LayoutDashboard, Database } from 'lucide-react'

function App() {
  return (
    <AdminLayout
      currentPath={location.pathname}
      onNavigate={(path) => navigate(path)}
    >
      <h1>Dashboard</h1>
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

<DataTable columns={columns} data={items} rowKey={(row) => row.id} />
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

Arkite UI uses CSS Variables for theming. Override variables in your CSS to customize colors:

```css
:root {
  --primary: 250 100% 65%;        /* Brand color */
  --accent: 168 80% 45%;          /* Accent color */
  --background: 0 0% 100%;        /* Page background */
  --foreground: 220 15% 20%;      /* Text color */
  --radius: 0.5rem;               /* Border radius */
}

.dark {
  --primary: 250 100% 70%;
  --background: 220 20% 10%;
  --foreground: 0 0% 95%;
}
```

## Project Structure

```
src/
├── components/       # All components (flat directory)
├── hooks/            # useDataFetch, usePermission
├── stores/           # Zustand stores (auth, tenant)
├── styles/           # CSS Variables and Tailwind layers
├── utils/            # cn() utility
├── tailwind-preset.ts
└── index.ts
```

## Development

```bash
npm install          # Install dependencies
npm run build        # Build the package
npm run dev          # Watch mode
npm run typecheck    # Type check
npm run clean        # Clean dist/
npm run storybook    # Launch Storybook (http://localhost:6006)
npm run build-storybook  # Build static Storybook site
```

### Storybook

This project uses [Storybook](https://storybook.js.org/) for component development and preview. Run `npm run storybook` to browse all components interactively in the browser at `http://localhost:6006`.

## License

MIT
