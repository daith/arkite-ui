import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { TrendingUp, LineChart, FileText, Users } from 'lucide-react'
import { AdminLayout, type AdminNavGroup } from '../../components/admin-layout'
import { Badge } from '../../components/badge'
import { SegmentedControl } from '../../components/segmented-control'

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

/* ------------------------------------------------------------------ */
/*  sidebarVariant="rail" — 72px icon rail                             */
/*  Each nav group becomes one rail item (icon + small label).         */
/*  Sub-items live in the optional `subNav` slot above the main area.  */
/* ------------------------------------------------------------------ */

const railNavigation: AdminNavGroup[] = [
  {
    label: '市場',
    path: '/market',
    icon: <TrendingUp size={20} />,
    items: [
      { path: '/market/tw', label: '台股' },
      { path: '/market/us', label: '美股' },
      { path: '/market/crypto', label: '加密貨幣' },
    ],
  },
  {
    label: '經濟指標',
    path: '/indicators',
    icon: <LineChart size={20} />,
    items: [
      { path: '/indicators/rates', label: '利率' },
      { path: '/indicators/inflation', label: '通膨' },
    ],
  },
  {
    label: '研究',
    path: '/research',
    icon: <FileText size={20} />,
    items: [
      { path: '/research/reports', label: '研究報告' },
      { path: '/research/notes', label: '筆記' },
    ],
  },
  {
    label: '管理',
    path: '/admin',
    icon: <Users size={20} />,
    items: [
      { path: '/admin/users', label: '使用者' },
    ],
  },
]

const RailDemo = ({ withSubNav }: { withSubNav: boolean }) => {
  const [path, setPath] = useState('/market/tw')
  const activeGroup = railNavigation.find((g) =>
    g.items.some((i) => path === i.path || path.startsWith(`${i.path}/`))
    || (g.path && (path === g.path || path.startsWith(`${g.path}/`)))
  )

  return (
    <AdminLayout
      sidebarVariant="rail"
      currentPath={path}
      onNavigate={setPath}
      navigation={railNavigation}
      brand={{ name: 'ark-finance', shortName: 'AF' }}
      user={{ name: 'Wilson', avatarFallback: 'W', roleLabel: 'Analyst', roleBadgeVariant: 'info' }}
      hasPermission={() => true}
      onLogout={() => alert('Logout')}
      subNav={
        withSubNav && activeGroup ? (
          <SegmentedControl
            size="sm"
            options={activeGroup.items.map((i) => ({ value: i.path, label: i.label }))}
            value={activeGroup.items.find((i) => path === i.path || path.startsWith(`${i.path}/`))?.path ?? activeGroup.items[0].path}
            onChange={(v) => setPath(v)}
          />
        ) : undefined
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{activeGroup?.label ?? 'Dashboard'}</h1>
        <p className="text-muted-foreground">Current path: {path}</p>
        <p className="text-sm text-muted-foreground">
          {withSubNav
            ? '在頂部 subNav 切換同區塊的子項；左側 rail 切換大類。'
            : 'subNav 未提供 — 只有左側 rail 導航。'}
        </p>
      </div>
    </AdminLayout>
  )
}

export const RailWithSubNav: StoryFn = () => <RailDemo withSubNav />
RailWithSubNav.storyName = 'Rail Variant (with subNav)'

export const RailWithoutSubNav: StoryFn = () => <RailDemo withSubNav={false} />
RailWithoutSubNav.storyName = 'Rail Variant (no subNav)'
