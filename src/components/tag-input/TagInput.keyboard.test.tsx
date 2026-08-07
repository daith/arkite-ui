import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TagInput } from './TagInput'

describe('TagInput keyboard interaction', () => {
  describe('adding tags', () => {
    it('Enter adds the typed text as a tag and clears the input', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={[]} onChange={onChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'React{Enter}')

      expect(onChange).toHaveBeenCalledWith(['React'])
      expect(input).toHaveValue('')
    })

    it('comma adds the typed text as a tag and clears the input', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={[]} onChange={onChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Vue,')

      expect(onChange).toHaveBeenCalledWith(['Vue'])
      expect(input).toHaveValue('')
    })

    it('does not add a duplicate tag by default', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={['React']} onChange={onChange} />)

      await user.type(screen.getByRole('textbox'), 'React{Enter}')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not add a tag beyond the max limit', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={['React', 'Vue']} onChange={onChange} max={2} />)

      await user.type(screen.getByRole('textbox'), 'Angular{Enter}')

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('removing tags with Backspace', () => {
    it('Backspace with empty input removes the last tag', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={['React', 'Vue']} onChange={onChange} />)

      await user.click(screen.getByRole('textbox'))
      await user.keyboard('{Backspace}')

      expect(onChange).toHaveBeenCalledWith(['React'])
    })

    it('Backspace with text in the input only edits the text, tags stay intact', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={['React']} onChange={onChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Vu')
      await user.keyboard('{Backspace}')

      expect(input).toHaveValue('V')
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByText('React')).toBeInTheDocument()
    })
  })

  describe('tag remove buttons', () => {
    it('remove button is reachable via Tab', async () => {
      const user = userEvent.setup()
      render(<TagInput value={['React']} onChange={vi.fn()} />)

      await user.tab()

      expect(screen.getByLabelText('Remove React')).toHaveFocus()
    })

    it('remove button has an accessible label per tag', () => {
      render(<TagInput value={['React', 'Vue']} onChange={vi.fn()} />)

      expect(screen.getByLabelText('Remove React')).toBeInTheDocument()
      expect(screen.getByLabelText('Remove Vue')).toBeInTheDocument()
    })

    it('remove button activates with Enter when focused programmatically', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={['React', 'Vue']} onChange={onChange} />)

      screen.getByLabelText('Remove React').focus()
      await user.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledWith(['Vue'])
    })

    it('remove button activates with Space when focused programmatically', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<TagInput value={['React', 'Vue']} onChange={onChange} />)

      screen.getByLabelText('Remove Vue').focus()
      await user.keyboard(' ')

      expect(onChange).toHaveBeenCalledWith(['React'])
    })
  })
})
