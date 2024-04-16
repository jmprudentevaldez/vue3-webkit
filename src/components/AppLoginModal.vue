<template>
  <transition-root
    :show="dialogIsOpen"
    as="template"
    enter="duration-200 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <main-dialog as="div" class="relative z-20">
      <transition-child
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-theme-tooling bg-opacity-80 backdrop-blur-sm" />
      </transition-child>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="top-32 flex min-h-[70%] items-center justify-center">
          <dialog-panel
            class="w-[93%] max-w-xl rounded-2xl bg-theme-section bg-opacity-80 p-4 text-theme-base shadow-lg ring-1 ring-theme-primary backdrop-blur-md sm:mx-auto sm:w-[60%] lg:w-[45%]"
          >
            <h1 class="mt-2 text-center text-lg font-light sm:text-2xl">Your login session has expired</h1>
            <p class="mb-4 mt-1 text-center text-xs sm:text-sm">Please enter your credentials below to continue</p>
            <!-- Start login form -->
            <transition
              enter-active-class="transition duration-200"
              enter-from-class="scale-50 opacity-0"
              leave-to-class="opacity-0"
            >
              <cf-alert-panel
                v-model="showErrorAlert"
                dismissible
                :dismiss-button-id="getId('alert-panel-dismiss-button')"
                class="z-30 mb-4 w-full"
                panel-type="error"
              >
                Incorrect email or password
                <template #description> Please double check your credentials and try again</template>
              </cf-alert-panel>
            </transition>
            <form id="login-modal-form" autocomplete="off" class="flex w-full flex-col justify-between" @submit.prevent>
              <div class="flex flex-col px-2">
                <div class="w-full lg:mr-4">
                  <cf-text-input
                    :id="getId('email-input')"
                    v-model="payload.email"
                    :invalid="validator.email.$invalid"
                    :invalid-text="validator.email.$invalid ? validator.email.$errors[0].$message : null"
                    name="email"
                    label="Email"
                    class="text-sm"
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
                    class="text-sm"
                    :invalid="validator.password.$invalid"
                    :invalid-text="validator.password.$invalid ? validator.password.$errors[0].$message : null"
                    @keyup.enter="handleFormSubmit"
                    @blur="validator.password.$touch"
                  ></cf-text-input>
                </div>
              </div>
              <!-- Start action buttons -->
              <div class="mb-4 mt-8 flex w-full justify-between px-2">
                <cf-button
                  :id="getId('forgot-password-button')"
                  class="bg-transparent text-sm italic hover:bg-theme-section-hover"
                >
                  I forgot my password
                </cf-button>
                <cf-button
                  :id="getId('login-page-button')"
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
            <!-- End login form -->
          </dialog-panel>
        </div>
      </div>
    </main-dialog>
  </transition-root>
</template>

<script setup>
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import { reactive, ref, watch } from 'vue'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import { email, helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { DialogPanel, Dialog as MainDialog, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useAuthStore } from '@/stores/auth'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users.js'

const dialogIsOpen = ref(false)

// Observe when the token expires, then we show the modal
const authStore = useAuthStore()
watch(
  () => authStore.authExpired,
  (tokenIsExpired) => {
    dialogIsOpen.value = tokenIsExpired
  }
)

const payload = reactive({
  email: '',
  password: '',
})

// Handle form validation
const showErrorAlert = ref(false)
const formRules = {
  $lazy: true,
  email: {
    required: helpers.withMessage('Please enter your email address', required),
    email: helpers.withMessage('Please enter a valid email address', email),
  },
  password: {
    required: helpers.withMessage('Please enter your password', required),
  },
}

const route = useRoute()
const usersStore = useUsersStore()
const handleReFetchOfData = async () => {
  switch (route.name) {
    case 'user-management':
      return await usersStore.initMyRegistrationPageComponentData()
    case 'profile':
      return window.location.reload()
    default:
      return
  }
}

const isLoading = ref(false)
const validator = useVuelidate(formRules, payload)

// Handle form submission
const handleFormSubmit = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return

  isLoading.value = true
  const response = await authStore.login(payload)

  if (response.success) {
    await handleReFetchOfData()
    isLoading.value = false
    return (dialogIsOpen.value = false)
  }

  isLoading.value = false
  showErrorAlert.value = true
}

const getId = usePrependOrAppendOnce('components-app-login-model')
</script>
