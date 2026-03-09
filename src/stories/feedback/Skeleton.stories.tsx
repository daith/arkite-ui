import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
} from '../../components/skeleton'

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'circular', 'rounded', 'text'],
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
    },
  },
  args: {
    width: 200,
    height: 20,
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Text: Story = {
  render: () => <SkeletonText lines={3} />,
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
}

export const AvatarSkeleton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SkeletonAvatar size="sm" />
      <SkeletonAvatar size="md" />
      <SkeletonAvatar size="lg" />
      <SkeletonAvatar size="xl" />
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => <SkeletonCard />,
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
}

export const TableSkeleton: Story = {
  render: () => <SkeletonTable rows={4} columns={3} />,
  parameters: { layout: 'padded' },
}
