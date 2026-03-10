import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoadingOverlay } from './LoadingOverlay'

describe('LoadingOverlay', () => {
  it('renders when visible is true (default)', () => {
    const { container } = render(<LoadingOverlay />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('does not render when visible=false', () => {
    const { container } = render(<LoadingOverlay visible={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows label text', () => {
    render(<LoadingOverlay label="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('renders custom children instead of spinner', () => {
    render(<LoadingOverlay><span data-testid="custom-child">custom</span></LoadingOverlay>)
    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('applies backdrop-blur-sm class when blur=true', () => {
    const { container } = render(<LoadingOverlay blur={true} />)
    expect(container.firstChild).toHaveClass('backdrop-blur-sm')
  })

  it('does not apply backdrop-blur-sm class when blur=false (default)', () => {
    const { container } = render(<LoadingOverlay />)
    expect(container.firstChild).not.toHaveClass('backdrop-blur-sm')
  })

  it('applies custom className', () => {
    const { container } = render(<LoadingOverlay className="my-custom-class" />)
    expect(container.firstChild).toHaveClass('my-custom-class')
  })
})
