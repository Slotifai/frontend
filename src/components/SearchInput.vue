<template>
  <div :style="{ position: 'relative', flex: maxWidth ? undefined : '1', minWidth: maxWidth ? undefined : '200px', maxWidth: maxWidth ?? '280px', width: maxWidth }">
    <AppIcon
      name="search"
      :size="14"
      color="var(--text-muted)"
      style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); pointer-events: none;"
    />
    <input
      :value="modelValue"
      :placeholder="placeholder"
      style="width: 100%; height: 32px; padding: 0 12px 0 30px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); font-size: 13px; font-family: var(--font-sans); outline: none; box-sizing: border-box;"
      @input="onInput($event as InputEvent)"
    />
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'

withDefaults(defineProps<{ modelValue: string; placeholder?: string; maxWidth?: string }>(), {
  placeholder: 'Search…',
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; input: [value: string] }>()

function onInput(e: InputEvent) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
  emit('input', val)
}
</script>
