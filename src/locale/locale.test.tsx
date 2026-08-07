import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LocaleProvider, useLocale, enUS, zhTW } from './index'
import { Spinner } from '../components/spinner'
import { FilterBarSearch } from '../components/filter-bar'
import { Pagination } from '../components/pagination'
import { NoResults } from '../components/empty-state'

function ShowString({ pick }: { pick: (l: ReturnType<typeof useLocale>) => string }) {
  const locale = useLocale()
  return <span>{pick(locale)}</span>
}

describe('LocaleProvider', () => {
  it('defaults to English without a provider', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('zhTW locale swaps component strings', () => {
    render(
      <LocaleProvider locale={zhTW}>
        <Spinner />
        <FilterBarSearch />
      </LocaleProvider>
    )
    expect(screen.getByLabelText('載入中')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('搜尋…')).toBeInTheDocument()
  })

  it('explicit props win over the locale', () => {
    render(
      <LocaleProvider locale={zhTW}>
        <FilterBarSearch placeholder="找訂單" />
      </LocaleProvider>
    )
    expect(screen.getByPlaceholderText('找訂單')).toBeInTheDocument()
  })

  it('partial locales fall back to English per key', () => {
    render(
      <LocaleProvider locale={{ spinner: { loading: '讀取中' } }}>
        <Spinner />
        <FilterBarSearch />
      </LocaleProvider>
    )
    expect(screen.getByLabelText('讀取中')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('template strings localize with values', () => {
    render(
      <LocaleProvider locale={zhTW}>
        <ShowString pick={(l) => l.bulkActionBar.selected(3)} />
      </LocaleProvider>
    )
    expect(screen.getByText('已選取 3 筆')).toBeInTheDocument()
  })

  it('localizes aria-labels in composed components', () => {
    render(
      <LocaleProvider locale={zhTW}>
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
        <NoResults />
      </LocaleProvider>
    )
    expect(screen.getByLabelText('下一頁')).toBeInTheDocument()
    expect(screen.getByText('查無結果')).toBeInTheDocument()
  })

  it('en and zh-TW cover the identical key sets', () => {
    const compareShapes = (a: object, b: object, path: string) => {
      const aKeys = Object.keys(a).sort()
      const bKeys = Object.keys(b).sort()
      expect(bKeys, path).toEqual(aKeys)
      for (const key of aKeys) {
        const av = (a as Record<string, unknown>)[key]
        const bv = (b as Record<string, unknown>)[key]
        expect(typeof bv, `${path}.${key}`).toBe(typeof av)
        if (typeof av === 'object' && av !== null && !Array.isArray(av)) {
          compareShapes(av as object, bv as object, `${path}.${key}`)
        }
      }
    }
    compareShapes(enUS, zhTW, 'locale')
  })
})
