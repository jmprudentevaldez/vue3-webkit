<template>
  <!-- Start alert -->
  <transition
    enter-active-class="transition duration-200"
    enter-from-class="scale-50 opacity-0"
    leave-to-class="opacity-0"
  >
    <cf-alert-panel
      v-model="showErrorAlert"
      dismissible
      :dismiss-button-id="getId('alert-dismiss-button')"
      class="z-30 mb-4 w-full"
      panel-type="error"
    >
      Incorrect credentials
      <template #description> Please double check your email/mobile number and password</template>
    </cf-alert-panel>
  </transition>
  <!-- End alert -->
  <div v-if="!showErrorAlert">
    <p class="font-bold">Welcome back!</p>
    <p class="mt-1 text-sm text-theme-muted">
      You're free to use your email address or mobile number for signing in your accou                              t
    </p>
  </div>
  <form id="login-page-form" autocomplete="off" class="flex h-full w-full flex-col justify-between" @submit.prevent>
    <div class="flex flex-col">
      <div class="w-full">
        <cf-text-input
          :id="getId('email-mobile-input')"
          v-model="payload.email"
          :invalid="validator.email.$invalid"
          :invalid-text="validator.email.$invalid ? validator.email.$errors[0].$message : null"
          name="email"
          label="Email or mobile number"
          text-classes="text-sm"
          @blur="validator.email.$touch"
        ></cf-text-input>
      </div>
      <div class="w-full">
        <cf-text-input
          :id="getId('password-input')"
          v-model="payload.password"
          name="password"
          label="Password"
          type="password"
          text-classes="text-sm"
          :invalid="validator.password.$invalid"
          :invalid-text="validator.password.$invalid ? validator.password.$errors[0].$message : null"
          @keydown.enter.prevent="handleFormSubmit"
          @blur="validator.password.$touch"
        ></cf-text-input>
      </div>
    </div>
    <!-- Start action buttons -->
    <div class="mb-1 mt-6 flex w-full justify-between">
      <cf-button
        :id="getId('forgot-password-button')"
        class="bg-transparent text-sm italic hover:bg-theme-section-hover"
        @click="router.push({ name: 'forgot-password' })"
      >
        I forgot my password
      </cf-button>
      <cf-button
        :id="getId('login-button')"
        class="w-[35%] bg-theme-primary text-sm text-theme-inverted sm:w-[30%] lg:w-[25%]"
        :is-loading="isLoading"
        loading-text="Loading..."
        @click="handleFormSubmit"
      >
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-1.5 h-3 w-3 font-light" />
        </template>
        Login
      </cf-button>
    </div>
    <!-- End action buttons -->
  </form>
</template>

<script setup>
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import { usePrependOrAppendOnce, useIsValidMobileNumber } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('components-authentication-page-login-form')
const route = useRoute()

const payload = reactive({
  email: route.query.email || '',
  password: '',
})

// Handle form validation
const formRules = {
  $lazy: true,
  email: {
    required: helpers.withMessage('Email address or mobile number required', required),
  },
  password: {
    required: helpers.withMessage('Please enter your password', required),
  },
}

const isLoading = ref(false)
const validator = useVuelidate(formRules, payload)

// Handle form submission
const showErrorAlert = ref(false)
const router = useRouter()

const handleFormSubmit = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return

  isLoading.value = true
  const body = manageIfEmailIsPhoneNumber(Object.assign({}, payload))
  const auth = useAuthStore()
  const response = await auth.login(body)
  isLoading.value = false

  if (response.success) {
    // Handle route redirection from account verification page
    if (route.query.from_account_verification) {
      return await router.replace({
        name: 'verify-account',
        params: {
          id: route.query.id,
          hash: route.query.hash,
        },
        query: {
          expires: route.query.expires,
          signature: route.query.signature,
        },
      })
    }

    if (auth.authenticatedUser.email_verified_at) return await router.replace({ name: 'home' })
    else return await router.replace({ name: 'verify-email-guard' })
  }

  console.log("errrr")

  showErrorAlert.value = true
}

const manageIfEmailIsPhoneNumber = (payload) => {
  if (useIsValidMobileNumber(payload.email)) {
    payload.mobile_number = payload.email
    delete payload.email
  }
  return payload
}
</script>
