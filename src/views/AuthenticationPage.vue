<template>
  <transition-root
    as="template"
    :show="isTransitioning"
    appear
    enter="transform transition-all duration-200"
    enter-from="opacity-0 translate-x-40"
    enter-to="opacity-100 translate-x-0"
    leave="transform duration-200 transition ease-in-out"
    leave-from="opacity-100 translate-x-0 "
    leave-to="opacity-0 -translate-x-40"
  >
    <div class="flex h-full items-center">
      <section
        class="mx-auto w-full max-w-screen-lg rounded-lg px-1 backdrop-blur-md sm:bg-theme-section sm:bg-opacity-75 sm:px-4 sm:py-8 sm:shadow-md lg:shadow-lg"
      >
        <!-- Start Wrapper -->
        <div class="flex flex-col px-2 transition-all duration-300 sm:grid sm:grid-cols-3">
          <!-- Start form -->
          <div class="flex flex-col px-2 sm:col-span-2 sm:items-start sm:pr-8">
            <div class="flex w-full justify-between">
              <app-logo
                class="text-2xl transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                @click="router.push({ name: 'home' })"
              >
              </app-logo>
            </div>
            <cf-horizontal-separator class="my-5"></cf-horizontal-separator>
            <!-- Start creds login / sign-up -->
            <template v-if="isLoginRoute">
              <login-form />
            </template>
            <template v-else>
              <register-form />
            </template>
            <!-- End creds login / sign-up -->
            <!-- Start Sign in / Sign up button (mobile) -->
            <div class="flex flex-col sm:hidden">
              <cf-horizontal-separator class="my-6"> or</cf-horizontal-separator>
              <cf-button
                :id="getId('sign-or-login-button-mobile')"
                class="bg-theme-primary text-sm text-theme-inverted"
                @click="switchForm"
              >
                {{ isLoginRoute ? 'Create an account' : 'Sign in instead' }}
              </cf-button>
            </div>
            <!-- End Sign in / Sign up button (mobile) -->
          </div>
          <!-- End form -->
          <!-- Start graphic -->
          <div class="hidden w-full flex-col rounded-xl bg-theme-tooling bg-opacity-10 py-6 backdrop-blur-md sm:flex">
            <div v-if="isLoginRoute" key="auth-graphic-login" class="flex w-full items-center">
              <login-graphic class="mx-4 h-[80%] w-full"></login-graphic>
            </div>
            <div v-else key="auth-graphic-register" class="mt-20 flex w-full items-start lg:items-center">
              <registration-graphic class="mx-4 h-[80%] w-full"></registration-graphic>
            </div>
            <div class="mt-4 flex flex-col items-center justify-center">
              <p class="mb-4 text-sm">
                {{ isLoginRoute ? 'Are you new to Campfire?' : 'Already have an account?' }}
              </p>
              <cf-button
                :id="getId('sign-or-login-in-button')"
                class="bg-theme-primary text-sm text-theme-inverted"
                @click="switchForm"
              >
                <span class="mx-2">{{ isLoginRoute ? 'Create an account' : 'Sign in instead' }}</span>
              </cf-button>
              <p class="mb-2 mt-3 text-xs italic text-theme-muted">
                {{ isLoginRoute ? 'It will only take a minute' : "and let's get back to it" }}
              </p>
            </div>
          </div>
          <!-- End graphic -->
        </div>
        <!-- End Wrapper -->
      </section>
    </div>
  </transition-root>
</template>

<script setup>
import AppLogo from '@/components/AppLogo.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import LoginForm from '@/components/authentication-page/LoginForm.vue'
import RegisterForm from '@/components/authentication-page/RegisterForm.vue'
import RegistrationGraphic from '@/components/authentication-page/RegistrationGraphic.vue'
import LoginGraphic from '@/components/authentication-page/LoginGraphic.vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionRoot } from '@headlessui/vue'
import { ref } from 'vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('views-authentication-page')

const route = useRoute()
const router = useRouter()

const isLoginRoute = ref(route.name === 'login')
const isTransitioning = ref(true)

const switchForm = () => {
  isTransitioning.value = false

  setTimeout(() => {
    isTransitioning.value = true
    isLoginRoute.value = !isLoginRoute.value
    isLoginRoute.value ? router.push({ name: 'login' }) : router.push({ name: 'sign-up' })
  }, 200)
}
</script>
