<template>
  <div>
    <!-- Start popup view (Desktop) -->
    <popover v-if="props.viewMode === 'popup'" class="relative flex rounded-full">
      <!-- Start button -->
      <popover-button
        :class="`h-${props.avatarHeight} w-${props.avatarWidth} rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none hovus:ring-1 hovus:ring-theme-primary`"
      >
        <cf-avatar
          :height="props.avatarHeight"
          :width="props.avatarWidth"
          :src="auth.authenticatedUser.user_profile.profile_picture_url"
          :fake="!auth.authenticatedUser.user_profile.profile_picture_url"
          class="text-sm"
        ></cf-avatar>
      </popover-button>
      <!-- End button -->
      <!-- Start transition for the panel -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <!-- Start panel -->
        <popover-panel
          v-slot="{ close }"
          class="absolute right-0 top-10 z-20 w-60 origin-top-right rounded-lg bg-theme-tooling py-3 text-sm text-theme-tooling"
        >
          <div class="flex flex-col">
            <div class="flex flex-col items-center justify-center px-1 text-theme-tooling">
              <span class="font-bold">{{ auth.authenticatedUser.user_profile.full_name }}</span>
              <span class="italic">{{ auth.authenticatedUser.email }}</span>
            </div>
            <cf-horizontal-separator class="mb-2 mt-4" />
            <!-- Start link menus -->
            <button
              v-for="menu in linkMenus"
              :key="menu.name"
              :class="`${
                menu.route.name !== 'notifications' ? 'block' : 'hidden'
              } mx-2 mb-1 flex items-center justify-between rounded-lg px-6 py-2 text-left transition-all duration-200 ${
                $route.name === menu.route.name ? 'bg-theme-primary text-theme-inverted' : 'hover:scale-105'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary`"
              @click="handleRouteChange(menu.route, close)"
            >
              <span>
                <font-awesome-icon :icon="menu.icon" class="mr-2"></font-awesome-icon>
                {{ menu.name }}
              </span>
              <font-awesome-icon icon="fa-solid fa-chevron-right" class="h-2"></font-awesome-icon>
            </button>
            <!-- End link menus -->
            <button
              class="mx-2 rounded-lg px-6 py-2 text-left transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary"
              @click="handleLogout(close)"
            >
              <font-awesome-icon icon="fa-solid fa-power-off" class="mr-2"></font-awesome-icon>
              Logout
            </button>
          </div>
        </popover-panel>
        <!-- End panel -->
      </transition>
      <!-- End transition for the panel -->
    </popover>
    <!-- End popup view -->
    <!-- Start accordion view (mobile) -->
    <disclosure v-if="props.viewMode === 'accordion' && auth.isAuthenticated" v-slot="{ open }">
      <disclosure-button class="relative flex w-full items-center justify-between">
        <div class="flex h-full w-full">
          <cf-avatar
            :width="props.avatarWidth"
            :height="props.avatarHeight"
            :src="auth.authenticatedUser.user_profile.profile_picture_url"
            :fake="!auth.authenticatedUser.user_profile.profile_picture_url"
            class="mr-4"
          />
          <div class="flex flex-col justify-center text-left">
            <span class="font-bold">{{ auth.authenticatedUser.user_profile.full_name }}</span>
            <span class="italic">{{ auth.authenticatedUser.email }}</span>
          </div>
        </div>
        <font-awesome-icon
          icon="fa-solid fa-chevron-right"
          :class="open && 'rotate-90 transform transition-transform'"
        ></font-awesome-icon>
      </disclosure-button>
      <!-- Start panel -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-5 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
      >
        <disclosure-panel class="mt-4">
          <ul
            class="mx-2 flex flex-col rounded-lg text-sm lg:mt-0 lg:flex-row lg:space-x-8 lg:bg-theme-section lg:font-medium lg:shadow-none"
          >
            <li v-for="link in linkMenus" :key="link.name" class="relative">
              <router-link
                :to="link.route"
                active-class="bg-theme-primary font-bold text-theme-inverted lg:text-theme-base lg:bg-theme-section lg:mx-0 lg:font-normal lg:underline lg:decoration-2 lg:underline-offset-8 lg:decoration-theme-primary"
                class="relative mb-4 block rounded py-2 pl-6 pr-4 text-left text-theme-base transition-none duration-200 ease-in hover:transition-all focus-visible:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary lg:mb-0 lg:rounded-xl lg:px-2 lg:py-1 lg:text-theme-base lg:hover:-translate-y-0.5 lg:hover:scale-105 lg:hover:bg-theme-section-hover"
                @click.prevent="emits('selected', true)"
              >
                <font-awesome-icon :icon="link.icon" class="mr-2 h-3 w-3 lg:hidden"></font-awesome-icon>
                {{ link.name }}
                <!-- Start Notification bubble TODO: Change false here for the length logic -->
                <div
                  v-if="link.route.name === 'notifications' && false"
                  class="absolute left-4 top-2 h-2 w-2 animate-pulse rounded-full bg-theme-error"
                ></div>
                <!-- End Notification bubble -->
              </router-link>
            </li>
            <li>
              <button
                class="block w-full rounded py-2 pl-6 pr-4 text-left text-theme-base transition-none duration-200 ease-in hover:transition-all focus-visible:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary lg:mb-0 lg:rounded-xl lg:px-2 lg:py-1 lg:text-theme-base lg:hover:-translate-y-0.5 lg:hover:scale-105 lg:hover:bg-theme-section-hover"
                @click="handleLogout()"
              >
                <font-awesome-icon icon="fa-solid fa-power-off" class="mr-2 h-3 w-3 lg:hidden"></font-awesome-icon>
                Logout
              </button>
            </li>
          </ul>
        </disclosure-panel>
      </transition>
      <!-- End panel -->
    </disclosure>
    <!-- End accordion view (mobile) -->
  </div>
</template>

<script setup>
import CfAvatar from '@/components/campfire/CfAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { useRole } from '@/composables/enums.js'
import { useSleep } from '@/composables/helpers.js'

const authStore = useAuthStore()
const roleEnum = useRole()

const props = defineProps({
  viewMode: {
    type: String,
    default: 'popup',
    validator: (value) => ['popup', 'accordion'].includes(value),
  },
  avatarHeight: {
    type: Number,
    required: true,
  },
  avatarWidth: {
    type: Number,
    required: true,
  },
})

const linkMenus = [
  { name: 'Profile', icon: 'fa-solid fa-id-badge', route: { name: 'profile' } },
  { name: 'Notifications', icon: 'fa-solid fa-bell', route: { name: 'notifications' } },
]
if (authStore.authHasRequiredRole([roleEnum.SUPER_USER, roleEnum.ADMIN])) {
  linkMenus.push({ name: 'Settings', icon: 'fa-solid fa-gear', route: { name: 'app-settings' } })
}

const auth = useAuthStore()
const emits = defineEmits(['selected'])
const router = useRouter()
const handleLogout = async (close = undefined) => {
  // We close the Pop-over if in popup view-mode
  if (close) close()

  emits('selected', true)

  await auth.logout()
  await router.replace({ name: 'login' })
}

const handleRouteChange = async (route, close) => {
  await router.push(route)
  await useSleep(0.1)
  close()
}
</script>
