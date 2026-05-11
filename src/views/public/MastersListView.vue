<template>
  <PublicLayout>
    <div style="padding: 32px 40px;">
      <div style="margin-bottom: 20px;">
        <div style="font-size: 24px; font-weight: 600; margin-bottom: 4px;">{{ t('masters.title') }}</div>
        <div style="color: var(--text-muted);">
          {{ total ? t('masters.available', { n: total }) : t('masters.searchPlaceholder') }}
        </div>
      </div>
      <div style="display: flex; gap: 12px; margin-bottom: 16px;">
        <div style="flex: 1; position: relative;">
          <AppIcon
            name="search"
            :size="16"
            color="var(--text-muted)"
            style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none;"
          />
          <input
            v-model="search"
            :placeholder="t('masters.searchPlaceholder')"
            style="width: 100%; height: 44px; padding: 0 14px 0 40px; border-radius: var(--r-sm); border: 1px solid var(--border-strong); background: var(--surface); font-size: 14px; font-family: var(--font-sans); outline: none; color: var(--text);"
            @input="onSearch"
          />
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
        <span
          v-for="key in SPECIALIZATION_KEYS"
          :key="key"
          class="chip"
          :class="{ active: activeSpec === key }"
          style="cursor: pointer; user-select: none;"
          @click="setSpec(key)"
        >{{ t(`masters.specs.${key}`) }}</span>
      </div>
      <LoadingSpinner v-if="loading" />
      <template v-else>
        <div
          v-if="masters.length"
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;"
        >
          <MasterCard
            v-for="m in masters"
            :key="m.id"
            :master="m"
            @book="goBook(m.id)"
            @view="goProfile(m.id)"
          />
        </div>
        <EmptyState
          v-else
          icon="users"
          :title="t('masters.notFound')"
          :description="t('masters.notFoundDesc')"
        />
      </template>
      <PaginationFooter :page="page" :limit="limit" :total="total" @update:page="goPage" />
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AppIcon from '@/components/AppIcon.vue'
import PaginationFooter from '@/components/PaginationFooter.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import MasterCard from './MasterCard.vue'
import { mastersApi, type Master } from '@/api/masters'
import { debounce } from '@/utils/debounce'
import { SPECIALIZATION_KEYS, SPEC_API_VALUE, type SpecializationKey } from '@/constants/specializations'
import { usePaginatedList } from '@/composables/usePaginatedList'

const { t } = useI18n()
const router = useRouter()

const search = ref('')
const activeSpec = ref<SpecializationKey>('all')

const { items: masters, total, page, loading, fetch: fetchMasters, goPage } = usePaginatedList<Master>(
  ({ page, limit }) => mastersApi.list({
    search: search.value || undefined,
    specialization: activeSpec.value !== 'all' ? SPEC_API_VALUE[activeSpec.value] : undefined,
    page,
    limit,
  }),
  12,
)

const onSearch = debounce(() => { page.value = 1; fetchMasters() })

function setSpec(s: SpecializationKey) {
  activeSpec.value = s
  page.value = 1
  fetchMasters()
}

function goProfile(id: string) { router.push(`/masters/${id}`) }
function goBook(id: string) { router.push(`/masters/${id}/book`) }

const limit = 12
onMounted(fetchMasters)
</script>
