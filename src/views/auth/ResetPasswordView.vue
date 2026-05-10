<template>
  <AuthLayout>
    <div class="auth-head">
      <div class="auth-title">{{ t('auth.reset.title') }}</div>
      <div class="auth-sub">{{ t('auth.reset.subtitle') }}</div>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="field-group">
        <label class="field-label">{{ t('auth.reset.newPassword') }}</label>
        <v-text-field
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('auth.reset.passwordHint')"
          variant="outlined"
          density="compact"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          @click:append-inner="showPassword = !showPassword"
          :error-messages="errors.password"
          hide-details="auto"
        />
      </div>
      <div class="pwd-rules">
        <div
          v-for="rule in rules"
          :key="rule.label"
          class="pwd-rule"
          :class="{ ok: rule.ok }"
        >
          <span class="mdi" :class="rule.ok ? 'mdi-check-circle' : 'mdi-circle-outline'" />
          {{ rule.label }}
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">{{ t('auth.reset.confirmPassword') }}</label>
        <v-text-field
          v-model="form.confirm"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('auth.reset.confirmPlaceholder')"
          variant="outlined"
          density="compact"
          :error-messages="errors.confirm"
          hide-details="auto"
        />
      </div>

      <ErrorMessage :message="serverError" />

      <button type="submit" class="sl-btn-primary" :disabled="loading">
        <span v-if="!loading">{{ t('auth.reset.submit') }}</span>
        <span v-else class="btn-spinner" />
      </button>
    </form>
  </AuthLayout>
</template>

<style scoped>
.auth-head { margin-bottom: 28px; }
.auth-title { font-size: 26px; font-weight: 700; letter-spacing: -0.025em; }
.auth-sub   { font-size: 13px; color: var(--text-muted); margin-top: 5px; }

.auth-form  { display: flex; flex-direction: column; gap: 18px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12.5px; font-weight: 600; color: var(--text); }

.pwd-rules { display: flex; flex-direction: column; gap: 5px; margin-top: -4px; }
.pwd-rule  { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-subtle); transition: color var(--t-fast); }
.pwd-rule .mdi { font-size: 14px; }
.pwd-rule.ok   { color: var(--success); }

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
</style>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'
import { authApi } from '@/api/auth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const form = reactive({ password: '', confirm: '' })
const errors = reactive({ password: '', confirm: '' })
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)

const rules = computed(() => [
  { ok: form.password.length >= 8, label: t('auth.reset.rule1') },
  { ok: /\d/.test(form.password), label: t('auth.reset.rule2') },
  { ok: /[A-Z]/.test(form.password), label: t('auth.reset.rule3') },
])

async function handleSubmit() {
  errors.password = ''
  errors.confirm = ''
  if (!rules.value.every(r => r.ok)) { errors.password = 'Password does not meet requirements'; return }
  if (form.password !== form.confirm) { errors.confirm = 'Passwords do not match'; return }

  const token = route.query.token as string
  if (!token) { serverError.value = 'Invalid reset link'; return }

  loading.value = true
  try {
    await authApi.resetPassword(token, form.password)
    router.push('/login')
  } catch (err: unknown) {
    serverError.value = extractErrorMessage(err, 'Reset failed. The link may have expired.')
  } finally {
    loading.value = false
  }
}
</script>
