export function extractErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string }
  const msg = e?.response?.data?.message
  if (Array.isArray(msg)) return msg.join('. ')
  return msg ?? e?.message ?? fallback
}
