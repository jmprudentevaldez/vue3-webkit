<template>
  <div
    :class="`${positionClass} fixed z-30 flex h-auto w-full flex-col rounded-2xl px-3 sm:w-[43%] sm:px-0 lg:w-[30%]`"
  >
    <transition-group
      name="toast-messages"
      tag="div"
      enter-active-class="duration-300 ease-out transition-transform"
      enter-from-class="scale-50 opacity-0"
      enter-to-class="opacity-100 scale-100"
    >
      <cf-toast-message
        v-for="toast in globalStore.toastMessages"
        :key="toast.id"
        v-model="toast.show"
        :title="toast.title"
        :description="toast.description"
        :type="toast.type"
        :timeout="toast.timeout"
        :icon-class="toast.iconClass"
      />
    </transition-group>
  </div>
</template>
<script setup>
import CfToastMessage from '@/components/toast-message/CfToastMessage.vue'
import { useGlobalStore } from '@/stores/global'
import { computed } from 'vue'

const positionClass = computed(() => 'top-20 sm:right-4')
const globalStore = useGlobalStore()
</script>
