import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface InlineCodeProps extends HTMLAttributes<HTMLElement> {
  /** Render as a different element (e.g. "span"). @default "code" */
  as?: 'code' | 'span'
}

/**
 * Styled inline code snippet for displaying IDs, keys, short values, etc.
 */
export const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(
  ({ className, as: Tag = 'code', ...props }, ref) => (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        'rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground',
        className
      )}
      {...props}
    />
  )
)

InlineCode.displayName = 'InlineCode'
