export const ROLE_HOME: Record<string, string> = {
  CLIENT: '/dashboard',
  MASTER: '/master/dashboard',
  ADMIN: '/admin',
}

export function getRoleHomePath(role: string | null | undefined): string {
  return (role && ROLE_HOME[role]) ?? '/dashboard'
}
