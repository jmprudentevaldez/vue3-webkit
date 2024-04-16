<template>
  <div>
    <div class="mb-6 flex justify-end text-theme-muted lg:mb-4">
      <cf-button :id="getId('logout-button')" class="text-xs" @click="handleLogout">
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-power-off" class="mr-1.5"></font-awesome-icon>
        </template>
        <span class="uppercase">Logout</span>
      </cf-button>
    </div>
    <div class="mx-auto max-w-4xl px-1.5 text-center font-light leading-relaxed">
      <tab-group manual :selected-index="selectedTab">
        <tab-list class="flex space-x-1 rounded-xl bg-theme-section p-1">
          <tab v-for="tab in tabs" :key="tab.label" v-slot="{ selected }" as="template">
            <button
              :id="getId(`tab-${tab.label}-button`)"
              :class="[
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section',
                selected ? 'bg-theme-primary text-theme-inverted shadow' : 'text-theme-base hover:cursor-not-allowed',
              ]"
            >
              <font-awesome-icon :icon="tab.icon" class="mr-2"></font-awesome-icon>
              <span>{{ tab.label }}</span>
            </button>
          </tab>
        </tab-list>
        <tab-panels>
          <tab-panel class="mt-2 md:mt-8">
            <verify-account-graphic class="mx-auto mb-0 w-80 md:mb-8 md:w-full" />
            <p class="mt-4">You will need to set-up your profile information and change your password</p>
            <div class="mt-4 flex justify-center">
              <cf-button
                :id="getId('continue-to-profile-setup-button')"
                class="bg-theme-primary text-sm text-theme-inverted"
                :is-loading="isLoading"
                @click="handleMoveToUpdateProfile"
              >
                <template #icon>
                  <font-awesome-icon icon="fa-solid fa-circle-right" class="mr-1"></font-awesome-icon>
                </template>
                <span class="font-medium">Continue</span>
              </cf-button>
            </div>
          </tab-panel>
          <tab-panel>
            <verify-profile @profile-updated="handleProfileUpdated" />
          </tab-panel>
          <tab-panel>
            <change-tmp-password @password-changed="handlePasswordChanged" />
          </tab-panel>
        </tab-panels>
      </tab-group>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import VerifyAccountGraphic from '@/components/verify-account-page/VerifyAccountGraphic.vue'
import VerifyProfile from '@/components/verify-account-page/VerifyProfile.vue'
import { useGlobalStore } from '@/stores/global.js'
import ChangeTmpPassword from '@/components/verify-account-page/ChangeTmpPassword.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const getId = usePrependOrAppendOnce('views-misc-verify-account-page')

onMounted(async () => {
  if (authStore.isAuthenticated) return

  await router.push({
    name: 'login',
    query: {
      from_account_verification: 1,
      id: route.params.id,
      hash: route.params.hash,
      signature: route.query.signature,
      expires: route.query.expires,
      email: route.query.email,
    },
  })
})

const handleLogout = async () => {
  await authStore.logout()
  await router.replace({ name: 'login' })
}

const tabs = ref([
  { label: 'Instructions', icon: 'fa-solid fa-1' },
  { label: 'Update Profile', icon: 'fa-solid fa-2' },
  { label: 'Change Password', icon: 'fa-solid fa-3' },
])

const selectedTab = ref(0)
const isLoading = ref(false)

const globalStore = useGlobalStore()
const handleMoveToUpdateProfile = async () => {
  isLoading.value = true

  // We verify the email
  const res = await authStore.verifyEmail({
    id: route.params.id,
    hash: route.params.hash,
    signature: route.query.signature,
    expires: route.query.expires,
  })

  isLoading.value = false

  if (!res.success) {
    return globalStore.pushToastMessage({
      title: 'Verification Email',
      description: "The verification link you've clicked is no longer valid",
      timeout: 6000,
      type: 'error',
      iconClass: 'fa-solid fa-circle-xmark',
    })
  }
  selectedTab.value = 1
}

const handleProfileUpdated = () => {
  selectedTab.value = 2
}

const handlePasswordChanged = async () => {
  globalStore.pushToastMessage({
    title: 'Verify Account',
    description: 'Account Verification Completed',
    timeout: 6000,
    type: 'success',
    iconClass: 'fa-solid fa-circle-check',
  })

  await router.replace({ name: 'home' })
}
</script>
