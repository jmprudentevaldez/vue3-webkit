<template>
  <nav
    id="app-main-nav"
    class="fixed left-0 top-0 z-20 mx-auto w-full justify-center bg-theme-section px-4 py-3 lg:px-12"
  >
    <div class="flex flex-wrap items-center justify-between">
      <!-- Start Logo and title -->
      <app-logo
        class="text-2xl transition-transform duration-200 ease-in hover:-translate-y-0.5 hover:scale-105 hover:cursor-pointer lg:w-[30%]"
      />
      <!-- End logo and title -->
      <!-- Start Utils section -->
      <div class="flex items-center lg:order-2 lg:w-[30%]">
        <!-- Start Switcher and icons -->
        <div class="hidden w-full lg:flex lg:items-center lg:justify-end">
          <template v-if="auth.isAuthenticated">
            <div class="flex">
              <!-- Start Notification icon -->
              <notification-menu class="mr-2" />
              <!-- End Notification icon -->
            </div>
          </template>
        </div>
        <!-- End Switcher and icons -->
        <!-- Start Login and Profile section -->
        <div v-if="!auth.isAuthenticated">
          <cf-button
            :id="getId('login')"
            class="ml-6 hidden items-center border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-inverted lg:flex"
            @click="navigateToLogin"
          >
            <template #icon>
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-1.5 h-3 w-3 font-light" />
            </template>
            <span class="text-xs">LOGIN</span>
          </cf-button>
        </div>
        <div v-else class="ml-4 hidden items-center lg:flex">
          <cf-profile-menu :avatar-height="8" :avatar-width="8" />
        </div>
        <!-- End Login and Profile section -->
        <!-- Start mobile hamburger -->
        <button
          id="app-navbar-hamburger-button"
          class="group group flex w-6 flex-col items-end p-0.5 hover:cursor-pointer focus:ring-theme-primary lg:hidden"
          @click="toggleHamburgerContent"
        >
          <span class="sr-only">Open navigation menu</span>
          <span
            id="hamburger-button-line-top"
            :class="`ease my-0.5 h-0.5 w-full transform rounded-full bg-theme-neutral transition duration-300 ${
              hamburgerContentIsShown ? 'translate-y-1.5 rotate-45' : ''
            }`"
          ></span>
          <span
            id="hamburger-button-line-middle"
            :class="`ease my-0.5 h-0.5 w-[75%] transform rounded-full bg-theme-neutral transition duration-300 ${
              hamburgerContentIsShown ? '-translate-x-3 opacity-0' : 'opacity-100'
            }`"
          ></span>
          <span
            id="hamburger-button-line-bottom"
            :class="`ease my-0.5 h-0.5 w-full transform rounded-full bg-theme-neutral transition duration-300 ${
              hamburgerContentIsShown ? '-translate-y-1.5 -rotate-45' : ''
            }`"
          ></span>
        </button>
        <!-- End mobile hamburger -->
      </div>
      <!-- End Utils section -->
      <!-- Start Nav links -->
      <div
        id="app-navbar-hamburger-content"
        class="absolute right-[-200%] top-[100%] w-full items-center justify-center bg-theme-section transition-right duration-300 ease-in hover:cursor-pointer lg:static lg:order-1 lg:mt-0 lg:flex lg:w-auto lg:bg-transparent"
      >
        <ul
          class="mx-2 flex h-screen flex-col rounded-lg text-sm lg:mt-0 lg:h-auto lg:flex-row lg:space-x-8 lg:bg-theme-section lg:font-medium lg:shadow-none"
        >
          <!-- Start Profile Section -->
          <li v-if="auth.isAuthenticated">
            <cf-profile-menu
              view-mode="accordion"
              class="mb-2 rounded px-4 py-2 text-theme-base lg:hidden"
              :avatar-width="12"
              :avatar-height="12"
              @selected="toggleHamburgerContent"
            />
            <cf-horizontal-separator class="mb-4 mt-2 w-full lg:hidden" />
          </li>
          <!-- End Profile Section -->

          <!-- Start nav links -->
          <li v-for="link in navLinks" :key="link.name">
            <router-link
              :to="{ name: link.name }"
              active-class="bg-theme-primary font-bold text-theme-inverted lg:text-theme-base lg:bg-theme-section lg:mx-0 lg:font-normal lg:underline lg:decoration-2 lg:underline-offset-8 lg:decoration-theme-primary"
              :class="`${
                link.name === 'admin-tools' ? 'hidden md:block' : 'block'
              } mb-4 rounded py-2 pl-6 pr-4 text-left text-theme-base transition-none duration-200 ease-in hover:transition-transform focus-visible:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary lg:mb-0 lg:rounded-xl lg:px-2 lg:py-1 lg:text-theme-base lg:hover:-translate-y-0.5 lg:hover:scale-105 lg:hover:bg-theme-section-hover`"
              @click="toggleHamburgerContent"
            >
              <font-awesome-icon :icon="link.icon" class="mr-2 h-3.5 w-3.5 lg:hidden"></font-awesome-icon>
              {{ link.label }}
            </router-link>
            <!-- Start admin toolbox accordion -->
            <admin-tools-accordion
              v-if="link.name === 'admin-tools'"
              class="block lg:hidden"
              @selected="toggleHamburgerContent"
            />
            <!-- End admin toolbox accordion -->
          </li>
          <!-- End nav links -->
          <li class="lg:hidden">
            <router-link
              v-if="!auth.isAuthenticated"
              :to="{ name: 'login' }"
              class="mb-4 block w-full rounded py-2 pl-6 pr-4 text-left font-bold text-theme-base transition-none duration-200 ease-in hover:transition-all focus-visible:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary lg:mb-0 lg:rounded-xl lg:px-2 lg:py-1 lg:text-theme-base lg:hover:-translate-y-0.5 lg:hover:scale-105 lg:hover:bg-theme-section-hover"
              @click="toggleHamburgerContent"
            >
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-2 h-3 w-3 lg:hidden"></font-awesome-icon>
              Login
            </router-link>
          </li>
        </ul>
      </div>
      <!-- End Nav links -->
    </div>
  </nav>
</template>

<script setup>
import AppLogo from '@/components/AppLogo.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import CfProfileMenu from '@/components/campfire/CfProfileMenu.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { useAuthType } from '@/composables/enums.js'
import AdminToolsAccordion from '@/components/app-nav-bar/AdminToolsAccordion.vue'
import NotificationMenu from '@/components/app-nav-bar/NotificationMenu.vue'

const getId = usePrependOrAppendOnce('components-app-navbar')

const auth = useAuthStore()
const router = useRouter()
const authType = useAuthType()

let navLinks = []
const handleRoutesVisibility = () => {
  navLinks = []
  router.getRoutes().forEach((route) => {
    if (route.meta.isNavMenu) {
      const r = { name: route.name, label: route.meta.label }

      // Filter routes that need to be authenticated
      if (route.meta.auth === authType.AUTHENTICATED && !auth.isAuthenticated) return

      // Filter routes that require roles
      if (route.meta.roles && !auth.authHasRequiredRole(route.meta.roles)) return

      switch (route.name) {
        case 'home':
          r.icon = 'fa-solid fa-house-chimney'
          break
        case 'admin-tools':
          r.icon = 'fa-solid fa-toolbox'
          break
        case 'help-and-support':
          r.icon = 'fa-solid fa-headset'
          break
        default:
          r.icon = 'fa-solid fa-circle-question'
          break
      }

      navLinks.push(r)
    }
  })
}

handleRoutesVisibility()

// Refresh the navbar items everytime the user re-authenticates
watch(
  () => auth.authenticationToken,
  () => {
    handleRoutesVisibility()
  }
)

const hamburgerContentIsShown = ref(false)
const toggleHamburgerContent = () => {
  const hamburgerContent = document.getElementById('app-navbar-hamburger-content')
  hamburgerContentIsShown.value = !hamburgerContentIsShown.value
  if (hamburgerContentIsShown.value) {
    hamburgerContent.classList.add('right-[0%]')
    hamburgerContent.classList.remove('right-[-200%]')
    return
  }
  hamburgerContent.classList.remove('right-[0%]')
  hamburgerContent.classList.add('right-[-200%]')
}

const navigateToLogin = async (fromMobileView = false) => {
  if (fromMobileView) {
    toggleHamburgerContent()
  }

  await router.push({ name: 'login' })
}
</script>
