<template>
  <div>
    <!-- Start Error alert -->
    <transition
      enter-active-class="transition duration-200"
      enter-from-class="scale-50 opacity-0"
      leave-to-class="opacity-0"
    >
      <cf-alert-panel
        :id="getId('error-alert-panel')"
        v-model="showErrorAlert"
        :dismiss-button-id="getId('dismiss-error-alert-button')"
        dismissible
        class="z-30 mb-4 w-full"
        panel-type="error"
      >
        {{ errorMessage }}
        <template #description>
          <div class="flex flex-col">
            <div v-for="error in errorDetails" :key="error" class="mt-0.5">{{ error }}</div>
          </div>
        </template>
      </cf-alert-panel>
    </transition>
    <!-- End Error alert -->
    <!-- Start edit toggle -->
    <div class="flex items-center justify-end text-sm">
      <span class="mr-2 text-sm font-bold text-theme-muted">
        {{ profileEditingEnabled ? 'Disable Editing' : 'Enable Editing' }}
      </span>
      <cf-toggle-switch :id="getId('enable-editing-switch')" v-model="profileEditingEnabled">
        <template #disabledIcon>
          <font-awesome-icon icon="fa-solid fa-lock" class="h-2 w-2"></font-awesome-icon>
        </template>
        <template #enabledIcon>
          <font-awesome-icon icon="fa-solid fa-lock-open" class="h-2 w-2"></font-awesome-icon>
        </template>
      </cf-toggle-switch>
    </div>
    <!-- End edit toggle -->
    <!-- End Warning Alert -->
    <form id="update-profile-form" autocomplete="off" class="flex w-full flex-col justify-between" @submit.prevent>
      <cf-horizontal-separator class="mb-2 mt-4">
        <span class="mx-2 font-bold uppercase tracking-wide">Credentials</span>
      </cf-horizontal-separator>
      <!-- Start email and mobile number -->
      <div class="flex flex-col sm:flex-row">
        <div class="mb-2 w-full sm:mr-2">
          <!-- Note: We have @focusin for email and username to prevent too many API calls to check for uniqueness -->
          <cf-text-input
            :id="getId('email-input')"
            v-model="payload.email"
            name="register-email-input"
            label="Email"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.email.$invalid"
            :invalid-text="validator.email.$errors[0]?.$message"
            @blur="validator.email.$touch"
            @focusin="validator.email.$dirty = false"
          >
          </cf-text-input>
        </div>
        <div class="mb-2 w-full sm:ml-2">
          <cf-text-input
            :id="getId('mobile-number-input')"
            v-model="payload.mobile_number"
            name="mobile-number"
            label="Mobile Number"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            mask="+63 ### ### ####"
            :invalid="validator.mobile_number.$invalid"
            :invalid-text="validator.mobile_number.$errors[0]?.$message"
            initial-value="+63"
            @blur="validator.mobile_number.$touch"
            @focusin="validator.email.$dirty = false"
          >
          </cf-text-input>
        </div>
      </div>
      <!-- End email and mobile_number -->

      <!-- Start Basic info -->
      <cf-horizontal-separator class="mb-2 mt-8">
        <span class="mx-2 font-bold uppercase tracking-wide">Basic Information</span>
      </cf-horizontal-separator>
      <!-- Start first name and last name -->
      <div class="flex flex-col sm:flex-row">
        <div class="mb-2 w-full sm:mr-2">
          <cf-text-input
            :id="getId('first-name-input')"
            v-model="payload.first_name"
            name="first-name"
            label="First name"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.first_name.$invalid"
            :invalid-text="validator.first_name.$invalid ? validator.first_name.$errors[0].$message : null"
            @blur="validator.first_name.$touch"
          ></cf-text-input>
        </div>
        <div class="mb-2 w-full sm:ml-2">
          <cf-text-input
            :id="getId('last-name-input')"
            v-model="payload.last_name"
            name="last-name"
            label="Last name"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.last_name.$invalid"
            :invalid-text="validator.last_name.$invalid ? validator.last_name.$errors[0].$message : null"
            @blur="validator.last_name.$touch"
          ></cf-text-input>
        </div>
      </div>
      <!-- End first name and last name -->
      <!-- Start middle name and ext name -->
      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:mr-2">
          <cf-text-input
            :id="getId('middle-name-input')"
            v-model="payload.middle_name"
            name="middle-name"
            label="Middle name"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.middle_name.$invalid"
            :invalid-text="validator.middle_name.$invalid ? validator.middle_name.$errors[0].$message : null"
            @blur="validator.middle_name.$touch"
          ></cf-text-input>
        </div>
        <div class="w-full sm:ml-2">
          <cf-text-input
            :id="getId('ext-name-input')"
            v-model="payload.ext_name"
            name="ext-name"
            label="Ext. Name"
            class="text-sm"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.ext_name.$invalid"
            :invalid-text="validator.ext_name.$invalid ? validator.ext_name.$errors[0].$message : null"
            @blur="validator.ext_name.$touch"
          ></cf-text-input>
        </div>
      </div>
      <!-- End middle name and ext name -->
      <!-- Start gender and birthday -->
      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:mr-2">
          <cf-select-box
            :id="getId('sex-input')"
            v-model="payload.sex"
            name="sex"
            class="text-sm"
            label="Sex"
            :options="genderOptions"
            :disabled="!profileEditingEnabled"
          />
        </div>
        <div class="w-full sm:ml-2">
          <cf-text-input
            :id="getId('birthday-input')"
            v-model="payload.birthday"
            name="birthday"
            label="Birthday"
            class="text-sm"
            mask="####-##-##"
            eager-mask
            initial-value="yyyy-mm-dd"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.birthday.$invalid"
            :invalid-text="validator.birthday.$invalid ? validator.birthday.$errors[0].$message : null"
            @blur="validator.birthday.$touch"
          ></cf-text-input>
        </div>
      </div>
      <!-- End gender and birthday -->
      <!-- End basic info -->

      <!-- Start address -->
      <cf-horizontal-separator class="mb-2 mt-8">
        <span class="mx-2 font-bold uppercase tracking-wide">Address</span>
      </cf-horizontal-separator>
      <!-- Start Region and Postal Code -->
      <div class="flex flex-col sm:flex-row">
        <div class="mb-2 w-full sm:mr-2">
          <cf-text-input
            :id="getId('postal-code-input')"
            v-model="payload.postal_code"
            name="postal-code"
            label="Zip Code"
            text-classes="text-sm"
            mask="####"
            :disabled="!profileEditingEnabled"
            :invalid="validator.postal_code.$invalid"
            :invalid-text="validator.postal_code.$invalid ? validator.postal_code.$errors[0].$message : null"
            @blur="validator.postal_code.$touch"
          ></cf-text-input>
        </div>
        <div class="mb-2 w-full sm:ml-2">
          <cf-combo-box
            :id="getId('region-input')"
            v-model="payload.region_id"
            name="region"
            label="Region"
            text-classes="text-sm"
            :is-loading="regionOptionsIsLoading"
            :disabled="regionOptionsIsLoading || !profileEditingEnabled"
            :options="regionOptions"
          ></cf-combo-box>
        </div>
      </div>
      <!-- End Region and Postal Code -->
      <!-- Start City and Province -->
      <div class="flex flex-col sm:flex-row">
        <div class="mb-2 w-full sm:mr-2">
          <cf-combo-box
            :id="getId('province-input')"
            v-model="payload.province_id"
            name="province"
            label="Province"
            text-classes="text-sm"
            :is-loading="provinceOptionsIsLoading"
            :disabled="provinceOptionsIsLoading || !profileEditingEnabled"
            :options="provinceOptionsBySelectedRegion"
          ></cf-combo-box>
        </div>
        <div class="mb-2 w-full sm:ml-2">
          <cf-combo-box
            :id="getId('city-input')"
            v-model="payload.city_id"
            name="city"
            label="City or Municipality"
            text-classes="text-sm"
            :is-loading="cityOptionsIsLoading"
            :disabled="cityOptionsIsLoading || !profileEditingEnabled"
            :options="cityOptionsBySelectedProvince"
            :filter-limit="15"
          ></cf-combo-box>
        </div>
      </div>
      <!-- End City and Province -->
      <!-- Start Home Address & Barangay -->
      <div class="flex flex-col sm:flex-row">
        <div class="mb-2 w-full sm:mr-2">
          <cf-combo-box
            :id="getId('barangay-input')"
            v-model="payload.barangay_id"
            name="barangay"
            label="Barangay"
            text-classes="text-sm"
            :is-loading="barangayOptionsIsLoading"
            :disabled="barangayOptionsIsLoading || !profileEditingEnabled"
            :options="barangayOptionsBySelectedCity"
            :filter-limit="15"
          ></cf-combo-box>
        </div>
        <div class="mb-2 w-full sm:ml-2">
          <cf-text-input
            :id="getId('home-address-input')"
            v-model="payload.home_address"
            name="home-address"
            label="Home Address"
            text-classes="text-sm"
            :disabled="!profileEditingEnabled"
            :invalid="validator.home_address.$invalid"
            :invalid-text="validator.home_address.$invalid ? validator.home_address.$errors[0].$message : null"
            @blur="validator.home_address.$touch"
          ></cf-text-input>
        </div>
      </div>
      <!-- End Home Address & Barangay -->
      <!-- Start action buttons -->
      <div class="mb-1 mt-8 flex w-full justify-end lg:mt-8">
        <cf-button
          :id="getId('register-button')"
          class="w-[35%] bg-theme-primary text-sm text-theme-inverted lg:w-auto lg:px-10"
          :is-loading="isLoading"
          :disabled="!profileEditingEnabled"
          @click="handleFormSubmission"
        >
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-edit" class="mr-1.5 h-3 w-3 font-light" />
          </template>
          Update
        </cf-button>
      </div>
      <!-- End action buttons -->
    </form>
  </div>
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import CfComboBox from '@/components/campfire/inputs/CfComboBox.vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import CfSelectBox from '@/components/campfire/inputs/CfSelectBox.vue'
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import {
  useE164PhoneFormat,
  useGetGlobalStringMaxLength,
  usePrependOrAppendOnce,
  useSleep,
} from '@/composables/helpers.js'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { email, helpers, maxLength, required } from '@vuelidate/validators'
import {
  useDateFormatRule,
  useDigitCountRule,
  useMobilePhoneRule,
  useUniqueUserIdentifierRule,
  useMaxDateTodayRule,
} from '@/composables/custom-validations.js'
import { useVuelidate } from '@vuelidate/core'
import { useProfileStore } from '@/stores/profile.js'
import { useParseApiResponseError } from '@/composables/error-handler.js'
import { useGlobalStore } from '@/stores/global.js'
import { usePublicStore } from '@/stores/public.js'
import { useAuthStore } from '@/stores/auth.js'
import CfToggleSwitch from '@/components/campfire/buttons/CfToggleSwitch.vue'
import { storeToRefs } from 'pinia'

