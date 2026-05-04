import apiClient from './client'
import type { MasterService } from './masters'

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  } catch { return iso }
}

function mapAppointment(a: any): MasterAppointment {
  return {
    id: a.id,
    clientName: a.client?.name ?? a.clientName ?? '',
    clientPhone: a.client?.phone ?? a.clientPhone,
    clientEmail: a.client?.user?.email ?? a.clientEmail,
    clientNotes: a.notes ?? a.clientNotes,
    serviceId: a.service?.id ?? a.serviceId,
    serviceName: a.service?.name ?? a.serviceName ?? '',
    serviceDurationMinutes: a.service?.durationMinutes ?? a.serviceDurationMinutes ?? 0,
    price: a.service?.price ?? a.price ?? 0,
    date: a.startTime ? a.startTime.slice(0, 10) : a.date,
    startTime: a.startTime ? formatTime(a.startTime) : a.startTime,
    endTime: a.endTime ? formatTime(a.endTime) : a.endTime,
    status: a.status?.toUpperCase() as MasterAppointment['status'],
  }
}

export interface WorkingHour {
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  isDayOff: boolean
  startTime: string
  endTime: string
}

export interface MasterAppointment {
  id: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  clientNotes?: string
  serviceId: string
  serviceName: string
  serviceDurationMinutes: number
  price: number
  date: string
  startTime: string
  endTime?: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

export interface AppointmentNote {
  id: string
  authorName: string
  authorRole: 'CLIENT' | 'MASTER'
  text: string
  createdAt: string
}

export interface MasterProfile {
  id: string
  name: string
  email: string
  phone?: string
  specialization?: string
  notes?: string
  rating?: number
  reviewCount?: number
  createdAt?: string
}

export const masterMeApi = {
  getAppointments: (params?: { page?: number; limit?: number; date?: string; status?: string }) =>
    apiClient.get<{ data: any[]; total: number }>('/appointments/master', { params }).then(r => ({
      ...r.data,
      data: r.data.data.map(mapAppointment),
    })),

  getAppointment: (id: string) =>
    apiClient.get<any>(`/appointments/${id}`).then(r => mapAppointment(r.data)),

  completeAppointment: (id: string) =>
    apiClient.patch(`/appointments/${id}/status`, { status: 'completed' }).then(r => r.data),

  cancelAppointment: (id: string) =>
    apiClient.patch(`/appointments/${id}/cancel`).then(r => r.data),

  getNotes: (id: string) =>
    apiClient.get<AppointmentNote[]>(`/appointments/${id}/notes`).then(r => r.data),

  addNote: (id: string, text: string) =>
    apiClient.post<AppointmentNote>(`/appointments/${id}/notes`, { text }).then(r => r.data),

  getServices: () =>
    apiClient.get<MasterService[]>('/masters/me/services').then(r => r.data),

  createService: (payload: { name: string; durationMinutes: number; price: number }) =>
    apiClient.post<MasterService>('/masters/me/services', payload).then(r => r.data),

  updateService: (id: string, payload: Partial<{ name: string; durationMinutes: number; price: number }>) =>
    apiClient.patch<MasterService>(`/masters/me/services/${id}`, payload).then(r => r.data),

  deleteService: (id: string) =>
    apiClient.delete(`/masters/me/services/${id}`).then(r => r.data),
  getWorkingHours: () => {
    const NUM_TO_DAY: Record<number, WorkingHour['day']> = {
      0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY',
      4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY',
    }
    return apiClient.get<{ dayOfWeek: number; isDayOff: boolean; startTime: string; endTime: string }[]>('/masters/me/working-hours')
      .then(r => r.data.map(h => ({
        day: NUM_TO_DAY[h.dayOfWeek],
        isDayOff: h.isDayOff,
        startTime: h.startTime,
        endTime: h.endTime,
      } as WorkingHour)))
  },

  saveWorkingHours: (hours: WorkingHour[]) => {
    const DAY_TO_NUM: Record<WorkingHour['day'], number> = {
      SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
      THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
    }
    const schedule = hours.map((h) => ({
      dayOfWeek: DAY_TO_NUM[h.day],
      startTime: h.startTime,
      endTime: h.endTime,
      isDayOff: h.isDayOff,
    }))
    return apiClient.put<WorkingHour[]>('/masters/me/working-hours', { schedule }).then(r => r.data)
  },

  getProfile: () =>
    apiClient.get<{ email: string; createdAt: string; profile: { id: number; name: string; phone?: string; specialization?: string; notes?: string } | null }>('/auth/me')
      .then(r => ({
        id: String(r.data.profile?.id ?? ''),
        name: r.data.profile?.name ?? '',
        email: r.data.email,
        phone: r.data.profile?.phone,
        specialization: r.data.profile?.specialization,
        notes: r.data.profile?.notes,
        createdAt: r.data.createdAt,
      } as MasterProfile)),

  updateProfile: (payload: Partial<{ name: string; phone: string; specialization: string; notes: string }>) =>
    apiClient.patch('/masters/me', payload).then(r => r.data),
}
