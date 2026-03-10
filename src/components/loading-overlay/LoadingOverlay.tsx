import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from '../spinner/Spinner'

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the overlay */
  visible?: boolean
  /** Custom spinner or content */
  children?: ReactNode
  /** Overlay background blur */
  blur?: boolean
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg'
  /** Loading text below spinner */
  label?: string
}

/** Semi-transparent overlay with a centered spinner. Wrap around any element to indicate loading. */
export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, visible = true, blur = false, size = 'md', label, children, ...props }, ref) => {
    if (!visible) return null

    return (
      <div
        ref={ref}
        className={cn(
          'absolute inset-0 z-10 flex flex-col items-center justify-center',
          'bg-background/60',
          blur && 'backdrop-blur-sm',
          className
        )}
        {...props}
      >
        {children || (
          <>
            <Spinner size={size} />
            {label && (
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            )}
          </>
        )}
      </div>
    )
  }
)

LoadingOverlay.displayName = 'LoadingOverlay'
