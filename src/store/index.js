import { createStore } from 'vuex';
import { terms } from '@/data.js';
// TODO: Check out "mapGetters" for vuex.
// import {mapGetters} from 'vuex';

import getters from './getters.js';
import actions from './actions.js';
import mutations from './mutations.js';

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
            termHash: terms.sort((a, b) => a.hash < b.hash)[0].hash,
        };
    },
    getters: getters,
    actions: actions,
    mutations: mutations,
});

export default store;
