import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastContainer, useToast } from '../../components/toast'
import { Button } from '../../components/button'

const meta = {
  title: 'Feedback/Toast',
  component: ToastContainer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ToastContainer>

export default meta
type Story = StoryObj<typeof meta>

const ToastDemo = () => {
  const toast = useToast()
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => toast.success('Saved successfully')}>
          Success
        </Button>
        <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Trial expires soon')}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.info('New version available')}>
          Info
        </Button>
      </div>
      <ToastContainer position="top-right" />
    </div>
  )
}

export const Default: Story = {
  render: () => <ToastDemo />,
}
