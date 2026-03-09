import { useState, useCallback } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { VirtualList, InfiniteScroll } from '../../components/virtual-list'
import { Badge } from '../../components/badge'

const meta: Meta = {
  title: 'Data Display/VirtualList',
}

export default meta

// Generate sample data
function generateItems(count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i,
    name: `Item ${offset + i + 1}`,
    status: ['active', 'inactive', 'pending'][i % 3] as string,
    value: Math.floor(Math.random() * 1000),
  }))
}

const BasicDemo = () => {
  const items = generateItems(10000)
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Rendering 10,000 items with virtual scrolling</p>
      <VirtualList
        items={items}
        getItemKey={(item) => item.id}
        estimateSize={48}
        height={400}
        className="border rounded-lg"
        renderItem={(item) => (
          <div className="flex items-center justify-between px-4 py-3 border-b hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{item.name}</span>
              <Badge variant={item.status === 'active' ? 'success' : item.status === 'pending' ? 'warning' : 'secondary'}>
                {item.status}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{item.value}</span>
          </div>
        )}
      />
    </div>
  )
}

export const Basic: StoryFn = () => <BasicDemo />

const DynamicHeightDemo = () => {
  const items = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: i % 3 === 0
      ? 'Short description.'
      : i % 3 === 1
        ? 'This is a medium length description that takes a bit more space to display properly.'
        : 'This is a longer description that demonstrates dynamic height virtual scrolling. Each item can have a different height and the virtualizer will measure them correctly.',
  }))

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Dynamic item heights (measured after render)</p>
      <VirtualList
        items={items}
        getItemKey={(item) => item.id}
        estimateSize={80}
        height={400}
        dynamicSize
        gap={1}
        className="border rounded-lg"
        renderItem={(item) => (
          <div className="px-4 py-3 border-b">
            <p className="font-medium text-sm">{item.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
        )}
      />
    </div>
  )
}

export const DynamicHeight: StoryFn = () => <DynamicHeightDemo />

const InfiniteScrollDemo = () => {
  const [items, setItems] = useState(() => generateItems(50))
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const handleLoadMore = useCallback(() => {
    if (loadingMore) return
    setLoadingMore(true)
    // Simulate async load
    setTimeout(() => {
      setItems((prev) => {
        const newItems = [...prev, ...generateItems(30, prev.length)]
        if (newItems.length >= 500) setHasMore(false)
        return newItems
      })
      setLoadingMore(false)
    }, 800)
  }, [loadingMore])

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Loaded: {items.length} items {hasMore ? '(scroll for more)' : '(all loaded)'}
      </p>
      <InfiniteScroll
        items={items}
        getItemKey={(item) => item.id}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        estimateSize={48}
        height={400}
        threshold={300}
        className="border rounded-lg"
        renderItem={(item) => (
          <div className="flex items-center justify-between px-4 py-3 border-b hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium">{item.name}</span>
            <Badge variant="secondary">{item.value}</Badge>
          </div>
        )}
      />
    </div>
  )
}

export const InfiniteScrollExample: StoryFn = () => <InfiniteScrollDemo />

const EmptyStateDemo = () => (
  <VirtualList
    items={[]}
    renderItem={() => null}
    height={200}
    className="border rounded-lg"
    emptyContent="No items to display"
  />
)

export const EmptyState: StoryFn = () => <EmptyStateDemo />

const LoadingDemo = () => (
  <VirtualList
    items={[]}
    renderItem={() => null}
    loading
    height={200}
    className="border rounded-lg"
  />
)

export const Loading: StoryFn = () => <LoadingDemo />
