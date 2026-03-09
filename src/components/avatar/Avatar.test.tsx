import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar, AvatarGroup } from './Avatar'

describe('Avatar', () => {
  it('renders fallback initials when no src', () => {
    render(<Avatar fallback="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders single-name initials', () => {
    render(<Avatar fallback="Admin" />)
    expect(screen.getByText('AD')).toBeInTheDocument()
  })

  it('renders ? when no fallback or alt', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('uses alt for initials when no fallback', () => {
    render(<Avatar alt="Jane Smith" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar src="/avatar.png" alt="User" />)
    expect(screen.getByAltText('User')).toBeInTheDocument()
  })

  it('renders status dot when status is provided', () => {
    render(<Avatar fallback="JD" status="online" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'online')
  })

  it('applies size classes', () => {
    const { container } = render(<Avatar fallback="JD" size="lg" />)
    expect(container.firstChild).toHaveClass('h-12', 'w-12')
  })
})

describe('AvatarGroup', () => {
  it('renders visible avatars up to max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
      </AvatarGroup>
    )
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('shows all avatars when under max', () => {
    render(
      <AvatarGroup max={5}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
      </AvatarGroup>
    )
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })
})
