import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'destructive', 'outline', 'info'],
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Error' },
}

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
