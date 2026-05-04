import apiClient from './client'

export interface ClientProfile {
  id: string
  name: string
  email: string
  phone?: string
  notes?: string
}

export interface ClientReview {
  id: string
  masterName: string
  serviceName: string
  rating: number
  comment?: string
  createdAt: string
}

export const clientsApi = {
  getMe: () =>
    apiClient.get<ClientProfile>('/clients/me').then(r => r.data),

  updateMe: (payload: Partial<{ name: string; phone: string; notes: string }>) =>
    apiClient.patch<ClientProfile>('/clients/me', payload).then(r => r.data),

  getMyReviews: () =>
    apiClient.get<ClientReview[]>('/clients/me/reviews').then(r => r.data),
}
