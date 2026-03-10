import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tree, type TreeNode } from './Tree'

const sampleData: TreeNode[] = [
  {
    key: 'root',
    label: 'Root',
    children: [
      {
        key: 'child-1',
        label: 'Child 1',
        children: [
          { key: 'grandchild-1', label: 'Grandchild 1' },
          { key: 'grandchild-2', label: 'Grandchild 2' },
        ],
      },
      { key: 'child-2', label: 'Child 2' },
    ],
  },
  { key: 'sibling', label: 'Sibling' },
]

const disabledData: TreeNode[] = [
  {
    key: 'root',
    label: 'Root',
    children: [
      { key: 'disabled-child', label: 'Disabled Child', disabled: true },
      { key: 'enabled-child', label: 'Enabled Child' },
    ],
  },
]

describe('Tree', () => {
  it('renders tree nodes', () => {
    render(<Tree data={sampleData} defaultExpandedKeys={['root']} />)
    expect(screen.getByText('Root')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Sibling')).toBeInTheDocument()
  })

  it('expands/collapses nodes on click', async () => {
    const user = userEvent.setup()
    render(<Tree data={sampleData} />)

    // Children are not visible by default
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument()

    // Click expand button on Root
    const expandBtn = screen.getByLabelText('Expand Root')
    await user.click(expandBtn)
    expect(screen.getByText('Child 1')).toBeInTheDocument()

    // Click again to collapse
    const collapseBtn = screen.getByLabelText('Collapse Root')
    await user.click(collapseBtn)
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
  })

  it('shows children when expanded', async () => {
    const user = userEvent.setup()
    render(<Tree data={sampleData} />)

    await user.click(screen.getByLabelText('Expand Root'))
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()

    // Grandchildren should not be visible yet
    expect(screen.queryByText('Grandchild 1')).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('Expand Child 1'))
    expect(screen.getByText('Grandchild 1')).toBeInTheDocument()
    expect(screen.getByText('Grandchild 2')).toBeInTheDocument()
  })

  it('selects a node on click', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <Tree
        data={sampleData}
        defaultExpandedKeys={['root']}
        onSelect={onSelect}
      />
    )

    await user.click(screen.getByText('Child 2'))
    expect(onSelect).toHaveBeenCalledWith('child-2', expect.objectContaining({ key: 'child-2' }))
  })

  it('checkable mode renders checkboxes', () => {
    render(
      <Tree
        data={sampleData}
        defaultExpandedKeys={['root']}
        checkable
        checkedKeys={[]}
      />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('checking parent checks all children', async () => {
    const onCheckChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Tree
        data={sampleData}
        defaultExpandedKeys={['root', 'child-1']}
        checkable
        checkedKeys={[]}
        onCheckChange={onCheckChange}
      />
    )

    // Click the checkbox on Root
    const checkboxes = screen.getAllByRole('checkbox')
    // First checkbox is Root's
    await user.click(checkboxes[0])

    const checkedKeys: string[] = onCheckChange.mock.calls[0][0]
    expect(checkedKeys).toContain('root')
    expect(checkedKeys).toContain('child-1')
    expect(checkedKeys).toContain('child-2')
    expect(checkedKeys).toContain('grandchild-1')
    expect(checkedKeys).toContain('grandchild-2')
  })

  it('unchecking all children unchecks parent', async () => {
    const onCheckChange = vi.fn()
    const user = userEvent.setup()

    // Start with only child-2 checked (the only non-parent leaf under root
    // besides grandchild children) — we check grandchild-1 to then uncheck it
    const { rerender } = render(
      <Tree
        data={sampleData}
        defaultExpandedKeys={['root', 'child-1']}
        checkable
        checkedKeys={['grandchild-1']}
        onCheckChange={onCheckChange}
      />
    )

    // Uncheck grandchild-1
    const checkboxes = screen.getAllByRole('checkbox')
    // grandchild-1 is the 3rd checkbox (Root, Child 1, Grandchild 1)
    await user.click(checkboxes[2])

    const checkedKeys: string[] = onCheckChange.mock.calls[0][0]
    expect(checkedKeys).not.toContain('grandchild-1')
    expect(checkedKeys).not.toContain('child-1')
    expect(checkedKeys).not.toContain('root')
  })

  it('partial children checked shows indeterminate on parent', () => {
    render(
      <Tree
        data={sampleData}
        defaultExpandedKeys={['root', 'child-1']}
        checkable
        checkedKeys={['grandchild-1']}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    // Root checkbox should be indeterminate (some descendants checked)
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'mixed')
    // Child 1 should also be indeterminate
    expect(checkboxes[1]).toHaveAttribute('aria-checked', 'mixed')
  })

  it('disabled nodes are not clickable', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <Tree
        data={disabledData}
        defaultExpandedKeys={['root']}
        onSelect={onSelect}
      />
    )

    await user.click(screen.getByText('Disabled Child'))
    expect(onSelect).not.toHaveBeenCalled()

    // Enabled child should work
    await user.click(screen.getByText('Enabled Child'))
    expect(onSelect).toHaveBeenCalledWith(
      'enabled-child',
      expect.objectContaining({ key: 'enabled-child' })
    )
  })

  it('default expanded keys work', () => {
    render(
      <Tree
        data={sampleData}
        defaultExpandedKeys={['root', 'child-1']}
      />
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Grandchild 1')).toBeInTheDocument()
    expect(screen.getByText('Grandchild 2')).toBeInTheDocument()
  })
})
