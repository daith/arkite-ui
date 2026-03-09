import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarGroup } from '../../components/avatar'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    variant: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'busy', 'away'],
    },
  },
  args: {
    fallback: 'JD',
    size: 'md',
    variant: 'circle',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithStatus: Story = {
  args: { status: 'online', fallback: 'WC' },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="xs" fallback="XS" />
      <Avatar size="sm" fallback="SM" />
      <Avatar size="md" fallback="MD" />
      <Avatar size="lg" fallback="LG" />
      <Avatar size="xl" fallback="XL" />
      <Avatar size="2xl" fallback="2X" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar variant="circle" fallback="CI" />
      <Avatar variant="rounded" fallback="RO" />
      <Avatar variant="square" fallback="SQ" />
    </div>
  ),
}

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar status="online" fallback="ON" />
      <Avatar status="offline" fallback="OF" />
      <Avatar status="busy" fallback="BU" />
      <Avatar status="away" fallback="AW" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar fallback="A" />
      <Avatar fallback="B" />
      <Avatar fallback="C" />
      <Avatar fallback="D" />
      <Avatar fallback="E" />
    </AvatarGroup>
  ),
}
