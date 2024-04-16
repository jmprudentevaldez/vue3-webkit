<template>
  <!-- Start alert -->
  <transition
    enter-active-class="transition duration-200"
    enter-from-class="scale-50 opacity-0"
    leave-to-class="opacity-0"
  >
    <cf-alert-panel
      v-model="showErrorAlert"
      :dismiss-button-id="getId('dismiss-alert-button')"
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
  <!-- End alert -->
  <div v-if="!showErrorAlert">
    <p class="font-bold">Welcome to Campfire!</p>
    <p class="mt-1 text-sm text-theme-muted">Please fill-in this short form accurately to create your account</p>
  </div>
  <form id="register-page-form" autocomplete="off" class="flex w-full flex-col justify-between" @submit.prevent>
    <!-- Start Credentials -->
    <cf-horizontal-separator class="mt-8">
      <font-awesome-icon icon="fa-solid fa-key" class="mr-1 text-xs"></font-awesome-icon>
      <span class="font-bold tracking-wide">Credentials</span>
    </cf-horizontal-separator>
    <!-- Start email and mobile number -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:mr-2">
        <!-- Note: We have @focusin for email and username to prevent too many API calls to check for uniqueness -->
        <cf-text-input
          :id="getId('email-input')"
          v-model="payload.email"
          placeholder="your_email@example.com"
          name="register-email-input"
          label="Email *"
          text-classes="text-sm"
          :invalid="validator.email.$invalid"
          :invalid-text="validator.email.$errors[0]?.$message"
          @blur="validator.email.$touch"
          @focusin="validator.email.$dirty = false"
        >
        </cf-text-input>
      </div>
      <div class="w-full sm:ml-2">
        <cf-text-input
          :id="getId('mobile-number-input')"
          v-model="payload.mobile_number"
          placeholder="+63 906 345 2212"
          name="mobile-number"
          label="Mobile Number"
          mask="+63 ### ### ####"
          text-classes="text-sm"
          initial-value="+63"
          :invalid="validator.mobile_number.$invalid"
          :invalid-text="validator.mobile_number.$errors[0]?.$message"
          @blur="validator.mobile_number.$touch"
          @focusin="validator.mobile_number.$dirty = false"
        >
        </cf-text-input>
      </div>
    </div>
    <!-- End email and mobile_number -->
    <!-- Start password and confirmation -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:mr-2">
        <cf-text-input
          :id="getId('password-input')"
          v-model="payload.password"
          name="password"
          label="Password *"
          type="password"
          text-classes="text-sm"
          :invalid="validator.password.$invalid"
          :invalid-text="validator.password.$invalid ? validator.password.$errors[0].$message : null"
          @blur="validator.password.$touch"
        ></cf-text-input>
      </div>
      <div class="w-full sm:ml-2">
        <cf-text-input
          :id="getId('password-confirmation-input')"
          v-model="payload.password_confirmation"
          name="password-confirmation"
          label="Confirm Password *"
          type="password"
          text-classes="text-sm"
          :invalid="validator.password_confirmation.$invalid"
          :invalid-text="
            validator.password_confirmation.$invalid ? validator.password_confirmation.$errors[0].$message : null
          "
          @blur="validator.password_confirmation.$touch"
          @keydown.enter.prevent="handleFormSubmission"
        ></cf-text-input>
      </div>
    </div>
    <!-- End password and confirmation-->
    <!-- End credentials -->

    <!-- Start Basic info -->
    <cf-horizontal-separator class="mt-8">
      <font-awesome-icon icon="fa-solid fa-id-badge" class="mr-1 text-xs"></font-awesome-icon>
      <span class="font-bold tracking-wide">Basic Information</span>
    </cf-horizontal-separator>
    <!-- Start first name and last name -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:mr-2">
        <cf-text-input
          :id="getId('first-name-input')"
          v-model="payload.first_name"
          placeholder="Juan III"
          name="first-name"
          label="First name *"
          text-classes="text-sm"
          :invalid="validator.first_name.$invalid"
          :invalid-text="validator.first_name.$invalid ? validator.first_name.$errors[0].$message : null"
          @blur="validator.first_name.$touch"
        ></cf-text-input>
      </div>
      <div class="w-full sm:ml-2">
        <cf-text-input
          :id="getId('last-name-input')"
          v-model="payload.last_name"
          placeholder="Dela Cruz"
          name="last-name"
          label="Last name *"
          text-classes="text-sm"
          class="text-sm"
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
          placeholder="Luna"
          name="middle-name"
          label="Middle name"
          text-classes="text-sm"
          :invalid="validator.middle_name.$invalid"
          :invalid-text="validator.middle_name.$invalid ? validator.middle_name.$errors[0].$message : null"
          @blur="validator.middle_name.$touch"
        ></cf-text-input>
      </div>
      <div class="w-full sm:ml-2">
        <cf-text-input
          :id="getId('ext-name-input')"
          v-model="payload.ext_name"
          placeholder="Jr."
          name="ext-name"
          label="Ext. Name"
          class="text-sm"
          text-classes="text-sm"
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
        />
      </div>
      <div class="w-full sm:ml-2">
        <cf-text-input
          :id="getId('birthday-input')"
          v-model="payload.birthday"
          placeholder="1997-12-31"
          name="birthday"
          label="Birthday"
          class="text-sm"
          mask="####-##-##"
          eager-mask
          initial-value="yyyy-mm-dd"
          text-classes="text-sm"
          :invalid="validator.birthday.$invalid"
          :invalid-text="validator.birthday.$invalid ? validator.birthday.$errors[0].$message : null"
          @blur="validator.birthday.$touch"
        ></cf-text-input>
      </div>
    </div>
    <!-- End gender and birthday -->
    <!-- End basic info -->

    <!-- Start address -->
    <cf-horizontal-separator class="mt-8">
      <font-awesome-icon icon="fa-solid fa-location-dot" class="mr-1 text-xs"></font-awesome-icon>
      <span class="font-bold tracking-wide">Address</span>
    </cf-horizontal-separator>
    <!-- Start Region and Postal Code -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:mr-2">
        <cf-text-input
          :id="getId('postal-code-input')"
          v-model="payload.postal_code"
          name="postal-code"
          label="Zip Code"
          text-classes="text-sm"
          mask="####"
          :invalid="validator.postal_code.$invalid"
          :invalid-text="validator.postal_code.$invalid ? validator.postal_code.$errors[0].$message : null"
          @blur="validator.postal_code.$touch"
        ></cf-text-input>
      </div>
      <div class="w-full sm:ml-2">
        <cf-combo-box
          :id="getId('region-input')"
          v-model="payload.region_id"
          name="region"
          label="Region"
          text-classes="text-sm"
          :is-loading="regionOptionsIsLoading"
          :disabled="regionOptionsIsLoading"
          :options="regionOptions"
        ></cf-combo-box>
      </div>
    </div>
    <!-- End Region and Postal Code -->
    <!-- Start City and Province -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:mr-2">
        <cf-combo-box
          :id="getId('province-input')"
          v-model="payload.province_id"
          name="province"
          label="Province"
          text-classes="text-sm"
          :is-loading="provinceOptionsIsLoading"
          :disabled="provinceOptionsIsLoading"
          :options="provinceOptionsBySelectedRegion"
        ></cf-combo-box>
      </div>
      <div class="w-full sm:ml-2">
        <cf-combo-box
          :id="getId('city-input')"
          v-model="payload.city_id"
          name="city"
          label="City or Municipality"
          text-classes="text-sm"
          :is-loading="cityOptionsIsLoading"
          :disabled="cityOptionsIsLoading"
          :options="cityOptionsBySelectedProvince"
          :filter-limit="15"
        ></cf-combo-box>
      </div>
    </div>
    <!-- End City and Province -->
    <!-- Start Home Address & Barangay -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:mr-2">
        <cf-combo-box
          :id="getId('barangay-input')"
          v-model="payload.barangay_id"
          name="barangay"
          label="Barangay"
          text-classes="text-sm"
          :is-loading="barangayOptionsIsLoading"
          :disabled="barangayOptionsIsLoading"
          :options="barangayOptionsBySelectedCity"
          :filter-limit="15"
        ></cf-combo-box>
      </div>
      <div class="w-full sm:ml-2">
        <cf-text-input
          :id="getId('home-address-input')"
          v-model="payload.home_address"
          name="home-address"
          label="Home Address"
          text-classes="text-sm"
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
        class="w-[35%] bg-theme-primary text-sm text-theme-inverted sm:w-[28%] lg:w-[25%]"
        :is-loading="isLoading"
        @click="handleFormSubmission"
      >
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-1.5 h-3 w-3 font-light" />
        </template>
        Register
      </cf-button>
    </div>
    <!-- End action buttons -->
  </form>
