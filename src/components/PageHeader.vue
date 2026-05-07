<template>
  <div class="page-header">
    <div>
      <div class="page-title">{{ title }}</div>
      <div v-if="subtitle" class="page-subtitle">{{ subtitle }}</div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
