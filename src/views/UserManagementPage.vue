<template>
  <div class="mx-auto max-w-6xl">
    <!-- Start Breadcrumbs -->
    <cf-breadcrumbs
      :links="[
        { name: 'home', label: 'Home' },
        { name: 'admin-tools', label: 'Admin Tools' },
        { name: 'user-management', label: 'User Management', current: true },
      ]"
    >
    </cf-breadcrumbs>
    <!-- End Breadcrumbs -->
    <!-- Start content -->
    <div class="flex w-full flex-col">
      <!-- Start input fields -->
      <div class="mb-4 flex w-full flex-col justify-between md:mb-2 md:flex-row">
        <div class="mt-4 flex items-end justify-end lg:mb-1 lg:mt-0 lg:justify-start">
          <!-- Start new user modal -->
          <cf-modal ref="newUserModal">
            <template #button>
              <cf-button
                :id="getId('add-new-user-button')"
                class="w-28 text-sm text-theme-primary ring-1 ring-theme-primary"
                @click="handleOpenNewUserModal"
              >
                <template #icon>
                  <font-awesome-icon icon="fa-regular fa-square-plus" class="mr-1"></font-awesome-icon>
                </template>
                <span>New User</span>
              </cf-button>
            </template>
            <template #title> Create a User</template>
            <template #content>
              <create-user-form @user-creation-submission-done="handleCreatedUserSubmission" />
            </template>
          </cf-modal>
          <!-- End new user modal -->
        </div>
        <div class="flex flex-col justify-end md:flex-row">
          <div class="mx-1 flex items-center md:mr-4">
            <cf-select-box
              :id="getId('role-field')"
              v-model="roleFilter"
              :options="rolesOptions"
              label="Filter by Role"
              :disabled="isLoading"
              class="w-full text-sm md:w-52"
            />
          </div>
          <div class="ml-1.5 flex w-full items-center md:ml-0">
            <cf-text-input
              :id="getId('search-input-group')"
              v-model="searchQuery"
              name="search-input"
              :disabled="isLoading"
              label="Find by name or email"
              suffix="Search"
              text-classes="text-sm"
              class="w-full"
              @keyup.enter.prevent="handleSearchUser"
            >
            </cf-text-input>
            <cf-tooltip>
              <template #tooltip-target>
                <cf-button
                  :id="getId('search-button')"
                  :is-loading="isLoading"
                  class="ml-1 mt-10 p-0.5 text-sm"
                  @click="handleSearchUser"
                >
                  <template #icon>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="mr-0.5" />
                    <span class="mx-1">Search</span>
                  </template>
                </cf-button>
              </template>
              <template #tooltip-text> Ignores any filters set</template>
            </cf-tooltip>
          </div>
        </div>
      </div>
      <!-- End input fields -->
      <div
        v-if="!isLoading"
        class="mt-6 grid w-full grid-cols-1 gap-4 rounded-2xl md:mt-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <user-card v-for="user in usersStore.users" :key="user.id" :user="user" />
      </div>
      <div v-else class="grid w-full grid-cols-1 gap-4 rounded-2xl md:grid-cols-2 lg:grid-cols-3">
        <cf-loading-card class="mt-6 rounded-3xl bg-theme-section" />
        <cf-loading-card class="mt-6 hidden rounded-3xl bg-theme-section md:block" />
        <cf-loading-card class="mt-6 hidden rounded-3xl bg-theme-section lg:block" />
      </div>
      <div
        v-if="!isLoading && usersStore.users?.length === 0"
        class="mt-6 flex w-full flex-col items-center justify-center rounded-2xl md:mt-8"
      >
        <p>
          <font-awesome-icon icon="fa-solid fa-book-open" class="mb-2 mr-1 h-10"></font-awesome-icon>
        </p>
        <p class="italic">Your search or filter gave no results</p>
      </div>
      <!-- Start pagination -->
      <cf-pagination
        v-if="usersStore.pagination?.total > 0"
        class="mt-8 md:mt-12"
        :pagination="usersStore.pagination"
        @next-selected="handlePaginationNext"
        @previous-selected="handlePaginationPrev"
      />
      <!-- End pagination -->
    </div>
    <!-- End content -->
  </div>
</template>

<script setup>
import CfBreadcrumbs from '@/components/campfire/CfBreadcrumbs.vue'
import { usePrependOrAppendOnce } from '@/composables/helpers.js'
import { onBeforeMount, ref, watch } from 'vue'
import CfButton from '@/components/campfire/buttons/CfButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUsersStore } from '@/stores/users.js'
import UserCard from '@/components/user-management/UserCard.vue'
import CfSelectBox from '@/components/campfire/inputs/CfSelectBox.vue'
import CfPagination from '@/components/campfire/CfPagination.vue'
import CfTextInput from '@/components/campfire/inputs/CfTextInput.vue'
import CfTooltip from '@/components/campfire/CfTooltip.vue'
import CfLoadingCard from '@/components/campfire/CfLoadingCard.vue'
import { storeToRefs } from 'pinia'
import CfModal from '@/components/campfire/CfModal.vue'
import CreateUserForm from '@/components/user-management/CreateUserForm.vue'
import { useSettingsStore } from '@/stores/settings.js'
import { useGlobalStore } from '@/stores/global.js'

const getId = usePrependOrAppendOnce('vies-user-management-page')

const searchQuery = ref(null)
const usersStore = useUsersStore()

const { roleFilter, isLoading } = storeToRefs(usersStore)
const { rolesOptions } = storeToRefs(useSettingsStore())
const globalStore = useGlobalStore()

onBeforeMount(async () => {
  await usersStore.initMyRegistrationPageComponentData()
})

const handleSearchUser = async () => {
  isLoading.value = true

  if (!searchQuery.value) {
    await usersStore.fetchUsers(roleFilter.value)
    return (isLoading.value = false)
  }

  await usersStore.searchUsers(searchQuery.value)
  isLoading.value = false

  globalStore.pushToastMessage({
    title: 'Search Users',
    description: 'Note that role filters are ignored',
    timeout: 3000,
    type: 'info',
    iconClass: 'fa-solid fa-circle-check',
  })
}

watch(
  () => roleFilter.value,
  async () => {
    isLoading.value = true
    searchQuery.value = null
    await usersStore.fetchUsers(roleFilter.value)
    isLoading.value = false
  }
)

const handlePaginationNext = async () => {
  isLoading.value = true
  await usersStore.loadUsersFromPagination(usersStore.pagination.next_page_url)
  isLoading.value = false
}

const handlePaginationPrev = async () => {
  isLoading.value = true
  await usersStore.loadUsersFromPagination(usersStore.pagination.prev_page_url)
  isLoading.value = false
}

const newUserModal = ref(null)
const handleOpenNewUserModal = () => {
  newUserModal.value.openModal()
}

const handleCreatedUserSubmission = () => {
  newUserModal.value.closeModal()
}
</script>
