<template>
  <span :class="`badge badge-${status.toLowerCase()}`">
    <span class="badge-dot" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Status = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE' | 'BLOCKED'

const props = defineProps<{ status: Status }>()

const LABELS: Record<Status, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ACTIVE: 'Active',
  BLOCKED: 'Blocked',
}

const label = computed(() => LABELS[props.status] ?? props.status)
</script>
