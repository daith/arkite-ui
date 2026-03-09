import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Users" />)
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<PageHeader title="Users" description="Manage users." />)
    expect(screen.getByText('Manage users.')).toBeInTheDocument()
  })

  it('renders actions slot', () => {
    render(
      <PageHeader title="Users" actions={<button>Add User</button>} />
    )
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument()
  })

  it('renders badge slot', () => {
    render(
      <PageHeader title="Users" badge={<span data-testid="badge">Active</span>} />
    )
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })

  it('renders breadcrumb slot', () => {
    render(
      <PageHeader title="Users" breadcrumb={<nav data-testid="crumbs">Home / Users</nav>} />
    )
    expect(screen.getByTestId('crumbs')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <PageHeader title="Users">
        <div data-testid="extra">Extra content</div>
      </PageHeader>
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
  })
})
