import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Kbd } from './Kbd'

describe('Kbd', () => {
  it('renders keyboard shortcut text', () => {
    render(<Kbd>⌘K</Kbd>)
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('renders as kbd element', () => {
    const { container } = render(<Kbd>Ctrl</Kbd>)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })

  it('supports sm size', () => {
    const { container } = render(<Kbd size="sm">K</Kbd>)
    expect(container.firstChild).toHaveClass('min-w-5')
  })

  it('supports md size', () => {
    const { container } = render(<Kbd size="md">K</Kbd>)
    expect(container.firstChild).toHaveClass('min-w-6')
  })
})
