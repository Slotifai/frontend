<template>
  <span :class="cls" :style="imgSrc ? {} : { background: tone.bg, color: tone.fg }">
    <img v-if="imgSrc" :src="imgSrc" :alt="name" class="avatar-img" @error="onImgError" />
    <template v-else>{{ initials }}</template>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarTone = 'primary' | 'accent' | 'teal' | 'rose' | 'sage' | 'indigo'

const props = withDefaults(
  defineProps<{ name?: string; size?: AvatarSize; tone?: AvatarTone; src?: string | null }>(),
  { name: '?', size: 'md', tone: 'primary', src: null },
)

const TONES: Record<AvatarTone, { bg: string; fg: string }> = {
  primary: { bg: 'var(--primary-soft)', fg: 'var(--primary)' },
  accent:  { bg: 'var(--accent-soft)',  fg: 'var(--warning)'  },
  teal:    { bg: 'var(--avatar-teal-bg, #D6E8EC)', fg: 'var(--avatar-teal-fg, #0F4C5C)' },
  rose:    { bg: 'var(--avatar-rose-bg, #F7DDE0)', fg: 'var(--avatar-rose-fg, #9B3848)' },
  sage:    { bg: 'var(--avatar-sage-bg, #DCE8DD)', fg: 'var(--avatar-sage-fg, #3F6B4F)' },
  indigo:  { bg: 'var(--avatar-indigo-bg, #DCE0F0)', fg: 'var(--avatar-indigo-fg, #3F4A8C)' },
}

const imgError = ref(false)
watch(() => props.src, () => { imgError.value = false })

const imgSrc = computed(() => (!imgError.value && props.src) ? props.src : null)

function onImgError() { imgError.value = true }

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

<style scoped>
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
}
</style>
