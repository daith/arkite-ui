import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs'

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    defaultValue: 'overview',
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-muted-foreground mt-4">Overview content</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-sm text-muted-foreground mt-4">Analytics content</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground mt-4">Settings content</p>
      </TabsContent>
    </Tabs>
  ),
}

export const Pills: Story = {
  ...Default,
  args: { defaultValue: 'overview', variant: 'pills' },
}

export const Underline: Story = {
  ...Default,
  args: { defaultValue: 'overview', variant: 'underline' },
}
