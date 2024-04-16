<template>
  <div v-if="showSidebar" class="fixed z-10 mt-40 hidden h-auto w-auto bg-theme-base lg:block">
    <div class="rounded-r-2xl">
      <div class="flex flex-col overflow-hidden rounded-r-2xl bg-theme-tooling text-theme-tooling">
        <!-- Start toggle mode button -->
        <span
          :class="`flex items-center px-3 text-xs hover:cursor-pointer ${
            inFullMode ? 'mr-2 justify-end py-3' : 'justify-center py-1'
          }`"
          @click="inFullMode = !inFullMode"
        >
          <font-awesome-icon
            :icon="`${!inFullMode ? 'fa-solid fa-arrows-left-right' : 'fa-solid fa-right-left'}`"
            :class="`${inFullMode ? 'mr-2' : ''} transition-all duration-200`"
          >
          </font-awesome-icon>
          {{ inFullMode ? 'Minimize' : '' }}
        </span>
        <cf-horizontal-separator />
        <!-- End toggle mode button -->
        <!-- Start links -->
        <router-link
          v-for="link in links"
          :key="link.name"
          v-slot="{ isActive }"
          exact
          :to="{ path: link.path }"
          active-class="bg-theme-primary text-theme-inverted"
        >
          <cf-tooltip placement="right" :hide="inFullMode">
            <template #tooltip-target>
              <a
                :href="link.name"
                :class="`${inFullMode ? 'justify-start px-8 py-4 text-sm' : 'justify-center p-3'} ${
                  isActive ? 'hover:bg-theme-primary' : 'hover:bg-white hover:bg-opacity-20'
                } flex items-center transition-all duration-200`"
              >
                <font-awesome-icon :icon="link.icon" :class="`${inFullMode ? 'mr-3' : ''}`"></font-awesome-icon>
                <span v-if="inFullMode">{{ link.label }}</span>
              </a>
            </template>
            <template #tooltip-text>
              {{ link.label }}
            </template>
          </cf-tooltip>
        </router-link>
        <!-- End links -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import CfTooltip from '@/components/campfire/CfTooltip.vue'

const router = useRouter()

const links = ref([])
const inFullMode = ref(false)
const showSidebar = ref(false)

watch(
  () => router.currentRoute.value,
  () => {
    showSidebar.value = router.currentRoute.value.path.startsWith('/admin/')
    const routes = router.getRoutes().filter((r) => {
      return r.path.startsWith('/admin/') && !r.meta.hideFromAdminTools
    })
    links.value = routes.map((r) => ({ name: r.name, label: r.meta.label, icon: r.meta.icon, path: r.path }))
  }
)
</script>
