const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): string {
  return EMAIL_RE.test(value) ? '' : 'Enter a valid email'
}

export function validateRequired(value: string, label = 'This field'): string {
  return value.trim() ? '' : `${label} is required`
}

export function validatePassword(value: string, minLen = 8): string {
  return value.length >= minLen ? '' : `Password must be at least ${minLen} characters`
}

const UA_PHONE_RE = /^\+380\d{9}$/

export function validatePhone(value: string): string {
  if (!value.trim()) return 'Phone number is required'
  return UA_PHONE_RE.test(value) ? '' : 'Enter a valid Ukrainian phone (+380XXXXXXXXX)'
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}
