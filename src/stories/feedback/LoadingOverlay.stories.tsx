import type { Meta, StoryFn } from '@storybook/react-vite'
import { LoadingOverlay } from '../../components/loading-overlay'

const meta: Meta = {
  title: 'Feedback/LoadingOverlay',
  component: LoadingOverlay,
  parameters: { layout: 'padded' },
}

export default meta

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-48 w-full rounded-md border bg-background p-4">
    <p className="text-sm text-muted-foreground">Content underneath the overlay</p>
    <p className="mt-2 text-sm">This text is covered by the loading overlay.</p>
    {children}
  </div>
)

export const Default: StoryFn = () => (
  <Box>
    <LoadingOverlay />
  </Box>
)

export const WithLabel: StoryFn = () => (
  <Box>
    <LoadingOverlay label="Loading data..." />
  </Box>
)

export const WithBlur: StoryFn = () => (
  <Box>
    <LoadingOverlay blur label="Processing..." />
  </Box>
)

export const Sizes: StoryFn = () => (
  <div className="flex gap-4">
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <div key={size} className="relative h-32 w-48 rounded-md border bg-background p-4">
        <p className="text-xs text-muted-foreground">size=&quot;{size}&quot;</p>
        <LoadingOverlay size={size} />
      </div>
    ))}
  </div>
)

export const Hidden: StoryFn = () => (
  <Box>
    <LoadingOverlay visible={false} />
  </Box>
)
Hidden.parameters = {
  docs: { description: { story: 'When `visible={false}`, nothing is rendered.' } },
}

export const CustomContent: StoryFn = () => (
  <Box>
    <LoadingOverlay>
      <div className="text-center">
        <div className="text-2xl">⏳</div>
        <p className="mt-1 text-sm font-medium">Please wait...</p>
      </div>
    </LoadingOverlay>
  </Box>
)
