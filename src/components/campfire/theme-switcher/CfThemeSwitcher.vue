<template>
  <div>
    <!-- Start Popover view (desktop) -->
    <popover v-if="props.viewMode === 'popup'" class="relative">
      <!-- Start button -->
      <popover-button
        class="flex items-center rounded-2xl bg-theme-primary px-2 py-1 text-theme-inverted hover:-translate-y-0.5 hover:scale-105 hover:transition-all focus:outline-none focus-visible:outline-none focus-visible:only:ring-1 focus-visible:only:ring-theme-primary"
      >
        <swatch-icon class="mr-1 h-4 w-4 text-theme-inverted" />
        <div>Switch theme</div>
        <chevron-down-icon
          class="ml-0.5 h-5 w-5 text-theme-inverted transition-all duration-300 ui-open:rotate-180 ui-open:transform"
        />
      </popover-button>
      <!-- End button -->
      <!-- Start transition for the panel -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <!-- Start themes list -->
        <popover-panel
          class="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-lg bg-theme-tooling pb-1 text-sm text-theme-tooling"
        >
          <!-- Start theme buttons -->
          <theme-buttons />
          <!-- End theme buttons -->
        </popover-panel>
        <!-- End themes list -->
      </transition>
      <!-- End transition for panel -->
    </popover>
    <!-- End Popover view (desktop) -->

    <!-- Start Dialog view (mobile) -->
    <div v-else>
      <button
        type="button"
        class="flex h-full w-full items-center rounded-2xl py-2 pl-6 pr-4 font-bold text-theme-primary ring-2 ring-theme-primary"
        @click="setDialogIsOpen(true)"
      >
        <swatch-icon class="mr-2 h-4 w-4"></swatch-icon>
        Switch Theme
      </button>
    </div>
    <transition-root appear :show="dialogIsOpen" as="template">
      <main-dialog as="div" class="relative z-20">
        <transition-child
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-theme-tooling bg-opacity-80" />
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
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-theme-tooling bg-opacity-80 p-6 text-left align-middle backdrop-blur-md transition-all"
              >
                <dialog-title as="div" class="text-md mb-2 text-center font-medium text-theme-tooling">
                  <span>Tap on the color scheme you like</span>
                </dialog-title>
                <div class="mt-2">
                  <!-- Start theme buttons -->
                  <theme-buttons />
                  <!-- End theme buttons -->
                </div>

                <div class="mt-4 px-2">
                  <button
                    type="button"
                    class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-theme-primary py-2 text-sm font-medium text-theme-inverted focus:outline-none"
                    @click="setDialogIsOpen(false)"
                  >
                    <font-awesome-icon icon="fa-solid fa-fill-drip" class="mr-1.5 h-3.5 w-3.5"></font-awesome-icon>
                    <span>{{ theme.selectedTheme === 'auto' ? 'Let my browser decide' : 'Apply this theme' }}</span>
                  </button>
                </div>
              </dialog-panel>
            </transition-child>
          </div>
        </div>
      </main-dialog>
    </transition-root>
    <!-- End dialog view (mobile) -->
  </div>
</template>

<script setup>
import ThemeButtons from '@/components/campfire/theme-switcher/ThemeButtons.vue'
import { useThemeStore } from '@/stores/theme.js'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Dialog as MainDialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { ChevronDownIcon, SwatchIcon } from '@heroicons/vue/20/solid'
import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplyTheme } from '@/composables/theme.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const theme = useThemeStore()
const { selectedTheme } = storeToRefs(theme)

const props = defineProps({
  viewMode: {
    type: String,
    default: 'popup',
    validator: (value) => ['popup', 'modal'].includes(value),
  },
})

// Listen for theme selection and change CSS classes accordingly
watch(selectedTheme, () => {
  useApplyTheme(selectedTheme.value, theme.availableThemes)
})

const dialogIsOpen = ref(false)
const emit = defineEmits(['theme-applied'])
const setDialogIsOpen = (value) => {
  dialogIsOpen.value = value
  if (!value) emit('theme-applied')
}
</script>

<style scoped></style>