</template>

<script setup>
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, minLength, maxLength, sameAs } from '@vuelidate/validators'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import {
  useDateFormatRule,
  useDigitCountRule,
  useMobilePhoneRule,
  usePasswordRule,
  useUniqueUserIdentifierRule,
  useMaxDateTodayRule,
} from '@/composables/custom-validations'
import { useE164PhoneFormat, useGetGlobalStringMaxLength, usePrependOrAppendOnce } from '@/composables/helpers.js'
import { useParseApiResponseError } from '@/composables/error-handler.js'
import { useRouter } from 'vue-router'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import CfSelectBox from '@/components/campfire/inputs/CfSelectBox.vue'
import CfComboBox from '@/components/campfire/inputs/CfComboBox.vue'
import { usePublicStore } from '@/stores/public.js'
import { storeToRefs } from 'pinia'

const getId = usePrependOrAppendOnce('components-authentication-page-register-form')
const auth = useAuthStore()
const router = useRouter()

const payload = reactive({
  email: '',
  mobile_number: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  ext_name: '',
  birthday: '',
  sex: '',
  password: '',
  password_confirmation: '',
  home_address: '',
  barangay_id: '',
  city_id: '',
  province_id: '',
  region_id: '',
  postal_code: '',
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
    unique: helpers.withAsync(helpers.withMessage('This email is already taken', useUniqueUserIdentifierRule('email'))),
  },
  mobile_number: {
    unique: helpers.withAsync(
      helpers.withMessage('This mobile number is already taken', useUniqueUserIdentifierRule('mobile_number'))
    ),
    mobile_number: helpers.withMessage('Must be a valid PH mobile number', useMobilePhoneRule),
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
  password: {
    required: helpers.withMessage('Please enter your password', required),
    minLength: helpers.withMessage('Must be at least 8 characters long', minLength(8)),
    maxLength: helpers.withMessage('Must be a maximum of 50 characters', maxLength(50)),
    password: helpers.withMessage(
      'Must include at least one number, and one uppercase and lowercase letter',
      usePasswordRule()
    ),
  },
  password_confirmation: {
    required: helpers.withMessage('Please confirm your password', required),
    sameAsPassword: helpers.withMessage('Must match the password field', sameAs(computed(() => payload.password))),
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

const handleFormSubmission = async () => {
  const valid = await validator.value.$validate()
  if (!valid) return window.scrollTo({ top: 0, behavior: 'smooth' })

  isLoading.value = true

  // format the mobile number
  if (payload.mobile_number) {
    payload.mobile_number = useE164PhoneFormat(payload.mobile_number)
  }

  const response = await auth.register(payload)
  isLoading.value = false

  if (response.success) {
    return await router.replace({ name: 'verify-email-guard' })
  }

  const { message, errors } = useParseApiResponseError(response)
  showErrorAlert.value = true
  errorMessage.value = message
  errorDetails.value = errors
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
  provinceOptionsIsLoading,
  provinceOptions,
  regionOptions,
  regionOptionsIsLoading,
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
