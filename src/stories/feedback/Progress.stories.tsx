import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress, CircularProgress } from '../../components/progress'

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    showLabel: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    striped: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
  args: {
    value: 60,
    size: 'md',
    variant: 'default',
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
}

export const WithLabel: Story = {
  args: { showLabel: true, value: 75 },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
}

export const Striped: Story = {
  args: { striped: true, animated: true, value: 65 },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3 w-72">
      <Progress value={80} variant="default" showLabel />
      <Progress value={60} variant="success" showLabel />
      <Progress value={40} variant="warning" showLabel />
      <Progress value={20} variant="error" showLabel />
    </div>
  ),
}

export const Circular: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress value={25} showLabel />
      <CircularProgress value={50} variant="success" showLabel />
      <CircularProgress value={75} variant="warning" showLabel />
      <CircularProgress indeterminate />
    </div>
  ),
}
