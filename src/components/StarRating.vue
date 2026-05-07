<template>
  <span class="stars" :style="{ fontSize: `${size}px` }">
    <span
      v-for="i in max"
      :key="i"
      @click="interactive ? emit('update:modelValue', i) : null"
      @mouseenter="interactive ? (hovered = i) : null"
      @mouseleave="interactive ? (hovered = 0) : null"
      :style="{ cursor: interactive ? 'pointer' : 'default' }"
    >
      <AppIcon
        :name="i <= display ? 'star' : 'star-empty'"
        :size="size"
        :color="i <= display ? '#E5A823' : '#C9CDD3'"
      />
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{ modelValue?: number; max?: number; size?: number; interactive?: boolean }>(),
  { modelValue: 0, max: 5, size: 14, interactive: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const hovered = ref(0)
const display = computed(() => hovered.value || props.modelValue)
</script>
