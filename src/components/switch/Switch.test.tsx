import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders as a switch toggle', () => {
    render(<Switch label="Enable notifications" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch label="Dark mode" onChange={onChange} />)

    const toggle = screen.getByRole('switch')
    await user.click(toggle)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(toggle).toBeChecked()
  })

  it('respects disabled state', () => {
    render(<Switch label="Locked" disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })
})
