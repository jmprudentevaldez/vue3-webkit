import { defineStore } from 'pinia'
import { useApiCall } from '@/composables/network.js'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useFindOneInArray } from '@/composables/helpers.js'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // States. We use localStorage to hydrate state when the page reloads
  // @see https://github.com/vueuse/vueuse/pull/614#issuecomment-875450160 on why we need a serializer for `null` defaults
  const authenticationToken = useStorage('auth-token', null, localStorage, { serializer: StorageSerializers.string })
  const authenticatedUser = useStorage('auth-user', null, localStorage, {
    serializer: StorageSerializers.object,
    deep: true,
    mergeDefaults: true,
  })
  const authExpired = ref(false)

  // Getters
  const isAuthenticated = computed(() => {
    return !!authenticationToken?.value
  })

  const authRegistrationStatus = computed(() => {
    return authenticatedUser?.value?.latest_registration_record?.status
  })

  const authRoles = computed(() => {
    return authenticatedUser?.value?.roles.map((role) => role.name)
  })

  const authEmailIsVerified = computed(() => {
    return !!authenticatedUser?.value?.email_verified_at
  })

  const avatarDisplayNamePlaceholder = computed(() => {
    if (!authenticatedUser.value?.user_profile?.full_name) return null

    // we'll display the initials for the fake avatar
    const names = authenticatedUser.value.user_profile.full_name.split(' ')
    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }

    return initials
  })

  const authFullAddress = computed(() => {
    if (!authenticatedUser.value) return null

    let address = ''
    address += authenticatedUser.value.user_profile.address?.home_address
      ? authenticatedUser.value.user_profile.address.home_address + ', '
      : ''
    address += authenticatedUser.value.user_profile.address?.barangay?.name
      ? authenticatedUser.value.user_profile.address.barangay.name + ', '
      : ''
    address += authenticatedUser.value.user_profile.address?.city?.name
      ? authenticatedUser.value.user_profile.address.city.name + ', '
      : ''
    address += authenticatedUser.value.user_profile.address?.province?.name
      ? authenticatedUser.value.user_profile.address.province.name + ', '
      : ''
    address += authenticatedUser.value.user_profile.address?.region?.name
      ? authenticatedUser.value.user_profile.address.region.name
      : ''

    return address
  })

  // Actions
  const login = async (payload) => {
    payload.with_user = true
    payload.client_name = `${navigator.platform} - Web`

    const { data } = await useApiCall('auth/tokens').post(payload).json()

    const response = data.value
    if (response.success) {
      authenticationToken.value = response.data.token
      authenticatedUser.value = response.data.user
    }

    return response
  }

  const register = async (payload) => {
    const { data } = await useApiCall('auth/register')
      .post({ ...payload, client_name: `${navigator.platform} - Web` })
      .json()

    const response = data.value
    if (response.success) {
      authenticationToken.value = response.data.token
      authenticatedUser.value = response.data.user
    }

    return response
  }

  const logout = async () => {
    await useApiCall('auth/tokens', authenticationToken.value).delete()
    authenticationToken.value = null
    authenticatedUser.value = null
  }

  const resendEmailVerification = async () => {
    const { data } = await useApiCall('auth/email/send-verification', authenticationToken.value).get().json()
    const response = data.value
    return response.success
  }

  const verifyEmail = async ({ id, hash, signature, expires }) => {
    const url = `auth/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`
    const { data } = await useApiCall(url, authenticationToken.value).get().json()
    return data.value
  }

  const requestForgotPassword = async ({ email }) => {
    const { data } = await useApiCall('auth/forgot-password').post({ email }).json()
    return data.value
  }

  const resetPassword = async ({ email, token, password, password_confirmation }) => {
    const { data } = await useApiCall('auth/reset-password')
      .post({
        email,
        token,
        password,
        password_confirmation,
      })
      .json()

    return data.value
  }

  const authHasRequiredRole = (requiredRoles) => {
    const userRoles = authenticatedUser.value.roles.map((role) => role.name)
    return useFindOneInArray(requiredRoles, userRoles)
  }

  const router = useRouter()
  // if this is null, then the user must have logged out
  watch(
    () => authenticationToken.value,
    async () => {
      if (!authenticationToken.value) {
        // Go to login screen
        await router.replace({ name: 'login' })
      }
    }
  )

  return {
    authenticationToken,
    authenticatedUser,
    authExpired,
    isAuthenticated,
    authRoles,
    authRegistrationStatus,
    authEmailIsVerified,
    login,
    logout,
    register,
    resendEmailVerification,
    verifyEmail,
    requestForgotPassword,
    resetPassword,
    authHasRequiredRole,
    avatarDisplayNamePlaceholder,
    authFullAddress,
  }
})
