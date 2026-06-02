<template>
  <div class="ob-shell">
    <header class="ob-topbar">
      <AppLogo />
      <div class="ob-step-counter">{{ t('masterOnboarding.stepOf', { step: step, total: TOTAL_STEPS }) }}</div>
    </header>
    <div class="ob-track">
      <div class="ob-track-fill" :style="{ width: progressPct + '%' }" />
    </div>
    <div class="ob-steps">
      <div
        v-for="n in TOTAL_STEPS"
        :key="n"
        class="ob-step-dot"
        :class="{ done: n < step, active: n === step }"
      >
        <span v-if="n < step" class="mdi mdi-check" />
        <span v-else>{{ n }}</span>
      </div>
    </div>
    <div class="ob-step-labels">
      <span
        v-for="(label, i) in stepLabels"
        :key="i"
        class="ob-step-label"
        :class="{ active: i + 1 === step, done: i + 1 < step }"
      >{{ label }}</span>
    </div>
    <main class="ob-main">
      <div class="ob-card fade-up" :key="step">
        <template v-if="step === 1">
          <div class="ob-head">
            <div class="ob-icon ob-icon-primary">
              <span class="mdi mdi-badge-account-outline" />
            </div>
            <div class="ob-title">{{ t('masterOnboarding.step1Title') }}</div>
            <div class="ob-sub">{{ t('masterOnboarding.step1Subtitle') }}</div>
          </div>

          <div class="ob-fields">
            <div class="ob-2col">
              <div class="field-group">
                <label class="field-label">{{ t('masterOnboarding.fieldFirstName') }}</label>
                <v-text-field v-model="profile.firstName" :placeholder="t('masterOnboarding.placeholderFirstName')" variant="outlined" density="compact" :error-messages="profileErrors.firstName" hide-details="auto" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ t('masterOnboarding.fieldLastName') }}</label>
                <v-text-field v-model="profile.lastName" :placeholder="t('masterOnboarding.placeholderLastName')" variant="outlined" density="compact" hide-details="auto" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">{{ t('masterOnboarding.fieldPhone') }}</label>
              <v-text-field v-model="profile.phone" type="tel" :placeholder="t('masterOnboarding.placeholderPhone')" variant="outlined" density="compact" :error-messages="profileErrors.phone" hide-details="auto" />
            </div>
            <div class="field-group">
              <label class="field-label">{{ t('masterOnboarding.fieldSpec') }}</label>
              <v-text-field v-model="profile.specialization" :placeholder="t('masterOnboarding.placeholderSpec')" variant="outlined" density="compact" :error-messages="profileErrors.specialization" hide-details="auto" />
            </div>
            <div class="field-group">
              <label class="field-label">{{ t('masterOnboarding.fieldAbout') }} <span class="field-optional">({{ t('common.optional') }})</span></label>
              <textarea
                v-model="profile.notes"
                :placeholder="t('masterOnboarding.placeholderAbout')"
                class="ob-textarea"
                rows="3"
              />
            </div>
          </div>

          <div class="ob-actions ob-actions-end">
            <button class="ob-btn-primary" :disabled="saving" @click="saveProfile">
              <span v-if="!saving">{{ t('common.continue') }}</span>
              <span v-else class="btn-spinner" />
              <span v-if="!saving" class="mdi mdi-arrow-right" />
            </button>
          </div>
        </template>
        <template v-else-if="step === 2">
          <div class="ob-head">
            <div class="ob-icon ob-icon-teal">
              <span class="mdi mdi-scissors-cutting" />
            </div>
            <div class="ob-title">{{ t('masterOnboarding.step2Title') }}</div>
            <div class="ob-sub">{{ t('masterOnboarding.step2Subtitle') }}</div>
          </div>
          <div class="service-preview" v-if="service.name">
            <div class="service-preview-name">{{ service.name || t('masterOnboarding.serviceNamePlaceholder') }}</div>
            <div class="service-preview-meta">
              <span class="mdi mdi-clock-outline" /> {{ service.durationMinutes }} {{ t('common.min') }}
              <span class="service-preview-sep">·</span>
              {{ service.price || '—' }} ₴
            </div>
          </div>

          <div class="ob-fields">
            <div class="field-group">
              <label class="field-label">{{ t('masterOnboarding.fieldServiceName') }}</label>
              <v-text-field v-model="service.name" :placeholder="t('masterOnboarding.placeholderServiceName')" variant="outlined" density="compact" :error-messages="serviceErrors.name" hide-details="auto" />
            </div>
            <div class="ob-2col">
              <div class="field-group">
                <label class="field-label">{{ t('masterOnboarding.fieldDuration') }}</label>
                <v-text-field v-model.number="service.durationMinutes" type="number" placeholder="30" variant="outlined" density="compact" :error-messages="serviceErrors.duration" hide-details="auto" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ t('masterOnboarding.fieldPrice') }}</label>
                <v-text-field v-model.number="service.price" type="number" placeholder="0" variant="outlined" density="compact" hide-details="auto" />
              </div>
            </div>
          </div>

          <div class="ob-actions ob-actions-between">
            <button class="ob-btn-ghost" @click="step = 1">
              <span class="mdi mdi-arrow-left" /> {{ t('common.back') }}
            </button>
            <div style="display:flex; gap:8px;">
              <button class="ob-btn-ghost" @click="step = 3">{{ t('common.skip') }}</button>
              <button class="ob-btn-primary" :disabled="saving" @click="saveService">
                <span v-if="!saving">{{ t('masterOnboarding.addAndContinue') }}</span>
                <span v-else class="btn-spinner" />
              </button>
            </div>
          </div>
        </template>
        <template v-else-if="step === 3">
          <div class="ob-head">
            <div class="ob-icon ob-icon-accent">
              <span class="mdi mdi-calendar-clock-outline" />
            </div>
            <div class="ob-title">{{ t('masterOnboarding.step3Title') }}</div>
            <div class="ob-sub">{{ t('masterOnboarding.step3Subtitle') }}</div>
          </div>

          <div class="schedule-list">
            <div
              v-for="row in schedule"
              :key="row.day"
              class="schedule-row"
              :class="{ 'schedule-row-off': row.isDayOff }"
            >
              <div class="sched-toggle" :class="{ on: !row.isDayOff }" @click="row.isDayOff = !row.isDayOff">
                <div class="sched-toggle-thumb" />
              </div>
              <div class="sched-day">{{ DAY_LABELS[row.day] }}</div>
              <div class="sched-time" v-if="!row.isDayOff">
                <input v-model="row.startTime" type="time" class="time-input" />
                <span class="sched-dash">–</span>
                <input v-model="row.endTime" type="time" class="time-input" />
              </div>
              <div class="sched-off-label" v-else>{{ t('masterOnboarding.dayOff') }}</div>
            </div>
          </div>

          <div class="ob-actions ob-actions-between">
            <button class="ob-btn-ghost" @click="step = 2">
              <span class="mdi mdi-arrow-left" /> {{ t('common.back') }}
            </button>
            <div style="display:flex; gap:8px;">
              <button class="ob-btn-ghost" @click="step = 4">{{ t('common.skip') }}</button>
              <button class="ob-btn-primary" :disabled="saving" @click="saveSchedule">
                <span v-if="!saving">{{ t('masterOnboarding.saveAndContinue') }}</span>
                <span v-else class="btn-spinner" />
              </button>
            </div>
          </div>
        </template>
        <template v-else-if="step === 4">
          <div class="ob-done">
            <div class="ob-done-icon">
              <span class="mdi mdi-rocket-launch-outline" />
            </div>
            <div class="ob-title">{{ t('masterOnboarding.step4Title') }}</div>
            <div class="ob-sub ob-sub-wide">
              {{ t('masterOnboarding.step4Desc') }}
            </div>
            <div class="done-checklist">
              <div class="done-check-item">
                <span class="mdi mdi-check-circle" style="color:var(--success);" />
                {{ t('masterOnboarding.check1') }}
              </div>
              <div class="done-check-item">
                <span class="mdi mdi-check-circle" style="color:var(--success);" />
                {{ t('masterOnboarding.check2') }}
              </div>
              <div class="done-check-item">
                <span class="mdi mdi-check-circle" style="color:var(--success);" />
                {{ t('masterOnboarding.check3') }}
              </div>
            </div>

            <button class="ob-btn-primary ob-btn-lg" @click="router.push('/master/dashboard')">
              <span class="mdi mdi-view-dashboard-outline" />
              {{ t('masterOnboarding.goToDashboard') }}
            </button>
          </div>
        </template>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLogo from '@/components/AppLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { masterMeApi, type WorkingHour } from '@/api/masterMe'
