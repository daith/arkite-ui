import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from './Label'

describe('Label', () => {
  it('renders children as label text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<Label required>Name</Label>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows optional text', () => {
    render(<Label optional>Nickname</Label>)
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Label description="Enter your email address">Email</Label>)
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  it('associates with htmlFor', () => {
    render(<Label htmlFor="email-input">Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input')
  })
})
