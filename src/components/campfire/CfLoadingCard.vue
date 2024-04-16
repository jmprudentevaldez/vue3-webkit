<template>
  <div class="mx-auto w-full p-6">
    <div v-for="stack in props.numOfStacks" :key="stack" class="flex animate-pulse space-x-4">
      <div class="flex-1 space-y-6 py-1">
        <div :class="`h-2 w-[50%] rounded bg-theme-tooling ${props.linesClasses}`"></div>
        <div class="space-y-3">
          <div :class="`h-2 rounded bg-theme-tooling ${props.linesClasses}`"></div>
          <div class="grid grid-cols-3 gap-4">
            <div :class="`col-span-2 h-2 rounded bg-theme-tooling ${props.linesClasses}`"></div>
            <div :class="`col-span-1 h-2 rounded bg-theme-tooling ${props.lineClasses}`"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div :class="`col-span-1 h-2 rounded bg-theme-tooling ${props.linesClasses}`"></div>
            <div :class="`col-span-2 h-2 rounded bg-theme-tooling ${props.lineClasses}`"></div>
          </div>
          <div class="grid grid-cols-5 gap-4">
            <div :class="`col-span-1 h-2 rounded bg-theme-tooling ${props.linesClasses}`"></div>
            <div :class="`col-span-2 h-2 rounded bg-theme-tooling ${props.lineClasses}`"></div>
            <div :class="`col-span-2 h-2 rounded bg-theme-tooling ${props.lineClasses}`"></div>
          </div>
        </div>
        <div :class="`h-2 w-[90%] rounded bg-theme-tooling ${props.linesClasses}`"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  numOfStacks: {
    type: Number,
    default: 1, // 3 lines per stack
  },
  linesClasses: {
    type: String,
    default: '',
  },
})
</script>
