<template>
  <div class="mx-auto max-w-6xl">
    <!-- Start Breadcrumbs -->
    <cf-breadcrumbs
      :links="[
        { name: 'home', label: 'Home' },
        { name: 'profile', label: 'My Profile', current: true },
      ]"
    >
    </cf-breadcrumbs>
    <!-- End Breadcrumbs -->
    <!-- Start profile header -->
    <div class="mt-6 rounded-xl bg-theme-section p-6 lg:p-8">
      <!-- Start avatar upload -->
      <div class="relative flex flex-col">
        <div class="flex w-full flex-col md:flex-row">
          <cf-avatar-file-input />
          <!-- Start name and address -->
          <div class="mt-2 flex flex-col justify-center md:mb-6 md:mt-0 md:pl-6 lg:mb-0 lg:pl-8">
            <h1 class="text-center text-lg md:text-left md:text-xl lg:text-2xl">
              {{ authStore.authenticatedUser?.user_profile?.full_name }}
            </h1>
            <p
              v-if="authStore.authFullAddress"
              class="mt-1 text-center text-xs leading-relaxed tracking-wide md:text-left md:text-base md:text-sm md:font-light"
            >
              {{ authStore.authFullAddress }}
            </p>
          </div>
          <!-- End name and address -->
        </div>
        <!-- Start tabs -->
        <cf-horizontal-separator class="mt-6 md:hidden" />
        <div
          class="mb-2 mt-6 flex justify-center text-sm md:absolute md:bottom-0 md:right-0 md:mb-0 md:mt-0 md:justify-end"
        >
          <button
            :class="`mr-6 rounded-lg px-1 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section ${
              profileInfoShown ? 'text-theme-primary underline underline-offset-8' : ''
            }`"
            @click="toggleTabs"
          >
            Profile Details
          </button>
          <button
            :class="`mr-6 rounded-lg px-1 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section ${
              !profileInfoShown ? 'text-theme-primary underline underline-offset-8' : ''
            }`"
            @click="toggleTabs"
          >
            Change Password
          </button>
        </div>
        <!-- End tabs -->
      </div>
      <!-- End avatar upload -->
    </div>
    <!-- End profile header -->
    <transition
      enter-active-class="transition duration-300"
      enter-from-class="translate-y-[20%] opacity-0"
      leave-to-class="opacity-0"
    >
      <!-- Start profile info -->
      <template v-if="profileInfoShown">
        <div class="mt-4 rounded-xl bg-theme-section p-6 lg:p-8">
          <update-profile-form />
        </div>
      </template>
      <!-- End profile info -->
      <!-- Start change password -->
      <template v-else>
        <div class="mt-4 rounded-xl bg-theme-section p-6 lg:p-8">
          <change-password-form />
        </div>
      </template>
      <!-- End change password -->
    </transition>
  </div>
</template>

<script setup>
import CfBreadcrumbs from '@/components/campfire/CfBreadcrumbs.vue'
import CfAvatarFileInput from '@/components/campfire/inputs/CfAvatarFileInput.vue'
import { useAuthStore } from '@/stores/auth.js'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import { onBeforeMount, ref } from 'vue'
import UpdateProfileForm from '@/components/profile/UpdateProfileForm.vue'
import { useProfileStore } from '@/stores/profile.js'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const profileInfoShown = ref(true)

const toggleTabs = () => {
  profileInfoShown.value = !profileInfoShown.value
}

onBeforeMount(async () => {
  await profileStore.fetchProfile()
})
</script>
