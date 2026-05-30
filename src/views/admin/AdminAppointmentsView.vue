<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('adminAppointments.title')" :subtitle="t('adminAppointments.subtitle')" />
      <div class="card card-pad" style="padding: 12px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <SearchInput v-model="search" :placeholder="t('adminAppointments.searchPlaceholder')" @input="debouncedFetch" />
        <div style="font-size: 13px; color: var(--text-muted);">{{ t('common.status') }}</div>
        <span
          v-for="sf in statusFilters"
          :key="sf.key"
          class="chip"
          :class="{ active: statusFilter === sf.key }"
          style="cursor: pointer;"
          @click="setStatus(sf.key)"
        >{{ sf.label }}</span>
        <div style="flex: 1;" />
        <input
          v-model="dateFilter"
          type="date"
          style="height: 32px; padding: 0 10px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); font-size: 13px; font-family: var(--font-sans); outline: none;"
          @change="page = 1; fetchAppointments()"
        />
        <v-btn v-if="dateFilter" variant="text" size="small" @click="dateFilter = ''; page = 1; fetchAppointments()">{{ t('adminAppointments.clearDate') }}</v-btn>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="card" style="overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th class="th" style="width: 80px;">{{ t('adminAppointments.colId') }}</th>
                <th class="th">{{ t('adminAppointments.colClient') }}</th>
                <th class="th">{{ t('adminAppointments.colMaster') }}</th>
                <th class="th">{{ t('adminAppointments.colService') }}</th>
                <th class="th" style="width: 130px;">{{ t('adminAppointments.colDateTime') }}</th>
                <th class="th" style="width: 80px;">{{ t('adminAppointments.colPrice') }}</th>
                <th class="th" style="width: 130px;">{{ t('adminAppointments.colStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.id">
                <td class="td" style="font-size: 11px; color: var(--text-muted); font-family: monospace;">
                  #{{ a.id.slice(-6).toUpperCase() }}
                </td>
                <td class="td" style="font-weight: 500;">{{ a.clientName }}</td>
                <td class="td" style="color: var(--text-muted);">{{ a.masterName }}</td>
                <td class="td">{{ a.serviceName }}</td>
                <td class="td" style="font-size: 12px;">
                  <div>{{ formatDate(a.date) }}</div>
                  <div style="color: var(--text-muted);">{{ a.startTime }}</div>
                </td>
                <td class="td" style="font-weight: 500;">{{ a.price }} ₴</td>
                <td class="td"><StatusBadge :status="a.status" /></td>
              </tr>
            </tbody>
          </table>
          <EmptyState v-if="!appointments.length" icon="calendar" :title="t('adminAppointments.noAppointments')" :description="t('adminAppointments.noAppointmentsDesc')" />
        </div>

        <PaginationFooter :page="page" :limit="limit" :total="total" @update:page="goPage" />
      </template>
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchInput from '@/components/SearchInput.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationFooter from '@/components/PaginationFooter.vue'
import { adminApi, type AdminAppointment } from '@/api/admin'
import { formatDate } from '@/utils/dateUtils'
import { debounce } from '@/utils/debounce'

const { t } = useI18n()

const appointments = ref<AdminAppointment[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(false)
const search = ref('')
const statusFilter = ref('all')
const dateFilter = ref('')


const statusFilters = computed(() => [
  { key: 'all', label: t('common.all') },
  { key: 'SCHEDULED', label: t('common.scheduled') },
  { key: 'COMPLETED', label: t('common.completed') },
  { key: 'CANCELLED', label: t('common.cancelled') },
])


const debouncedFetch = debounce(() => { page.value = 1; fetchAppointments() })

async function fetchAppointments() {
  loading.value = true
  try {
    const result = await adminApi.getAppointments({
      page: page.value, limit,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
      search: search.value || undefined,
      date: dateFilter.value || undefined,
    })
    appointments.value = result.data
    total.value = result.total
  } catch { appointments.value = []; total.value = 0 }
  finally { loading.value = false }
}

function setStatus(key: string) { statusFilter.value = key; page.value = 1; fetchAppointments() }
function goPage(p: number) { page.value = p; fetchAppointments() }


onMounted(fetchAppointments)
</script>

