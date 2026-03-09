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

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    return <DatePicker value={date} onChange={setDate} />
  },
}

export const WithMinMax: Story = {
  render: () => {
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
  },
}

export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    return <DatePicker value={date} onChange={setDate} error />
  },
}
