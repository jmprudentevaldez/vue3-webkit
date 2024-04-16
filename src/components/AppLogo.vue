<template>
  <div class="flex items-center">
    <div class="mb-0.5 mr-2 rounded-3xl p-0.5 ring-2 ring-theme-primary">
      <fire-icon :class="`text-theme-primary ${'w-' + props.iconSize + ' h-' + props.iconSize}`" />
    </div>
    <h5 class="font-logo tracking-wide text-theme-base">
      Camp<span class="mr-1 font-extrabold text-theme-primary underline decoration-2 underline-offset-4">fire</span>
    </h5>
    <span v-if="inBeta" class="mb-4 rounded-xl bg-theme-warning px-1 py-0.5 text-xs text-theme-warning-panel"
      >Beta</span
    >
  </div>
</template>

<script setup>
import { FireIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

const props = defineProps({
  iconSize: {
    type: Number,
    default: 6,
  },
})

const inBeta = ref(import.meta.env.VITE_BETA === 'true')
</script>
