import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const dark = ref(false)

  function apply() {
    document.documentElement.classList.toggle('dark', dark.value)
  }

  function toggle() {
    dark.value = !dark.value
  }

  watch(dark, apply, { immediate: true })

  return { dark, toggle }
}, { persist: true })
