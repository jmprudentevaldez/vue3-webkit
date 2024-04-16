<template>
  <div class="flex items-center">
    <div class="mr-1 mt-7 flex items-center bg-inherit">
      <slot name="prefix"></slot>
    </div>
    <cf-text-input
      :id="getId(props.id)"
      v-model="inputText"
      :name="props.name"
      :disabled="props.disabled"
      :label="props.label"
      :type="props.type"
      :border="props.border"
      :required="props.required"
      :invalid="props.invalid"
      :invalid-text="props.invalidText"
      :success="props.success"
      :success-text="props.successText"
      :mask="props.mask"
      :eager-mask="props.eagerMask"
      :initial-value="props.initialValue"
      :text-classes="props.textClasses"
      class="w-full"
      @blur="$emit('blur', $event)"
    >
    </cf-text-input>
    <div class="mt-7 flex items-center bg-inherit">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script setup>
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import { ref, watch } from 'vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const getId = usePrependOrAppendOnce('components-campfire-inputs-cf-text-input')

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => {
      return ['text', 'password', 'date'].includes(value.toLowerCase())
    },
  },
  required: {
    type: Boolean,
    default: false,
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
  mask: {
    type: String,
    default: null,
  },
  eagerMask: {
    type: Boolean,
    default: false,
  },
  initialValue: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  textClasses: {
    type: String,
    default: '',
  },
})

const inputText = ref(props.modelValue)
const emit = defineEmits(['update:modelValue', 'blur'])
watch(inputText, () => {
  emit('update:modelValue', inputText.value)
})
</script>
