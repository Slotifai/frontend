<template>
  <Teleport to="body">
    <div style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none;">
      <Transition
        v-for="t in toastStore.toasts"
        :key="t.id"
        name="toast"
      >
        <div
          :style="{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderRadius: 'var(--r-md)',
            boxShadow: 'var(--el-3)',
            background: bgColor(t.type),
            border: `1px solid ${borderColor(t.type)}`,
            minWidth: '280px', maxWidth: '400px',
            pointerEvents: 'all', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }"
          @click="toastStore.dismiss(t.id)"
        >
          <AppIcon :name="iconName(t.type)" :size="16" :color="iconColor(t.type)" style="flex-shrink: 0;" />
          <span style="font-size: 13px; font-weight: 500; flex: 1; line-height: 1.4;">{{ t.message }}</span>
          <AppIcon name="close" :size="14" color="var(--text-muted)" style="flex-shrink: 0;" />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import type { ToastType } from '@/stores/toast'
import AppIcon from './AppIcon.vue'

const toastStore = useToastStore()

function bgColor(type: ToastType) {
  if (type === 'success') return 'var(--success-soft)'
  if (type === 'error') return 'var(--danger-soft)'
  if (type === 'warning') return '#FFF8E6'
  return 'var(--primary-50)'
}
function borderColor(type: ToastType) {
  if (type === 'success') return 'var(--success)'
  if (type === 'error') return 'var(--danger)'
  if (type === 'warning') return 'var(--warning)'
  return 'var(--primary)'
}
function iconColor(type: ToastType) {
  if (type === 'success') return 'var(--success)'
  if (type === 'error') return 'var(--danger)'
  if (type === 'warning') return 'var(--warning)'
  return 'var(--primary)'
}
function iconName(type: ToastType) {
  if (type === 'success') return 'check'
  if (type === 'error') return 'close'
  if (type === 'warning') return 'info'
  return 'info'
}
</script>

<style>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
