<template>
  <div>
    <div v-if="isLoading" class="mx-1.5 mt-8 flex flex-col justify-center sm:mt-28">
      <div class="flex justify-center text-theme-primary">
        <font-awesome-icon icon="fa-solid fa-scroll" class="mr-2 h-12 animate-bounce" />
        <font-awesome-icon icon="fa-solid fa-key" class="h-12 animate-bounce" />
      </div>
      <p class="mt-3 text-center">
        <font-awesome-icon icon="fa-solid fa-spinner" class="mr-1 animate-spin" />
        We're verifying your email, please don't close this page...
      </p>
    </div>
    <div v-if="showErrorAlert" class="mx-1.5 mt-8 flex flex-col justify-center sm:mt-28">
      <div class="flex justify-center text-theme-primary">
        <font-awesome-icon icon="fa-solid fa-xmark-circle" class="h-12" />
      </div>
      <p class="mt-3 text-center">
        Sorry, the validation link is no longer valid.
        <br />
        Please check the <span class="text-theme-primary underline underline-offset-4">most recent</span>
        verification mail in your inbox.
      </p>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSleep } from '@/composables/helpers'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const showErrorAlert = ref(false)
const auth = useAuthStore()

// Start verification process
onMounted(async () => {
  isLoading.value = true

  const res = await auth.verifyEmail({
    id: route.params.id,
    hash: route.params.hash,
    signature: route.query.signature,
    expires: route.query.expires,
  })

  await useSleep(3)

  isLoading.value = false

  // Handle General Errors
  if (!res.success) {
    return (showErrorAlert.value = true)
  }

  // Finally go to the success page
  await router.replace({ name: 'email-verification-success' })
})
</script>
