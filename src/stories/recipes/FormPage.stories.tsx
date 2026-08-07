import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormPage } from './FormPage.demo'

const meta: Meta<typeof FormPage> = {
  title: 'Recipes/Form Page',
  component: FormPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FormPage>

export const Default: Story = {}
