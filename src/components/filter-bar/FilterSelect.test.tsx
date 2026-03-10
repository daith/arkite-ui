import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterSelect } from './FilterSelect'

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

describe('FilterSelect', () => {
  it('renders options with default "全部" option', () => {
    render(<FilterSelect options={statusOptions} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('全部')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('prepends label to all option text', () => {
    render(<FilterSelect label="狀態" options={statusOptions} />)
    expect(screen.getByText('狀態: 全部')).toBeInTheDocument()
  })

  it('supports custom allLabel', () => {
    render(<FilterSelect allLabel="All" options={statusOptions} />)
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('hides all option when allLabel is false', () => {
    render(<FilterSelect allLabel={false} options={statusOptions} />)
    expect(screen.queryByText('全部')).not.toBeInTheDocument()
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
