<template>
  <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg);">
    <div style="text-align:center; padding:40px;">
      <div style="font-size:80px; font-weight:700; color:var(--primary); line-height:1;">404</div>
      <div style="font-size:22px; font-weight:600; margin:16px 0 8px;">Page not found</div>
      <div style="color:var(--text-muted); margin-bottom:24px;">The page you're looking for doesn't exist.</div>
      <v-btn color="primary" @click="router.back()">Go back</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
