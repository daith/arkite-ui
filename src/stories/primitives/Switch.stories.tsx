import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '../../components/switch/Switch'

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Toggle between light and dark appearance.',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch size="sm" label="Small" />
      <Switch size="md" label="Medium (default)" />
      <Switch size="lg" label="Large" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled switch',
    disabled: true,
  },
}

export const CheckedDisabled: Story = {
  args: {
    label: 'Locked on',
    disabled: true,
    defaultChecked: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Toggle setting',
  },
}
