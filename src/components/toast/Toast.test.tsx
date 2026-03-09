import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useToast, useToastStore } from './Toast'

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

  it('adds error toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.error('Failed')
    })
    expect(useToastStore.getState().toasts[0].variant).toBe('error')
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
