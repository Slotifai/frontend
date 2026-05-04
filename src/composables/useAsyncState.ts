import { ref, type Ref } from 'vue'
import { extractErrorMessage } from '@/utils/errorUtils'

export function useAsyncState<T>(fetchFn: () => Promise<T>, initial: T) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T>(initial) as Ref<T>

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchFn()
    } catch (e) {
      error.value = extractErrorMessage(e)
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, execute }
}
