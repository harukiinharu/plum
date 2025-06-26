import { routes } from 'vue-router/auto-routes'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import './styles/main.css'
import './styles/prose.css'
import 'uno.css'

export const createApp = ViteSSG(App, {
  routes,
})
