import { defineStore, storeToRefs } from 'pinia'
import { useApiCall } from '@/composables/network'
import { useAuthStore } from '@/stores/auth'

export const useProfileStore = defineStore('profile', () => {
  // VueUse's useStorage() loses reactivity after serialization,
  // we make it reactive again by wrapping storeToRefs()
  const auth = storeToRefs(useAuthStore())

  const fetchProfile = async () => {
    const { data } = await useApiCall('/profile', auth.authenticationToken.value).get().json()

    const response = data.value
    if (response.success) {
      auth.authenticatedUser.value = response.data
    }

    return response
  }

  const updateProfile = async (payload) => {
    const { data } = await useApiCall('/profile', auth.authenticationToken.value).patch(payload).json()

    const response = data.value
    if (response.success) {
      auth.authenticatedUser.value = response.data
    }

    return response
  }

  const uploadProfilePicture = async (payload) => {
    const { data } = await useApiCall('/profile/profile-picture', auth.authenticationToken.value).post(payload).json()

    const response = data.value
    if (response.success) {
      auth.authenticatedUser.value.user_profile.profile_picture_url = response.data.url
    }

    return response
  }

  const changePassword = async (payload) => {
    const { data } = await useApiCall('/profile/password', auth.authenticationToken.value).patch(payload).json()
    return data.value
  }

  return { fetchProfile, updateProfile, uploadProfilePicture, changePassword }
})
