import apiClient from './client'
import type { PaginatedResult } from '@/types/api'
export type { PaginatedResult }

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

export interface Appointment {
  id: string
  masterId: string
  masterName: string
  masterSpecialization?: string
  clientId?: string
  clientName?: string
  serviceId: string
  serviceName: string
  serviceDurationMinutes: number
  price: number
  date: string
  startTime: string
  endTime?: string
  status: AppointmentStatus
  notes?: string
  hasReview?: boolean
}

export interface CreateAppointmentPayload {
  masterId: string
  serviceId: string
  startTime: string
  date?: string
  notes?: string
}

export interface AppointmentsQuery {
  page?: number
  limit?: number
  status?: AppointmentStatus
  date?: string
  masterId?: string
}

function normalizeAppointment(a: unknown): Appointment {
  const ap = a as Record<string, unknown>
  const master = ap.master as Record<string, unknown> | undefined
  const service = ap.service as Record<string, unknown> | undefined
  const startTimeRaw = ap.startTime as string
  const date = startTimeRaw ? startTimeRaw.slice(0, 10) : ''
  const timePart = startTimeRaw ? startTimeRaw.slice(11, 16) : ''
  return {
    id: String(ap.id),
    masterId: String(master?.id ?? ap.masterId),
    masterName: (master?.name as string) || (ap.masterName as string) || '',
    masterSpecialization: (master?.specialization as string) || (ap.masterSpecialization as string) || '',
    serviceId: String(service?.id ?? ap.serviceId),
    serviceName: (service?.name as string) || (ap.serviceName as string) || '',
    serviceDurationMinutes: (service?.durationMinutes as number) || (ap.serviceDurationMinutes as number) || 0,
    price: Number((service?.price ?? ap.price) || 0),
    date,
    startTime: timePart,
    endTime: ap.endTime as string | undefined,
    status: String(ap.status).toUpperCase() as AppointmentStatus,
    notes: ap.notes as string | undefined,
    hasReview: ap.hasReview as boolean | undefined,
  }
}

export const appointmentsApi = {
  create: (payload: CreateAppointmentPayload) => {
    const startTime =
      payload.date && !payload.startTime.includes('T')
        ? `${payload.date}T${payload.startTime}:00.000Z`
        : payload.startTime
    return apiClient
      .post<unknown>('/appointments', {
        serviceId: Number(payload.serviceId),
        masterId: Number(payload.masterId),
        startTime,
      })
      .then((r) => normalizeAppointment(r.data))
  },

  get: (id: string) =>
    apiClient.get<unknown>(`/appointments/${id}`).then((r) => normalizeAppointment(r.data)),

  myList: (params?: AppointmentsQuery) =>
    apiClient
      .get<PaginatedResult<unknown>>('/appointments/my', {
        params: params?.status
          ? { ...params, status: params.status.toLowerCase() }
          : params,
      })
      .then((r) => ({
        ...r.data,
        data: r.data.data.map(normalizeAppointment),
      })),

  cancel: (id: string) =>
    apiClient.patch<unknown>(`/appointments/${id}/cancel`).then((r) => normalizeAppointment(r.data)),

  createReview: (id: string, payload: { rating: number; comment?: string }) =>
    apiClient.post(`/appointments/${id}/review`, payload).then((r) => r.data),
}
