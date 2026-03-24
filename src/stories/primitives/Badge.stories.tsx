import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'destructive', 'outline', 'info'],
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Error' },
}

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  Pattern: Status Badge                                              */
/*  Use Badge + a status config map to display statuses consistently. */
/*  Keep the mapping in your project, not in @arkite/ui.              */
/* ------------------------------------------------------------------ */

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'info' | 'outline' | 'secondary'

/** Example: define a status config map in your project */
const orderStatusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  processing: { label: 'Processing', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'outline' },
}

/** Reusable pattern — wrap in your project as a helper */
const StatusBadge = ({ status, map }: { status: string; map: Record<string, { label: string; variant: BadgeVariant }> }) => {
  const info = map[status]
  return <Badge variant={info?.variant ?? 'outline'}>{info?.label ?? status}</Badge>
}

/** Active / inactive toggle — a common one-liner, no wrapper needed */
const ActiveBadge = ({ isActive }: { isActive: boolean }) => (
  <Badge variant={isActive ? 'success' : 'outline'}>
    {isActive ? 'Active' : 'Inactive'}
  </Badge>
)

export const StatusBadgePattern: Story = {
  name: 'Pattern: Status Badge',
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-3">Order statuses</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(orderStatusMap).map((status) => (
            <StatusBadge key={status} status={status} map={orderStatusMap} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Active / Inactive</p>
        <div className="flex gap-2">
          <ActiveBadge isActive />
          <ActiveBadge isActive={false} />
        </div>
      </div>

      <div className="rounded-md border border-border p-4 text-xs text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">How to use this pattern:</p>
        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{`// 1. Define status map in your project
const statusMap = {
  active:   { label: '啟用', variant: 'success' },
  inactive: { label: '停用', variant: 'outline' },
}

// 2. Use Badge directly
<Badge variant={statusMap[status].variant}>
  {statusMap[status].label}
</Badge>`}</pre>
      </div>
    </div>
  ),
}
