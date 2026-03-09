import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with status role and loading label', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('renders screen reader text', () => {
    render(<Spinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    const { rerender } = render(<Spinner size="sm" />)
    expect(screen.getByRole('status')).toHaveClass('h-4', 'w-4')

    rerender(<Spinner size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('h-8', 'w-8')
  })

  it('accepts custom className', () => {
    render(<Spinner className="text-primary" />)
    expect(screen.getByRole('status')).toHaveClass('text-primary')
  })
})
