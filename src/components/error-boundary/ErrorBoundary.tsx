import { Component, type ErrorInfo, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../button/Button'

export interface ErrorBoundaryProps {
  /** Content to render */
  children: ReactNode
  /** Custom fallback UI (receives error and reset function) */
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode)
  /** Error callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Additional class name for default fallback */
  className?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback, className } = this.props

    if (!error) return children

    if (typeof fallback === 'function') {
      return fallback({ error, reset: this.reset })
    }

    if (fallback) return fallback

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center',
          className
        )}
        role="alert"
      >
        <AlertTriangleIcon className="h-10 w-10 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {error.message || 'An unexpected error occurred.'}
          </p>
        </div>
        <Button variant="outline" onClick={this.reset}>
          Try again
        </Button>
      </div>
    )
  }
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
