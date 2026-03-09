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
