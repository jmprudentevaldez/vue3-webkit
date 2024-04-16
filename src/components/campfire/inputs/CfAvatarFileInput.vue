<template>
  <div class="flex flex-col items-center">
    <div>
      <input ref="file" type="file" accept="image/*" class="hidden" @change="handleOnChange" />
      <div class="relative inline-block">
        <!-- Start img display -->
        <template v-if="imageSource">
          <img
            :src="imageSource"
            alt="Avatar"
            class="h-28 w-28 rounded-full object-cover ring-2 ring-theme-primary lg:h-32 lg:w-32"
          />
        </template>
        <!-- End img display -->
        <!-- Start placeholder display -->
        <template v-else>
          <div
            class="flex h-24 w-24 items-center justify-center rounded-full bg-theme-primary text-3xl text-theme-inverted ring-2 ring-theme-primary"
          >
            {{ avatarDisplayNamePlaceholder }}
          </div>
        </template>
        <!-- End placeholder display -->
        <!-- Start browse button -->
        <button
          class="bg-color-black absolute bottom-2 right-0 flex items-center justify-center rounded-full bg-theme-tooling p-1 ring-2 ring-theme-primary transition-all duration-100 hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-success focus-visible:ring-offset-2 focus-visible:ring-offset-theme-section"
          @click="browse"
        >
          <camera-icon class="h-4 text-theme-tooling" />
        </button>
        <!-- End browser button -->
      </div>
    </div>
    <!-- Start action button -->
    <div v-if="showActionButton" class="w-auto lg:w-full">
      <button
        :class="`right-0 mt-1.5 w-full rounded-lg py-0.5 text-sm text-theme-primary ring-2 ring-theme-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-success focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section lg:ring-1 ${
          avatarIsUploading ? 'cursor-not-allowed' : ''
        }`"
        :disabled="avatarIsUploading"
        @click="handleAvatarUpload"
      >
        <template v-if="!avatarIsUploading">
          <font-awesome-icon icon="fa-solid fa-upload" class="ml-4 mr-0.5"></font-awesome-icon>
          <span class="mr-4">Upload</span>
        </template>
        <template v-else>
          <font-awesome-icon icon="fa-solid fa-spinner" class="ml-4 mr-1 animate-spin"></font-awesome-icon>
          <span class="mr-4">Loading</span>
        </template>
      </button>
    </div>
    <!-- End action button -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.js'
import { CameraIcon } from '@heroicons/vue/20/solid'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useProfileStore } from '@/stores/profile.js'
import { useGlobalStore } from '@/stores/global.js'
import { useMaxFileSizeRule, useMimeTypeRule } from '@/composables/custom-validations.js'

const globalStore = useGlobalStore()
const file = ref(null)
const { avatarDisplayNamePlaceholder, authenticatedUser } = storeToRefs(useAuthStore())
const imageSource = ref(authenticatedUser.value?.user_profile?.profile_picture_url)
const avatarIsUploading = ref(false)

const avatarFile = ref(null)
const showActionButton = ref(false)

watch(
  () => avatarFile.value,
  () => {
    if (avatarFile.value) showActionButton.value = true
  }
)

const browse = () => {
  file.value.click()
}

const handleOnChange = (event) => {
  const file = event.target.files[0]
  avatarFile.value = file

  // Check if the file is an image
  if (!useMimeTypeRule(['image/jpeg', 'image/jpg', 'image/svg', 'image/png', 'image/bmp'])(file)) {
    avatarFile.value = null
    globalStore.pushToastMessage({
      title: 'Profile picture',
      description: 'Please select an image file',
      timeout: 10000,
      type: 'error',
      iconClass: 'fa-solid fa-circle-xmark',
    })

    return
  }

  // Image must not exceed 5Mb
  if (!useMaxFileSizeRule(5)(file)) {
    avatarFile.value = null
    globalStore.pushToastMessage({
      title: 'Profile picture',
      description: 'The image must not exceed 5Mb',
      timeout: 10000,
      type: 'error',
      iconClass: 'fa-solid fa-circle-xmark',
    })

    return
  }

  // read the file to display it
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => (imageSource.value = e.target.result)
}

watch(
  () => authenticatedUser.value,
  () => {
    imageSource.value = authenticatedUser.value?.user_profile?.profile_picture_url
  }
)

const profileStore = useProfileStore()
const handleAvatarUpload = async () => {
  avatarIsUploading.value = true

  const formData = new FormData()
  formData.append('photo', avatarFile.value)
  const res = await profileStore.uploadProfilePicture(formData)

  avatarIsUploading.value = false
  showActionButton.value = false

  if (res.success) {
    return globalStore.pushToastMessage({
      title: 'Profile picture',
      description: "You've successfully changed your profile photo",
      timeout: 6000,
      type: 'success',
      iconClass: 'fa-solid fa-circle-check',
    })
  }

  globalStore.pushToastMessage({
    title: 'Profile picture',
    description: res.errors[0]['messages'][0],
    timeout: 6000,
    type: 'error',
    iconClass: 'fa-solid fa-circle-xmark',
  })
}
</script>
