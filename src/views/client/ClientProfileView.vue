<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('clientProfile.title')" :subtitle="t('clientProfile.subtitle')" />

      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: flex-start;">
        <aside class="card card-pad" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
          <AppAvatar :name="user?.name || '?'" size="lg" tone="rose" />
          <div style="font-weight: 600; margin-top: 12px;">{{ user?.name }}</div>
          <div style="color: var(--text-muted); font-size: 12px;">{{ user?.email }}</div>
          <div style="color: var(--text-muted); font-size: 12px; margin-top: 2px;">{{ t('clientProfile.roleLabel') }}</div>
          <div style="height: 1px; background: var(--divider); align-self: stretch; margin: 20px 0;" />
          <div style="align-self: stretch; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span style="color: var(--text-muted);">{{ t('common.members') }}</span>
              <span style="font-weight: 500;">2025</span>
            </div>
          </div>
          <div style="height: 1px; background: var(--divider); align-self: stretch; margin: 12px 0;" />
          <router-link to="/profile/reviews" style="font-size: 13px; color: var(--primary); text-decoration: none; font-weight: 500; align-self: flex-start;">
            My reviews →
          </router-link>
        </aside>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <section class="card card-pad">
            <div style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">{{ t('clientProfile.personalInfo') }}</div>

            <form @submit.prevent="saveProfile" style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <label class="sl-field"><span class="sl-label">{{ t('clientProfile.firstName') }}</span><input v-model="form.firstName" class="sl-input" /></label>
                <label class="sl-field"><span class="sl-label">{{ t('clientProfile.lastName') }}</span><input v-model="form.lastName" class="sl-input" /></label>
                <label class="sl-field"><span class="sl-label">{{ t('clientProfile.email') }}</span><input v-model="form.email" type="email" class="sl-input" disabled /></label>
                <label class="sl-field"><span class="sl-label">{{ t('clientProfile.phone') }}</span><input v-model="form.phone" type="tel" class="sl-input" /></label>
              </div>
              <FormTextarea v-model="form.notes" :label="t('clientProfile.notesLabel')" :placeholder="t('clientProfile.notesPlaceholder')" min-height="80px" />
              <div v-if="saved" style="padding: 10px 14px; background: var(--success-soft); color: var(--success); border-radius: var(--r-sm); font-size: 13px;">{{ t('clientProfile.savedSuccess') }}</div>
              <ErrorMessage :message="serverError" />
              <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
                <button type="button" class="sl-btn-ghost" @click="resetForm">{{ t('common.discard') }}</button>
                <button type="submit" class="sl-btn-primary" :disabled="saving">{{ saving ? t('common.saving') : t('common.save') }}</button>
              </div>
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
              {{ user?.telegramLinked ? 'Ваш Telegram підключено. Ви будете отримувати нагадування про записи.' : 'Підключіть Telegram, щоб отримувати нагадування про записи через бота.' }}
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
import { useAuthStore } from '@/stores/auth'
import { clientsApi } from '@/api/clients'
import { authApi } from '@/api/auth'

const { t } = useI18n()
const auth = useAuthStore()
const user = computed(() => auth.user)

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
const saving = ref(false)
const { saved, markSaved } = useSaveSuccess()
const serverError = ref('')

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

async function loadProfile() {
  try {
    const p = await clientsApi.getMe()
    const parts = p.name.split(' ')
    form.firstName = parts[0] ?? ''
    form.lastName = parts.slice(1).join(' ')
    form.email = p.email
    form.phone = p.phone ?? ''
    form.notes = p.notes ?? ''
  } catch {
    if (user.value) {
      const parts = user.value.name.split(' ')
      form.firstName = parts[0] ?? ''
      form.lastName = parts.slice(1).join(' ')
      form.email = user.value.email
    }
  }
}

async function saveProfile() {
  saving.value = true
  serverError.value = ''
  try {
    const name = `${form.firstName} ${form.lastName}`.trim()
    await clientsApi.updateMe({ name, phone: form.phone, notes: form.notes })
    if (auth.user) auth.setUser({ ...auth.user, name })
    markSaved()
  } catch (err: unknown) {
    serverError.value = extractErrorMessage(err, 'Failed to save profile.')
  } finally {
    saving.value = false
  }
}

function resetForm() { loadProfile() }

onMounted(loadProfile)
</script>
