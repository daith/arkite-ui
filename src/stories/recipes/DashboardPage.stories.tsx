import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardPage } from './DashboardPage.demo'

const meta: Meta<typeof DashboardPage> = {
  title: 'Recipes/Dashboard',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof DashboardPage>

export const Default: Story = {}
