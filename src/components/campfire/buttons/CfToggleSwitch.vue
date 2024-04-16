<template>
  <toggle-switch v-slot="{ checked }" :model-value="props.modelValue" as="template" @update:model-value="handleChange">
    <button
      :id="props.id"
      class="relative inline-flex h-5 w-11 items-center rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section"
      :class="checked ? 'bg-theme-primary' : 'bg-theme-input'"
    >
      <span class="sr-only">{{ props.srOnlyText }}</span>
      <span
        :class="checked ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block flex h-4 w-4 transform items-center justify-center rounded-full bg-theme-base text-theme-base transition"
      >
        <template v-if="checked">
          <slot name="enabledIcon">
            <font-awesome-icon icon="fa-solid fa-check"></font-awesome-icon>
          </slot>
        </template>
        <template v-if="!checked">
          <slot name="disabledIcon">
            <font-awesome-icon icon="fa-solid fa-xmark"></font-awesome-icon>
          </slot>
        </template>
      </span>
    </button>
  </toggle-switch>
</template>

<script setup>
import { Switch as ToggleSwitch } from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: undefined,
    required: true,
  },
  srOnlyText: {
    type: String,
    default: 'Toggle Switch',
  },
})

const handleChange = (value) => {
  emits('update:modelValue', value)
}
</script>
