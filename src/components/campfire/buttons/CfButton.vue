<template>
  <button
    :id="props.id"
    :disabled="props.isLoading || props.disabled"
    :class="`${buttonShapeAndEffectClass} ${buttonSizeClass} flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section`"
  >
    <template v-if="!props.isLoading">
      <slot name="icon"></slot>

      <!-- Implicit default slot for text -->
      <slot v-if="!props.icon"></slot>
    </template>
    <template v-else>
      <font-awesome-icon icon="fa-solid fa-spinner" class="mr-1 animate-spin"></font-awesome-icon>
      <span v-if="props.loadingText">{{ props.loadingText }}</span>
    </template>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  icon: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: null,
  },
  width: {
    type: Number,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Loading',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const buttonShapeAndEffectClass = computed(() => {
  if (props.isLoading || props.disabled) {
    // Disable hover effects if in loading state
    return 'py-2 px-3 rounded-xl text-opacity-[50%] hover:scale-100 hover:-translate-y-0 hover:cursor-not-allowed bg-opacity-70'
  }

  if (props.icon) {
    return 'rounded-3xl hover:scale-125 hover:-translate-y-0.5'
  }

  return 'py-2 px-3 rounded-xl hover:scale-105 hover:-translate-y-0.5'
})

const buttonSizeClass = computed(() => {
  return `${props.height ? 'h-' + props.height : ''} + ${props.width ? 'w-' + props.width : ''}`
})
</script>
