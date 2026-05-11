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
            <div style="color: var(--text-muted); font-size: 12px;">{{ form.specialization || t('masterProfile.roleLabel') }}</div>
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
              <input v-model="form.specialization" class="sl-input" :placeholder="t('masterProfile.specializationPlaceholder')" />
            </label>
            <FormTextarea v-model="form.notes" :label="t('masterProfile.about')" :placeholder="t('masterProfile.aboutPlaceholder')" min-height="110px" />
            <div v-if="saved" style="padding: 10px 14px; background: var(--success-soft); color: var(--success); border-radius: var(--r-sm); font-size: 13px;">{{ t('masterProfile.savedSuccess') }}</div>
            <ErrorMessage :message="serverError" />
          </form>
        </section>
        <section class="card card-pad">
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">Telegram</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Link your Telegram account to receive booking notifications via bot.</div>
          <div v-if="tgDeepLink" style="padding: 12px 14px; background: var(--success-soft); border-radius: var(--r-sm); font-size: 13px; color: var(--success); margin-bottom: 12px;">
            Scan or click the link to connect:
            <a :href="tgDeepLink" target="_blank" style="display: block; margin-top: 6px; font-weight: 600; word-break: break-all; color: var(--success);">{{ tgDeepLink }}</a>
          </div>
          <ErrorMessage :message="tgError" />
          <v-btn variant="outlined" size="small" :loading="tgLoading" @click="linkTelegram">
            Generate Telegram link
          </v-btn>
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
