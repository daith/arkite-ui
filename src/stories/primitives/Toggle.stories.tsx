import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '../../components/toggle'

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Enable notifications',
    size: 'md',
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Use dark theme across the application',
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle size="sm" label="Small" />
      <Toggle size="md" label="Medium" />
      <Toggle size="lg" label="Large" />
    </div>
  ),
}
