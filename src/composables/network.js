import { useFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth.js'
import { useGlobalStore } from '@/stores/global.js'

export const useApiCall = (uri, authToken = null) => {
  const baseUrl = import.meta.env.VITE_API_ROOT_URL

  // Remove the first char of the uri if it starts with a '/'
  if (uri.charAt(0) === '/') uri = uri.substring(1)

  return useFetch(`${baseUrl}/${uri}`, {
    async beforeFetch({ url, options }) {
      if (!authToken) return { options, url }

      // We add the auth token if the request needs authentication
      options.headers.Authorization = `Bearer ${authToken}`

      return { options, url }
    },
    // Intercept when the auth token expires
    onFetchError(ctx) {
      // Handle auth or token expiration
      const authToken = useAuthStore().authenticationToken
      if (authToken && ctx?.data?.error_code === 'UNAUTHORIZED_ERROR' && ctx?.response?.status === 401) {
        useAuthStore().authExpired = true
      }

      // Handle Rate limit
      if (ctx?.response?.status === 429) {
        useGlobalStore().pushToastMessage({
          title: 'Too many requests',
          description: "We've received an unusual number of request from you. Please try again after a few minutes.",
          timeout: 3000,
          type: 'warning',
          iconClass: 'fa-solid fa-warning',
        })
      }

      return ctx
    },
  })
}
