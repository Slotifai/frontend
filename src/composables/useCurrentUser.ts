import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'

export function useCurrentUser() {
  const auth = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const user = computed(() => auth.user)
  const role = computed(() => auth.role)
  const isAuthenticated = computed(() => auth.isAuthenticated)

  async function refresh() {
    if (!auth.isAuthenticated) return
    loading.value = true
    error.value = null
    try {
      const u = await authApi.me()
      auth.setUser(u)
    } catch (e) {
      error.value = 'Failed to load user'
    } finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { user, role, isAuthenticated, loading, error, refresh }
}
