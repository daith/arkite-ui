/**
 * Breadcrumb Configuration
 * 根據當前路徑和用戶角色生成麵包屑
 */

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageConfig {
  label: string
  group?: string
  groupLabel?: string
}

// 頁面配置 - 統一使用英文
const PAGE_CONFIG: Record<string, PageConfig> = {
  // 共用頁面
  '/dashboard': { label: 'Dashboard' },
  '/settings': { label: 'Settings' },

  // 資料採集 (Data Collection)
  '/sources': { label: 'Sources', group: 'data', groupLabel: 'Data' },
  '/runs': { label: 'Runs', group: 'data', groupLabel: 'Data' },
  '/items': { label: 'Items', group: 'data', groupLabel: 'Data' },
  '/schedules': { label: 'Schedules', group: 'data', groupLabel: 'Data' },

  // Platform Admin - 平台管理
  '/companies': { label: 'Tenants', group: 'platform', groupLabel: 'Platform' },
  '/users': { label: 'Users', group: 'platform', groupLabel: 'Platform' },
  '/usage': { label: 'Usage', group: 'system', groupLabel: 'System' },
  '/audit-logs': { label: 'Audit Logs', group: 'system', groupLabel: 'System' },

  // Tenant Admin - 整合
  '/webhooks': { label: 'Webhooks', group: 'integrations', groupLabel: 'Integrations' },
  '/api-keys': { label: 'API Keys', group: 'integrations', groupLabel: 'Integrations' },
  '/team': { label: 'Team', group: 'manage', groupLabel: 'Manage' },
}

// 群組首頁路徑
const GROUP_HOME: Record<string, string> = {
  data: '/sources',
  platform: '/companies',
  system: '/usage',
  integrations: '/webhooks',
  manage: '/team',
}

/**
 * 根據路徑生成麵包屑
 * @param pathname - 當前路徑
 * @param includeGroup - 是否包含群組層級 (預設 true)
 */
export function getBreadcrumbItems(
  pathname: string,
  includeGroup: boolean = true
): BreadcrumbItem[] {
  const config = PAGE_CONFIG[pathname]

  if (!config) {
    // 未知頁面，返回基本麵包屑
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: pathname.replace('/', '').replace(/-/g, ' ') },
    ]
  }

  const items: BreadcrumbItem[] = []

  // Dashboard 頁面只顯示自己
  if (pathname === '/dashboard') {
    return [{ label: 'Dashboard' }]
  }

  // 其他頁面從 Dashboard 開始
  items.push({ label: 'Dashboard', href: '/dashboard' })

  // 如果有群組且需要顯示群組
  if (includeGroup && config.group && config.groupLabel) {
    const groupHome = GROUP_HOME[config.group]
    // 如果當前頁面就是群組首頁，不加群組連結
    if (groupHome !== pathname) {
      items.push({ label: config.groupLabel, href: groupHome })
    }
  }

  // 當前頁面 (無連結)
  items.push({ label: config.label })

  return items
}

/**
 * 簡化版本 - 只顯示 Dashboard > Current Page
 * 適用於不需要顯示群組的情況
 */
export function getSimpleBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  return getBreadcrumbItems(pathname, false)
}

export default getBreadcrumbItems
