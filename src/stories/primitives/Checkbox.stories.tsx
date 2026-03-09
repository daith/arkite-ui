import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../components/checkbox'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Accept terms and conditions',
    size: 'md',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'Marketing emails',
    description: 'Receive emails about new products and features',
  },
}

export const Error: Story = {
  args: { error: true, label: 'Required field' },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled option' },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox size="sm" label="Small" />
      <Checkbox size="md" label="Medium" />
      <Checkbox size="lg" label="Large" />
    </div>
  ),
}
