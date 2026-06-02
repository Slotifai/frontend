<template>
  <AuthLayout>
    <div class="auth-head">
      <div class="auth-title">{{ t('auth.register.title') }}</div>
      <div class="auth-sub">{{ t('auth.register.subtitle') }}</div>
    </div>
    <div class="role-selector">
      <div
        v-for="r in roles"
        :key="r.value"
        class="role-card"
        :class="{ active: form.role === r.value }"
        @click="form.role = r.value"
      >
        <div class="role-card-top">
          <div class="role-icon" :class="{ 'role-icon-active': form.role === r.value }">
            <AppIcon :name="r.icon" :size="18" />
          </div>
          <div class="role-check" :class="{ checked: form.role === r.value }">
            <span v-if="form.role === r.value" class="mdi mdi-check" style="font-size:11px;" />
          </div>
        </div>
        <div class="role-label">{{ r.label }}</div>
        <div class="role-desc">{{ r.desc }}</div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-2col">
        <div class="field-group">
          <label class="field-label">{{ t('auth.register.firstName') }}</label>
          <v-text-field v-model="form.firstName" :placeholder="t('auth.register.firstNamePlaceholder')" variant="outlined" density="compact" :error-messages="errors.firstName" hide-details="auto" />
        </div>
        <div class="field-group">
          <label class="field-label">{{ t('auth.register.lastName') }}</label>
          <v-text-field v-model="form.lastName" :placeholder="t('auth.register.lastNamePlaceholder')" variant="outlined" density="compact" :error-messages="errors.lastName" hide-details="auto" />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">{{ t('auth.register.email') }}</label>
        <v-text-field v-model="form.email" type="email" :placeholder="t('auth.register.emailPlaceholder')" variant="outlined" density="compact" :error-messages="errors.email" hide-details="auto" />
      </div>

      <div class="field-group">
        <label class="field-label">{{ t('auth.register.phone') }}</label>
        <div class="vf-outlined" :class="{ 'vf-error': errors.phone, 'vf-focused': phoneFocused }" @click="phoneInputEl?.focus()">
          <span class="vf-prefix">+38&nbsp;</span>
          <input
            ref="phoneInputEl"
            :value="phoneDisplay"
            @input="onPhoneInput"
            @paste="onPhonePaste"
            @focus="phoneFocused = true"
            @blur="phoneFocused = false"
            type="text"
            placeholder="0XX XXX XX XX"
            maxlength="13"
            class="vf-input"
          />
        </div>
        <div v-if="errors.phone" class="vf-error-msg">{{ errors.phone }}</div>
      </div>

      <div v-if="form.role === 'MASTER'" class="field-group">
        <label class="field-label">{{ t('auth.register.specialization') }}</label>
        <v-select
          v-model="form.specializations"
          :items="specializationOptions"
          item-title="label"
          item-value="value"
          :placeholder="t('auth.register.specializationPlaceholder')"
          variant="outlined"
          density="compact"
          hide-details="auto"
          multiple
          chips
          closable-chips
        />
      </div>

      <div class="field-group">
        <label class="field-label">{{ t('auth.register.password') }}</label>
        <v-text-field
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('auth.register.passwordHint')"
          variant="outlined" density="compact"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          @click:append-inner="showPassword = !showPassword"
          :error-messages="errors.password"
          hide-details="auto"
        />
      </div>

      <ErrorMessage :message="serverError" />

      <button type="submit" class="sl-btn-primary" :disabled="loading">
        <span v-if="!loading">{{ t('auth.register.submit') }}</span>
        <span v-else class="btn-spinner" />
      </button>
    </form>

    <div class="auth-footer">
      {{ t('auth.register.hasAccount') }}
      <router-link to="/login" class="auth-link">{{ t('auth.register.signIn') }}</router-link>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-head { margin-bottom: 22px; }
.auth-title { font-size: 26px; font-weight: 700; letter-spacing: -0.025em; }
.auth-sub   { font-size: 13px; color: var(--text-muted); margin-top: 5px; }

.role-selector { display: flex; gap: 10px; margin-bottom: 20px; }
.role-card {
  flex: 1; padding: 14px; border-radius: var(--r-md); cursor: pointer;
  border: 1.5px solid var(--border);
  background: var(--surface);
  box-shadow: var(--el-1);
  transition: all var(--t-fast);
}
.role-card:hover { border-color: var(--primary-soft); box-shadow: var(--el-2); }
.role-card.active {
  border-color: var(--primary);
  background: var(--primary-50);
  box-shadow: 0 0 0 3px var(--primary-glow), var(--el-1);
}
.role-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.role-icon {
  width: 34px; height: 34px; border-radius: var(--r-sm);
  background: var(--surface-3); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--t-fast);
}
.role-icon-active { background: var(--primary); color: #fff; }
.role-check {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--t-fast);
  font-size: 11px;
}
.role-check.checked { background: var(--primary); border-color: var(--primary); color: #fff; }
.role-label { font-weight: 700; font-size: 13.5px; letter-spacing: -0.01em; }
.role-desc  { font-size: 11.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }

.auth-form  { display: flex; flex-direction: column; gap: 14px; }
.form-2col  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 12.5px; font-weight: 600; color: var(--text); }

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
.sl-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }


