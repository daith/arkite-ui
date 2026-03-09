import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('centers by default', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstChild).toHaveClass('mx-auto')
  })

  it('applies padding by default', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstChild).toHaveClass('px-4')
  })

  it('removes centering when centered=false', () => {
    const { container } = render(<Container centered={false}>Content</Container>)
    expect(container.firstChild).not.toHaveClass('mx-auto')
  })

  it('removes padding when padded=false', () => {
    const { container } = render(<Container padded={false}>Content</Container>)
    expect(container.firstChild).not.toHaveClass('px-4')
  })

  it('applies size variant', () => {
    const { container } = render(<Container size="sm">Content</Container>)
    expect(container.firstChild).toHaveClass('max-w-screen-sm')
  })
})
