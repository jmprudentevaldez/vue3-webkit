<template>
  <div
    v-show="props.modelValue"
    :class="`${colorClass} z-30 mb-3 flex w-full justify-between rounded-2xl p-4 shadow-sm sm:shadow-lg`"
  >
    <div class="flex">
      <div class="mr-2 flex items-center justify-center sm:mr-4">
        <!-- We set a default icon if none is given -->
        <font-awesome-icon :icon="props.iconClass ?? iconName" class="h-6 w-6" />
        <!-- End default icon -->
      </div>
      <div class="flex flex-col justify-center">
        <!-- We make the font bigger if there is no description -->
        <p v-if="props.title" :class="`${props.description ? 'font-bold' : 'font-regular text-base'}`">
          {{ props.title }}
        </p>
        <p v-if="props.description" class="text-xs sm:text-sm">{{ props.description }}</p>
      </div>
    </div>
    <!-- End content -->
    <!-- Start dismiss button -->
    <div class="flex items-center">
      <cf-button :id="getId('dismiss-button')" class="h-6 w-6" icon @click="emit('update:modelValue', false)">
        <font-awesome-icon
          icon="fa-solid fa-xmark hocus:scale-105 duration-200 transition-all border"
        ></font-awesome-icon>
      </cf-button>
    </div>
    <!-- End dismiss button -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('components-campfire-toast-messages-cf-toast-message')

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  timeout: {
    type: Number,
    default: Infinity,
  },
  type: {
    type: String,
    default: 'tooling',
    validator: (value) => {
      return ['info', 'success', 'error', 'warning', 'tooling', 'base', 'section'].includes(value)
    },
  },
  iconClass: {
    type: String,
    default: null,
  },
})

const colorClass = computed(() => {
  return `bg-theme-${props.type} text-theme-${props.type}-panel`
})

const iconName = computed(() => {
  let iconClass
  switch (props.type) {
    case 'success':
      iconClass = 'fa-solid fa-circle-check'
      break
    case 'error':
      iconClass = 'fa-solid fa-circle-xmark'
      break
    case 'info':
      iconClass = 'fa-solid fa-circle-info'
      break
    case 'warning':
      iconClass = 'fa-solid fa-triangle-exclamation'
      break
    default:
      iconClass = 'fa-solid fa-fire-flame-curved'
      break
  }
  return iconClass
})

if (props.timeout !== Infinity) {
  setTimeout(() => {
    emit('update:modelValue', false)
  }, props.timeout)
}
</script>
