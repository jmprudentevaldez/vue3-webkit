<template>
  <div class="mx-auto max-w-6xl px-2 md:px-0">
    <div class="mx-auto mt-5 grid w-full gap-6 text-center italic md:grid-cols-2 lg:grid-cols-3">
      <profile-info-card class="col" />
      <latest-announcement-card class="col" />
    </div>
  </div>
</template>

<script setup>
import ProfileInfoCard from '@/components/home/ProfileInfoCard.vue'
import LatestAnnouncementCard from '@/components/home/LatestAnnouncementCard.vue'
</script>
