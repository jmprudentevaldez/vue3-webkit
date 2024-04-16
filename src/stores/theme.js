import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGetThemeFromAppSettings } from '@/composables/theme.js'

export const useThemeStore = defineStore('theme', () => {
  // States
  const selectedTheme = ref(useGetThemeFromAppSettings())

  const availableThemes = ref([
    { key: 'dark', name: 'Dark' },
    { key: 'light', name: 'Light' },
    { key: 'space', name: 'Space' },
    { key: 'old-school', name: 'Old School' },
    { key: 'auto', name: 'System Preference' },
  ])

  // Actions
  const switchTheme = (theme) => {
    selectedTheme.value = theme
  }

  return { selectedTheme, availableThemes, switchTheme }
})
