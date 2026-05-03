export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 350): T {
  let timer: ReturnType<typeof setTimeout>
  return function (...args: unknown[]) {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  } as T
}
