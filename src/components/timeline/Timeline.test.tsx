import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Timeline } from './Timeline'

describe('Timeline', () => {
  it('renders items with title', () => {
    render(
      <Timeline
        items={[
          { title: 'First event' },
          { title: 'Second event' },
        ]}
      />
    )
    expect(screen.getByText('First event')).toBeInTheDocument()
    expect(screen.getByText('Second event')).toBeInTheDocument()
  })

  it('renders date when provided', () => {
    render(
      <Timeline items={[{ title: 'Event', date: '2024-01-01' }]} />
    )
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <Timeline
        items={[{ title: 'Event', description: 'Some description' }]}
      />
    )
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('applies variant dot color classes', () => {
    const { container } = render(
      <Timeline items={[{ title: 'Primary', variant: 'primary' }]} />
    )
    const dot = container.querySelector('.bg-primary')
    expect(dot).toBeInTheDocument()
  })

  it('applies success variant', () => {
    const { container } = render(
      <Timeline items={[{ title: 'Success', variant: 'success' }]} />
    )
    expect(container.querySelector('.bg-success')).toBeInTheDocument()
  })

  it('applies default variant when none specified', () => {
    const { container } = render(
      <Timeline items={[{ title: 'Default' }]} />
    )
    expect(container.querySelector('.bg-muted-foreground')).toBeInTheDocument()
  })

  it('renders custom icon instead of dot', () => {
    render(
      <Timeline
        items={[{ title: 'With icon', icon: <span data-testid="custom-icon">★</span> }]}
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('last item has no connector line', () => {
    const { container } = render(
      <Timeline
        items={[
          { title: 'First' },
          { title: 'Second' },
          { title: 'Third' },
        ]}
      />
    )
    const connectors = container.querySelectorAll('.bg-border')
    // Only first two items should have connector lines
    expect(connectors).toHaveLength(2)
  })

  it('single item has no connector line', () => {
    const { container } = render(
      <Timeline items={[{ title: 'Only item' }]} />
    )
    const connectors = container.querySelectorAll('.bg-border')
    expect(connectors).toHaveLength(0)
  })
})
