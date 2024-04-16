import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  // States
  const toastMessages = ref([])

  // Actions
  const pushToastMessage = ({
    title,
    description = null,
    type = 'tooling',
    timeout = Infinity,
    id = Math.floor(Date.now() / 1000), // We'll use a timestamp as a key for v-for
    iconClass = null, // We only support font awesome icons for now
  }) => {
    toastMessages.value.push({ title, description, type, timeout, id, iconClass, show: true })
  }

  return { toastMessages, pushToastMessage }
})
