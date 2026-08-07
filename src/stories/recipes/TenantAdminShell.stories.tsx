import type { Meta, StoryObj } from '@storybook/react-vite'
import { TenantAdminShell } from './TenantAdminShell.demo'

const meta: Meta<typeof TenantAdminShell> = {
  title: 'Recipes/Tenant Admin Shell',
  component: TenantAdminShell,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof TenantAdminShell>

export const Default: Story = {}
