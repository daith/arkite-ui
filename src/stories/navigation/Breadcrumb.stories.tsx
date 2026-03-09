import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '../../components/breadcrumb'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Arkite UI' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHomeIcon: Story = {
  args: { showHomeIcon: true },
}

export const Truncated: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: 'Home', href: '/' },
      { label: 'Organization', href: '/org' },
      { label: 'Projects', href: '/projects' },
      { label: 'Arkite UI', href: '/projects/arkite' },
      { label: 'Settings' },
    ],
  },
}
