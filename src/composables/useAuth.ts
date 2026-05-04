import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  const user = computed(() => auth.user)
  const isAuthenticated = computed(() => auth.isAuthenticated)
  const role = computed(() => auth.role)

  async function login(payload: LoginPayload) {
    const tokens = await authApi.login(payload)
    auth.setTokens(tokens.accessToken, tokens.refreshToken)
    const user = await authApi.me()
    auth.setUser(user)
    return user
  }

  async function register(payload: RegisterPayload) {
    return authApi.register(payload)
  }

  function logout() {
    authApi.logout().catch(() => {})
    auth.logout()
    router.push('/login')
  }

  function redirectByRole() {
    const r = auth.role
    if (r === 'CLIENT') router.push('/dashboard')
    else if (r === 'MASTER') router.push('/master/dashboard')
    else if (r === 'ADMIN') router.push('/admin')
    else router.push('/login')
  }

  return { user, isAuthenticated, role, login, register, logout, redirectByRole }
}
