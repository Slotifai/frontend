export const SPECIALIZATION_KEYS = [
  'all', 'hair', 'nails', 'massage', 'brows', 'makeup', 'barber',
] as const

export type SpecializationKey = typeof SPECIALIZATION_KEYS[number]

export const SPEC_API_VALUE: Record<SpecializationKey, string> = {
  all: 'All',
  hair: 'Hair',
  nails: 'Nails',
  massage: 'Massage',
  brows: 'Brows & Lashes',
  makeup: 'Makeup',
  barber: 'Barber',
}

export const SPECIALIZATIONS = [
  'All', 'Hair', 'Nails', 'Massage', 'Brows & Lashes', 'Makeup', 'Barber',
] as const

export const SPEC_KEY_BY_API: Record<string, SpecializationKey> = Object.fromEntries(
  Object.entries(SPEC_API_VALUE).map(([k, v]) => [v, k as SpecializationKey])
)
