import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders as a switch role', () => {
    render(<Toggle />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('toggles on click', async () => {
    const onChange = vi.fn()
    render(<Toggle onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalled()
  })

  it('renders label text', () => {
    render(<Toggle label="Enable notifications" />)
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Toggle label="Notifications" description="Receive email updates" />)
    expect(screen.getByText('Receive email updates')).toBeInTheDocument()
  })

  it('supports disabled state', () => {
    render(<Toggle disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('label links to toggle via htmlFor', () => {
    render(<Toggle label="Dark mode" id="dark-toggle" />)
    expect(screen.getByText('Dark mode')).toHaveAttribute('for', 'dark-toggle')
  })

  it('applies error styling when error prop is true', () => {
    const { container } = render(<Toggle error />)
    expect(container.querySelector('.ring-destructive')).toBeInTheDocument()
  })

  it('renders errorMessage text', () => {
    render(<Toggle label="Notifications" error errorMessage="Must be enabled" />)
    const message = screen.getByText('Must be enabled')
    expect(message).toBeInTheDocument()
    expect(message.className).toContain('text-destructive')
  })

  it('renders errorMessage without label or description', () => {
    render(<Toggle error errorMessage="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
