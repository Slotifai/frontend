import apiClient from './client'
import type { PaginatedResult } from '@/types/api'
export type { PaginatedResult }

export interface AdminStats {
  totalUsers: number
  totalMasters: number
  totalClients: number
  totalAppointments: number
  appointmentsByStatus: { SCHEDULED: number; COMPLETED: number; CANCELLED: number }
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'CLIENT' | 'MASTER' | 'ADMIN'
  status: 'ACTIVE' | 'BLOCKED'
  createdAt: string
  appointmentsCount?: number
}

export interface AdminAppointment {
  id: string
  clientName: string
  masterName: string
  serviceName: string
  date: string
  startTime: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  price: number
}

function normalizeUser(u: unknown): AdminUser {
  const raw = u as Record<string, unknown>
  const profile = raw.profile as Record<string, unknown> | null | undefined
  const firstName = (profile?.firstName as string) || (raw.firstName as string) || ''
  const lastName = (profile?.lastName as string) || (raw.lastName as string) || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  const name = fullName || (profile?.name as string) || (raw.name as string) || (raw.email as string) || '?'
  return {
    ...((u as unknown) as AdminUser),
    id: String(raw.id),
    name,
    role: String(raw.role).toUpperCase() as AdminUser['role'],
    status: String(raw.status ?? 'active').toUpperCase() as AdminUser['status'],
  }
}

function normalizeAppointment(a: unknown): AdminAppointment {
  const raw = a as Record<string, unknown>
  const client = raw.client as Record<string, unknown> | null | undefined
  const master = raw.master as Record<string, unknown> | null | undefined
  const service = raw.service as Record<string, unknown> | null | undefined
  const startTime = raw.startTime as string
  return {
    id: String(raw.id),
    clientName: (client?.name as string) || (client?.email as string) || '—',
    masterName: (master?.name as string) || '—',
    serviceName: (service?.name as string) || '—',
    date: startTime,
    startTime: startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    price: Number(service?.price ?? 0),
    status: String(raw.status).toUpperCase() as AdminAppointment['status'],
  }
}

function normalizeStats(raw: unknown): AdminStats {
  const r = raw as Record<string, unknown>
  const byStatus = (r.appointments ?? {}) as Record<string, number>
  const appointmentsByStatus = {
    SCHEDULED: byStatus.SCHEDULED ?? byStatus.scheduled ?? 0,
    COMPLETED: byStatus.COMPLETED ?? byStatus.completed ?? 0,
    CANCELLED: byStatus.CANCELLED ?? byStatus.cancelled ?? 0,
  }
  return {
    totalUsers: Number(r.totalUsers ?? 0),
    totalMasters: Number(r.totalMasters ?? 0),
    totalClients: Number(r.totalClients ?? 0),
    totalAppointments: appointmentsByStatus.SCHEDULED + appointmentsByStatus.COMPLETED + appointmentsByStatus.CANCELLED,
    appointmentsByStatus,
  }
}

export const adminApi = {
  getStats: () =>
    apiClient.get<unknown>('/admin/stats').then(r => normalizeStats(r.data)),

  getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    apiClient
      .get<PaginatedResult<unknown>>('/admin/users', {
        params: params ? {
          ...params,
          role: params.role?.toLowerCase(),
        } : undefined,
      })
      .then(r => ({ ...r.data, data: r.data.data.map(normalizeUser) })),

  blockUser: (id: string) =>
    apiClient.patch(`/admin/users/${id}/block`).then(r => r.data),

  unblockUser: (id: string) =>
    apiClient.patch(`/admin/users/${id}/unblock`).then(r => r.data),

  deleteUser: (id: string) =>
    apiClient.delete(`/admin/users/${id}`).then(r => r.data),

  getMasters: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    apiClient
      .get<PaginatedResult<unknown>>('/admin/masters', {
        params: params ? { ...params, status: params.status?.toLowerCase() } : undefined,
      })
      .then(r => ({ ...r.data, data: r.data.data.map(normalizeUser) })),

  getAppointments: (params?: { page?: number; limit?: number; status?: string; search?: string; date?: string; masterId?: string }) =>
    apiClient
      .get<PaginatedResult<unknown>>('/admin/appointments', {
        params: params ? { ...params, status: params.status?.toLowerCase() } : undefined,
      })
      .then(r => ({ ...r.data, data: r.data.data.map(normalizeAppointment) })),

}
