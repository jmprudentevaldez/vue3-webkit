<template>
  <!-- Start Error alert -->
  <transition
    enter-active-class="transition duration-200"
    enter-from-class="scale-50 opacity-0"
    leave-to-class="opacity-0"
  >
    <cf-alert-panel
      :id="getId('error-alert-panel')"
      v-model="showErrorAlert"
      :dismiss-button-id="getId('dismiss-error-alert-button')"
      dismissible
      class="z-30 mb-4 w-full"
      panel-type="error"
    >
      {{ errorMessage }}
      <template #description>
        <div class="flex flex-col">
          <div v-for="error in errorDetails" :key="error" class="mt-0.5">{{ error }}</div>
        </div>
      </template>
    </cf-alert-panel>
  </transition>
  <!-- End Error alert -->
  <!-- Start old password -->
  <div class="flex flex-col sm:flex-row">
    <div class="w-full sm:mr-2 sm:w-[49%]">
      <cf-text-input
        :id="getId('old-password-input')"
        v-model="payload.old_password"
        name="old_password"
        label="Old Password"
        type="password"
        text-classes="text-sm"
        :invalid="validator.old_password.$invalid"
        :invalid-text="validator.old_password.$invalid ? validator.old_password.$errors[0].$message : null"
        @blur="validator.old_password.$touch"
      ></cf-text-input>
    </div>
  </div>
  <!-- End old password -->
  <!-- Start password and confirmation -->
  <div class="flex flex-col sm:flex-row">
    <div class="w-full sm:mr-2">
      <cf-text-input
        :id="getId('password-input')"
        v-model="payload.password"
        name="password"
        label="Password"
        type="password"
        text-classes="text-sm"
        :invalid="validator.password.$invalid"
        :invalid-text="validator.password.$invalid ? validator.password.$errors[0].$message : null"
        @blur="validator.password.$touch"
      ></cf-text-input>
    </div>
    <div class="w-full sm:ml-2">
      <cf-text-input
        :id="getId('password-confirmation-input')"
        v-model="payload.password_confirmation"
        name="password-confirmation"
        label="Confirm Password"
        type="password"
        text-classes="text-sm"
        :invalid="validator.password_confirmation.$invalid"
        :invalid-text="
          validator.password_confirmation.$invalid ? validator.password_confirmation.$errors[0].$message : null
        "
        @blur="validator.password_confirmation.$touch"
        @keydown.enter.prevent="handleFormSubmission"
      ></cf-text-input>
    </div>
  </div>
  <!-- End password and confirmation-->
  <!-- Start action buttons -->
  <div class="mb-1 mt-8 flex w-full justify-end lg:mt-8">
    <cf-button
      :id="getId('register-button')"
      class="w-[35%] bg-theme-primary text-sm text-theme-inverted lg:w-auto lg:px-10"
      :is-loading="isLoading"
      @click="handleFormSubmission"
    >
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-paper-plane" class="mr-1.5 h-3 w-3 font-light" />
      </template>
      Submit
    </cf-button>
  </div>
  <!-- End action buttons -->
</template>
<script setup>
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { computed, reactive, ref } from 'vue'
import { helpers, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import { usePasswordRule } from '@/composables/custom-validations.js'
import { useVuelidate } from '@vuelidate/core'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useParseApiResponseError } from '@/composables/error-handler.js'
import { useProfileStore } from '@/stores/profile.js'
import { useGlobalStore } from '@/stores/global.js'

const getId = usePrependOrAppendOnce('components-profile-change-password-form')

const payload = reactive({
  old_password: null,
  password: null,
  password_confirmation: null,
})

// Handle validation
const formRules = {
  $lazy: true,
  old_password: {
    required: helpers.withMessage('Please enter your old password', required),
  },
  password: {
    required: helpers.withMessage('Please enter new your password', required),
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

const validator = useVuelidate(formRules, payload)
const profileStore = useProfileStore()
const showErrorAlert = ref(false)
const errorMessage = ref(null)
const errorDetails = ref([])
const isLoading = ref(false)
const globalStore = useGlobalStore()
const handleFormSubmission = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return

  isLoading.value = true

  const response = await profileStore.changePassword(payload)

  if (!response.success) {
    const { message, errors } = useParseApiResponseError(response)
    showErrorAlert.value = true
    errorMessage.value = message
    errorDetails.value = errors
    return (isLoading.value = false)
  }

  globalStore.pushToastMessage({
    title: 'Change password',
    description: 'You have successfully updated your password',
    timeout: 6000,
    type: 'success',
    iconClass: 'fa-solid fa-circle-check',
  })

  isLoading.value = false
  clearForm()
}

const clearForm = () => {
  payload.old_password = null
  payload.password = null
  payload.password_confirmation = null
  validator.value.$reset()
  showErrorAlert.value = false
}
</script>
