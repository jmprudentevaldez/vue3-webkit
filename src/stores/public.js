import { defineStore } from 'pinia'
import { useApiCall } from '@/composables/network'
import { parseNumber } from 'libphonenumber-js'
import { ref } from 'vue'

export const usePublicStore = defineStore('public', () => {
  const barangayOptions = ref([])
  const barangayOptionsIsLoading = ref(false)
  const cityOptions = ref([])
  const cityOptionsIsLoading = ref(false)
  const provinceOptions = ref([])
  const provinceOptionsIsLoading = ref(false)
  const regionOptions = ref([])
  const regionOptionsIsLoading = ref(false)

  const checkAvailability = async (key, value, excludeId = null) => {
    if (!['mobile_number', 'email'].includes(key)) throw new Error('Key can only be "email" or "mobile_number"')

    if (key === 'mobile_number') {
      value = encodeURIComponent('+63' + parseNumber(value, 'PH').phone)
    }

    let url = `/availability/${key}?value=${value}`
    if (excludeId) url += `&excluded_id=${excludeId}`

    const { data } = await useApiCall(url).get().json()
    return data.value
  }

  const fetchBarangays = async () => {
    if (barangayOptions.value.length > 0) return

    barangayOptionsIsLoading.value = true

    const { data } = await useApiCall('/address/barangays').get().json()
    const res = data.value

    if (res.success) {
      barangayOptions.value = []
      res.data.forEach((barangay) => {
        barangayOptions.value.push({ value: barangay.id, label: barangay.name, parent_id: barangay.city_id })
      })
    }

    barangayOptionsIsLoading.value = false
    return res
  }

  const fetchCities = async () => {
    if (cityOptions.value.length > 0) return

    cityOptionsIsLoading.value = true
    const { data } = await useApiCall('/address/cities').get().json()
    const res = data.value

    if (res.success) {
      cityOptions.value = []
      res.data.forEach((city) => {
        cityOptions.value.push({ value: city.id, label: city.name, parent_id: city.province_id })
      })
    }

    cityOptionsIsLoading.value = false
    return res
  }

  const fetchProvinces = async () => {
    if (provinceOptions.value.length > 0) return

    provinceOptionsIsLoading.value = true
    const { data } = await useApiCall('/address/provinces').get().json()
    const res = data.value

    if (res.success) {
      provinceOptions.value = []
      res.data.forEach((province) => {
        provinceOptions.value.push({ value: province.id, label: province.name, parent_id: province.region_id })
      })
    }

    provinceOptionsIsLoading.value = false
    return res
  }

  const fetchRegions = async () => {
    if (regionOptions.value.length > 0) return

    regionOptionsIsLoading.value = true
    const { data } = await useApiCall('/address/regions').get().json()
    const res = data.value

    if (res.success) {
      regionOptions.value = []
      res.data.forEach((region) => {
        regionOptions.value.push({ value: region.id, label: region.name })
      })
      regionOptionsIsLoading.value = false
    }

    return res
  }

  return {
    checkAvailability,
    fetchBarangays,
    fetchCities,
    fetchProvinces,
    fetchRegions,
    barangayOptions,
    barangayOptionsIsLoading,
    cityOptions,
    cityOptionsIsLoading,
    regionOptions,
    regionOptionsIsLoading,
    provinceOptions,
    provinceOptionsIsLoading,
  }
})
