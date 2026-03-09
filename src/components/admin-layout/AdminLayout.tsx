// TODO: decouple from app-specific imports
// This component uses react-router-dom (Outlet, useNavigate, useLocation)
// and app-specific constants (PERMISSIONS). Consumers should configure these.

import { type ReactNode } from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarToggle,
  useSidebar,
} from '../sidebar/Sidebar'
import { Navbar, NavbarContent, NavbarSpacer } from '../navbar/Navbar'
import { TenantSwitcher } from '../tenant-switcher/TenantSwitcher'
import { Avatar } from '../avatar/Avatar'
import { Badge } from '../badge/Badge'
import { ToastContainer } from '../toast/Toast'
import { useAuthStore } from '../../stores/authStore'
import { usePermission, type Permission } from '../../hooks/usePermission'
import {
  LayoutDashboard,
  Database,
  Play,
  FileText,
  Clock,
  Users,
  Building2,
  Settings,
  LogOut,
  Webhook,
  Key,
  UserCog,
  Activity,
  ScrollText,
  Languages,
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  /** 需要的權限 (任一即可) */
  permissions?: Permission[]
}

interface NavGroup {
  label: string
  items: NavItem[]
  /** 只有平台管理員可見 */
  platformOnly?: boolean
  /** 只有租戶用戶可見 */
  tenantOnly?: boolean
}

// Navigation items definition
const allNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    label: 'Platform',
    platformOnly: true,
    items: [
      {
        path: '/companies',
        label: 'Tenants',
        icon: <Building2 className="h-5 w-5" />,
        permissions: ['companies:view'],
      },
      {
        path: '/users',
        label: 'Users',
        icon: <UserCog className="h-5 w-5" />,
        permissions: ['platform_users:view'],
      },
    ],
  },
  {
    label: 'Data',
    items: [
      {
        path: '/sources',
        label: 'Sources',
        icon: <Database className="h-5 w-5" />,
        permissions: ['sources:view'],
      },
      {
        path: '/runs',
        label: 'Runs',
        icon: <Play className="h-5 w-5" />,
        permissions: ['runs:view'],
      },
      {
        path: '/items',
        label: 'Items',
        icon: <FileText className="h-5 w-5" />,
        permissions: ['items:view'],
      },
      {
        path: '/schedules',
        label: 'Schedules',
        icon: <Clock className="h-5 w-5" />,
        permissions: ['schedules:view'],
      },
    ],
  },
  {
    label: 'Integrations',
    items: [
      {
        path: '/webhooks',
        label: 'Webhooks',
        icon: <Webhook className="h-5 w-5" />,
        permissions: ['webhooks:view'],
      },
      {
        path: '/api-keys',
        label: 'API Keys',
        icon: <Key className="h-5 w-5" />,
        permissions: ['api_keys:view'],
      },
    ],
  },
  {
    label: 'System',
    platformOnly: true,
    items: [
      {
        path: '/usage',
        label: 'Usage',
        icon: <Activity className="h-5 w-5" />,
        permissions: ['usage:view'],
      },
      {
        path: '/audit-logs',
        label: 'Audit Logs',
        icon: <ScrollText className="h-5 w-5" />,
        permissions: ['audit_logs:view'],
      },
      {
        path: '/translations',
        label: 'Translations',
        icon: <Languages className="h-5 w-5" />,
        permissions: ['settings:edit'],
      },
    ],
  },
  {
    label: 'Manage',
    items: [
      {
        path: '/team',
        label: 'Team',
        icon: <Users className="h-5 w-5" />,
        permissions: ['team:view'],
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        path: '/settings',
        label: 'Settings',
        icon: <Settings className="h-5 w-5" />,
        permissions: ['settings:view'],
      },
    ],
  },
]

// Sidebar Logo Header - handles collapsed state
function SidebarLogoHeader() {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <SidebarHeader className="flex items-center justify-between">
      {collapsed ? (
        // Collapsed: show icon as expand button
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors mx-auto"
          title="Expand menu"
        >
          A
        </button>
      ) : (
        // Expanded: show full logo and collapse button
        <>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              A
            </div>
            <span className="font-semibold">Ark Harvest</span>
          </div>
          <SidebarToggle />
        </>
      )}
    </SidebarHeader>
  )
}

// 角色顯示名稱對照
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  super_admin: 'Super Admin',
  system_staff: 'Platform Staff',
  tenant_admin: 'Tenant Admin',
  member: 'Member',
  viewer: 'Viewer',
}

// 角色徽章顏色對照
const ROLE_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
  super_admin: 'warning',
  system_staff: 'success',
  tenant_admin: 'default',
  member: 'secondary',
  viewer: 'secondary',
}

export interface AdminLayoutProps {
  /** Current pathname for active state */
  currentPath: string
  /** Navigate function */
  onNavigate: (path: string) => void
  /** Main content */
  children: ReactNode
}

export function AdminLayout({ currentPath, onNavigate, children }: AdminLayoutProps) {
  const { user, logout } = useAuthStore()
  const { isPlatformAdmin, role, canAny } = usePermission()

  // 根據權限過濾導航
  const navGroups = allNavGroups
    .filter((group) => {
      // 平台專屬頁面
      if (group.platformOnly && !isPlatformAdmin) return false
      // 租戶專屬頁面
      if (group.tenantOnly && isPlatformAdmin) return false
      return true
    })
    .map((group) => ({
      ...group,
      // 過濾沒有權限的項目
      items: group.items.filter((item) => {
        if (!item.permissions || item.permissions.length === 0) return true
        return canAny(item.permissions)
      }),
    }))
    // 移除沒有項目的群組
    .filter((group) => group.items.length > 0)

  const handleLogout = () => {
    logout()
    onNavigate('/login')
  }

  // 取得角色顯示文字
  const getRoleDisplay = () => {
    if (!role) return 'Unknown'
    return ROLE_DISPLAY_NAMES[role] || role
  }

  // 取得角色徽章顏色
  const getRoleBadgeVariant = () => {
    if (!role) return 'secondary' as const
    return ROLE_BADGE_VARIANTS[role] || ('secondary' as const)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar collapsible defaultCollapsed={false}>
        <SidebarLogoHeader />

        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label} label={group.label}>
              {group.items.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  active={currentPath === item.path}
                  onClick={() => onNavigate(item.path)}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarItem
            icon={<LogOut className="h-5 w-5" />}
            onClick={handleLogout}
          >
            Logout
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar sticky bordered>
          <NavbarContent align="left">
            {/* Tenant Switcher - Platform Admin Only */}
            {isPlatformAdmin && <TenantSwitcher />}
            {/* Tenant Name - Tenant Users */}
            {!isPlatformAdmin && user?.tenant_name && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.tenant_name}</span>
              </div>
            )}
          </NavbarContent>
          <NavbarSpacer />
          <NavbarContent align="right">
            <div className="flex items-center gap-3">
              <Avatar fallback={user?.name?.charAt(0) || 'U'} size="sm" />
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{user?.name || user?.email}</p>
                  <Badge variant={getRoleBadgeVariant()} className="text-xs">
                    {getRoleDisplay()}
                  </Badge>
                </div>
                {user?.email && user?.name && (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
          </NavbarContent>
        </Navbar>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" />
    </div>
  )
}
