<template>
  <div
    v-if="props.modelValue"
    :class="`flex justify-between rounded-3xl p-4 bg-theme-${props.panelType} text-theme-${props.panelType}-panel`"
  >
    <!-- Start main content -->
    <div class="flex items-center">
      <!-- Start icon -->
      <div class="mr-3 flex">
        <font-awesome-icon :icon="iconName" class="h-5 w-5"></font-awesome-icon>
      </div>
      <!-- End icon -->
      <!-- Start text -->
      <div class="flex flex-col">
        <div class="text-sm font-bold md:text-base md:font-medium">
          <slot></slot>
        </div>
        <div class="mt-1.5 text-xs md:mt-0 md:text-sm">
          <slot name="description"></slot>
        </div>
      </div>
      <!-- End text -->
    </div>
    <!-- End main content -->
    <!-- Start dismiss icon -->
    <cf-button
      v-if="dismissible"
      id="something-button"
      :class="`ml-1 h-5 w-5 text-theme-${props.panelType}-panel transition-all duration-200 hocus:scale-105`"
      icon
      @click="$emit('update:modelValue', false)"
    >
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-xmark"></font-awesome-icon>
      </template>
    </cf-button>
    <!-- End dismiss icon -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CfButton from '@/components/campfire/buttons/CfButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  panelType: {
    type: String,
    default: 'base',
    validator: (value) => {
      return ['base', 'section', 'tooling', 'success', 'error', 'warning', 'info', 'tooling'].includes(value)
    },
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
  dismissButtonId: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

const iconName = computed(() => {
  let iconClass
  switch (props.panelType) {
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
</script>
