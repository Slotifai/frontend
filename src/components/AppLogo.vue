<template>
  <span style="display:inline-flex; align-items:center; gap:8px;">
    <span :style="{
      width: `${size}px`, height: `${size}px`, borderRadius: '6px',
      background: 'var(--primary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: `${Math.round(size * 0.55)}px`,
      letterSpacing: '-0.5px', flexShrink: 0,
    }">S</span>
    <span style="font-weight:700; font-size:16px; letter-spacing:-0.01em; color:var(--text);">Slotifai</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 22 })
</script>
