import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { TenantSwitcher, type TenantItem } from '../../components/tenant-switcher'

const sampleTenants: TenantItem[] = [
  { id: '1', name: 'Acme Corporation', slug: 'acme', status: 'active', statusVariant: 'success', planLabel: 'Pro' },
  { id: '2', name: 'Beta Industries', slug: 'beta', status: 'active', statusVariant: 'success', planLabel: 'Starter' },
  { id: '3', name: 'Gamma Tech', slug: 'gamma', status: 'trial', statusVariant: 'warning', planLabel: 'Free' },
  { id: '4', name: 'Delta Solutions', slug: 'delta', status: 'suspended', statusVariant: 'destructive', planLabel: 'Enterprise' },
  { id: '5', name: 'Epsilon Labs', slug: 'epsilon', status: 'active', statusVariant: 'success', planLabel: 'Pro' },
]

const meta: Meta = {
  title: 'Navigation/TenantSwitcher',
  component: TenantSwitcher,
}

export default meta

const DefaultDemo = () => {
  const [current, setCurrent] = useState<TenantItem | null>(null)
  return (
    <TenantSwitcher
      tenants={sampleTenants}
      currentTenant={current}
      onSelect={setCurrent}
    />
  )
}

export const Default: StoryFn = () => <DefaultDemo />

const WithSelectedDemo = () => {
  const [current, setCurrent] = useState<TenantItem | null>(sampleTenants[0])
  return (
    <TenantSwitcher
      tenants={sampleTenants}
      currentTenant={current}
      onSelect={setCurrent}
    />
  )
}

export const WithSelected: StoryFn = () => <WithSelectedDemo />

const NoAllOptionDemo = () => {
  const [current, setCurrent] = useState<TenantItem | null>(sampleTenants[0])
  return (
    <TenantSwitcher
      tenants={sampleTenants}
      currentTenant={current}
      onSelect={setCurrent}
      showAllOption={false}
    />
  )
}

export const NoAllOption: StoryFn = () => <NoAllOptionDemo />

export const Loading: StoryFn = () => (
  <TenantSwitcher
    tenants={[]}
    loading
  />
)

const CustomRenderDemo = () => {
  const [current, setCurrent] = useState<TenantItem | null>(null)
  return (
    <TenantSwitcher
      tenants={sampleTenants}
      currentTenant={current}
      onSelect={setCurrent}
      renderTenant={(tenant, selected) => (
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
            {tenant.name.charAt(0)}
          </div>
          <span className="text-sm flex-1">{tenant.name}</span>
          {selected && <span className="text-xs text-primary">✓</span>}
        </div>
      )}
    />
  )
}

export const CustomRender: StoryFn = () => <CustomRenderDemo />
