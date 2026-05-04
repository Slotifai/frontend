import apiClient from './client'
import type { PaginatedResult } from '@/types/api'
export type { PaginatedResult }

export interface Master {
  id: string
  name: string
  specialization: string
  notes?: string
  phone?: string
  rating: number
  reviewCount: number
  bookingCount?: number
  experience?: string
  tags?: string[]
  minPrice?: number
}

export interface MasterService {
  id: string
  name: string
  durationMinutes: number
  price: number
}

export interface Review {
  id: string
  clientName: string
  clientTone?: string
  rating: number
  comment?: string
  createdAt: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface MastersQuery {
  search?: string
  specialization?: string
  page?: number
  limit?: number
}

export const mastersApi = {
  list: (params?: MastersQuery) =>
    apiClient.get<PaginatedResult<Master>>('/masters', { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Master>(`/masters/${id}`).then((r) => r.data),

  getServices: (id: string) =>
    apiClient.get<MasterService[]>(`/masters/${id}/services`).then((r) => r.data),

  getReviews: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient
      .get<PaginatedResult<Review>>(`/masters/${id}/reviews`, { params })
      .then((r) => r.data),

  getAvailability: (id: string, params: { date: string; serviceId: string }) =>
    apiClient
      .get<{ slots: string[] }>(`/masters/${id}/availability`, {
        params: { ...params, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      })
      .then((r) => r.data.slots.map((time) => ({ time, available: true }))),
}
