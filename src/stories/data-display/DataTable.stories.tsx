import type { Meta, StoryFn } from '@storybook/react-vite'
import { DataTable, type Column } from '../../components/data-table'
import { Badge } from '../../components/badge'

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
      <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
        {row.status}
      </Badge>
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

export const Default = Template.bind({})

export const Loading = Template.bind({})
Loading.args = { loading: true }

export const Empty: StoryFn = () => (
  <DataTable<User>
    data={[]}
    columns={columns}
    getRowKey={(row) => row.id}
    emptyContent="No users found"
  />
)

export const NoPagination = Template.bind({})
NoPagination.args = { pagination: false }

export const ErrorState: StoryFn = () => (
  <DataTable<User>
    data={[]}
    columns={columns}
    getRowKey={(row) => row.id}
    emptyContent={
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <span className="text-destructive font-medium">Failed to load data</span>
        <span className="text-sm text-muted-foreground">Please check your connection and try again.</span>
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
