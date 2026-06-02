<template>
  <div v-if="isAuthenticated" class="page">
    <nav class="sidebar">
      <div class="sidebar-brand">
        <AppLogo />
      </div>
      <div class="sidebar-nav">
        <template v-if="role === 'CLIENT'">
          <div class="sidebar-section-label">{{ t('sidebar.account') }}</div>
          <router-link to="/dashboard" class="sidebar-item" active-class="active">
            <span class="mdi mdi-calendar-outline nav-icon" />
            {{ t('sidebar.myAppointments') }}
          </router-link>
          <router-link to="/masters" class="sidebar-item" active-class="active">
            <span class="mdi mdi-magnify nav-icon" />
            {{ t('sidebar.findMaster') }}
          </router-link>
          <router-link to="/profile" class="sidebar-item" active-class="active">
            <span class="mdi mdi-account-circle-outline nav-icon" />
            {{ t('sidebar.profile') }}
          </router-link>
        </template>
        <template v-if="role === 'MASTER'">
          <div class="sidebar-section-label">{{ t('sidebar.workspace') }}</div>
          <router-link to="/master/dashboard" class="sidebar-item" active-class="active">
            <span class="mdi mdi-calendar-month-outline nav-icon" />
            {{ t('sidebar.appointments') }}
          </router-link>
          <router-link to="/masters" class="sidebar-item" active-class="active">
            <span class="mdi mdi-magnify nav-icon" />
            {{ t('sidebar.findMaster') }}
          </router-link>
        </template>
        <template v-if="role === 'ADMIN'">
          <router-link to="/admin" class="sidebar-item" active-class="active">
            <span class="mdi mdi-view-dashboard-outline nav-icon" />
            {{ t('sidebar.dashboard') }}
          </router-link>
          <router-link to="/masters" class="sidebar-item" active-class="active">
            <span class="mdi mdi-magnify nav-icon" />
            {{ t('sidebar.findMaster') }}
          </router-link>
        </template>
      </div>
      <div class="sidebar-foot">
        <LanguageSwitcher style="width:100%; justify-content:flex-start; margin-bottom:4px;" />
        <button class="theme-toggle" @click="themeStore.toggle()" :title="themeStore.dark ? t('nav.lightMode') : t('nav.darkMode')">
          <span :class="themeStore.dark ? 'mdi mdi-weather-sunny' : 'mdi mdi-weather-night'" style="font-size:16px;" />
          <span>{{ themeStore.dark ? t('nav.lightMode') : t('nav.darkMode') }}</span>
        </button>
        <div class="sidebar-user" style="margin-top:8px;">
          <AppAvatar :name="user?.name || '?'" size="sm" tone="rose" />
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">{{ user?.name || 'User' }}</div>
            <div class="sidebar-user-role">{{ user?.role === 'ADMIN' ? t('common.roleAdmin') : user?.role === 'MASTER' ? t('common.roleMaster') : t('common.roleClient') }}</div>
          </div>
          <button class="logout-btn" @click="handleLogout" :title="t('nav.signOut')">
            <span class="mdi mdi-logout-variant" />
          </button>
        </div>
      </div>
    </nav>
    <main class="page-main">
      <slot />
    </main>
  </div>
  <div v-else style="min-height:100vh; display:flex; flex-direction:column; background:var(--bg);">
    <header class="topbar" style="position:sticky; top:0; z-index:100;">
      <div style="display:flex; align-items:center; gap:32px;">
        <router-link to="/" style="text-decoration:none;">
          <AppLogo />
        </router-link>
        <nav style="display:flex; gap:4px;">
          <router-link to="/masters" class="sidebar-item" active-class="active" style="height:36px; padding:0 14px; font-size:13px;">
            {{ t('nav.findMasters') }}
          </router-link>
        </nav>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <LanguageSwitcher />
        <router-link to="/login">
          <v-btn variant="text" color="primary" size="small">{{ t('nav.logIn') }}</v-btn>
        </router-link>
        <router-link to="/register">
          <v-btn color="primary" size="small">{{ t('nav.signUp') }}</v-btn>
        </router-link>
      </div>
    </header>
    <main style="flex:1;">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import AppLogo from '@/components/AppLogo.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const themeStore = useThemeStore()
const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)
const user = computed(() => auth.user)
const role = computed(() => auth.role)

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.8;
}
.sidebar-item.active .nav-icon { opacity: 1; }
.sidebar-user {
  display: flex; align-items: center; gap: 10px;
}
.sidebar-user-info {
  flex: 1; min-width: 0;
}
.sidebar-user-name {
  font-size: 13px; font-weight: 600;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--text);
}
.sidebar-user-role {
  font-size: 11px; color: var(--text-muted); text-transform: capitalize;
  margin-top: 1px;
}
.logout-btn {
  background: none; border: none; cursor: pointer; padding: 6px;
  color: var(--text-subtle); border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  transition: background var(--t-fast), color var(--t-fast);
}
.logout-btn:hover { background: var(--surface-3); color: var(--danger); }

.theme-toggle {
  width: 100%; display: flex; align-items: center; gap: 10px;
  height: 36px; padding: 0 10px; border-radius: var(--r-md);
  border: none; background: none; cursor: pointer;
  color: var(--text-muted); font-size: 13px; font-family: var(--font-sans);
  font-weight: 500; transition: background var(--t-fast), color var(--t-fast);
}
.theme-toggle:hover { background: var(--surface-3); color: var(--text); }
</style>
