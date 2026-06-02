<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader :title="t('masterServices.title')" :subtitle="t('masterServices.subtitle')">
        <v-btn color="primary" @click="openCreate">
          <AppIcon name="plus" :size="14" :stroke="2.4" style="margin-right: 6px;" /> {{ t('masterServices.addBtn') }}
        </v-btn>
      </PageHeader>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="card" style="overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th class="th">{{ t('masterServices.colName') }}</th>
                <th class="th" style="width: 120px;">{{ t('masterServices.colDuration') }}</th>
                <th class="th" style="width: 120px;">{{ t('masterServices.colPrice') }}</th>
                <th class="th" style="text-align: right; width: 130px;">{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in services" :key="s.id">
                <td class="td"><div style="font-weight: 500;">{{ s.name }}</div></td>
                <td class="td">{{ s.durationMinutes }} {{ t('common.min') }}</td>
                <td class="td">
                  <span v-if="+s.price === 0" style="color: var(--text-muted);">{{ t('common.free') }}</span>
                  <b v-else>{{ (+s.price).toFixed(2) }} ₴</b>
                </td>
                <td class="td" style="text-align: right;">
                  <v-btn variant="text" size="small" icon @click="openEdit(s)">
                    <AppIcon name="pencil" :size="14" />
                  </v-btn>
                  <v-btn variant="text" size="small" icon color="error" @click="openDelete(s)">
                    <AppIcon name="trash" :size="14" />
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <EmptyState v-if="!services.length" icon="scissors" :title="t('masterServices.noServices')" :description="t('masterServices.noServicesDesc')" />
        </div>
      </template>
    </div>
    <v-dialog v-model="dialog" max-width="440">
      <v-card>
        <v-card-title style="padding: 18px 24px 8px;">{{ editTarget ? t('masterServices.editTitle') : t('masterServices.addTitle') }}</v-card-title>
        <v-card-text style="padding: 0 24px 16px;">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <v-text-field v-model="form.name" :label="t('masterServices.nameLabel')" variant="outlined" density="compact" hide-details="auto" :error-messages="formErrors.name" />
            <div style="display: flex; gap: 12px;">
              <v-text-field v-model.number="form.durationMinutes" :label="t('masterServices.durationLabel')" type="number" variant="outlined" density="compact" hide-details="auto" :error-messages="formErrors.duration" />
              <v-text-field v-model.number="form.price" :label="t('masterServices.priceLabel')" type="number" variant="outlined" density="compact" hide-details="auto" />
            </div>
          </div>
        </v-card-text>
        <v-card-actions style="padding: 12px 16px; background: var(--surface-2); justify-content: flex-end; gap: 8px;">
          <v-btn variant="text" @click="dialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveService">{{ t('masterServices.saveBtn') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmModal
      v-model="deleteDialog"
      :title="t('masterServices.deleteTitle')"
      :message="t('masterServices.deleteDesc', { name: deleteTarget?.name })"
      :confirm-label="t('common.delete')"
      confirm-color="error"
      :loading="deleting"
      @confirm="doDelete"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { masterMeApi } from '@/api/masterMe'
import type { MasterService } from '@/api/masters'

const { t } = useI18n()

const services = ref<MasterService[]>([])
const loading = ref(false)
const dialog = ref(false)
const saving = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)

const editTarget = ref<MasterService | null>(null)
const deleteTarget = ref<MasterService | null>(null)

const form = reactive({ name: '', durationMinutes: 30, price: 0 })
const formErrors = reactive({ name: '', duration: '' })

function openCreate() {
  editTarget.value = null
  form.name = ''
  form.durationMinutes = 30
  form.price = 0
  formErrors.name = ''
  formErrors.duration = ''
  dialog.value = true
}

function openEdit(s: MasterService) {
  editTarget.value = s
  form.name = s.name
  form.durationMinutes = s.durationMinutes
  form.price = s.price
  formErrors.name = ''
  formErrors.duration = ''
  dialog.value = true
}

function openDelete(s: MasterService) {
  deleteTarget.value = s
  deleteDialog.value = true
}

function validate() {
  formErrors.name = form.name.trim() ? '' : t('common.required')
  formErrors.duration = form.durationMinutes > 0 ? '' : t('common.mustBePositive')
  return !formErrors.name && !formErrors.duration
}

async function saveService() {
  if (!validate()) return
  saving.value = true
  try {
    if (editTarget.value) {
      const updated = await masterMeApi.updateService(editTarget.value.id, {
        name: form.name.trim(),
        durationMinutes: form.durationMinutes,
        price: form.price,
      })
      const idx = services.value.findIndex(s => s.id === editTarget.value!.id)
      if (idx !== -1) services.value[idx] = updated
    } else {
      const created = await masterMeApi.createService({
        name: form.name.trim(),
        durationMinutes: form.durationMinutes,
        price: form.price,
      })
      services.value.push(created)
    }
    dialog.value = false
  } catch {}
  finally { saving.value = false }
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await masterMeApi.deleteService(deleteTarget.value.id)
    services.value = services.value.filter(s => s.id !== deleteTarget.value!.id)
    deleteDialog.value = false
  } catch {}
  finally { deleting.value = false }
}

async function fetchServices() {
  loading.value = true
  try {
    services.value = await masterMeApi.getServices()
  } catch {
    services.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchServices)
</script>
