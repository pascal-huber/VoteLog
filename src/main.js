import { createApp } from 'vue'
import { createStore  } from 'vuex'
import { parties, subjects } from './data.js'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { decryptData } from './crypto.js'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'


const store = createStore({
    state () {
        return {
            user: {
                id: undefined,
                aesKey: undefined
            },
            subjects: subjects,
            parties: parties,
            unsavedChanges: false,
            votes: undefined
        }
    },
    actions: {
        getData({ commit }, payload) {
            axios.get('http://127.0.0.1:3000/data/' + payload.userId)
                 .then(response => {
                     if(response.data.encryptedData != undefined){
                         decryptData(payload.aesKey, response.data.iv, response.data.encryptedData)
                             .then((decryptedPayload) => {
                                 commit('SET_USER_ID', payload.userId);
                                 commit('SET_DATA', {
                                     votes: decryptedPayload
                                 });
                             });
                     } else {
                         commit('SET_USER_ID', payload.userId);
                         commit('SET_DATA', {
                             votes: []
                         });
                     }
                 });
        },
        register({ commit }) {
            axios.post('http://127.0.0.1:3000/register')
                 .then(response => {
                     commit('SET_USER_ID', response.data.userId)
                     commit('SET_USER_NOTICE')
                     commit('SET_DATA', {
                         votes: []
                     });
                 });
        },
        sendData({ commit }, payload) {
            axios.post('http://127.0.0.1:3000/data/' + payload.uuid, payload.data )
                 .then(() => {
                     commit('SET_UNSAVEDCHANGES')
                 });
        },
    },
    mutations: {
        SET_DATA(state, payload){
            state.votes = payload.votes
        },
        SET_USER_ID(state, userId){
            state.user.id = userId
            state.user.loggedIn = true
        },
        SET_USER_NOTICE(state){
            state.user.notice = true
        },
        UNSET_UNSAVEDCHANGES(state){
            state.unsavedChanges = false
        },
    },
})

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faCheck,
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
library.add(faCheck)
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

const app = createApp(App)
app.use(VueAxios, axios)
app.use(store)
app.mount('#app')
