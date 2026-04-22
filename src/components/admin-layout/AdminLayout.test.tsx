import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AdminLayout, type AdminLayoutProps } from './AdminLayout'

const defaultProps: AdminLayoutProps = {
  currentPath: '/dashboard',
  brand: { name: 'Acme Admin' },
  navigation: [
    {
      label: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/users', label: 'Users' },
      ],
    },
  ],
  onNavigate: vi.fn(),
  children: <div>Page Content</div>,
}

function renderLayout(overrides: Partial<AdminLayoutProps> = {}) {
  return render(<AdminLayout {...defaultProps} {...overrides} />)
}

describe('AdminLayout', () => {
  it('renders brand name', () => {
    renderLayout()
    expect(screen.getByText('Acme Admin')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    renderLayout()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('calls onNavigate when a nav item is clicked', async () => {
    const onNavigate = vi.fn()
    renderLayout({ onNavigate })
    await userEvent.click(screen.getByText('Users'))
    expect(onNavigate).toHaveBeenCalledWith('/users')
  })

  it('prepends basePath to onNavigate path', async () => {
    const onNavigate = vi.fn()
    renderLayout({ onNavigate, basePath: '/admin' })
    await userEvent.click(screen.getByText('Users'))
    expect(onNavigate).toHaveBeenCalledWith('/admin/users')
  })

  it('renders children as main content', () => {
    renderLayout({ children: <div>My Page</div> })
    expect(screen.getByText('My Page')).toBeInTheDocument()
  })

  it('renders user name when user config is provided', () => {
    renderLayout({ user: { name: 'Alice', email: 'alice@example.com' } })
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('renders user email as primary text when name is absent', () => {
    renderLayout({ user: { email: 'bob@example.com' } })
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('renders user role badge', () => {
    renderLayout({ user: { name: 'Alice', roleLabel: 'Admin' } })
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('filters nav items based on hasPermission callback', () => {
    const hasPermission = vi.fn((perms: string[]) => perms.includes('read'))
    renderLayout({
      hasPermission,
      navigation: [
        {
          label: 'Main',
          items: [
            { path: '/public', label: 'Public Page' },
            { path: '/admin', label: 'Admin Page', permissions: ['admin'] },
            { path: '/read', label: 'Read Page', permissions: ['read'] },
          ],
        },
      ],
    })
    expect(screen.getByText('Public Page')).toBeInTheDocument()
    expect(screen.getByText('Read Page')).toBeInTheDocument()
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument()
  })

  it('hides entire group when visibleWhen returns false', () => {
    renderLayout({
      navigation: [
        {
          label: 'Hidden Group',
          visibleWhen: () => false,
          items: [{ path: '/secret', label: 'Secret Item' }],
        },
        {
          label: 'Visible Group',
          items: [{ path: '/open', label: 'Open Item' }],
        },
      ],
    })
    expect(screen.queryByText('Secret Item')).not.toBeInTheDocument()
    expect(screen.getByText('Open Item')).toBeInTheDocument()
  })

  it('calls onLogout when logout item is clicked', async () => {
    const onLogout = vi.fn()
    renderLayout({ onLogout })
    await userEvent.click(screen.getByText('Logout'))
    expect(onLogout).toHaveBeenCalledOnce()
  })

  it('does not render logout when onLogout is not provided', () => {
    renderLayout({ onLogout: undefined })
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('renders navbarLeft content', () => {
    renderLayout({ navbarLeft: <span data-testid="nav-left">Left Content</span> })
    expect(screen.getByTestId('nav-left')).toBeInTheDocument()
  })

  it('renders navbarRight content', () => {
    renderLayout({ navbarRight: <span data-testid="nav-right">Right Content</span> })
    expect(screen.getByTestId('nav-right')).toBeInTheDocument()
  })

  it('renders custom sidebarFooter instead of default logout', () => {
    const onLogout = vi.fn()
    renderLayout({
      onLogout,
      sidebarFooter: <button>Custom Footer</button>,
    })
    expect(screen.getByText('Custom Footer')).toBeInTheDocument()
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('renders navigation group labels', () => {
    renderLayout({
      navigation: [
        { label: 'Section A', items: [{ path: '/a', label: 'Item A' }] },
        { label: 'Section B', items: [{ path: '/b', label: 'Item B' }] },
      ],
    })
    expect(screen.getByText('Section A')).toBeInTheDocument()
    expect(screen.getByText('Section B')).toBeInTheDocument()
  })

  it('renders badge content on nav items', () => {
    renderLayout({
      navigation: [
        {
          label: 'Main',
          items: [
            { path: '/inbox', label: 'Inbox', badge: <span data-testid="badge-count">5</span> },
          ],
        },
      ],
    })
    expect(screen.getByTestId('badge-count')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders subNav slot below navbar when provided', () => {
    renderLayout({ subNav: <div data-testid="sub-nav">Sub Nav Content</div> })
    expect(screen.getByTestId('sub-nav')).toBeInTheDocument()
  })

  it('does not render subNav container when slot is empty', () => {
    const { container } = renderLayout()
    expect(container.querySelector('[data-testid="sub-nav"]')).toBeNull()
  })

  describe('sidebarVariant="rail"', () => {
    const railNavigation = [
      {
        label: 'Market',
        path: '/market',
        icon: <span data-testid="market-icon">M</span>,
        items: [
          { path: '/market/tw', label: 'TW Stocks' },
          { path: '/market/us', label: 'US Stocks' },
        ],
      },
      {
        label: 'Research',
        items: [
          { path: '/research/reports', label: 'Reports' },
        ],
      },
    ]

    it('renders one rail button per visible group', () => {
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/market/tw',
      })
      expect(screen.getByRole('button', { name: 'Market' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Research' })).toBeInTheDocument()
    })

    it('hides individual nav item labels from the rail', () => {
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/market/tw',
      })
      expect(screen.queryByText('TW Stocks')).not.toBeInTheDocument()
      expect(screen.queryByText('Reports')).not.toBeInTheDocument()
    })

    it('renders group icon when provided', () => {
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/market/tw',
      })
      expect(screen.getByTestId('market-icon')).toBeInTheDocument()
    })

    it('marks group as active via aria-current when current path is within group.path', () => {
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/market/tw',
      })
      expect(screen.getByRole('button', { name: 'Market' })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('button', { name: 'Research' })).not.toHaveAttribute('aria-current')
    })

    it('marks group as active when a nested item path matches (no group.path)', () => {
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/research/reports',
      })
      expect(screen.getByRole('button', { name: 'Research' })).toHaveAttribute('aria-current', 'page')
    })

    it('navigates to group.path on rail click when provided', async () => {
      const onNavigate = vi.fn()
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/research/reports',
        onNavigate,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Market' }))
      expect(onNavigate).toHaveBeenCalledWith('/market')
    })

    it('falls back to first item path when group.path is absent', async () => {
      const onNavigate = vi.fn()
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/market/tw',
        onNavigate,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Research' }))
      expect(onNavigate).toHaveBeenCalledWith('/research/reports')
    })

    it('prepends basePath when navigating from rail', async () => {
      const onNavigate = vi.fn()
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/app/market',
        basePath: '/app',
        onNavigate,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Research' }))
      expect(onNavigate).toHaveBeenCalledWith('/app/research/reports')
    })

    it('renders subNav alongside rail', () => {
      renderLayout({
        sidebarVariant: 'rail',
        navigation: railNavigation,
        currentPath: '/market/tw',
        subNav: <div data-testid="rail-sub-nav">Pills</div>,
      })
      expect(screen.getByTestId('rail-sub-nav')).toBeInTheDocument()
    })
  })
})
