import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Combobox, type ComboboxOption } from './Combobox'

const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', description: 'A red fruit' },
  { value: 'date', label: 'Date', disabled: true },
]

describe('Combobox', () => {
  it('renders trigger button', () => {
    render(<Combobox options={options} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<Combobox options={options} placeholder="Pick a fruit" />)
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
  })

  it('shows default placeholder when none provided', () => {
    render(<Combobox options={options} />)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
  })

  it('filters options by search', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)

    await user.click(screen.getByRole('button'))
    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'ban')

    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
  })

  it('filters options by description', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)

    await user.click(screen.getByRole('button'))
    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'red fruit')

    expect(screen.getByText('Cherry')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('selects a single option', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={options} onChange={onChange} />)

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))

    expect(onChange).toHaveBeenCalledWith('apple')
  })

  it('displays selected option label on the trigger', async () => {
    render(<Combobox options={options} value="banana" />)
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.queryByText('Select...')).not.toBeInTheDocument()
  })

  it('closes dropdown after single selection', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} onChange={vi.fn()} />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Apple')).toBeInTheDocument()

    await user.click(screen.getByText('Apple'))
    // After single select, the dropdown option list should close
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
  })

  it('supports multiple selection', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Combobox options={options} multiple value={['apple']} onChange={onChange} />
    )

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Banana'))

    expect(onChange).toHaveBeenCalledWith(['apple', 'banana'])
  })

  it('deselects in multiple mode', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Combobox
        options={options}
        multiple
        value={['apple', 'banana']}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole('button'))
    // "Apple" appears both in the trigger badge and the dropdown option list,
    // so target the one inside the popover content (dialog role).
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByText('Apple'))

    expect(onChange).toHaveBeenCalledWith(['banana'])
  })

  it('displays multiple selected labels as badges', () => {
    render(
      <Combobox options={options} multiple value={['apple', 'banana']} />
    )

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('keeps dropdown open after multiple selection', async () => {
    const user = userEvent.setup()
    render(
      <Combobox options={options} multiple value={[]} onChange={vi.fn()} />
    )

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Apple'))

    // Dropdown should remain open for multiple selection
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('disables the trigger button when disabled', () => {
    render(<Combobox options={options} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not open dropdown when disabled', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} disabled />)

    await user.click(screen.getByRole('button'))

    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
  })

  it('applies error styling when error is true', () => {
    render(<Combobox options={options} error />)
    const trigger = screen.getByRole('button')
    expect(trigger.className).toContain('border-destructive')
  })

  it('does not apply error styling when error is false', () => {
    render(<Combobox options={options} />)
    const trigger = screen.getByRole('button')
    expect(trigger.className).not.toContain('border-destructive')
  })

  it('shows loading state', async () => {
    const user = userEvent.setup()
    render(<Combobox options={[]} loading />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state message when no options match', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)

    await user.click(screen.getByRole('button'))
    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'xyz nothing matches')

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('shows custom empty state message', async () => {
    const user = userEvent.setup()
    render(<Combobox options={[]} emptyMessage="Nothing here!" />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Nothing here!')).toBeInTheDocument()
  })

  it('applies sm size variant', () => {
    render(<Combobox options={options} size="sm" />)
    const trigger = screen.getByRole('button')
    expect(trigger.className).toContain('h-8')
    expect(trigger.className).toContain('text-xs')
  })

  it('applies md size variant by default', () => {
    render(<Combobox options={options} />)
    const trigger = screen.getByRole('button')
    expect(trigger.className).toContain('h-10')
    expect(trigger.className).toContain('text-sm')
  })

  it('applies lg size variant', () => {
    render(<Combobox options={options} size="lg" />)
    const trigger = screen.getByRole('button')
    expect(trigger.className).toContain('h-12')
    expect(trigger.className).toContain('text-base')
  })

  it('applies custom className to trigger', () => {
    render(<Combobox options={options} className="my-custom-class" />)
    const trigger = screen.getByRole('button')
    expect(trigger.className).toContain('my-custom-class')
  })

  it('uses custom search placeholder', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} searchPlaceholder="Type to search..." />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument()
  })

  it('calls onSearch when typing in search input', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={options} onSearch={onSearch} />)

    await user.click(screen.getByRole('button'))
    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'abc')

    expect(onSearch).toHaveBeenCalledWith('a')
    expect(onSearch).toHaveBeenCalledWith('ab')
    expect(onSearch).toHaveBeenCalledWith('abc')
  })

  it('renders errorMessage text', () => {
    render(<Combobox options={options} error errorMessage="Selection required" />)
    const message = screen.getByText('Selection required')
    expect(message).toBeInTheDocument()
    expect(message.className).toContain('text-destructive')
  })
})
