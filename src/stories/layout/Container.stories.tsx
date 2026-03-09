import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container } from '../../components/container'

const meta = {
  title: 'Layout/Container',
  component: Container,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    centered: { control: 'boolean' },
    padded: { control: 'boolean' },
  },
  args: {
    size: 'xl',
    centered: true,
    padded: true,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <div className="bg-muted p-8 rounded-lg text-center">
        <p className="text-muted-foreground">Container content (size: {args.size})</p>
      </div>
    </Container>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <Container key={size} size={size}>
          <div className="bg-muted p-4 rounded text-center text-sm text-muted-foreground">
            {size}
          </div>
        </Container>
      ))}
    </div>
  ),
}
