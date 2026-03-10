import { describe, it, expect, beforeEach } from 'vitest'
import { toast } from './toast-api'
import { useImperativeToastStore } from './toast-store'

function getToasts() {
  return useImperativeToastStore.getState().toasts
}

describe('toast imperative API', () => {
  beforeEach(() => {
    toast.dismissAll()
  })

  it('toast.success() adds to store with success variant', () => {
    toast.success('Done')
    const toasts = getToasts()
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Done')
    expect(toasts[0].variant).toBe('success')
  })

  it('toast.error() sets error variant', () => {
    toast.error('Failed')
    expect(getToasts()[0].variant).toBe('error')
  })

  it('toast.warning() sets warning variant', () => {
    toast.warning('Caution')
    expect(getToasts()[0].variant).toBe('warning')
  })

  it('toast.info() sets info variant', () => {
    toast.info('Note')
    expect(getToasts()[0].variant).toBe('info')
  })

  it('toast.show() sets default variant', () => {
    toast.show('Hello')
    expect(getToasts()[0].variant).toBe('default')
  })

  it('toast.loading() sets default variant', () => {
    toast.loading('Loading...')
    expect(getToasts()[0].variant).toBe('default')
  })

  it('toast.dismiss() removes a specific toast from the store', () => {
    const id = toast.success('To be dismissed')
    expect(getToasts()).toHaveLength(1)
    toast.dismiss(id)
    expect(getToasts()).toHaveLength(0)
  })

  it('toast.dismissAll() clears all toasts from the store', () => {
    toast.success('One')
    toast.error('Two')
    toast.info('Three')
    expect(getToasts()).toHaveLength(3)
    toast.dismissAll()
    expect(getToasts()).toHaveLength(0)
  })

  it('returns a unique ID for each toast', () => {
    const id1 = toast.success('First')
    const id2 = toast.success('Second')
    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })

  it('default duration is 5000', () => {
    toast.success('With default duration')
    expect(getToasts()[0].duration).toBe(5000)
  })

  it('accepts custom duration', () => {
    toast.success('Quick', { duration: 2000 })
    expect(getToasts()[0].duration).toBe(2000)
  })

  it('accepts description', () => {
    toast.success('Title', { description: 'Details here' })
    expect(getToasts()[0].description).toBe('Details here')
  })

  it('accepts action', () => {
    const onClick = () => {}
    toast.success('With action', { action: { label: 'Undo', onClick } })
    expect(getToasts()[0].action).toEqual({ label: 'Undo', onClick })
  })

  it('limits to max 5 toasts, removing oldest', () => {
    for (let i = 0; i < 7; i++) {
      toast.show(`Toast ${i}`)
    }
    const toasts = getToasts()
    expect(toasts).toHaveLength(5)
    expect(toasts[0].title).toBe('Toast 2')
    expect(toasts[4].title).toBe('Toast 6')
  })
})
