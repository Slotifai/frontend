<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader
        :title="`${t('clientDashboard.welcome', { name: user?.name?.split(' ')[0] ?? '' })}`"
        :subtitle="upcomingCount ? t('clientDashboard.upcomingCount', { count: upcomingCount }) : t('clientDashboard.noUpcoming')"
      >
        <router-link to="/masters">
          <v-btn color="primary" size="small">
            <AppIcon name="plus" :size="14" :stroke="2.4" style="margin-right: 6px;" />
            {{ t('clientDashboard.bookNew') }}
          </v-btn>
        </router-link>
      </PageHeader>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div v-for="stat in stats" :key="stat.label" class="card card-pad">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted);">{{ stat.label }}</div>
          <div style="font-size: 28px; font-weight: 700; margin-top: 4px;">{{ stat.value }}</div>
          <div style="font-size: 12px; color: var(--text-subtle);">{{ stat.sub }}</div>
        </div>
      </div>
      <div style="display: flex; border-bottom: 1px solid var(--border); margin-bottom: 16px;">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          @click="setTab(tab.key)"
          :style="{
            padding: '12px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }"
        >{{ tab.label }}</div>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div v-if="appointments.length" style="display: flex; flex-direction: column; gap: 10px;">
          <AppointmentCard
            v-for="a in appointments"
            :key="a.id"
            :appointment="a"
            @cancel="openCancel(a)"
            @review="goReview(a.id)"
          />
        </div>
        <EmptyState
          v-else
          icon="calendar"
          :title="t('clientDashboard.noAppointments')"
          :description="t('clientDashboard.noAppointmentsDesc')"
        >
          <router-link to="/masters"><v-btn color="primary" size="small" class="mt-2">{{ t('clientDashboard.findMaster') }}</v-btn></router-link>
        </EmptyState>
      </template>
      <PaginationFooter :page="page" :limit="limit" :total="total" @update:page="goPage" />
    </div>
    <ConfirmModal
      v-model="cancelDialog"
      :title="t('clientDashboard.cancelTitle')"
      :message="t('clientDashboard.cancelDesc')"
      :confirm-label="t('clientDashboard.cancelAnyway')"
      :cancel-label="t('common.keepIt')"
      confirm-color="error"
      :loading="cancelling"
      @confirm="doCancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationFooter from '@/components/PaginationFooter.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AppointmentCard from './AppointmentCard.vue'
import { appointmentsApi, type Appointment } from '@/api/appointments'
import { useAuthStore } from '@/stores/auth'
import { useConfirmAction } from '@/composables/useConfirmAction'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const user = computed(() => auth.user)

const appointments = ref<Appointment[]>([])
const total = ref(0)
const page = ref(1)
const limit = 10
const loading = ref(false)

const activeTab = ref('all')
const tabs = computed(() => [
  { key: 'all', label: t('common.all') },
  { key: 'upcoming', label: t('clientDashboard.upcoming') },
  { key: 'past', label: t('clientDashboard.past') },
  { key: 'cancelled', label: t('clientDashboard.cancelled') },
])

const { open: cancelDialog, target: cancelTarget, loading: cancelling, ask: openCancel, confirm: doCancel } = useConfirmAction<Appointment>(
  async (a) => { await appointmentsApi.cancel(a.id); await Promise.all([fetchAppointments(), fetchStats()]) },
)

const statCounts = ref({ scheduled: 0, completed: 0, cancelled: 0 })
const upcomingCount = computed(() => statCounts.value.scheduled)

const stats = computed(() => [
  {
    label: t('clientDashboard.upcoming'),
    value: statCounts.value.scheduled,
    sub: statCounts.value.scheduled ? t('common.scheduled') : t('clientDashboard.noneScheduled'),
  },
  { label: t('clientDashboard.completed'), value: statCounts.value.completed, sub: t('clientDashboard.allTime') },
  { label: t('clientDashboard.cancelled'), value: statCounts.value.cancelled, sub: t('clientDashboard.allTime') },
])

const tabStatusMap: Record<string, string | undefined> = {
  all: undefined,
  upcoming: 'SCHEDULED',
  past: 'COMPLETED',
  cancelled: 'CANCELLED',
}

async function fetchAppointments() {
  loading.value = true
  try {
    const status = tabStatusMap[activeTab.value] as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | undefined
    const result = await appointmentsApi.myList({ page: page.value, limit, status })
    appointments.value = result.data
    total.value = result.total
  } catch {
    appointments.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const [s, c, x] = await Promise.all([
      appointmentsApi.myList({ status: 'SCHEDULED', limit: 1 }),
      appointmentsApi.myList({ status: 'COMPLETED', limit: 1 }),
      appointmentsApi.myList({ status: 'CANCELLED', limit: 1 }),
    ])
    statCounts.value = { scheduled: s.total, completed: c.total, cancelled: x.total }
  } catch {}
}

function setTab(key: string) {
  activeTab.value = key
  page.value = 1
  fetchAppointments()
}

function goPage(p: number) {
  page.value = p
  fetchAppointments()
}

function goReview(id: string) {
  router.push(`/appointments/${id}/review`)
}


onMounted(() => {
  fetchAppointments()
  fetchStats()
})
</script>
