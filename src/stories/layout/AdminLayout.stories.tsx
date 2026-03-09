import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { AdminLayout, type AdminNavGroup } from '../../components/admin-layout'
import { Badge } from '../../components/badge'

const navigation: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Platform',
    visibleWhen: (ctx) => ctx.hasPermission?.(['platform:access']) ?? false,
    items: [
      { path: '/tenants', label: 'Tenants' },
      { path: '/platform-users', label: 'Users' },
    ],
  },
  {
    label: 'Data',
    items: [
      { path: '/sources', label: 'Sources', permissions: ['sources:view'] },
      {
        path: '/runs',
        label: 'Runs',
        badge: <Badge variant="info" className="text-[10px] px-1.5 py-0">3</Badge>,
      },
      { path: '/items', label: 'Items' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { path: '/webhooks', label: 'Webhooks' },
      { path: '/docs', label: 'API Docs', external: true },
    ],
  },
  {
    label: 'Settings',
    items: [
      { path: '/settings', label: 'Settings' },
    ],
  },
]

const meta: Meta = {
  title: 'Layout/AdminLayout',
  parameters: { layout: 'fullscreen' },
}

export default meta

const DefaultDemo = () => {
  const [path, setPath] = useState('/dashboard')
  return (
    <AdminLayout
      currentPath={path}
      onNavigate={setPath}
      navigation={navigation}
      brand={{ name: 'Arkite', shortName: 'A' }}
      user={{
        name: 'Wilson Chen',
        email: 'wilson@example.com',
        avatarFallback: 'WC',
        roleLabel: 'Admin',
        roleBadgeVariant: 'success',
      }}
      hasPermission={() => true}
      onLogout={() => alert('Logout clicked')}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {path.replace('/', '').replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase()) || 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">Current path: {path}</p>
      </div>
    </AdminLayout>
  )
}

export const Default: StoryFn = () => <DefaultDemo />

const WithBasePathDemo = () => {
  const [path, setPath] = useState('/admin/dashboard')
  return (
    <AdminLayout
      currentPath={path}
      onNavigate={setPath}
      basePath="/admin"
      navigation={navigation}
      brand={{ name: 'My SaaS', shortName: 'MS' }}
      user={{
        name: 'Demo User',
        email: 'demo@example.com',
        avatarFallback: 'DU',
      }}
      hasPermission={() => true}
    >
      <div>
        <h1 className="text-2xl font-bold">With basePath="/admin"</h1>
        <p className="text-muted-foreground mt-2">Current path: {path}</p>
      </div>
    </AdminLayout>
  )
}

export const WithBasePath: StoryFn = () => <WithBasePathDemo />

const CustomRenderLinkDemo = () => {
  const [path, setPath] = useState('/dashboard')
  return (
    <AdminLayout
      currentPath={path}
      onNavigate={setPath}
      navigation={navigation}
      brand={{ name: 'Next.js App' }}
      user={{ name: 'User', avatarFallback: 'U' }}
      hasPermission={() => true}
      renderLink={({ href, children, className }) => (
        // In a real app, this would be <Link href={href}>
        <a href={href} className={className} onClick={(e) => { e.preventDefault(); setPath(href) }}>
          {children}
        </a>
      )}
    >
      <div>
        <h1 className="text-2xl font-bold">Custom renderLink</h1>
        <p className="text-muted-foreground mt-2">
          Using renderLink prop for framework-specific Link components
        </p>
      </div>
    </AdminLayout>
  )
}

export const CustomRenderLink: StoryFn = () => <CustomRenderLinkDemo />
