<template>
  <div>
    <!-- Start fake image -->
    <div v-if="!!props.fake" class="rounded-full">
      <div
        :class="`w-${props.width} h-${props.height} flex items-center justify-center rounded-full bg-theme-primary text-theme-inverted`"
      >
        {{ props.initials || avatarDisplayNamePlaceholder }}
      </div>
    </div>
    <!-- End fake image -->
    <!-- Start real image -->
    <div v-else>
      <div
        :class="`${imageIsLoading ? 'flex' : 'hidden'} h-${props.height} w-${
          props.width
        } items-center justify-center rounded-full bg-theme-primary text-sm text-theme-inverted`"
      >
        <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin"></font-awesome-icon>
      </div>
      <img
        :src="props.src"
        alt="Profile picture"
        :class="`${imageIsLoading ? 'hidden' : 'block'} h-${props.height} w-${props.width} rounded-full object-cover`"
        @load="handleImageLoaded"
      />
    </div>
    <!-- End real image -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from '@/stores/auth.js'
import { storeToRefs } from 'pinia'

const { avatarDisplayNamePlaceholder } = storeToRefs(useAuthStore())

/** Use valid tailwind height and width values */
const props = defineProps({
  fake: {
    type: Boolean,
    default: false,
  },
  src: {
    type: String,
    default: undefined,
  },
  height: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  initials: {
    type: String,
    default: null,
  },
})

const imageIsLoading = ref(true)
const handleImageLoaded = () => {
  imageIsLoading.value = false
}
</script>
