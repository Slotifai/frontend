<template>
  <button class="theme-toggle-btn" @click="themeStore.toggle()" :title="themeStore.dark ? t('nav.lightMode') : t('nav.darkMode')">
    <span :class="themeStore.dark ? 'mdi mdi-weather-sunny' : 'mdi mdi-weather-night'" />
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()
const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  border: 1.5px solid var(--border);
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 16px;
  transition: all var(--t-fast);
}
.theme-toggle-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-50);
}
</style>
