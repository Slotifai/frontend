<template>
  <div
    class="card"
    style="overflow: hidden; cursor: pointer; transition: box-shadow 0.15s;"
    @click="emit('view')"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :style="hovered ? 'box-shadow: var(--el-3);' : ''"
  >
    <div style="height: 140px; background-image: repeating-linear-gradient(135deg, var(--surface-3) 0 8px, var(--surface-2) 8px 16px); display: flex; align-items: center; justify-content: center;">
      <AppAvatar :name="master.name" size="lg" :tone="avatarTone" />
    </div>

    <div style="padding: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
        <div>
          <div style="font-weight: 600; font-size: 14px;">{{ master.name }}</div>
          <div style="color: var(--text-muted); font-size: 12px;">{{ specializationLabel }}</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">
        <StarRating :model-value="Math.round(master.rating)" :size="13" />
        <span style="font-size: 12px; font-weight: 600;">{{ master.rating.toFixed(1) }}</span>
        <span style="color: var(--text-muted); font-size: 12px;">({{ master.reviewCount }})</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: var(--text);">
          {{ t('masters.from') }} {{ minPrice }} ₴
        </span>
        <v-btn
          color="primary"
          size="small"
          @click.stop="emit('book')"
        >{{ t('masters.book') }}</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/AppAvatar.vue'
import StarRating from '@/components/StarRating.vue'
import { type Master } from '@/api/masters'
import { getAvatarTone } from '@/utils/avatarTones'
import { SPEC_KEY_BY_API } from '@/constants/specializations'

const { t } = useI18n()

const props = defineProps<{ master: Master }>()
const emit = defineEmits<{ view: []; book: [] }>()

const hovered = ref(false)
const avatarTone = computed(() => getAvatarTone(props.master.name))

const minPrice = computed(() => props.master.minPrice ?? '?')
const specializationLabel = computed(() => {
  const key = SPEC_KEY_BY_API[props.master.specialization]
  return key ? t(`masters.specs.${key}`) : props.master.specialization
})
</script>
