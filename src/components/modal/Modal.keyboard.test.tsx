import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

// Keyboard interaction spec tests based on the WAI-ARIA APG modal dialog pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//
// Passing tests document behavior that already conforms to the pattern.
// `it.fails` tests (with a FINDING comment) pin down current gaps — once the
// gap is fixed, remove `.fails` and the test becomes a regression guard.

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Keyboard spec"
        footer={<button>Save</button>}
      >
        <input placeholder="Name" />
        <button>Body action</button>
      </Modal>
    </>
  )
}

describe('Modal keyboard interaction (APG dialog pattern)', () => {
  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <Modal open onClose={() => {}} title="Spec">
        Content
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('moves focus into the dialog on open (initial focus on first focusable element)', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))

    const dialog = screen.getByRole('dialog')
    // First focusable element in DOM order is the header close button
    const closeButton = screen.getByRole('button', { name: 'Close' })
    expect(closeButton).toHaveFocus()
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('Tab moves through focusable elements and wraps from last back to first', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))

    // Initial focus: close button (first focusable)
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()

    await user.tab()
    expect(screen.getByPlaceholderText('Name')).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Body action' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()

    // Tab from the last focusable element wraps back to the first — focus
    // never escapes the dialog
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('Shift+Tab wraps from first focusable element back to last', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))

    // Initial focus is on the first focusable element (close button)
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()

    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()
  })

  it('Escape closes the dialog and calls onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Spec">
        Content
      </Modal>
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('returns focus to the trigger element after closing', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Open modal' })

    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
