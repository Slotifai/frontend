<template>
  <div style="display:flex; align-items:center; justify-content:center; padding:40px;">
    <div
      class="spinner"
      :style="{ width: `${size}px`, height: `${size}px`, borderWidth: `${Math.max(2, size / 12)}px` }"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>
