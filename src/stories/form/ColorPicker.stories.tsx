import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { ColorPicker } from '../../components/color-picker/ColorPicker'

const meta: Meta<typeof ColorPicker> = {
  title: 'Form/ColorPicker',
  component: ColorPicker,
  parameters: { layout: 'padded' },
}

export default meta

// ── Default (interactive) ──

function DefaultDemo() {
  const [color, setColor] = useState('#3b82f6')

  return <ColorPicker value={color} onChange={setColor} />
}

export const Default: StoryFn = () => <DefaultDemo />

// ── With Presets ──

function WithPresetsDemo() {
  const [color, setColor] = useState('#ef4444')

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      presets={[
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#000000',
      ]}
    />
  )
}

export const WithPresets: StoryFn = () => <WithPresetsDemo />

// ── Disabled ──

export const Disabled: StoryFn = () => (
  <ColorPicker
    value="#6366f1"
    onChange={() => {}}
    disabled
    presets={['#ef4444', '#3b82f6', '#22c55e']}
  />
)

// ── Small Size ──

function SmallSizeDemo() {
  const [color, setColor] = useState('#8b5cf6')

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      size="sm"
      presets={['#ef4444', '#3b82f6', '#22c55e', '#8b5cf6']}
    />
  )
}

export const SmallSize: StoryFn = () => <SmallSizeDemo />
