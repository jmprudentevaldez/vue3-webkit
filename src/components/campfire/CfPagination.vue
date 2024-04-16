<template>
  <div v-if="props.pagination" class="flex items-center justify-center">
    <div class="flex flex-col text-xs">
      <div>
        <span
          >Showing Page <span class="font-bold">{{ props.pagination.current_page }}</span> of
          <span class="font-bold">{{ props.pagination.last_page }}</span> of
          <span class="font-bold">{{ props.pagination.total }}</span> entries</span
        >
      </div>
      <div class="mt-2 flex flex-grow">
        <button
          :disabled="!hasPrevPage"
          :class="`flex w-[50%] rounded-l-2xl border-b-2 border-l-2 border-r border-t-2 border-theme-tooling bg-theme-section px-4 py-2 uppercase transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section ${
            hasPrevPage ? 'hover:scale-105' : 'cursor-not-allowed text-theme-muted'
          }`"
          @click="emits('previousSelected', true)"
        >
          Prev
        </button>
        <button
          :disabled="!hasNextPage"
          :class="`flex w-[50%] justify-end rounded-r-2xl border-b-2 border-l border-r-2 border-t-2 border-theme-tooling bg-theme-section px-4 py-2 uppercase transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-primary focus-visible:ring-offset-1 focus-visible:ring-offset-theme-section ${
            hasNextPage ? 'hover:scale-105' : 'cursor-not-allowed text-theme-muted'
          }`"
          @click="emits('nextSelected', true)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emits = defineEmits(['previousSelected', 'nextSelected'])

const props = defineProps({
  pagination: {
    type: [Object, null],
    required: true,
  },
})

const hasNextPage = computed(() => {
  return !!props.pagination.next_page_url
})

const hasPrevPage = computed(() => {
  return !!props.pagination.prev_page_url
})
</script>
