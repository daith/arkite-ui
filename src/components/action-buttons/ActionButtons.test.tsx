import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ActionButtons, type ActionItem } from './ActionButtons'

const baseActions: ActionItem[] = [
  { key: 'edit', label: 'Edit', onClick: vi.fn() },
  { key: 'delete', label: 'Delete', variant: 'destructive', onClick: vi.fn() },
]

describe('ActionButtons', () => {
  describe('inline mode', () => {
    it('renders action buttons', () => {
      render(<ActionButtons actions={baseActions} mode="inline" />)
      expect(screen.getByTitle('Edit')).toBeInTheDocument()
      expect(screen.getByTitle('Delete')).toBeInTheDocument()
    })

    it('calls onClick when button is clicked', async () => {
      const onClick = vi.fn()
      const actions = [{ key: 'edit', label: 'Edit', onClick }]
      render(<ActionButtons actions={actions} mode="inline" />)
      await userEvent.click(screen.getByTitle('Edit'))
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('hides hidden actions', () => {
      const actions = [
        { key: 'edit', label: 'Edit', onClick: vi.fn() },
        { key: 'delete', label: 'Delete', onClick: vi.fn(), hidden: true },
      ]
      render(<ActionButtons actions={actions} mode="inline" />)
      expect(screen.getByTitle('Edit')).toBeInTheDocument()
      expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
    })

    it('disables disabled actions', () => {
      const actions = [{ key: 'edit', label: 'Edit', onClick: vi.fn(), disabled: true }]
      render(<ActionButtons actions={actions} mode="inline" />)
      expect(screen.getByTitle('Edit')).toBeDisabled()
    })
  })

  describe('dropdown mode', () => {
    it('renders trigger button', () => {
      render(<ActionButtons actions={baseActions} mode="dropdown" />)
      expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument()
    })

    it('shows menu items when trigger is clicked', async () => {
      render(<ActionButtons actions={baseActions} mode="dropdown" />)
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('uses custom trigger label', () => {
      render(<ActionButtons actions={baseActions} mode="dropdown" triggerLabel="More options" />)
      expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument()
    })
  })

  describe('confirm dialog', () => {
    it('shows confirm dialog when confirm action is clicked in inline mode', async () => {
      const onClick = vi.fn()
      const actions = [
        {
          key: 'delete',
          label: 'Delete',
          variant: 'destructive' as const,
          confirm: { title: 'Delete item?', description: 'Cannot be undone.' },
          onClick,
        },
      ]
      render(<ActionButtons actions={actions} mode="inline" />)
      await userEvent.click(screen.getByTitle('Delete'))
      expect(screen.getByText('Delete item?')).toBeInTheDocument()
      expect(screen.getByText('Cannot be undone.')).toBeInTheDocument()
    })

    it('calls onClick after confirming', async () => {
      const onClick = vi.fn()
      const actions = [
        {
          key: 'delete',
          label: 'Delete',
          confirm: true,
          onClick,
        },
      ]
      render(<ActionButtons actions={actions} mode="inline" />)
      await userEvent.click(screen.getByTitle('Delete'))
      // Default confirm dialog appears
      expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
      expect(onClick).toHaveBeenCalledOnce()
    })
  })
})
