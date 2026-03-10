import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('renders with default value', () => {
    render(<NumberInput defaultValue={42} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue('42')
  })

  it('increments and decrements with stepper buttons', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={5} onChange={onChange} />)

    const incrementBtn = screen.getByLabelText('Increment')
    const decrementBtn = screen.getByLabelText('Decrement')

    await user.click(incrementBtn)
    expect(onChange).toHaveBeenLastCalledWith(6)

    await user.click(decrementBtn)
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('respects min/max constraints', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={9} min={0} max={10} onChange={onChange} />)

    const incrementBtn = screen.getByLabelText('Increment')
    const decrementBtn = screen.getByLabelText('Decrement')

    // Increment to max
    await user.click(incrementBtn)
    expect(onChange).toHaveBeenLastCalledWith(10)

    // At max, increment button should be disabled
    expect(incrementBtn).toBeDisabled()

    // Decrement back down to 0
    for (let i = 0; i < 10; i++) {
      await user.click(decrementBtn)
    }
    expect(onChange).toHaveBeenLastCalledWith(0)

    // At min, decrement button should be disabled
    expect(decrementBtn).toBeDisabled()
  })

  it('supports ArrowUp/ArrowDown keyboard shortcuts', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={5} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.click(input)
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith(6)

    await user.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('fires onChange with number value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.type(input, '123')
    expect(onChange).toHaveBeenLastCalledWith(123)
  })

  it('fires onChange(null) when input is cleared', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={42} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('shows prefix and suffix', () => {
    render(<NumberInput defaultValue={100} prefix="$" suffix="USD" />)
    expect(screen.getByText('$')).toBeInTheDocument()
    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  it('disables interaction when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={5} disabled onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toBeDisabled()

    const incrementBtn = screen.getByLabelText('Increment')
    expect(incrementBtn).toBeDisabled()

    await user.click(incrementBtn)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies error styling', () => {
    render(<NumberInput error errorMessage="Invalid number" />)
    const input = screen.getByRole('spinbutton')
    expect(input.className).toContain('border-destructive')
    expect(screen.getByText('Invalid number')).toBeInTheDocument()
  })

  it('clamps value on blur', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput min={0} max={100} clampOnBlur onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.type(input, '150')
    await user.tab() // trigger blur
    expect(onChange).toHaveBeenLastCalledWith(100)
    expect(input).toHaveValue('100')
  })

  it('formats to precision on blur', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput precision={2} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.type(input, '3.1')
    await user.tab() // trigger blur
    expect(onChange).toHaveBeenLastCalledWith(3.1)
    expect(input).toHaveValue('3.1')

    // Type a value that needs rounding
    await user.clear(input)
    await user.type(input, '3.456')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(3.46)
    expect(input).toHaveValue('3.46')
  })
})
