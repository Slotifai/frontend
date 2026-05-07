<template>
  <button class="lang-switch" @click="toggle" :title="locale === 'uk' ? 'Switch to English' : 'Перейти на українську'">
    <span class="lang-label">{{ locale === 'uk' ? 'UA' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/i18n'

const { locale } = useI18n()

function toggle() {
  const next: Locale = locale.value === 'uk' ? 'en' : 'uk'
  locale.value = next
  localStorage.setItem('locale', next)
}
</script>

<style scoped>
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: var(--r-md);
  border: 1.5px solid var(--border);
  background: transparent;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
  transition: all var(--t-fast);
  white-space: nowrap;
}
.lang-switch:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-50);
}
</style>
