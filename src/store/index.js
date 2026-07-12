import { createStore } from 'vuex'
// TODO: Check out "mapGetters" for vuex.
// import {mapGetters} from 'vuex';

import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

const store = createStore({
  state() {
    return {
      client: undefined,
      webDav: undefined,
      userName: undefined,
      error: undefined,
      fetchedData: false,
      userVotes: undefined,
      unsavedChanges: false,
      terms: [], // lazily filled cache of fetched legislaturen, see ensureTerm/ensureCurrentTerm
    }
  },
  getters: getters,
  actions: actions,
  mutations: mutations,
})

export default store
