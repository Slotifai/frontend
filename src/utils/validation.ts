import { i18n } from '@/i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function t(key: string, params?: Record<string, unknown>): string {
  return i18n.global.t(key, params ?? {}) as string
}

export function validateEmail(value: string): string {
  return EMAIL_RE.test(value) ? '' : t('validation.emailInvalid')
}

export function validateRequired(value: string): string {
  return value.trim() ? '' : t('validation.required')
}

export function validatePassword(value: string, minLen = 8): string {
  return value.length >= minLen ? '' : t('validation.passwordMin', { min: minLen })
}

const UA_PHONE_RE = /^\+380\d{9}$/

export function validatePhone(value: string): string {
  if (!value.trim()) return t('validation.phoneRequired')
  return UA_PHONE_RE.test(value) ? '' : t('validation.phoneInvalid')
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}
