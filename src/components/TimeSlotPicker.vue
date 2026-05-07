<template>
  <div>
    <div class="slot-grid">
      <button
        v-for="slot in slots"
        :key="slot.time"
        class="slot"
        :class="{
          selected: slot.time === modelValue,
          disabled: !slot.available,
        }"
        :disabled="!slot.available"
        @click="slot.available && emit('update:modelValue', slot.time)"
      >
        {{ slot.time }}
      </button>
    </div>
    <div v-if="slots.length === 0" style="color:var(--text-muted); font-size:13px; padding:8px 0;">
      No available slots for this date.
    </div>
    <div style="display:flex; gap:16px; margin-top:12px; font-size:11px; color:var(--text-muted);">
      <span>Available</span>
      <span>· Selected</span>
      <span>· Booked</span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TimeSlot {
  time: string
  available: boolean
}

defineProps<{ slots: TimeSlot[]; modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [time: string] }>()
</script>
