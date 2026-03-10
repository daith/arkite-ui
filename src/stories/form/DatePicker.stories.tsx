import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '../../components/date-picker'

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  argTypes: {
    clearable: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select date',
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const DefaultDemo = () => {
  const [date, setDate] = useState<Date | null>(null)
  return <DatePicker value={date} onChange={setDate} aria-label="Select date" />
}

export const Default: Story = {
  render: () => <DefaultDemo />,
}

const WithMinMaxDemo = () => {
  const [date, setDate] = useState<Date | null>(null)
  const min = new Date()
  const max = new Date()
  max.setMonth(max.getMonth() + 3)
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      minDate={min}
      maxDate={max}
      placeholder="Select within 3 months..."
    />
  )
}

export const WithMinMax: Story = {
  render: () => <WithMinMaxDemo />,
}

const WithErrorDemo = () => {
  const [date, setDate] = useState<Date | null>(null)
  return <DatePicker value={date} onChange={setDate} error aria-label="Select date" />
}

export const WithError: Story = {
  render: () => <WithErrorDemo />,
}
