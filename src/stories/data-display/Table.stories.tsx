import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/table'

const meta = {
  title: 'Data Display/Table',
  component: Table,
  argTypes: {
    variant: { control: 'select', options: ['default', 'striped'] },
    compact: { control: 'boolean' },
    bordered: { control: 'boolean' },
    hoverable: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice Chen</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carol Wu</TableCell>
          <TableCell>carol@example.com</TableCell>
          <TableCell>Viewer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Striped: Story = {
  ...Default,
  args: { variant: 'striped' },
}

export const Compact: Story = {
  ...Default,
  args: { compact: true },
}
