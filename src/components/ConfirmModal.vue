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
            :color="props.confirmColor"
            size="small"
            :loading="props.loading"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
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
    title: '',
    message: '',
    confirmLabel: '',
    cancelLabel: '',
    confirmColor: 'error',
    loading: false,
  },
)

const cancelLabel = computed(() => props.cancelLabel || t('common.cancel'))
const confirmLabel = computed(() => props.confirmLabel || t('common.confirm'))

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>
