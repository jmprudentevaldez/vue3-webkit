<template>
  <footer class="flex flex-col items-center bg-theme-section p-3 px-2 py-8 text-xs uppercase text-theme-muted">
    <span class="font-light"
      >Maintained by
      <span class="ml-0.5 font-bold">DSWD DX Team</span>
    </span>
    <div class="mt-2 flex items-center justify-center">
      <cf-button
        v-for="social in socials"
        :id="getId(social.name) + 'button'"
        :key="social.name"
        icon
        class="mx-2.5 lg:mx-1.5"
        :height="5"
        :width="5"
        @click="handleOpenSocial(social.url)"
      >
        <template #icon>
          <font-awesome-icon :icon="social.icon" class="h-4 w-4"></font-awesome-icon>
        </template>
      </cf-button>
    </div>
    <cf-horizontal-separator class="my-4 w-[90%] lg:w-[70%]"></cf-horizontal-separator>
    <div>
      <span class="font-light tracking-widest"
        >&copy; {{ new Date().getFullYear() }} | Walang Gutom 2027 | All rights reserved</span
      >
    </div>
  </footer>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('components-app-footer')

const socials = [
  { name: 'Linkedin', icon: 'fa-brands fa-facebook', url: import.meta.env.VITE_FACEBOOK_PROFILE },
  { name: 'Gmail', icon: 'fa-brands fa-google', url: import.meta.env.VITE_GMAIL_URL },
]

const handleOpenSocial = (url) => {
  window.open(url, '_blank')
}
</script>
