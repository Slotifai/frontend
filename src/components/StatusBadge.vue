<template>
  <span :class="`badge badge-${status.toLowerCase()}`">
    <span class="badge-dot" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type Status = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE' | 'BLOCKED'

const props = defineProps<{ status: Status }>()
const { t } = useI18n()

const label = computed(() => {
  const map: Record<Status, string> = {
    SCHEDULED: t('common.scheduled'),
    COMPLETED: t('common.completed'),
    CANCELLED: t('common.cancelled'),
    ACTIVE: t('common.active'),
    BLOCKED: t('common.blocked'),
  }
  return map[props.status] ?? props.status
})
</script>
