import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserRole = 'CLIENT' | 'MASTER' | 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)
    const authReady = ref(true)

    const isAuthenticated = computed(() => !!accessToken.value)
    const role = computed(() => user.value?.role ?? null)

    function setTokens(access: string, refresh: string) {
      accessToken.value = access
      refreshToken.value = refresh
    }

    function setUser(u: AuthUser) {
      user.value = u
    }

    function logout() {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
    }

    return { accessToken, refreshToken, user, isAuthenticated, role, setTokens, setUser, logout }
  },
  {
    persist: true,
  },
)
