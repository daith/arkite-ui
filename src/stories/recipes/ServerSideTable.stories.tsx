import type { Meta, StoryObj } from '@storybook/react-vite'
import { ServerSideTable } from './ServerSideTable.demo'

const meta: Meta<typeof ServerSideTable> = {
  title: 'Recipes/Server-Side Table',
  component: ServerSideTable,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof ServerSideTable>

export const Default: Story = {}
