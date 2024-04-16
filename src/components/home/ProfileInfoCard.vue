<template>
  <div
    class="group relative flex flex-col rounded-2xl bg-theme-section transition-all duration-200 hover:cursor-pointer md:mx-0 md:hover:scale-105"
  >
    <div class="h-16 w-full rounded-t-2xl bg-theme-section-hover"></div>
    <div class="relative mb-4 flex w-full flex-col rounded-2xl bg-theme-section">
      <cf-avatar
        :height="32"
        :width="32"
        :src="authStore.authenticatedUser?.user_profile?.profile_picture_url"
        :fake="!authStore.authenticatedUser?.user_profile?.profile_picture_url"
        class="absolute inset-x-0 -top-10 flex justify-center text-2xl"
      ></cf-avatar>
      <p class="mb-2 mt-28 uppercase text-theme-primary">{{ authStore.authenticatedUser?.user_profile?.full_name }}</p>
      <p class="mb-6 px-5 text-sm text-theme-muted md:mb-2">{{ authStore.authFullAddress }}</p>
    </div>
    <cf-button
      :id="getId('profile-info-card-button')"
      class="absolute top-0 hidden h-full w-full rounded-2xl group-hover:block"
      @click="$router.push({ name: 'profile' })"
    >
    </cf-button>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth.js'
import CfAvatar from '@/components/campfire/CfAvatar.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('components-home-profile-info-card')
const authStore = useAuthStore()
</script>
