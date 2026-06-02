<template>
  <div class="page">
    <nav class="sidebar">
      <div class="sidebar-brand">
        <AppLogo />
        <span v-if="role === 'ADMIN'" class="admin-badge">Admin</span>
      </div>

      <div class="sidebar-nav">
        <template v-if="role === 'CLIENT'">
          <div class="sidebar-section-label">{{ t('sidebar.account') }}</div>
          <router-link to="/dashboard" class="sidebar-item" active-class="active">
            <span class="mdi mdi-calendar-outline nav-icon" />
            {{ t('sidebar.myAppointments') }}
            <BadgeCount :count="scheduledCount" />
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
            <BadgeCount :count="scheduledCount" />
          </router-link>
          <router-link to="/master/services" class="sidebar-item" active-class="active">
            <span class="mdi mdi-scissors-cutting nav-icon" />
            {{ t('sidebar.services') }}
          </router-link>
          <router-link to="/master/schedule" class="sidebar-item" active-class="active">
            <span class="mdi mdi-clock-outline nav-icon" />
            {{ t('sidebar.schedule') }}
          </router-link>
          <router-link to="/master/profile" class="sidebar-item" active-class="active">
            <span class="mdi mdi-account-circle-outline nav-icon" />
            {{ t('sidebar.profile') }}
          </router-link>
        </template>

        <template v-if="role === 'ADMIN'">
          <router-link to="/admin" class="sidebar-item" active-class="active" exact-active-class="active">
            <span class="mdi mdi-view-dashboard-outline nav-icon" />
            {{ t('sidebar.dashboard') }}
          </router-link>
          <router-link to="/admin/users" class="sidebar-item" active-class="active">
            <span class="mdi mdi-account-group-outline nav-icon" />
            {{ t('sidebar.users') }}
          </router-link>
          <router-link to="/admin/masters" class="sidebar-item" active-class="active">
            <span class="mdi mdi-briefcase-outline nav-icon" />
            {{ t('sidebar.masters') }}
          </router-link>
          <router-link to="/admin/appointments" class="sidebar-item" active-class="active">
            <span class="mdi mdi-calendar-outline nav-icon" />
            {{ t('sidebar.appointments') }}
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
          <AppAvatar :name="user?.name || '?'" size="sm" :tone="avatarTone" />
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">{{ user?.name || 'User' }}</div>
            <div class="sidebar-user-role">{{ user?.role?.toLowerCase() }}</div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import AppLogo from '@/components/AppLogo.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import BadgeCount from '@/components/BadgeCount.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { masterMeApi } from '@/api/masterMe'
import { appointmentsApi } from '@/api/appointments'

const { t } = useI18n()
const themeStore = useThemeStore()
const auth = useAuthStore()
const router = useRouter()

const role = computed(() => auth.role)
const user = computed(() => auth.user)

const avatarTone = computed(() => {
  if (role.value === 'MASTER') return 'teal'
  if (role.value === 'ADMIN') return 'indigo'
  return 'rose'
})

const scheduledCount = ref(0)

onMounted(async () => {
  try {
    if (role.value === 'MASTER') {
      const res = await masterMeApi.getAppointments({ status: 'SCHEDULED', limit: 1 })
      scheduledCount.value = res.total
    } else if (role.value === 'CLIENT') {
      const res = await appointmentsApi.myList({ status: 'SCHEDULED', limit: 1 })
      scheduledCount.value = res.total
    }
  } catch {}
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-badge {
  margin-left: auto;
  font-size: 10px; font-weight: 700;
  background: var(--primary); color: #fff;
  padding: 2px 8px; border-radius: var(--r-pill);
  letter-spacing: 0.04em;
}

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
