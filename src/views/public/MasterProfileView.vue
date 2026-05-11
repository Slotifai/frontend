<template>
  <PublicLayout>
    <div style="padding: 24px 40px;">
      <div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">
        <router-link to="/masters" style="color: var(--text-muted); text-decoration: none;">{{ t('nav.findMasters') }}</router-link>
        <AppIcon name="chevron-right" :size="12" />
        <span style="color: var(--text);">{{ master?.name ?? '…' }}</span>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="master" style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start;">
        <div>
          <div class="card" style="padding: 24px; margin-bottom: 0; display: flex; gap: 20px;">
            <div style="width: 120px; height: 120px; border-radius: 12px; background-image: repeating-linear-gradient(135deg, #ECEDF0 0 8px, #F5F6F8 8px 16px); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <AppAvatar :name="master.name" size="lg" :tone="avatarTone" />
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-size: 22px; font-weight: 600;">{{ master.name }}</div>
                  <div style="color: var(--text-muted); margin-top: 2px;">
                    {{ master.specialization }}
                    <span v-if="master.experience"> · {{ master.experience }}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                    <StarRating :model-value="Math.round(master.rating)" :size="15" />
                    <span style="font-weight: 600;">{{ master.rating.toFixed(1) }}</span>
                    <span style="color: var(--text-muted);">· {{ master.reviewCount }} reviews</span>
                    <span v-if="master.bookingCount" style="color: var(--text-muted);">· {{ master.bookingCount }} bookings</span>
                  </div>
                </div>
              </div>
              <div v-if="master.tags?.length" style="display: flex; gap: 6px; margin-top: 14px; flex-wrap: wrap;">
                <span v-for="tag in master.tags" :key="tag" class="chip">{{ tag }}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; border-bottom: 1px solid var(--border); margin-top: 0;">
            <div
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :style="{
                padding: '12px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }"
            >{{ tab.label }}</div>
          </div>
          <div v-if="activeTab === 'services'" class="card" style="border-top: none; border-top-left-radius: 0; border-top-right-radius: 0;">
            <LoadingSpinner v-if="loadingServices" />
            <template v-else>
              <div
                v-for="(s, i) in services"
                :key="s.id"
                :style="{
                  padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: i < services.length - 1 ? '1px solid var(--divider)' : 'none',
                }"
              >
                <div>
                  <div style="font-weight: 500;">{{ s.name }}</div>
                  <div style="color: var(--text-muted); font-size: 12px; margin-top: 2px;">{{ s.durationMinutes }} min</div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-weight: 600;">{{ s.price }} ₴</span>
                  <v-btn size="small" variant="tonal" color="primary" @click="bookService(s.id)">Select</v-btn>
                </div>
              </div>
              <EmptyState v-if="!services.length" icon="scissors" :title="t('masters.noServices')" description="" />
            </template>
          </div>
          <div v-if="activeTab === 'reviews'" style="margin-top: 0; display: flex; flex-direction: column; gap: 10; padding-top: 16px;">
            <LoadingSpinner v-if="loadingReviews" />
            <template v-else>
              <div v-for="r in reviews" :key="r.id" class="card card-pad">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <AppAvatar :name="r.clientName" size="sm" tone="rose" />
                    <div>
                      <div style="font-weight: 500; font-size: 13px;">{{ r.clientName }}</div>
                      <div style="color: var(--text-subtle); font-size: 11px;">{{ formatDate(r.createdAt) }}</div>
                    </div>
                  </div>
                  <StarRating :model-value="r.rating" :size="13" />
                </div>
                <div v-if="r.comment" style="font-size: 13px; line-height: 1.5;">{{ r.comment }}</div>
              </div>
              <EmptyState v-if="!reviews.length" icon="star" :title="t('masters.noReviews')" description="" />
              <div v-if="reviewTotal > reviewLimit" style="display: flex; justify-content: center; margin-top: 16px;">
                <AppPagination :page="reviewPage" :limit="reviewLimit" :total="reviewTotal" @update:page="loadReviewPage" />
              </div>
            </template>
          </div>
          <div v-if="activeTab === 'about'" style="padding: 20px 0;">
            <div class="card card-pad">
              <div style="font-size: 14px; line-height: 1.7; color: var(--text);">
                {{ master.notes || t('masters.noAbout') }}
              </div>
              <div v-if="master.phone" style="display: flex; align-items: center; gap: 10px; margin-top: 16px; color: var(--text-muted); font-size: 13px;">
                <AppIcon name="phone" :size="14" />
                {{ master.phone }}
              </div>
            </div>
          </div>
        </div>
        <aside>
          <div class="card card-pad" style="position: sticky; top: 20px;">
            <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">Book with {{ master.name.split(' ')[0] }}</div>
            <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 16px;">Choose a service to get started</div>

            <div class="sl-divider" style="margin: 8px 0;" />
            <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 10px 0; border-bottom: 1px solid var(--divider);">
              <span style="color: var(--text-muted);">{{ t('masters.rating') }}</span>
              <span style="font-weight: 500;">{{ master.rating.toFixed(1) }} / 5.0</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 10px 0; border-bottom: 1px solid var(--divider);">
              <span style="color: var(--text-muted);">{{ t('masters.reviews') }}</span>
              <span style="font-weight: 500;">{{ master.reviewCount }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 10px 0;">
              <span style="color: var(--text-muted);">{{ t('masters.cancellation') }}</span>
              <span style="font-weight: 500;">{{ t('masters.cancellationValue') }}</span>
            </div>

            <v-btn color="primary" block style="margin-top: 12px;" @click="router.push(`/masters/${route.params.id}/book`)">
              {{ t('masters.bookNow') }}
            </v-btn>
          </div>
        </aside>
      </div>

      <EmptyState v-else icon="user" :title="t('masters.notFoundPage')" :description="t('masters.notFoundPageDesc')">
        <router-link to="/masters"><v-btn color="primary" size="small">{{ t('masters.backToCatalog') }}</v-btn></router-link>
      </EmptyState>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AppIcon from '@/components/AppIcon.vue'
import AppAvatar from '@/components/AppAvatar.vue'
import StarRating from '@/components/StarRating.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import AppPagination from '@/components/AppPagination.vue'
import { mastersApi, type Master, type MasterService, type Review } from '@/api/masters'
import { TONES } from '@/utils/avatarTones'
import { formatDate } from '@/utils/dateUtils'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const masterId = computed(() => route.params.id as string)

const master = ref<Master | null>(null)
const loading = ref(false)

const services = ref<MasterService[]>([])
const loadingServices = ref(false)

const reviews = ref<Review[]>([])
const reviewTotal = ref(0)
const reviewPage = ref(1)
const reviewLimit = 5
const loadingReviews = ref(false)

const activeTab = ref('services')
const tabs = computed(() => [
  { key: 'services', label: t('masters.services') },
  { key: 'reviews', label: t('masters.reviews') },
  { key: 'about', label: t('masters.about') },
])

const avatarTone = computed(() => {
  if (!master.value) return 'primary'
  return TONES[master.value.name.charCodeAt(0) % TONES.length]
})


async function loadReviewPage(p: number) {
  reviewPage.value = p
  loadingReviews.value = true
  try {
    const result = await mastersApi.getReviews(masterId.value, { page: p, limit: reviewLimit })
    reviews.value = result.data
    reviewTotal.value = result.total
  } catch { reviews.value = [] }
  finally { loadingReviews.value = false }
}

function bookService(serviceId: string) {
  router.push({ path: `/masters/${masterId.value}/book`, query: { serviceId } })
}

onMounted(async () => {
  loading.value = true
  loadingServices.value = true
  try {
    const [m, s] = await Promise.all([
      mastersApi.get(masterId.value),
      mastersApi.getServices(masterId.value),
    ])
    master.value = m
    services.value = s
  } catch {
    master.value = null
  } finally {
    loading.value = false
    loadingServices.value = false
  }
  await loadReviewPage(1)
})
</script>
