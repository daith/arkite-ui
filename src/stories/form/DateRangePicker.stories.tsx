import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { DateRangePicker } from '../../components/date-picker/DateRangePicker'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Form/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'padded' },
}

export default meta

// ── Default (interactive) ──

function DefaultDemo() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartChange={setStartDate}
      onEndChange={setEndDate}
      onClear={() => {
        setStartDate(null)
        setEndDate(null)
      }}
      aria-label="Select date range"
    />
  )
}

export const Default: StoryFn = () => <DefaultDemo />

// ── With Preset Dates ──

function WithPresetDatesDemo() {
  const today = new Date()
  const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
  const [startDate, setStartDate] = useState<Date | null>(today)
  const [endDate, setEndDate] = useState<Date | null>(nextWeek)

  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartChange={setStartDate}
      onEndChange={setEndDate}
      onClear={() => {
        setStartDate(null)
        setEndDate(null)
      }}
      startLabel="Check-in"
      endLabel="Check-out"
      aria-label="Select date range"
    />
  )
}

export const WithPresetDates: StoryFn = () => <WithPresetDatesDemo />

// ── Disabled ──

export const Disabled: StoryFn = () => {
  const today = new Date()
  const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)

  return (
    <DateRangePicker
      startDate={today}
      endDate={nextWeek}
      disabled
      aria-label="Select date range"
    />
  )
}

// ── With Error ──

export const WithError: StoryFn = () => {
  return (
    <DateRangePicker
      startDate={null}
      endDate={null}
      error
      aria-label="Select date range"
    />
  )
}

// ── Small Size ──

function SmallSizeDemo() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  return (
    <DateRangePicker
      size="sm"
      startDate={startDate}
      endDate={endDate}
      onStartChange={setStartDate}
      onEndChange={setEndDate}
      onClear={() => {
        setStartDate(null)
        setEndDate(null)
      }}
      aria-label="Select date range"
    />
  )
}

export const SmallSize: StoryFn = () => <SmallSizeDemo />

// ── Calendar Range (variant="calendar") ──

function CalendarRangeDemo() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  return (
    <DateRangePicker
      variant="calendar"
      startDate={startDate}
      endDate={endDate}
      onStartChange={setStartDate}
      onEndChange={setEndDate}
      onClear={() => {
        setStartDate(null)
        setEndDate(null)
      }}
      aria-label="Select date range"
    />
  )
}

export const CalendarRange: StoryFn = () => <CalendarRangeDemo />

// ── Calendar Range with Preset Dates ──

function CalendarRangePresetDemo() {
  const today = new Date()
  const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
  const [startDate, setStartDate] = useState<Date | null>(today)
  const [endDate, setEndDate] = useState<Date | null>(nextWeek)

  return (
    <DateRangePicker
      variant="calendar"
      startDate={startDate}
      endDate={endDate}
      onStartChange={setStartDate}
      onEndChange={setEndDate}
      onClear={() => {
        setStartDate(null)
        setEndDate(null)
      }}
      aria-label="Select date range"
    />
  )
}

export const CalendarRangeWithDates: StoryFn = () => <CalendarRangePresetDemo />
