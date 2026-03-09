import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    const user = userEvent.setup()
    render(<Textarea placeholder="Type here" />)
    const textarea = screen.getByPlaceholderText('Type here')
    await user.type(textarea, 'Hello world')
    expect(textarea).toHaveValue('Hello world')
  })

  it('supports disabled state', () => {
    render(<Textarea disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('shows error styling', () => {
    render(<Textarea error placeholder="Error" />)
    const textarea = screen.getByPlaceholderText('Error')
    expect(textarea.className).toContain('border-destructive')
  })

  it('displays error message', () => {
    render(<Textarea errorMessage="Field is required" />)
    expect(screen.getByText('Field is required')).toBeInTheDocument()
  })

  it('applies size variants', () => {
    const { rerender } = render(<Textarea size="sm" placeholder="sm" />)
    expect(screen.getByPlaceholderText('sm').className).toContain('text-xs')

    rerender(<Textarea size="lg" placeholder="lg" />)
    expect(screen.getByPlaceholderText('lg').className).toContain('text-base')
  })

  it('supports rows prop', () => {
    render(<Textarea rows={5} placeholder="Rows" />)
    expect(screen.getByPlaceholderText('Rows')).toHaveAttribute('rows', '5')
  })

  it('applies autoResize class', () => {
    render(<Textarea autoResize placeholder="Auto" />)
    const textarea = screen.getByPlaceholderText('Auto')
    expect(textarea.className).toContain('resize-none')
  })
})
