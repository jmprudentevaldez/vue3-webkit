<template>
  <div class="px-1.5 text-center font-light leading-relaxed">
    <div class="mb-4 flex justify-end text-theme-muted lg:mb-0">
      <cf-button :id="getId('logout-button')" class="text-xs" @click="handleLogout">
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-power-off" class="mr-1.5"></font-awesome-icon>
        </template>
        <span class="uppercase">Logout</span>
      </cf-button>
    </div>
    <div class="mb-6 flex justify-center">
      <mailbox-graphic class="h-40 sm:h-52 lg:h-60" />
    </div>

    <h1 class="text-xl lg:text-2xl">Almost, there! Please verify your email</h1>
    <cf-horizontal-separator class="my-4" />
    <p class="text-sm leading-relaxed lg:text-base">
      We've sent a verification link to
      <span class="mx-1 font-medium leading-relaxed underline underline-offset-4">{{
        auth.authenticatedUser?.email
      }}</span>
      to verify your email address and activate your account.
    </p>
    <p class="mt-4 text-sm leading-relaxed lg:text-base">
      The link in the email will expire in 1 hour. You may need to check your spam folder if you can't find the email in
      your inbox.
    </p>
    <div class="mt-6 flex flex-col items-center justify-center text-sm leading-relaxed lg:text-base">
      <p>Still can't find the stupid email?</p>
      <cf-button
        :id="getId('verify-email-guard-page')"
        class="mt-4 bg-theme-primary font-normal text-theme-inverted"
        :disabled="sendEmailButtonIsLocked"
        :is-loading="isLoading"
        @click="handleResendEmailVerification"
      >
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-paper-plane" class="mr-2" />
        </template>
        Resend email
      </cf-button>
      <p v-if="sendEmailButtonIsLocked" class="mt-3 text-xs italic text-theme-muted lg:text-sm">
        You can send again after <span class="font-bold">{{ sendEmailButtonTimer }}</span> seconds
      </p>
    </div>
  </div>
</template>

<script setup>
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import MailboxGraphic from '@/components/email-verification/MailboxGraphic.vue'
import { useAuthStore } from '@/stores/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onUnmounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { useRouter } from 'vue-router'

const getId = usePrependOrAppendOnce('views-misc-verify-email-guard-page')

const auth = useAuthStore()
const isLoading = ref(false)
const globalStore = useGlobalStore()
const sendEmailButtonIsLocked = ref(false)
const sendEmailButtonTimer = ref(45)
let emailButtonLockTimerId = null

const resetSendEmailButtonLock = () => {
  clearInterval(emailButtonLockTimerId)
  sendEmailButtonIsLocked.value = false
  sendEmailButtonTimer.value = 45
}

const handleResendEmailVerification = async () => {
  isLoading.value = true
  const success = await auth.resendEmailVerification()
  isLoading.value = false

  if (!success) return false

  globalStore.pushToastMessage({
    title: 'Email verification sent',
    description: "We've sent you another email verification",
    timeout: 6000,
    type: 'success',
    iconClass: 'fa-solid fa-paper-plane',
  })

  // Lock the button for 45 seconds
  sendEmailButtonIsLocked.value = true
  emailButtonLockTimerId = setInterval(async () => {
    sendEmailButtonTimer.value -= 1
    if (sendEmailButtonTimer.value <= 0) {
      resetSendEmailButtonLock()
    }
  }, 1000)
}

onUnmounted(() => {
  resetSendEmailButtonLock()
})

const router = useRouter()
const handleLogout = async () => {
  await auth.logout()
  await router.replace({ name: 'login' })
}
</script>
