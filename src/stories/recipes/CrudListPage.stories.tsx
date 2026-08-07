import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrudListPage } from './CrudListPage.demo'

const meta: Meta<typeof CrudListPage> = {
  title: 'Recipes/CRUD List Page',
  component: CrudListPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CrudListPage>

export const Default: Story = {}
