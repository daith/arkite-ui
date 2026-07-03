import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

describe('DateRangePicker', () => {
  it('renders both labels with defaults', () => {
    render(<DateRangePicker />)
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeInTheDocument()
  })

  it('renders custom labels', () => {
    render(<DateRangePicker startLabel="From" endLabel="To" />)
    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('To')).toBeInTheDocument()
  })

  it('renders inputs with format-based placeholders', () => {
    render(<DateRangePicker format="yyyy-MM-dd" />)
    const inputs = screen.getAllByPlaceholderText('yyyy-mm-dd')
    expect(inputs).toHaveLength(2)
  })

  it('displays formatted date values', () => {
    const start = new Date(2024, 0, 15) // Jan 15, 2024
    const end = new Date(2024, 0, 20) // Jan 20, 2024
    render(<DateRangePicker startDate={start} endDate={end} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('2024-01-15')
    expect(inputs[1]).toHaveValue('2024-01-20')
  })

  it('opens calendar when start input is focused', async () => {
    render(<DateRangePicker />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])
    // Calendar should show day headers
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('opens calendar when end input is focused', async () => {
    render(<DateRangePicker />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[1])
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('selects start date via calendar and auto-switches to end field', async () => {
    const onStartChange = vi.fn()
    render(
      <DateRangePicker
        onStartChange={onStartChange}
        startDate={null}
        endDate={null}
      />
    )
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])

    // Click a day number in the calendar
    const dayButton = screen.getByRole('button', { name: '15' })
    await userEvent.click(dayButton)
    expect(onStartChange).toHaveBeenCalledTimes(1)
    const calledDate = onStartChange.mock.calls[0][0] as Date
    expect(calledDate.getDate()).toBe(15)
  })

  it('clear button resets both dates', async () => {
    const onStartChange = vi.fn()
    const onEndChange = vi.fn()
    const onClear = vi.fn()
    const start = new Date(2024, 0, 15)
    const end = new Date(2024, 0, 20)

    render(
      <DateRangePicker
        startDate={start}
        endDate={end}
        onStartChange={onStartChange}
        onEndChange={onEndChange}
        onClear={onClear}
      />
    )

    const clearButton = screen.getByLabelText('Clear dates')
    await userEvent.click(clearButton)
    expect(onStartChange).toHaveBeenCalledWith(null)
    expect(onEndChange).toHaveBeenCalledWith(null)
    expect(onClear).toHaveBeenCalled()
  })

  it('does not show clear button when no dates are set', () => {
    render(<DateRangePicker startDate={null} endDate={null} />)
    expect(screen.queryByLabelText('Clear dates')).not.toBeInTheDocument()
  })

  it('does not show clear button when disabled', () => {
    const start = new Date(2024, 0, 15)
    render(<DateRangePicker startDate={start} disabled />)
    expect(screen.queryByLabelText('Clear dates')).not.toBeInTheDocument()
  })

  it('disables both inputs when disabled', () => {
    render(<DateRangePicker disabled />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toBeDisabled()
    expect(inputs[1]).toBeDisabled()
  })

  it('applies error border class when error is true', () => {
    render(<DateRangePicker error />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0].className).toContain('border-destructive')
    expect(inputs[1].className).toContain('border-destructive')
  })

  it('navigates months with prev/next buttons', async () => {
    render(<DateRangePicker startDate={new Date(2024, 0, 15)} />)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.click(inputs[0])

    expect(screen.getByText('January 2024')).toBeInTheDocument()

    // Find chevron buttons by querying all buttons and filtering
    const allButtons = screen.getAllByRole('button')
    const nextBtn = allButtons.find(
      (b) => b.querySelector('.lucide-chevron-right') !== null
    )!
    const prevBtn = allButtons.find(
      (b) => b.querySelector('.lucide-chevron-left') !== null
    )!

    await userEvent.click(nextBtn)
    expect(screen.getByText('February 2024')).toBeInTheDocument()

    await userEvent.click(prevBtn)
    expect(screen.getByText('January 2024')).toBeInTheDocument()
  })
})

describe('DateRangePicker variant="input" (default)', () => {
  it('renders two text inputs when variant is not specified', () => {
    render(<DateRangePicker />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(2)
    expect(screen.queryByTestId('calendar-trigger')).not.toBeInTheDocument()
  })

  it('renders two text inputs when variant="input"', () => {
    render(<DateRangePicker variant="input" />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(2)
    expect(screen.queryByTestId('calendar-trigger')).not.toBeInTheDocument()
  })
})

describe('DateRangePicker variant="calendar"', () => {
  it('renders calendar trigger button instead of inputs', () => {
    render(<DateRangePicker variant="calendar" />)
    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    expect(screen.getByTestId('calendar-trigger')).toBeInTheDocument()
    expect(screen.getByText('Select date range')).toBeInTheDocument()
  })

  it('shows formatted date range on trigger when dates are set', () => {
    const start = new Date(2024, 0, 15)
    const end = new Date(2024, 0, 20)
    render(
      <DateRangePicker variant="calendar" startDate={start} endDate={end} />
    )
    expect(screen.getByText('2024-01-15 ~ 2024-01-20')).toBeInTheDocument()
  })

  it('shows popover with dual calendars on click', async () => {
    render(<DateRangePicker variant="calendar" />)
    const trigger = screen.getByTestId('calendar-trigger')
    await userEvent.click(trigger)

    // Should show popover
    expect(screen.getByTestId('calendar-popover')).toBeInTheDocument()

    // Should show two month grids (current and next month)
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1)

    const MONTHS = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]

    expect(
      screen.getByText(`${MONTHS[currentMonth]} ${currentYear}`)
    ).toBeInTheDocument()
    expect(
      screen.getByText(`${MONTHS[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`)
    ).toBeInTheDocument()
  })

  it('selects start and end dates then closes popover', async () => {
    const onStartChange = vi.fn()
    const onEndChange = vi.fn()

    render(
      <DateRangePicker
        variant="calendar"
        startDate={null}
        endDate={null}
        onStartChange={onStartChange}
        onEndChange={onEndChange}
      />
    )

    // Open popover
    await userEvent.click(screen.getByTestId('calendar-trigger'))
    expect(screen.getByTestId('calendar-popover')).toBeInTheDocument()

    // Click start date (day 10)
    const day10Buttons = screen.getAllByRole('button', { name: '10' })
    await userEvent.click(day10Buttons[0])
    expect(onStartChange).toHaveBeenCalledTimes(1)
    const startCalledDate = onStartChange.mock.calls[0][0] as Date
    expect(startCalledDate.getDate()).toBe(10)

    // Popover should still be open (waiting for end date)
    expect(screen.getByTestId('calendar-popover')).toBeInTheDocument()

    // Click end date (day 20)
    const day20Buttons = screen.getAllByRole('button', { name: '20' })
    await userEvent.click(day20Buttons[0])
    expect(onEndChange).toHaveBeenCalledTimes(1)
    const endCalledDate = onEndChange.mock.calls[0][0] as Date
    expect(endCalledDate.getDate()).toBe(20)

    // Popover should close after both dates selected
    expect(screen.queryByTestId('calendar-popover')).not.toBeInTheDocument()
  })

  it('shows range highlight between start and end dates', async () => {
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    render(
      <DateRangePicker
        variant="calendar"
        startDate={start}
        endDate={end}
      />
    )

    // Open popover
    await userEvent.click(screen.getByTestId('calendar-trigger'))

    // After opening, find day 15 which should be in range
    const day15Buttons = screen.getAllByRole('button', { name: '15' })
    const inRangeDay = day15Buttons[0]
    expect(inRangeDay.className).toContain('bg-primary/10')

    // Day 10 (start) and day 20 (end) should have full primary bg
    const day10Buttons = screen.getAllByRole('button', { name: '10' })
    expect(day10Buttons[0].className).toContain('bg-primary')

    const day20Buttons = screen.getAllByRole('button', { name: '20' })
    expect(day20Buttons[0].className).toContain('bg-primary')
  })

  it('clear button resets both dates in calendar variant', async () => {
    const onStartChange = vi.fn()
    const onEndChange = vi.fn()
    const onClear = vi.fn()
    const start = new Date(2024, 0, 15)
    const end = new Date(2024, 0, 20)

    render(
      <DateRangePicker
        variant="calendar"
        startDate={start}
        endDate={end}
        onStartChange={onStartChange}
        onEndChange={onEndChange}
        onClear={onClear}
      />
    )

    // Open popover
    await userEvent.click(screen.getByTestId('calendar-trigger'))

    // Click clear button in popover footer
    const clearButton = screen.getByLabelText('Clear dates')
    await userEvent.click(clearButton)

    expect(onStartChange).toHaveBeenCalledWith(null)
    expect(onEndChange).toHaveBeenCalledWith(null)
    expect(onClear).toHaveBeenCalled()
  })

  it('disables trigger button when disabled', () => {
    render(<DateRangePicker variant="calendar" disabled />)
    expect(screen.getByTestId('calendar-trigger')).toBeDisabled()
  })

  it('navigates months in calendar variant', async () => {
    render(
      <DateRangePicker
        variant="calendar"
        startDate={new Date(2024, 0, 15)}
      />
    )

    await userEvent.click(screen.getByTestId('calendar-trigger'))

    // Should show January and February 2024
    expect(screen.getByText('January 2024')).toBeInTheDocument()
    expect(screen.getByText('February 2024')).toBeInTheDocument()

    // Click next month
    await userEvent.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('February 2024')).toBeInTheDocument()
    expect(screen.getByText('March 2024')).toBeInTheDocument()

    // Click prev month
    await userEvent.click(screen.getByLabelText('Previous month'))
    expect(screen.getByText('January 2024')).toBeInTheDocument()
    expect(screen.getByText('February 2024')).toBeInTheDocument()
  })

  it('renders errorMessage text (input variant)', () => {
    render(<DateRangePicker error errorMessage="Invalid range" />)
    const message = screen.getByText('Invalid range')
    expect(message).toBeInTheDocument()
    expect(message.className).toContain('text-destructive')
  })

  it('renders errorMessage text (calendar variant)', () => {
    render(
      <DateRangePicker variant="calendar" error errorMessage="Invalid range" />
    )
    const message = screen.getByText('Invalid range')
    expect(message).toBeInTheDocument()
    expect(message.className).toContain('text-destructive')
  })
})
