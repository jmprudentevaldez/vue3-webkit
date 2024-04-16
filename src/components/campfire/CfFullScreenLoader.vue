<template>
  <main-dialog as="div" class="relative z-20" :open="props.isOpen" :initial-focus="focusableEl">
    <div class="fixed inset-0 bg-theme-tooling bg-opacity-80 backdrop-blur-sm" aria-hidden="true" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <!-- The actual dialog panel -->
      <dialog-panel class="w-full max-w-md">
        <dialog-title class="rounded-xl bg-theme-tooling px-6 py-10 text-center text-xl tracking-widest">
          <font-awesome-icon icon="fa-solid fa-fire" class="h-8 animate-pulse text-theme-primary"></font-awesome-icon>
          <br />
          <span class="animate-pulse text-theme-tooling">Initializing Settings...</span>
          <!-- Start fake focusable element (to get rid of that pesky console warning https://github.com/tailwindlabs/headlessui/issues/265#issuecomment-835888771) -->
          <div ref="focusableEl" class="invisible"></div>
          <!-- End fake focusable element -->
        </dialog-title>
      </dialog-panel>
    </div>
  </main-dialog>
</template>

<script setup>
import { Dialog as MainDialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'

const focusableEl = ref(null)
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})
</script>
