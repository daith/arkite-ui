import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stat, StatCard, StatGroup } from '../../components/stat'

const meta = {
  title: 'Data Display/StatCard',
  component: StatCard,
  args: {
    label: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    trend: 'up' as const,
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TrendDown: Story = {
  args: {
    label: 'Bounce Rate',
    value: '42.5%',
    change: '-4.3%',
    trend: 'down',
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Group: Story = {
  render: () => (
    <StatGroup columns={4}>
      <StatCard label="Total Users" value="2,420" change="+12%" trend="up" />
      <StatCard label="Active Now" value="573" change="+8%" trend="up" />
      <StatCard label="Revenue" value="$45.2K" change="-2%" trend="down" />
      <StatCard label="Conversion" value="3.2%" trend="neutral" />
    </StatGroup>
  ),
  parameters: { layout: 'padded' },
}
