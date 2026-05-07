<template>
  <div>
    <div v-if="label" style="font-size: 12px; color: var(--text-muted); font-weight: 500; margin-bottom: 4px;">{{ label }}</div>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :style="{ width: '100%', minHeight: minHeight ?? '90px', padding: '12px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-strong)', font: 'inherit', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue: string; label?: string; placeholder?: string; minHeight?: string }>(), {
  placeholder: '',
})
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
