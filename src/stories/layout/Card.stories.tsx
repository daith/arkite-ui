import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardContent, CardFooter } from '../../components/card'
import { Button } from '../../components/button'

const meta = {
  title: 'Layout/Card',
  component: Card,
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hoverable: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
  args: {
    padding: 'md',
    shadow: 'sm',
    bordered: true,
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader title="Card Title" description="Card description text" />
      <CardContent>
        <p className="text-sm text-muted-foreground">Card content goes here.</p>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader
        title="Settings"
        description="Manage your account"
        action={<Button size="sm" variant="outline">Edit</Button>}
      />
      <CardContent>
        <p className="text-sm text-muted-foreground">Your account settings content.</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
}

export const Hoverable: Story = {
  render: () => (
    <div className="flex gap-4">
      {['Project A', 'Project B', 'Project C'].map((name) => (
        <Card key={name} hoverable className="w-48 cursor-pointer">
          <CardContent>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">Click to open</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}
