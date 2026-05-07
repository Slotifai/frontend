<template>
  <div style="display:flex; align-items:center; gap:4px;">
    <button
      class="pag-btn"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
    >
      <AppIcon name="chevron-left" :size="14" />
    </button>

    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="pag-ellipsis">…</span>
      <button
        v-else
        class="pag-btn"
        :class="{ active: p === page }"
        @click="emit('update:page', p as number)"
      >{{ p }}</button>
    </template>

    <button
      class="pag-btn"
      :disabled="page >= totalPages"
      @click="emit('update:page', page + 1)"
    >
      <AppIcon name="chevron-right" :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{ page: number; limit?: number; total: number }>(),
  { limit: 10 },
)

const emit = defineEmits<{ 'update:page': [page: number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)))

const pages = computed(() => {
  const tp = totalPages.value
  const cur = props.page
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const result: (number | string)[] = [1]
  if (cur > 3) result.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(tp - 1, cur + 1); i++) result.push(i)
  if (cur < tp - 2) result.push('...')
  result.push(tp)
  return result
})
</script>

<style scoped>
.pag-btn {
  min-width: 32px; height: 32px; padding: 0 6px;
  border-radius: var(--r-sm); border: none; background: transparent;
  color: var(--text); font-size: 13px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--font-sans);
  transition: background 0.12s;
}
.pag-btn:hover:not(:disabled) { background: var(--surface-2); }
.pag-btn.active { background: var(--primary); color: #fff; font-weight: 600; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-ellipsis { padding: 0 4px; color: var(--text-muted); font-size: 13px; }
</style>
