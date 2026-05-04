import { ref } from 'vue'

export interface PaginatedFetchResult<T> {
  data: T[]
  total: number
}

export function usePaginatedList<T>(
  fetchFn: (params: { page: number; limit: number }) => Promise<PaginatedFetchResult<T>>,
  limit = 20,
) {
  const items = ref<T[]>([]) as import('vue').Ref<T[]>
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    try {
      const result = await fetchFn({ page: page.value, limit })
      items.value = result.data
      total.value = result.total
    } catch {
      items.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  function goPage(p: number) {
    page.value = p
    return fetch()
  }

  function reset() {
    page.value = 1
    return fetch()
  }

  return { items, total, page, limit, loading, fetch, goPage, reset }
}
