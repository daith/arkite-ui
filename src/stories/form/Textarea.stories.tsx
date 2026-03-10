import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../../components/textarea/Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Textarea size="sm" placeholder="Small textarea" />
      <Textarea size="md" placeholder="Medium textarea (default)" />
      <Textarea size="lg" placeholder="Large textarea" />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    error: true,
    errorMessage: 'This field is required.',
    placeholder: 'Enter description...',
    defaultValue: '',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This textarea is disabled.',
    'aria-label': 'Description',
  },
}

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: 'This textarea grows as you type...',
  },
}

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Max 200 characters...',
    maxLength: 200,
  },
}

export const CustomRows: Story = {
  args: {
    rows: 8,
    placeholder: 'Textarea with 8 rows...',
  },
}
