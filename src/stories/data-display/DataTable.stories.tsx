import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable } from '../../components/data-table'
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

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role' },
  {
    key: 'status',
    header: 'Status',
    cell: (row: User) => (
      <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
        {row.status}
      </Badge>
    ),
  },
]

const meta = {
  title: 'Data Display/DataTable',
  component: DataTable,
  argTypes: {
    pagination: { control: 'boolean' },
    loading: { control: 'boolean' },
    selectable: { control: 'boolean' },
  },
  args: {
    data: sampleData,
    columns,
    getRowKey: (row: User) => row.id,
    pagination: true,
    defaultPageSize: 5,
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { data: [], emptyContent: 'No users found' },
}

export const NoPagination: Story = {
  args: { pagination: false },
}
