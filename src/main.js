import { createApp } from 'vue'
import { createStore  } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { terms } from '@/data.js'
import { Answer } from '@/Answer.js'

import { createClient } from "webdav";
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'

// TODO: what is this?
// import {mapGetters} from 'vuex';

import App from '@/components/App.vue'
import Agreement from '@/components/Agreement.vue'
import Index from '@/components/Index.vue'
import Login from '@/components/Login.vue'
import NotFound from '@/components/NotFound.vue'
// import Subject from '@/components/Subject.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'

const app = createApp(Index)

const store = createStore({
  state () {
    return {
      connection: undefined,
      error: undefined,
      fetchedData: false,
      userVotes: undefined,
      unsavedChanges: false,
      terms: terms,
    }
  },
  computed: {
    // TODO: add more mapGetters (why?)
    // ...mapGetters(['getUserVote']),
  },
  getters: {
    // TODO: support multiple legislation periods
    getSubjectByHash: (state) => (term_hash, subject_id) => {
      // TODO: catch inexistent term
      let term = state.terms.find((term) => term.hash == term_hash);
      let subject = term.subjects.find((subject) => subject.id == subject_id);
      return subject;
    },
    getSubjectById: (state) => (subjectId) => state.votes[2].find(subject => subject.id == subjectId),
    // TODO: return the rhight subjects
    getSubjectsForPeriod: (state) => () => state.terms[2].subjects,
    getTerm: (state) => (term_hash) => state.terms.find(
      // TODO: compute defaultTermHash
      term => term.hash == (term_hash || "2019_23")
    ),
    hasFetchedData: (state) => () => state.fetchedData,
    getNextTermHash: (state) => (term_id) => state.terms.find(term => term.id == term_id + 1)?.hash,
    getPrevTermHash: (state) => (term_id) => state.terms.find(term => term.id == term_id - 1)?.hash,
    getConnection: (state) => () => state.connection,
    isLoggedIn: (state) => () => state.connection?.webDav,
    fetchedData: (state) => () => state.fetchedData,
    getTermHash: (state) => () => state.votes[2].hash,
    unsavedChanges: (state) => () => state.unsavedChanges,
    getUserVotes: (state) => () => state.userVotes,
    getUserVote: (state) => (subjectId) => state.userVotes?.find(vote => vote.id == subjectId),
    getError: (state) => () => state.error,
  },
  actions: {
    async init({ commit }) {
      if(!this.getters.isLoggedIn()){
        let webDav = sessionStorage.getItem("webDav");
        if(webDav != "null"){
          commit('SET_CONNECTION', {
            webDav: webDav,
            userName: sessionStorage.getItem("userName"),
            password: sessionStorage.getItem("password")
          });
      }
      }
      if(this.getters.isLoggedIn() && !this.getters.hasFetchedData()){
          store.dispatch("getData", this.getters.getConnection());
      }
    },
    async login({ commit }, payload) {
        commit('SET_CONNECTION', payload);    
        sessionStorage.setItem("webDav", payload.webDav);
        sessionStorage.setItem("userName", payload.userName);
        sessionStorage.setItem("password", payload.password);
    },
    async getData({ commit }) {
      // FIXME: handle wrong credentials / failed login
      if(store.getters.isLoggedIn()){
        let connection = await store.getters.getConnection();
        try {
          const client = createClient(
            connection.webDav, {
              username: connection.userName,
              password: connection.password
            }
          );
          const content = await client.getFileContents("/votey.json", {format: "text"});
          commit('SET_DATA', { votes: JSON.parse(content) });
        } catch(error) {
          commit('SET_DATA', { votes: [] });
        }
        router.push({name: 'home'});
      }
    },
    async sendData({ commit }) {
      try {
        let connection = await store.getters.getConnection();
        const client = createClient(
          connection.webDav, {
            username: connection.userName,
            password: connection.password 
          }
        );
        let data = JSON.stringify(store.getters.getUserVotes());
        await client.putFileContents("/votey.json", data, { 
          contentLength: false,
          overwrite: true,
        });
        commit('UNSET_UNSAVEDCHANGES')
      } catch(error) {
        console.error("error", error);
        throw Error();
      }
    },
    setVote({ commit }, vote) {
      const index = this.state.userVotes.findIndex(e => e.id == vote.id)

      if(vote.answer == Answer.Novote && vote.reasoning == undefined){
        if(index !== -1){
          commit('DELETE_VOTE', index);
        } else {
          commit('SET_UNSAVEDCHANGES')
        }
        return;
      } else if(index !== -1) {
        commit('UPDATE_VOTE', {index: index, vote: vote});
      } else {
        commit('ADD_VOTE', vote);
      }
    },
    // changePeriod({ commit }, amount) {
    //   // TODO: this is a bit silly
    //   commit('CHANGE_PERIOD', amount*4);
    // },
    logout({ commit }) {
      sessionStorage.clear();
      commit('LOGOUT');
      router.push({name: 'home'});
    },
  },
  mutations: {
    SET_DATA(state, payload){
      state.userVotes = payload.votes;
      state.fetchedData = true;
    },
    SET_CONNECTION(state, payload){
      state.connection = payload;
    },
    SET_UNSAVEDCHANGES(state){
      state.unsavedChanges = true;
    },
    UNSET_UNSAVEDCHANGES(state){
      state.unsavedChanges = false
    },
    UPDATE_VOTE(state, payload){
      state.userVotes.splice(payload.index, 1, payload.vote)
      state.unsavedChanges = true
    },
    ADD_VOTE(state, vote){
      state.userVotes = [...state.userVotes, vote];
      state.unsavedChanges = true
    },
    // SET_PERIOD(state, i){
    //   state.period.setFullYear(state.period.getFullYear() + i);
    // },
    DELETE_VOTE(state, index){
      state.userVotes.splice(index, 1);
      state.unsavedChanges = true
    },
    LOGOUT(state){
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

const routes = [
  {
    path: '/:term_hash?',
    name: 'home',
    props: true,
    component: App,
    // children: [],
    // meta: {
    //   requiresData: true,
    // }
  },{
        path: '/:term_hash/:subject_id',
        name: 'showSubject',
        props: true,
        component: ShowSubject,
        meta: {
          requiresAuth: true,
          // requiresData: true,
        }
  },{
        path: '/:term_hash/:subject_id/edit',
        name: 'editSubject',
        props: true,
        component: EditSubject,
        meta: {
          requiresAuth: true,
          // requiresData: true,
        }
      // },
  // },{
  //   path: '/subject/:hash',
  //   name: 'Subject',
  //   component: Subject,
  //   props: true,
  //   children: [
  //     {
  //       path: '',
  //       name: 'showSubject',
  //       component: ShowSubject,
  //       meta: {
  //         requiresAuth: true,
  //       }
  //     },{
  //       path: 'edit',
  //       name: 'editSubject',
  //       component: EditSubject,
  //       meta: {
  //         requiresAuth: true,
  //       }
  //     },
  //   ],
  // },{
  //   path: '/:subjectId/edit',
  //   name: 'editVote',
  //   component: App,
  //   props: true,
  //   meta: {
  //     requiresAuth: true,
  //   }
  },{
    path: '/agreement',
    name: 'agreement',
    component: Agreement,
    meta: {
      requiresAuth: true,
      // requiresData: true,
    }
  },{
    path: '/login',
    name: 'login',
    component: Login,
  },{
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
];
const router = new createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // TODO: this is kinda ugly
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn()){
    store.dispatch("init");
    // console.log("init end, -> " + next);
  }
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn()){
    next({ name: 'login' })
  } else {
    next()
  }
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
router.app = app;
app.mount('#app')
