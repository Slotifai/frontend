<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('masterSchedule.title')" :subtitle="t('masterSchedule.subtitle')">
        <v-btn color="primary" :loading="saving" @click="saveSchedule">{{ t('masterSchedule.saveBtn') }}</v-btn>
      </PageHeader>

      <LoadingSpinner v-if="loading" />

      <div v-else style="display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: flex-start;">
        <div class="card" style="overflow: hidden;">
          <div
            v-for="(row, i) in schedule"
            :key="row.day"
            :style="{
              display: 'grid', gridTemplateColumns: '52px 130px 1fr',
              alignItems: 'center', gap: '16px', padding: '16px 20px',
              borderBottom: i < schedule.length - 1 ? '1px solid var(--divider)' : 'none',
              opacity: row.isDayOff ? 0.6 : 1,
            }"
          >
            <div
              :style="{
                width: '36px', height: '20px', borderRadius: '999px',
                background: row.isDayOff ? 'var(--border-strong)' : 'var(--primary)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.15s',
                flexShrink: 0,
              }"
              @click="row.isDayOff = !row.isDayOff"
            >
              <div :style="{
                position: 'absolute', top: '2px',
                left: row.isDayOff ? '2px' : '18px',
                width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                transition: 'left 0.15s', boxShadow: 'var(--el-1)',
              }" />
            </div>

            <div style="font-weight: 500; font-size: 14px;">{{ DAY_LABELS[row.day] }}</div>

            <div v-if="!row.isDayOff" style="display: flex; align-items: center; gap: 8px;">
              <input
                v-model="row.startTime"
                type="time"
                style="height: 36px; padding: 0 12px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); font: inherit; font-size: 13px; outline: none;"
              />
              <span style="color: var(--text-muted);">{{ t('masterSchedule.to') }}</span>
              <input
                v-model="row.endTime"
                type="time"
                style="height: 36px; padding: 0 12px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); font: inherit; font-size: 13px; outline: none;"
              />
            </div>
            <div v-else style="color: var(--text-muted); font-size: 13px;">{{ t('masterSchedule.dayOff') }}</div>
          </div>
        </div>
        <aside style="display: flex; flex-direction: column; gap: 16px;">
          <div class="card card-pad" style="background: var(--accent-soft); border-color: transparent;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <AppIcon name="info" :size="16" color="var(--warning)" />
              <span style="font-weight: 600; color: var(--warning);">{{ t('masterSchedule.warningTitle') }}</span>
            </div>
            <div style="font-size: 12px; color: var(--warning); line-height: 1.5;">
              {{ t('masterSchedule.warningDesc') }}
            </div>
          </div>
        </aside>
      </div>

      <v-alert v-if="saved" type="success" variant="tonal" density="compact" style="margin-top: 16px;">{{ t('masterSchedule.savedSuccess') }}</v-alert>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { masterMeApi, type WorkingHour } from '@/api/masterMe'
import { ALL_DAYS, DAY_LABELS } from '@/constants/schedule'
import { useSaveSuccess } from '@/composables/useSaveSuccess'

const { t } = useI18n()

const schedule = ref<WorkingHour[]>(
  ALL_DAYS.map(day => ({
    day,
    isDayOff: day === 'SUNDAY',
    startTime: '09:00',
    endTime: '18:00',
  })),
)
const loading = ref(false)
const saving = ref(false)
const { saved, markSaved } = useSaveSuccess()

async function fetchSchedule() {
  loading.value = true
  try {
    const data = await masterMeApi.getWorkingHours()
    if (data.length) {
      schedule.value = ALL_DAYS.map(day => {
        const found = data.find(d => d.day === day)
        return found ?? { day, isDayOff: true, startTime: '09:00', endTime: '18:00' }
      })
    }
  } catch {}
  finally { loading.value = false }
}

async function saveSchedule() {
  saving.value = true
  try {
    await masterMeApi.saveWorkingHours(schedule.value)
    markSaved()
  } catch {}
  finally { saving.value = false }
}

onMounted(fetchSchedule)
</script>
