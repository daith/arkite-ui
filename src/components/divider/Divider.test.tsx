import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders horizontal separator by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders vertical separator', () => {
    render(<Divider orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders with label text', () => {
    render(<Divider label="OR" />)
    expect(screen.getByText('OR')).toBeInTheDocument()
  })

  it('renders label with separator role', () => {
    render(<Divider label="Section" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})
