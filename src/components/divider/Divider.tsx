import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Divider orientation */
  orientation?: DividerOrientation
  /** Label text */
  label?: string
  /** Label position (only for horizontal) */
  labelPosition?: 'left' | 'center' | 'right'
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = 'horizontal',
      label,
      labelPosition = 'center',
      ...props
    },
    ref
  ) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn('h-full w-px bg-border', className)}
          {...props}
        />
      )
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn(
            'flex items-center',
            labelPosition === 'left' && 'justify-start',
            labelPosition === 'center' && 'justify-center',
            labelPosition === 'right' && 'justify-end',
            className
          )}
          {...props}
        >
          {labelPosition !== 'left' && (
            <div className={cn('h-px flex-1 bg-border', labelPosition === 'center' && 'mr-4')} />
          )}
          <span className="text-xs text-muted-foreground">{label}</span>
          {labelPosition !== 'right' && (
            <div className={cn('h-px flex-1 bg-border', labelPosition === 'center' && 'ml-4')} />
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn('h-px w-full bg-border', className)}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'
