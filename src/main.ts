import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import './styles/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .use(VueQueryPlugin)
  .use(i18n)
  .mount('#app')
