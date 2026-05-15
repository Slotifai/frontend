<template>
  <PublicLayout>
    <div style="padding: 24px 40px;">
      <div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">
        <router-link to="/masters" style="color: var(--text-muted); text-decoration: none;">{{ t('nav.findMasters') }}</router-link>
        <AppIcon name="chevron-right" :size="12" />
        <router-link :to="`/masters/${masterId}`" style="color: var(--text-muted); text-decoration: none;">{{ master?.name ?? '…' }}</router-link>
        <AppIcon name="chevron-right" :size="12" />
        <span style="color: var(--text);">{{ t('booking.breadcrumb') }}</span>
      </div>
      <div class="card card-pad" style="padding: 20px 28px; margin-bottom: 16px;">
        <div class="sl-stepper">
          <template v-for="(label, i) in STEPS" :key="i">
            <div class="sl-step" :class="{ done: i < step, active: i === step }">
              <span class="sl-step-num">
                <AppIcon v-if="i < step" name="check" :size="14" :stroke="2.4" />
                <span v-else>{{ i + 1 }}</span>
              </span>
              <span class="sl-step-label">{{ label }}</span>
            </div>
            <div v-if="i < STEPS.length - 1" class="sl-step-line" :style="i < step ? 'background: var(--primary)' : ''" />
          </template>
        </div>
      </div>

      <LoadingSpinner v-if="loadingMaster" />

      <div v-else style="display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: flex-start;">
        <div class="card card-pad">
          <template v-if="step === 0">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">{{ t('booking.step1Title') }}</div>
            <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">{{ t('booking.step1Subtitle') }}</div>
            <LoadingSpinner v-if="loadingServices" />
            <div v-else style="display: flex; flex-direction: column; gap: 10px;">
              <label
                v-for="s in services"
                :key="s.id"
                class="card"
                :style="{
                  padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
                  borderColor: selectedService?.id === s.id ? 'var(--primary)' : 'var(--border)',
                  background: selectedService?.id === s.id ? 'var(--primary-50)' : 'var(--surface)',
                }"
                @click="selectedService = s"
              >
                <AppIcon
                  :name="selectedService?.id === s.id ? 'circle-dot' : 'circle'"
                  :size="20"
                  :color="selectedService?.id === s.id ? 'var(--primary)' : 'var(--border-strong)'"
                />
                <div style="flex: 1;">
                  <div style="font-weight: 500;">{{ s.name }}</div>
                  <div style="color: var(--text-muted); font-size: 12px; margin-top: 2px;">{{ s.durationMinutes }} min</div>
                </div>
                <div style="font-weight: 600;">{{ s.price }} ₴</div>
              </label>
              <EmptyState v-if="!services.length" icon="scissors" :title="t('booking.noServices')" :description="t('booking.noServicesDesc')" />
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <v-btn variant="text" @click="router.push(`/masters/${masterId}`)">
                <AppIcon name="arrow-left" :size="14" style="margin-right: 6px;" /> {{ t('booking.backToProfile') }}
              </v-btn>
              <v-btn color="primary" :disabled="!selectedService" @click="step = 1">
                {{ t('common.continue') }} <AppIcon name="arrow-right" :size="14" style="margin-left: 6px;" />
              </v-btn>
            </div>
          </template>
          <template v-if="step === 1">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">{{ t('booking.step2Title') }}</div>
            <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">{{ t('booking.step2Subtitle') }}</div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: flex-start;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <button class="cal-nav" @click="prevMonth">
                    <AppIcon name="chevron-left" :size="16" />
                  </button>
                  <div style="font-weight: 600;">{{ monthLabel }}</div>
                  <button class="cal-nav" @click="nextMonth">
                    <AppIcon name="chevron-right" :size="16" />
                  </button>
                </div>
                <div class="cal">
                  <div v-for="d in ['S','M','T','W','T','F','S']" :key="d" class="cal-h">{{ d }}</div>
                  <div
                    v-for="(cell, i) in calendarCells"
                    :key="i"
                    class="cal-d"
                    :class="{
                      muted: cell.muted,
                      today: cell.isToday,
                      selected: cell.dateStr === selectedDate,
                      disabled: cell.disabled,
                    }"
                    @click="!cell.disabled && !cell.muted && selectDate(cell.dateStr)"
                  >{{ cell.day }}</div>
                </div>
              </div>
              <div>
                <template v-if="selectedDate">
                  <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">{{ formatSelectedDate }}</div>
                  <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">
                    {{ t('booking.slotsAvailable', { n: slots.length }) }}
                  </div>
                </template>
                <div v-else style="color: var(--text-muted); font-size: 13px;">{{ t('booking.selectDateHint') }}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <v-btn variant="text" @click="step = 0">
                <AppIcon name="arrow-left" :size="14" style="margin-right: 6px;" /> {{ t('common.back') }}
              </v-btn>
              <v-btn color="primary" :disabled="!selectedDate" @click="loadSlots">
                {{ t('common.continue') }} <AppIcon name="arrow-right" :size="14" style="margin-left: 6px;" />
              </v-btn>
            </div>
          </template>
          <template v-if="step === 2">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <div style="font-size: 18px; font-weight: 600;">{{ t('booking.step3Title') }}</div>
            </div>
            <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">
              {{ formatSelectedDate }} · {{ selectedService?.durationMinutes }} min per slot
            </div>
            <LoadingSpinner v-if="loadingSlots" />
            <TimeSlotPicker v-else :slots="slots" v-model="selectedTime" />
            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <v-btn variant="text" @click="step = 1">
                <AppIcon name="arrow-left" :size="14" style="margin-right: 6px;" /> {{ t('common.back') }}
              </v-btn>
              <v-btn color="primary" :disabled="!selectedTime" @click="step = 3">
                {{ t('common.continue') }} <AppIcon name="arrow-right" :size="14" style="margin-left: 6px;" />
              </v-btn>
            </div>
          </template>
          <template v-if="step === 3">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">{{ t('booking.step4Title') }}</div>
            <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">
              {{ t('booking.step4Subtitle') }}
            </div>
            <div class="card" style="padding: 0; margin-bottom: 16px;">
              <div style="padding: 20px; display: flex; gap: 16px; align-items: center; border-bottom: 1px solid var(--divider);">
                <AppAvatar :name="master?.name ?? '?'" :tone="avatarTone" />
                <div style="flex: 1;">
                  <div style="font-weight: 600;">{{ master?.name }}</div>
                  <div style="color: var(--text-muted); font-size: 12px;">{{ master?.specialization }}</div>
                </div>
                <router-link :to="`/masters/${masterId}`" style="font-size: 13px; color: var(--primary); text-decoration: none;">{{ t('booking.viewProfile') }}</router-link>
              </div>
              <div v-for="([k, v], i) in confirmRows" :key="i" style="display: flex; justify-content: space-between; padding: 12px 20px; font-size: 13px; border-bottom: 1px solid var(--divider);">
                <span style="color: var(--text-muted);">{{ k }}</span>
                <span style="font-weight: 500;">{{ v }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 14px 20px;">
                <span style="font-size: 14px; font-weight: 600;">{{ t('booking.total') }}</span>
                <span style="font-size: 18px; font-weight: 700;">{{ selectedService?.price ?? 0 }} ₴</span>
              </div>
            </div>
            <FormTextarea
              v-model="notes"
              :label="t('booking.notesLabel')"
              :placeholder="t('booking.notesPlaceholder')"
              min-height="80px"
            />
            <div style="margin-top: 12px; padding: 14px; background: var(--accent-soft); border-radius: 8px; font-size: 12px; color: var(--warning); display: flex; gap: 10px; align-items: flex-start;">
              <AppIcon name="info" :size="16" />
              <div>{{ t('booking.cancellationHint') }}</div>
            </div>

            <ErrorMessage :message="bookingError" style="margin-top: 12px;" />

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <v-btn variant="text" @click="step = 2">
                <AppIcon name="arrow-left" :size="14" style="margin-right: 6px;" /> {{ t('common.back') }}
              </v-btn>
              <v-btn color="primary" :loading="booking" @click="confirmBooking">
                <AppIcon name="check" :size="16" :stroke="2.4" style="margin-right: 6px;" /> {{ t('booking.confirmBtn') }}
              </v-btn>
            </div>
          </template>

        </div>
        <aside class="card card-pad" style="align-self: flex-start; position: sticky; top: 20px;">
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">{{ t('booking.summaryTitle') }}</div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <AppAvatar :name="master?.name ?? '?'" size="sm" :tone="avatarTone" />
            <div>
              <div style="font-weight: 500; font-size: 13px;">{{ master?.name ?? '…' }}</div>
              <div style="color: var(--text-subtle); font-size: 11px;">{{ master?.specialization }}</div>
            </div>
          </div>
          <div class="sl-divider" style="margin: 8px 0;" />
          <div v-for="([label, value, ok], i) in summaryRows" :key="i" :style="{ display:'flex', justifyContent:'space-between', fontSize:'13px', padding:'10px 0', borderBottom: i < summaryRows.length-1 ? '1px solid var(--divider)' : 'none' }">
            <span style="color: var(--text-muted);">{{ label }}</span>
            <span :style="{ fontWeight: 500, color: ok ? 'var(--text)' : 'var(--text-disabled)' }">{{ ok ? value : '—' }}</span>
          </div>
          <div class="sl-divider" style="margin: 12px 0;" />
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: var(--text-muted);">{{ t('booking.total') }}</span>
            <span style="font-size: 18px; font-weight: 700;">{{ selectedService ? `${selectedService.price} ₴` : '—' }}</span>
          </div>
        </aside>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { format, addMonths, startOfMonth, getDay, getDaysInMonth, isToday, isBefore, startOfDay, parseISO } from 'date-fns'
import PublicLayout from '@/layouts/PublicLayout.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import AppIcon from '@/components/AppIcon.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import TimeSlotPicker from '@/components/TimeSlotPicker.vue'
import { mastersApi, type Master, type MasterService } from '@/api/masters'
import { appointmentsApi } from '@/api/appointments'
import type { TimeSlot } from '@/components/TimeSlotPicker.vue'
import { TONES } from '@/utils/avatarTones'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const STEPS = computed(() => [
  t('booking.steps[0]'),
  t('booking.steps[1]'),
  t('booking.steps[2]'),
  t('booking.steps[3]'),
])

const masterId = computed(() => route.params.id as string)

const step = ref(0)
const master = ref<Master | null>(null)
const services = ref<MasterService[]>([])
const loadingMaster = ref(false)
const loadingServices = ref(false)

const selectedService = ref<MasterService | null>(null)
const selectedDate = ref('')
const selectedTime = ref('')
const notes = ref('')
const slots = ref<TimeSlot[]>([])
const loadingSlots = ref(false)
const booking = ref(false)
const bookingError = ref('')

const calendarBase = ref(startOfMonth(new Date()))

const avatarTone = computed(() => {
  if (!master.value) return 'primary' as const
  return TONES[master.value.name.charCodeAt(0) % TONES.length]
})

const monthLabel = computed(() => format(calendarBase.value, 'MMMM yyyy'))

const calendarCells = computed(() => {
  const base = calendarBase.value
  const firstDay = getDay(base) // 0=Sun
  const daysInMonth = getDaysInMonth(base)
  const today = startOfDay(new Date())
  const cells: { day: number; dateStr: string; muted: boolean; disabled: boolean; isToday: boolean }[] = []

  const prevMonth = addMonths(base, -1)
  const prevDays = getDaysInMonth(prevMonth)
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevDays - i, dateStr: '', muted: true, disabled: true, isToday: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(base.getFullYear(), base.getMonth(), d)
    const dateStr = format(date, 'yyyy-MM-dd')
    cells.push({
      day: d,
      dateStr,
      muted: false,
      disabled: isBefore(startOfDay(date), today),
      isToday: isToday(date),
    })
  }

  let trailing = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: trailing++, dateStr: '', muted: true, disabled: true, isToday: false })
  }
  return cells
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  try { return format(parseISO(selectedDate.value), 'EEEE, MMMM d') } catch { return selectedDate.value }
})

