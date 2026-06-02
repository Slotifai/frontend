<template>
  <DashboardLayout>
    <div class="page-content">
      <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
        <router-link to="/master/dashboard" style="display: flex; align-items: center; gap: 6px; color: var(--text-muted); text-decoration: none;">
          <AppIcon name="arrow-left" :size="16" /> {{ t('masterAppointment.back') }}
        </router-link>
        <AppIcon name="chevron-right" :size="12" />
        <span style="color: var(--text);">#{{ appointmentId.slice(-6).toUpperCase() }}</span>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else-if="appt">
        <div class="page-header">
          <div>
            <div style="font-size: 24px; font-weight: 600;">{{ appt.clientName }} · {{ appt.serviceName }}</div>
            <div style="color: var(--text-muted); font-size: 13px; margin-top: 2px;">
              {{ formatDate }} · {{ appt.startTime }}<span v-if="appt.endTime"> – {{ appt.endTime }}</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <v-btn v-if="appt.status === 'SCHEDULED'" color="primary" @click="completeAppt">
              <AppIcon name="check" :size="14" :stroke="2.4" style="margin-right: 6px;" />
              {{ t('masterAppointment.markComplete') }}
            </v-btn>
            <v-btn v-if="appt.status === 'SCHEDULED'" variant="outlined" color="error" @click="cancelDialog = true">{{ t('masterAppointment.cancelBtn') }}</v-btn>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 360px; gap: 16px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div
              class="card"
              :style="{
                padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                background: appt.status === 'SCHEDULED' ? 'var(--primary-50)' : appt.status === 'COMPLETED' ? 'var(--success-soft)' : 'var(--danger-soft)',
                borderColor: 'transparent',
              }"
            >
              <AppIcon
                name="calendar"
                :size="20"
                :color="appt.status === 'SCHEDULED' ? 'var(--primary)' : appt.status === 'COMPLETED' ? 'var(--success)' : 'var(--danger)'"
              />
              <div style="flex: 1;">
                <div style="font-weight: 600;">{{ statusMessage }}</div>
              </div>
              <StatusBadge :status="appt.status" />
            </div>
            <div class="card card-pad">
              <div style="font-size: 15px; font-weight: 600; margin-bottom: 14px;">{{ t('masterAppointment.clientInfo') }}</div>
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
                <AppAvatar :name="appt.clientName" :tone="avatarTone" />
                <div>
                  <div style="font-weight: 600;">{{ appt.clientName }}</div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
                <div v-if="appt.clientPhone">
                  <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">{{ t('common.phone') }}</div>
                  <div>{{ appt.clientPhone }}</div>
                </div>
                <div v-if="appt.clientEmail">
                  <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">{{ t('common.email') }}</div>
                  <div>{{ appt.clientEmail }}</div>
                </div>
                <div v-if="appt.clientNotes" style="grid-column: 1 / -1;">
                  <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">{{ t('masterAppointment.clientPrefs') }}</div>
                  <div>{{ appt.clientNotes }}</div>
                </div>
              </div>
            </div>
            <div class="card card-pad">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <div style="font-size: 15px; font-weight: 600;">{{ t('masterAppointment.notes') }}</div>
                <span style="color: var(--text-muted); font-size: 12px;">{{ t('masterAppointment.entries', { count: notes.length }) }}</span>
              </div>

              <div v-if="notes.length" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                <div v-for="n in notes" :key="n.id" style="display: flex; gap: 12px;">
                  <AppAvatar :name="n.authorName" size="sm" :tone="n.authorRole === 'CLIENT' ? 'rose' : 'teal'" />
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                      <span style="font-weight: 500; font-size: 13px;">{{ n.authorName }}</span>
                      <span style="color: var(--text-subtle); font-size: 11px;">{{ formatNoteDate(n.createdAt) }}</span>
                    </div>
                    <div style="font-size: 13px;">{{ n.text }}</div>
                  </div>
                </div>
              </div>

              <div class="sl-divider" style="margin: 0 0 16px;" />
              <div style="display: flex; gap: 12px;">
                <AppAvatar :name="user?.name || '?'" size="sm" tone="teal" />
                <div style="flex: 1;">
                  <textarea
                    v-model="newNote"
                    style="width: 100%; min-height: 70px; padding: 12px 14px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); font: inherit; font-size: 13px; resize: vertical; outline: none;"
                    :placeholder="t('masterAppointment.notePlaceholder')"
                  />
                  <div style="display: flex; justify-content: flex-end; margin-top: 8px; gap: 8px;">
                    <span style="color: var(--text-muted); font-size: 12px; flex: 1; align-self: center;">{{ t('masterAppointment.noteHint') }}</span>
                    <v-btn variant="text" size="small" @click="newNote = ''">{{ t('masterAppointment.clearBtn') }}</v-btn>
                    <v-btn color="primary" size="small" :disabled="!newNote.trim()" :loading="addingNote" @click="addNote">{{ t('masterAppointment.addNote') }}</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <aside style="display: flex; flex-direction: column; gap: 16px;">
            <div class="card card-pad">
              <div style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">{{ t('common.service') }}</div>
              <div v-for="([k,v], i) in serviceRows" :key="i" :style="{ display:'flex', justifyContent:'space-between', fontSize:'13px', padding:'8px 0', borderBottom: i < serviceRows.length-1 ? '1px solid var(--divider)' : 'none' }">
                <span style="color: var(--text-muted);">{{ k }}</span>
                <span style="font-weight: 500;">{{ v }}</span>
              </div>
            </div>
          </aside>
        </div>
      </template>

      <EmptyState v-else icon="note" :title="t('common.appointmentNotFound')" description="">
        <router-link to="/master/dashboard"><v-btn size="small" color="primary">{{ t('common.backToDashboard') }}</v-btn></router-link>
      </EmptyState>
    </div>

    <ConfirmModal
      v-model="cancelDialog"
      :title="t('masterAppointment.cancelTitle')"
      :message="t('masterAppointment.cancelDesc')"
      :confirm-label="t('masterAppointment.cancelBtn')"
      :cancel-label="t('masterAppointment.keepBtn')"
      confirm-color="error"
      :loading="actionLoading"
      @confirm="doCancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AppIcon from '@/components/AppIcon.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { masterMeApi, type MasterAppointment, type AppointmentNote } from '@/api/masterMe'
