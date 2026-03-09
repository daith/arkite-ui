import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup } from '../../components/radio'

const options = [
  { value: 'free', label: 'Free', description: 'Basic features' },
  { value: 'pro', label: 'Pro', description: 'Advanced features' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions', disabled: true },
]

const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    name: 'plan',
    options,
    defaultValue: 'pro',
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
}

export const WithError: Story = {
  args: { error: true },
}
