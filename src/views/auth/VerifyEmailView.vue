<template>
  <AuthLayout>
    <div class="verify-wrap">
      <template v-if="status === 'loading'">
        <div class="verify-spinner" />
        <div class="verify-sub">{{ t('auth.verify.verifying') }}</div>
      </template>
      <template v-else-if="status === 'success'">
        <div class="verify-icon verify-icon-success">
          <span class="mdi mdi-check" style="font-size:34px;" />
        </div>
        <div class="verify-title">{{ t('auth.verify.successTitle') }}</div>
        <div class="verify-sub">{{ t('auth.verify.successDesc') }}</div>
        <button class="sl-btn-primary" @click="router.push('/')">{{ t('auth.verify.successCta') }}</button>
      </template>
      <template v-else>
        <div class="verify-icon verify-icon-error">
          <span class="mdi mdi-close-circle-outline" style="font-size:34px;" />
        </div>
        <div class="verify-title">{{ t('auth.verify.failTitle') }}</div>
        <div class="verify-sub">{{ t('auth.verify.failDesc') }}</div>
        <button class="sl-btn-primary sl-btn-danger" @click="router.push('/login')">{{ t('auth.verify.backToLogin') }}</button>
      </template>
    </div>
  </AuthLayout>
</template>

<style scoped>
.verify-wrap {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 16px; padding: 20px 0;
}
.verify-icon {
  width: 80px; height: 80px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.verify-icon-success { background: var(--success-soft); color: var(--success); }
.verify-icon-error   { background: var(--danger-soft);  color: var(--danger);  }

.verify-title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
.verify-sub   { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; max-width: 320px; }

.verify-spinner {
  width: 40px; height: 40px; border-radius: 50%;
  border: 3px solid var(--primary-soft); border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.sl-btn-primary {
  width: 100%; max-width: 280px; height: 46px;
  background: var(--primary); color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--font-sans);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
  margin-top: 4px;
}
.sl-btn-primary:hover { background: var(--primary-hover); box-shadow: 0 4px 16px var(--primary-glow); transform: translateY(-1px); }
.sl-btn-danger { background: var(--danger); }
.sl-btn-danger:hover { background: #b02018; box-shadow: 0 4px 16px var(--danger-glow); }
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { authApi } from '@/api/auth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error'>('loading')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) { status.value = 'error'; return }
  try {
    await authApi.verifyEmail(token)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
})
</script>
