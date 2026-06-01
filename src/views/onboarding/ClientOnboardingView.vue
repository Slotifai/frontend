<template>
  <div class="ob-shell">
    <header class="ob-topbar">
      <AppLogo />
      <div class="ob-step-counter">{{ t('clientOnboarding.stepOf', { step: step, total: TOTAL_STEPS }) }}</div>
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
    <main class="ob-main">
      <div class="ob-card fade-up" :key="step">
        <template v-if="step === 1">
          <div class="ob-head">
            <div class="ob-icon ob-icon-primary">
              <span class="mdi mdi-account-circle-outline" />
            </div>
            <div class="ob-title">{{ t('clientOnboarding.step1Title') }}</div>
            <div class="ob-sub">{{ t('clientOnboarding.step1Subtitle') }}</div>
          </div>

          <div class="ob-fields">
            <div class="ob-2col">
              <div class="field-group">
                <label class="field-label">{{ t('clientOnboarding.fieldFirstName') }}</label>
                <v-text-field v-model="profile.firstName" :placeholder="t('clientOnboarding.placeholderFirstName')" variant="outlined" density="compact" :error-messages="errors.firstName" hide-details="auto" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ t('clientOnboarding.fieldLastName') }}</label>
                <v-text-field v-model="profile.lastName" :placeholder="t('clientOnboarding.placeholderLastName')" variant="outlined" density="compact" hide-details="auto" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">{{ t('clientOnboarding.fieldPhone') }}</label>
              <v-text-field v-model="profile.phone" type="tel" :placeholder="t('clientOnboarding.placeholderPhone')" variant="outlined" density="compact" :error-messages="errors.phone" hide-details="auto" />
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
            <div class="ob-icon ob-icon-accent">
              <span class="mdi mdi-information-outline" />
            </div>
            <div class="ob-title">{{ t('clientOnboarding.step2Title') }}</div>
            <div class="ob-sub">{{ t('clientOnboarding.step2Subtitle') }}</div>
          </div>

          <div class="ob-how-list">
            <div v-for="item in howItWorks" :key="item.num" class="ob-how-item">
              <div class="ob-how-num">{{ item.num }}</div>
              <div class="ob-how-icon">
                <span class="mdi" :class="item.mdi" />
              </div>
              <div>
                <div class="ob-how-title">{{ item.title }}</div>
                <div class="ob-how-desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>

          <div class="ob-actions ob-actions-between">
            <button class="ob-btn-ghost" @click="step = 1">
              <span class="mdi mdi-arrow-left" /> {{ t('common.back') }}
            </button>
            <button class="ob-btn-primary" @click="step = 3">
              {{ t('clientOnboarding.gotIt') }} <span class="mdi mdi-arrow-right" />
            </button>
          </div>
        </template>
        <template v-else-if="step === 3">
          <div class="ob-done">
            <div class="ob-done-icon">
              <span class="mdi mdi-party-popper" />
            </div>
            <div class="ob-title">{{ t('clientOnboarding.step3Title') }}</div>
            <div class="ob-sub ob-sub-wide">
              {{ t('clientOnboarding.step3Desc') }}
            </div>

            <div class="ob-done-actions">
              <button class="ob-btn-primary ob-btn-lg" @click="router.push('/masters')">
                <span class="mdi mdi-magnify" /> {{ t('clientOnboarding.browseMasters') }}
              </button>
              <button class="ob-btn-ghost ob-btn-lg" @click="router.push('/dashboard')">
                {{ t('clientOnboarding.goToDashboard') }}
              </button>
            </div>
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
import { clientsApi } from '@/api/clients'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const TOTAL_STEPS = 3
const step = ref(1)
const saving = ref(false)

const progressPct = computed(() => ((step.value - 1) / (TOTAL_STEPS - 1)) * 100)

const profile = reactive({ firstName: '', lastName: '', phone: '' })
const errors = reactive({ firstName: '', phone: '' })

