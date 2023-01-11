import { createApp } from 'vue'
import { createStore  } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { parties, subjects } from '@/data.js'
import { Answer } from '@/Answer.js'

import { createClient } from "webdav";
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'
import {mapGetters} from 'vuex';

import App from '@/components/App.vue'
import Agreement from '@/components/Agreement.vue'
import Index from '@/components/Index.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import NotFound from '@/components/NotFound.vue'
import Settings from '@/components/Settings.vue'
import Subject from '@/components/Subject.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'

const app = createApp(Index)

const store = createStore({
  state () {
    return {
      connection: undefined,
      subjects: subjects,
      parties: parties,
      unsavedChanges: false,
      votes: [],
    }
  },
  computed: {
    // TODO: add more mapGetters
    ...mapGetters(['getUserVote'])
  },
  getters: {
    getSubjectByHash: (state) => (hash) => state.subjects.find(subject => subject.hash == hash),
    getSubjectById: (state) => (subjectId) => state.subjects.find(subject => subject.id == subjectId),
    getConnection: (state) => () => state.connection,
    isLoggedIn: (state) => () => !!state.connection?.webDav,
    fetchedData: (state) => () => state.fetchedData,
    unsavedChanges: (state) => () => state.unsavedChanges,
    getUserVotes: (state) => () => state.votes,
    getUserVote: (state) => (subjectId) => state.votes?.find(vote => vote.id === subjectId),
    getError: (state) => () => state.error,
  },
  actions: {
    async init({ commit }) {
      if(!this.getters.isLoggedIn()){
        let webDav = sessionStorage.getItem("webDav");
        if(webDav != "null"){
          commit('SET_CONNECTION', {
            webDav: webDav,
            userName: sessionStorage.getItem("webDav"),
            password: sessionStorage.getItem("password")
          });
      }
      }
      if(this.getters.isLoggedIn() && !this.getters.getUserVotes()){
          this.store.dispatch("getData", this.getters.getConnection());
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
        let connection = store.getters.getConnection();
        try {
          console.log(connection);
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
        let connection = store.getters.getConnection();
        console.log(connection);
        const client = createClient(
          connection.webDav, {
            username: connection.userName,
            password: connection.password 
          }
        );
        let data = JSON.stringify(store.getters.getUserVotes());
        await client.putFileContents("/votey.json", data, { overwrite: true });
        commit('UNSET_UNSAVEDCHANGES')
      } catch(error) {
        console.error("error", error);
        throw Error();
      }
    },
    setVote({ commit }, vote) {
      const index = this.state.votes.findIndex(e => e.id == vote.id)

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
    logout({ commit }) {
      sessionStorage.clear();
      commit('LOGOUT');
      router.push({name: 'home'});
    },
  },
  mutations: {
    SET_DATA(state, payload){
      state.votes = payload.votes;
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
      state.votes.splice(payload.index, 1, payload.vote)
      state.unsavedChanges = true
    },
    ADD_VOTE(state, vote){
      state.votes = [...state.votes, vote];
      state.unsavedChanges = true
    },
    DELETE_VOTE(state, index){
      state.votes.splice(index, 1);
      state.unsavedChanges = true
    },
    LOGOUT(state){
      state.votes = undefined;
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

const routes = [
  {
    path: '/',
    name: 'home',
    component: App,
  },{
    path: '/:hash',
    name: 'Subject',
    component: Subject,
    props: true,
    children: [
      {
        path: '',
        name: 'showSubject',
        component: ShowSubject,
        meta: {
          requiresAuth: true,
        }
      },{
        path: 'edit',
        name: 'editSubject',
        component: EditSubject,
        meta: {
          requiresAuth: true,
        }
      },
    ],
  },{
    path: '/:subjectId/edit',
    name: 'editVote',
    component: App,
    props: true,
    meta: {
      requiresAuth: true,
    }
  },{
    path: '/agreement',
    name: 'agreement',
    component: Agreement,
    meta: {
      requiresAuth: true,
    }
  },{
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    }
  },{
    path: '/login',
    name: 'login',
    component: Login,
  },{
    path: '/register',
    name: 'register',
    component: Register,
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
app.mount('#app')
