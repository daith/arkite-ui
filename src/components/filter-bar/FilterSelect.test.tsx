import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterSelect } from './FilterSelect'
import { LocaleProvider, zhTW } from '../../locale'

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

describe('FilterSelect', () => {
  it('renders options with default "All" option', () => {
    render(<FilterSelect options={statusOptions} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('localizes the all option through LocaleProvider', () => {
    render(
      <LocaleProvider locale={zhTW}>
        <FilterSelect options={statusOptions} />
      </LocaleProvider>
    )
    expect(screen.getByText('全部')).toBeInTheDocument()
  })

  it('prepends label to all option text', () => {
    render(<FilterSelect label="Status" options={statusOptions} />)
    expect(screen.getByText('Status: All')).toBeInTheDocument()
  })

  it('supports custom allLabel', () => {
    render(<FilterSelect allLabel="全部" options={statusOptions} />)
    expect(screen.getByText('全部')).toBeInTheDocument()
  })

  it('hides all option when allLabel is false', () => {
    render(<FilterSelect allLabel={false} options={statusOptions} />)
    expect(screen.queryByText('All')).not.toBeInTheDocument()
  })

  it('calls onChange with value string', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FilterSelect options={statusOptions} onChange={onChange} />)
    await user.selectOptions(screen.getByRole('combobox'), 'active')
    expect(onChange).toHaveBeenCalledWith('active')
  })

  it('calls onChange with empty string when selecting all', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FilterSelect options={statusOptions} value="active" onChange={onChange} />
    )
    await user.selectOptions(screen.getByRole('combobox'), '')
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('defaults to size sm', () => {
    const { container } = render(<FilterSelect options={statusOptions} />)
    const select = container.querySelector('select')
    expect(select?.className).toContain('h-8')
  })
})
