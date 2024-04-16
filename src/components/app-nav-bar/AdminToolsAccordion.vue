<template>
  <div>
    <disclosure v-slot="{ open }">
      <disclosure-button class="relative mb-4 flex w-full items-center justify-between">
        <div
          class="flex h-full w-full rounded py-2 pl-6 pr-4 text-left text-theme-base transition-none duration-200 ease-in hover:transition-transform focus-visible:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary lg:mb-0 lg:rounded-xl lg:px-2 lg:py-1 lg:text-theme-base lg:hover:-translate-y-0.5 lg:hover:scale-105 lg:hover:bg-theme-section-hover"
        >
          <font-awesome-icon icon="fa-solid fa-toolbox" class="mr-2.5 mt-0.5 h-3.5 w-3.5"></font-awesome-icon>
          Admin Tools
        </div>
        <font-awesome-icon
          icon="fa-solid fa-chevron-right"
          :class="`${open ? 'rotate-90' : ''} mr-4 h-3.5 transform text-theme-base transition-transform`"
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
            class="ml-6 mr-2 flex flex-col rounded-lg text-sm lg:mt-0 lg:flex-row lg:space-x-8 lg:bg-theme-section lg:font-medium lg:shadow-none"
          >
            <li v-for="link in links" :key="link.name">
              <router-link
                :to="{ name: link.name }"
                active-class="bg-theme-primary font-bold text-theme-inverted lg:text-theme-base lg:bg-theme-section lg:mx-0 lg:font-normal lg:underline lg:decoration-2 lg:underline-offset-8 lg:decoration-theme-primary"
                class="lg:hover:bg-theme-section-hover` relative mb-4 block rounded py-2 pl-6 pr-4 text-left text-theme-base transition-none duration-200 ease-in hover:transition-all focus-visible:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary lg:mb-0 lg:rounded-xl lg:px-2 lg:py-1 lg:text-theme-base lg:hover:-translate-y-0.5 lg:hover:scale-105"
                @click.prevent="emits('selected', true)"
              >
                <font-awesome-icon :icon="link.icon" class="mr-2 h-3 w-3 lg:hidden"></font-awesome-icon>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </disclosure-panel>
      </transition>
      <!-- End panel -->
    </disclosure>
  </div>
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const router = useRouter()

const emits = defineEmits(['selected'])
const links = ref([])

const wireLinks = () => {
  const routes = router.getRoutes().filter((r) => {
    return r.path.startsWith('/admin/') && !r.meta.hideFromAdminTools
  })

  links.value = routes.map((r) => ({ name: r.name, label: r.meta.label, icon: r.meta.icon }))
}

wireLinks()

watch(
  () => router.currentRoute.value,
  () => {
    wireLinks()
  }
)
</script>
