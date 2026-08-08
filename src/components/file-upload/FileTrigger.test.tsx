import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FileTrigger } from './FileTrigger'

describe('FileTrigger', () => {
  it('clicking the child opens the picker and onChange gets the files', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <FileTrigger accept="image/*" onChange={onChange}>
        <button type="button">更換照片</button>
      </FileTrigger>
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toHaveAttribute('accept', 'image/*')

    const file = new File(['x'], 'avatar.png', { type: 'image/png' })
    await user.upload(input, file)
    expect(onChange).toHaveBeenCalledWith([file])
  })

  it('adds no wrapper element — the child stays a direct sibling of the hidden input', () => {
    const { container } = render(
      <FileTrigger onChange={() => {}}>
        <button type="button">Pick</button>
      </FileTrigger>
    )
    expect(screen.getByRole('button', { name: 'Pick' })).toBeInTheDocument()
    // input + button, nothing else
    expect(container.children).toHaveLength(2)
  })

  it("the child's own onClick still runs, and preventDefault cancels opening", async () => {
    const user = userEvent.setup()
    const childClick = vi.fn((e: React.MouseEvent) => e.preventDefault())
    const { container } = render(
      <FileTrigger onChange={() => {}}>
        <button type="button" onClick={childClick}>
          Pick
        </button>
      </FileTrigger>
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const openSpy = vi.spyOn(input, 'click')
    await user.click(screen.getByRole('button', { name: 'Pick' }))
    expect(childClick).toHaveBeenCalled()
    expect(openSpy).not.toHaveBeenCalled()
  })

  it('disabled trigger does not open the picker', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <FileTrigger disabled onChange={() => {}}>
        <button type="button">Pick</button>
      </FileTrigger>
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const openSpy = vi.spyOn(input, 'click')
    await user.click(screen.getByRole('button', { name: 'Pick' }))
    expect(openSpy).not.toHaveBeenCalled()
  })
})
