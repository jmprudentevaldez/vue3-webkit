import { useSettingsStore } from '@/stores/settings.js'

export const useGetThemeFromAppSettings = () => {
  const settingsStore = useSettingsStore()
  if (!settingsStore.appSettings) return null

  for (const setting of settingsStore.appSettings) {
    if (setting.name === 'theme') return setting.value
  }

  return null
}

export const useApplyTheme = (selectedTheme, availableThemes) => {
  // remove existing theme classes
  for (const themeName of availableThemes) {
    if (selectedTheme !== themeName.key) {
      document.body.classList.remove(`theme-${themeName.key}`)
      continue
    }

    // Add base color to the <body>
    document.body.classList.add('bg-theme-base')

    // Check the system pref if Auto is selected
    if (themeName.key === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add(`theme-dark`)
      continue
    }

    // Inject the selected class to the parent tag
    document.body.classList.add(`theme-${themeName.key}`)
  }
}
