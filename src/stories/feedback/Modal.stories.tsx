import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../../components/modal'
import { Button } from '../../components/button'

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          description="Are you sure you want to proceed?"
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          }
        >
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </p>
        </Modal>
      </>
    )
  },
}

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <p className="text-sm text-muted-foreground">
            This is a larger modal with more content space.
          </p>
        </Modal>
      </>
    )
  },
}
