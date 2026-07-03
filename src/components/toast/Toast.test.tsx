import { render, renderHook, act, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Toast, useToast, useToastStore } from './Toast'
import { ImperativeToastContainer } from './ToastContainer'
import { useImperativeToastStore } from './toast-store'

describe('useToast', () => {
  beforeEach(() => {
    // Clear toasts between tests
    useToastStore.getState().clearToasts()
  })

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current({ title: 'Hello' })
    })
    expect(useToastStore.getState().toasts).toHaveLength(1)
    expect(useToastStore.getState().toasts[0].title).toBe('Hello')
  })

  it('adds success toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.success('Done', 'Completed')
    })
    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].variant).toBe('success')
    expect(toasts[0].title).toBe('Done')
    expect(toasts[0].description).toBe('Completed')
  })

  it('adds destructive toast via error() convenience method', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.error('Failed')
    })
    expect(useToastStore.getState().toasts[0].variant).toBe('destructive')
  })

  it('adds warning toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.warning('Caution')
    })
    expect(useToastStore.getState().toasts[0].variant).toBe('warning')
  })

  it('adds info toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.info('Note')
    })
    expect(useToastStore.getState().toasts[0].variant).toBe('info')
  })

  it('dismisses a toast', () => {
    const { result } = renderHook(() => useToast())
    let id: string
    act(() => {
      id = result.current({ title: 'Dismiss me' })
    })
    expect(useToastStore.getState().toasts).toHaveLength(1)
    act(() => {
      result.current.dismiss(id!)
    })
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('clears all toasts', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.success('One')
      result.current.error('Two')
      result.current.info('Three')
    })
    expect(useToastStore.getState().toasts).toHaveLength(3)
    act(() => {
      result.current.clear()
    })
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})

describe('Toast component variants', () => {
  it('renders destructive variant with red styles', () => {
    render(
      <Toast id="t1" title="Boom" variant="destructive" onClose={() => {}} />
    )
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('bg-destructive-soft')
    expect(alert.className).toContain('text-destructive-soft-foreground')
  })

  it('supports deprecated error variant as alias for destructive', () => {
    render(
      <>
        <Toast id="t-old" title="Old" variant="error" onClose={() => {}} />
        <Toast id="t-new" title="New" variant="destructive" onClose={() => {}} />
      </>
    )
    const [oldToast, newToast] = screen.getAllByRole('alert')
    expect(oldToast.className).toBe(newToast.className)
    expect(oldToast.className).toContain('bg-destructive-soft')
  })
})

describe('ImperativeToastContainer variants', () => {
  beforeEach(() => {
    useImperativeToastStore.getState().dismissAllToasts()
  })

  it('renders deprecated error variant with destructive styles', () => {
    act(() => {
      useImperativeToastStore.getState().addToast({
        variant: 'error',
        title: 'Legacy failure',
      })
    })
    render(<ImperativeToastContainer />)
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('bg-destructive-soft')
    expect(alert.className).toContain('text-destructive-soft-foreground')
  })
})
