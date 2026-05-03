export const TONES = ['rose', 'teal', 'accent', 'sage', 'indigo', 'primary'] as const
export type AvatarTone = typeof TONES[number]

export function getAvatarTone(name: string): AvatarTone {
  return TONES[(name?.charCodeAt(0) ?? 0) % TONES.length]
}
