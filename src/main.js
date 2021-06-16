import { createApp } from 'vue'
import { createStore  } from 'vuex'
import App from './App.vue'

const store = createStore({
    state () {
        return {
            count: 0,
            subjects: [
                {id: 0, date: "2021-06-13", name: "Anti-Terror-Gesetz", outcome: true},
                {id: 1, date: "2021-06-13", name: "Trinkwasser-Initiative", outcome: false},
                {id: 2, date: "2021-06-13", name: "Pestizid-Initiative", outcome: false},
                {id: 3, date: "2021-06-13", name: "Covid-Gesetz", outcome: true},
                {id: 4, date: "2021-06-13", name: "CO2-Gesetz", outcome: false},

                {id: 5, date: "2021-03-07", name: "Ja zum Verhüllungsverbot", outcome: true},
                {id: 6, date: "2021-03-07", name: "E-ID Gesetz", outcome: false},
                {id: 7, date: "2021-03-07", name: "Wirtschaftspartnerschaftsabkommen Indonesien", outcome: true},

                {id: 8, date: "2020-09-27", name: "Kinderzulagen", outcome: false},
                {id: 9, date: "2020-09-27", name: "Trinkwasser-Initiative", outcome: false},
                {id: 10, date: "2020-09-27", name: "Pestizid-Initiative", outcome: false},
                {id: 11, date: "2020-09-27", name: "Covid-Gesetz", outcome: true},
                {id: 12, date: "2020-09-27", name: "CO2-Gesetz", outcome: false},
            ],
            parties: [
                {
                    id: 0,
                    name: "SP",
                    votes: [
                        {id: 0, vote: false},
                        {id: 1, vote: true},
                        {id: 2, vote: true},
                        {id: 3, vote: true},
                        {id: 4, vote: true},
                    ]
                },
                {
                    id: 1,
                    name: "SVP",
                    votes: [
                        {id: 0, vote: true},
                        {id: 1, vote: false},
                        {id: 2, vote: false},
                        // {id: 3, vote: }, stimmfreigabe
                        {id: 4, vote: false},
                    ]
                },
            ],
            votes: [
                {id: 0, vote: false},
                {id: 1, vote: true},
                {id: 2, vote: true},
                {id: 3, vote: true},
                {id: 4, vote: true},

                {id: 5, vote: false},
                {id: 6, vote: false},
                {id: 7, vote: true},
            ]
        }
    },
    mutations: {
        increment(state) {
            state.count++
        }
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
} from "@fortawesome/free-solid-svg-icons";
library.add(faCheck)
library.add(faTimes)
library.add(faQuestion)
library.add(faHandshake)
library.add(faTrophy)
library.add(faEquals)
library.add(faNotEqual)
library.add(faUser)
library.add(faUsers)

const app = createApp(App)
app.use(store)
app.mount('#app')
