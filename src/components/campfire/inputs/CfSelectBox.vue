<template>
  <div class="relative mt-6 flex flex-col">
    <label
      :for="props.id"
      :class="`mb-1.5 text-xs text-theme-base ${
        props.disabled ? 'cursor-not-allowed text-opacity-50' : 'cursor-default'
      }`"
    >
      {{ props.label }}
    </label>
    <div class="relative flex flex-col">
      <!-- Start List box -->
      <listbox
        :id="props.id"
        v-slot="{ open }"
        :disabled="props.disabled"
        class="w-full"
        :model-value="props.modelValue"
        :multiple="props.multiple"
        @update:model-value="(value) => emits('update:modelValue', value)"
      >
        <div class="relative">
          <listbox-button
            :class="`relative mt-0.5 box-border h-11 w-full rounded-xl bg-theme-input px-3 py-3 text-left text-theme-input outline-none transition-transform duration-200 ${
              open ? 'ring-1 ring-theme-primary' : ''
            } ${inputStateStyle}  ${props.disabled ? 'cursor-not-allowed text-opacity-50' : 'cursor-pointer'}`"
          >
            <span v-if="displayValue" class="block truncate tracking-wide">{{ displayValue }}</span>
            <template v-if="!props.isLoading">
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <chevron-down-icon
                  :class="`h-5 w-5 text-theme-input transition-all duration-300 ${open ? 'rotate-180 transform' : ''} ${
                    props.disabled ? 'text-opacity-50' : ''
                  }`"
                  aria-hidden="true"
                />
              </span>
            </template>
            <template v-else>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <arrow-path-icon
                  :class="`mr-1 h-4 w-4 animate-spin text-theme-input ${
                    props.disabled ? 'cursor-not-allowed text-opacity-50' : ''
                  }`"
                  aria-hidden="true"
                />
              </span>
            </template>
          </listbox-button>
          <div v-show="open">
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-2 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-2 opacity-0"
            >
              <listbox-options
                class="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl bg-theme-input py-1 text-theme-input shadow-lg ring-1 ring-theme-primary focus:outline-none"
                @blur="handleBlur($event)"
              >
                <listbox-option
                  v-for="option in props.options"
                  v-slot="{ active, selected }"
                  :key="option.value"
                  :value="option.value"
                  as="template"
                >
                  <li
                    :class="`relative mx-2 my-1 cursor-pointer select-none rounded-lg py-2 pl-10 pr-4 transition-all ${
                      active ? 'bg-theme-primary text-theme-inverted' : 'text-theme-input'
                    } ${props.disabled ? 'text-opacity-50' : ''}`"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                      option.label
                    }}</span>
                    <span
                      v-if="selected"
                      :class="`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        active ? 'text-theme-inverted' : 'text-theme-primary'
                      } ${props.disabled ? 'text-opacity-50' : ''}`"
                    >
                      <check-icon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </listbox-option>
              </listbox-options>
            </transition>
          </div>
        </div>
      </listbox>
      <!-- End List box -->
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
    </div>
  </div>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { computed } from 'vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useSleep } from '@/composables/helpers.js'
import { ArrowPathIcon } from '@heroicons/vue/20/solid/index.js'

const emits = defineEmits(['update:modelValue', 'blur'])

const props = defineProps({
  modelValue: {
    type: undefined, // This accepts any type
    default: null,
  },
  id: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: [String, Number],
    default: 'Select an option',
  },
  multiple: {
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
  border: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  successText: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const displayValue = computed(() => {
  return props.options
    .filter((option) => {
      if (Array.isArray(props.modelValue)) {
        // noinspection JSUnresolvedFunction
        return props.modelValue.includes(option.value)
      }

      return props.modelValue === option.value
    })
    .map((option) => option.label)
    .join(', ')
})

const inputStateStyle = computed(() => {
  let inputClass = 'focus:ring-1 focus:ring-theme-primary'

  if (props.invalid) {
    inputClass = 'ring-1 ring-theme-error'
  } else if (props.success) {
    inputClass = 'ring-1 ring-theme-success'
  }

  // append ring color
  if (props.border && !(props.success || props.invalid)) {
    inputClass = 'ring-1 ring-theme-section'
  }

  return inputClass
})

const handleBlur = async (event) => {
  // have some delay when selecting from empty to <any value>
  // this is to cure my OCD for the tiny jitter in animation
  await useSleep(0.3)
  emits('blur', event)
}
</script>
