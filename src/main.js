import { createApp } from 'vue'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'

import Index from '@/components/Index.vue'
import store from '@/store/'
import router from '@/router.js'
import i18n from '@/i18n/'
import '@/icons.js'

await store.dispatch('restoreSession')
const app = createApp(Index)
app.use(store)
app.use(router)
app.use(i18n)
router.app = app
app.mount('#app')
