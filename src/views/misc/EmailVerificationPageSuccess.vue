<template>
  <div class="mx-1.5 text-center font-light leading-relaxed">
    <div class="mb-6 flex justify-center">
      <email-success-graphic class="h-40 sm:h-52 lg:h-60" />
    </div>

    <h1 class="text-2xl">Verification successful!</h1>
    <template v-if="authStore.isAuthenticated">
      <p class="mt-3">
        You will be redirected to the Home page in <span class="font-bold">{{ timer }}</span> seconds
      </p>
    </template>
    <template v-else>
      <p class="mt-3">
        You will be redirected to the Login page in <span class="font-bold">{{ timer }}</span> seconds
      </p>
    </template>
    <div class="mt-4 flex flex-col items-center justify-center">
      <cf-button
        :id="getId('redirect-now')"
        class="mt-3 bg-theme-primary font-normal text-theme-inverted"
        @click="handleRedirectToTargetPage"
      >
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-house-chimney" class="mr-2" />
        </template>
        Redirect now
      </cf-button>
    </div>
  </div>
</template>

<script setup>
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import EmailSuccessGraphic from '@/views/misc/EmailSuccessGraphic.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { useAuthStore } from '@/stores/auth.js'
import { useProfileStore } from '@/stores/profile.js'

const getId = usePrependOrAppendOnce('views-misc=email-verification-success-page')

const router = useRouter()
const timer = ref(5)
let timerId = null

const authStore = useAuthStore()
const profileStore = useProfileStore()

const handleRedirectToTargetPage = async () => {
  if (authStore.isAuthenticated) {
    await profileStore.fetchProfile()
    return await router.replace({ name: 'home' })
  }

  await router.replace({ name: 'login' })
}

onBeforeMount(() => {
  timerId = setInterval(async () => {
    timer.value -= 1
    if (timer.value <= 0) {
      clearInterval(timerId)
      await handleRedirectToTargetPage()
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timerId))
</script>
