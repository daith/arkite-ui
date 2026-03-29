import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { DataTable, type Column } from '../../components/data-table'
import { Badge } from '../../components/badge'
import { BulkActionBar } from '../../components/bulk-action-bar'
import { Button } from '../../components/button'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const sampleData: User[] = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Carol Wu', email: 'carol@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'David Kim', email: 'david@example.com', role: 'Editor', status: 'active' },
  { id: 5, name: 'Eve Johnson', email: 'eve@example.com', role: 'Admin', status: 'active' },
  { id: 6, name: 'Frank Li', email: 'frank@example.com', role: 'Viewer', status: 'inactive' },
  { id: 7, name: 'Grace Park', email: 'grace@example.com', role: 'Editor', status: 'active' },
  { id: 8, name: 'Henry Wang', email: 'henry@example.com', role: 'Viewer', status: 'active' },
]

const columns: Column<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role' },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>{row.status}</Badge>
    ),
  },
]

const meta: Meta = {
  title: 'Data Display/DataTable',
  component: DataTable,
  argTypes: {
    pagination: { control: 'boolean' },
    loading: { control: 'boolean' },
    selectable: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
}

export default meta

const Template: StoryFn = (args) => (
  <DataTable<User>
    data={sampleData}
    columns={columns}
    getRowKey={(row) => row.id}
    pagination
    defaultPageSize={5}
    {...args}
  />
)

export const Default: StoryFn = Template.bind({})

export const Loading: StoryFn = Template.bind({})
Loading.args = { loading: true }

export const Empty: StoryFn = () => (
  <DataTable<User>
    data={[]}
    columns={columns}
    getRowKey={(row) => row.id}
    emptyContent="No users found"
  />
)

export const NoPagination: StoryFn = Template.bind({})
NoPagination.args = { pagination: false }

export const ErrorState: StoryFn = () => (
  <DataTable<User>
    data={[]}
    columns={columns}
    getRowKey={(row) => row.id}
    emptyContent={
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <span className="text-destructive font-medium">Failed to load data</span>
        <span className="text-muted-foreground text-sm">
          Please check your connection and try again.
        </span>
      </div>
    }
  />
)

export const LoadingWithData: StoryFn = () => (
  <DataTable<User>
    data={sampleData.slice(0, 3)}
    columns={columns}
    getRowKey={(row) => row.id}
    loading
    pagination
    defaultPageSize={5}
  />
)

function SelectableDemo() {
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  return (
    <div>
      <DataTable<User>
        data={sampleData}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
        pagination
        defaultPageSize={5}
      />
      <BulkActionBar selectedCount={selected.size} onClose={() => setSelected(new Set())}>
        <Button size="sm" variant="secondary">
          Export
        </Button>
        <Button size="sm" variant="secondary">
          Assign Role
        </Button>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </BulkActionBar>
    </div>
  )
}

export const Selectable: StoryFn = () => <SelectableDemo />

export const ExpandableRows: StoryFn = () => (
  <DataTable<User>
    data={sampleData}
    columns={columns}
    getRowKey={(row) => row.id}
    expandable={(row) => (
      <div className="space-y-2 text-sm">
        <p>
          <strong>Full details for {row.name}</strong>
        </p>
        <p>Email: {row.email}</p>
        <p>Role: {row.role}</p>
        <p>Status: {row.status}</p>
      </div>
    )}
    pagination
    defaultPageSize={5}
  />
)

export const ColumnToggle: StoryFn = () => (
  <DataTable<User>
    data={sampleData}
    columns={columns}
    getRowKey={(row) => row.id}
    columnToggle
    pagination
    defaultPageSize={5}
  />
)

const stickyData: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3],
  status: (i % 4 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
}))

export const StickyHeader: StoryFn = () => (
  <DataTable<User>
    data={stickyData}
    columns={columns}
    getRowKey={(row) => row.id}
    stickyHeader
    maxHeight="400px"
    pagination={false}
  />
)

export const ExpandableWithColumnToggle: StoryFn = () => (
  <DataTable<User>
    data={sampleData}
    columns={columns}
    getRowKey={(row) => row.id}
    expandable={(row) => (
      <div className="text-muted-foreground text-sm">
        Additional details for <strong>{row.name}</strong> — {row.email}
      </div>
    )}
    columnToggle
    pagination
    defaultPageSize={5}
  />
)

const filterableColumns: Column<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', filterable: true },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
    cell: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>{row.status}</Badge>
    ),
  },
]

export const WithFilters: StoryFn = () => (
  <DataTable<User>
    data={sampleData}
    columns={filterableColumns}
    getRowKey={(row) => row.id}
    pagination
    defaultPageSize={5}
  />
)
