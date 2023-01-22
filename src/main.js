import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { terms } from '@/data.js'
import { Answer } from '@/Answer.js'

import { createClient } from "webdav";
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'

// TODO: Check out "mapGetters" for vuex. Do I want them?
// import {mapGetters} from 'vuex';

import App from '@/components/App.vue'
// import Analysis from '@/components/Analysis.vue'
import VotesTable from '@/components/VotesTable.vue'
import Index from '@/components/Index.vue'
import Login from '@/components/LoginForm.vue'
import NotFound from '@/components/NotFound.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'

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
  computed: {
    // ...mapGetters(['getUserVote']),
  },
  getters: {
    fetchedData: (state) => () => state.fetchedData,
    getClient: (state) => () => state.client,
    getSubjectByHash: (state) => (term_hash, subject_id) => {
      let term = state.terms.find((term) => term.hash == term_hash);
      return term?.subjects.find((subject) => subject.id == subject_id);
    },
    getTerm: (state) => (term_hash) => {
      let thash = term_hash;
      if (!thash) {
        // TODO: compute defaultTermHash
        thash = "2019_23";
      }
      return state.terms.find(term => term.hash == thash);
    },
    getNextTermHash: (state) => (term_id) => state.terms.find(term => term.id == term_id + 1)?.hash,
    getPrevTermHash: (state) => (term_id) => state.terms.find(term => term.id == term_id - 1)?.hash,
    getConnection: (state) => () => state.connection,
    getTermHash: (state) => () => state.votes[2].hash,
    getUserVotes: (state) => () => state.userVotes,
    getUserVote: (state) => (subjectId) => state.userVotes?.find(vote => vote.id == subjectId),
    getError: (state) => () => state.error,
    hasFetchedData: (state) => () => !!state.fetchedData,
    isLoggedIn: (state) => () => state.client != undefined,
    unsavedChanges: (state) => () => state.unsavedChanges,
  },
  actions: {
    async init() {
      if (!this.getters.isLoggedIn()) {
        let webDav = sessionStorage.getItem("webDav");
        let userName = sessionStorage.getItem("userName");
        let password = sessionStorage.getItem("password");
        if (webDav != "null" && webDav != undefined) {
          await store.dispatch("login", {
            webDav: webDav,
            userName: userName,
            password: password,
          });
        }
      }
      if (this.getters.isLoggedIn() && !this.getters.hasFetchedData()) {
        await store.dispatch("getData", this.getters.getConnection());
      }
    },
    async login({ commit }, connection) {
      const client = createClient(
        connection.webDav, {
        username: connection.userName,
        password: connection.password
      });
      await client.getDirectoryContents("/");
      commit('SET_CONNECTION', connection); // TODO: remove username etc from vuex
      commit('SET_CLIENT', client); // TODO: remove username etc from vuex
      sessionStorage.setItem("webDav", connection.webDav);
      if (connection.userName) {
        sessionStorage.setItem("userName", connection.userName);
      }
      if (connection.password) {
        sessionStorage.setItem("password", connection.password);
      }
      store.dispatch("getData");
    },
    async getData({ commit }) {
      if (store.getters.isLoggedIn()) {
        try {
          const client = store.getters.getClient();
          const content = await client.getFileContents("/votey.json", { format: "text" });
          commit('SET_DATA', { votes: JSON.parse(content) });
        } catch (error) {
          commit('SET_DATA', { votes: [] });
        }
      }
    },
    async sendData({ commit }) {
      const client = store.getters.getClient();
      let data = JSON.stringify(store.getters.getUserVotes());
      await client.putFileContents("/votey.json", data, {
        contentLength: false,
        overwrite: true,
      });
      commit('UNSET_UNSAVEDCHANGES')
    },
    setVote({ commit }, vote) {
      const index = this.state.userVotes.findIndex(e => e.id == vote.id)
      if (vote.answer == Answer.Novote && vote.reasoning == undefined) {
        if (index !== -1) {
          commit('DELETE_VOTE', index);
        } else {
          commit('SET_UNSAVEDCHANGES')
        }
        return;
      } else if (index !== -1) {
        commit('UPDATE_VOTE', { index: index, vote: vote });
      } else {
        commit('ADD_VOTE', vote);
      }
    },
    logout({ commit }) {
      sessionStorage.clear();
      commit('LOGOUT');
      router.push({ path: '/' });
    },
  },
  mutations: {
    SET_DATA(state, payload) {
      state.userVotes = payload.votes;
      state.fetchedData = true;
    },
    SET_CONNECTION(state, payload) {
      state.connection = payload;
    },
    SET_CLIENT(state, client) {
      state.client = client;
    },
    SET_UNSAVEDCHANGES(state) {
      state.unsavedChanges = true;
    },
    UNSET_UNSAVEDCHANGES(state) {
      state.unsavedChanges = false
    },
    UPDATE_VOTE(state, payload) {
      state.userVotes.splice(payload.index, 1, payload.vote)
      state.unsavedChanges = true
    },
    ADD_VOTE(state, vote) {
      state.userVotes = [...state.userVotes, vote];
      state.unsavedChanges = true
    },
    // SET_PERIOD(state, i){
    //   state.period.setFullYear(state.period.getFullYear() + i);
    // },
    DELETE_VOTE(state, index) {
      state.userVotes.splice(index, 1);
      state.unsavedChanges = true
    },
    LOGOUT(state) {
      state.client = undefined;
      state.userVotes = undefined;
      state.connection = undefined;
    },
  },
})

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faDiceThree,
  faCheck,
  faCircle,
  faEye,
  faCog,
  faTimes,
  faQuestion,
  faHandshake,
  faTrophy,
  faEquals,
  faPowerOff,
  faNotEqual,
  faUser,
  faUsers,
  faHandshakeSlash,
  faPlusCircle,
  faEdit,
  faSave,
  faAngleRight,
  faAngleLeft,
  faGripLinesVertical,
  // faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
library.add(faDiceThree)
library.add(faCheck)
library.add(faCircle)
library.add(faEye)
library.add(faCog)
library.add(faTimes)
library.add(faQuestion)
library.add(faHandshake)
library.add(faHandshakeSlash)
library.add(faTrophy)
library.add(faEquals)
library.add(faPowerOff)
library.add(faNotEqual)
library.add(faUser)
library.add(faUsers)
library.add(faPlusCircle)
library.add(faEdit)
library.add(faSave)
library.add(faAngleRight)
library.add(faAngleLeft)
library.add(faGripLinesVertical)
// library.add(faAngleDown)

const routes = [
  {
    path: '/',
    // TODO: compute redirection
    redirect: '/2019_23',
  },
  {
    path: '/:term_hash',
    name: 'home',
    props: true,
    component: App,
    children: [
      {
        path: '',
        name: 'votesTable',
        props: true,
        component: VotesTable,
      }, {
        path: 'categories',
        name: 'votesTableCategory',
        // props: true,
        props: {
          category: true,
        },
        component: VotesTable,
      }, {
        path: ':subject_id',
        name: 'showSubject',
        props: true,
        component: ShowSubject,
        meta: {
          requiresAuth: true,
        },
      }, {
        path: ':subject_id/edit',
        name: 'editSubject',
        props: true,
        component: EditSubject,
        meta: {
          requiresAuth: true,
        },
      }],
  }, {
    path: '/login',
    name: 'login',
    component: Login,
  }, {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
];
const router = new createRouter({
  history: createWebHashHistory(),
  routes
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
