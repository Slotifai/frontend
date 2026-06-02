<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('adminMasters.title')" :subtitle="t('adminMasters.subtitle')" />
      <div class="card card-pad" style="padding: 12px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <SearchInput v-model="search" :placeholder="t('adminMasters.searchPlaceholder')" @input="debouncedFetch" />
        <div style="font-size: 13px; color: var(--text-muted);">{{ t('common.status') }}</div>
        <span v-for="s in statusFilters" :key="s.key" class="chip" :class="{ active: statusFilter === s.key }" style="cursor: pointer;" @click="setStatus(s.key)">{{ s.label }}</span>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="card" style="overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th class="th">{{ t('adminMasters.colMaster') }}</th>
                <th class="th">{{ t('adminMasters.colSpec') }}</th>
                <th class="th" style="width: 110px;">{{ t('adminMasters.colStatus') }}</th>
                <th class="th" style="width: 130px;">{{ t('adminMasters.colJoined') }}</th>
                <th class="th" style="width: 150px; text-align: right;">{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in masters" :key="m.id">
                <td class="td">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <AppAvatar :name="m.name" size="sm" :tone="avatarTone(m.name)" />
                    <div>
                      <div style="font-weight: 500;">{{ m.name }}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">{{ m.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="td" style="font-size: 13px; color: var(--text-muted);">{{ m.specialization || '—' }}</td>
                <td class="td"><StatusBadge :status="m.status" /></td>
                <td class="td" style="font-size: 12px; color: var(--text-muted);">{{ formatDate(m.createdAt) }}</td>
                <td class="td" style="text-align: right;">
                  <v-btn
                    v-if="m.status === 'ACTIVE'"
                    variant="text" size="small" color="warning"
                    :loading="actionTarget === m.id"
                    @click="openAction(m, 'block')"
                  >{{ t('adminMasters.blockBtn') }}</v-btn>
                  <v-btn
                    v-if="m.status === 'BLOCKED'"
                    variant="text" size="small" color="success"
                    :loading="actionTarget === m.id"
                    @click="openAction(m, 'unblock')"
                  >{{ t('adminMasters.unblockBtn') }}</v-btn>
                  <v-btn variant="text" size="small" color="error" @click="openAction(m, 'delete')">{{ t('adminMasters.deleteBtn') }}</v-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <EmptyState v-if="!masters.length" icon="briefcase" :title="t('adminMasters.noMasters')" :description="t('adminMasters.noMastersDesc')" />
        </div>

        <PaginationFooter :page="page" :limit="limit" :total="total" @update:page="goPage" />
      </template>
    </div>

    <ConfirmModal
      v-model="confirmDialog"
      :title="confirmAction === 'delete' ? t('adminMasters.deleteTitle', { name: actionMaster?.name }) : confirmAction === 'block' ? t('adminMasters.blockTitle', { name: actionMaster?.name }) : t('adminMasters.unblockTitle', { name: actionMaster?.name })"
      :message="confirmAction === 'delete' ? t('adminMasters.deleteDesc') : confirmAction === 'block' ? t('adminMasters.blockDesc') : t('adminMasters.unblockDesc')"
      :confirm-label="confirmAction === 'delete' ? t('adminMasters.deleteBtn') : confirmAction === 'block' ? t('adminMasters.blockBtn') : t('adminMasters.unblockBtn')"
      :confirm-color="confirmAction === 'delete' ? 'error' : confirmAction === 'block' ? 'warning' : 'success'"
      :loading="actionLoading"
      @confirm="doAction"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchInput from '@/components/SearchInput.vue'
import AppIcon from '@/components/AppIcon.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationFooter from '@/components/PaginationFooter.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { adminApi, type AdminUser } from '@/api/admin'
import { getAvatarTone } from '@/utils/avatarTones'
import { formatDate } from '@/utils/dateUtils'
import { debounce } from '@/utils/debounce'

const { t } = useI18n()

const masters = ref<AdminUser[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(false)
const search = ref('')
const statusFilter = ref('all')

const confirmDialog = ref(false)
const confirmAction = ref<'block' | 'unblock' | 'delete'>('block')
const actionTarget = ref<string | null>(null)
const actionMaster = ref<AdminUser | null>(null)
const actionLoading = ref(false)

const statusFilters = computed(() => [
  { key: 'all', label: t('adminMasters.statusAll') },
  { key: 'ACTIVE', label: t('common.active') },
  { key: 'BLOCKED', label: t('common.blocked') },
])

const avatarTone = getAvatarTone

const debouncedFetch = debounce(() => { page.value = 1; fetchMasters() })

async function fetchMasters() {
  loading.value = true
  try {
    const result = await adminApi.getMasters({
      page: page.value, limit,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
      search: search.value || undefined,
    })
    masters.value = result.data
    total.value = result.total
  } catch { masters.value = []; total.value = 0 }
  finally { loading.value = false }
}

function setStatus(key: string) { statusFilter.value = key; page.value = 1; fetchMasters() }
function goPage(p: number) { page.value = p; fetchMasters() }

function openAction(m: AdminUser, action: 'block' | 'unblock' | 'delete') {
  actionMaster.value = m
  confirmAction.value = action
  confirmDialog.value = true
}

async function doAction() {
  if (!actionMaster.value) return
  actionLoading.value = true
  actionTarget.value = actionMaster.value.id
  try {
    if (confirmAction.value === 'block') await adminApi.blockUser(actionMaster.value.id)
    else if (confirmAction.value === 'unblock') await adminApi.unblockUser(actionMaster.value.id)
    else await adminApi.deleteUser(actionMaster.value.id)
    confirmDialog.value = false
    await fetchMasters()
  } catch {}
  finally { actionLoading.value = false; actionTarget.value = null }
}

onMounted(fetchMasters)
</script>

