import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} placeholder="type here" />)
    const input = screen.getByPlaceholderText('type here')
    await userEvent.type(input, 'hello')
    expect(onChange).toHaveBeenCalled()
    expect(input).toHaveValue('hello')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="disabled" />)
    expect(screen.getByPlaceholderText('disabled')).toBeDisabled()
  })

  it('shows error message', () => {
    render(<Input error errorMessage="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('applies error styling', () => {
    render(<Input error placeholder="err" />)
    expect(screen.getByPlaceholderText('err').className).toContain('border-destructive')
  })

  it('renders left addon', () => {
    render(<Input leftAddon={<span data-testid="icon">@</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders right addon', () => {
    render(<Input rightAddon={<span data-testid="suffix">.com</span>} />)
    expect(screen.getByTestId('suffix')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })
})
