import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CollapsibleSection } from './CollapsibleSection'

describe('CollapsibleSection', () => {
  it('renders the title', () => {
    render(<CollapsibleSection title="Settings">Content</CollapsibleSection>)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('shows content when defaultOpen=true', () => {
    render(
      <CollapsibleSection title="Settings" defaultOpen>
        Visible content
      </CollapsibleSection>
    )
    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('hides content when defaultOpen=false', () => {
    render(
      <CollapsibleSection title="Settings" defaultOpen={false}>
        Hidden content
      </CollapsibleSection>
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('toggles content on header click', async () => {
    const user = userEvent.setup()
    render(
      <CollapsibleSection title="Settings" defaultOpen={false}>
        Toggle me
      </CollapsibleSection>
    )
    expect(screen.queryByText('Toggle me')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Toggle me')).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(screen.queryByText('Toggle me')).not.toBeInTheDocument()
  })

  it('works in controlled mode', async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <CollapsibleSection title="Settings" open={false} onOpenChange={onOpenChange}>
        Controlled
      </CollapsibleSection>
    )
    expect(screen.queryByText('Controlled')).not.toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenCalledWith(true)

    // Content still hidden because parent hasn't updated `open`
    expect(screen.queryByText('Controlled')).not.toBeInTheDocument()

    rerender(
      <CollapsibleSection title="Settings" open onOpenChange={onOpenChange}>
        Controlled
      </CollapsibleSection>
    )
    expect(screen.getByText('Controlled')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(
      <CollapsibleSection title="Settings" description="Advanced options">
        Content
      </CollapsibleSection>
    )
    expect(screen.getByText('Advanced options')).toBeInTheDocument()
  })

  it('renders rightSlot', () => {
    render(
      <CollapsibleSection title="Settings" rightSlot={<span>3 items</span>}>
        Content
      </CollapsibleSection>
    )
    expect(screen.getByText('3 items')).toBeInTheDocument()
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    render(
      <CollapsibleSection title="Settings" defaultOpen={false} disabled>
        Should stay hidden
      </CollapsibleSection>
    )
    await user.click(screen.getByRole('button'))
    expect(screen.queryByText('Should stay hidden')).not.toBeInTheDocument()
  })

  it('applies disabled opacity', () => {
    const { container } = render(
      <CollapsibleSection title="Settings" disabled>
        Content
      </CollapsibleSection>
    )
    expect(container.firstChild).toHaveClass('opacity-50')
  })

  it('applies custom className', () => {
    const { container } = render(
      <CollapsibleSection title="Settings" className="my-custom-class">
        Content
      </CollapsibleSection>
    )
    expect(container.firstChild).toHaveClass('my-custom-class')
  })

  it('sets aria-expanded based on open state', async () => {
    const user = userEvent.setup()
    render(
      <CollapsibleSection title="Settings" defaultOpen={false}>
        Content
      </CollapsibleSection>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('rotates chevron icon when open', () => {
    const { container } = render(
      <CollapsibleSection title="Settings" defaultOpen>
        Content
      </CollapsibleSection>
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('rotate-90')
  })
})
