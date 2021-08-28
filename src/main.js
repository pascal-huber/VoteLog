import { createApp } from 'vue'
import { createStore  } from 'vuex'
import { parties, subjects } from './data.js'
import { Answer } from './Answer.js'
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
          axios.get(process.env.API + '/data/' + payload.userId)
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
            axios.post(process.env.VUE_APP_API_URI + '/api/register')
                 .then(response => {
                     commit('SET_USER_ID', response.data.userId)
                     commit('SET_USER_NOTICE')
                     commit('SET_DATA', {
                         votes: []
                     });
                     // storeKey(response.data.userId, payload.aesKey, payload.iv)
                 });
        },
        sendData({ commit }, payload) {
          axios.post(process.env.VUE_APP_API_URI + '/api/data/' + payload.uuid, payload.data )
                 .then(() => {
                     commit('UNSET_UNSAVEDCHANGES')
                 });
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
            commit('LOGOUT');
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
        SET_UNSAVEDCHANGES(state){
            state.unsavedChanges = true
        },
        UNSET_UNSAVEDCHANGES(state){
            state.unsavedChanges = false
        },
        UPDATE_VOTE(state, payload){
            state.votes.splice(payload.index, 1, payload.vote)
            state.unsavedChanges = true
        },
        ADD_VOTE(state, vote){
            state.votes.push(vote)
            state.unsavedChanges = true
        },
        DELETE_VOTE(state, index){
            state.votes.splice(index, 1);
            state.unsavedChanges = true
        },
        LOGOUT(state){
            state.votes = undefined
            state.user = {}
        }
    },
})

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faCheck,
    faCircle,
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
library.add(faCircle)
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
