<template>
  <DashboardLayout>
    <div class="page-content">
      <PageHeader title="My reviews" subtitle="Reviews you have left for masters" />

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div v-if="reviews.length" style="display: flex; flex-direction: column; gap: 10px;">
          <div v-for="r in reviews" :key="r.id" class="card card-pad">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <div style="font-weight: 600; font-size: 14px;">{{ r.masterName }}</div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">{{ r.serviceName }}</div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                <StarRating :model-value="r.rating" :size="14" />
                <div style="font-size: 11px; color: var(--text-subtle);">{{ formatDate(r.createdAt) }}</div>
              </div>
            </div>
            <div v-if="r.comment" style="font-size: 13px; line-height: 1.6; color: var(--text);">{{ r.comment }}</div>
          </div>
        </div>
        <EmptyState v-else icon="star" title="No reviews yet" description="After completing an appointment you can leave a review for the master." />
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StarRating from '@/components/StarRating.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import { clientsApi, type ClientReview } from '@/api/clients'
import { formatDate } from '@/utils/dateUtils'

const reviews = ref<ClientReview[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    reviews.value = await clientsApi.getMyReviews()
  } catch {
    reviews.value = []
  } finally {
    loading.value = false
  }
})
</script>