.vf-outlined {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-strong);
  border-radius: var(--r-sm);
  background: transparent;
  transition: border-color 0.15s;
  cursor: text;
  box-sizing: border-box;
}
.vf-outlined.vf-focused { border-color: var(--primary); }
.vf-outlined.vf-error { border-color: #b00020; }
.vf-prefix {
  font-size: 16px;
  font-family: var(--font-sans);
  color: var(--text);
  user-select: none;
  margin-right: 4px;
  flex-shrink: 0;
}
.vf-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: var(--font-sans);
  color: var(--text);
  min-width: 0;
  padding: 0;
}
.vf-input::placeholder { color: var(--text-muted); }
.vf-error-msg { font-size: 11px; color: #b00020; margin-top: 3px; padding-left: 14px; line-height: 1.4; }

.auth-footer     { margin-top: 20px; text-align: center; font-size: 13px; color: var(--text-muted); }
.auth-link       { color: var(--primary); font-weight: 600; text-decoration: none; margin-left: 4px; }
.auth-link:hover { text-decoration: underline; }
</style>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppIcon from '@/components/AppIcon.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { extractErrorMessage } from '@/utils/errorUtils'
import { validateEmail, validatePassword, validatePhone } from '@/utils/validation'
import { authApi } from '@/api/auth'
import { SPECIALIZATION_KEYS, SPEC_API_VALUE } from '@/constants/specializations'

const { t } = useI18n()

const specializationOptions = computed(() =>
  SPECIALIZATION_KEYS.filter(k => k !== 'all').map(k => ({
    label: t(`masters.specs.${k}`),
    value: SPEC_API_VALUE[k],
  }))
)
const router = useRouter()

const roles = computed(() => [
  { value: 'CLIENT' as const, icon: 'user', label: t('auth.register.roleClient'), desc: t('auth.register.roleClientDesc') },
  { value: 'MASTER' as const, icon: 'briefcase', label: t('auth.register.roleMaster'), desc: t('auth.register.roleMasterDesc') },
])

const form = reactive({
  role: 'CLIENT' as 'CLIENT' | 'MASTER',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  specializations: [] as string[],
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
})

const phoneInputEl = ref<HTMLInputElement | null>(null)

function formatPhoneDisplay(digits: string) {
  let r = ''
  if (digits.length > 0) r += digits.slice(0, 3)
  if (digits.length > 3) r += ' ' + digits.slice(3, 6)
  if (digits.length > 6) r += ' ' + digits.slice(6, 8)
  if (digits.length > 8) r += ' ' + digits.slice(8, 10)
  return r
}

const phoneDisplay = computed(() => formatPhoneDisplay(form.phone.replace(/^\+38/, '')))

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '').slice(0, 10)
  form.phone = '+38' + raw
  const formatted = formatPhoneDisplay(raw)
  nextTick(() => {
    if (phoneInputEl.value) {
      phoneInputEl.value.value = formatted
    }
  })
}

function onPhonePaste(e: ClipboardEvent) {
  e.preventDefault()
  let digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
  if (digits.startsWith('380')) digits = digits.slice(2)
  else if (digits.startsWith('38')) digits = digits.slice(2)
  form.phone = '+38' + digits.slice(0, 10)
  nextTick(() => {
    if (phoneInputEl.value) {
      phoneInputEl.value.value = formatPhoneDisplay(digits.slice(0, 10))
    }
  })
}

const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)
const phoneFocused = ref(false)

function validate() {
  errors.firstName = form.firstName.trim() ? '' : t('common.required')
  errors.lastName = form.lastName.trim() ? '' : t('common.required')
  errors.email = validateEmail(form.email)
  errors.phone = validatePhone(form.phone)
  errors.password = validatePassword(form.password)
  return !errors.firstName && !errors.lastName && !errors.email && !errors.phone && !errors.password
}

async function handleSubmit() {
  if (!validate()) return
  serverError.value = ''
  loading.value = true
  try {
    await authApi.register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      role: form.role,
      specialization: form.specializations.join(', ') || undefined,
    })
    router.push({ path: '/login', query: { registered: '1' } })
  } catch (err: unknown) {
    serverError.value = extractErrorMessage(err, t('auth.register.errorFailed'))
  } finally {
    loading.value = false
  }
}
</script>
