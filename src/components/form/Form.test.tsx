import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormSection,
  FormActions,
} from './Form'

describe('Form', () => {
  it('renders as form element', () => {
    render(<Form data-testid="form">Content</Form>)
    const form = screen.getByTestId('form')
    expect(form.tagName).toBe('FORM')
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Form>Form children</Form>)
    expect(screen.getByText('Form children')).toBeInTheDocument()
  })
})

describe('FormField with FormMessage', () => {
  it('shows error message when error is provided', () => {
    render(
      <FormField error="This field is required">
        <FormLabel>Name</FormLabel>
        <FormMessage />
      </FormField>
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not render message when no error', () => {
    const { container } = render(
      <FormField>
        <FormLabel>Name</FormLabel>
        <FormMessage />
      </FormField>
    )
    // FormMessage returns null when no error and no children
    expect(screen.queryByText(/./)).toBeTruthy() // Label text exists
    const destructiveTexts = container.querySelectorAll('.text-destructive')
    expect(destructiveTexts).toHaveLength(0)
  })

  it('FormMessage error prop overrides context', () => {
    render(
      <FormField error="Context error">
        <FormMessage error="Override error" />
      </FormField>
    )
    expect(screen.getByText('Override error')).toBeInTheDocument()
    expect(screen.queryByText('Context error')).not.toBeInTheDocument()
  })
})

describe('FormLabel', () => {
  it('renders label text', () => {
    render(
      <FormField>
        <FormLabel>Email</FormLabel>
      </FormField>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('shows required indicator when required', () => {
    render(
      <FormField>
        <FormLabel required>Email</FormLabel>
      </FormField>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows optional indicator when optional', () => {
    render(
      <FormField>
        <FormLabel optional>Nickname</FormLabel>
      </FormField>
    )
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })
})

describe('FormSection', () => {
  it('renders as fieldset', () => {
    render(<FormSection title="Personal Info">Fields</FormSection>)
    const fieldset = screen.getByRole('group')
    expect(fieldset).toBeInTheDocument()
    expect(fieldset.tagName).toBe('FIELDSET')
  })

  it('renders title', () => {
    render(<FormSection title="Personal Info">Fields</FormSection>)
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(
      <FormSection title="Info" description="Fill in your details">
        Fields
      </FormSection>
    )
    expect(screen.getByText('Fill in your details')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<FormSection>Section content</FormSection>)
    expect(screen.getByText('Section content')).toBeInTheDocument()
  })
})

describe('FormActions', () => {
  it('renders children', () => {
    render(
      <FormActions>
        <button>Submit</button>
      </FormActions>
    )
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('defaults to right alignment', () => {
    render(
      <FormActions data-testid="actions">
        <button>Submit</button>
      </FormActions>
    )
    expect(screen.getByTestId('actions').className).toContain('justify-end')
  })

  it('applies left alignment', () => {
    render(
      <FormActions align="left" data-testid="actions">
        <button>Submit</button>
      </FormActions>
    )
    expect(screen.getByTestId('actions').className).toContain('justify-start')
  })

  it('applies center alignment', () => {
    render(
      <FormActions align="center" data-testid="actions">
        <button>Submit</button>
      </FormActions>
    )
    expect(screen.getByTestId('actions').className).toContain('justify-center')
  })

  it('applies between alignment', () => {
    render(
      <FormActions align="between" data-testid="actions">
        <button>Cancel</button>
        <button>Submit</button>
      </FormActions>
    )
    expect(screen.getByTestId('actions').className).toContain('justify-between')
  })
})

describe('Form disabled propagation', () => {
  it('disabled prop propagates to FormLabel opacity', () => {
    render(
      <Form disabled>
        <FormField>
          <FormLabel>Name</FormLabel>
        </FormField>
      </Form>
    )
    const label = screen.getByText('Name').closest('label')!
    expect(label.className).toContain('opacity-50')
  })

  it('FormField disabled overrides form context', () => {
    render(
      <Form>
        <FormField disabled>
          <FormLabel>Name</FormLabel>
        </FormField>
      </Form>
    )
    const label = screen.getByText('Name').closest('label')!
    expect(label.className).toContain('opacity-50')
  })
})
