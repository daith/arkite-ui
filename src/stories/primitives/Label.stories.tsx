import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../../components/label'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: { required: true },
}

export const Optional: Story = {
  args: { optional: true },
}

export const WithDescription: Story = {
  args: {
    children: 'Password',
    required: true,
    description: 'Must be at least 8 characters',
  },
}
