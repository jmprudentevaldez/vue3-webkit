<template>
  <div class="mx-auto max-w-4xl">
    <!-- Start Breadcrumbs -->
    <cf-breadcrumbs
      :links="[
        { name: 'home', label: 'Home' },
        { name: 'admin-tools', label: 'Admin Tools' },
        { name: 'app-settings', label: 'App Settings', current: true },
      ]"
    >
    </cf-breadcrumbs>
    <!-- End Breadcrumbs -->
    <!-- Start content -->
    <div class="mt-8 flex h-screen w-full flex-col rounded-2xl">
      <!-- Start theme config -->
      <div class="flex flex-col justify-between rounded-2xl bg-theme-section p-6 lg:flex-row">
        <div class="flex flex-col">
          <p class="uppercase text-theme-primary">Theme</p>
          <p class="text-sm">Use this option to change the look and feel of the website for all users</p>
        </div>
        <div class="mt-4 flex items-center justify-end">
          <cf-theme-switcher class="hidden text-sm lg:block" />
          <cf-theme-switcher view-mode="modal" class="block text-sm lg:hidden"></cf-theme-switcher>
        </div>
      </div>
      <!-- End theme config -->
      <!-- Start More config coming soon -->
      <!-- Start theme config -->
      <div class="mt-4 flex justify-between rounded-2xl bg-theme-section px-6 py-8">
        <p class="italic text-theme-muted">More configurations coming soon</p>
      </div>
      <!-- End theme config -->
      <!-- End More config coming soon -->
      <!-- Start Save Button -->
      <div class="mt-10 flex justify-end">
        <cf-button
          :id="getId('save-config-button')"
          :is-loading="isLoading"
          class="rounded-2x2 bg-theme-success text-sm text-theme-success-panel"
          @click="handleSaveConfigurations"
        >
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-floppy-disk" class="mr-1.5" />
          </template>
          Save Configurations
        </cf-button>
      </div>
      <!-- End Save Button -->
    </div>
    <!-- End content -->
  </div>
</template>
<script setup>
import CfBreadcrumbs from '@/components/campfire/CfBreadcrumbs.vue'
import CfThemeSwitcher from '@/components/campfire/theme-switcher/CfThemeSwitcher.vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onUnmounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings.js'
import { useThemeStore } from '@/stores/theme.js'
import { useGlobalStore } from '@/stores/global.js'
import { useApplyTheme } from '@/composables/theme.js'
import { storeToRefs } from 'pinia'

const getId = usePrependOrAppendOnce('views-app-settings-page')
const isLoading = ref(false)
const settingsStore = useSettingsStore()
const { selectedTheme, availableThemes } = storeToRefs(useThemeStore())
const globalStore = useGlobalStore()

const handleSaveConfigurations = async () => {
  isLoading.value = true
  const res = await settingsStore.storeSettings({ theme: selectedTheme.value })

  if (res.success) {
    globalStore.pushToastMessage({
      title: 'App Settings',
      description: 'All configurations saved',
      timeout: 6000,
      type: 'success',
      iconClass: 'fa-solid fa-circle-check',
    })
  }

  isLoading.value = false
}

// Revert back the theme if it was changed but no saved
onUnmounted(() => {
  const themeAppSettings = settingsStore.appSettings.find((settings) => settings.name === 'theme')
  if (themeAppSettings && themeAppSettings.value !== selectedTheme.value) {
    useApplyTheme(themeAppSettings.value, availableThemes.value)
    selectedTheme.value = themeAppSettings.value
    globalStore.pushToastMessage({
      title: 'App Settings',
      description: 'Configuration not saved. The theme of the website has reverted',
      timeout: 4000,
      type: 'warning',
      iconClass: 'fa-solid fa-triangle-exclamation',
    })
  }
})
</script>
