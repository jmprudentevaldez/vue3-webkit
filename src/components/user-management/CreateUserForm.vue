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
        class="z-30 mt-6 w-full"
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
    <form
      id="create-new-user"
      ref="addNewUserForm"
      autocomplete="off"
      class="flex w-full flex-col justify-between"
      @submit.prevent
    >
      <cf-horizontal-separator class="mb-2 mt-8">
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
            name="mobile-number"
            label="Mobile Number"
            text-classes="text-sm"
            mask="+63 ### ### ####"
            :invalid="validator.mobile_number.$invalid"
            :invalid-text="validator.mobile_number.$errors[0]?.$message"
            initial-value="+63"
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
      <!-- Start role -->
      <div class="mb-2 flex">
        <div class="w-full sm:mr-2 sm:w-[48.5%]">
          <cf-select-box
            :id="getId('roles-input')"
            v-model="payload.roles"
            multiple
            name="roles"
            class="text-sm"
            label="Roles *"
            :is-loading="rolesOptionsIsLoading"
            :options="rolesOptions"
            :invalid="validator.roles.$invalid"
            :invalid-text="validator.roles.$errors[0]?.$message"
          />
        </div>
      </div>
      <!-- End role -->

      <!-- Start Basic info -->
      <cf-horizontal-separator class="mb-2 mt-8">
        <font-awesome-icon icon="fa-solid fa-id-badge" class="mr-1 text-xs"></font-awesome-icon>
        <span class="font-bold tracking-wide">Basic Information</span>
      </cf-horizontal-separator>
      <!-- Start first name and last name -->
      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:mr-2">
          <cf-text-input
            :id="getId('first-name-input')"
            v-model="payload.first_name"
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
            name="last-name"
            label="Last name *"
            text-classes="text-sm"
            :invalid="validator.last_name.$invalid"
            :invalid-text="validator.last_name.$invalid ? validator.last_name.$errors[0].$message : null"
            @blur="validator.last_name.$touch"
          ></cf-text-input>
        </div>
      </div>
      <!-- End first name and last name -->
      <!-- Start middle name and ext_name -->
      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:mr-2">
          <cf-text-input
            :id="getId('middle-name-input')"
            v-model="payload.middle_name"
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
            name="ext-name"
            label="Ext. name"
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
            name="birthday"
            label="Birthday"
            text-classes="text-sm"
            mask="####-##-##"
            eager-mask
            initial-value="yyyy-mm-dd"
            :invalid="validator.birthday.$invalid"
            :invalid-text="validator.birthday.$invalid ? validator.birthday.$errors[0].$message : null"
            @blur="validator.birthday.$touch"
          ></cf-text-input>
        </div>
      </div>
      <!-- End gender -->
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
      <div class="mb-2 mt-8 flex w-full justify-end lg:mt-8">
        <cf-button
          :id="getId('register-button')"
          class="w-[35%] bg-theme-primary text-sm text-theme-inverted sm:w-[28%] lg:w-[25%]"
          :is-loading="isLoading"
          @click="handleFormSubmission"
        >
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-1.5 h-3 w-3 font-light" />
          </template>
          Submit
        </cf-button>
      </div>
      <!-- End action buttons -->
    </form>
  </div>
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import {
  useE164PhoneFormat,
  useGetGlobalStringMaxLength,
  usePrependOrAppendOnce,
  useSleep,
} from '@/composables/helpers.js'
import CfComboBox from '@/components/campfire/inputs/CfComboBox.vue'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'
import CfSelectBox from '@/components/campfire/inputs/CfSelectBox.vue'
import { computed, reactive, ref, watch } from 'vue'
import { email, helpers, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import {
  useDateFormatRule,
  useDigitCountRule,
  useMobilePhoneRule,
  usePasswordRule,
  useUniqueUserIdentifierRule,
  useMaxDateTodayRule,
} from '@/composables/custom-validations.js'
import { useVuelidate } from '@vuelidate/core'
import { useParseApiResponseError } from '@/composables/error-handler.js'
import { usePublicStore } from '@/stores/public.js'
import CfAlertPanel from '@/components/campfire/CfAlertPanel.vue'
import { useElementVisibility } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings.js'
import { useUsersStore } from '@/stores/users.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'

const getId = usePrependOrAppendOnce('components-user-management-create-user-form')
const emits = defineEmits(['userCreationSubmissionDone'])

const payload = reactive({
  email: null,
  mobile_number: null,
  first_name: null,
  last_name: null,
  middle_name: null,
  ext_name: null,
  birthday: null,
  sex: null,
  home_address: null,
  city_id: null,
  province_id: null,
  region_id: null,
  postal_code: null,
  barangay_id: null,
  roles: [1],
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
    required: helpers.withMessage('Them email address is required', required),
    email: helpers.withMessage('Email format is invalid', email),
    unique: helpers.withAsync(helpers.withMessage('This email is already taken', useUniqueUserIdentifierRule('email'))),
  },
  mobile_number: {
    mobile_number: helpers.withMessage('Must be a valid PH mobile number', useMobilePhoneRule),
    unique: helpers.withAsync(
      helpers.withMessage('This mobile number is already taken', useUniqueUserIdentifierRule('mobile_number'))
    ),
  },
  first_name: {
    required: helpers.withMessage('First name is required', required),
    maxLength: globalStringMaxLengthRule,
  },
  last_name: {
    required: helpers.withMessage('Last name is required', required),
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
  barangay: {
    maxLength: globalStringMaxLengthRule,
  },
  postal_code: {
    digitCount: helpers.withMessage('Enter your 4-digit zip code', useDigitCountRule(4)),
  },
  roles: {
    required: helpers.withMessage('A user must have a role selected', required),
  },
  password: {
    required: helpers.withMessage('Please enter their password', required),
    minLength: helpers.withMessage('Must be at least 8 characters long', minLength(8)),
    maxLength: helpers.withMessage('Must be a maximum of 50 characters', maxLength(50)),
    password: helpers.withMessage(
      'Must include at least one number, and one uppercase and lowercase letter',
      usePasswordRule()
    ),
  },
  password_confirmation: {
    required: helpers.withMessage('Please confirm their password', required),
    sameAsPassword: helpers.withMessage('Must match the password field', sameAs(computed(() => payload.password))),
  },
}

const validator = useVuelidate(formRules, payload)
const showErrorAlert = ref(false)
const errorMessage = ref(null)
const errorDetails = ref(null)
const isLoading = ref(false)
const usersStore = useUsersStore()
const globalStore = useGlobalStore()
const handleFormSubmission = async () => {
  // check if the mobile number is just +63
  if (payload.mobile_number === '+63') {
    payload.mobile_number = null
  }

  // check if birthday is given
  if (payload.birthday === 'yyyy-mm-dd') {
    payload.birthday = null
  }

  const valid = await validator.value.$validate()
  if (!valid) return document.getElementById('create-new-user')?.scrollIntoView({ behavior: 'smooth' })

  isLoading.value = true
  // format the mobile number
  payload.mobile_number = useE164PhoneFormat(payload.mobile_number)

  const response = await usersStore.createUser(payload)
  isLoading.value = false

  if (!response.success) {
    const { message, errors } = useParseApiResponseError(response)
    showErrorAlert.value = true
    errorMessage.value = message
    errorDetails.value = errors
    await useSleep(0.2)
    return document.getElementById(getId('error-alert-panel'))?.scrollIntoView({ behavior: 'smooth' })
  }

  globalStore.pushToastMessage({
    title: 'User Create',
    description: 'You have successfully created a new user',
    timeout: 6000,
    type: 'success',
    iconClass: 'fa-solid fa-circle-check',
  })

  return emits('userCreationSubmissionDone', true)
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const publicStore = usePublicStore()
const {
  barangayOptions,
  barangayOptionsIsLoading,
  cityOptions,
  cityOptionsIsLoading,
  provinceOptions,
  provinceOptionsIsLoading,
  regionOptionsIsLoading,
  regionOptions,
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

const settingsStore = useSettingsStore()
const { rolesOptions, rolesOptionsIsLoading } = storeToRefs(settingsStore)

const addNewUserForm = ref(null)
const targetIsVisible = useElementVisibility(addNewUserForm)

watch(
  () => targetIsVisible.value,
  async () => {
    if (!targetIsVisible.value) return
    // fetch all roles
    await settingsStore.fetchRoles()

    await Promise.allSettled([
      publicStore.fetchBarangays(),
      publicStore.fetchProvinces(),
      publicStore.fetchCities(),
      publicStore.fetchRegions(),
    ])
  }
)
</script>