import apiClient from '@/api/client'
import { ALL_DAYS, DAY_LABELS } from '@/constants/schedule'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const TOTAL_STEPS = 4
const step = ref(1)
const saving = ref(false)

const stepLabels = computed(() => [
  t('masterOnboarding.labelProfile'),
  t('masterOnboarding.labelServices'),
  t('masterOnboarding.labelSchedule'),
  t('masterOnboarding.labelDone'),
])

const progressPct = computed(() => ((step.value - 1) / (TOTAL_STEPS - 1)) * 100)

const profile = reactive({ firstName: '', lastName: '', phone: '', specialization: '', notes: '' })
const profileErrors = reactive({ firstName: '', phone: '', specialization: '' })

function validateProfile() {
  profileErrors.firstName = profile.firstName.trim() ? '' : t('common.required')
  profileErrors.phone = profile.phone.trim() ? '' : t('common.required')
  profileErrors.specialization = profile.specialization.trim() ? '' : t('common.required')
  return !profileErrors.firstName && !profileErrors.phone && !profileErrors.specialization
}

async function saveProfile() {
  if (!validateProfile()) return
  saving.value = true
  try {
    const name = `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim()
    await apiClient.patch('/masters/me', {
      name,
      phone: profile.phone.trim(),
      specialization: profile.specialization.trim(),
      notes: profile.notes.trim() || undefined,
    })
    if (auth.user) auth.setUser({ ...auth.user, name })
    step.value = 2
  } catch {}
  finally { saving.value = false }
}

const service = reactive({ name: '', durationMinutes: 30, price: 0 })
const serviceErrors = reactive({ name: '', duration: '' })

function validateService() {
  serviceErrors.name = service.name.trim() ? '' : t('common.required')
  serviceErrors.duration = service.durationMinutes > 0 ? '' : t('common.mustBePositive')
  return !serviceErrors.name && !serviceErrors.duration
}

async function saveService() {
  if (!validateService()) return
  saving.value = true
  try {
    await masterMeApi.createService({
      name: service.name.trim(),
      durationMinutes: service.durationMinutes,
      price: service.price,
    })
    step.value = 3
  } catch {}
  finally { saving.value = false }
}

const schedule = ref<WorkingHour[]>(
  ALL_DAYS.map(day => ({ day, isDayOff: day === 'SUNDAY', startTime: '09:00', endTime: '18:00' }))
)

async function saveSchedule() {
  saving.value = true
  try {
    await masterMeApi.saveWorkingHours(schedule.value)
    step.value = 4
  } catch {}
  finally { saving.value = false }
}
</script>

<style scoped>
.ob-shell {
  min-height: 100vh;
  background: var(--bg);
  display: flex; flex-direction: column;
  align-items: center;
}

.ob-topbar {
  width: 100%; max-width: 640px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 24px 0;
}
.ob-step-counter {
  font-size: 12px; font-weight: 600; color: var(--text-subtle);
  letter-spacing: 0.02em;
}

.ob-track {
  width: calc(100% - 48px); max-width: 592px;
  height: 3px; background: var(--border); border-radius: 2px;
  margin: 20px 24px 0; overflow: hidden;
}
.ob-track-fill {
  height: 100%; background: var(--primary); border-radius: 2px;
  transition: width var(--t-slow);
}

.ob-steps {
  display: flex; gap: 10px; margin-top: 16px;
}
.ob-step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--surface); border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: var(--text-subtle);
  transition: all var(--t-base);
}
.ob-step-dot.done   { background: var(--primary); border-color: var(--primary); color: #fff; font-size: 13px; }
.ob-step-dot.active { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 0 0 4px var(--primary-glow); }

.ob-step-labels {
  display: flex; gap: 24px; margin-top: 8px;
}
.ob-step-label {
  font-size: 11px; font-weight: 600; color: var(--text-subtle);
  letter-spacing: 0.03em; text-transform: uppercase; width: 28px; text-align: center;
  transition: color var(--t-base);
}
.ob-step-label.active { color: var(--primary); }
.ob-step-label.done   { color: var(--text-muted); }

.ob-main {
  width: 100%; max-width: 580px; padding: 24px 24px 40px;
  flex: 1; display: flex; flex-direction: column;
}
.ob-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--el-2);
  padding: 36px;
}

.ob-head { text-align: center; margin-bottom: 28px; }
.ob-icon {
  width: 60px; height: 60px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 28px; margin-bottom: 14px;
}
.ob-icon-primary { background: var(--primary-soft); color: var(--primary); }
.ob-icon-teal    { background: #E0F2F1; color: #00695C; }
.ob-icon-accent  { background: var(--accent-soft); color: var(--accent-hover); }

.ob-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; }
.ob-sub   { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; }
.ob-sub-wide { max-width: 340px; margin: 0 auto; }

.ob-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.ob-2col   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12.5px; font-weight: 600; color: var(--text); }
.field-optional { font-weight: 400; color: var(--text-subtle); }

.ob-textarea {
  width: 100%; padding: 10px 12px;
  border-radius: var(--r-md); border: 1px solid var(--border-strong);
  font-family: var(--font-sans); font-size: 13.5px; color: var(--text);
  background: var(--surface); resize: vertical; outline: none;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  line-height: 1.5;
}
.ob-textarea:focus { border-color: var(--primary); box-shadow: var(--el-glow); }
.ob-textarea::placeholder { color: var(--text-subtle); }

.service-preview {
  padding: 14px 16px; border-radius: var(--r-lg);
  background: var(--primary-50); border: 1px solid var(--primary-soft);
  margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px;
}
.service-preview-name { font-weight: 700; font-size: 15px; color: var(--primary); }
.service-preview-meta { font-size: 12.5px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
.service-preview-sep  { opacity: 0.5; margin: 0 4px; }

.schedule-list {
  border: 1px solid var(--border);
  border-radius: var(--r-lg); overflow: hidden;
  margin-bottom: 24px;
}
.schedule-row {
  display: grid; grid-template-columns: 40px 100px 1fr;
  align-items: center; gap: 12px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--divider);
  transition: background var(--t-fast);
}
.schedule-row:last-child { border-bottom: none; }
.schedule-row-off { opacity: 0.6; }

.sched-toggle {
  width: 36px; height: 20px; border-radius: 10px;
  background: var(--border-strong); cursor: pointer;
  position: relative; transition: background var(--t-base); flex-shrink: 0;
}
.sched-toggle.on { background: var(--primary); }
.sched-toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #fff; box-shadow: var(--el-1);
  transition: left var(--t-base);
}
.sched-toggle.on .sched-toggle-thumb { left: 18px; }

.sched-day { font-size: 13px; font-weight: 600; }
.sched-time { display: flex; align-items: center; gap: 6px; }
.sched-dash { color: var(--text-subtle); font-size: 12px; }
.sched-off-label { font-size: 12px; color: var(--text-subtle); }

.time-input {
  height: 32px; padding: 0 8px;
  border-radius: var(--r-sm); border: 1px solid var(--border);
  font-family: var(--font-sans); font-size: 12.5px; color: var(--text);
  background: var(--surface); outline: none; flex: 1; min-width: 0;
  transition: border-color var(--t-fast);
}
.time-input:focus { border-color: var(--primary); }

.ob-done {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
  padding: 8px 0;
}
.ob-done-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--primary-soft); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 38px; margin-bottom: 4px;
}
.done-checklist {
  display: flex; flex-direction: column; gap: 8px;
  width: 100%; max-width: 240px; margin: 8px 0;
  text-align: left;
}
.done-check-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 13.5px; font-weight: 500; color: var(--text);
}
.done-check-item .mdi { font-size: 18px; }

.ob-actions        { display: flex; align-items: center; margin-top: 8px; }
.ob-actions-end    { justify-content: flex-end; }
.ob-actions-between { justify-content: space-between; }

.ob-btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  height: 44px; padding: 0 22px; border-radius: var(--r-md);
  background: var(--primary); color: #fff;
  border: none; font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: var(--font-sans);
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.ob-btn-primary:hover:not(:disabled) {
  background: var(--primary-hover); box-shadow: 0 4px 14px var(--primary-glow); transform: translateY(-1px);
}
.ob-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.ob-btn-primary.ob-btn-lg { width: 100%; justify-content: center; height: 48px; font-size: 15px; }

.ob-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  height: 44px; padding: 0 16px; border-radius: var(--r-md);
  background: transparent; color: var(--text-muted);
  border: 1.5px solid var(--border);
  font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--font-sans);
  transition: all var(--t-fast);
}
.ob-btn-ghost:hover { background: var(--surface-3); color: var(--text); border-color: var(--border-strong); }

.btn-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
