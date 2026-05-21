<template>
  <DashboardLayout>
    <div class="page-content" style="display: flex; justify-content: center;">
      <div style="width: 560px; max-width: 100%;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: var(--text-muted); font-size: 13px;">
          <router-link to="/dashboard" style="display: flex; align-items: center; gap: 6px; color: var(--text-muted); text-decoration: none;">
            <AppIcon name="arrow-left" :size="16" /> {{ t('review.backToAppointments') }}
          </router-link>
        </div>

        <div style="font-size: 24px; font-weight: 600; margin-bottom: 4px;">{{ t('review.title') }}</div>
        <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">{{ t('review.subtitle') }}</div>

        <LoadingSpinner v-if="loading" />

        <template v-else-if="appointment">
          <div class="card card-pad" style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
            <AppAvatar :name="appointment.masterName" :tone="avatarTone" />
            <div style="flex: 1;">
              <div style="font-weight: 600;">{{ appointment.masterName }} · {{ appointment.serviceName }}</div>
              <div style="color: var(--text-muted); font-size: 12px;">{{ formatDate }}</div>
            </div>
            <StatusBadge status="COMPLETED" />
          </div>
          <div class="card card-pad">
            <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">{{ t('review.ratingLabel') }}</div>
            <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">{{ t('review.ratingHint') }}</div>
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 8px;">
              <span
                v-for="i in 5"
                :key="i"
                style="cursor: pointer;"
                @click="rating = i"
                @mouseenter="hovered = i"
                @mouseleave="hovered = 0"
              >
                <AppIcon
                  name="star"
                  :size="40"
                  :color="i <= (hovered || rating) ? '#E5A823' : '#C9CDD3'"
                />
              </span>
            </div>
            <div
              v-if="rating"
              style="text-align: center; font-size: 13px; font-weight: 600; margin-bottom: 24px;"
              :style="{ color: rating >= 4 ? 'var(--success)' : rating === 3 ? 'var(--warning)' : 'var(--danger)' }"
            >{{ ratingLabel }}</div>
            <div v-else style="height: 24px; margin-bottom: 24px;" />
            <div>
              <FormTextarea
                v-model="comment"
                :label="t('review.commentLabel')"
                :placeholder="t('review.commentPlaceholder')"
                min-height="110px"
              />
              <div style="font-size: 11px; color: var(--text-subtle); text-align: right; margin-top: 2px;">
                {{ comment.length }} / 500
              </div>
            </div>

            <ErrorMessage :message="serverError" style="margin-top: 12px;" />

            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
              <v-btn variant="text" @click="router.push('/dashboard')">{{ t('common.cancel') }}</v-btn>
              <v-btn color="primary" :disabled="!rating" :loading="submitting" @click="submit">
                {{ t('review.submit') }}
              </v-btn>
            </div>
          </div>
        </template>

        <EmptyState v-else icon="star" title="Appointment not found" description="">
          <router-link to="/dashboard"><v-btn color="primary" size="small">Back to dashboard</v-btn></router-link>
        </EmptyState>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import AppIcon from '@/components/AppIcon.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import { appointmentsApi, type Appointment } from '@/api/appointments'
import { TONES } from '@/utils/avatarTones'
import { useAsyncState } from '@/composables/useAsyncState'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'
import { formatDateTimeLong } from '@/utils/dateUtils'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const appointmentId = computed(() => route.params.id as string)
const { loading, data: appointment, execute: fetchAppointment } = useAsyncState<Appointment | null>(
  () => appointmentsApi.get(appointmentId.value),
  null,
)
const submitting = ref(false)
const serverError = ref('')

const rating = ref(0)
const hovered = ref(0)
const comment = ref('')

const ratingLabel = computed(() => {
  if (!rating.value) return ''
  return t(`review.ratings[${rating.value}]`)
})

const avatarTone = computed(() => {
  if (!appointment.value) return 'primary' as const
  return TONES[appointment.value.masterName.charCodeAt(0) % TONES.length]
})

const formatDate = computed(() =>
  appointment.value ? formatDateTimeLong(appointment.value.date, appointment.value.startTime) : ''
)

async function submit() {
  if (!rating.value) return
  serverError.value = ''
  submitting.value = true
  try {
    await appointmentsApi.createReview(appointmentId.value, {
      rating: rating.value,
      comment: comment.value || undefined,
    })
    router.push('/dashboard')
  } catch (err: unknown) {
    serverError.value = extractErrorMessage(err, 'Failed to submit review.')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchAppointment)
</script>
