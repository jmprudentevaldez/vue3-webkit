<template>
  <div class="flex items-center justify-center">
    <slot name="button">
      <cf-button :id="props.toggleButtonId" class="bg-theme-primary text-sm text-theme-inverted" @click="openModal">
        {{ props.toggleButtonText }}
      </cf-button>
    </slot>
  </div>
  <transition-root appear :show="isOpen" as="template">
    <main-dialog as="div" class="relative z-20" static>
      <transition-child
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-theme-tooling bg-opacity-80 backdrop-blur-md" />
      </transition-child>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <transition-child
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <dialog-panel
              :class="`${
                props.border ? 'border border-theme-primary' : ''
              } w-full max-w-3xl transform overflow-y-visible rounded-2xl bg-theme-section p-6 text-left align-middle shadow-xl transition-all`"
            >
              <dialog-title as="h3" class="text-md font-light leading-6 text-theme-tooling lg:text-xl">
                <div class="align-center flex justify-between py-1">
                  <div class="w-[80%]">
                    <slot name="title"></slot>
                  </div>
                  <div class="flex w-[20%] justify-end">
                    <cf-button
                      :id="getId('close-modal-button')"
                      type="button"
                      class="h-6 w-6 text-theme-base"
                      icon
                      @click="closeModal"
                    >
                      <template #icon>
                        <font-awesome-icon icon="fa-solid fa-xmark"></font-awesome-icon>
                      </template>
                    </cf-button>
                  </div>
                </div>
              </dialog-title>
              <div class="mt-2">
                <slot name="content"></slot>
              </div>
            </dialog-panel>
          </transition-child>
        </div>
      </div>
    </main-dialog>
  </transition-root>
</template>

<script setup>
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog as MainDialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'

const isOpen = ref(false)
const getId = usePrependOrAppendOnce('components-campfire-cf-modal')

const props = defineProps({
  toggleButtonId: {
    type: undefined,
    default: 'components-campfire-cf-modal-open-modal-button',
  },
  toggleButtonText: {
    type: String,
    default: 'Open Modal',
  },
  border: {
    type: Boolean,
    default: false,
  },
})

const closeModal = () => {
  isOpen.value = false
}

const openModal = () => {
  isOpen.value = true
}

defineExpose({
  openModal,
  closeModal,
})
</script>
