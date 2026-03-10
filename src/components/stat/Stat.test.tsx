import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Stat, StatCard, StatGroup } from './Stat'

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat label="Revenue" value="$12,345" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$12,345')).toBeInTheDocument()
  })

  it('renders change and helpText', () => {
    render(<Stat label="Users" value="1,200" change="+12%" helpText="vs last month" />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('renders trend up with success styling', () => {
    render(<Stat label="Sales" value="500" change="+8%" trend="up" />)
    const trendSpan = screen.getByText('+8%').closest('span')
    expect(trendSpan!.className).toContain('text-emerald-700')
    // Should render a TrendingUp icon (svg)
    expect(trendSpan!.querySelector('svg')).toBeInTheDocument()
  })

  it('renders trend down with destructive styling', () => {
    render(<Stat label="Churn" value="3%" change="-2%" trend="down" />)
    const trendSpan = screen.getByText('-2%').closest('span')
    expect(trendSpan!.className).toContain('text-destructive')
  })

  it('renders trend neutral with muted styling', () => {
    render(<Stat label="Stable" value="100" change="0%" trend="neutral" />)
    const trendSpan = screen.getByText('0%').closest('span')
    expect(trendSpan!.className).toContain('text-muted-foreground')
  })

  it('renders change without trend icon when trend is not set', () => {
    render(<Stat label="Count" value="42" change="+5" />)
    const changeSpan = screen.getByText('+5')
    expect(changeSpan.className).toContain('text-muted-foreground')
    expect(changeSpan.querySelector('svg')).not.toBeInTheDocument()
  })

  it('shows skeleton loaders when loading', () => {
    const { container } = render(<Stat label="Revenue" value="$12,345" loading />)
    // Label should still be visible
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    // Value should NOT be visible
    expect(screen.queryByText('$12,345')).not.toBeInTheDocument()
    // Should have pulse animation elements
    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders icon when provided', () => {
    render(<Stat label="Test" value="123" icon={<span data-testid="stat-icon">📊</span>} />)
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument()
  })
})

describe('StatCard', () => {
  it('renders with default variant', () => {
    const { container } = render(<StatCard label="Metric" value="99" />)
    const card = container.firstElementChild!
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('rounded-lg')
  })

  it('renders bordered variant', () => {
    const { container } = render(<StatCard label="Metric" value="99" variant="bordered" />)
    const card = container.firstElementChild!
    expect(card.className).toContain('border')
  })

  it('renders filled variant', () => {
    const { container } = render(<StatCard label="Metric" value="99" variant="filled" />)
    const card = container.firstElementChild!
    expect(card.className).toContain('bg-muted/50')
  })
})

describe('StatGroup', () => {
  it('renders children', () => {
    render(
      <StatGroup>
        <Stat label="A" value="1" />
        <Stat label="B" value="2" />
      </StatGroup>
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('applies grid layout', () => {
    const { container } = render(
      <StatGroup columns={3}>
        <Stat label="X" value="10" />
      </StatGroup>
    )
    const grid = container.firstElementChild!
    expect(grid.className).toContain('grid')
    expect(grid.className).toContain('lg:grid-cols-3')
  })
})
