import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import router from '@/router'

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      const status = error.response?.status
      if (!status || status >= 500) {
        const toast = useToastStore()
        toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
      }
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const auth = useAuthStore()

    if (!auth.refreshToken) {
      isRefreshing = false
      processQueue(new Error('No refresh token'), null)
      auth.logout()
      router.push('/login')
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post('/api/auth/refresh', { refresh_token: auth.refreshToken })
      const accessToken = data.accessToken ?? data.access_token ?? ''
      const refreshToken = data.refreshToken ?? data.refresh_token ?? ''
      auth.setTokens(accessToken, refreshToken)
      processQueue(null, accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch (err) {
      processQueue(err, null)
      auth.logout()
      router.push('/login')
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