const howItWorks = computed(() => [
  { num: 1, mdi: 'mdi-magnify', title: t('clientOnboarding.how1Title'), desc: t('clientOnboarding.how1Desc') },
  { num: 2, mdi: 'mdi-calendar-check-outline', title: t('clientOnboarding.how2Title'), desc: t('clientOnboarding.how2Desc') },
  { num: 3, mdi: 'mdi-star-outline', title: t('clientOnboarding.how3Title'), desc: t('clientOnboarding.how3Desc') },
])

function validateProfile() {
  errors.firstName = profile.firstName.trim() ? '' : 'Required'
  errors.phone = profile.phone.trim() ? '' : 'Required'
  return !errors.firstName && !errors.phone
}

async function saveProfile() {
  if (!validateProfile()) return
  saving.value = true
  try {
    const name = `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim()
    await clientsApi.updateMe({ name, phone: profile.phone.trim() })
    if (auth.user) auth.setUser({ ...auth.user, name })
    step.value = 2
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

.ob-main {
  width: 100%; max-width: 560px; padding: 24px 24px 40px;
  flex: 1; display: flex; flex-direction: column;
}
.ob-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--el-2);
  padding: 36px;
}

.ob-head { text-align: center; margin-bottom: 32px; }
.ob-icon {
  width: 60px; height: 60px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 28px; margin-bottom: 16px;
}
.ob-icon-primary { background: var(--primary-soft); color: var(--primary); }
.ob-icon-accent  { background: var(--accent-soft); color: var(--accent-hover); }
.ob-icon-success { background: var(--success-soft); color: var(--success); }

.ob-title { font-size: 24px; font-weight: 700; letter-spacing: -0.025em; margin-bottom: 6px; }
.ob-sub   { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; }
.ob-sub-wide { max-width: 340px; margin: 0 auto; }

.ob-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.ob-2col   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12.5px; font-weight: 600; color: var(--text); }

.ob-how-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
.ob-how-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 16px; border-radius: var(--r-lg);
  background: var(--surface-2); border: 1px solid var(--border);
  transition: box-shadow var(--t-fast);
}
.ob-how-item:hover { box-shadow: var(--el-2); }
.ob-how-num {
  font-size: 11px; font-weight: 800; color: var(--primary);
  background: var(--primary-soft); width: 22px; height: 22px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px;
}
.ob-how-icon {
  width: 38px; height: 38px; border-radius: var(--r-md);
  background: var(--primary-soft); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.ob-how-title { font-weight: 700; font-size: 14px; margin-bottom: 3px; }
.ob-how-desc  { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

.ob-done {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
  padding: 12px 0 8px;
}
.ob-done-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--success-soft); color: var(--success);
  display: flex; align-items: center; justify-content: center;
  font-size: 38px; margin-bottom: 8px;
}
.ob-done-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; margin-top: 12px; }

.ob-actions        { display: flex; align-items: center; margin-top: 24px; }
.ob-actions-end    { justify-content: flex-end; }
.ob-actions-between { justify-content: space-between; }

/* Buttons */
.ob-btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  height: 44px; padding: 0 22px; border-radius: var(--r-md);
  background: var(--primary); color: #fff;
  border: none; font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: var(--font-sans); letter-spacing: -0.01em;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.ob-btn-primary:hover:not(:disabled) {
  background: var(--primary-hover); box-shadow: 0 4px 14px var(--primary-glow); transform: translateY(-1px);
}
.ob-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.ob-btn-primary.ob-btn-lg { width: 100%; justify-content: center; height: 48px; }

.ob-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  height: 44px; padding: 0 18px; border-radius: var(--r-md);
  background: transparent; color: var(--text-muted);
  border: 1.5px solid var(--border);
  font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--font-sans);
  transition: all var(--t-fast);
}
.ob-btn-ghost:hover { background: var(--surface-3); color: var(--text); border-color: var(--border-strong); }
.ob-btn-ghost.ob-btn-lg { width: 100%; justify-content: center; height: 48px; }

.btn-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
