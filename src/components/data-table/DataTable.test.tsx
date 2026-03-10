import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataTable, type Column } from './DataTable'

interface TestRow {
  id: number
  name: string
  age: number
}

interface FilterTestRow {
  id: number
  name: string
  role: string
  status: string
}

const columns: Column<TestRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
]

const data: TestRow[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} getRowKey={(r) => r.id} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} getRowKey={(r) => r.id} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('shows empty content when data is empty', () => {
    render(<DataTable columns={columns} data={[]} emptyContent="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('shows default empty message', () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<DataTable columns={columns} data={[]} loading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('sorts data when column header is clicked', async () => {
    render(<DataTable columns={columns} data={data} getRowKey={(r) => r.id} pagination={false} />)

    // Click Age to sort ascending (25, 30, 35)
    await userEvent.click(screen.getByText('Age'))

    // Get all table cells - check the order of age values
    const cells = screen.getAllByRole('cell')
    // cells are: [name, age, name, age, name, age]
    const ageValues = cells.filter((_, i) => i % 2 === 1).map((c) => c.textContent)
    expect(ageValues).toEqual(['25', '30', '35'])

    // Click Age again to sort descending (35, 30, 25)
    await userEvent.click(screen.getByText('Age'))
    const cells2 = screen.getAllByRole('cell')
    const ageValues2 = cells2.filter((_, i) => i % 2 === 1).map((c) => c.textContent)
    expect(ageValues2).toEqual(['35', '30', '25'])
  })

  it('handles row click', async () => {
    const onRowClick = vi.fn()
    render(
      <DataTable columns={columns} data={data} getRowKey={(r) => r.id} onRowClick={onRowClick} />
    )
    await userEvent.click(screen.getByText('Bob'))
    expect(onRowClick).toHaveBeenCalledWith(data[1], expect.any(Number))
  })

  it('hides hidden columns', () => {
    const cols: Column<TestRow>[] = [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age', hidden: true },
    ]
    render(<DataTable columns={cols} data={data} getRowKey={(r) => r.id} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    // Age header should not be rendered
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  })

  it('renders custom cell', () => {
    const cols: Column<TestRow>[] = [
      { key: 'name', header: 'Name', cell: (row) => <strong>{row.name}!</strong> },
    ]
    render(<DataTable columns={cols} data={data} getRowKey={(r) => r.id} />)
    expect(screen.getByText('Alice!')).toBeInTheDocument()
  })

  // ─── Selection Tests ───

  it('renders checkboxes when selectable', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set()}
        onSelectionChange={() => {}}
        pagination={false}
      />
    )
    // 1 header checkbox + 3 row checkboxes
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4)
  })

  it('does not render checkboxes when not selectable', () => {
    render(
      <DataTable columns={columns} data={data} getRowKey={(r) => r.id} pagination={false} />
    )
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('toggles a single row selection', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set()}
        onSelectionChange={onSelectionChange}
        pagination={false}
      />
    )
    // Click the second row checkbox (index 1 = "Select row 2")
    await user.click(screen.getByLabelText('Select row 2'))
    expect(onSelectionChange).toHaveBeenCalledWith(new Set([2]))
  })

  it('deselects a selected row', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set([2])}
        onSelectionChange={onSelectionChange}
        pagination={false}
      />
    )
    await user.click(screen.getByLabelText('Select row 2'))
    expect(onSelectionChange).toHaveBeenCalledWith(new Set())
  })

  it('selects all rows on header checkbox click', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set()}
        onSelectionChange={onSelectionChange}
        pagination={false}
      />
    )
    await user.click(screen.getByLabelText('Select all rows'))
    expect(onSelectionChange).toHaveBeenCalledWith(new Set([1, 2, 3]))
  })

  it('deselects all rows when all are selected', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set([1, 2, 3])}
        onSelectionChange={onSelectionChange}
        pagination={false}
      />
    )
    await user.click(screen.getByLabelText('Select all rows'))
    expect(onSelectionChange).toHaveBeenCalledWith(new Set())
  })

  it('shows indeterminate state when some rows selected', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set([1])}
        onSelectionChange={() => {}}
        pagination={false}
      />
    )
    const headerCheckbox = screen.getByLabelText('Select all rows')
    expect(headerCheckbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('highlights selected rows', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        selectable
        selectedRows={new Set([2])}
        onSelectionChange={() => {}}
        pagination={false}
      />
    )
    const rows = screen.getAllByRole('row')
    // rows[0] = header, rows[1] = Alice (id:1), rows[2] = Bob (id:2)
    expect(rows[2]).toHaveAttribute('data-selected', 'true')
    expect(rows[1]).not.toHaveAttribute('data-selected')
  })

  it('paginates data with default page size', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      age: 20 + i,
    }))
    render(<DataTable columns={columns} data={largeData} defaultPageSize={10} getRowKey={(r) => r.id} />)
    // Should show 10 data rows + 1 header row
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(11)
    // Should show pagination info
    expect(screen.getByText(/1-10 of 25/)).toBeInTheDocument()
  })

  // ─── Expandable Row Tests ───

  it('renders expand buttons when expandable is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        expandable={(row) => <div>Details for {row.name}</div>}
        pagination={false}
      />
    )
    const expandButtons = screen.getAllByLabelText('Expand row')
    expect(expandButtons).toHaveLength(3)
  })

  it('expands a row when expand button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        expandable={(row) => <div>Details for {row.name}</div>}
        pagination={false}
      />
    )

    // Initially no expanded content
    expect(screen.queryByText('Details for Alice')).not.toBeInTheDocument()

    // Click expand on the first row
    const expandButtons = screen.getAllByLabelText('Expand row')
    await user.click(expandButtons[0])

    expect(screen.getByText('Details for Alice')).toBeInTheDocument()
    // The button should now say "Collapse row"
    expect(screen.getByLabelText('Collapse row')).toBeInTheDocument()
  })

  it('collapses an expanded row when clicked again', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        expandable={(row) => <div>Details for {row.name}</div>}
        pagination={false}
      />
    )

    const expandButtons = screen.getAllByLabelText('Expand row')
    await user.click(expandButtons[0])
    expect(screen.getByText('Details for Alice')).toBeInTheDocument()

    // Click again to collapse
    await user.click(screen.getByLabelText('Collapse row'))
    expect(screen.queryByText('Details for Alice')).not.toBeInTheDocument()
  })

  it('does not render expand buttons when expandable is not provided', () => {
    render(
      <DataTable columns={columns} data={data} getRowKey={(r) => r.id} pagination={false} />
    )
    expect(screen.queryByLabelText('Expand row')).not.toBeInTheDocument()
  })

  // ─── Column Toggle Tests ───

  it('renders column toggle button when columnToggle is true', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        columnToggle
        pagination={false}
      />
    )
    expect(screen.getByLabelText('Toggle columns')).toBeInTheDocument()
  })

  it('toggles column visibility via column toggle dropdown', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        columnToggle
        pagination={false}
      />
    )

    // Both columns visible — age values appear
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()

    // Open dropdown
    await user.click(screen.getByLabelText('Toggle columns'))

    // The dropdown has two items: Name and Age. Find the one that contains 'Age' text
    // and is a button inside the dropdown (not the table header button)
    const dropdownButtons = screen.getAllByRole('button').filter(
      (btn) => btn.textContent?.trim() === 'Age' && !btn.closest('thead')
    )
    await user.click(dropdownButtons[0])

    // Age column should be hidden — age values should not appear
    expect(screen.queryByText('30')).not.toBeInTheDocument()
    expect(screen.queryByText('25')).not.toBeInTheDocument()
    // Name column still visible
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('does not render column toggle when columnToggle is false', () => {
    render(
      <DataTable columns={columns} data={data} getRowKey={(r) => r.id} pagination={false} />
    )
    expect(screen.queryByLabelText('Toggle columns')).not.toBeInTheDocument()
  })

  // ─── Sticky Header Tests ───

  it('applies sticky header attribute to table when stickyHeader is true', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        stickyHeader
        maxHeight="400px"
        pagination={false}
      />
    )
    const table = container.querySelector('table')
    expect(table).toHaveAttribute('data-sticky-header', 'true')
  })

  it('applies maxHeight style to scroll container when stickyHeader is true', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        stickyHeader
        maxHeight="400px"
        pagination={false}
      />
    )
    const scrollContainer = screen.getByTestId('sticky-scroll-container')
    expect(scrollContainer.style.maxHeight).toBe('400px')
    expect(scrollContainer.className).toContain('overflow-auto')
  })

  it('does not apply sticky styles when stickyHeader is false', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    const table = container.querySelector('table')
    expect(table).not.toHaveAttribute('data-sticky-header')
    expect(screen.queryByTestId('sticky-scroll-container')).not.toBeInTheDocument()
  })

  // ─── Column Filtering Tests ───

  const filterData: FilterTestRow[] = [
    { id: 1, name: 'Alice', role: 'Admin', status: 'active' },
    { id: 2, name: 'Bob', role: 'Editor', status: 'active' },
    { id: 3, name: 'Carol', role: 'Viewer', status: 'inactive' },
    { id: 4, name: 'David', role: 'Editor', status: 'active' },
    { id: 5, name: 'Eve', role: 'Admin', status: 'inactive' },
  ]

  const filterColumns: Column<FilterTestRow>[] = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
  ]

  it('renders filter icon when column.filterable is true', () => {
    render(
      <DataTable
        columns={filterColumns}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    expect(screen.getByLabelText('Filter Role')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter Status')).toBeInTheDocument()
    // Name column is not filterable
    expect(screen.queryByLabelText('Filter Name')).not.toBeInTheDocument()
  })

  it('opens filter dropdown on icon click', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={filterColumns}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    await user.click(screen.getByLabelText('Filter Role'))
    const dropdown = screen.getByTestId('filter-dropdown-role')
    // Should show unique role values
    expect(within(dropdown).getByText('Admin')).toBeInTheDocument()
    expect(within(dropdown).getByText('Editor')).toBeInTheDocument()
    expect(within(dropdown).getByText('Viewer')).toBeInTheDocument()
  })

  it('filters data when option selected', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={filterColumns}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    // Open role filter
    await user.click(screen.getByLabelText('Filter Role'))
    const dropdown = screen.getByTestId('filter-dropdown-role')
    // Select "Admin"
    await user.click(within(dropdown).getByText('Admin'))

    // Only Alice and Eve should be visible
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
    expect(screen.queryByText('David')).not.toBeInTheDocument()
  })

  it('auto-detects unique values from data', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={filterColumns}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    await user.click(screen.getByLabelText('Filter Status'))
    const dropdown = screen.getByTestId('filter-dropdown-status')
    // Should detect "active" and "inactive"
    expect(within(dropdown).getByText('active')).toBeInTheDocument()
    expect(within(dropdown).getByText('inactive')).toBeInTheDocument()
  })

  it('uses filterOptions when provided', async () => {
    const user = userEvent.setup()
    const columnsWithOptions: Column<FilterTestRow>[] = [
      { key: 'name', header: 'Name' },
      { key: 'role', header: 'Role', filterable: true, filterOptions: ['Admin', 'SuperAdmin'] },
    ]
    render(
      <DataTable
        columns={columnsWithOptions}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    await user.click(screen.getByLabelText('Filter Role'))
    const dropdown = screen.getByTestId('filter-dropdown-role')
    expect(within(dropdown).getByText('Admin')).toBeInTheDocument()
    expect(within(dropdown).getByText('SuperAdmin')).toBeInTheDocument()
    // "Editor" should NOT appear since we provided custom filterOptions
    expect(within(dropdown).queryByText('Editor')).not.toBeInTheDocument()
  })

  it('clears filters', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={filterColumns}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    // Open role filter and select "Admin"
    await user.click(screen.getByLabelText('Filter Role'))
    await user.click(within(screen.getByTestId('filter-dropdown-role')).getByText('Admin'))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()

    // Click "Clear"
    await user.click(screen.getByText('Clear'))
    // All data should be back
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('multiple column filters work together', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={filterColumns}
        data={filterData}
        getRowKey={(r) => r.id}
        pagination={false}
      />
    )
    // Filter role = Admin
    await user.click(screen.getByLabelText('Filter Role'))
    await user.click(within(screen.getByTestId('filter-dropdown-role')).getByText('Admin'))

    // Filter status = active (open status filter)
    await user.click(screen.getByLabelText('Filter Status'))
    await user.click(within(screen.getByTestId('filter-dropdown-status')).getByText('active'))

    // Only Alice (Admin + active) should be visible
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Eve')).not.toBeInTheDocument() // Admin but inactive
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('resets to page 0 on filter change', async () => {
    const user = userEvent.setup()
    const largeFilterData = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      role: i < 12 ? 'Admin' : 'Editor',
      status: 'active' as const,
    }))
    render(
      <DataTable
        columns={filterColumns}
        data={largeFilterData}
        getRowKey={(r) => r.id}
        defaultPageSize={10}
      />
    )
    // Navigate to page 2
    await user.click(screen.getByText('1 / 3').closest('div')!.querySelectorAll('button')[2])

    // Now apply a filter — should reset to page 0
    await user.click(screen.getByLabelText('Filter Role'))
    await user.click(within(screen.getByTestId('filter-dropdown-role')).getByText('Admin'))

    // Should show page 1 info
    expect(screen.getByText(/1-10 of 12/)).toBeInTheDocument()
  })
})
