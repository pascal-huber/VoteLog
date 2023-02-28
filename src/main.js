import { createApp } from 'vue'
import { createStore } from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'
// TODO: Check out "mapGetters" for vuex.
// import {mapGetters} from 'vuex';

import { terms } from '@/data.js'
import Index from '@/components/Index.vue'
import router from '@/router.js'
import { addFontAwesomeIcons } from '@/icons.js'
import getters from '@/store/getters.js'
import actions from '@/store/actions.js'
import mutations from '@/store/mutations.js'


addFontAwesomeIcons();
const app = createApp(Index)

const store = createStore({
  state() {
    return {
      connection: undefined,
      client: undefined,
      error: undefined,
      fetchedData: false,
      userVotes: undefined,
      unsavedChanges: false,
      terms: terms,
    }
  },
  getters: getters,
  actions: actions,
  mutations: mutations,
})

router.beforeEach((to, from, next) => {
  store.dispatch("init").then(() => {
    if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn()) {
      next({ name: 'login' })
    } else {
      next()
    }
  });
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
router.app = app;
app.mount('#app')
