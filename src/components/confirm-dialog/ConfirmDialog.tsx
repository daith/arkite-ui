import { forwardRef, type ReactNode } from 'react'
import { Modal, type ModalSize } from '../modal/Modal'
import { Button } from '../button/Button'
import { cn } from '../../utils/cn'

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog should close */
  onClose: () => void
  /** Dialog variant */
  variant?: 'default' | 'destructive' | 'warning'
  /** Dialog title */
  title: ReactNode
  /** Dialog description */
  description?: ReactNode
  /** Confirm button label */
  confirmLabel?: string
  /** Cancel button label */
  cancelLabel?: string
  /** Confirm callback */
  onConfirm: () => void
  /** Loading state (disables buttons during async operation) */
  loading?: boolean
  /** Modal size */
  size?: ModalSize
  /** Custom icon */
  icon?: ReactNode
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open,
      onClose,
      variant = 'default',
      title,
      description,
      confirmLabel,
      cancelLabel = 'Cancel',
      onConfirm,
      loading = false,
      size = 'sm',
      icon,
    },
    ref
  ) => {
    const isDestructive = variant === 'destructive'
    const isWarning = variant === 'warning'
    const hasIcon = variant !== 'default'
    const resolvedConfirmLabel = confirmLabel ?? (isDestructive ? 'Delete' : 'Confirm')

    return (
      <Modal
        ref={ref}
        open={open}
        onClose={onClose}
        size={size}
        showCloseButton={false}
        closeOnBackdropClick={!loading}
        closeOnEscape={!loading}
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          {(icon || hasIcon) && (
            <div
              className={cn(
                'flex shrink-0 items-center justify-center h-10 w-10 rounded-full',
                isDestructive && 'bg-destructive/10 text-destructive',
                isWarning && 'bg-warning/10 text-warning',
                !isDestructive && !isWarning && 'bg-primary/10 text-primary'
              )}
            >
              {icon ?? <WarningIcon className="h-5 w-5" />}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-none">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {resolvedConfirmLabel}
          </Button>
        </div>
      </Modal>
    )
  }
)

ConfirmDialog.displayName = 'ConfirmDialog'

/* ─── Presets ─── */

export interface DeleteConfirmDialogProps extends Omit<ConfirmDialogProps, 'variant' | 'title' | 'description' | 'confirmLabel'> {
  /** Item name to display in the dialog (e.g. "this user") */
  itemName?: string
  /** Custom title (overrides preset) */
  title?: ReactNode
  /** Custom description (overrides preset) */
  description?: ReactNode
  /** Custom confirm label (overrides preset) */
  confirmLabel?: string
}

/**
 * Pre-configured destructive ConfirmDialog for delete operations.
 *
 * @example
 * ```tsx
 * <DeleteConfirmDialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   itemName="this user"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export const DeleteConfirmDialog = forwardRef<HTMLDivElement, DeleteConfirmDialogProps>(
  (
    {
      itemName,
      title = `Delete ${itemName ?? 'this item'}?`,
      description = 'This action cannot be undone. All associated data will be permanently removed.',
      confirmLabel = 'Delete',
      ...props
    },
    ref
  ) => (
    <ConfirmDialog
      ref={ref}
      variant="destructive"
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      {...props}
    />
  )
)

DeleteConfirmDialog.displayName = 'DeleteConfirmDialog'
