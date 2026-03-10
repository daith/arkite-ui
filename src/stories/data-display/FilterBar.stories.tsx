import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  FilterBar,
  FilterBarSearch,
  FilterBarFilters,
  FilterBarActions,
} from '../../components/filter-bar/FilterBar'
import { Select } from '../../components/select/Select'
import { Button } from '../../components/button/Button'
import { Badge } from '../../components/badge/Badge'

const meta: Meta<typeof FilterBar> = {
  title: 'Data Display/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof FilterBar>

export const Default: Story = {
  render: () => (
    <FilterBar>
      <FilterBarSearch placeholder="Search orders..." />
      <FilterBarFilters>
        <Select size="sm" aria-label="Filter by status">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>
        <Select size="sm" aria-label="Filter by type">
          <option value="">All Types</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
        </Select>
      </FilterBarFilters>
      <FilterBarActions>
        <Button size="sm" variant="outline">Export</Button>
        <Button size="sm">Add Order</Button>
      </FilterBarActions>
    </FilterBar>
  ),
}

export const SearchOnly: Story = {
  render: () => (
    <FilterBar>
      <FilterBarSearch placeholder="Search users..." />
      <FilterBarActions>
        <Button size="sm">Invite User</Button>
      </FilterBarActions>
    </FilterBar>
  ),
}

function ActiveFiltersDemo() {
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')

  const hasFilters = status !== '' || query !== ''

  return (
    <div className="space-y-3">
      <FilterBar>
        <FilterBarSearch
          placeholder="Search products..."
          value={query}
          onChange={setQuery}
        />
        <FilterBarFilters>
          <Select
            size="sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </Select>
          {hasFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setStatus(''); setQuery('') }}
            >
              Clear filters
            </Button>
          )}
        </FilterBarFilters>
        <FilterBarActions>
          <Button size="sm">Add Product</Button>
        </FilterBarActions>
      </FilterBar>

      {hasFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Active filters:
          {query && <Badge variant="secondary" size="sm">Search: {query}</Badge>}
          {status && <Badge variant="secondary" size="sm">Status: {status}</Badge>}
        </div>
      )}
    </div>
  )
}

export const WithActiveFilters: Story = {
  render: () => <ActiveFiltersDemo />,
}

export const FiltersOnly: Story = {
  name: 'Filters without Search',
  render: () => (
    <FilterBar>
      <FilterBarFilters>
        <Select size="sm" aria-label="Filter by department">
          <option value="">Department</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
        </Select>
        <Select size="sm" aria-label="Filter by role">
          <option value="">Role</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </Select>
      </FilterBarFilters>
      <FilterBarActions>
        <Button size="sm" variant="outline">Export CSV</Button>
      </FilterBarActions>
    </FilterBar>
  ),
}
