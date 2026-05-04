import { ref, type Ref } from 'vue'

export function useConfirmAction<T>(actionFn: (target: T) => Promise<void>, onSuccess?: () => void) {
  const open = ref(false)
  const target = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)

  function ask(item: T) {
    target.value = item
    open.value = true
  }

  async function confirm() {
    if (!target.value) return
    loading.value = true
    try {
      await actionFn(target.value)
      open.value = false
      onSuccess?.()
    } finally {
      loading.value = false
    }
  }

  return { open, target, loading, ask, confirm }
}
