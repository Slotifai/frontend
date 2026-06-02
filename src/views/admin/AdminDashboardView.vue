<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('adminDashboard.title')" :subtitle="t('adminDashboard.subtitle')" />

      <LoadingSpinner v-if="loading" />

      <template v-else-if="stats">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
          <div v-for="m in metricCards" :key="m.label" class="card card-pad" style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted);">{{ m.label }}</span>
              <div :style="{ width: '32px', height: '32px', borderRadius: '8px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                <AppIcon :name="m.icon" :size="16" :color="m.iconColor" />
              </div>
            </div>
            <div style="font-size: 28px; font-weight: 700; margin-top: 4px;">{{ m.value }}</div>
          </div>
        </div>
        <div class="card card-pad">
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">{{ t('adminDashboard.breakdown') }}</div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div v-for="bar in statusBars" :key="bar.label">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                <span>{{ bar.label }}</span>
                <span style="font-weight: 600;">{{ bar.count }}</span>
              </div>
              <div style="height: 8px; background: var(--surface-2); border-radius: 999px; overflow: hidden;">
                <div
                  :style="{
                    height: '100%',
                    width: bar.pct + '%',
                    background: bar.color,
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import { adminApi, type AdminStats } from '@/api/admin'
import { useAsyncState } from '@/composables/useAsyncState'

const { t } = useI18n()

const { loading, data: stats, execute: fetchStats } = useAsyncState<AdminStats | null>(() => adminApi.getStats(), null)

const metricCards = computed(() => {
  if (!stats.value) return []
  return [
    { label: t('adminDashboard.totalUsers'), value: stats.value.totalUsers.toLocaleString(), icon: 'users', iconBg: 'var(--primary-50)', iconColor: 'var(--primary)' },
    { label: t('adminDashboard.masters'), value: stats.value.totalMasters.toLocaleString(), icon: 'scissors', iconBg: 'var(--warning-soft)', iconColor: 'var(--warning)' },
    { label: t('adminDashboard.appointments'), value: stats.value.totalAppointments.toLocaleString(), icon: 'calendar', iconBg: 'var(--success-soft)', iconColor: 'var(--success)' },
    { label: t('adminDashboard.clients'), value: stats.value.totalClients.toLocaleString(), icon: 'users', iconBg: 'var(--success-soft)', iconColor: 'var(--success)' },
  ]
})

const statusBars = computed(() => {
  if (!stats.value) return []
  const s = stats.value.appointmentsByStatus
  const total = (s.SCHEDULED + s.COMPLETED + s.CANCELLED) || 1
  return [
    { label: t('common.scheduled'), count: s.SCHEDULED, pct: Math.round((s.SCHEDULED / total) * 100), color: 'var(--info)' },
    { label: t('common.completed'), count: s.COMPLETED, pct: Math.round((s.COMPLETED / total) * 100), color: 'var(--success)' },
    { label: t('common.cancelled'), count: s.CANCELLED, pct: Math.round((s.CANCELLED / total) * 100), color: 'var(--danger)' },
  ]
})


onMounted(fetchStats)
</script>
