<template>
  <div class="auth-layout">
    <div class="auth-brand">
      <div class="auth-brand-logo">
        <div class="logo-mark">S</div>
        <span class="logo-name">Slotifai</span>
      </div>

      <div class="auth-brand-hero">
        <div class="auth-brand-headline" v-html="t('auth.brandTagline').replace(/ for both sides.$/, '<br/>for both sides.')" />
        <div class="auth-brand-sub">{{ t('auth.brandDesc') }}</div>

        <div class="auth-brand-pills">
          <span class="brand-pill">✦ {{ t('auth.smartScheduling') }}</span>
          <span class="brand-pill">✦ {{ t('auth.instantBooking') }}</span>
          <span class="brand-pill">✦ {{ t('auth.realReviews') }}</span>
        </div>
      </div>

      <div class="auth-brand-footer">
        <span>v 1.0</span>
        <span class="brand-dot">·</span>
        <span>© 2025 Slotifai</span>
      </div>

      <div class="brand-blob brand-blob-1" />
      <div class="brand-blob brand-blob-2" />
    </div>

    <div class="auth-form-area">
      <div class="auth-form-topbar">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div class="auth-form-inner fade-up">
        <div class="auth-mobile-logo">
          <div class="logo-mark logo-mark-dark">S</div>
          <span class="logo-name-dark">Slotifai</span>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
const { t } = useI18n()
</script>

<style scoped>
.auth-layout {
  display: flex;
  height: 100vh;
  font-family: var(--font-sans);
  overflow: hidden;
}

.auth-brand {
  width: 380px;
  background: var(--primary);
  color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.auth-brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.logo-mark {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(8px);
  display: inline-flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 800; font-size: 17px;
  letter-spacing: -0.5px;
}

.logo-name {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #fff;
}

.auth-brand-hero {
  position: relative;
  z-index: 1;
}

.auth-brand-headline {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  color: #fff;
}

.auth-brand-sub {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(255,255,255,0.65);
  margin-bottom: 28px;
}

.auth-brand-pills {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-pill {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 14px;
  border-radius: var(--r-pill);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
  letter-spacing: 0.01em;
}

.auth-brand-footer {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: var(--font-mono);
  position: relative;
  z-index: 1;
}

.brand-dot { opacity: 0.4; }

.brand-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.brand-blob-1 {
  width: 320px; height: 320px;
  bottom: -60px; right: -80px;
  background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
}
.brand-blob-2 {
  width: 200px; height: 200px;
  top: 60px; right: 20px;
  background: radial-gradient(circle, rgba(229,168,35,0.18) 0%, transparent 70%);
}

.auth-form-topbar {
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.auth-form-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  background: var(--bg);
  overflow-y: auto;
}

.auth-form-inner {
  width: 400px;
  max-width: 100%;
}

.auth-mobile-logo {
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.logo-mark-dark {
  background: var(--primary);
  color: #fff;
  border: none;
}

.logo-name-dark {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--text);
}

@media (max-width: 700px) {
  .auth-brand { display: none; }
  .auth-form-area { padding: 32px 20px; align-items: flex-start; padding-top: 48px; }
  .auth-form-inner { width: 100%; }
  .auth-mobile-logo { display: flex; }
}
</style>
