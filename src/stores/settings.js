import { defineStore } from 'pinia'
import { useApiCall } from '@/composables/network.js'
import { useAuthStore } from '@/stores/auth.js'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useSnakeCaseToTitleCase } from '@/composables/helpers.js'

export const useSettingsStore = defineStore('settings', () => {
  const auth = useAuthStore()
  const rolesOptions = ref([])
  const rolesOptionIsLoading = ref(false)

  const appSettings = useStorage('app-settings', null, localStorage, {
    serializer: StorageSerializers.object,
    deep: true,
    mergeDefaults: true,
  })

  const fetchSettings = async () => {
    const { data } = await useApiCall('/app-settings').get().json()
    const response = data.value

    if (response.success) {
      appSettings.value = response.data
    }

    return response
  }

  const storeSettings = async (payload) => {
    const { data } = await useApiCall('/app-settings', auth.authenticationToken).post(payload).json()
    const response = data.value

    if (response.success) {
      appSettings.value = response.data
    }

    return response
  }

  const fetchRoles = async () => {
    rolesOptionIsLoading.value = true
    const { data } = await useApiCall('/roles', auth.authenticationToken).get().json()
    const res = data.value

    if (res.success) {
      rolesOptions.value = res.data.map((r) => {
        return { value: r.id, label: useSnakeCaseToTitleCase(r.name) }
      })
    }

    rolesOptionIsLoading.value = false
    return res
  }

  return {
    appSettings,
    fetchSettings,
    storeSettings,
    fetchRoles,
    rolesOptions,
    rolesOptionIsLoading,
  }
})
