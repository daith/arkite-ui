import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders with default variant', () => {
    render(<Alert>Something happened</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert.className).toContain('bg-blue-50')
  })

  it('renders children as description', () => {
    render(<Alert>This is a description</Alert>)
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  describe('variant styles', () => {
    it('applies info variant styles', () => {
      render(<Alert variant="info">Info</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-blue-50')
      expect(alert.className).toContain('border-blue-200')
    })

    it('applies success variant styles', () => {
      render(<Alert variant="success">Success</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-green-50')
      expect(alert.className).toContain('border-green-200')
    })

    it('applies warning variant styles', () => {
      render(<Alert variant="warning">Warning</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-yellow-50')
      expect(alert.className).toContain('border-yellow-200')
    })

    it('applies destructive variant styles', () => {
      render(<Alert variant="destructive">Destructive</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-red-50')
      expect(alert.className).toContain('border-red-200')
    })

    it('supports deprecated error variant as alias for destructive', () => {
      render(
        <>
          <Alert data-testid="old" variant="error">Old</Alert>
          <Alert data-testid="new" variant="destructive">New</Alert>
        </>
      )
      expect(screen.getByTestId('old').className).toBe(
        screen.getByTestId('new').className
      )
    })
  })

  it('renders with title', () => {
    render(<Alert title="Alert Title">Description text</Alert>)
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('renders with description only (no title)', () => {
    render(<Alert>Just a description</Alert>)
    expect(screen.getByText('Just a description')).toBeInTheDocument()
  })

  describe('icon rendering', () => {
    it('renders default icon by default', () => {
      render(<Alert>With icon</Alert>)
      const alert = screen.getByRole('alert')
      const svg = alert.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('hides icon when icon prop is false', () => {
      render(<Alert icon={false}>No icon</Alert>)
      const alert = screen.getByRole('alert')
      const svg = alert.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })

    it('renders custom icon when provided', () => {
      render(
        <Alert customIcon={<span data-testid="custom-icon">★</span>}>
          Custom
        </Alert>
      )
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('dismissible', () => {
    it('does not show dismiss button by default', () => {
      render(<Alert>Not dismissible</Alert>)
      expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument()
    })

    it('shows dismiss button when dismissible is true', () => {
      render(<Alert dismissible>Dismissible</Alert>)
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
    })

    it('calls onClose when dismiss button is clicked', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      )

      await user.click(screen.getByRole('button', { name: /dismiss/i }))
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('supports deprecated onDismiss as alias for onClose', async () => {
      const user = userEvent.setup()
      const handleDismiss = vi.fn()
      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Dismissible
        </Alert>
      )

      await user.click(screen.getByRole('button', { name: /dismiss/i }))
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('prefers onClose over deprecated onDismiss when both provided', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      const handleDismiss = vi.fn()
      render(
        <Alert dismissible onClose={handleClose} onDismiss={handleDismiss}>
          Dismissible
        </Alert>
      )

      await user.click(screen.getByRole('button', { name: /dismiss/i }))
      expect(handleClose).toHaveBeenCalledTimes(1)
      expect(handleDismiss).not.toHaveBeenCalled()
    })
  })

  it('applies custom className', () => {
    render(<Alert className="custom-class">Test</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('custom-class')
  })

  it('forwards ref to the root element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>
    render(<Alert ref={ref}>Ref test</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through additional HTML attributes', () => {
    render(<Alert data-testid="my-alert">Attrs</Alert>)
    expect(screen.getByTestId('my-alert')).toBeInTheDocument()
  })
})
