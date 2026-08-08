import { describe, it, expect, beforeEach } from 'vitest'
import { toast } from './toast-api'
import { useToastStore } from './toast-store'

function getToasts() {
  return useToastStore.getState().toasts
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

  it('toast.error() sets destructive variant', () => {
    toast.error('Failed')
    expect(getToasts()[0].variant).toBe('destructive')
  })

  it('accepts deprecated error variant via options', () => {
    toast.show('Legacy', { variant: 'error' })
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

  it('toast.loading() shows spinner and stays until dismissed', () => {
    toast.loading('Loading...')
    const toasts = getToasts()
    expect(toasts[0].variant).toBe('default')
    expect(toasts[0].isLoading).toBe(true)
    expect(toasts[0].duration).toBe(0)
  })

  it('toast.loading() allows overriding duration', () => {
    toast.loading('Quick load', { duration: 3000 })
    expect(getToasts()[0].duration).toBe(3000)
    expect(getToasts()[0].isLoading).toBe(true)
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

describe('toast.fromError', () => {
  beforeEach(() => {
    toast.dismissAll()
    // Reset app-level wiring between tests
    toast.configure({ formatError: undefined })
  })

  it('uses the configured formatError: prefix as title, parsed message as description', () => {
    toast.configure({ formatError: (err) => `parsed:${(err as { code: string }).code}` })
    toast.fromError({ code: 'E42' }, { prefix: '儲存失敗' })
    const t = getToasts()[0]
    expect(t.title).toBe('儲存失敗')
    expect(t.description).toBe('parsed:E42')
    expect(t.variant).toBe('destructive')
  })

  it('unconfigured: falls back to Error#message', () => {
    toast.fromError(new Error('boom'), { prefix: '刪除失敗' })
    const t = getToasts()[0]
    expect(t.title).toBe('刪除失敗')
    expect(t.description).toBe('boom')
  })

  it('unconfigured: plain string errors pass through', () => {
    toast.fromError('連線逾時', { prefix: '載入失敗' })
    expect(getToasts()[0].description).toBe('連線逾時')
  })

  it('never invents copy: unparseable error with prefix shows the prefix alone', () => {
    toast.fromError({ weird: true }, { prefix: '更新失敗' })
    const t = getToasts()[0]
    expect(t.title).toBe('更新失敗')
    expect(t.description).toBeUndefined()
  })

  it('without prefix the message becomes the title', () => {
    toast.fromError(new Error('boom'))
    const t = getToasts()[0]
    expect(t.title).toBe('boom')
    expect(t.description).toBeUndefined()
  })

  it('a throwing formatError falls back instead of crashing', () => {
    toast.configure({
      formatError: () => {
        throw new Error('formatter bug')
      },
    })
    toast.fromError(new Error('actual message'), { prefix: '失敗' })
    expect(getToasts()[0].description).toBe('actual message')
  })

  it('forwards remaining ToastOptions (e.g. duration)', () => {
    toast.fromError(new Error('boom'), { prefix: '失敗', duration: 0 })
    expect(getToasts()[0].duration).toBe(0)
  })
})
