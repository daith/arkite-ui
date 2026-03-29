import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmptyState, NoResults, NoData, ErrorState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No items" description="There are no items to display." />)
    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('There are no items to display.')).toBeInTheDocument()
  })

  it('renders action element', () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('renders different icons for each variant', () => {
    const { container: defaultContainer } = render(
      <EmptyState variant="default" data-testid="default" />
    )
    const { container: searchContainer } = render(
      <EmptyState variant="search" data-testid="search" />
    )
    const { container: errorContainer } = render(<EmptyState variant="error" data-testid="error" />)
    const { container: noDataContainer } = render(
      <EmptyState variant="no-data" data-testid="no-data" />
    )

    // Each variant should render an SVG icon (from lucide-react)
    expect(defaultContainer.querySelector('svg')).toBeInTheDocument()
    expect(searchContainer.querySelector('svg')).toBeInTheDocument()
    expect(errorContainer.querySelector('svg')).toBeInTheDocument()
    expect(noDataContainer.querySelector('svg')).toBeInTheDocument()

    // The SVGs should differ between variants
    const defaultSvg = defaultContainer.querySelector('svg')!.outerHTML
    const searchSvg = searchContainer.querySelector('svg')!.outerHTML
    const errorSvg = errorContainer.querySelector('svg')!.outerHTML
    expect(defaultSvg).not.toEqual(searchSvg)
    expect(searchSvg).not.toEqual(errorSvg)
  })

  it('uses custom icon when provided', () => {
    render(<EmptyState icon={<span data-testid="custom-icon">★</span>} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies size variant classes', () => {
    const { container: smContainer } = render(<EmptyState size="sm" title="Small" />)
    const { container: lgContainer } = render(<EmptyState size="lg" title="Large" />)

    expect(smContainer.firstElementChild!.className).toContain('py-8')
    expect(lgContainer.firstElementChild!.className).toContain('py-16')
  })

  it('does not render title/description/action when not provided', () => {
    const { container } = render(<EmptyState />)
    expect(container.querySelector('h3')).not.toBeInTheDocument()
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })
})

describe('NoResults', () => {
  it('renders default title and description', () => {
    render(<NoResults />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filters.')).toBeInTheDocument()
  })

  it('allows overriding title and description', () => {
    render(<NoResults title="Nothing here" description="Custom desc" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.getByText('Custom desc')).toBeInTheDocument()
  })
})

describe('NoData', () => {
  it('renders default title and description', () => {
    render(<NoData />)
    expect(screen.getByText('No data yet')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating your first item.')).toBeInTheDocument()
  })
})

describe('ErrorState', () => {
  it('renders default title and description', () => {
    render(<ErrorState />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An error occurred while loading the data.')).toBeInTheDocument()
  })

  it('allows overriding title and description', () => {
    render(<ErrorState title="Oops" description="Try again later." />)
    expect(screen.getByText('Oops')).toBeInTheDocument()
    expect(screen.getByText('Try again later.')).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', async () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    const button = screen.getByRole('button', { name: 'Try again' })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('uses custom retryLabel', () => {
    render(<ErrorState onRetry={() => {}} retryLabel="Reload" />)
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('prefers action over onRetry when both are provided', () => {
    render(<ErrorState onRetry={() => {}} action={<button>Custom</button>} />)
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })
})
