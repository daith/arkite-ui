import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataTable, type Column } from './DataTable'

interface TestRow {
  id: number
  name: string
  age: number
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
})
