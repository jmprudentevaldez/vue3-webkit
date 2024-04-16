<template>
  <div class="mx-auto max-w-6xl">
    <!-- Start Breadcrumbs -->
    <cf-breadcrumbs
      :links="[
        { name: 'home', label: 'Home' },
        { name: 'notifications', label: 'Notifications', current: true },
      ]"
    >
    </cf-breadcrumbs>
    <!-- End Breadcrumbs -->
    <div class="my-4 mt-10 flex flex-col items-center justify-start italic text-theme-muted">
      <font-awesome-icon icon="fa-solid fa-book-open" class="mb-2 h-6" />
      You don't have any new notifications right now
    </div>
  </div>
</template>
<script setup>
import CfBreadcrumbs from '@/components/campfire/CfBreadcrumbs.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>
