<template>
  <div class="empty">
    <div class="empty-icon">
      <AppIcon :name="icon" :size="26" />
    </div>
    <div style="font-weight:600; color:var(--text);">{{ title }}</div>
    <div style="font-size:13px; margin-top:4px; margin-bottom:14px;">{{ description }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{ icon?: string; title?: string; description?: string }>(),
  { icon: 'circle', title: 'Nothing here yet', description: '' },
)
</script>
