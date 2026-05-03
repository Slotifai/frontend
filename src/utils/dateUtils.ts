import { format, parseISO } from 'date-fns'

export function formatDate(date: string): string {
  try { return format(new Date(date), 'MMM d, yyyy') } catch { return date }
}

export function formatDateTime(date: string, time: string): string {
  try { return `${format(parseISO(date), 'EEE, MMM d')} · ${time}` } catch { return date }
}

export function formatDateLong(date: string): string {
  try { return format(parseISO(date), 'EEEE, MMMM d, yyyy') } catch { return date }
}

export function formatDateTimeLong(date: string, time: string): string {
  try { return `${format(parseISO(date), 'EEEE, MMMM d')} · ${time}` } catch { return date }
}

export function formatDayAbbr(date: string): string {
  try { return format(parseISO(date), 'EEE') } catch { return '?' }
}

export function formatDayNum(date: string): string {
  try { return format(parseISO(date), 'd') } catch { return '?' }
}

export function formatActivityDate(date: string): string {
  try { return format(new Date(date), 'MMM d, h:mm a') } catch { return date }
}
