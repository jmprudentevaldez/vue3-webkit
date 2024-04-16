// Dynamically import all modules under the plugins dir for the side effects
import.meta.glob('@/plugins/*.js', { eager: true })

// Register routes to the vueApp
import '@/router'

// Import custom styles
import '@/assets/css/main.css'

// Finally import the Vue instance that the above imports used
import { vueApp } from '@/app'

vueApp.mount('#app')
