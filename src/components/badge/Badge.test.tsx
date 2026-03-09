import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('bg-primary')
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="success">OK</Badge>)
    expect(screen.getByText('OK').className).toContain('bg-success')

    rerender(<Badge variant="destructive">Error</Badge>)
    expect(screen.getByText('Error').className).toContain('bg-destructive')

    rerender(<Badge variant="warning">Warn</Badge>)
    expect(screen.getByText('Warn').className).toContain('bg-warning')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Test</Badge>)
    expect(screen.getByText('Test').className).toContain('custom-class')
  })
})
