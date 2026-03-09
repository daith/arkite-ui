import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState, NoResults, NoData, ErrorState } from '../../components/empty-state'
import { Button } from '../../components/button'

const meta = {
  title: 'Data Display/EmptyState',
  component: EmptyState,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'search', 'error', 'no-data'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    title: 'No items found',
    description: 'Get started by creating your first item.',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    action: <Button variant="primary">Create Project</Button>,
  },
}

export const SearchNoResults: Story = {
  render: () => <NoResults />,
}

export const NoDataPreset: Story = {
  render: () => <NoData />,
}

export const ErrorPreset: Story = {
  render: () => <ErrorState />,
}
