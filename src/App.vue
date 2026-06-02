<template>
  <template v-if="ready">
    <RouterView />
    <AppToast />
    <AiChatWidget v-if="showChat" />
  </template>
</template>

<script setup lang="ts">
import { watchEffect, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import AppToast from '@/components/AppToast.vue'
import AiChatWidget from '@/components/AiChatWidget.vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'

const themeStore = useThemeStore()
const vuetifyTheme = useTheme()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
const showChat = computed(() => !AUTH_ROUTES.includes(route.path))
const ready = ref(false)

watchEffect(() => {
  vuetifyTheme.change(themeStore.dark ? 'slotifaiDark' : 'slotifai')
})

onMounted(async () => {
  if (auth.accessToken) {
    try {
      const user = await authApi.me()
      auth.setUser(user)
    } catch {
      auth.logout()
      router.push('/login')
    }
  }
  ready.value = true
})
</script>
