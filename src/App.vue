<template>
  <RouterView />
  <AppToast />
  <AiChatWidget v-if="showChat" />
</template>

<script setup lang="ts">
import { watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import AppToast from '@/components/AppToast.vue'
import AiChatWidget from '@/components/AiChatWidget.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const vuetifyTheme = useTheme()
const route = useRoute()

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
const showChat = computed(() => !AUTH_ROUTES.includes(route.path))

watchEffect(() => {
  vuetifyTheme.change(themeStore.dark ? 'slotifaiDark' : 'slotifai')
})
</script>
