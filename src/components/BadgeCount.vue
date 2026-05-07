<template>
  <span v-if="count > 0" class="badge-count">{{ count > 99 ? '99+' : count }}</span>
</template>

<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<style scoped>
.badge-count {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  background: var(--primary);
  color: #fff;
  padding: 1px 6px;
  border-radius: 999px;
}
</style>
