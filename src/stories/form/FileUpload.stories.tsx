import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileUpload, FileUploadButton } from '../../components/file-upload'

const meta = {
  title: 'Form/FileUpload',
  component: FileUpload,
  argTypes: {
    multiple: { control: 'boolean' },
    showFileList: { control: 'boolean' },
  },
  args: {
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
}

export const MultipleFiles: Story = {
  args: { multiple: true, maxFiles: 5 },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
}

export const ButtonVariant: Story = {
  render: () => (
    <FileUploadButton accept="image/*">
      Upload Image
    </FileUploadButton>
  ),
}
