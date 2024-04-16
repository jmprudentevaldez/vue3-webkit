<template>
  <div>
    <!-- Start popup view -->
    <popover class="relative flex">
      <!-- Start button -->
      <popover-button
        class="rounded-full focus:outline-none focus-visible:outline-none focus-visible:only:ring-1 focus-visible:only:ring-theme-primary"
      >
        <div class="relative">
          <button
            class="xs:block nav-base-icon-button h-6 w-6 rounded-3xl text-theme-base focus:outline-none focus-visible:outline-none focus-visible:only:ring-1 focus-visible:only:ring-theme-primary md:hidden lg:block"
          >
            <font-awesome-icon icon="fa-solid fa-bell" />
          </button>
        </div>
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
        <!-- Start panel -->
        <popover-panel
          class="absolute right-0 top-10 z-20 w-72 origin-top-right rounded-lg bg-theme-tooling py-2 text-sm text-theme-tooling"
        >
          <div class="flex w-full">
            <div class="grid w-full grid-cols-1 items-start justify-center px-3 text-theme-tooling">
              <div class="my-4 flex flex-col items-center justify-center text-center italic text-theme-muted">
                <font-awesome-icon icon="fa-solid fa-book-open" class="mb-2 h-6" />
                You don't have any new notifications right now
              </div>
            </div>
          </div>
        </popover-panel>
        <!-- End panel -->
      </transition>
      <!-- End transition for the panel -->
    </popover>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
</script>
