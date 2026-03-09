import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <p>Hidden</p>
      </Modal>
    )
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('renders title and description', () => {
    render(
      <Modal open onClose={() => {}} title="My Title" description="My Description">
        Content
      </Modal>
    )
    expect(screen.getByText('My Title')).toBeInTheDocument()
    expect(screen.getByText('My Description')).toBeInTheDocument()
  })

  it('calls onClose when escape is pressed', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Content
      </Modal>
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not close on escape when closeOnEscape is false', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} closeOnEscape={false}>
        Content
      </Modal>
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Content
      </Modal>
    )
    // The backdrop is the div with aria-hidden="true"
    const backdrops = document.querySelectorAll('[aria-hidden="true"]')
    const backdrop = backdrops[backdrops.length - 1]
    await userEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not close on backdrop click when closeOnBackdropClick is false', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} closeOnBackdropClick={false}>
        Content
      </Modal>
    )
    const backdrops = document.querySelectorAll('[aria-hidden="true"]')
    const backdrop = backdrops[backdrops.length - 1]
    await userEvent.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders close button and calls onClose when clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Test">
        Content
      </Modal>
    )
    const closeBtn = screen.getByText('Close').closest('button')!
    await userEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('hides close button when showCloseButton is false', () => {
    render(
      <Modal open onClose={() => {}} title="Test" showCloseButton={false}>
        Content
      </Modal>
    )
    expect(screen.queryByText('Close')).not.toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <Modal open onClose={() => {}} footer={<button>Save</button>}>
        Content
      </Modal>
    )
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('has correct aria attributes', () => {
    render(
      <Modal open onClose={() => {}} title="Dialog Title" description="Dialog Description">
        Content
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description')
  })
})
