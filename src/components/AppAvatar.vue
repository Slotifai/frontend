<template>
  <span :class="cls" :style="{ background: tone.bg, color: tone.fg }">{{ initials }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarTone = 'primary' | 'accent' | 'teal' | 'rose' | 'sage' | 'indigo'

const props = withDefaults(
  defineProps<{ name?: string; size?: AvatarSize; tone?: AvatarTone }>(),
  { name: '?', size: 'md', tone: 'primary' },
)

const TONES: Record<AvatarTone, { bg: string; fg: string }> = {
  primary: { bg: 'var(--primary-soft)', fg: 'var(--primary)' },
  accent:  { bg: 'var(--accent-soft)',  fg: 'var(--warning)'  },
  teal:    { bg: '#D6E8EC', fg: '#0F4C5C' },
  rose:    { bg: '#F7DDE0', fg: '#9B3848' },
  sage:    { bg: '#DCE8DD', fg: '#3F6B4F' },
  indigo:  { bg: '#DCE0F0', fg: '#3F4A8C' },
}

const initials = computed(() =>
  (props.name || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

const cls = computed(() => ({
  avatar: true,
  'avatar-lg': props.size === 'lg',
  'avatar-sm': props.size === 'sm',
}))

const tone = computed(() => TONES[props.tone] ?? TONES.primary)
</script>
