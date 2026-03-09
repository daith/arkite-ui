import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { X } from 'lucide-react'
import { useReducedMotion } from './use-reduced-motion'
import type { DrawerPosition, DrawerSize } from '../drawer/Drawer'

export interface AnimatedDrawerProps {
  open: boolean
  onClose: () => void
  position?: DrawerPosition
  size?: DrawerSize
  title?: ReactNode
  description?: ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

const positionStyles: Record<DrawerPosition, string> = {
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
}

const sizeStyles: Record<DrawerPosition, Record<DrawerSize, string>> = {
  left: {
    sm: 'w-64', md: 'w-80', lg: 'w-96', xl: 'w-[480px]',
    '2xl': 'w-[600px]', '3xl': 'w-[720px]', '4xl': 'w-[900px]',
    '5xl': 'w-[1024px]', '6xl': 'w-[1200px]', full: 'w-screen',
  },
  right: {
    sm: 'w-64', md: 'w-80', lg: 'w-96', xl: 'w-[480px]',
    '2xl': 'w-[600px]', '3xl': 'w-[720px]', '4xl': 'w-[900px]',
    '5xl': 'w-[1024px]', '6xl': 'w-[1200px]', full: 'w-screen',
  },
  top: {
    sm: 'h-32', md: 'h-48', lg: 'h-64', xl: 'h-96',
    '2xl': 'h-[400px]', '3xl': 'h-[500px]', '4xl': 'h-[600px]',
    '5xl': 'h-[700px]', '6xl': 'h-[800px]', full: 'h-screen',
  },
  bottom: {
    sm: 'h-32', md: 'h-48', lg: 'h-64', xl: 'h-96',
    '2xl': 'h-[400px]', '3xl': 'h-[500px]', '4xl': 'h-[600px]',
    '5xl': 'h-[700px]', '6xl': 'h-[800px]', full: 'h-screen',
  },
}

const slideVariants: Record<DrawerPosition, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  left: { hidden: { x: -100 }, visible: { x: 0 } },
  right: { hidden: { x: 100 }, visible: { x: 0 } },
  top: { hidden: { y: -100 }, visible: { y: 0 } },
  bottom: { hidden: { y: 100 }, visible: { y: 0 } },
}

export const AnimatedDrawer = forwardRef<HTMLDivElement, AnimatedDrawerProps>(
  (
    {
      open,
      onClose,
      position = 'right',
      size = 'md',
      title,
      description,
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      children,
      className,
    },
    ref
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
      if (!open || !closeOnEscape) return
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, closeOnEscape, onClose])

    useEffect(() => {
      if (open) {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = originalOverflow
        }
      }
    }, [open])

    const duration = prefersReducedMotion ? 0 : 0.3
    const variant = slideVariants[position]

    // Use percentage-based slide for smooth feel
    const slideInitial = position === 'left' || position === 'right'
      ? { x: `${variant.hidden.x}%` }
      : { y: `${variant.hidden.y}%` }

    const slideAnimate = position === 'left' || position === 'right'
      ? { x: `${variant.visible.x}%` }
      : { y: `${variant.visible.y}%` }

    const drawerContent = (
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
              className="fixed inset-0 bg-black/50"
              onClick={closeOnBackdropClick ? onClose : undefined}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              ref={(node) => {
                (drawerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
              }}
              initial={{ ...slideInitial, opacity: prefersReducedMotion ? 0 : 1 }}
              animate={{ ...slideAnimate, opacity: 1 }}
              exit={{ ...slideInitial, opacity: prefersReducedMotion ? 0 : 1 }}
              transition={{ duration, ease: [0.32, 0.72, 0, 1] }}
              className={cn(
                'fixed flex flex-col bg-card shadow-xl',
                positionStyles[position],
                sizeStyles[position][size],
                className
              )}
            >
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between gap-4 border-b p-4">
                  <div className="space-y-1">
                    {title && (
                      <h2 className="text-lg font-semibold leading-none">{title}</h2>
                    )}
                    {description && (
                      <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </button>
                  )}
                </div>
              )}
              <div className="flex-1 overflow-auto p-4">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-2 border-t p-4">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )

    return createPortal(drawerContent, document.body)
  }
)

AnimatedDrawer.displayName = 'AnimatedDrawer'