import { useAuthStore } from '@/stores/auth'
import { TONES } from '@/utils/avatarTones'
import { formatDateLong, formatActivityDate } from '@/utils/dateUtils'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const user = computed(() => auth.user)

const appointmentId = computed(() => route.params.id as string)
const appt = ref<MasterAppointment | null>(null)
const notes = ref<AppointmentNote[]>([])
const loading = ref(false)
const newNote = ref('')
const addingNote = ref(false)
const cancelDialog = ref(false)
const actionLoading = ref(false)

const avatarTone = computed(() => {
  if (!appt.value) return 'rose' as const
  return TONES[appt.value.clientName.charCodeAt(0) % TONES.length]
})

const formatDate = computed(() => appt.value ? formatDateLong(appt.value.date) : '')

const statusMessage = computed(() => {
  if (!appt.value) return ''
  if (appt.value.status === 'SCHEDULED') return t('masterAppointment.confirmedFor', { date: formatDate.value, time: appt.value.startTime })
  if (appt.value.status === 'COMPLETED') return t('masterAppointment.appointmentCompleted')
  return t('masterAppointment.appointmentCancelled')
})

const serviceRows = computed<[string, string][]>(() => {
  if (!appt.value) return []
  return [
    [t('common.service'), appt.value.serviceName],
    [t('common.duration'), `${appt.value.serviceDurationMinutes} min`],
    [t('common.price'), `${appt.value.price} ₴`],
    [t('common.date'), formatDate.value],
    [t('common.time'), appt.value.startTime],
  ]
})

const formatNoteDate = formatActivityDate

async function addNote() {
  if (!newNote.value.trim()) return
  addingNote.value = true
  try {
    const n = await masterMeApi.addNote(appointmentId.value, newNote.value.trim())
    notes.value.push(n)
    newNote.value = ''
  } catch {}
  finally { addingNote.value = false }
}

async function completeAppt() {
  if (!appt.value) return
  try {
    await masterMeApi.completeAppointment(appt.value.id)
    appt.value.status = 'COMPLETED'
  } catch {}
}

async function doCancel() {
  if (!appt.value) return
  actionLoading.value = true
  try {
    await masterMeApi.cancelAppointment(appt.value.id)
    appt.value.status = 'CANCELLED'
    cancelDialog.value = false
  } catch {}
  finally { actionLoading.value = false }
}

onMounted(async () => {
  loading.value = true
  try {
    const [a, n] = await Promise.all([
      masterMeApi.getAppointment(appointmentId.value),
      masterMeApi.getNotes(appointmentId.value),
    ])
    appt.value = a
    notes.value = n
  } catch {
    appt.value = null
  } finally {
    loading.value = false
  }
})
</script>
