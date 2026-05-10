<template>
  <AuthLayout>
    <div class="auth-head">
      <div class="auth-title">{{ t('auth.forgot.title') }}</div>
      <div class="auth-sub">{{ t('auth.forgot.subtitle') }}</div>
    </div>

    <template v-if="!sent">
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="field-group">
          <label class="field-label">{{ t('auth.forgot.email') }}</label>
          <v-text-field
            v-model="email"
            type="email"
            :placeholder="t('auth.forgot.emailPlaceholder')"
            variant="outlined"
            density="compact"
            :error-messages="emailError"
            hide-details="auto"
          />
        </div>
        <ErrorMessage :message="serverError" />
        <button type="submit" class="sl-btn-primary" :disabled="loading">
          <span v-if="!loading">{{ t('auth.forgot.submit') }}</span>
          <span v-else class="btn-spinner" />
        </button>
      </form>
    </template>

    <template v-else>
      <div class="success-card">
        <div class="success-icon">
          <span class="mdi mdi-check-circle" />
        </div>
        <div class="success-body">
          <div class="success-title">{{ t('auth.forgot.sentTitle') }}</div>
          <div class="success-text">
            {{ t('auth.forgot.sentDesc', { email: email }) }}
          </div>
        </div>
      </div>
    </template>

    <div class="back-link">
      <span class="mdi mdi-arrow-left" style="font-size:13px;" />
      <router-link to="/login" class="auth-link">{{ t('auth.forgot.backToLogin') }}</router-link>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-head { margin-bottom: 28px; }
.auth-title { font-size: 26px; font-weight: 700; letter-spacing: -0.025em; }
.auth-sub   { font-size: 13px; color: var(--text-muted); margin-top: 5px; }

.auth-form  { display: flex; flex-direction: column; gap: 18px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12.5px; font-weight: 600; color: var(--text); }

.sl-btn-primary {
  width: 100%; height: 46px;
  background: var(--primary); color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--font-sans);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.sl-btn-primary:hover:not(:disabled) {
  background: var(--primary-hover); box-shadow: 0 4px 16px var(--primary-glow); transform: translateY(-1px);
}
.sl-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.success-card {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 18px; border-radius: var(--r-lg);
  background: var(--success-soft); border: 1px solid rgba(29,138,94,.2);
  margin-bottom: 20px;
}
.success-icon { font-size: 22px; color: var(--success); flex-shrink: 0; margin-top: 1px; }
.success-title { font-weight: 700; font-size: 14px; color: var(--success); margin-bottom: 4px; }
.success-text  { font-size: 13px; color: var(--success); opacity: 0.85; line-height: 1.55; }

.back-link { display: flex; align-items: center; gap: 6px; margin-top: 24px; color: var(--text-muted); font-size: 13px; }
.auth-link       { color: var(--primary); font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'
import { validateEmail } from '@/utils/validation'
import { authApi } from '@/api/auth'

const { t } = useI18n()

const email = ref('')
const emailError = ref('')
const serverError = ref('')
const loading = ref(false)
const sent = ref(false)

async function handleSubmit() {
  emailError.value = validateEmail(email.value)
  if (emailError.value) return
  loading.value = true
  try {
    await authApi.forgotPassword(email.value)
    sent.value = true
  } catch (err: unknown) {
    serverError.value = extractErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>
