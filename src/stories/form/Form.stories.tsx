import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormSection,
  FormActions,
} from '../../components/form'
import { Input } from '../../components/input'
import { Select } from '../../components/select'
import { Button } from '../../components/button'

const meta = {
  title: 'Form/Form',
  component: Form,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Form className="w-96">
      <FormSection title="Profile" description="Update your personal information">
        <FormField name="name">
          <FormLabel required>Full Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" />
          </FormControl>
        </FormField>

        <FormField name="email">
          <FormLabel required>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="john@example.com" />
          </FormControl>
          <FormDescription>We'll never share your email.</FormDescription>
        </FormField>

        <FormField name="role">
          <FormLabel>Role</FormLabel>
          <FormControl>
            <Select
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              placeholder="Select role..."
            />
          </FormControl>
        </FormField>
      </FormSection>

      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save</Button>
      </FormActions>
    </Form>
  ),
}

export const WithErrors: Story = {
  render: () => (
    <Form className="w-96">
      <FormField name="email" error="Invalid email address">
        <FormLabel required>Email</FormLabel>
        <FormControl>
          <Input type="email" placeholder="john@example.com" error />
        </FormControl>
        <FormMessage />
      </FormField>

      <FormField name="password" error="Password must be at least 8 characters">
        <FormLabel required>Password</FormLabel>
        <FormControl>
          <Input type="password" error />
        </FormControl>
        <FormMessage />
      </FormField>
    </Form>
  ),
}
