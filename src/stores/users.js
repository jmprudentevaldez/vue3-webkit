import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiCall } from '@/composables/network.js'
import { useAuthStore } from '@/stores/auth.js'
import { useSettingsStore } from '@/stores/settings.js'
import { usePublicStore } from '@/stores/public.js'

export const useUsersStore = defineStore('users', () => {
  const authStore = useAuthStore()

  // States
  const users = ref([])
  const pagination = ref(null)
  const roleFilter = ref(1)
  const isLoading = ref(false)

  // Actions
  const fetchUsers = async (roleFilter = null) => {
    let uri = '/users?limit=27&sort=desc&'
    if (roleFilter) uri += `role=${roleFilter}`

    const { data } = await useApiCall(uri, authStore.authenticationToken).get().json()
    const result = data.value

    if (result.success) {
      users.value = [...result.data]
      pagination.value = result.pagination
    }

    return result
  }

  const loadUsersFromPagination = async (url) => {
    if (!url) return null

    const uri = url.split(import.meta.env.VITE_API_ROOT_URL)[1]
    const { data } = await useApiCall(uri, authStore.authenticationToken).get().json()
    const result = data.value

    if (result.success) {
      users.value = [...result.data]
      pagination.value = result.pagination
    }

    return result
  }

  const searchUsers = async (search) => {
    let uri = '/users/search?'
    if (search) uri += `query=${search}`

    const { data } = await useApiCall(uri, authStore.authenticationToken).get().json()
    const result = data.value

    if (result.success) {
      users.value = [...result.data]
      pagination.value = result.pagination
    }

    return result
  }

  const updateUser = async (payload, id) => {
    const { data } = await useApiCall(`/users/${id}`, authStore.authenticationToken).patch(payload).json()
    const res = data.value

    if (res.success) {
      const index = users.value.findIndex((user) => user.id === id)
      if (index === -1) return res
      users.value[index] = res.data

      // check if the update is still within the role filters param
      if (Array.isArray(payload.roles) && !payload.roles.includes(roleFilter.value)) {
        users.value.splice(index, 1)
      }
    }

    return res
  }

  const createUser = async (payload) => {
    const { data } = await useApiCall('/users/', authStore.authenticationToken).post(payload).json()
    const res = data.value

    if (res.success) {
      // check if the update is still within the role filters param
      if (Array.isArray(payload.roles) && payload.roles.includes(roleFilter.value)) {
        users.value.unshift(res.data)
      }
    }

    return res
  }

  const deleteUser = async (id) => {
    const { data, statusCode } = await useApiCall(`/users/${id}`, authStore.authenticationToken).delete().json()

    if (statusCode.value === 204) {
      users.value = users.value.filter((user) => user.id !== id)
      return { success: true, message: 'User deleted' }
    }

    return data?.value
  }

  const settingsStore = useSettingsStore()
  const publicStore = usePublicStore()
  // We call this when on AppLoginModal when a 401 occurs and onBeforeMount method
  const initMyRegistrationPageComponentData = async () => {
    isLoading.value = true
    await settingsStore.fetchRoles()
    await fetchUsers(roleFilter.value)
    isLoading.value = false

    // init create user form
    // fetch all roles
    await settingsStore.fetchRoles()

    // provinces needs to be fetched first as the badges of the cities
    // depend on this list
    await publicStore.fetchProvinces()
    await Promise.allSettled([publicStore.fetchCities(), publicStore.fetchRegions()])
  }

  return {
    users,
    pagination,
    fetchUsers,
    searchUsers,
    loadUsersFromPagination,
    updateUser,
    roleFilter,
    createUser,
    deleteUser,
    isLoading,
    initMyRegistrationPageComponentData,
  }
})
