<template>
  <div
    class="group relative flex items-center rounded-2xl bg-theme-section p-4 transition-all duration-200 hover:scale-105"
  >
    <!-- Start main content -->
    <div class="flex w-20">
      <cf-avatar
        :width="12"
        :height="12"
        :src="props.user.user_profile.profile_picture_url"
        :fake="!props.user.user_profile.profile_picture_url"
        :initials="avatarInitials"
      />
    </div>
    <div class="flex w-full flex-col">
      <p class="text-theme-primary">{{ props.user.user_profile.full_name }}</p>
      <p class="text-xs">{{ props.user.email }}</p>
      <cf-horizontal-separator class="my-2"></cf-horizontal-separator>
      <!-- Start Roles -->
      <div class="flex flex-wrap justify-end">
        <div
          v-for="role in props.user.roles"
          :key="role.id"
          class="mr-1 mt-1 rounded-lg bg-theme-info px-2 py-0.5 text-xs text-theme-info-panel"
        >
          {{ role.name }}
        </div>
      </div>
      <!-- End Roles -->
    </div>
    <!-- End main content -->
    <!-- Start action button -->
    <cf-modal ref="viewModal">
      <template #button>
        <button
          :id="getId('view-button')"
          class="absolute right-1 hidden h-full w-full rounded-2xl group-hover:block"
          @click="handleOpenModal"
        ></button>
      </template>
      <template #title>
        <p class="font-medium text-theme-base">User Details</p>
      </template>
      <template #content>
        <div class="text-theme-base">
          <update-user-form
            :user="props.user"
            @update-user-form-submitted="handleCloseModal"
            @user-deleted="handleCloseModal"
          />
        </div>
      </template>
    </cf-modal>
    <!-- End action button -->
  </div>
</template>

<script setup>
import CfAvatar from '@/components/campfire/CfAvatar.vue'
import { computed, ref } from 'vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import CfModal from '@/components/campfire/CfModal.vue'
import UpdateUserForm from '@/components/user-management/UpdateUserForm.vue'
import CfHorizontalSeparator from '@/components/campfire/separators/CfHorizontalSeparator.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const getId = usePrependOrAppendOnce('components-user-management-user-card-' + props.user.id)
const viewModal = ref(null)

const handleOpenModal = () => {
  viewModal.value.openModal()
}

const handleCloseModal = () => {
  viewModal.value.closeModal()
}

const avatarInitials = computed(() => {
  const names = props.user.user_profile.full_name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }

  return initials
})
</script>