const summaryRows = computed<[string, string, boolean][]>(() => [
  [t('booking.service'), selectedService.value?.name ?? '', !!selectedService.value],
  [t('booking.date'), formatSelectedDate.value, !!selectedDate.value],
  [t('booking.time'), selectedTime.value, !!selectedTime.value],
])

const confirmRows = computed(() => [
  [t('booking.service'), selectedService.value?.name ?? ''],
  [t('booking.date'), formatSelectedDate.value],
  [t('booking.time'), selectedTime.value],
  ['Duration', `${selectedService.value?.durationMinutes ?? 0} min`],
])

function prevMonth() { calendarBase.value = addMonths(calendarBase.value, -1) }
function nextMonth() { calendarBase.value = addMonths(calendarBase.value, 1) }

async function selectDate(dateStr: string) {
  selectedDate.value = dateStr
  selectedTime.value = ''
  slots.value = []
  if (!selectedService.value) return
  loadingSlots.value = true
  try {
    const data = await mastersApi.getAvailability(masterId.value, {
      date: dateStr,
      serviceId: selectedService.value.id,
    })
    slots.value = data
  } catch {
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
}

async function loadSlots() {
  if (!selectedDate.value || !selectedService.value) return
  loadingSlots.value = true
  step.value = 2
  try {
    const data = await mastersApi.getAvailability(masterId.value, {
      date: selectedDate.value,
      serviceId: selectedService.value.id,
    })
    slots.value = data
  } catch {
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
}

async function confirmBooking() {
  if (!selectedService.value || !selectedDate.value || !selectedTime.value) return
  bookingError.value = ''
  booking.value = true
  try {
    await appointmentsApi.create({
      masterId: masterId.value,
      serviceId: selectedService.value.id,
      date: selectedDate.value,
      startTime: selectedTime.value,
      notes: notes.value || undefined,
    })
    router.push('/dashboard')
  } catch (err: unknown) {
    bookingError.value = extractErrorMessage(err, 'Booking failed. Please try again.')
  } finally {
    booking.value = false
  }
}

onMounted(async () => {
  loadingMaster.value = true
  loadingServices.value = true
  try {
    const [m, s] = await Promise.all([
      mastersApi.get(masterId.value),
      mastersApi.getServices(masterId.value),
    ])
    master.value = m
    services.value = s

    const preServiceId = route.query.serviceId as string
    if (preServiceId) {
      selectedService.value = s.find(sv => sv.id === preServiceId) ?? null
    }
  } catch {
    master.value = null
  } finally {
    loadingMaster.value = false
    loadingServices.value = false
  }
})
</script>

<style scoped>
.cal-nav {
  width: 32px; height: 32px; border-radius: var(--r-sm);
  border: none; background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
}
.cal-nav:hover { background: var(--surface-2); }
</style>
