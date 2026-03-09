import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  FilterBar,
  FilterBarSearch,
  FilterBarFilters,
  FilterBarActions,
} from './FilterBar'

describe('FilterBar', () => {
  it('renders children', () => {
    render(
      <FilterBar>
        <span>content</span>
      </FilterBar>
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(
      <FilterBar className="my-class">
        <span>x</span>
      </FilterBar>
    )
    expect(container.firstChild).toHaveClass('my-class')
  })
})

describe('FilterBarSearch', () => {
  it('renders search input with placeholder', () => {
    render(<FilterBarSearch placeholder="Search orders..." />)
    expect(screen.getByPlaceholderText('Search orders...')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FilterBarSearch value="" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenLastCalledWith('o')
  })

  it('uses default placeholder', () => {
    render(<FilterBarSearch />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })
})

describe('FilterBarFilters', () => {
  it('renders filter children', () => {
    render(
      <FilterBarFilters>
        <select data-testid="filter-1"><option>All</option></select>
        <select data-testid="filter-2"><option>Active</option></select>
      </FilterBarFilters>
    )
    expect(screen.getByTestId('filter-1')).toBeInTheDocument()
    expect(screen.getByTestId('filter-2')).toBeInTheDocument()
  })
})

describe('FilterBarActions', () => {
  it('renders action buttons', () => {
    render(
      <FilterBarActions>
        <button>Export</button>
        <button>Add</button>
      </FilterBarActions>
    )
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
  })
})

describe('FilterBar composition', () => {
  it('renders all slots together', () => {
    render(
      <FilterBar>
        <FilterBarSearch placeholder="Search..." />
        <FilterBarFilters>
          <select><option>Status</option></select>
        </FilterBarFilters>
        <FilterBarActions>
          <button>Export</button>
        </FilterBarActions>
      </FilterBar>
    )
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })
})
