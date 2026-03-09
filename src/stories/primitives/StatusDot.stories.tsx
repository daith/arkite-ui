import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusDot } from '../../components/status-dot/StatusDot'
import { Avatar } from '../../components/avatar/Avatar'
import { Badge } from '../../components/badge/Badge'

const meta: Meta<typeof StatusDot> = {
  title: 'Primitives/StatusDot',
  component: StatusDot,
  argTypes: {
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusDot>

export const Default: Story = {
  args: { status: 'online', size: 'md' },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['online', 'offline', 'busy', 'away'] as const).map((status) => (
        <div key={status} className="flex items-center gap-2 text-sm">
          <StatusDot status={status} size="md" />
          <span className="capitalize">{status}</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2 text-sm">
          <StatusDot status="online" size={size} />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const WithPulse: Story = {
  args: { status: 'online', size: 'md', pulse: true },
}

export const InlineWithText: Story = {
  name: 'Inline with Text (Table use case)',
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="online" /> Active
      </div>
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="away" /> Away
      </div>
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="busy" /> Do not disturb
      </div>
      <div className="flex items-center gap-2 text-sm">
        <StatusDot status="offline" /> Offline
      </div>
    </div>
  ),
}

export const WithAvatar: Story = {
  name: 'Used inside Avatar',
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="AJ" status="online" size="md" />
      <Avatar fallback="BS" status="busy" size="lg" />
      <Avatar fallback="CW" status="away" size="xl" />
      <Avatar fallback="DD" status="offline" size="sm" />
    </div>
  ),
}

export const WithBadge: Story = {
  name: 'Composed with Badge',
  render: () => (
    <div className="flex items-center gap-3">
      <Badge variant="outline">
        <StatusDot status="online" size="xs" className="mr-1.5" />
        Online
      </Badge>
      <Badge variant="outline">
        <StatusDot status="busy" size="xs" className="mr-1.5" />
        Busy
      </Badge>
      <Badge variant="outline" size="sm">
        <StatusDot status="away" size="xs" className="mr-1.5" />
        Away
      </Badge>
    </div>
  ),
}
