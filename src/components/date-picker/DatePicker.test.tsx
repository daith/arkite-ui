import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renders input with placeholder', () => {
    render(<DatePicker />)
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
  })

  it('renders a calendar icon button', () => {
    render(<DatePicker />)
    // The icon button is adjacent to the input; there should be a button element
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('opens calendar dropdown when icon is clicked', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)

    // Calendar should not be visible initially
    expect(screen.queryByText('January')).not.toBeInTheDocument()

    // Click the calendar icon button
    const iconButton = screen.getAllByRole('button')[0]
    await user.click(iconButton)

    // Now we should see day names from the calendar dropdown
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('selects a date and updates input value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<DatePicker value={new Date(2025, 5, 1)} onChange={onChange} />)

    const input = screen.getByPlaceholderText('Select date')
    expect(input).toHaveValue('2025-06-01')

    // Open the calendar
    await user.click(screen.getAllByRole('button')[0])

    // Click on day 15
    await user.click(screen.getByText('15'))
    expect(onChange).toHaveBeenCalledTimes(1)
    const selected: Date = onChange.mock.calls[0][0]
    expect(selected.getDate()).toBe(15)
  })

  it('applies size variant classes', () => {
    const { rerender } = render(<DatePicker size="sm" />)
    const smInput = screen.getByPlaceholderText('Select date')
    expect(smInput.className).toContain('h-8')

    rerender(<DatePicker size="lg" />)
    const lgInput = screen.getByPlaceholderText('Select date')
    expect(lgInput.className).toContain('h-12')
  })

  it('applies error state class', () => {
    render(<DatePicker error />)
    const input = screen.getByPlaceholderText('Select date')
    expect(input.className).toContain('border-destructive')
  })

  it('shows formatted value in input when value prop is set', () => {
    render(<DatePicker value={new Date(2025, 0, 5)} format="yyyy-MM-dd" />)
    expect(screen.getByPlaceholderText('Select date')).toHaveValue('2025-01-05')
  })

  it('renders errorMessage text', () => {
    render(<DatePicker error errorMessage="Invalid date" />)
    const message = screen.getByText('Invalid date')
    expect(message).toBeInTheDocument()
    expect(message.className).toContain('text-destructive')
  })
})

describe('DatePicker clearable', () => {
  it('shows a clear button when a value is set', () => {
    render(<DatePicker value={new Date(2025, 5, 1)} />)
    expect(screen.getByLabelText('Clear date')).toBeInTheDocument()
  })

  it('does not show a clear button without a value', () => {
    render(<DatePicker />)
    expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument()
  })

  it('does not show a clear button when clearable is false', () => {
    render(<DatePicker value={new Date(2025, 5, 1)} clearable={false} />)
    expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument()
  })

  it('does not show a clear button when disabled', () => {
    render(<DatePicker value={new Date(2025, 5, 1)} disabled />)
    expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument()
  })

  it('clears the value without opening the popup', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value={new Date(2025, 5, 1)} onChange={onChange} />)

    await user.click(screen.getByLabelText('Clear date'))

    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clears an uncontrolled value and empties the input', async () => {
    const user = userEvent.setup()
    render(<DatePicker defaultValue={new Date(2025, 5, 1)} />)
    expect(screen.getByPlaceholderText('Select date')).toHaveValue('2025-06-01')

    await user.click(screen.getByLabelText('Clear date'))

    expect(screen.getByPlaceholderText('Select date')).toHaveValue('')
    expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument()
  })
})

describe('DatePicker uncontrolled value', () => {
  it('renders defaultValue in the input', () => {
    render(<DatePicker defaultValue={new Date(2025, 0, 5)} />)
    expect(screen.getByPlaceholderText('Select date')).toHaveValue('2025-01-05')
  })

  it('updates the input after selecting a day and still calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker defaultValue={new Date(2025, 5, 1)} onChange={onChange} />)

    await user.click(screen.getByLabelText('Open calendar'))
    await user.click(screen.getByText('15'))

    expect(screen.getByPlaceholderText('Select date')).toHaveValue('2025-06-15')
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe('DatePicker controlled open', () => {
  it('renders the popup when open is true', () => {
    render(<DatePicker open />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('opens initially with defaultOpen', () => {
    render(<DatePicker defaultOpen />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('stays closed when open is false even after clicking the trigger', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<DatePicker open={false} onOpenChange={onOpenChange} />)

    await user.click(screen.getByLabelText('Open calendar'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('calls onOpenChange when the trigger toggles the popup', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<DatePicker onOpenChange={onOpenChange} />)

    await user.click(screen.getByLabelText('Open calendar'))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Open calendar'))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
