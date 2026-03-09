import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BulkActionBar } from '../../components/bulk-action-bar/BulkActionBar'
import { Button } from '../../components/button/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/table/Table'

const meta: Meta<typeof BulkActionBar> = {
  title: 'Data Display/BulkActionBar',
  component: BulkActionBar,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof BulkActionBar>

export const Default: Story = {
  args: {
    selectedCount: 3,
    children: (
      <>
        <Button size="sm" variant="secondary">
          Export
        </Button>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </>
    ),
  },
}

export const SingleItem: Story = {
  args: {
    selectedCount: 1,
    children: (
      <Button size="sm" variant="secondary">
        Edit
      </Button>
    ),
  },
}

export const Hidden: Story = {
  name: 'Hidden (count = 0)',
  args: {
    selectedCount: 0,
    children: <Button size="sm">Export</Button>,
  },
}

const sampleData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer' },
  { id: '4', name: 'Dave Brown', email: 'dave@example.com', role: 'Editor' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin' },
]

export const WithTable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set())

    const toggleRow = (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }

    const toggleAll = () => {
      if (selected.size === sampleData.length) {
        setSelected(new Set())
      } else {
        setSelected(new Set(sampleData.map((d) => d.id)))
      }
    }

    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={selected.size === sampleData.length}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id} selected={selected.has(row.id)}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <BulkActionBar
          selectedCount={selected.size}
          onClose={() => setSelected(new Set())}
        >
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
  },
}

export const CustomSlots: Story = {
  args: {
    selectedCount: 7,
    left: (
      <span className="text-sm">
        <strong>7</strong> users selected
      </span>
    ),
    children: (
      <>
        <Button size="sm" variant="secondary">
          Send Email
        </Button>
        <Button size="sm" variant="secondary">
          Export CSV
        </Button>
      </>
    ),
    right: (
      <Button size="sm" variant="ghost">
        Clear
      </Button>
    ),
  },
}
