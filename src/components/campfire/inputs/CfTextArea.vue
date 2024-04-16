<template>
  <div class="relative mt-6 flex flex-col">
    <!-- Start input field -->
    <label
      :for="props.id"
      :class="`mb-1.5 text-xs text-theme-base ${
        props.disabled ? 'cursor-not-allowed text-opacity-50' : 'cursor-default'
      }`"
    >
      {{ props.label }}
    </label>
    <div class="relative flex">
      <textarea
        :id="props.id"
        ref="inputBox"
        :rows="props.rows"
        :value="props.modelValue"
        :disabled="props.disabled"
        :placeholder="props.label"
        :class="`peer box-border w-full rounded-xl border-none bg-theme-input pl-3 outline-none ${
          props.disabled ? 'cursor-not-allowed text-opacity-50' : 'cursor-text'
        } ${inputStateStyle} py-2.5 text-theme-input placeholder-transparent transition-transform duration-200 focus:ring-1 focus:ring-theme-primary ${
          props.textClasses
        } tracking-wide`"
        @input="emits('update:modelValue', $event.target.value)"
        @blur="emits('blur', $event.target.value)"
        @focus="!$event.target.value ? ($event.target.value = props.initialValue) : ''"
        @focusout="$event.target.value === props.initialValue ? ($event.target.value = null) : ''"
      />
    </div>
    <!-- Start validation messages -->
    <small v-if="props.invalid && props.invalidText" class="ml-1 mt-1.5 text-xs text-theme-error">
      <font-awesome-icon icon="fa-regular fa-circle-xmark" class="mr-0.5"></font-awesome-icon>
      {{ props.invalidText }}
    </small>
    <small v-if="props.success && props.successText" class="ml-1 mt-1.5 text-xs text-theme-success">
      <font-awesome-icon icon="fa-regular fa-circle-check" class="mr-0.5"></font-awesome-icon>
      {{ props.successText }}
    </small>
    <!-- End validation messages -->
    <!-- End input field -->
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emits = defineEmits(['update:modelValue', 'blur'])
const inputBox = ref(null)
const props = defineProps({
  modelValue: {
    type: undefined,
    default: null,
  },
  id: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    default: 3,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  label: {
    type: String,
    default: null,
  },
  textClasses: {
    type: String,
    default: null,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  invalidText: {
    type: String,
    default: null,
  },
  success: {
    type: Boolean,
    default: false,
  },
  successText: {
    type: String,
    default: null,
  },
  border: {
    type: Boolean,
    default: false,
  },
  initialValue: {
    type: String,
    default: null,
  },
})

const inputStateStyle = computed(() => {
  let inputClass = ''

  if (props.invalid) {
    inputClass = 'ring-1 ring-theme-error'
  } else if (props.success) {
    inputClass = 'ring-1 ring-theme-success'
  }

  // append ring color
  if (props.border && !(props.success || props.invalid)) {
    inputClass = 'ring-1 ring-theme-primary'
  }

  return inputClass
})
</script>
