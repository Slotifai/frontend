<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('masterDashboard.title')" :subtitle="todayLabel" />
      <div class="card card-pad" style="padding: 14px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted);">
          <AppIcon name="calendar" :size="16" /> Date:
        </div>
        <span
          v-for="df in dateFilters"
          :key="df.key"
          class="chip"
          :class="{ active: activeDateFilter === df.key }"
          style="cursor: pointer;"
          @click="setDateFilter(df.key)"
        >{{ df.label }}</span>

        <div style="width: 1px; height: 22px; background: var(--border); margin: 0 4px;" />

        <div style="font-size: 13px; color: var(--text-muted);">{{ t('common.status') }}:</div>
        <span
          v-for="sf in statusFilters"
          :key="sf.key"
          class="chip"
          :class="{ active: activeStatusFilter === sf.key }"
          style="cursor: pointer;"
          @click="activeStatusFilter = sf.key; fetchAppointments()"
        >{{ sf.label }}</span>

        <div style="flex: 1;" />
        <SearchInput v-model="searchClient" :placeholder="t('masterDashboard.searchClients')" max-width="180px" />
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="card" style="overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align:left; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em; padding:12px 16px; border-bottom:1px solid var(--border); background:var(--surface-2); width:140px;">{{ t('common.time') }}</th>
                <th style="text-align:left; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em; padding:12px 16px; border-bottom:1px solid var(--border); background:var(--surface-2);">{{ t('common.client') }}</th>
                <th style="text-align:left; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em; padding:12px 16px; border-bottom:1px solid var(--border); background:var(--surface-2);">{{ t('common.service') }}</th>
                <th style="text-align:left; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em; padding:12px 16px; border-bottom:1px solid var(--border); background:var(--surface-2); width:130px;">{{ t('common.status') }}</th>
                <th style="text-align:right; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em; padding:12px 16px; border-bottom:1px solid var(--border); background:var(--surface-2); width:220px;">{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in filteredAppointments"
                :key="a.id"
                style="cursor: pointer;"
                :style="{ background: a.status === 'SCHEDULED' ? 'var(--primary-50)' : 'transparent' }"
                @click="router.push(`/master/appointments/${a.id}`)"
              >
                <td style="padding:14px 16px; border-bottom:1px solid var(--divider); font-size:14px; vertical-align:middle;">
                  <span style="font-weight: 500;">{{ a.startTime }}<span v-if="a.endTime"> – {{ a.endTime }}</span></span>
                </td>
                <td style="padding:14px 16px; border-bottom:1px solid var(--divider); font-size:14px; vertical-align:middle;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <AppAvatar :name="a.clientName" size="sm" :tone="avatarTone(a.clientName)" />
                    <span style="font-weight: 500;">{{ a.clientName }}</span>
                  </div>
                </td>
                <td style="padding:14px 16px; border-bottom:1px solid var(--divider); font-size:14px; vertical-align:middle;">{{ a.serviceName }}</td>
                <td style="padding:14px 16px; border-bottom:1px solid var(--divider); font-size:14px; vertical-align:middle;">
                  <StatusBadge :status="a.status" />
                </td>
                <td style="padding:14px 16px; border-bottom:1px solid var(--divider); font-size:14px; vertical-align:middle; text-align:right;" @click.stop>
                  <template v-if="a.status === 'SCHEDULED'">
                    <v-btn variant="tonal" size="small" color="primary" style="margin-right: 4px;" @click.stop="completeAppt(a)">{{ t('masterDashboard.complete') }}</v-btn>
                    <v-btn variant="text" size="small" color="error" @click.stop="openCancel(a)">{{ t('masterDashboard.cancel') }}</v-btn>
                  </template>
                  <template v-else-if="a.status === 'COMPLETED'">
                    <span style="color: var(--text-muted); font-size: 12px;">{{ a.price }} ₴ {{ t('masterDashboard.received') }}</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <EmptyState v-if="!filteredAppointments.length" icon="calendar" :title="t('masterDashboard.noAppointments')" :description="t('masterDashboard.noAppointmentsDesc')" />
        </div>

        <PaginationFooter :page="page" :limit="limit" :total="total" @update:page="goPage" />
      </template>
    </div>

    <ConfirmModal
      v-model="cancelDialog"
      :title="t('masterDashboard.cancelTitle')"
      :message="t('masterDashboard.cancelDesc')"
      :confirm-label="t('masterDashboard.cancelBtn')"
      :cancel-label="t('common.keepIt')"
      confirm-color="error"
      :loading="actionLoading"
      @confirm="doCancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchInput from '@/components/SearchInput.vue'
import AppIcon from '@/components/AppIcon.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationFooter from '@/components/PaginationFooter.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { masterMeApi, type MasterAppointment } from '@/api/masterMe'
import { getAvatarTone } from '@/utils/avatarTones'
import { useConfirmAction } from '@/composables/useConfirmAction'

const { t } = useI18n()
const router = useRouter()

const appointments = ref<MasterAppointment[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(false)

const activeDateFilter = ref('today')
const activeStatusFilter = ref('all')
const searchClient = ref('')

const { open: cancelDialog, target: cancelTarget, loading: actionLoading, ask: openCancel, confirm: doCancel } = useConfirmAction<MasterAppointment>(
  async (a) => { await masterMeApi.cancelAppointment(a.id); await fetchAppointments() },
)

const dateFilters = computed(() => [
  { key: 'today', label: t('common.today') },
  { key: 'tomorrow', label: t('common.tomorrow') },
  { key: 'week', label: t('common.thisWeek') },
])
const statusFilters = computed(() => [
  { key: 'all', label: t('common.all') },
  { key: 'SCHEDULED', label: t('common.scheduled') },
  { key: 'COMPLETED', label: t('common.completed') },
  { key: 'CANCELLED', label: t('common.cancelled') },
])

const todayLabel = computed(() => {
  const today = format(new Date(), 'EEEE, MMMM d')
  const scheduled = appointments.value.filter(a => a.status === 'SCHEDULED').length
  return t('masterDashboard.scheduledCount', { date: today, count: scheduled })
})

const avatarTone = getAvatarTone

const weekRange = computed(() => {
  const now = new Date()
  return {
    from: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    to: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  }
})

const filteredAppointments = computed(() => {
  let list = appointments.value
  if (activeDateFilter.value === 'week') {
    const { from, to } = weekRange.value
    list = list.filter(a => a.date >= from && a.date <= to)
  }
  if (activeStatusFilter.value !== 'all') {
    list = list.filter(a => a.status === activeStatusFilter.value)
  }
  if (searchClient.value) {
    const q = searchClient.value.toLowerCase()
    list = list.filter(a => a.clientName.toLowerCase().includes(q))
  }
  return list
})

function getDateParam(filter: string) {
  const today = new Date()
  if (filter === 'today') return format(today, 'yyyy-MM-dd')
  if (filter === 'tomorrow') {
    today.setDate(today.getDate() + 1)
    return format(today, 'yyyy-MM-dd')
  }
  return undefined
}

async function fetchAppointments() {
  loading.value = true
  try {
    const result = await masterMeApi.getAppointments({
      page: page.value,
      limit,
      date: getDateParam(activeDateFilter.value),
      status: activeStatusFilter.value !== 'all' ? activeStatusFilter.value : undefined,
    })
    appointments.value = result.data
    total.value = result.total
  } catch {
    appointments.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function setDateFilter(key: string) {
  activeDateFilter.value = key
  page.value = 1
  fetchAppointments()
}

function goPage(p: number) {
  page.value = p
  fetchAppointments()
}

async function completeAppt(a: MasterAppointment) {
  try {
    await masterMeApi.completeAppointment(a.id)
    await fetchAppointments()
  } catch {}
}


onMounted(fetchAppointments)
</script>
