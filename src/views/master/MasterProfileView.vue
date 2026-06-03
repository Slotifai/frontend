<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('masterProfile.title')" :subtitle="t('masterProfile.subtitle')">
        <button type="button" class="sl-btn-primary" :disabled="saving" @click="saveProfile">{{ saving ? 'Saving…' : t('common.save') }}</button>
      </PageHeader>

      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: flex-start;">
        <aside style="display: flex; flex-direction: column; gap: 16px;">
          <div class="card card-pad" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <AppAvatar :name="user?.name || '?'" size="lg" tone="teal" />
            <div style="font-weight: 600; margin-top: 12px;">{{ user?.name }}</div>
            <div style="color: var(--text-muted); font-size: 12px;">{{ specLabel || t('masterProfile.roleLabel') }}</div>
            <div v-if="memberSince" style="margin-top: 12px; width: 100%; border-top: 1px solid var(--divider); padding-top: 12px; display: flex; justify-content: space-between; font-size: 12px;">
              <span style="color: var(--text-muted);">{{ t('common.members') }}</span>
              <span style="font-weight: 500;">{{ memberSince }}</span>
            </div>
          </div>
        </aside>
        <div style="display: flex; flex-direction: column; gap: 16px;">
        <section class="card card-pad">
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">{{ t('masterProfile.personalInfo') }}</div>
          <form @submit.prevent="saveProfile" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <label class="sl-field"><span class="sl-label">{{ t('masterProfile.firstName') }}</span><input v-model="form.firstName" class="sl-input" /></label>
              <label class="sl-field"><span class="sl-label">{{ t('masterProfile.lastName') }}</span><input v-model="form.lastName" class="sl-input" /></label>
              <label class="sl-field"><span class="sl-label">{{ t('masterProfile.phone') }}</span><input v-model="form.phone" class="sl-input" /></label>
              <label class="sl-field"><span class="sl-label">{{ t('masterProfile.email') }}</span><input v-model="form.email" class="sl-input" disabled /></label>
            </div>
            <label class="sl-field">
              <span class="sl-label">{{ t('masterProfile.specialization') }}</span>
              <select v-model="form.specialization" class="sl-input">
                <option value="">{{ t('masterProfile.specializationPlaceholder') }}</option>
                <option v-for="s in specOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </label>
            <FormTextarea v-model="form.notes" :label="t('masterProfile.about')" :placeholder="t('masterProfile.aboutPlaceholder')" min-height="110px" />
            <div v-if="saved" style="padding: 10px 14px; background: var(--success-soft); color: var(--success); border-radius: var(--r-sm); font-size: 13px;">{{ t('masterProfile.savedSuccess') }}</div>
            <ErrorMessage :message="serverError" />
          </form>
        </section>
        <section class="card card-pad">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.686-1.685 7.946c-.127.56-.46.695-.932.432l-2.58-1.902-1.244 1.197c-.138.138-.253.253-.52.253l.186-2.63 4.793-4.33c.208-.186-.046-.29-.322-.104L8.35 14.39l-2.537-.792c-.551-.173-.563-.551.115-.815l9.92-3.825c.46-.167.86.112.713.728z" fill="#229ED9"/></svg>
            <div style="font-size: 15px; font-weight: 600;">Telegram</div>
            <span v-if="user?.telegramLinked" style="font-size: 11px; font-weight: 600; padding: 2px 8px; background: var(--success-soft); color: var(--success); border-radius: 20px;">Підключено</span>
            <span v-else style="font-size: 11px; font-weight: 600; padding: 2px 8px; background: var(--warning-soft, #fff8e1); color: var(--warning, #f59e0b); border-radius: 20px;">Не підключено</span>
          </div>
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
            {{ user?.telegramLinked ? 'Ваш Telegram підключено. Ви будете отримувати сповіщення про нові записи.' : 'Підключіть Telegram, щоб отримувати сповіщення про нові записи через бота.' }}
          </div>
          <div v-if="tgDeepLink" style="padding: 12px 14px; background: var(--info-soft, #e8f4fd); border-radius: var(--r-sm); font-size: 13px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px;">
            <div style="color: var(--text-muted);">Натисніть кнопку нижче — бот відкриється і автоматично прив'яже ваш акаунт:</div>
            <a :href="tgDeepLink" target="_blank" class="sl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; width: fit-content;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.686-1.685 7.946c-.127.56-.46.695-.932.432l-2.58-1.902-1.244 1.197c-.138.138-.253.253-.52.253l.186-2.63 4.793-4.33c.208-.186-.046-.29-.322-.104L8.35 14.39l-2.537-.792c-.551-.173-.563-.551.115-.815l9.92-3.825c.46-.167.86.112.713.728z" fill="currentColor"/></svg>
              Відкрити Telegram бота
            </a>
          </div>
          <ErrorMessage :message="tgError" />
          <button v-if="!tgDeepLink" type="button" class="sl-btn-ghost" style="display: inline-flex; align-items: center; gap: 6px;" :disabled="tgLoading" @click="linkTelegram">
            <span v-if="tgLoading">Генерується…</span>
            <span v-else>{{ user?.telegramLinked ? '🔄 Перепідключити Telegram' : '🔗 Підключити Telegram' }}</span>
          </button>
        </section>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'
import { useSaveSuccess } from '@/composables/useSaveSuccess'
import { masterMeApi } from '@/api/masterMe'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { SPECIALIZATION_KEYS, SPEC_API_VALUE, SPEC_KEY_BY_API } from '@/constants/specializations'

const specOptions = computed(() =>
  SPECIALIZATION_KEYS.filter(k => k !== 'all').map(k => ({
    value: SPEC_API_VALUE[k],
    label: t(`masters.specs.${k}`),
  }))
)

const specLabel = computed(() => {
  if (!form.specialization) return ''
  const key = SPEC_KEY_BY_API[form.specialization]
  return key ? t(`masters.specs.${key}`) : form.specialization
})

const { t } = useI18n()
const auth = useAuthStore()
const user = computed(() => auth.user)

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', specialization: '', notes: '' })
const saving = ref(false)
const { saved, markSaved } = useSaveSuccess()
const serverError = ref('')
const memberSince = ref('')

const tgDeepLink = ref('')
const tgLoading = ref(false)
const tgError = ref('')

async function linkTelegram() {
  tgLoading.value = true
  tgError.value = ''
  tgDeepLink.value = ''
  try {
    const result = await authApi.telegramLinkToken()
    tgDeepLink.value = result.deepLink
  } catch {
    tgError.value = 'Failed to generate Telegram link. Please try again.'
  } finally {
    tgLoading.value = false
  }
}

async function fetchProfile() {
  try {
    const p = await masterMeApi.getProfile()
    const parts = (p.name ?? '').split(' ')
    form.firstName = parts[0] ?? ''
    form.lastName = parts.slice(1).join(' ')
    form.email = p.email
    form.phone = p.phone ?? ''
    form.specialization = p.specialization ?? ''
    form.notes = p.notes ?? ''
    if (p.createdAt) memberSince.value = new Date(p.createdAt).getFullYear().toString()
  } catch {}
}

async function saveProfile() {
  saving.value = true
  serverError.value = ''
  try {
    const name = `${form.firstName} ${form.lastName}`.trim()
    await masterMeApi.updateProfile({
      name,
      ...(form.phone ? { phone: form.phone } : {}),
      specialization: form.specialization,
      notes: form.notes,
    })
    if (auth.user) auth.setUser({ ...auth.user, name })
    markSaved()
  } catch (err: unknown) {
    serverError.value = extractErrorMessage(err, 'Failed to save.')
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>
