<template>
  <div class="flex w-full items-center">
    <template v-if="!!slots['default']">
      <div class="separator-h flex-grow"></div>
      <div class="mx-2.5 text-center text-xs font-light text-theme-muted">
        <slot></slot>
      </div>
      <div class="separator-h flex-grow"></div>
    </template>
    <template v-else>
      <div class="separator-h w-full"></div>
    </template>
  </div>
</template>

<script setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>
