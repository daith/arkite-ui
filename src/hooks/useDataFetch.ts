import { useState, useRef, useCallback, useEffect } from 'react'

interface UseDataFetchOptions<T> {
  /** Initial data value */
  initialData?: T
  /** Fetch data immediately on mount */
  fetchOnMount?: boolean
  /** Callback when fetch succeeds */
  onSuccess?: (data: T) => void
  /** Callback when fetch fails */
  onError?: (error: Error) => void
}

interface UseDataFetchReturn<T> {
  /** Current data */
  data: T | undefined
  /** Loading state */
  loading: boolean
  /** Error state */
  error: Error | null
  /** Manually trigger a refresh */
  refresh: () => Promise<void>
  /** Update data locally without fetching */
  setData: React.Dispatch<React.SetStateAction<T | undefined>>
  /** Whether initial fetch is complete */
  isReady: boolean
}

/**
 * Custom hook for data fetching with manual refresh control.
 *
 * Features:
 * - Only fetches on mount (once) by default
 * - Prevents duplicate concurrent requests
 * - Provides manual refresh function
 * - Handles loading and error states
 *
 * @example
 * ```tsx
 * const { data, loading, refresh } = useDataFetch(
 *   () => api.getUsers(),
 *   { initialData: [] }
 * )
 * ```
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseDataFetchOptions<T> = {}
): UseDataFetchReturn<T> {
  const {
    initialData,
    fetchOnMount = true,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(fetchOnMount)
  const [error, setError] = useState<Error | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Track if a fetch is in progress to prevent duplicates
  const fetchingRef = useRef(false)
  // Track if component is mounted
  const mountedRef = useRef(true)
  // Track if initial fetch has been done
  const initialFetchDoneRef = useRef(false)
  // Store the fetch function ref to avoid dependency issues
  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const refresh = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) {
      return
    }

    fetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFnRef.current()

      // Only update state if component is still mounted
      if (mountedRef.current) {
        setData(result)
        setIsReady(true)
        onSuccess?.(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
      fetchingRef.current = false
    }
  }, [onSuccess, onError])

  // Initial fetch on mount - only runs once
  useEffect(() => {
    if (fetchOnMount && !initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true
      refresh()
    }

    return () => {
      mountedRef.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only run on mount
  }, [])

  return {
    data,
    loading,
    error,
    refresh,
    setData,
    isReady,
  }
}

/**
 * Hook for data that needs client-side filtering.
 * Fetches once and filters locally.
 */
export function useFilteredData<T>(
  fetchFn: () => Promise<T[]>,
  filterFn: (items: T[]) => T[],
  options: UseDataFetchOptions<T[]> = {}
): UseDataFetchReturn<T[]> & { filteredData: T[] } {
  const result = useDataFetch(fetchFn, { ...options, initialData: options.initialData ?? [] })

  const filteredData = result.data ? filterFn(result.data) : []

  return {
    ...result,
    filteredData,
  }
}
