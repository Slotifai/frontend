import apiClient from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: 'CLIENT' | 'MASTER'
  specialization?: string
  notes?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: 'CLIENT' | 'MASTER' | 'ADMIN'
  }
}

type RawTokenResponse = {
  accessToken: string
  refreshToken: string
}

type RawMeResponse = {
  id: string | number
  email: string
  role: string
  isEmailVerified: boolean
  createdAt: string
  profile: { id: number; name: string; phone: string } | null
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<RawTokenResponse>('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload) => {
    const endpoint =
      payload.role === 'MASTER' ? '/auth/register/master' : '/auth/register/client'
    const { role, ...body } = payload
    return apiClient.post<{ message: string }>(endpoint, body).then((r) => r.data)
  },

  refresh: (refreshToken: string) =>
    apiClient
      .post<RawTokenResponse>('/auth/refresh', { refresh_token: refreshToken })
      .then((r) => r.data),

  me: () =>
    apiClient.get<RawMeResponse>('/auth/me').then((r) => ({
      id: String(r.data.id),
      email: r.data.email,
      name: r.data.profile?.name ?? r.data.email,
      role: r.data.role.toUpperCase() as AuthResponse['user']['role'],
    })),

  verifyEmail: (token: string) =>
    apiClient.get('/auth/verify-email', { params: { token } }).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),

  adminLogin: (payload: LoginPayload) =>
    apiClient.post<RawTokenResponse>('/auth/admin/login', payload).then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),

  telegramLinkToken: () =>
    apiClient.post<{ token: string; deepLink: string }>('/auth/telegram-link-token').then((r) => r.data),

}
