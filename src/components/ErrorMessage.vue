<template>
  <div v-if="message" class="error-msg">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string | null }>()
</script>

<style scoped>
.error-msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--danger, #dc2626);
  font-size: 13px;
  padding: 10px 14px;
  background: var(--danger-soft, #FEF2F2);
  border-radius: var(--r-sm);
  border: 1px solid var(--danger-border, #fecaca);
  border-left: 3px solid var(--danger, #dc2626);
  line-height: 1.4;
}
</style>
