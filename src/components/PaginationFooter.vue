<template>
  <div v-if="total > limit" style="display: flex; justify-content: center; margin-top: 24px;">
    <AppPagination :page="page" :limit="limit" :total="total" @update:page="$emit('update:page', $event)" />
  </div>
</template>

<script setup lang="ts">
import AppPagination from '@/components/AppPagination.vue'

defineProps<{ page: number; limit: number; total: number }>()
defineEmits<{ 'update:page': [page: number] }>()
</script>
