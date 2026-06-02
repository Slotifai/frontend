<template>
  <AuthLayout>
    <div class="auth-head">
      <div class="auth-title">{{ t('auth.login.title') }}</div>
      <div class="auth-sub">{{ t('auth.login.subtitle') }}</div>
    </div>

    <div v-if="route.query.registered" class="success-banner">
      {{ t('auth.login.emailVerified') }}
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="field-group">
        <label class="field-label">{{ t('auth.login.email') }}</label>
        <v-text-field
          v-model="form.email"
          type="email"
          :placeholder="t('auth.login.emailPlaceholder')"
          variant="outlined"
          density="compact"
          :error-messages="errors.email"
          hide-details="auto"
        />
      </div>

      <div class="field-group">
        <div class="field-label-row">
          <label class="field-label">{{ t('auth.login.password') }}</label>
          <router-link to="/forgot-password" class="field-link">{{ t('auth.login.forgotPassword') }}</router-link>
        </div>
        <v-text-field
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          variant="outlined"
          density="compact"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          @click:append-inner="showPassword = !showPassword"
          :error-messages="errors.password"
          hide-details="auto"
        />
      </div>

      <ErrorMessage :message="serverError" />

      <button type="submit" class="sl-btn-primary" :disabled="loading">
        <span v-if="!loading">{{ t('auth.login.submit') }}</span>
        <span v-else class="btn-spinner" />
      </button>
    </form>

    <div class="auth-footer">
      {{ t('auth.login.noAccount') }}
      <router-link to="/register" class="auth-link">{{ t('auth.login.createAccount') }}</router-link>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'
import { validateEmail, validatePassword } from '@/utils/validation'
import { getRoleHomePath } from '@/utils/roleUtils'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)

function validate() {
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password, 6)
  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validate()) return
  serverError.value = ''
  loading.value = true
  try {
    const tokens = await authApi.login({ email: form.email, password: form.password })
    auth.setTokens(tokens.accessToken, tokens.refreshToken)
    try {
      const user = await authApi.me()
      auth.setUser(user)
      const redirect = (route.query.redirect as string) || getRoleHomePath(user.role)
      router.push(redirect)
    } catch {
      router.push((route.query.redirect as string) || '/')
    }
  } catch (err: unknown) {
    auth.logout()
    serverError.value = extractErrorMessage(err, t('auth.login.errorInvalidCredentials'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.success-banner {
  margin-bottom: 16px; padding: 12px 14px;
  background: #f0fdf4; border: 1px solid #86efac;
  border-radius: var(--r-md); font-size: 13px; color: #166534;
}
.auth-head { margin-bottom: 28px; }
.auth-title { font-size: 26px; font-weight: 700; letter-spacing: -0.025em; color: var(--text); }
.auth-sub   { font-size: 13px; color: var(--text-muted); margin-top: 5px; }

.auth-form  { display: flex; flex-direction: column; gap: 18px; }

.field-group      { display: flex; flex-direction: column; gap: 6px; }
.field-label      { font-size: 12.5px; font-weight: 600; color: var(--text); }
.field-label-row  { display: flex; justify-content: space-between; align-items: center; }
.field-link       { font-size: 12px; color: var(--primary); font-weight: 500; text-decoration: none; }
.field-link:hover { text-decoration: underline; }

.sl-btn-primary {
  width: 100%; height: 46px; margin-top: 2px;
  background: var(--primary); color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; font-family: var(--font-sans);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.sl-btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  box-shadow: 0 4px 16px var(--primary-glow);
  transform: translateY(-1px);
}
.sl-btn-primary:active:not(:disabled) { transform: translateY(0); }
.sl-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.auth-footer      { margin-top: 22px; text-align: center; font-size: 13px; color: var(--text-muted); }
.auth-link        { color: var(--primary); font-weight: 600; text-decoration: none; margin-left: 4px; }
.auth-link:hover  { text-decoration: underline; }
</style>
