<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('adminUsers.title')" :subtitle="t('adminUsers.subtitle')" />
      <div class="card card-pad" style="padding: 12px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <SearchInput v-model="search" :placeholder="t('adminUsers.searchPlaceholder')" @input="debouncedFetch" />

        <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted);">{{ t('common.role') }}:</div>
        <span v-for="r in roleFilters" :key="r.key" class="chip" :class="{ active: roleFilter === r.key }" style="cursor: pointer;" @click="setRole(r.key)">{{ r.label }}</span>

      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="card" style="overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th class="th">{{ t('adminUsers.colUser') }}</th>
                <th class="th" style="width: 100px;">{{ t('common.role') }}</th>
                <th class="th" style="width: 110px;">{{ t('adminUsers.colStatus') }}</th>
                <th class="th" style="width: 130px;">{{ t('adminUsers.colJoined') }}</th>
                <th class="th" style="width: 150px; text-align: right;">{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td class="td">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <AppAvatar :name="u.name" size="sm" :tone="avatarTone(u.name)" />
                    <div>
                      <div style="font-weight: 500;">{{ u.name }}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">{{ u.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="td">
                  <span
                    :style="{
                      fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                      padding: '2px 8px', borderRadius: '4px',
                      background: u.role === 'ADMIN' ? 'var(--primary-50)' : u.role === 'MASTER' ? '#FFF8E6' : 'var(--surface-2)',
                      color: u.role === 'ADMIN' ? 'var(--primary)' : u.role === 'MASTER' ? 'var(--warning)' : 'var(--text-muted)',
                    }"
                  >{{ u.role }}</span>
                </td>
                <td class="td">
                  <StatusBadge :status="u.status" />
                </td>
                <td class="td" style="font-size: 12px; color: var(--text-muted);">{{ formatDate(u.createdAt) }}</td>
                <td class="td" style="text-align: right;">
                  <v-btn
                    v-if="u.status === 'ACTIVE' && u.role !== 'ADMIN'"
                    variant="text"
                    size="small"
                    color="warning"
                    :loading="actionTarget === u.id"
                    @click="openAction(u, 'block')"
                  >{{ t('adminUsers.blockBtn') }}</v-btn>
                  <v-btn
                    v-if="u.status === 'BLOCKED'"
                    variant="text"
                    size="small"
                    color="success"
                    :loading="actionTarget === u.id"
                    @click="openAction(u, 'unblock')"
                  >{{ t('adminUsers.unblockBtn') }}</v-btn>
                  <v-btn
                    v-if="u.role !== 'ADMIN'"
                    variant="text"
                    size="small"
                    color="error"
                    @click="openAction(u, 'delete')"
                  >{{ t('adminUsers.deleteBtn') }}</v-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <EmptyState v-if="!users.length" icon="users" :title="t('adminUsers.noUsers')" :description="t('adminUsers.noUsersDesc')" />
        </div>

        <PaginationFooter :page="page" :limit="limit" :total="total" @update:page="goPage" />
      </template>
    </div>

    <ConfirmModal
      v-model="confirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-label="confirmLabel"
      :confirm-color="confirmAction === 'delete' ? 'error' : confirmAction === 'block' ? 'warning' : 'success'"
      :loading="actionLoading"
      @confirm="doAction"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/utils/dateUtils'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchInput from '@/components/SearchInput.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationFooter from '@/components/PaginationFooter.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { adminApi, type AdminUser } from '@/api/admin'
import { getAvatarTone } from '@/utils/avatarTones'
import { debounce } from '@/utils/debounce'

const { t } = useI18n()

const users = ref<AdminUser[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(false)
const search = ref('')
const roleFilter = ref('all')

const confirmDialog = ref(false)
const confirmAction = ref<'block' | 'unblock' | 'delete'>('block')
const actionTarget = ref<string | null>(null)
const actionUser = ref<AdminUser | null>(null)
const actionLoading = ref(false)

const roleFilters = computed(() => [
  { key: 'all', label: t('adminUsers.roleAll') },
  { key: 'CLIENT', label: t('adminUsers.roleClients') },
  { key: 'MASTER', label: t('adminUsers.roleMasters') },
])

const confirmTitle = computed(() => {
  if (confirmAction.value === 'block') return t('adminUsers.blockTitle', { name: actionUser.value?.name })
  if (confirmAction.value === 'unblock') return t('adminUsers.unblockTitle', { name: actionUser.value?.name })
  return t('adminUsers.deleteTitle', { name: actionUser.value?.name })
})
const confirmMessage = computed(() => {
  if (confirmAction.value === 'block') return t('adminUsers.blockDesc')
  if (confirmAction.value === 'unblock') return t('adminUsers.unblockDesc')
  return t('adminUsers.deleteDesc')
})
const confirmLabel = computed(() => {
  if (confirmAction.value === 'block') return t('adminUsers.blockBtn')
  if (confirmAction.value === 'unblock') return t('adminUsers.unblockBtn')
  return t('adminUsers.deleteBtn')
})

const avatarTone = getAvatarTone


const debouncedFetch = debounce(() => { page.value = 1; fetchUsers() })

async function fetchUsers() {
  loading.value = true
  try {
    const result = await adminApi.getUsers({
      page: page.value,
      limit,
      role: roleFilter.value !== 'all' ? roleFilter.value : undefined,
      search: search.value || undefined,
    })
    users.value = result.data
    total.value = result.total
  } catch {
    users.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function setRole(key: string) { roleFilter.value = key; page.value = 1; fetchUsers() }
function goPage(p: number) { page.value = p; fetchUsers() }

function openAction(u: AdminUser, action: 'block' | 'unblock' | 'delete') {
  actionUser.value = u
  confirmAction.value = action
  confirmDialog.value = true
}

async function doAction() {
  if (!actionUser.value) return
  actionLoading.value = true
  actionTarget.value = actionUser.value.id
  try {
    if (confirmAction.value === 'block') await adminApi.blockUser(actionUser.value.id)
    else if (confirmAction.value === 'unblock') await adminApi.unblockUser(actionUser.value.id)
    else await adminApi.deleteUser(actionUser.value.id)
    confirmDialog.value = false
    await fetchUsers()
  } catch {}
  finally { actionLoading.value = false; actionTarget.value = null }
}

onMounted(fetchUsers)
</script>