const getId = usePrependOrAppendOnce('components-profile-update-profile-form')
const authStore = useAuthStore()

const payload = reactive({
  email: authStore.authenticatedUser?.email,
  mobile_number: authStore.authenticatedUser?.user_profile?.mobile_number || null,
  first_name: authStore.authenticatedUser?.user_profile?.first_name,
  last_name: authStore.authenticatedUser?.user_profile?.last_name,
  middle_name: authStore.authenticatedUser?.user_profile?.middle_name,
  ext_name: authStore.authenticatedUser?.user_profile?.ext_name,
  birthday: authStore.authenticatedUser?.user_profile?.birthday || null,
  sex: authStore.authenticatedUser?.user_profile?.sex || null,
  home_address: authStore.authenticatedUser?.user_profile?.address?.home_address || null,
  city_id: authStore.authenticatedUser?.user_profile?.address?.city?.id || null,
  province_id: authStore.authenticatedUser?.user_profile?.address?.province?.id || null,
  region_id: authStore.authenticatedUser?.user_profile?.address?.region?.id || null,
  postal_code: authStore.authenticatedUser?.user_profile?.address?.postal_code || null,
  barangay_id: authStore.authenticatedUser?.user_profile?.address?.barangay?.id || null,
})

// Handle validation
const globalStringMaxLength = useGetGlobalStringMaxLength()
const globalStringMaxLengthRule = helpers.withMessage(
  `Must not exceed ${globalStringMaxLength} characters`,
  maxLength(globalStringMaxLength)
)
const formRules = {
  $lazy: true,
  email: {
    required: helpers.withMessage('Please enter your email address', required),
    email: helpers.withMessage('Email format is invalid', email),
    unique: helpers.withAsync(
      helpers.withMessage(
        'This email is already taken',
        useUniqueUserIdentifierRule('email', authStore.authenticatedUser?.id)
      )
    ),
  },
  mobile_number: {
    mobile_number: helpers.withMessage('Must be a valid PH mobile number', useMobilePhoneRule),
    unique: helpers.withAsync(
      helpers.withMessage(
        'This mobile number is already taken',
        useUniqueUserIdentifierRule('mobile_number', authStore.authenticatedUser?.id)
      )
    ),
  },
  first_name: {
    required: helpers.withMessage('Please enter your first name', required),
    maxLength: globalStringMaxLengthRule,
  },
  last_name: {
    required: helpers.withMessage('Please enter your last name', required),
    maxLength: globalStringMaxLengthRule,
  },
  middle_name: {
    maxLength: globalStringMaxLengthRule,
  },
  ext_name: {
    maxLength: globalStringMaxLengthRule,
  },
  birthday: {
    date_format: helpers.withMessage('Valid format is yyyy-mm-dd (1997-12-31)', useDateFormatRule),
    max_date: helpers.withMessage('Must not be greater than today', useMaxDateTodayRule),
  },
  home_address: {
    maxLength: globalStringMaxLengthRule,
  },
  postal_code: {
    digitCount: helpers.withMessage('Enter your 4-digit zip code', useDigitCountRule(4)),
  },
}

