import { createClient } from "webdav";

import { Answer } from '@/Answer.js'
import router from '@/router.js'

const actions = {
    async init(context) {
        if (!this.getters.isLoggedIn()) {
            let webDav = sessionStorage.getItem("webDav");
            let userName = sessionStorage.getItem("userName");
            let password = sessionStorage.getItem("password");
            if (webDav != "null" && webDav != undefined) {
                await context.dispatch("login", {
                    webDav: webDav,
                    userName: userName,
                    password: password,
                });
            }
        }
        if (this.getters.isLoggedIn() && !this.getters.hasFetchedData()) {
            await context.dispatch("getData", this.getters.getConnection());
        }
    },
    async login(context, connection) {
        const client = createClient(
            connection.webDav, {
            username: connection.userName,
            password: connection.password
        });
        await client.getDirectoryContents("/");
        context.commit('SET_CONNECTION', connection); // TODO: remove username etc from vuex
        context.commit('SET_CLIENT', client); // TODO: remove username etc from vuex
        sessionStorage.setItem("webDav", connection.webDav);
        if (connection.userName) {
            sessionStorage.setItem("userName", connection.userName);
        }
        if (connection.password) {
            sessionStorage.setItem("password", connection.password);
        }
        context.dispatch("getData");
    },
    async getData(context) {
        if (context.getters.isLoggedIn()) {
            try {
                const client = context.getters.getClient();
                const content = await client.getFileContents("/votelog.json", { format: "text" });
                context.commit('SET_DATA', { votes: JSON.parse(content) });
            } catch (error) {
                context.commit('SET_DATA', { votes: [] });
            }
        }
    },
    async sendData(context) {
        const client = context.getters.getClient();
        let data = JSON.stringify(context.getters.getUserVotes());
        await client.putFileContents("/votelog.json", data, {
            contentLength: false,
            overwrite: true,
        });
        context.commit('UNSET_UNSAVEDCHANGES')
    },
    setVote(context, vote) {
        const index = this.state.userVotes.findIndex(e => e.id == vote.id)
        if (vote.answer == Answer.Novote && vote.reasoning == undefined) {
            if (index !== -1) {
                context.commit('DELETE_VOTE', index);
            } else {
                context.commit('SET_UNSAVEDCHANGES')
            }
            return;
        } else if (index !== -1) {
            context.commit('UPDATE_VOTE', { index: index, vote: vote });
        } else {
            context.commit('ADD_VOTE', vote);
        }
    },
    logout(context) {
        sessionStorage.clear();
        context.commit('LOGOUT');
        router.push({ path: '/' });
    },
};

export default actions;