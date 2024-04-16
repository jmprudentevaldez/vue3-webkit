<template>
  <div class="tracking-loose mb-4 ml-2 flex text-xs md:mb-0 md:ml-0">
    <div v-for="link in props.links" :key="link.name">
      <span :class="`underline-offset-4 hover:underline ${link.current ? 'underline' : ''}`">
        <router-link :to="{ name: link.name.toLowerCase() }">{{ link.label }}</router-link>
        <font-awesome-icon v-if="!link.current" icon="fa-solid fa-caret-right" class="mx-1.5"></font-awesome-icon>
      </span>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  links: {
    type: Array,
    required: true,
    validator(links) {
      const requiredKeys = ['name', 'label']
      for (const link of links) {
        // Each object must have a name and label properties
        const foundAll = requiredKeys.every((el) => Object.keys(link).includes(el))
        if (!foundAll) {
          console.warn('CfBreadcrumbs `links` prop: All objects must have the `name` and `label` props')
          return false
        }
      }

      // Exactly one object must have a `current`
      const currentKeysFound = links.filter((link) => link.current)
      if (currentKeysFound.length !== 1) {
        console.warn('CfBreadcrumbs `links` prop: Exactly one object should have the `current` key')
        return false
      }

      return true
    },
  },
})
</script>
