import type { Meta, StoryObj } from '@storybook/react-vite'
import { DetailDrawerPage } from './DetailDrawerPage.demo'

const meta: Meta<typeof DetailDrawerPage> = {
  title: 'Recipes/Detail + Drawer Edit',
  component: DetailDrawerPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof DetailDrawerPage>

export const Default: Story = {}
