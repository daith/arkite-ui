import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress, CircularProgress } from './Progress'

describe('Progress', () => {
  it('renders with progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow', () => {
    render(<Progress value={75} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('sets aria-valuemax', () => {
    render(<Progress value={50} max={200} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '200')
  })

  it('shows label when showLabel is true', () => {
    render(<Progress value={75} showLabel />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('clamps percentage to 0-100', () => {
    render(<Progress value={150} showLabel />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('removes aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })
})

describe('CircularProgress', () => {
  it('renders with progressbar role', () => {
    render(<CircularProgress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows label when enabled', () => {
    render(<CircularProgress value={60} showLabel />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('hides label when indeterminate', () => {
    render(<CircularProgress value={60} showLabel indeterminate />)
    expect(screen.queryByText('60%')).not.toBeInTheDocument()
  })
})
