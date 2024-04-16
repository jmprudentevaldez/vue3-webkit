import { vueApp } from '@/app.js'
import { createPinia } from 'pinia'

const pinia = createPinia()
vueApp.use(pinia)
