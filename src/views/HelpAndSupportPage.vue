<template>
  <div class="mx-auto max-w-6xl">
    <!-- Start Breadcrumbs -->
    <cf-breadcrumbs
      :links="[
        { name: 'home', label: 'Home' },
        { name: 'help-and-support', label: 'Help & Support', current: true },
      ]"
    >
    </cf-breadcrumbs>
    <!-- End Breadcrumbs -->
    <!-- Start content -->
    <div class="flex w-full flex-col">
      <div class="mb-6 flex justify-center">
        <help-and-support-graphic class="mt-8 h-40 sm:h-52 lg:h-60" />
      </div>
      <p class="text-center italic">More support information coming after the private BETA</p>
      <div class="mb-2 mt-6 flex justify-center">
        <cf-tooltip v-for="browser in supportedBrowsers" :key="browser.text">
          <template #tooltip-target>
            <font-awesome-icon :icon="browser.icon" class="mx-1"></font-awesome-icon>
          </template>
          <template #tooltip-text>
            {{ browser.text }}
          </template>
        </cf-tooltip>
      </div>
      <p class="text-center text-sm italic text-theme-muted">Tested on Major Browsers</p>
    </div>
  </div>
</template>

<script setup>
import CfBreadcrumbs from '@/components/campfire/CfBreadcrumbs.vue'
import HelpAndSupportGraphic from '@/components/help-and-support/HelpAndSupportGraphic.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfTooltip from '@/components/campfire/CfTooltip.vue'
import { ref } from 'vue'

const supportedBrowsers = ref([
  { icon: 'fa-brands fa-chrome', text: 'Google Chrome Version 105+' },
  { icon: 'fa-brands fa-firefox-browser', text: 'Firefox Version 109+ ' },
  { icon: 'fa-brands fa-safari', text: 'Safari Version 16+' },
])
</script>
