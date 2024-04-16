<template>
  <div class="mx-auto mt-8 flex w-[95%] max-w-3xl flex-col items-center justify-center">
    <div class="flex w-full items-center justify-between">
      <app-logo
        class="text-2xl transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
        @click="router.push({ name: 'home' })"
      >
      </app-logo>
      <cf-button :id="getId('back-to-login-link')" @click="router.push({ name: 'login' })">
        <small class="font-sm italic">Back to Login</small>
      </cf-button>
    </div>
    <div class="align-center mt-6 flex w-full flex-col rounded-2xl bg-theme-section p-6 md:p-12">
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
          class="z-30 mb-4"
          panel-type="error"
        >
          Unable to reset your password
          <template #description>
            The link has either expired, so please double check your inbox, or you've entered an incorrect email
          </template>
        </cf-alert-panel>
      </transition>
      <!-- End alert -->
      <form id="forgot-password-form-page" autocomplete="off" @submit.prevent>
        <h1 class="text-lg tracking-wider sm:text-xl">RESET YOUR PASSWORD</h1>
        <p class="text-muted mb-4 mt-1 text-sm leading-relaxed sm:mt-3 lg:mb-0">
          Please enter the email you've used to request this link and input your new password
        </p>
        <cf-text-input
          :id="getId('email-input')"
          v-model="payload.email"
          label="Email"
          name="email"
          class="mt-1"
          :invalid="validator.email.$invalid"
          text-classes="text-sm"
          :invalid-text="validator.email.$errors[0]?.$message"
          @blur="validator.email.$touch"
        ></cf-text-input>
        <cf-text-input
          :id="getId('password-input')"
          v-model="payload.password"
          label="Password"
          name="password"
          type="password"
          class="mt-1"
          text-classes="text-sm"
          :invalid="validator.password.$invalid"
          :invalid-text="validator.password.$errors[0]?.$message"
          @blur="validator.password.$touch"
        ></cf-text-input>
        <cf-text-input
          :id="getId('password-confirmation-input')"
          v-model="payload.password_confirmation"
          label="Confirm password"
          name="password_confirmation"
          type="password"
          class="mt-1"
          text-classes="text-sm"
          :invalid="validator.password_confirmation.$invalid"
          :invalid-text="validator.password_confirmation.$errors[0]?.$message"
          @blur="validator.password_confirmation.$touch"
          @keydown.enter.prevent="handleFormSubmit"
        ></cf-text-input>
        <div class="flex justify-end">
          <div class="flex w-full flex-col sm:w-auto">
            <cf-button
              :id="getId('password-reset-button')"
              :is-loading="isLoading"
              class="mt-6 w-full bg-theme-primary text-sm text-theme-inverted sm:w-auto"
              @click="handleFormSubmit"
            >
              <template #icon>
                <font-awesome-icon icon="fa-solid fa-paper-plane" class="mr-2" />
              </template>
              Reset Password
            </cf-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import AppLogo from '@/components/AppLogo.vue'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter, useRoute } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import { email, helpers, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import { usePasswordRule } from '@/composables/custom-validations.js'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('views-reset-password-page')
const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()
const authStore = useAuthStore()

const payload = reactive({
  email: '',
  password: '',
  password_confirmation: '',
})

const formRules = {
  $lazy: true,
  email: {
    required: helpers.withMessage('Please enter your email address', required),
    email: helpers.withMessage('Please enter a valid email address', email),
  },
  password: {
    required: helpers.withMessage('Please enter your password', required),
    minLength: helpers.withMessage('Must be at least 8 characters long', minLength(8)),
    maxLength: helpers.withMessage('Must be a maximum of 50 characters', maxLength(50)),
    password: helpers.withMessage(
      'Must include at least one number, and one uppercase and lowercase letter',
      usePasswordRule()
    ),
  },
  password_confirmation: {
    required: helpers.withMessage('Please confirm your password', required),
    sameAsPassword: helpers.withMessage('Must match the password field', sameAs(computed(() => payload.password))),
  },
}

const isLoading = ref(false)
const validator = useVuelidate(formRules, payload)

// Handle form submission
const showErrorAlert = ref(false)

const handleFormSubmit = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return

  isLoading.value = true
  const response = await authStore.resetPassword({
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.password_confirmation,
    token: route.query.token,
  })
  isLoading.value = false

  // If it's a validation error, then the email is incorrect (or someone is trying to guess an email)
  if (!response.success) {
    return (showErrorAlert.value = true)
  }

  globalStore.pushToastMessage({
    title: 'Password Reset',
    description: "You've successfully changed your password",
    timeout: 10000,
    type: 'success',
    iconClass: 'fa-solid fa-check-circle',
  })

  showErrorAlert.value = false

  await router.replace({ name: 'login' })
}
</script>

<style scoped></style>
