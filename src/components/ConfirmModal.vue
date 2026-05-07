<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      @click.self="emit('update:modelValue', false)"
      style="position:fixed; inset:0; background:rgba(15,30,46,.4); display:flex; align-items:center; justify-content:center; z-index:9999;"
    >
      <div class="card" style="width:380px; box-shadow:var(--el-3); overflow:hidden;">
        <div style="padding:20px 24px 8px;">
          <div style="font-size:15px; font-weight:600;">{{ title }}</div>
        </div>
        <div style="padding:0 24px 16px; color:var(--text-muted); font-size:14px; line-height:1.5;">
          {{ message }}
        </div>
        <div style="padding:12px 16px; display:flex; justify-content:flex-end; gap:8px; background:var(--surface-2);">
          <v-btn variant="text" size="small" @click="emit('update:modelValue', false)">
            {{ cancelLabel }}
          </v-btn>
          <v-btn
            :color="confirmColor"
            size="small"
            :loading="loading"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </v-btn>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    confirmColor?: string
    loading?: boolean
  }>(),
  {
    title: 'Confirm',
    message: 'Are you sure?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'error',
    loading: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>
