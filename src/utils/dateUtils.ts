import { format, parseISO } from 'date-fns'
import { enUS, uk } from 'date-fns/locale'
import { i18n } from '@/i18n'

export function getLocale() {
  const lang = (i18n.global.locale as unknown as { value: string }).value ?? i18n.global.locale
  return lang === 'uk' ? uk : enUS
}

export function formatDate(date: string): string {
  try { return format(new Date(date), 'MMM d, yyyy', { locale: getLocale() }) } catch { return date }
}

export function formatDateTime(date: string, time: string): string {
  try { return `${format(parseISO(date), 'EEE, MMM d', { locale: getLocale() })} · ${time}` } catch { return date }
}

export function formatDateLong(date: string): string {
  try { return format(parseISO(date), 'EEEE, MMMM d, yyyy', { locale: getLocale() }) } catch { return date }
}

export function formatDateTimeLong(date: string, time: string): string {
  try { return `${format(parseISO(date), 'EEEE, MMMM d', { locale: getLocale() })} · ${time}` } catch { return date }
}

export function formatDayAbbr(date: string): string {
  try { return format(parseISO(date), 'EEE', { locale: getLocale() }) } catch { return '?' }
}

export function formatDayNum(date: string): string {
  try { return format(parseISO(date), 'd') } catch { return '?' }
}

export function formatActivityDate(date: string): string {
  try { return format(new Date(date), 'MMM d, h:mm a', { locale: getLocale() }) } catch { return date }
}
