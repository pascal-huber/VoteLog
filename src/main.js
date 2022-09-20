import { createApp } from 'vue'
import { createStore  } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { parties, subjects } from '@/data.js'
import { Answer } from '@/Answer.js'

import axios from 'axios'
import VueAxios from 'vue-axios'
import {
  signData,
  encryptData,
  loadKeys,
  arrayBufferToHexString,
  hexStringToArrayBuffer,
  deriveKeys,
  decryptData,
  exportKeyToJWK,
  importBaseKey,
  storeKeys
} from './crypto.js'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'
import {mapGetters} from 'vuex';

import App from '@/components/App.vue'
import Agreement from '@/components/Agreement.vue'
import Index from '@/components/Index.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import NotFound from '@/components/NotFound.vue'
import Subject from '@/components/Subject.vue'
import ShowSubject from '@/components/ShowSubject.vue'
import EditSubject from '@/components/EditSubject.vue'

const app = createApp(Index)

const store = createStore({
  state () {
    return {
      user: {
        id: undefined,
      },
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
    getUserId: (state) => () => state.user.id,
    getUserVote: (state) => (subjectId) => state.votes?.find(vote => vote.id === subjectId),
    getError: (state) => () => state.error,
  },
  actions: {
    async init({ commit }) {
      let credentials = await loadKeys();
      if(credentials){
        commit('SET_CREDENTIALS_FULL', {
          userId: credentials.userId,
          salt: credentials.salt,
          encryptionKey: credentials.encryptionKey,
          signingKey: credentials.signingKey,
        });
      }
    },
    async getData({ commit }, payload) {
      try {
        const response = await axios.get(process.env.VUE_APP_API_URI + '/data/' + payload.userId)
        const salt = await hexStringToArrayBuffer(response.data.salt);

        let keys;
        if(payload.password) {
          let baseKey = await importBaseKey(payload.password);
          keys = await deriveKeys(baseKey, salt);
        } else {
          keys = {
            encryptionKey: this.state.user.encryptionKey,
            signingKey: this.state.user.signingKey,
            salt: this.state.user.salt,
          }
        }

        var data = undefined;
        if(response.data.encryptedData){
          data = await decryptData(keys.encryptionKey, response.data.iv, response.data.encryptedData)
        }
        await storeKeys(keys, payload.userId);
        commit('SET_DATA', { votes: data || [] });
        commit('SET_USER', {
          userId: payload.userId,
          encryptionKey: keys.encryptionKey,
          signingKey: keys.signingKey,
          salt: keys.salt,
          signature: response.data.signature,
        });
        router.push({name: 'home'});
      } catch(error){
        console.log("error", error)
        throw new Error(error);
      }
    },
    async register({ commit }, payload) {
      const baseKey = await importBaseKey(payload.password);
      const keys = await deriveKeys(baseKey);
      const signingJWK = await exportKeyToJWK(keys.signingKey);
      const salt = arrayBufferToHexString(keys.salt);
      const data = {
        userId: payload.userId,
        salt: salt,
        signingKey: signingJWK,
      };
      try {
        const response = await axios.post(process.env.VUE_APP_API_URI + '/register', data);
        if(response.data.status == 'error') {
          commit('SET_REGISTER_ERROR', response.data.message);
        } else {
          commit('SET_USER_ID', response.data.userId);
        }
      } catch(error) {
        console.error("error", error);
        throw Error();
      }
    },
    async sendData({ commit }) {
      try {
        const data = await encryptData(store.state.user.encryptionKey, store.state.votes);
        const url = process.env.VUE_APP_API_URI + '/data/' + store.state.user.id;
        const lastSignature = store.state.user.signature;
        const signature = await signData(
          store.state.user.signingKey,
          data.encryptedData, lastSignature
        );
        data.signature = arrayBufferToHexString(signature);
        await axios.post(url, data);
        commit('UNSET_UNSAVEDCHANGES')
        commit('SET_SIGNATURE', data.signature);
      } catch(error){
        console.error("error", error);
      }
    },
    setVote({ commit }, vote) {
      console.log("setVote");
      console.log(JSON.stringify(vote));
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
      // TODO: check if this is secure enough of if the keys remain in memory
      sessionStorage.clear()
      commit('LOGOUT');
    },
  },
  mutations: {
    SET_DATA(state, payload){
      state.votes = payload.votes
    },
    SET_REGISTER_ERROR(state, message){
      state.error = message;
    },
    SET_USER_ID(state, userId){
      state.user.id = userId;
    },
    SET_CREDENTIALS_FULL(state, payload){
      state.user.id = payload.userId;
      state.user.encryptionKey = payload.encryptionKey;
      state.user.signingKey = payload.signingKey;
      state.user.salt = payload.salt;
    },
    SET_CREDENTIALS(state, payload){
      state.user.id = payload.userId;
      state.user.baseKey = payload.baseKey;
    },
    SET_USER(state, payload){
      state.user.id = payload.userId;
      state.user.encryptionKey = payload.encryptionKey;
      state.user.signingKey = payload.signingKey;
      state.user.salt = payload.salt;
      state.user.signature = payload.signature;
    },
    SET_UNSAVEDCHANGES(state){
      state.unsavedChanges = true;
    },
    SET_SIGNATURE(state, signature){
      state.user.signature = signature;
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
      state.user = {}
    },
  },
})

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faDiceThree,
  faCheck,
  faCircle,
  faEye,
  faTimes,
  faQuestion,
  faHandshake,
  faTrophy,
  faEquals,
  faNotEqual,
  faUser,
  faUsers,
  faHandshakeSlash,
  faPlusCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
library.add(faDiceThree)
library.add(faCheck)
library.add(faCircle)
library.add(faEye)
library.add(faTimes)
library.add(faQuestion)
library.add(faHandshake)
library.add(faHandshakeSlash)
library.add(faTrophy)
library.add(faEquals)
library.add(faNotEqual)
library.add(faUser)
library.add(faUsers)
library.add(faPlusCircle)
library.add(faEdit)

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
      },{
        path: 'edit',
        name: 'editSubject',
        component: EditSubject,
      },
    ],
  },{
    path: '/:subjectId/edit',
    name: 'editVote',
    component: App,
    props: true,
  },{
    path: '/agreement',
    name: 'agreement',
    component: Agreement,
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

app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')
