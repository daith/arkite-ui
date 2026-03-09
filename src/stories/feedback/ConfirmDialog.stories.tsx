import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { ConfirmDialog } from '../../components/confirm-dialog'
import { Button } from '../../components/button'

const meta = {
  title: 'Feedback/ConfirmDialog',
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>

export default meta

const DefaultDemo = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Confirm</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm action"
        description="Are you sure you want to proceed with this action?"
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

export const Default: StoryFn = () => <DefaultDemo />

const DestructiveDemo = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Delete Item</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        variant="destructive"
        title="Delete this item?"
        description="This action cannot be undone. This will permanently delete the item and all associated data."
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

export const Destructive: StoryFn = () => <DestructiveDemo />

const AsyncDemo = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Async Confirm</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Save changes?"
        description="This will update the record."
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  )
}

export const AsyncConfirm: StoryFn = () => <AsyncDemo />