const validator = useVuelidate(formRules, payload)
const showErrorAlert = ref(false)
const errorMessage = ref(null)
const errorDetails = ref(null)

// handle form submission
const isLoading = ref(false)

const profileStore = useProfileStore()
const globalStore = useGlobalStore()
const profileEditingEnabled = ref(false)
const handleFormSubmission = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return window.scrollTo({ top: 0, behavior: 'smooth' })

  isLoading.value = true
  // format the mobile number
  payload.mobile_number = useE164PhoneFormat(payload.mobile_number)

  // update profile
  const response = await profileStore.updateProfile(payload)
  if (!response.success) {
    const { message, errors } = useParseApiResponseError(response)
    showErrorAlert.value = true
    errorMessage.value = message
    errorDetails.value = errors
    await useSleep(0.2)
    isLoading.value = false
    return window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  isLoading.value = false

  profileEditingEnabled.value = false
  clearAlertPanels()

  globalStore.pushToastMessage({
    title: 'Profile update',
    description: 'You have successfully updated your profile information',
    timeout: 6000,
    type: 'success',
    iconClass: 'fa-solid fa-circle-check',
  })

  return window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearAlertPanels = () => {
  showErrorAlert.value = false
  errorMessage.value = null
  errorDetails.value = null
}

// Start combo and select box options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

// Address fields
const publicStore = usePublicStore()
const {
  barangayOptions,
  barangayOptionsIsLoading,
  cityOptions,
  cityOptionsIsLoading,
  regionOptions,
  regionOptionsIsLoading,
  provinceOptions,
  provinceOptionsIsLoading,
} = storeToRefs(publicStore)

const barangayOptionsBySelectedCity = computed(() => {
  let filteredBarangays = barangayOptions.value
  if (payload.city_id) {
    filteredBarangays = filteredBarangays.filter((barangay) => barangay.parent_id === payload.city_id)
  }

  return filteredBarangays
})

const cityOptionsBySelectedProvince = computed(() => {
  let filteredCities = cityOptions.value
  if (payload.province_id) {
    filteredCities = filteredCities.filter((city) => city.parent_id === payload.province_id)
  }

  return filteredCities
})

const provinceOptionsBySelectedRegion = computed(() => {
  let filteredProvinces = provinceOptions.value
  if (payload.region_id) {
    filteredProvinces = filteredProvinces.filter((province) => province.parent_id === payload.region_id)
  }

  return filteredProvinces
})

// check if selected province is still in the filtered list when region is changed
watch(
  () => payload.region_id,
  (newRegion) => {
    if (!newRegion) return

    const provinceStillInList = !!provinceOptionsBySelectedRegion.value.find((p) => p.value === payload.province_id)
    if (!provinceStillInList && payload.province_id) {
      payload.province_id = null
    }
  }
)

// check if selected city is still in the filtered list when province is changed
watch(
  () => payload.province_id,
  (newProvince) => {
    if (!newProvince) return

    const cityStillInList = !!cityOptionsBySelectedProvince.value.find((c) => c.value === payload.city_id)
    if (!cityStillInList && payload.city_id) {
      payload.city_id = null
    }
  }
)

// check if selected barangay is still in the filtered list when city is changed
watch(
  () => payload.city_id,
  (newCity) => {
    if (!newCity) return

    const barangayStillInList = !!barangayOptionsBySelectedCity.value.find((b) => b.value === payload.barangay_id)
    if (!barangayStillInList && payload.barangay_id) {
      payload.barangay_id = null
    }
  }
)

onBeforeMount(async () => {
  await Promise.allSettled([
    publicStore.fetchBarangays(),
    publicStore.fetchProvinces(),
    publicStore.fetchCities(),
    publicStore.fetchRegions(),
  ])
})
</script>
