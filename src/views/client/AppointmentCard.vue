<template>
  <div class="card" style="padding: 18px; display: flex; align-items: center; gap: 16px;">
    <div :style="{
      width: '56px', height: '56px', borderRadius: '8px', background: 'var(--surface-2)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--border)', flexShrink: 0,
    }">
      <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">
        {{ dayAbbr }}
      </div>
      <div style="font-size: 18px; font-weight: 700;">{{ dayNum }}</div>
    </div>
    <AppAvatar :name="appointment.masterName" :tone="avatarTone" />
    <div style="flex: 1; min-width: 0;">
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <span style="font-weight: 600;">{{ appointment.serviceName }}</span>
        <StatusBadge :status="appointment.status" />
      </div>
      <div style="color: var(--text-muted); font-size: 12px; margin-top: 2px;">
        with <b style="color: var(--text);">{{ appointment.masterName }}</b>
        · {{ appointmentDateTime }}
      </div>
    </div>
    <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
      <template v-if="appointment.status === 'SCHEDULED'">
        <v-btn variant="text" size="small" color="error" @click="emit('cancel')">Cancel</v-btn>
      </template>
      <template v-if="appointment.status === 'COMPLETED' && !appointment.hasReview">
        <v-btn variant="tonal" size="small" color="primary" @click="emit('review')">
          <AppIcon name="star" :size="12" style="margin-right: 4px;" /> Leave review
        </v-btn>
      </template>
      <template v-if="appointment.status === 'COMPLETED' && appointment.hasReview">
        <span style="color: var(--text-muted); font-size: 12px; padding: 0 12px;">Reviewed</span>
      </template>
      <template v-if="appointment.status === 'CANCELLED'">
        <router-link :to="`/masters/${appointment.masterId}`">
          <v-btn variant="tonal" size="small">Rebook</v-btn>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import AppIcon from '@/components/AppIcon.vue'
import type { Appointment } from '@/api/appointments'
import { getAvatarTone } from '@/utils/avatarTones'
import { formatDayAbbr, formatDayNum, formatDateTime } from '@/utils/dateUtils'

const props = defineProps<{ appointment: Appointment }>()
const emit = defineEmits<{ cancel: []; review: [] }>()

const avatarTone = computed(() => getAvatarTone(props.appointment.masterName))
const dayAbbr = computed(() => formatDayAbbr(props.appointment.date))
const dayNum = computed(() => formatDayNum(props.appointment.date))
const appointmentDateTime = computed(() => formatDateTime(props.appointment.date, props.appointment.startTime))
</script>
